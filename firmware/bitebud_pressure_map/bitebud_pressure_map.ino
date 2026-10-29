/*
  BiteBud build V1: four electrode regions on ONE continuous Velostat sheet.
  Board: Arduino Nano ESP32 (Arduino ESP32 board package).
  Z1 -> A0, Z2 -> A1, Z3 -> A2, Z4 -> A3 (Arduino pin names).
  See output/prototype-v1/wiring.svg and BUILD_GUIDE.md for the complete circuit.
  Each sensing node has a 10k pulldown to GND, then 1k series to its ADC pin,
  with 100nF from the ADC pin to GND. Common opposing electrode -> 3V3.
  USB ONLY. No Wi-Fi credentials, batteries or network configuration required.
  Emits one JSON frame every 50ms; the Windows bridge posts it to the server.
  Tabletop testing only. This sketch does not validate infant use or force accuracy.
*/

const uint8_t SENSOR_PINS[4] = { A0, A1, A2, A3 };
const unsigned long FRAME_INTERVAL_MS = 50;
unsigned long lastFrameAt = 0;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  for (uint8_t i = 0; i < 4; i++) {
    pinMode(SENSOR_PINS[i], INPUT);
    analogSetPinAttenuation(SENSOR_PINS[i], ADC_11db);
  }
  delay(1000);
}

void loop() {
  const unsigned long now = millis();
  if (now - lastFrameAt < FRAME_INTERVAL_MS) return;
  lastFrameAt = now;
  uint16_t raw[4];
  for (uint8_t i = 0; i < 4; i++) {
    // Discard the first conversion after switching ADC channel.
    analogRead(SENSOR_PINS[i]);
    uint32_t total = 0;
    for (uint8_t sample = 0; sample < 8; sample++) total += analogRead(SENSOR_PINS[i]);
    raw[i] = total / 8;
  }
  Serial.print("{\"deviceId\":\"bitebud-map-v1\",\"raw\":[");
  for (uint8_t i = 0; i < 4; i++) {
    if (i) Serial.print(',');
    Serial.print(raw[i]);
  }
  Serial.println("]}");
}
