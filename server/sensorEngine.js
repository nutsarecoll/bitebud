export const ZONES = ["front", "left", "right", "back"];

const DEFAULT_CALIBRATION = {
  baselineRaw: 0,
  maxRaw: 4095,
  forcePoints: [
    { raw: 0, forceLb: 0 },
    { raw: 4095, forceLb: 25 }
  ],
  activeThreshold: 18,
  releaseThreshold: 12,
  activeMs: 100,
  releaseMs: 150,
  gapResetMs: 2000
};

export function createSensorState(now = Date.now()) {
  return {
    calibration: { ...DEFAULT_CALIBRATION, forcePoints: [...DEFAULT_CALIBRATION.forcePoints] },
    readings: [],
    events: [],
    sensors: Object.fromEntries(
      ZONES.map((zone) => [
        zone,
        {
          sensorId: zone,
          status: zone === "front" ? "ready" : "planned",
          latest: null,
          eventState: {
            pressed: false,
            pendingStartAt: null,
            belowSince: null,
            currentEvent: null,
            lastAt: null
          }
        }
      ])
    ),
    lastDeviceSeenAt: null,
    serverStartedAt: now
  };
}

export function updateCalibration(state, patch) {
  const next = { ...state.calibration };

  if (Number.isFinite(patch.baselineRaw)) next.baselineRaw = clamp(patch.baselineRaw, 0, 4095);
  if (Number.isFinite(patch.maxRaw)) next.maxRaw = clamp(patch.maxRaw, next.baselineRaw + 1, 4095);
  if (Number.isFinite(patch.activeThreshold)) next.activeThreshold = clamp(patch.activeThreshold, 1, 100);
  if (Number.isFinite(patch.releaseThreshold)) {
    next.releaseThreshold = clamp(patch.releaseThreshold, 0, next.activeThreshold - 1);
  }
  if (Number.isFinite(patch.activeMs)) next.activeMs = clamp(patch.activeMs, 0, 2000);
  if (Number.isFinite(patch.releaseMs)) next.releaseMs = clamp(patch.releaseMs, 0, 2000);
  if (Number.isFinite(patch.gapResetMs)) next.gapResetMs = clamp(patch.gapResetMs, 0, 60000);

  if (Array.isArray(patch.forcePoints)) {
    const points = patch.forcePoints
      .map((point) => ({
        raw: Number(point.raw),
        forceLb: Number(point.forceLb)
      }))
      .filter((point) => Number.isFinite(point.raw) && Number.isFinite(point.forceLb))
      .sort((a, b) => a.raw - b.raw);

    if (points.length >= 2) next.forcePoints = points;
  }

  state.calibration = next;
  return next;
}

export function ingestReading(state, input, now = Date.now()) {
  const sensorId = ZONES.includes(input.sensorId) ? input.sensorId : "front";
  const raw = clamp(Number(input.raw ?? input.value ?? 0), 0, 4095);
  const voltage = Number.isFinite(Number(input.voltage)) ? Number(input.voltage) : round((raw / 4095) * 3.3, 3);
  const normalized = Number.isFinite(Number(input.normalized))
    ? clamp(Number(input.normalized), 0, 100)
    : rawToNormalized(raw, state.calibration);
  const forceLb = Number.isFinite(Number(input.forceLb))
    ? Math.max(0, Number(input.forceLb))
    : rawToForce(raw, state.calibration);
  const pressed = normalized >= state.calibration.activeThreshold;
  const level = pressureLevel(normalized, pressed);
  const timestamp = Number.isFinite(Number(input.timestamp)) ? Number(input.timestamp) : now;

  const sensor = state.sensors[sensorId];
  sensor.status = "active";
  state.lastDeviceSeenAt = now;

  const eventState = sensor.eventState;
  if (eventState.lastAt !== null && timestamp - eventState.lastAt > state.calibration.gapResetMs) {
    forceCloseEvent(sensor, timestamp);
  }
  eventState.lastAt = timestamp;

  const eventId = updateEventState(sensor, normalized, timestamp, state.calibration, state.events);

  const reading = {
    deviceId: String(input.deviceId || "bitebud-proto-01"),
    sensorId,
    raw,
    voltage,
    normalized: round(normalized, 1),
    forceLb: round(forceLb, 2),
    pressed: Boolean(sensor.eventState.pressed || pressed),
    level,
    eventId,
    timestamp
  };

  sensor.latest = reading;
  state.readings.push(reading);
  trimReadings(state, timestamp);

  return reading;
}

export function summarizeSession(state, now = Date.now()) {
  const completedEvents = state.events.filter((event) => Number.isFinite(event.endedAt));
  const durations = completedEvents.map((event) => event.durationMs);
  const peaks = completedEvents.map((event) => event.peakNormalized);
  const activeWindowMs = 60_000;
  const recentEvents = completedEvents.filter((event) => event.startedAt >= now - activeWindowMs);

  return {
    deviceConnected: Boolean(state.lastDeviceSeenAt && now - state.lastDeviceSeenAt < 5000),
    totalEvents: completedEvents.length,
    activeEvents: Object.values(state.sensors).filter((sensor) => sensor.eventState.pressed).length,
    averageDurationMs: round(avg(durations), 0),
    averagePeakNormalized: round(avg(peaks), 1),
    pressesPerMinute: recentEvents.length,
    latestBySensor: Object.fromEntries(ZONES.map((zone) => [zone, state.sensors[zone].latest])),
    calibration: state.calibration,
    uptimeMs: now - state.serverStartedAt
  };
}

export function resetSessionState(state) {
  state.readings.length = 0;
  state.events.length = 0;
  for (const sensor of Object.values(state.sensors)) {
    sensor.latest = null;
    sensor.eventState = {
      pressed: false,
      pendingStartAt: null,
      belowSince: null,
      currentEvent: null,
      lastAt: null
    };
  }
  state.lastDeviceSeenAt = null;
  return state;
}

function forceCloseEvent(sensor, timestamp) {
  const eventState = sensor.eventState;
  const currentEvent = eventState.currentEvent;
  if (currentEvent && !Number.isFinite(currentEvent.endedAt)) {
    currentEvent.endedAt = timestamp;
    currentEvent.durationMs = timestamp - currentEvent.startedAt;
  }
  eventState.pressed = false;
  eventState.currentEvent = null;
  eventState.pendingStartAt = null;
  eventState.belowSince = null;
}

function updateEventState(sensor, normalized, timestamp, calibration, events) {
  const eventState = sensor.eventState;
  const active = normalized >= calibration.activeThreshold;
  const released = normalized <= calibration.releaseThreshold;

  if (!eventState.pressed) {
    if (active) {
      eventState.pendingStartAt ??= timestamp;
      if (timestamp - eventState.pendingStartAt >= calibration.activeMs) {
        const event = {
          id: `evt_${String(events.length + 1).padStart(4, "0")}`,
          sensorId: sensor.sensorId,
          startedAt: eventState.pendingStartAt,
          endedAt: null,
          durationMs: null,
          peakNormalized: normalized,
          averageNormalized: normalized,
          sampleCount: 1,
          totalNormalized: normalized
        };
        events.push(event);
        eventState.currentEvent = event;
        eventState.pressed = true;
        eventState.belowSince = null;
        return event.id;
      }
    } else {
      eventState.pendingStartAt = null;
    }
    return null;
  }

  const currentEvent = eventState.currentEvent;
  if (currentEvent) {
    currentEvent.peakNormalized = Math.max(currentEvent.peakNormalized, normalized);
    currentEvent.totalNormalized += normalized;
    currentEvent.sampleCount += 1;
    currentEvent.averageNormalized = round(currentEvent.totalNormalized / currentEvent.sampleCount, 1);
  }

  if (released) {
    eventState.belowSince ??= timestamp;
    if (timestamp - eventState.belowSince >= calibration.releaseMs) {
      if (currentEvent) {
        currentEvent.endedAt = timestamp;
        currentEvent.durationMs = timestamp - currentEvent.startedAt;
      }
      eventState.pressed = false;
      eventState.currentEvent = null;
      eventState.pendingStartAt = null;
      eventState.belowSince = null;
      return currentEvent?.id ?? null;
    }
  } else {
    eventState.belowSince = null;
  }

  return currentEvent?.id ?? null;
}

function rawToNormalized(raw, calibration) {
  const span = Math.max(1, calibration.maxRaw - calibration.baselineRaw);
  return clamp(((raw - calibration.baselineRaw) / span) * 100, 0, 100);
}

function rawToForce(raw, calibration) {
  const points = calibration.forcePoints;
  if (!points.length) return 0;
  if (raw <= points[0].raw) return points[0].forceLb;

  for (let index = 1; index < points.length; index += 1) {
    const left = points[index - 1];
    const right = points[index];
    if (raw <= right.raw) {
      const t = (raw - left.raw) / Math.max(1, right.raw - left.raw);
      return left.forceLb + t * (right.forceLb - left.forceLb);
    }
  }

  return points[points.length - 1].forceLb;
}

function pressureLevel(normalized, pressed) {
  if (!pressed) return "no pressure";
  if (normalized < 35) return "light";
  if (normalized < 70) return "medium";
  return "strong";
}

function trimReadings(state, timestamp) {
  const cutoff = timestamp - 5 * 60_000;
  while (state.readings.length && state.readings[0].timestamp < cutoff) state.readings.shift();
  if (state.readings.length > 3000) state.readings.splice(0, state.readings.length - 3000);
}

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function round(value, places) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
