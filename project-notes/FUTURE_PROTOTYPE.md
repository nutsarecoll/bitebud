# Future Prototype Plan

This plan carries forward the hardware discussion around the A201-25 voltage-divider prototype and the later signal-conditioning upgrade.

## Phase 1: First bench prototype

Goal: prove that BiteBud can detect press events, duration, and relative intensity.

All ordered parts had arrived by 2026-08-16:

- Tekscan FlexiForce A201-25 force sensor.
- Arduino Nano ESP32 with headers.
- Solderless breadboard.
- Male-to-male jumper wires.
- 47 kOhm resistors.
- USB-C to USB-C data cable.

Completed by 2026-08-16:

1. Finished the 3.3 V voltage-divider circuit described in `HARDWARE.md`.
2. Connected and programmed the Nano with the USB-C data cable.
3. Separated local Wi-Fi credentials from tracked firmware files.
4. Confirmed live Nano readings reach the local dashboard.
5. Conditioned the sensor and calibrated it with known scale loads and a metal
   puck; the saved curve covers 0 to 1,000 g.
6. Validated the 500 g calibration point within approximately 2%.

Remaining Phase 1 verification:

1. Run five repeatability trials at each calibrated reference load.
2. Verify event count, duration, release behavior, and saved readings in a clean
   session.
3. Build a stable press pad that fixes the puck location and loads the sensor
   perpendicularly.

Current result: reliable live relative-pressure data with a bench calibration
specific to the present sensor and metal-puck geometry. The simple circuit is
intentionally for press detection and light-to-strong comparisons; it is not
medical-grade force instrumentation.

## Phase 2: Improve measurement quality

Trigger: move to this phase if the basic circuit cannot distinguish the desired pressure levels consistently, or if force readings need to be more linear across the range.

Parts to evaluate before purchase:

- A rail-to-rail op-amp suitable for 3.3 V operation, plus the required resistors and capacitors; or
- A Tekscan FlexiForce Quickstart Board.
- Optional Tekscan load concentrators, or a small rigid puck that distributes pressure evenly across the sensing circle.

Why: the A201-25 is a variable resistor. The current voltage divider is inexpensive and simple, but its voltage response is not linear. An op-amp conditioning circuit or Quickstart Board makes calibration and force comparisons more consistent, at a higher cost and with more wiring.

## Phase 3: More useful interaction data

Goal: distinguish where and how the prototype is pressed.

Potential additions, not yet purchased:

- Additional force sensors for separate pressure zones.
- A compact enclosure that keeps the microcontroller and wiring outside the sensing/press area.
- A removable USB power connection for repeated bench sessions.

The software would need updates to label each sensor/zone and show a zone-specific summary.

## Phase 4: Product-design exploration

Goal: explore the product concept after the bench system works, without making medical claims.

Potential research items:

- A separate, soft outer teether form made from appropriately selected material.
- Mechanical protection that keeps force loading perpendicular to the sensor.
- A sealed, separate electronics enclosure and strain relief for wires.
- A future optional temperature or motion-trend module only after the primary pressure prototype is validated.

## Safety boundary

All phases above remain bench-prototype work. The current sensor, wiring, board, foam, and any early enclosure are not suitable for use in a baby's mouth. A real baby product would require a separate safety, materials, enclosure, testing, and regulatory workstream.
