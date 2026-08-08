import express from "express";
import {
  ZONES,
  createSensorState,
  ingestReading,
  resetSessionState,
  summarizeSession,
  updateCalibration
} from "./sensorEngine.js";
import {
  appendReading,
  clearReadings,
  ensureDataDir,
  loadCalibration,
  loadReadings,
  saveCalibration
} from "./storage.js";

const app = express();
const port = Number(process.env.BITEBUD_SERVER_PORT || 8787);
const state = createSensorState();
const clients = new Set();
let mockTimer = null;
let mockPhase = 0;

app.use(express.json({ limit: "128kb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    zones: ZONES,
    mockRunning: Boolean(mockTimer),
    summary: summarizeSession(state)
  });
});

app.get("/api/readings", (_req, res) => {
  res.json({
    readings: state.readings.slice(-600),
    summary: summarizeSession(state)
  });
});

app.get("/api/readings/history", async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 3600, 1), 100000);
  const readings = await loadReadings({ limit });
  res.json({ readings, summary: summarizeSession(state) });
});

app.post("/api/readings", async (req, res) => {
  const reading = ingestReading(state, req.body);
  await appendReading(reading);
  broadcast({ type: "reading", reading, summary: summarizeSession(state) });
  res.status(201).json({ reading, summary: summarizeSession(state) });
});

app.get("/api/readings/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive"
  });
  res.write(`event: snapshot\ndata: ${JSON.stringify({ readings: state.readings.slice(-120), summary: summarizeSession(state) })}\n\n`);
  clients.add(res);
  req.on("close", () => clients.delete(res));
});

app.post("/api/calibration", async (req, res) => {
  const calibration = updateCalibration(state, req.body || {});
  await saveCalibration(calibration);
  const summary = summarizeSession(state);
  broadcast({ type: "calibration", calibration, summary });
  res.json({ calibration, summary });
});

app.get("/api/session-summary", (_req, res) => {
  res.json(summarizeSession(state));
});

app.post("/api/mock/start", (_req, res) => {
  startMockData();
  res.json({ mockRunning: true });
});

app.post("/api/mock/stop", (_req, res) => {
  stopMockData();
  res.json({ mockRunning: false });
});

app.post("/api/session/reset", async (_req, res) => {
  resetSessionState(state);
  await clearReadings();
  broadcast({ type: "reset", summary: summarizeSession(state) });
  res.json({ ok: true, summary: summarizeSession(state) });
});

function broadcast(payload) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of clients) client.write(message);
}

function startMockData() {
  if (mockTimer) return;
  mockTimer = setInterval(async () => {
    mockPhase += 1;
    const now = Date.now();
    const wave = Math.sin(mockPhase / 6);
    const burst = mockPhase % 90 > 16 && mockPhase % 90 < 58;
    const tap = mockPhase % 18 < 7;
    const base = 52 + Math.round(Math.random() * 20);
    const raw = burst && tap ? 950 + Math.round((wave + 1) * 980 + Math.random() * 320) : base;
    const reading = ingestReading(state, {
      deviceId: "bitebud-mock-01",
      sensorId: "front",
      raw,
      timestamp: now
    }, now);
    await appendReading(reading);
    broadcast({ type: "reading", reading, summary: summarizeSession(state, now) });
  }, 100);
}

function stopMockData() {
  if (!mockTimer) return;
  clearInterval(mockTimer);
  mockTimer = null;
}

async function main() {
  await ensureDataDir();

  const savedCalibration = await loadCalibration();
  if (savedCalibration) {
    const defaults = createSensorState().calibration;
    state.calibration = {
      ...defaults,
      ...savedCalibration,
      forcePoints:
        Array.isArray(savedCalibration.forcePoints) && savedCalibration.forcePoints.length >= 2
          ? savedCalibration.forcePoints
          : defaults.forcePoints
    };
    console.log("[storage] restored saved calibration");
  }

  const savedReadings = await loadReadings({ limit: 3000 });
  for (const reading of savedReadings) {
    ingestReading(state, reading, reading.timestamp);
  }
  if (savedReadings.length) {
    console.log(`[storage] restored ${savedReadings.length} readings from disk`);
  }

  app.listen(port, () => {
    console.log(`BiteBud sensor server listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("BiteBud sensor server failed to start:", error);
  process.exit(1);
});
