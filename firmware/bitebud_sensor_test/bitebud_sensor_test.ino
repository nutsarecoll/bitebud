/*
  BiteBud bench wiring test

  Board: Arduino Nano ESP32
  Circuit: FlexiForce A201 voltage divider connected to A0

  Prints the raw 12-bit ADC value and calculated voltage four times per second.
  No Wi-Fi credentials are required.
*/

const int SENSOR_PIN = A0;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  delay(1000);
  Serial.println("BiteBud sensor test ready");
}

void loop() {
  const int raw = analogRead(SENSOR_PIN);
  const float voltage = (raw / 4095.0) * 3.3;

  Serial.print("raw=");
  Serial.print(raw);
  Serial.print(" voltage=");
  Serial.println(voltage, 3);

  delay(250);
}
