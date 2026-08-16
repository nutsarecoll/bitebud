# BiteBud Prototype Build Log

This file records completed hardware, firmware, calibration, and workflow work
that should remain available on every computer using the repository.

## 2026-08-13: Breadboard preparation

- Inserted the A201 sensor with its outer pins on rows 1 and 3 and its inactive
  center pin on row 2.
- Built the 47 kOhm voltage divider from the row-3 signal junction to row 5.
- Prepared the row-3 signal jumper and row-5 ground jumper while waiting for the
  Arduino Nano ESP32.
- Kept the circuit unpowered until the Arduino arrived.

## 2026-08-16: First complete hardware build

- Installed the Nano ESP32 across the breadboard center trench with USB-C toward
  the bottom.
- Connected row 1 to Nano `3V3` through `j25`, row 3 to Nano `A0` through `j23`,
  and row 5 to Nano `GND` through `j13`.
- Confirmed macOS detected the board as `arduino:esp32:nano_nora` over USB.
- Installed Arduino CLI 1.5.1 with Homebrew and installed the official
  `arduino:esp32` platform package.
- Added `firmware/bitebud_sensor_test/` as a reusable serial-only ADC test that
  requires no Wi-Fi credentials.
- Uploaded the diagnostic sketch. The unloaded baseline was raw `0`; an early
  firm fingertip test peaked at raw `676`, confirming that the voltage divider,
  sensor, and `A0` input worked.

## 2026-08-16: Firmware and dashboard connection

- Moved the Wi-Fi name, password, and local server URL out of the tracked sketch
  and into an ignored `secrets.h` file.
- Added `secrets.example.h` and documented the local setup process. The real
  `secrets.h` file is intentionally not synchronized through GitHub.
- Compiled and uploaded the full Wi-Fi firmware.
- Started the dashboard with `npm run dev`; the Nano successfully posted live
  readings to `/api/readings` and received HTTP `201` responses.
- Ran the server test suite successfully: 14 tests passed.

## 2026-08-16: Calibration

- Conditioned the sensor before calibration by cycling a load near 1,100 g.
- Rejected a cardboard load puck because compression and movement caused poor
  repeatability.
- Reconditioned and calibrated with a small, smooth metal puck kept centered on
  the A201 sensing circle.
- Saved this curve in the dashboard:

```text
0 g       -> raw 0       -> 0.000 lb
100 g     -> raw 24      -> 0.220 lb
250 g     -> raw 87      -> 0.551 lb
500 g     -> raw 110     -> 1.102 lb
735 g     -> raw 244     -> 1.620 lb
1000 g    -> raw 290     -> 2.205 lb
```

- Set baseline raw `0`, maximum raw `320`, active threshold `5%`, and release
  threshold `2%`.
- Validated the curve with a separate 500 g hold: stable raw `109`, dashboard
  median `1.08 lb`, approximately 2% below the `1.10 lb` reference.
- The calibration remains specific to this sensor, resistor, puck, and loading
  geometry. Moving the puck or changing hardware requires recalibration.

## 2026-08-16: Reconnection lesson

- Switching Wi-Fi networks changed the laptop's local IP address and temporarily
  disconnected the Nano from the dashboard.
- Restored the original network, updated the ignored local server URL, entered
  Nano upload mode by double-pressing reset, and re-uploaded the firmware.
- Restarted the dashboard and verified `deviceConnected: true` with the saved
  calibration restored.
- Future network changes require updating `BITEBUD_SERVER_URL` in the local
  `secrets.h` file and uploading again unless the laptop is assigned a stable
  local address or the firmware gains hostname-based discovery.

## Current next step

Run a clean repeatability session with the metal puck fixed in place: five holds
each at 100 g, 250 g, 500 g, and 1,000 g. Verify event count, duration, and force
estimates before designing the permanent press pad or enclosure.

## 2026-08-16: Roadmap text export

- Reviewed all eight pages of `output/pdf/bitebud_project_roadmap.pdf`.
- Added `project-notes/COMPETITION_ROADMAP.md` as a searchable Markdown
  transcription preserving the roadmap's sections, tables, dates, risks,
  decision gates, and source notes.
- Kept the PDF as the designed artifact and labeled the Markdown version as a
  dated planning snapshot so newer hardware status remains in this build log.
