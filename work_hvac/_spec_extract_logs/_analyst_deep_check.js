const fs = require("fs");

const RAW_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_raw_entities.json";
const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));

const blockMap = new Map(raw.block_definitions.map((b) => [b.name, b]));
const lines = raw.entities.filter((e) => e.type === "LINE");
const mtexts = raw.entities.filter((e) => e.type === "MTEXT");
const inserts = raw.entities.filter((e) => e.type === "INSERT");

console.log("=== CHECKING Z COORDINATES OF LINES ===");
let nonZeroZLines = 0;
for (const l of lines) {
  if (Math.abs(l.start[2] || 0) > 0.01 || Math.abs(l.end[2] || 0) > 0.01) {
    nonZeroZLines++;
    console.log("Line Z!=0:", l.handle, l.start, l.end);
  }
}
console.log("Lines with Z!=0:", nonZeroZLines);

console.log("\n=== CHECKING ANOMALOUS / SHORT / UNPAIRED LINES ===");
for (const l of lines) {
  const dx = l.end[0] - l.start[0];
  const dy = l.end[1] - l.start[1];
  const len = Math.hypot(dx, dy);
  if (len < 2500) {
    console.log(
      `${l.handle} | len=${len.toFixed(2).padStart(8)} | (${l.start[0].toFixed(2)}, ${l.start[1].toFixed(2)}) -> (${l.end[0].toFixed(2)}, ${l.end[1].toFixed(2)})`
    );
  }
}

console.log("\n=== GROUPING INSERTS BY TYPE ===");
function classifyBlock(name) {
  if (name.includes("AXIAL FAN")) return "AXIAL_FAN";
  if (name.includes("SILENCER")) return "SILENCER";
  if (name.includes("Trouser Piece")) return "TROUSER_PIECE";
  if (name.includes("Giảm Vuông Tròn")) return "SQ_TO_ROUND";
  if (name.includes("Khớp Nối Mềm Tròn")) return "ROUND_FLEX";
  if (name.includes("Van VCD")) return "DAMPER_VCD";
  if (name.includes("Van MFD")) return "DAMPER_MFD";
  if (name.includes("Van NRD")) return "DAMPER_NRD";
  if (name.includes("SQUARE ELBOW")) return "SQUARE_ELBOW";
  if (name.includes("SQUARE REDUCER")) return "SQUARE_REDUCER";
  if (name.includes("SQUARE TAP")) return "SQUARE_TAP_SHOE";
  if (name.includes("EAG_OBD")) return "GRILLE_EAG_OBD";
  if (name.includes("ENDCAP")) return "ENDCAP";
  return "OTHER";
}

const byCat = {};
for (const ins of inserts) {
  const cat = classifyBlock(ins.name);
  byCat[cat] = (byCat[cat] || 0) + 1;
}
console.log("INSERT categories:", byCat);

// Check pairing between SQUARE_TAP_SHOE and GRILLE_EAG_OBD
const taps = inserts.filter((i) => classifyBlock(i.name) === "SQUARE_TAP_SHOE");
const grilles = inserts.filter((i) => classifyBlock(i.name) === "GRILLE_EAG_OBD");
console.log(`\nTaps count: ${taps.length}, Grilles count: ${grilles.length}`);

for (const tap of taps) {
  const tb = tap.liveBbox;
  const tcx = (tb.minX + tb.maxX) / 2;
  const tcy = (tb.minY + tb.maxY) / 2;
  let bestG = null;
  let bestD = Infinity;
  for (const g of grilles) {
    const gb = g.liveBbox;
    const gcx = (gb.minX + gb.maxX) / 2;
    const gcy = (gb.minY + gb.maxY) / 2;
    const d = Math.hypot(tcx - gcx, tcy - gcy);
    if (d < bestD) {
      bestD = d;
      bestG = g;
    }
  }
  console.log(
    `Tap ${tap.handle} (${tb.width.toFixed(1)}x${tb.height.toFixed(1)} at [${tb.minX.toFixed(1)},${tb.minY.toFixed(1)}..${tb.maxX.toFixed(1)},${tb.maxY.toFixed(1)}]) -> nearest Grille: ${
      bestD < 500 ? `${bestG.handle} (dist=${bestD.toFixed(1)})` : `NONE (nearest dist=${bestD.toFixed(1)})`
    }`
  );
}

// Inspect block definitions for 10BAA, 10B49, 10B51
for (const h of ["10BAA", "10B49", "10B51", "10CBD", "10D50", "10D51"]) {
  const ins = inserts.find((i) => i.handle === h);
  const bdef = blockMap.get(ins.name);
  console.log(`\nBlock ${h} (${ins.name}): sub-entities=${bdef ? bdef.entities.length : 0}, pos=${JSON.stringify(ins.pos)}, rot=${ins.rotation}`);
  if (bdef) {
    const subTypes = {};
    for (const se of bdef.entities) subTypes[se.type] = (subTypes[se.type] || 0) + 1;
    console.log("  subTypes:", subTypes);
  }
}
