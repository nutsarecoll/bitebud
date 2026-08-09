# Hardware Plan: First Bench Prototype

Status: parts ordered on 2026-08-09.

## Ordered parts

- Tekscan FlexiForce A201-25 pressure sensor (one).
- Arduino Nano ESP32 **with headers** — Arduino SKU `ABX00083` (one).
- Solderless breadboard (one).
- Male-to-male jumper wires (one pack).
- 47 kOhm, 1/4 W resistor (one; a resistor pack is fine).
- USB-C to USB-C **data** cable (one). A charge-only cable cannot program the Arduino.

No battery, separate Wi-Fi module, external power supply, soldering iron, or Tekscan Quickstart Board is required for this first build.

## Why this version

The A201-25 is the sensor alone. It is inexpensive and suitable for detecting presses, event duration, relative intensity, and usage patterns. A simple voltage-divider circuit is less linear than Tekscan's Quickstart Board, so readings should be treated as relative values and calibrated for the dashboard rather than as medical-grade force measurements.

## Breadboard wiring

The A201-25 has three pins. Use the two **outer** pins; the center pin is inactive.

```text
Nano 3.3V  -> A201 outer pin
A201 other outer pin -> Nano A0
Nano A0 -> 47 kOhm resistor -> Nano GND
```

Optional: add a 0.1 uF ceramic capacitor between `A0` and `GND` if one becomes available. It can reduce noise, but it is not required because the firmware also smooths readings.

The Nano is powered and programmed through its USB-C port. Powering the sensor from the Nano's 3.3 V pin keeps the analog input within the Nano's safe voltage range.

## Mechanical testing and safety

- Use a small flat plastic disc, soft foam, or a makeup sponge as a bench-test press pad.
- Apply pressure straight onto the sensor's circular sensing area; do not use a sharp object.
- Use known weights or a kitchen scale to create calibration points after assembly.
- This is a tabletop prototype only. Do not put the sensor, wiring, electronics, foam, or any prototype enclosure in a baby's mouth.
