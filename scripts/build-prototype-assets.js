import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const out = path.resolve("output/prototype-v1");
await mkdir(out, { recursive: true });
const colors = ["#b34835", "#9c741b", "#35734b", "#276d96"];
const svg = (width, height, content) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fffefa"/><style>text{font-family:Arial,sans-serif;fill:#24372e;font-size:18px}.title{font-size:34px;font-weight:700}.small{font-size:15px}.tiny{font-size:13px}.bold{font-weight:700}.wire{fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}</style>${content}</svg>`;
const ground = (x,y) => `<path class="wire" stroke="#46554b" d="M${x} ${y}v12m-14 0h28m-10 6h-8m2 6h4"/>`;
const dot=(x,y,c="#46554b")=>`<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`;
const circuits=colors.map((color,i)=>{
  const x=190+i*310;
  return `<text x="${x}" y="150" text-anchor="middle" class="bold">Z${i+1} → A${i}</text>
  <path class="wire" stroke="#c4513b" d="M${x} 195v45"/>${dot(x,195,"#c4513b")}
  <rect x="${x-35}" y="240" width="70" height="100" rx="8" fill="#e6e7de" stroke="#526750" stroke-width="2"/>
  <path class="wire" stroke="#526750" d="M${x-23} 318l46 -55m-10 0h10v10"/>
  <text x="${x+44}" y="273" class="small">Film</text><text x="${x+44}" y="297" class="small">region ${i+1}</text>
  <path class="wire" stroke="${color}" d="M${x} 340v65h70"/>${dot(x,405,color)}
  <rect x="${x+70}" y="394" width="55" height="22" fill="white" stroke="${color}" stroke-width="2"/><text x="${x+96}" y="382" text-anchor="middle" class="small">1 kΩ</text>
  <path class="wire" stroke="${color}" d="M${x+125} 405h65"/>${dot(x+155,405,color)}
  <text x="${x+183}" y="440" text-anchor="middle" class="bold">A${i}</text>
  <path class="wire" stroke="#46554b" d="M${x} 405v85"/><rect x="${x-11}" y="490" width="22" height="65" fill="white" stroke="#46554b" stroke-width="2"/>
  <text x="${x-17}" y="585" text-anchor="middle" class="small">10 kΩ</text><path class="wire" stroke="#46554b" d="M${x} 555v75"/>${ground(x,630)}
  <path class="wire" stroke="#46554b" d="M${x+155} 405v95m-16 0h32m-32 10h32m-16 0v120"/>
  <text x="${x+155}" y="555" text-anchor="middle" class="small">100 nF</text>${ground(x+155,630)}
  <text x="${x-28}" y="690" class="tiny">ADC lead: ${["red","yellow","green","blue"][i]} label A${i}</text>`;
}).join("");
const schematic=svg(1500,1000,`<text x="60" y="65" class="title">BiteBud V1 · Electrical wiring</text>
<text x="60" y="100">Arduino Nano ESP32 · USB powered · Four regions on ONE continuous sheet</text>
<path class="wire" stroke="#c4513b" d="M90 195H1315"/><text x="60" y="185" class="bold">3V3</text>
<text x="680" y="185" text-anchor="middle" class="small">Common opposing copper electrode → Nano 3V3</text>
<rect x="130" y="220" width="1060" height="145" rx="15" fill="none" stroke="#a7aea1" stroke-dasharray="8 7"/>
${circuits}
<rect x="60" y="740" width="1380" height="205" rx="15" fill="#eef1e8"/>
<text x="85" y="775" class="bold">Exact connections (use Arduino labels, not bare GPIO numbers)</text>
<text x="85" y="810">Z1 node → 1 kΩ → A0 · Z2 node → 1 kΩ → A1 · Z3 node → 1 kΩ → A2 · Z4 node → 1 kΩ → A3</text>
<text x="85" y="845">Each node → its own 10 kΩ → GND. Each ADC pin → its own 100 nF → GND. All GND symbols join Nano GND.</text>
<text x="85" y="880">Dashed box = four measured regions in one film, NOT four purchased sensors. Contacts are electrically coupled.</text>
<text x="85" y="915">Starting resistor values require bench validation. USB only; never connect this circuit to 5V/VBUS/VIN.</text>
<text x="60" y="980" class="small">Tabletop build reference · Not for infant use · Film properties and soft-cover pressure spreading require physical testing.</text>`);
await writeFile(path.join(out,"wiring.svg"),schematic);

// A 240-degree annular insert: open tips at the rear, closed arc toward the handle.
const polar=(r,deg)=>[r*Math.cos(deg*Math.PI/180),r*Math.sin(deg*Math.PI/180)];
const annulus=(outer,inner,start,end)=>{
  const points=[];
  for(let a=start;a<=end;a+=2) points.push(polar(outer,a));
  points.push(polar(outer,end));
  for(let a=end;a>=start;a-=2) points.push(polar(inner,a));
  points.push(polar(inner,start));
  return points.map(([x,y])=>`${(75+x).toFixed(2)},${(55-y).toFixed(2)}`).join(" ");
};
const template=`<svg xmlns="http://www.w3.org/2000/svg" width="150mm" height="200mm" viewBox="0 0 150 200">
<style>text{font-family:Arial,sans-serif;fill:#24372e;font-size:3px}.title{font-size:5px;font-weight:700}</style>
<rect width="150" height="200" fill="white"/><text x="10" y="10" class="title">BiteBud V1 · Cut/layout template</text>
<text x="10" y="17">Print at 100% / actual size. Verify 50 mm scale bar before cutting.</text>
<polygon points="${annulus(50,30,150,390)}" fill="#eeeeea" stroke="#555" stroke-width=".3"/>
<polygon points="${annulus(47,33,152,388)}" fill="none" stroke="#222" stroke-dasharray="1 1" stroke-width=".3"/>
${colors.map((color,i)=>`<polygon points="${annulus(45,35,154+i*60,206+i*60)}" fill="${color}" fill-opacity=".45" stroke="${color}" stroke-width=".2"/>`).join("")}
${[180,240,300,360].map((deg,i)=>{const [x,y]=polar(40,deg);return `<text x="${75+x}" y="${56-y}" text-anchor="middle">Z${i+1}</text>`;}).join("")}
<path d="M32 80Q25 110 42 130M118 80Q125 110 108 130" fill="none" stroke="#e2a75f" stroke-width="8"/>
<rect x="32" y="120" width="86" height="61" rx="4" fill="#fff2db" stroke="#cd8c45" stroke-width=".4"/>
<rect x="35" y="123" width="80" height="55" fill="none" stroke="#b09067" stroke-dasharray="1 1" stroke-width=".3"/>
<rect x="42" y="128" width="18" height="45" fill="#8bb6b4" stroke="#456" stroke-width=".3"/><text x="51" y="140" text-anchor="middle">Nano</text><text x="51" y="145" text-anchor="middle">ESP32</text><text x="51" y="170" text-anchor="middle">USB ↓</text>
<rect x="70" y="130" width="30" height="40" fill="#e1d4a8" stroke="#987" stroke-width=".3"/><text x="85" y="145" text-anchor="middle">Readout</text><text x="85" y="150" text-anchor="middle">board</text>
<text x="75" y="116" text-anchor="middle">Fit/layout suggestion; measure your actual components.</text>
<path d="M10 189h50m-50 -2v4m50 -4v4" stroke="#222" stroke-width=".4"/><text x="35" y="196" text-anchor="middle">50 mm</text>
<text x="75" y="190">Solid gray: backing. Dashed: film/common foil.</text><text x="75" y="196">Color: pads. This is not an infant-use design.</text></svg>`;
await writeFile(path.join(out,"cut-template.svg"),template);
console.log(`Wrote wiring.svg and cut-template.svg to ${out}`);
