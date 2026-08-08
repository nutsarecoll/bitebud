import test from "node:test";
import assert from "node:assert/strict";
import { createSensorState, ingestReading, summarizeSession, updateCalibration } from "./sensorEngine.js";

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
