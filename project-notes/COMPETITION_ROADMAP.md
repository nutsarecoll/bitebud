# BiteBud Competition Roadmap, Complete Timeline & Future Prototype Plan

Master plan 2026-27. Prepared 16 August 2026. Team context: Jack Wang + Dhruv
Kumar. Version 1.0.

This is the text transcription of
`../output/pdf/bitebud_project_roadmap.pdf`. It preserves the planning snapshot
contained in that PDF. For hardware and calibration work completed after the
PDF was prepared, see `BUILD_LOG.md` and `HARDWARE.md`.

A single operating plan for turning the current pressure-sensing bench system
into a credible, competition-ready demonstration - while keeping safety,
evidence, and realistic claims at the center.

## North star

Prove that a sensor-enabled teether concept can turn chewing patterns into
simple, non-diagnostic insights for caregivers.

## Current position at the time of the PDF

Dashboard and sensor firmware exist. Breadboard wiring is prepared. Hardware
validation and calibration are the immediate next steps.

## Recommended competition slate

| Priority | Competition | Role in the plan |
|---|---|---|
| 1 | Conrad Challenge | Flagship target: strongest fit for a working innovation, website, business case, and 3-5 minute demonstration. |
| 2 | Diamond Challenge | Venture target: converts the same evidence into a 3-5 page narrative and 60-second introduction. |
| 3 | Blue Ocean | Pitch target: reuses the business story in a strategy-led video due 21 February 2027. |

High-level timeline:

| Date | Milestone |
|---|---|
| Aug 2026 | Bench build begins |
| Sep 2026 | Calibrated V1 |
| Nov 2026 | Demo V2 |
| Jan 2027 | Major submissions |
| Apr-May 2027 | Final rounds |

Planning status: Conrad, Diamond, and Blue Ocean are the recommended 2026-27
slate. The local files do not confirm registration in any event. Confirm team
eligibility and registration before treating the slate as committed.

## 1. Foundation

### What we are building - and what already exists

BiteBud is a smart infant-teething and wellness-tracking concept. The defensible
core is a soft teether concept with pressure sensing plus a parent-facing
dashboard that summarizes chewing frequency, relative intensity, duration, and
changes over time. It supports awareness; it does not diagnose illness or
determine why a baby is crying.

| Component | Description |
|---|---|
| Physical concept | Soft, chew-safe product direction with embedded pressure sensing. The current hardware is strictly a tabletop rig. |
| Data layer | Press/chew event detection, event duration, relative intensity, usage history, calibration, and future pressure zones. |
| Caregiver experience | A reassuring dashboard with trends, daily summaries, and notable-change prompts in plain language. |

### Evidence-based current status

| Area | What is complete | Next proof required |
|---|---|---|
| Product framing | Problem, core solution, competitor position, safe-claim language, and future cap boundary documented. | Freeze one competition-ready claim set and one target-customer definition. |
| Software | React dashboard, local API, live stream, persistent readings, calibration, session summaries, reset, and sensor engine tests. | Run against physical hardware; capture stable recordings and screenshots. |
| Firmware | Arduino Nano ESP32 firmware path and Wi-Fi/server setup documented. | Upload to the arriving board and confirm end-to-end readings. |
| Hardware | A201-25 sensor, breadboard, jumper wires, resistor, cable, and wiring layout prepared; Arduino was pending as of 13 Aug. | Complete 3.3 V divider, verify wiring, then characterize noise and repeatability. |
| Validation | Survey themes and parent/professional questions exist; one internal claim says 100% found alerts useful. | Recover sample size/method or do not use the percentage publicly. Run structured interviews. |

### Definition of success for this cycle

A safe bench demo that detects and summarizes repeatable pressure patterns; a
credible product model or rendering; 5-10 documented discovery interviews; and
one reusable evidence package that can be adapted for all three competitions.

## 2. Competitions

### One project, three competition entries

The slate prioritizes fit and reuse. Conrad rewards the full innovation journey;
Diamond forces a concise venture case; Blue Ocean sharpens differentiation. A
single evidence library - data, interviews, prototype media, market logic, and
safe claims - feeds every submission.

| Priority / competition | Why BiteBud fits | Key 2026-27 dates | Entry package to prepare |
|---|---|---|---|
| 1 / Conrad Challenge - flagship | Purpose-driven STEM innovation with prototype, business plan, website, and video. BiteBud fits Health & Nutrition. | Official site confirms the 2026-27 season and annual Aug-Apr cadence. Exact new-cycle milestones were not published on the reviewed official pages; verify in the portal. Internal targets: activation complete 30 Oct; final package 18 Dec; submit no later than 7 Jan. | Lean Canvas; innovation brief; 3-5 min demo video; public website; prototype evidence; business/impact model. |
| 2 / Diamond Challenge - venture | Strong fit for a business or social innovation concept with proof of progress. Recommended track: Business Innovation, unless impact is explicitly prioritized. | 16 Sep: window opens. 14 Jan, 5 PM ET: submission. 10 Feb: advancing teams. 9 Mar: finalists. 29-30 Apr: Summit. | 3-5 page concept narrative; 60-sec team/concept video; later 5-min pitch and <=15-slide deck. |
| 3 / Blue Ocean - pitch | Virtual and efficient. Good place to demonstrate how BiteBud combines soothing, teething-specific sensing, and simple insights differently from monitors and traditional teethers. | Registration open. 21 Feb: pitch due. 5 Apr: Top 100. 22 Apr: Top 30. 4 May: Top 10. 13 May: winners. | Mini-course; strategy canvas; noncustomer analysis; eliminate-reduce-raise-create grid; <=5-min YouTube pitch. |

### Competition decision rules

| Rule | Decision |
|---|---|
| Reuse before adding | Every new artifact must strengthen at least two competitions or the prototype itself. |
| Evidence before polish | Do not spend a week on video production while repeatability, user evidence, or basic economics remain weak. |
| Safety before realism | No infant or in-mouth testing with the current rig. Show a safe tabletop demo and clearly separate future product design. |
| Registration checkpoint | By 18 September, confirm eligibility, advisor/coach, team roster, fees, disclosure/IP rules, and exact Conrad dates. |
| Stop condition | If the bench system is not stable by 27 September, pause multi-zone work and focus on signal conditioning plus a truthful single-sensor demo. |

## 3. Master timeline

### Build first, package once, submit three ways

Dates below are internal working deadlines unless marked as organizer dates.
They include buffer so technical setbacks do not immediately become submission
crises.

| Window | Prototype + evidence | Competition + story | Exit gate |
|---|---|---|---|
| 16-23 Aug | Receive/confirm Nano; inspect wiring; upload firmware; first live stream. | Confirm team, advisor/coach, age/eligibility, and ownership of existing work. Create master evidence folder. | Live dashboard receives real A201 readings; no unsafe wiring. |
| 24 Aug-6 Sep | Noise check; baseline; light/medium/strong trials; event count/duration/reset; log failures. | Draft one-sentence problem, customer, value proposition, and non-diagnostic claim set. | V1 detects 20 repeated press trials with documented results. |
| 7-20 Sep | Known-weight or scale calibration; repeatability test; freeze demo script V1. | 5 caregiver interviews + 2 professional interviews. 16 Sep: Diamond opens. | Go/no-go on simple divider. Evidence log includes method and limitations. |
| 21 Sep-4 Oct | If needed, choose op-amp/Quickstart path. If stable, begin pressure-load puck and enclosure sketch. | Competitor matrix; market sizing assumptions; basic costs; register events. | Measurement path frozen; no new sensor purchases without a test reason. |
| 5-18 Oct | Build V2 enclosure/press fixture; capture clean dashboard sessions. | Lean Canvas; innovation brief outline; Diamond narrative outline; website content map. | 30 Oct internal Conrad activation target is on track. |
| 19 Oct-8 Nov | Add zone architecture in software; add hardware sensors only if justified and available. | Finish interviews to 10 total; write insights memo; validate trust and cleaning concerns. | V2 is demoable in under 90 seconds. |
| 9-29 Nov | Reliability sprint: 100 press cycles; reconnect/restart test; photo/video day. | Draft shared pitch deck; prototype evidence appendix; risk/safety page. | Data and media library frozen v1. |
| 30 Nov-18 Dec | Fix only competition-critical bugs; create backup recorded demo. | Conrad package complete internally 18 Dec; Diamond narrative and 60-sec video draft. | Holiday buffer begins with submission-ready files. |

### Submission season and final-round preparation

| Window | Primary work | Hard date / decision | Output |
|---|---|---|---|
| 19 Dec-7 Jan | Final QA on Conrad brief, website, and 3-5 min demo. Submit before organizer deadline. | 7 Jan internal target; verify official portal deadline. | Conrad submission receipt + archived copy. |
| 8-14 Jan | Diamond narrative proofread, 60-sec intro video, links, and forms. | 14 Jan, 5 PM ET organizer deadline. | Diamond submission receipt + archived copy. |
| 15 Jan-7 Feb | Complete Blue Ocean mini-course and mandatory strategy frameworks. Improve demo based on feedback. | No major hardware redesign unless a finalist requirement demands it. | Strategy canvas, ERRC grid, noncustomer analysis, pitch script. |
| 8-21 Feb | Record, edit, accessibility check, upload, and test public video URL. | 21 Feb local time organizer deadline. | Blue Ocean submission + YouTube link. |
| 22 Feb-9 Mar | Prepare 5-min pitch and <=15-slide deck; rehearse Q&A. | Diamond: 10 Feb advancing teams; 9 Mar finalists. | Reusable pitch deck v2 + 30-question Q&A bank. |
| 10 Mar-4 Apr | If advanced, upgrade demo reliability and booth story. Otherwise publish a project retrospective and continue prototype work. | Blue Ocean Top 100 announced 5 Apr. | Final-round demo kit or post-cycle evidence report. |
| 5-30 Apr | Competition presentations and contingency planning for overlapping travel/online requirements. | Blue Ocean Top 30: 22 Apr. Diamond Summit: 29-30 Apr. | Final pitch, tested backup video, travel/demo checklist. |
| 1-13 May | Blue Ocean audience outreach and final announcements. | Top 10: 4 May. Winners: 13 May. | Cycle closeout, lessons learned, 2027-28 decision. |
| Jun-Aug 2027 | Product-design research only after cycle review: safe materials, enclosure architecture, cleaning, power, and regulatory pathway. | Gate: decide whether to continue as research prototype, venture, or both. | Prototype V3 requirements and budget - not an infant-ready product. |

### Critical path

| Date | Milestone |
|---|---|
| 23 Aug | Real data |
| 20 Sep | Calibrated V1 |
| 29 Nov | Evidence frozen |
| 14 Jan | Diamond filed |
| 21 Feb | Blue Ocean filed |
| 29 Apr | Finals ready |

Schedule protection: Treat 18 December as the true finish line for the shared
narrative, proof, website, and long-form video. January and February should be
adaptation and QA, not invention.

## 4. Future prototype roadmap

Each version answers one question. Advancement is earned by evidence, not by
adding more sensors.

| Version / timing | Question answered | Build scope | Pass criteria |
|---|---|---|---|
| V0 / complete - Software simulator | Can the data experience work before hardware arrives? | Mock readings; event detection; force mapping; history; calibration; session summary; future zone model. | Tests pass; dashboard shows coherent live and saved sessions. |
| V1 / Aug-Sep 2026 - Single-sensor bench rig | Can BiteBud reliably detect relative pressure events? | A201-25 + 47 kOhm divider + Nano ESP32 + USB + flat load pad. | Stable baseline; repeatable event detection; light/medium/strong separation; documented limitations. |
| V1.5 / conditional - Signal-quality upgrade | Is conditioning required for useful repeatability? | Rail-to-rail op-amp circuit or Tekscan Quickstart Board; optional load concentrator. | Lower noise and more consistent calibration than V1 in the same trial protocol. |
| V2 / Oct-Nov 2026 - Competition demo | Can judges understand the interaction in 90 seconds? | Rigid press fixture or compact external enclosure; strain relief; reliable reconnect; polished dashboard; backup recording. | 100-cycle bench test; clear demo; recovery after restart; no exposed claim ambiguity. |
| V2.5 / Nov 2026-Jan 2027 - Multi-zone proof | Does location add insight worth the complexity? | Additional pressure sensors and zone-specific software only if the single-sensor system is stable. | Distinct zone labels with acceptable cross-talk; clear caregiver value. Otherwise defer. |
| V3 / Summer 2027+ - Product-design study | What would a real product require? | Separate soft outer-form research; sealed electronics architecture; cleaning, power, sensor loading, and manufacturing review. | Engineering requirements reviewed by qualified safety/materials/regulatory experts. No infant use. |
| Future module / gated optional cap | Do temperature/motion trends add enough value to justify a wearable? | Soft wearable research for skin-temperature and motion trends; crying-event detection remains secondary. | Only after teether validation, caregiver demand, privacy review, and skin-interface safety work. |

### Prototype test protocol - minimum evidence set

| Test | Required record |
|---|---|
| 1. Baseline | 2 minutes untouched; record average, range, drift. |
| 2. Repeatability | 20 trials each at light, medium, and strong reference loads. |
| 3. Events | Verify count, duration, threshold crossing, and no double-counting. |
| 4. Reliability | 100-cycle session plus unplug/reconnect and server restart. |
| 5. Calibration | Use known weights or a kitchen scale; report setup and uncertainty. |
| 6. Demo | 90-second live path plus an offline backup video and screenshots. |

## 5. Execution

### Operating system: weekly work, gates, and shared assets

| Workstream | Weekly owner action | Shared deliverable |
|---|---|---|
| Hardware + firmware | Run the planned protocol; log wiring, versions, calibration, failures, and photos. | Evidence log, parts list, test tables, reproducible setup guide. |
| Software + data | Keep dashboard stable; prioritize real sensor reliability, exportable evidence, and demo recovery. | Tagged demo build, screenshots, sample sessions, automated test results. |
| User + market | Conduct scripted interviews; separate observations from assumptions; avoid leading questions. | Interview notes, insight summary, customer/beneficiary definition, trust requirements. |
| Competition writing | Maintain one master narrative and adapt length/format rather than rewriting facts. | Claim sheet, competition matrix, narrative, Lean Canvas, economics. |
| Media + pitch | Capture progress continuously; script from evidence; time every version. | 60-sec intro, 3-5 min demo, <=15-slide deck, Q&A bank. |
| Safety + ethics | Review every claim and demo for non-diagnostic wording, privacy, and prototype boundaries. | Safety statement, limitations, data/privacy assumptions, prohibited-demo checklist. |

### Weekly rhythm

| When | Action |
|---|---|
| Mon / choose | Select the one technical risk and one story risk that matter most this week. |
| Midweek / test | Run a repeatable test or interview; save raw evidence and notes. |
| Fri / integrate | Update the dashboard, evidence log, master narrative, and risk register. |
| Sun / review | Score the exit gate, decide next week, and back up the demo package. |

### Decision gates

| Gate | Date | Go if... | If not... |
|---|---|---|---|
| G1 / signal | 6 Sep | Real readings are stable enough to test. | Fix wiring, firmware, or sampling before calibration. |
| G2 / V1 | 27 Sep | Levels and events repeat acceptably. | Trigger V1.5 signal-conditioning comparison. |
| G3 / scope | 18 Oct | Single sensor tells a clear story. | Defer multi-zone work; strengthen evidence and fixture. |
| G4 / evidence | 29 Nov | Data, interviews, costs, media, and limits are documented. | Cut nonessential features; close evidence gaps. |
| G5 / submit | 18 Dec | Conrad package passes factual, link, timing, and safety review. | Use buffer; no speculative claims to fill gaps. |

## 6. Immediate plan, risks, and source notes

### Next 14 days

| When | Action | Done when |
|---|---|---|
| Today | Confirm whether Conrad, Diamond, and Blue Ocean are the actual team choices; record registration status and advisor/coach. | Competition register has owners, credentials, fees, and exact dates. |
| Within 48 hours of Nano arrival | Complete power-off wiring check, connect board, upload firmware, and capture first live session. | Timestamped screenshot/video and setup notes saved. |
| Week 1 | Run baseline and repeat-press tests; do not tune thresholds only by eye. | Raw trial table plus chosen threshold rationale. |
| Week 2 | Run light/medium/strong and known-load trials; draft 90-second demo. | V1 gate decision and a truthful limitations paragraph. |
| By 18 Sep | Register/confirm eligibility; conduct first 5 caregiver interviews; choose Diamond track. | No unresolved eligibility or team/IP issues. |

### Top risks and controls

| Risk | Control |
|---|---|
| Unsafe interpretation | Use relative intensity and trend language. State clearly that the rig is not for in-mouth use and BiteBud is not diagnostic. |
| Sensor nonlinearity / loading variability | Use a flat load concentrator, a repeatable fixture, documented calibration, and a V1.5 conditioning comparison only if needed. |
| Weak validation evidence | Report sample size and method. Never use the internal "100%" survey claim unless its source and denominator are recovered. |
| Scope creep | Cap and temperature/motion sensing remain future work. Multi-zone is conditional. |
| Deadline collision | Finish shared evidence by 29 Nov and shared narrative by 18 Dec; maintain backup demo media and submission receipts. |
| Public disclosure / IP | Review each competition's disclosure terms before posting technical details; do not publish secrets or personal caregiver data. |

### Source and date notes

Project sources: local BiteBud README, project context, workflow, hardware plan,
future prototype plan, firmware/software structure, and Git history, reviewed 16
Aug 2026. Hardware arrival status is last documented 13 Aug 2026.

Competition sources:

- Conrad Challenge official site: 2026-27 season confirmed; annual
  August-April cadence; exact new-cycle dates not available on reviewed official
  pages: <https://conrad.spacecenter.org/about-challenge/>.
- Diamond Challenge official 2027 competition page:
  <https://diamondchallenge.org/competition/>.
- Blue Ocean official 2027 competition page:
  <https://blueoceancompetition.org/compete/>.

Assumptions to confirm: team members remain eligible high-school students; Jack
Wang and Dhruv Kumar are the active team; an adult advisor/coach is available;
no competition registrations are yet confirmed; the Nano arrival status may
have changed; and competition rules remain subject to organizer updates.

---

Planning document - not a medical or product-safety validation.
