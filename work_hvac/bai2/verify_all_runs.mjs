import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const segs = JSON.parse(fs.readFileSync(path.join(DIR, "decoded_segments.json"), "utf8"));
const blocks = JSON.parse(fs.readFileSync(path.join(DIR, "classified_blocks.json"), "utf8"));

// Check S28 (weird W=2264.82 L=950.00 in decode_lines.mjs!)
console.log("=== CHECK S28 (W=2264.82 L=950.00) ===");
const s28 = segs.pairs.find(p => p.W > 2250);
console.log(JSON.stringify(s28, null, 2));

// Check ALL 67 pairs to see if ANY other pair had swapped width/length (short stub where len < W!)
console.log("\n=== CHECK ALL SEGMENTS WHERE W NOT STANDARD OR LEN < W ===");
const stdW = new Set([350, 550, 700, 750, 900, 950, 1000, 1200, 1250, 1300, 1500, 1700, 1850, 2200]);
for (const p of segs.pairs) {
  const nearStd = [...stdW].some(w => Math.abs(p.W - w) < 2);
  if (!nearStd || p.len < 600) {
    console.log(`  W=${p.W} L=${p.len} ang=${p.angDeg}° (${p.c1.x},${p.c1.y})->(${p.c2.x},${p.c2.y}) [${p.h1},${p.h2}] stdW=${nearStd}`);
  }
}

// Check the 35 unpaired lines: verify every one is accounted for (either long duct pair 1CCBE/BF, 1CDCF/CD, or flange/cap/riser cross-line)
console.log("\n=== ACCOUNT FOR ALL 35 UNPAIRED LINES ===");
for (const u of segs.unpaired) {
  console.log(`  [${u.handle}] L=${u.len.toFixed(2)} ang=${u.angDeg.toFixed(2)}° (${u.x1.toFixed(2)},${u.y1.toFixed(2)})->(${u.x2.toFixed(2)},${u.y2.toFixed(2)})`);
}
