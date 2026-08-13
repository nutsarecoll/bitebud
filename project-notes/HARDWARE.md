# Hardware Plan: First Bench Prototype

Status: all parts except the Arduino Nano ESP32 have arrived. The unpowered
breadboard wiring was prepared on 2026-08-13.

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

### Current physical layout

The breadboard is prepared with the sensor pins in the right-side terminal
strip. Holes `f` through `j` sharing the same numbered row are electrically
connected.

```text
j1  A201 outer pin          i1  reserved for the 3.3 V jumper
j2  A201 center pin             leave completely unused
j3  A201 outer pin          h3  signal jumper (later connects to Nano A0)
i3  47 kOhm resistor leg
i5  47 kOhm resistor leg    h5  ground jumper (later connects to Nano GND)
```

The resistor therefore runs from the row-3 signal junction to row 5. Jumper
wire colors are only visual labels; in the current assembly, the signal wire
and the black ground wire are identified by their destinations above.

Keep the circuit unpowered until the Nano arrives. The loose jumper ends should
not be connected to a power source.

### When the Nano ESP32 arrives

1. With USB disconnected, connect the row-1 jumper to the Nano's `3.3V` pin.
2. Connect the row-3 signal jumper to the Nano's `A0` pin.
3. Connect the row-5 ground jumper to a Nano `GND` pin.
4. Recheck that the center sensor pin on row 2 remains unused and that no
   3.3 V connection is shorted to ground.
5. Connect the Nano to the computer using the USB-C data cable, then upload and
   test the firmware.

## Mechanical testing and safety

- Use a small flat plastic disc, soft foam, or a makeup sponge as a bench-test press pad.
- Apply pressure straight onto the sensor's circular sensing area; do not use a sharp object.
- Use known weights or a kitchen scale to create calibration points after assembly.
- This is a tabletop prototype only. Do not put the sensor, wiring, electronics, foam, or any prototype enclosure in a baby's mouth.
