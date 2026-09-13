import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const ZONES = ["front", "left", "right", "back"];
const API = "";
const CLOUD_DEMO = import.meta.env.PROD;

function App() {
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [readings, setReadings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [mockRunning, setMockRunning] = useState(false);
  const [calibration, setCalibration] = useState({
    baselineRaw: 0,
    maxRaw: 4095,
    activeThreshold: 18,
    releaseThreshold: 12,
    forcePointsText: "0,0\n4095,25",
  });

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    if (CLOUD_DEMO) {
      let cancelled = false;
      let timer;
      const controller = new AbortController();
      async function refresh() {
        try {
          const response = await fetch('/api/live', {
            cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Live demo unavailable.');
          if (cancelled) return;
          setReadings(data.readings ?? []);
          setSummary(data.summary ?? null);
          setMockRunning(Boolean(data.mockRunning));
          syncCalibration(data.summary?.calibration);
          const fresh = Date.now() - data.publishedAt < 15000;
          setStreamConnected(fresh);
          setNotice(fresh ? '' : 'Demo connection paused. The demo Mac must be running and sharing readings.');
        } catch (error) {
          if (cancelled) return;
          setStreamConnected(false);
          setNotice(error.message || 'Unable to reach the live demo.');
        } finally {
          if (!cancelled) timer = setTimeout(refresh, 2000);
        }
      }
      refresh();
      return () => {
        cancelled = true;
        controller.abort();
        clearTimeout(timer);
        clearInterval(clock);
      };
    }
    fetch(`${API}/api/health`)
      .then((r) => r.json())
      .then((data) => setMockRunning(data.mockRunning))
      .catch(() => {});
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
      if (payload.type === "reset") setReadings([]);
      if (payload.reading) {
        setReadings((current) => trimReadings([...current, payload.reading]));
      }
      if (payload.summary) setSummary(payload.summary);
      if (payload.calibration) syncCalibration(payload.calibration);
    };

    return () => {
      events.close();
      clearInterval(clock);
    };
  }, []);

  const latest = summary?.latestBySensor?.front ?? readings.at(-1) ?? null;
  const chartPoints = useMemo(
    () => readings.filter((r) => r.timestamp >= now - 60_000),
    [readings, now],
  );
  const deviceConnected =
    streamConnected && Boolean(latest && now - latest.timestamp < (CLOUD_DEMO ? 15000 : 5000));
  const isMock = latest?.deviceId?.startsWith("bitebud-mock") || mockRunning;
  const activeZone = strongestZone(summary?.latestBySensor);

  function syncCalibration(next) {
    if (!next) return;
    setCalibration((current) => ({
      ...current,
      baselineRaw: next.baselineRaw,
      maxRaw: next.maxRaw,
      activeThreshold: next.activeThreshold,
      releaseThreshold: next.releaseThreshold,
      forcePointsText: next.forcePoints
        ? next.forcePoints
            .map((point) => `${point.raw},${point.forceLb}`)
            .join("\n")
        : current.forcePointsText,
    }));
  }

  async function performAction(action, success) {
    setPending(true);
    setNotice("");
    try {
      await action();
      setNotice(success);
    } catch (error) {
      setNotice(error.message || "Unable to connect. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function post(path, body) {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok)
      throw new Error("The request could not be saved. Please try again.");
    return response.json();
  }

  function toggleMock() {
    performAction(
      async () => {
        const data = await post(
          mockRunning ? "/api/mock/stop" : "/api/mock/start",
        );
        setMockRunning(data.mockRunning);
      },
      mockRunning
        ? "Demo sensor stopped."
        : "Demo sensor started. Readings are simulated.",
    );
  }

  function resetSession() {
    performAction(async () => {
      const data = await post("/api/session/reset");
      setReadings([]);
      setSummary(data.summary);
    }, "Session cleared.");
  }

  async function saveCalibration(event) {
    event.preventDefault();
    const forcePoints = calibration.forcePointsText
      .split("\n")
      .map((line) => line.split(",").map((value) => Number(value.trim())))
      .filter(
        ([raw, forceLb]) => Number.isFinite(raw) && Number.isFinite(forceLb),
      )
      .map(([raw, forceLb]) => ({ raw, forceLb }));

    await performAction(async () => {
      const data = await post("/api/calibration", {
        baselineRaw: Number(calibration.baselineRaw),
        maxRaw: Number(calibration.maxRaw),
        activeThreshold: Number(calibration.activeThreshold),
        releaseThreshold: Number(calibration.releaseThreshold),
        forcePoints,
      });
      syncCalibration(data.calibration);
    }, "Calibration saved.");
  }

  function captureBaseline() {
    const raw = latest?.raw ?? 0;
    setCalibration((current) => ({ ...current, baselineRaw: raw }));
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark">
            b<span>·</span>
          </span>
          BiteBud
        </a>
        <nav aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#activity">Live activity</a>
          <a href="#setup">Sensor setup</a>
        </nav>
        <a className="back-to-landing" href="/">
          <span aria-hidden="true">←</span> Back to landing page
        </a>
      </header>
      <main className="app-shell" id="overview">
        <aside className="sidebar">
          <div className="workspace-label">
            <span className="workspace-icon">b.</span>
            <div>
              <strong>Your BiteBud</strong>
              <span>Smart teether prototype</span>
            </div>
          </div>
          <nav aria-label="Dashboard sections">
            <a href="#overview" className="nav-current">
              ◫ <span>Session overview</span>
            </a>
            <a href="#activity">
              ⌁ <span>Pressure activity</span>
            </a>
            <a href="#zones">
              ◎ <span>Sensor zones</span>
            </a>
            <a href="#setup">
              ⚙ <span>Calibration & setup</span>
            </a>
          </nav>
          <div className="connection-card">
            <p className="eyebrow">Connection</p>
            <ConnectionPill label="Dashboard" active={streamConnected} />
            <ConnectionPill
              label={isMock ? "Demo signal" : "Sensor"}
              active={deviceConnected}
            />
            <p>
              Readings appear here automatically when your sensor sends data.
            </p>
          </div>
          <div className="sidebar-note">
            Little signals.
            <br />
            <strong>A clearer picture.</strong>
          </div>
        </aside>
        <div className="main-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">THE BITEBUD WORKSPACE</p>
              <h1>A little more understanding.</h1>
              <p>A calm, clear view of your latest pressure patterns.</p>
            </div>
            <span className="date-label">
              {new Date(now).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </section>
          <section className="session-banner">
            <div>
              <span className="summary-badge">
                <i className={deviceConnected ? "live-dot" : "waiting-dot"} />
                {deviceConnected
                  ? isMock
                    ? "Simulated session"
                    : "Live sensor session"
                  : "Waiting for sensor"}
              </span>
              <h2>
                {deviceConnected
                  ? "Small signals, coming into focus."
                  : "Ready when you are."}
              </h2>
              <p>
                {deviceConnected
                  ? `${summary?.totalEvents ?? 0} press events recorded in this session. Follow the live pattern below as new readings arrive.`
                  : "Connect your tabletop sensor to begin, or try a demo to explore the experience."}
              </p>
              <a className="text-link" href="#activity">
                Explore session activity <span>↗</span>
              </a>
            </div>
            <div className="signal-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="teether">
                <div />
              </div>
              <span className="art-label">CONNECTED CARE, IN THE MAKING</span>
            </div>
          </section>
          <MetricStack summary={summary} latest={latest} />
          <section className="section-heading" id="activity">
            <div>
              <p className="eyebrow">A CLOSER LOOK</p>
              <h2>Your session, in motion.</h2>
            </div>
            <span>
              {isMock ? "Demo data" : "Sensor data"} · updates automatically
            </span>
          </section>
          <div className="activity-grid">
            <TrendChart points={chartPoints} now={now} />
            <PressureGauge reading={latest} />
          </div>
          <div className="lower-grid" id="zones">
            <ZonePanel
              latestBySensor={summary?.latestBySensor}
              activeZone={activeZone}
            />
            <section className="panel insight-panel">
              <p className="eyebrow">SESSION NOTES</p>
              <h2>Space for the bigger picture.</h2>
              <p>
                {summary?.totalEvents
                  ? `This session contains ${summary.totalEvents} detected press events, with an average duration of ${summary.averageDurationMs ?? 0} ms. These reflect pressure on the prototype sensor.`
                  : "As pressure events are recorded, your session summary will take shape here."}
              </p>
              <div className="note-footer">
                Pressure-pattern awareness · non-diagnostic
              </div>
            </section>
          </div>
          {CLOUD_DEMO ? (
            <section id="setup" className="action-notice">
              Live tabletop demo · updates every few seconds while the demo Mac is connected.
              Calibration and session controls are available on the demo Mac.
            </section>
          ) : <details id="setup" className="setup-details">
            <summary>
              <div>
                <p className="eyebrow">PROTOTYPE TOOLS</p>
                <h2>Sensor setup & calibration</h2>
              </div>
              <span className="expand-label">Expand +</span>
            </summary>
            <div className="setup-content">
              <div className="tool-actions">
                <button
                  className="primary"
                  disabled={pending}
                  onClick={toggleMock}
                >
                  {mockRunning ? "Stop Mock Sensor" : "Start Mock Sensor"}
                </button>
                <button
                  className="ghost"
                  disabled={pending}
                  onClick={resetSession}
                >
                  Reset Session
                </button>
                <span>Reset clears saved session readings.</span>
              </div>
              <fieldset disabled={pending}>
                <CalibrationPanel
                  calibration={calibration}
                  setCalibration={setCalibration}
                  onSave={saveCalibration}
                  onCaptureBaseline={captureBaseline}
                />
              </fieldset>
              <HardwarePanel />
            </div>
          </details>}
          {notice && (
            <p className="action-notice" role="status">
              {notice}
            </p>
          )}
          <footer className="page-footer">
            <span>
              <strong>BiteBud</strong> · Thoughtfully connected.
            </span>
            <span>Tabletop prototype only. Not for use in a baby's mouth.</span>
          </footer>
        </div>
      </main>
    </>
  );
}

function ConnectionPill({ label, active }) {
  return (
    <span className={`pill ${active ? "active" : ""}`}>
      {label}: {active ? "connected" : "waiting"}
    </span>
  );
}

function PressureGauge({ reading }) {
  const value = reading?.normalized ?? 0;
  const forceGrams = reading?.forceGrams ?? poundsToGrams(reading?.forceLb);
  return (
    <section className="panel gauge-panel">
      <div className="panel-heading">
        <p>Current pressure</p>
        <span>{reading ? reading.level : "awaiting data"}</span>
      </div>
      <div className="gauge" style={{ "--value": `${value * 3.6}deg` }}>
        <div className="gauge-inner">
          <strong>{Math.round(forceGrams)}</strong>
          <span>grams approx.</span>
        </div>
      </div>
      <div className="gauge-details">
        <span>{Math.round(value)}% normalized</span>
        <span>Raw {reading?.raw ?? 0}</span>
        <span>{(reading?.voltage ?? 0).toFixed(2)} V</span>
        <span>{(reading?.forceLb ?? 0).toFixed(2)} lb approx.</span>
      </div>
    </section>
  );
}

function poundsToGrams(forceLb = 0) {
  return Number(forceLb) * 453.59237;
}

function TrendChart({ points, now }) {
  const polyline = useMemo(() => makePolyline(points, now), [points, now]);
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <p>Pressure over time</p>
        <span>last 60 seconds</span>
      </div>
      <div className="chart-unit">RELATIVE INTENSITY (%)</div>
      <svg
        className="chart"
        viewBox="0 0 640 260"
        role="img"
        aria-label="Live pressure trend chart"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#37c7a1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#37c7a1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="208" x2="640" y2="208" className="grid-line" />
        <line x1="0" y1="130" x2="640" y2="130" className="grid-line" />
        <line x1="0" y1="52" x2="640" y2="52" className="grid-line" />
        {polyline && (
          <polygon
            points={`0,240 ${polyline} 640,240`}
            className="chart-fill"
          />
        )}
        {polyline && <polyline points={polyline} className="chart-line" />}
      </svg>
      {!points.length && (
        <p className="chart-empty">
          Waiting for readings · your live pattern will appear here
        </p>
      )}
      <div className="chart-axis">
        <span>60 seconds ago</span>
        <span>Now</span>
      </div>
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
        <Metric
          label="Avg duration"
          value={`${summary?.averageDurationMs ?? 0} ms`}
        />
        <Metric
          label="Peak avg"
          value={`${summary?.averagePeakNormalized ?? 0}%`}
        />
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
        <span>Front sensor in v1</span>
      </div>
      <div className="zone-map">
        {ZONES.map((zone) => {
          const reading = latestBySensor?.[zone];
          const value = reading?.normalized ?? 0;
          return (
            <div
              className={`zone ${reading && activeZone === zone ? "selected" : ""}`}
              key={zone}
            >
              <span>{zone}</span>
              <strong>{reading ? `${Math.round(value)}%` : "—"}</strong>
              <small>
                {reading
                  ? "Reading received"
                  : zone === "front"
                    ? "Awaiting data"
                    : "Not connected"}
              </small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CalibrationPanel({
  calibration,
  setCalibration,
  onSave,
  onCaptureBaseline,
}) {
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
            onChange={(event) =>
              setCalibration((current) => ({
                ...current,
                baselineRaw: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Max raw
          <input
            type="number"
            value={calibration.maxRaw}
            onChange={(event) =>
              setCalibration((current) => ({
                ...current,
                maxRaw: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Active threshold
          <input
            type="number"
            value={calibration.activeThreshold}
            onChange={(event) =>
              setCalibration((current) => ({
                ...current,
                activeThreshold: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Release threshold
          <input
            type="number"
            value={calibration.releaseThreshold}
            onChange={(event) =>
              setCalibration((current) => ({
                ...current,
                releaseThreshold: event.target.value,
              }))
            }
          />
        </label>
        <label className="wide">
          Force points, one raw/lb pair per line
          <textarea
            rows="3"
            value={calibration.forcePointsText}
            onChange={(event) =>
              setCalibration((current) => ({
                ...current,
                forcePointsText: event.target.value,
              }))
            }
          />
        </label>
        <button type="button" className="ghost" onClick={onCaptureBaseline}>
          Use Current As Baseline
        </button>
        <button type="submit" className="primary">
          Save Calibration
        </button>
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
        <li>
          Use the Tekscan FlexiForce A201 0-25 lb sensor for the first reliable
          build.
        </li>
        <li>Keep the sensor module outside mouth contact during testing.</li>
        <li>
          Use a soft silicone or foam pad to distribute presses across the
          sensor.
        </li>
        <li>
          Future left, right, and back zones can reuse the same API with new
          sensor IDs.
        </li>
      </ul>
    </section>
  );
}

function makePolyline(points, now) {
  if (!points.length) return "";
  const chartWidth = 640;
  const chartHeight = 220;
  const bottom = 240;
  return points
    .map((point) => {
      const x = Math.max(
        0,
        Math.min(
          chartWidth,
          ((point.timestamp - (now - 60_000)) / 60_000) * chartWidth,
        ),
      );
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
