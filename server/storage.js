import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function resolveDataDir() {
  return process.env.BITEBUD_DATA_DIR || path.join(REPO_ROOT, "data");
}

function readingsFile(dataDir) {
  return path.join(dataDir, "readings.jsonl");
}

function calibrationFile(dataDir) {
  return path.join(dataDir, "calibration.json");
}

export async function ensureDataDir(dataDir = resolveDataDir()) {
  await fs.mkdir(dataDir, { recursive: true });
  return dataDir;
}

// Serialize writes so concurrent appends never interleave partial lines.
let writeQueue = Promise.resolve();

export function appendReading(reading, dataDir = resolveDataDir()) {
  const line = `${JSON.stringify(reading)}\n`;
  writeQueue = writeQueue
    .then(() => fs.appendFile(readingsFile(dataDir), line, "utf8"))
    .catch((error) => console.error("[storage] failed to append reading:", error));
  return writeQueue;
}

export async function loadReadings({ limit = 3600, dataDir = resolveDataDir() } = {}) {
  let content;
  try {
    content = await fs.readFile(readingsFile(dataDir), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const readings = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const reading = JSON.parse(trimmed);
      if (reading && Number.isFinite(reading.timestamp)) readings.push(reading);
    } catch {
      // Skip corrupt lines instead of failing the whole history.
    }
  }

  return limit > 0 ? readings.slice(-limit) : readings;
}

export function clearReadings(dataDir = resolveDataDir()) {
  writeQueue = writeQueue.then(() => fs.writeFile(readingsFile(dataDir), "", "utf8"));
  return writeQueue;
}

export async function saveCalibration(calibration, dataDir = resolveDataDir()) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(calibrationFile(dataDir), `${JSON.stringify(calibration, null, 2)}\n`, "utf8");
}

export async function loadCalibration(dataDir = resolveDataDir()) {
  try {
    const content = await fs.readFile(calibrationFile(dataDir), "utf8");
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
