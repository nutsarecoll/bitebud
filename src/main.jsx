import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const ZONES = ["front", "left", "right", "back"];
const API = "";

function App() {
  const [readings, setReadings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [mockRunning, setMockRunning] = useState(false);
  const [calibration, setCalibration] = useState({
    baselineRaw: 0,
    maxRaw: 4095,
    activeThreshold: 18,
    releaseThreshold: 12,
    forcePointsText: "0,0\n4095,25"
  });

  useEffect(() => {
    fetch(`${API}/api/readings`)
      .then((response) => response.json())
      .then((data) => {
        setReadings(data.readings ?? []);
        setSummary(data.summary ?? null);
        syncCalibration(data.summary?.calibration);
      })
      .catch(() => {});

    const events = new EventSource(`${API}/api/readings/stream`);
    events.addEventListener("open", () => setStreamConnected(true));
    events.addEventListener("error", () => setStreamConnected(false));
    events.addEventListener("snapshot", (event) => {
      const payload = JSON.parse(event.data);
      setReadings(payload.readings ?? []);
      setSummary(payload.summary ?? null);
      syncCalibration(payload.summary?.calibration);
    });
    events.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.reading) {
        setReadings((current) => trimReadings([...current, payload.reading]));
      }
      if (payload.summary) setSummary(payload.summary);
      if (payload.calibration) syncCalibration(payload.calibration);
    };

    return () => events.close();
  }, []);

  const latest = summary?.latestBySensor?.front ?? readings.at(-1) ?? null;
  const chartPoints = useMemo(() => readings.slice(-120), [readings]);
  const activeZone = strongestZone(summary?.latestBySensor);

  function syncCalibration(next) {
    if (!next) return;
    setCalibration((current) => ({
      ...current,
      baselineRaw: next.baselineRaw,
      maxRaw: next.maxRaw,
      activeThreshold: next.activeThreshold,
      releaseThreshold: next.releaseThreshold,
      forcePointsText: (next.forcePoints ?? current.forcePointsText)
        .map((point) => `${point.raw},${point.forceLb}`)
        .join("\n")
    }));
  }

  async function toggleMock() {
    const path = mockRunning ? "/api/mock/stop" : "/api/mock/start";
    await fetch(`${API}${path}`, { method: "POST" });
    setMockRunning(!mockRunning);
  }

  async function resetSession() {
    await fetch(`${API}/api/session/reset`, { method: "POST" });
    setReadings([]);
  }

  async function saveCalibration(event) {
    event.preventDefault();
    const forcePoints = calibration.forcePointsText
      .split("\n")
      .map((line) => line.split(",").map((value) => Number(value.trim())))
      .filter(([raw, forceLb]) => Number.isFinite(raw) && Number.isFinite(forceLb))
      .map(([raw, forceLb]) => ({ raw, forceLb }));

    const response = await fetch(`${API}/api/calibration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baselineRaw: Number(calibration.baselineRaw),
        maxRaw: Number(calibration.maxRaw),
        activeThreshold: Number(calibration.activeThreshold),
        releaseThreshold: Number(calibration.releaseThreshold),
        forcePoints
      })
    });
    const data = await response.json();
    syncCalibration(data.calibration);
  }

  function captureBaseline() {
    const raw = latest?.raw ?? 0;
    setCalibration((current) => ({ ...current, baselineRaw: raw }));
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">BiteBud prototype lab</p>
          <h1>Live pressure trends for the smart teether sensor.</h1>
          <p className="hero-copy">
            Monitor chewing activity, relative intensity, approximate force, and zone-ready patterns from a local
            pressure sensor prototype. This dashboard supports awareness and testing only; it does not diagnose medical
            conditions.
          </p>
        </div>
        <div className="hero-panel">
          <ConnectionPill label="Dashboard stream" active={streamConnected} />
          <ConnectionPill label="Device signal" active={Boolean(summary?.deviceConnected)} />
          <button className="primary" onClick={toggleMock}>{mockRunning ? "Stop Mock Sensor" : "Start Mock Sensor"}</button>
          <button className="ghost" onClick={resetSession}>Reset Session</button>
        </div>
      </section>

      <section className="dashboard-grid">
        <PressureGauge reading={latest} />
        <TrendChart points={chartPoints} />
        <MetricStack summary={summary} latest={latest} />
        <ZonePanel latestBySensor={summary?.latestBySensor} activeZone={activeZone} />
        <CalibrationPanel
          calibration={calibration}
          setCalibration={setCalibration}
          onSave={saveCalibration}
          onCaptureBaseline={captureBaseline}
        />
        <HardwarePanel />
      </section>
    </main>
  );
}

function ConnectionPill({ label, active }) {
  return <span className={`pill ${active ? "active" : ""}`}>{label}: {active ? "connected" : "waiting"}</span>;
}

function PressureGauge({ reading }) {
  const value = reading?.normalized ?? 0;
  return (
    <section className="panel gauge-panel">
      <div className="panel-heading">
        <p>Current pressure</p>
        <span>{reading?.level ?? "no pressure"}</span>
      </div>
      <div className="gauge" style={{ "--value": `${value * 3.6}deg` }}>
        <div className="gauge-inner">
          <strong>{Math.round(value)}</strong>
          <span>normalized</span>
        </div>
      </div>
      <div className="gauge-details">
        <span>Raw {reading?.raw ?? 0}</span>
        <span>{(reading?.voltage ?? 0).toFixed(2)} V</span>
        <span>{(reading?.forceLb ?? 0).toFixed(2)} lb approx.</span>
      </div>
    </section>
  );
}

function TrendChart({ points }) {
  const polyline = useMemo(() => makePolyline(points), [points]);
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <p>Rolling pressure pattern</p>
        <span>last 60 seconds</span>
      </div>
      <svg className="chart" viewBox="0 0 640 260" role="img" aria-label="Live pressure trend chart">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#37c7a1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#37c7a1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="208" x2="640" y2="208" className="grid-line" />
        <line x1="0" y1="130" x2="640" y2="130" className="grid-line" />
        <line x1="0" y1="52" x2="640" y2="52" className="grid-line" />
        {polyline && <polygon points={`0,240 ${polyline} 640,240`} className="chart-fill" />}
        {polyline && <polyline points={polyline} className="chart-line" />}
      </svg>
    </section>
  );
}

function MetricStack({ summary, latest }) {
  return (
    <section className="panel metrics-panel">
      <div className="panel-heading">
        <p>Session summary</p>
        <span>pattern detection</span>
      </div>
      <div className="metric-grid">
        <Metric label="Press events" value={summary?.totalEvents ?? 0} />
        <Metric label="Presses/min" value={summary?.pressesPerMinute ?? 0} />
        <Metric label="Avg duration" value={`${summary?.averageDurationMs ?? 0} ms`} />
        <Metric label="Peak avg" value={`${summary?.averagePeakNormalized ?? 0}%`} />
      </div>
      <div className="reading-card">
        <span>Current event</span>
        <strong>{latest?.eventId ?? "none active"}</strong>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ZonePanel({ latestBySensor, activeZone }) {
  return (
    <section className="panel zones-panel">
      <div className="panel-heading">
        <p>Pressure zones</p>
        <span>front active in v1</span>
      </div>
      <div className="zone-map">
        {ZONES.map((zone) => {
          const reading = latestBySensor?.[zone];
          const value = reading?.normalized ?? 0;
          return (
            <div className={`zone ${activeZone === zone ? "selected" : ""}`} key={zone}>
              <span>{zone}</span>
              <strong>{Math.round(value)}%</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CalibrationPanel({ calibration, setCalibration, onSave, onCaptureBaseline }) {
  return (
    <section className="panel calibration-panel">
      <div className="panel-heading">
        <p>Calibration</p>
        <span>approximate force</span>
      </div>
      <form onSubmit={onSave} className="calibration-form">
        <label>
          Baseline raw
          <input
            type="number"
            value={calibration.baselineRaw}
            onChange={(event) => setCalibration((current) => ({ ...current, baselineRaw: event.target.value }))}
          />
        </label>
        <label>
          Max raw
          <input
            type="number"
            value={calibration.maxRaw}
            onChange={(event) => setCalibration((current) => ({ ...current, maxRaw: event.target.value }))}
          />
        </label>
        <label>
          Active threshold
          <input
            type="number"
            value={calibration.activeThreshold}
            onChange={(event) => setCalibration((current) => ({ ...current, activeThreshold: event.target.value }))}
          />
        </label>
        <label>
          Release threshold
          <input
            type="number"
            value={calibration.releaseThreshold}
            onChange={(event) => setCalibration((current) => ({ ...current, releaseThreshold: event.target.value }))}
          />
        </label>
        <label className="wide">
          Force points, one raw/lb pair per line
          <textarea
            rows="3"
            value={calibration.forcePointsText}
            onChange={(event) => setCalibration((current) => ({ ...current, forcePointsText: event.target.value }))}
          />
        </label>
        <button type="button" className="ghost" onClick={onCaptureBaseline}>Use Current As Baseline</button>
        <button type="submit" className="primary">Save Calibration</button>
      </form>
    </section>
  );
}

function HardwarePanel() {
  return (
    <section className="panel hardware-panel">
      <div className="panel-heading">
        <p>Prototype notes</p>
        <span>bench-safe first</span>
      </div>
      <ul>
        <li>Use the Tekscan FlexiForce A201 0-25 lb sensor for the first reliable build.</li>
        <li>Keep the sensor module outside mouth contact during testing.</li>
        <li>Use a soft silicone or foam pad to distribute presses across the sensor.</li>
        <li>Future left, right, and back zones can reuse the same API with new sensor IDs.</li>
      </ul>
    </section>
  );
}

function makePolyline(points) {
  if (!points.length) return "";
  const chartWidth = 640;
  const chartHeight = 220;
  const bottom = 240;
  return points
    .map((point, index) => {
      const x = points.length === 1 ? chartWidth : (index / (points.length - 1)) * chartWidth;
      const y = bottom - ((point.normalized ?? 0) / 100) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function trimReadings(next) {
  const cutoff = Date.now() - 60_000;
  return next.filter((reading) => reading.timestamp >= cutoff).slice(-600);
}

function strongestZone(latestBySensor) {
  if (!latestBySensor) return "front";
  return ZONES.reduce((best, zone) => {
    const bestValue = latestBySensor[best]?.normalized ?? 0;
    const zoneValue = latestBySensor[zone]?.normalized ?? 0;
    return zoneValue > bestValue ? zone : best;
  }, "front");
}

createRoot(document.getElementById("root")).render(<App />);
