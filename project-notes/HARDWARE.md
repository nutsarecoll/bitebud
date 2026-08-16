# Hardware Plan: First Bench Prototype

Status: assembled and streaming live readings on 2026-08-16. The Arduino Nano
ESP32 is connected to the A201 voltage divider, joined the local Wi-Fi network,
and successfully posts readings to the BiteBud dashboard.

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

The assembled breadboard used these Nano connections:

```text
row 1 sensor supply -> Nano 3V3 through j25
row 3 sensor signal -> Nano A0 through j23
row 5 divider ground -> Nano GND through j13
```

## Bench calibration: 2026-08-16

The sensor was conditioned before calibration and loaded through a small,
smooth metal puck centered on the sensing circle. A cardboard puck was tested
first but rejected because compression and shifting produced inconsistent
readings.

Saved calibration curve:

```text
0 g       -> raw 0       -> 0.000 lb
100 g     -> raw 24      -> 0.220 lb
250 g     -> raw 87      -> 0.551 lb
500 g     -> raw 110     -> 1.102 lb
735 g     -> raw 244     -> 1.620 lb
1000 g    -> raw 290     -> 2.205 lb
```

Dashboard settings: baseline `0`, maximum raw `320`, active threshold `5%`,
and release threshold `2%`. A separate 500 g validation hold produced a stable
median of raw `109` and an estimated `1.08 lb`, approximately 2% below the
1.10 lb reference.

This calibration is valid only while the same puck and loading geometry remain
fixed. Moving the puck, loading at an angle, changing the divider resistor, or
replacing the sensor requires recalibration. The low-cost divider and manual
test fixture remain prototype tools, not laboratory or medical instrumentation.

## Mechanical testing and safety

- Use a small flat plastic disc, soft foam, or a makeup sponge as a bench-test press pad.
- Apply pressure straight onto the sensor's circular sensing area; do not use a sharp object.
- Use known weights or a kitchen scale to create calibration points after assembly.
- This is a tabletop prototype only. Do not put the sensor, wiring, electronics, foam, or any prototype enclosure in a baby's mouth.
