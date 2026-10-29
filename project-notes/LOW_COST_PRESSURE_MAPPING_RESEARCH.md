# BiteBud: low-cost continuous-sheet pressure mapping

Research date: October 29, 2026. Scope: a student-built, hand-pressed tabletop demonstration of the team's U-shaped concept. This is a proposed architecture, not tested BiteBud hardware, a purchase order, an infant-use design, or a production-cost estimate.

## Decision

Investigate one U-shaped sheet of Velostat/Linqstat with patterned electrodes, reusing the Nano ESP32 and local dashboard. Do not buy 8–12 packaged force sensors for this experiment. One continuous sensing film can contain multiple electrically measured regions; those regions still require electrodes and readout channels.

Budget approximately **$50–$100 in additional cash** for a basic eight-region U-shaped demonstration, assuming student labor, existing tools, USB power, a laptop, existing Nano, and access to inexpensive or school-provided enclosure fabrication. A four-region flat feasibility test could be approximately **$25–$50** with reused supplies. These are purchasing allowances, not evidence that the proposed sensor will work without revisions. Commercial silicone molding, a polished seamless cover, paid engineering, and infant-use validation are excluded.

The earlier $200–$460 estimate described individually purchased sensors and more expensive fabrication. It was not a demonstrated minimum for the user's preferred continuous-sheet architecture. Lowering cost changes the engineering tradeoffs: more fabrication and calibration effort, less assured precision, and a simpler exterior.

## What the evidence supports

- Adafruit's pressure-sensitive sheet is listed at **$4.95**, 280 × 280 mm and approximately 0.1 mm thick. Its resistance falls when compressed. The manufacturer page showed **out of stock** when reviewed; a displayed price is not a confirmed obtainable cart. [Manufacturer page](https://www.adafruit.com/product/1361)
- A 2023 research dissertation demonstrated a **16 × 16 Velostat matrix** with scanned readout, while documenting substantial crosstalk. This supports the sensing principle, not equivalent performance in a U-shaped cover or in an infant's mouth. [Research](https://arxiv.org/abs/2307.01690)
- FlexiTac's 2026 research uses patterned flexible circuits around a Velostat layer. It provides a possible later route to a repeatable fabricated laminate, but its geometry and manufacturing process would need adaptation. It is not a ready-made BiteBud array. [Research](https://arxiv.org/abs/2604.28156), [project](https://flexitac.github.io/)
- Experimental work reports time-dependent behavior and interaction between nearby contacts in Velostat sensors. That makes location discrimination and repeatability essential feasibility tests. [2020 characterization](https://pmc.ncbi.nlm.nih.gov/articles/PMC7761878/)
- A 2025 experiment found that layering could improve force-estimation error in its own setup. It is not grounds for promising the same improvement in BiteBud; do not add layers before testing the simplest construction. [2025 experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC12115966/)

## What 'one sheet' does and does not mean

One continuous piece of sensitive material is feasible. One ordinary resistance measurement from two terminals is insufficient to uniquely determine arbitrary contact location and force across the U. Several spatial measurements, or a substantially more complex reconstruction system, are needed.

The lowest-risk low-cost experiment is **one sheet with four, then eight, electrode-defined regions**. It is a single physical sensing assembly with multiple electrical channels. If the requirement instead means no spatial electrode pattern at all, this recommendation does not meet that requirement; electrical impedance tomography is the more relevant research route.

An eight-region sensor estimates an area around the arc. It does not automatically identify a tooth, reveal which gum hurts, resolve millimeters, or reliably separate simultaneous contacts. A smooth heatmap must not imply more resolution than the measured regions support.

## Candidate approaches

| Approach | Fits one integrated layer? | Main issue | Assessment |
| --- | --- | --- | --- |
| Velostat with hand-cut electrode regions | Yes: one continuous film, multiple contacts | Crosstalk, drift, fabrication variation | Best first cost-reduction experiment |
| Velostat row/column matrix | Yes | Scanning, ghost signals, especially under multiple contacts | Upgrade after basic discrimination works |
| Manufactured flex-circuit/Velostat laminate | Yes | Layout, tooling/ordering, minimum quantities | Quote after proving a flat coupon |
| Electrical impedance tomography (EIT) | Yes, with perimeter contacts | Reconstruction, geometry model/training, and analog electronics | Research path; not the lowest-development-effort option |
| SoftPot membrane potentiometer | Single strip | Primarily position, not calibrated force; stock geometry does not match the U | Poor direct substitute |
| One ordinary force sensor | One sensor | Does not uniquely locate contacts across the surface | Does not satisfy the requirement |

EIT research reconstructs tactile information from electrical measurements and demonstrates the associated learning/data requirements. It does not establish that a two-wire sheet and a few lines of code give a usable pressure map. [EIT research](https://arxiv.org/abs/2411.12658)

SparkFun's 50 mm SoftPot is listed at $8.95 and senses position along a strip; a stock straight part is not a U-shaped pressure array. [Product description](https://www.sparkfun.com/softpot-membrane-potentiometer-50mm.html)

## Proposed experimental construction

Use a replaceable layered insert so failed materials can be changed without destroying the body:

```text
Hand-applied test load
        |
Thin, removable soft cover
        |
Electrode pattern on flexible insulating carrier
        |
One continuous U-shaped Velostat film
        |
Opposing electrode layer
        |
Supported U-shaped backing
```

For a simple first coupon, use separated sensing electrodes on one face and a common opposing electrode. Route leads on an insulated carrier so they do not become unintended sensing areas. This is an engineering hypothesis to test: lateral conduction and pressure spreading can still couple neighboring readings. Do not describe this construction as crosstalk-free.

Use a voltage-divider readout for each measured region with resistors selected from measured resistance under the intended test loads. Choose the resistance after measuring the actual coupon, rather than asserting that one value suits every assembly. Keep signal voltages within the board's supported input range. An analog multiplexer switches among region voltages; its settling behavior, ADC loading, and leakage must be checked. It does not remove the material's crosstalk.

For four regions, use the Nano ESP32's A0–A3 inputs. Arduino identifies these as ADC1 channels and warns about simultaneous Wi-Fi use of ADC2 inputs. An eight-region experiment can switch into A0 through one multiplexer instead of buying multiple external ADC boards. [Arduino documentation](https://docs.arduino.cc/tutorials/nano-esp32/cheat-sheet/)

The cheapest mechanical layout keeps the sensing insert mostly planar beneath the U-shaped top face. Wrapping sensing over top, bottom, and side surfaces is additional design work; this budget does not assume full three-dimensional coverage. Test the final cover because soft material can spread load and reduce spatial discrimination.

## Eight-region budget

USD. Exact product figures are reference prices; other rows are explicit planning allowances. No order was placed and shipping was not quoted at checkout.

| Purchase/allowance | Low | High |
| --- | ---: | ---: |
| One Velostat sheet, listed price | $4.95 | $4.95 |
| One copper foil sheet, listed price | $4.95 | $4.95 |
| One CD74HC4067 16-channel breakout, listed price | $6.50 | $6.50 |
| Resistors and capacitors | $3.00 | $6.00 |
| Insulating film, spacers, tape | $3.00 | $6.00 |
| Wire/connectors, reusing stock where possible | $0.00 | $5.00 |
| Basic soft cover materials, not a molded finished teether | $5.00 | $15.00 |
| Reused or school-printed support and enclosure | $0.00 | $15.00 |
| Shipping and tax allowance | $10.00 | $20.00 |
| Spare materials and rework | $10.00 | $15.00 |
| **Estimated additional cash** | **$47.40** | **$98.40** |

References: [Velostat](https://www.adafruit.com/product/1361), [copper foil sheet](https://www.adafruit.com/product/4607), [16-channel multiplexer](https://www.sparkfun.com/sparkfun-analog-digital-mux-breakout-cd74hc4067.html).

The foil supplier lists a 12 × 12 inch sheet at $4.95. It can be cut into electrodes; buy the sheet rather than separate prefabricated sensors. The multiplexer supplier lists $6.50 and 2–6 V operation. Run the prototype with compatible 3.3 V logic, not 5 V analog signals into the Nano.

Cost floor assumptions matter. If no tools, wires, enclosure access, or existing computer/board are available, the total increases. Ordering across several suppliers may exceed the shipping allowance. Stock substitutions can change both behavior and price. The table does not price a finished continuous molded silicone cover or guarantee eight-region localization.

## How to spend the least without wasting money

1. Reuse the existing Nano, USB cable, breadboard, laptop, and local server.
2. Buy one sheet and one foil sheet; make small test coupons before cutting the full U. Do not buy a commercial sensor for every region.
3. Prove four regions with A0–A3 first. Add the $6.50 multiplexer only when more regions are justified. A cheaper 8-channel breakout could be quoted, but the verified 16-channel price keeps expansion inexpensive.
4. Use hand-cut electrodes on reused insulating plastic for the first test. Delay manufactured flexible circuits until electrode geometry is established.
5. Use an existing box or a school-printed housing and a removable soft cover. Do not buy casting kits for cosmetic purposes before sensing works.
6. Keep USB power. Batteries and charging hardware provide no essential evidence for the first location demonstration.
7. Extend the existing dashboard rather than commissioning a mobile app. Existing firmware reads one input and requires changes; existing server zone support is limited and does not constitute a completed eight-channel pressure-map implementation.
8. Keep the prototype serviceable. A permanently bonded assembly can make every calibration revision a complete rebuild.

## Validation gates before a U-shaped build

Use a rounded nonconductive test tool and reproducible loading geometry. Do not use infant testing.

- **Basic response:** press each of four known locations and record every channel. Confirm the intended region is distinguishable from adjacent regions.
- **Location discrimination:** repeat presses at different strengths. Use held-out test presses, not just calibration samples. A possible team-set target is at least 90% correct region classification for single contacts well inside region boundaries; this is a proposed acceptance criterion, not achieved performance.
- **Boundaries:** test between regions. Permit 'between zones/uncertain' output rather than forcing a false exact result.
- **Holds and release:** check whether readings creep during a hold and return sufficiently after release. Debounce alone does not solve slow material recovery.
- **Multiple contacts:** press two separated points. If the output is ambiguous, label the limitation and avoid demonstrations that imply reliable multitouch.
- **Cover and flexing:** repeat tests after installing the actual soft cover and curved support. Accuracy measured on a bare flat film does not transfer automatically.

If a continuous sheet cannot discriminate useful regions, revise electrode geometry, support, insulation, and readout. Patterning or dividing the film might help but would change the strict continuous-sheet requirement; discuss that tradeoff before changing the design. Do not treat filtering as a guaranteed cure for fundamentally ambiguous measurements.

## Reporting the result honestly

Until built and tested: 'Proposed low-cost pressure-location sensing using a continuous film.'

After a successful bench experiment: report the measured number of distinguishable regions, actual classification accuracy, test loads, repeatability, and known ambiguities. Use 'relative intensity' unless a suitable calibration establishes a defensible force estimate. No current evidence establishes infant bite localization accuracy, oral suitability of these hobby materials, clinical value, or infant safety.

## Remaining uncertainties

There is no supplier quote for a custom U-shaped manufactured array, no measured BiteBud Velostat prototype, no verified shopping-cart delivery date, and no proven final cover geometry. This research supports a low-cost feasibility experiment; it does not guarantee that $100 buys a finished, polished, precise product.
