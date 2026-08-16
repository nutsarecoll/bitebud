# BiteBud Live Sensor Dashboard

Local prototype dashboard for the BiteBud pressure sensor system. It supports live pressure trends, press/chew event detection, approximate force calibration, and future pressure zones.

## Run The Dashboard

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal, usually:

```text
http://localhost:5173
```

Use **Start Mock Sensor** to see live data before hardware arrives.

## Hardware Flow

Recommended first build:

- Tekscan FlexiForce A201, 0-25 lb range.
- FlexiForce Quickstart Board if available, otherwise Tekscan-style signal conditioning.
- Arduino Nano ESP32.
- USB-C cable, breadboard, jumper wires, and a soft silicone/foam press pad.

The firmware lives at:

```text
firmware/bitebud_esp32_sensor/bitebud_esp32_sensor.ino
```

Create the local firmware configuration before uploading:

```bash
cp firmware/bitebud_esp32_sensor/secrets.example.h \
  firmware/bitebud_esp32_sensor/secrets.h
```

Edit `secrets.h` with the Wi-Fi name, Wi-Fi password, and laptop server URL.
The file is ignored by Git so credentials are not pushed to GitHub.

For a serial-only wiring check that does not require Wi-Fi, upload:

```text
firmware/bitebud_sensor_test/bitebud_sensor_test.ino
```

The completed wiring, calibration curve, and chronological prototype log are in
`project-notes/`.

## API

- `POST /api/readings`: receive ESP32 sensor readings.
- `GET /api/readings/stream`: stream live dashboard updates.
- `GET /api/readings/history?limit=3600`: read persisted readings from disk.
- `POST /api/calibration`: update baseline, thresholds, and force mapping.
- `GET /api/session-summary`: read event count, duration, intensity, and zone state.

Readings and calibration are persisted to `data/` (override with `BITEBUD_DATA_DIR`)
so history survives server restarts. `/api/session/reset` clears persisted history too.

## Safety

This is a bench/demo prototype. Do not put electronics in anyone's mouth. The dashboard is for pressure-pattern awareness and prototype testing only, not medical diagnosis.
