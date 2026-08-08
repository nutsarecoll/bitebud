import test from "node:test";
import assert from "node:assert/strict";
import {
  createSensorState,
  ingestReading,
  resetSessionState,
  summarizeSession,
  updateCalibration
} from "./sensorEngine.js";

test("counts a stable press event and records duration", () => {
  const state = createSensorState(0);
  updateCalibration(state, { baselineRaw: 0, maxRaw: 1000, activeThreshold: 20, releaseThreshold: 10 });

  ingestReading(state, { raw: 350, timestamp: 0 }, 0);
  ingestReading(state, { raw: 350, timestamp: 120 }, 120);
  ingestReading(state, { raw: 400, timestamp: 220 }, 220);
  ingestReading(state, { raw: 20, timestamp: 300 }, 300);
  ingestReading(state, { raw: 20, timestamp: 470 }, 470);

  const summary = summarizeSession(state, 500);
  assert.equal(summary.totalEvents, 1);
  assert.equal(summary.activeEvents, 0);
  assert.ok(summary.averageDurationMs >= 450);
});

test("ignores quick spikes shorter than debounce window", () => {
  const state = createSensorState(0);
  updateCalibration(state, { baselineRaw: 0, maxRaw: 1000, activeThreshold: 20, releaseThreshold: 10 });

  ingestReading(state, { raw: 350, timestamp: 0 }, 0);
  ingestReading(state, { raw: 30, timestamp: 80 }, 80);
  ingestReading(state, { raw: 30, timestamp: 260 }, 260);

  assert.equal(summarizeSession(state, 300).totalEvents, 0);
});

test("uses the configured activation debounce window", () => {
  const state = createSensorState(0);
  updateCalibration(state, {
    baselineRaw: 0,
    maxRaw: 1000,
    activeThreshold: 20,
    releaseThreshold: 10,
    activeMs: 300
  });

  ingestReading(state, { raw: 350, timestamp: 0 }, 0);
  ingestReading(state, { raw: 350, timestamp: 200 }, 200);
  assert.equal(summarizeSession(state, 250).totalEvents, 0);

  ingestReading(state, { raw: 350, timestamp: 320 }, 320);
  ingestReading(state, { raw: 20, timestamp: 400 }, 400);
  ingestReading(state, { raw: 20, timestamp: 560 }, 560);

  const summary = summarizeSession(state, 600);
  assert.equal(summary.totalEvents, 1);
  assert.equal(state.events[0].startedAt, 0);
});

test("uses the configured release debounce window", () => {
  const state = createSensorState(0);
  updateCalibration(state, {
    baselineRaw: 0,
    maxRaw: 1000,
    activeThreshold: 20,
    releaseThreshold: 10,
    releaseMs: 400
  });

  ingestReading(state, { raw: 350, timestamp: 0 }, 0);
  ingestReading(state, { raw: 350, timestamp: 120 }, 120);
  ingestReading(state, { raw: 20, timestamp: 200 }, 200);
  ingestReading(state, { raw: 20, timestamp: 500 }, 500);
  assert.equal(summarizeSession(state, 550).activeEvents, 1);

  ingestReading(state, { raw: 20, timestamp: 650 }, 650);
  const summary = summarizeSession(state, 700);
  assert.equal(summary.activeEvents, 0);
  assert.equal(summary.totalEvents, 1);
});

test("resets event state when readings have a large gap", () => {
  const state = createSensorState(0);
  updateCalibration(state, {
    baselineRaw: 0,
    maxRaw: 1000,
    activeThreshold: 20,
    releaseThreshold: 10,
    gapResetMs: 2000
  });

  ingestReading(state, { raw: 350, timestamp: 0 }, 0);
  ingestReading(state, { raw: 350, timestamp: 120 }, 120);
  ingestReading(state, { raw: 350, timestamp: 3000 }, 3000);
  ingestReading(state, { raw: 350, timestamp: 3120 }, 3120);

  const summary = summarizeSession(state, 3200);
  assert.equal(state.events.length, 2);
  assert.equal(state.events[0].endedAt, 3000);
  assert.equal(summary.totalEvents, 1);
  assert.equal(summary.activeEvents, 1);
});

test("clamps debounce and gap calibration values", () => {
  const state = createSensorState(0);
  const calibration = updateCalibration(state, { activeMs: -5, releaseMs: 9999, gapResetMs: -1 });
  assert.equal(calibration.activeMs, 0);
  assert.equal(calibration.releaseMs, 2000);
  assert.equal(calibration.gapResetMs, 0);
});

test("reset clears readings and events but keeps calibration", () => {
  const state = createSensorState(0);
  updateCalibration(state, { baselineRaw: 0, maxRaw: 1000, activeThreshold: 20, releaseThreshold: 10 });

  ingestReading(state, { raw: 350, timestamp: 0 }, 0);
  ingestReading(state, { raw: 350, timestamp: 120 }, 120);
  resetSessionState(state);

  assert.equal(state.readings.length, 0);
  assert.equal(state.events.length, 0);
  assert.equal(state.sensors.front.latest, null);
  assert.equal(state.calibration.activeThreshold, 20);
});
