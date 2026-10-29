# BiteBud build V1 verification

Date: October 29, 2026.

**Scope:** these results describe the full local development copy. The website/dashboard/API changes and browser-test script are intentionally excluded from the hardware/documentation push. A fresh clone of that commit will not contain the new dashboard, its API, or the additional software tests. Firmware and hardware-only serial inspection remain available.

Story: a four-region frame reaches the local API, is normalized only after calibration, and updates the U-shaped map and contact-episode count. Physical frames are intended to arrive through USB serial; software simulation uses a separate state.

| Boundary | Result | Evidence / limit |
| --- | --- | --- |
| Nano firmware compilation | PASS | Arduino CLI 1.5.1; `arduino:esp32` core `2.0.18-arduino.5`; FQBN `arduino:esp32:nano_nora` |
| Firmware footprint | PASS | 293,341 bytes program storage; 30,928 bytes global RAM reported by compiler |
| Unit + API tests | PASS | `npm test`: 23 tests, zero failures |
| Production bundle | PASS | `npm run build`; existing 3D-viewer chunk-size warning remains |
| Windows development startup | PASS | `npm run dev` starts API on 8787 and Vite on 5173 |
| Browser -> simulated frame API -> rendered region | PASS | Browser automation held Z2, observed Z2, then released and observed one completed episode |
| Simulation/hardware separation | PASS | Browser hardware view does not permit calibration from simulation data; API test confirms separate state |
| Hardware calibration storage | PASS in isolated API test | Baseline persisted and restored through a new router; actual sensor capture untested |
| Stale data, weak/noisy calibration, mixed contacts, debounce | PASS in synthetic tests | No assertion about material behavior |
| PowerShell bridge parsing | PASS | Parsed with the PowerShell AST parser without syntax errors |
| Mobile rendering | PASS | 390 px viewport, no horizontal document overflow |
| Browser exceptions | PASS | Zero page exceptions during the browser verification |
| Actual USB bridge / upload | NOT VERIFIED | No serial device detected; no physical connection tested |
| Continuous-film location accuracy | NOT VERIFIED | Requires the actual electrode stack, cover, backing, and repeated physical presses |
| Infant use or oral suitability | NOT VALIDATED | This package is exclusively a tabletop experiment |

Screenshots: `dashboard-simulation.png` and `dashboard-mobile.png`. The generated product render and circuit drawing are not photographs of assembled hardware.

Test commands:

```text
npm test
npm run build
node scripts/verify-pressure-map.cjs
```

The optional browser script requires Playwright and an installed compatible browser. This session used the bundled Playwright runtime with `BITEBUD_BROWSER_CHANNEL=msedge`; neither is added as an application dependency. It does not post simulated samples to the hardware state.

The Arduino CLI/core used for verification are isolated in the operating-system temp directory `bitebud-arduino-cli-v1`, not installed globally. Upload the sketch using Arduino IDE as described in the build guide; compilation alone does not establish functional hardware.
