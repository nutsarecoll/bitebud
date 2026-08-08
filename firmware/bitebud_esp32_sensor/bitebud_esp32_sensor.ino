/*
  BiteBud pressure sensor prototype firmware

  Board: Arduino Nano ESP32 or compatible ESP32 board
  Sensor: Tekscan FlexiForce A201 through a Quickstart Board or signal-conditioning circuit

  Update these before uploading:
  - WIFI_SSID
  - WIFI_PASSWORD
  - SERVER_URL: your laptop IP running the BiteBud server, e.g. http://192.168.1.20:8787/api/readings

  This firmware reads one analog sensor at 20 Hz and sends smoothed data to the
  local BiteBud dashboard at 10 Hz. It is for bench testing only.
*/

#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL = "http://YOUR_LAPTOP_IP:8787/api/readings";

const char* DEVICE_ID = "bitebud-proto-01";
const char* SENSOR_ID = "front";

const int SENSOR_PIN = A0;
const int LED_PIN = LED_BUILTIN;

const unsigned long SAMPLE_INTERVAL_MS = 50;   // 20 Hz
const unsigned long SEND_INTERVAL_MS = 100;    // 10 Hz
const float SMOOTHING_ALPHA = 0.22;

float smoothedRaw = 0;
unsigned long lastSampleAt = 0;
unsigned long lastSendAt = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  analogReadResolution(12);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(350);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected. Device IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long now = millis();

  if (now - lastSampleAt >= SAMPLE_INTERVAL_MS) {
    lastSampleAt = now;
    int raw = analogRead(SENSOR_PIN);
    if (smoothedRaw == 0) {
      smoothedRaw = raw;
    } else {
      smoothedRaw = (SMOOTHING_ALPHA * raw) + ((1.0 - SMOOTHING_ALPHA) * smoothedRaw);
    }
    digitalWrite(LED_PIN, smoothedRaw > 740 ? HIGH : LOW);
  }

  if (now - lastSendAt >= SEND_INTERVAL_MS) {
    lastSendAt = now;
    sendReading((int)smoothedRaw, now);
  }
}

void sendReading(int raw, unsigned long uptimeMs) {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.reconnect();
    return;
  }

  float voltage = (raw / 4095.0) * 3.3;

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"sensorId\":\"" + String(SENSOR_ID) + "\",";
  payload += "\"raw\":" + String(raw) + ",";
  payload += "\"voltage\":" + String(voltage, 3) + ",";
  payload += "\"uptimeMs\":" + String(uptimeMs);
  payload += "}";

  int code = http.POST(payload);
  Serial.print("POST ");
  Serial.print(code);
  Serial.print(" raw=");
  Serial.println(raw);
  http.end();
}
