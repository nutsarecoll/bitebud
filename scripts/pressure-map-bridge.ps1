param(
  [string]$Port,
  [string]$Server = 'http://localhost:8787',
  [switch]$SerialOnly
)
$ErrorActionPreference = 'Stop'
if (-not $Port) {
  $mapPorts = [System.IO.Ports.SerialPort]::GetPortNames()
  Write-Host ('Available serial ports: ' + ($mapPorts -join ', '))
  throw 'Choose the Nano port: ./scripts/pressure-map-bridge.ps1 -Port COM5'
}
if ($Server -notmatch '^https?://') { throw 'Server must be an HTTP or HTTPS URL.' }
$mapSerial = [System.IO.Ports.SerialPort]::new($Port, 115200, 'None', 8, 'One')
$mapSerial.ReadTimeout = 1500
$mapSerial.NewLine = "`n"
# Native USB CDC on the Nano can require DTR to be asserted.
$mapSerial.DtrEnable = $true
$mapSerial.RtsEnable = $false
$mapClient = [System.Net.Http.HttpClient]::new()
$mapClient.Timeout = [TimeSpan]::FromSeconds(2)
$mapCount = 0
try {
  $mapSerial.Open()
  if ($SerialOnly) {
    Write-Host "Reading $Port locally (no website/API required). Ctrl+C stops."
  } else {
    Write-Host "Reading $Port -> $Server/api/pressure-map/frame. Requires the local pressure-map API. Close Arduino Serial Monitor. Ctrl+C stops."
  }
  while ($true) {
    try { $mapLine = $mapSerial.ReadLine().Trim() }
    catch [TimeoutException] { continue }
    if (-not $mapLine.StartsWith('{')) { continue }
    try { $mapPacket = $mapLine | ConvertFrom-Json } catch { continue }
    if ($mapPacket.deviceId -ne 'bitebud-map-v1' -or @($mapPacket.raw).Count -ne 4) { continue }
    if ($SerialOnly) { Write-Output $mapLine; continue }
    # Assign source here: serial hardware is never posted as the browser simulation.
    $mapBody = @{ source = 'hardware'; deviceId = 'bitebud-map-v1'; raw = @($mapPacket.raw) } | ConvertTo-Json -Compress
    $mapContent = [System.Net.Http.StringContent]::new($mapBody, [Text.Encoding]::UTF8, 'application/json')
    $mapResponse = $null
    try {
      $mapResponse = $mapClient.PostAsync("$Server/api/pressure-map/frame", $mapContent).GetAwaiter().GetResult()
      if (-not $mapResponse.IsSuccessStatusCode) {
        Write-Warning ($mapResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult())
      } else {
        $mapCount++
        if ($mapCount % 20 -eq 0) { Write-Host "Forwarded $mapCount frames; raw: $($mapPacket.raw -join ', ')" }
      }
    } catch {
      Write-Warning ('Server unavailable: ' + $_.Exception.Message)
      # Discard queued old frames; a reconnect must represent current contact, not a replay.
      $mapSerial.DiscardInBuffer()
    } finally {
      if ($mapResponse) { $mapResponse.Dispose() }
      $mapContent.Dispose()
    }
  }
} finally {
  if ($mapSerial.IsOpen) { $mapSerial.Close() }
  $mapSerial.Dispose()
  $mapClient.Dispose()
}
