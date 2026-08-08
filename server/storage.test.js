import test from "node:test";
import assert from "node:assert/strict";
import { after, before } from "node:test";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  appendReading,
  clearReadings,
  loadCalibration,
  loadReadings,
  saveCalibration
} from "./storage.js";

let tempDir;

before(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bitebud-storage-"));
});

after(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

test("appends readings and loads them back in order", async () => {
  for (let index = 0; index < 5; index += 1) {
    await appendReading({ timestamp: 1000 + index * 100, raw: index * 10, sensorId: "front" }, tempDir);
  }

  const readings = await loadReadings({ dataDir: tempDir });
  assert.equal(readings.length, 5);
  assert.equal(readings[0].raw, 0);
  assert.equal(readings.at(-1).raw, 40);
});

test("loadReadings honors limit from the end", async () => {
  const readings = await loadReadings({ dataDir: tempDir, limit: 2 });
  assert.deepEqual(
    readings.map((reading) => reading.raw),
    [30, 40]
  );
});

test("clearReadings empties the file", async () => {
  await clearReadings(tempDir);
  assert.deepEqual(await loadReadings({ dataDir: tempDir }), []);
});

test("loadReadings returns an empty list when no file exists", async () => {
  assert.deepEqual(await loadReadings({ dataDir: path.join(tempDir, "nonexistent") }), []);
});

test("skips corrupt lines instead of failing", async () => {
  const dir = path.join(tempDir, "corrupt");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "readings.jsonl"), "{bad}\n{\"timestamp\":5,\"raw\":1}\nnot json\n", "utf8");

  const readings = await loadReadings({ dataDir: dir });
  assert.equal(readings.length, 1);
  assert.equal(readings[0].raw, 1);
});

test("saves and loads calibration", async () => {
  const calibration = { baselineRaw: 10, maxRaw: 4000, activeThreshold: 25 };
  await saveCalibration(calibration, tempDir);
  assert.deepEqual(await loadCalibration(tempDir), calibration);
});

test("loadCalibration returns null when no file exists", async () => {
  assert.equal(await loadCalibration(path.join(tempDir, "nonexistent")), null);
});
