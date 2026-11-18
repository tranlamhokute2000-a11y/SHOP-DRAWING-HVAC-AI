import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const full = JSON.parse(fs.readFileSync(path.join(DIR, "entities_full.json"), "utf8"));
const ov = JSON.parse(fs.readFileSync(path.join(DIR, "survey_overview.json"), "utf8"));

const ents = full.entities;
const texts = ov.all_text.data.items;

// 1. Type breakdown by layer
const typeBreakdown = {};
for (const e of ents) {
  const k = `${e.layer} | ${e.type}`;
  typeBreakdown[k] = (typeBreakdown[k] || 0) + 1;
}
console.log("=== ENTITY TYPE BREAKDOWN BY LAYER ===");
for (const [k, v] of Object.entries(typeBreakdown).sort()) {
  console.log(`  ${k}: ${v}`);
}

// 2. All MTEXT pairs (group nearest texts within 300mm)
console.log("\n=== ALL TEXT LABELS (" + texts.length + ") ===");
for (const t of texts) {
  console.log(`  [${t.handle}] (${t.x.toFixed(1)}, ${t.y.toFixed(1)}) "${t.content}"`);
}

// 3. All non-MTEXT, non-LINE entities (INSERTs, HATCHes, LWPOLYLINEs, etc.)
console.log("\n=== ALL INSERT BLOCKS ===");
const inserts = ents.filter(e => e.type === "INSERT");
for (const b of inserts) {
  const bb = b.bbox;
  const w = bb ? (bb.maxX - bb.minX).toFixed(2) : "?";
  const h = bb ? (bb.maxY - bb.minY).toFixed(2) : "?";
  const bbStr = bb ? `[${bb.minX.toFixed(2)}, ${bb.minY.toFixed(2)}]..[${bb.maxX.toFixed(2)}, ${bb.maxY.toFixed(2)}] (${w}x${h})` : "no-bbox";
  console.log(`  [${b.handle}] L=${b.layer} rot=${(b.rotation||0).toFixed(4)} ${bbStr} | ${b.blockName}`);
}

console.log("\n=== OTHER ENTITIES (HATCH, POLYLINE, LINE ON TEXT, ETC.) ===");
for (const e of ents) {
  if (e.type !== "INSERT" && e.type !== "MTEXT" && !(e.type === "LINE" && e.layer === "MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED")) {
    const bb = e.bbox;
    const bbStr = bb ? `[${bb.minX.toFixed(2)}, ${bb.minY.toFixed(2)}]..[${bb.maxX.toFixed(2)}, ${bb.maxY.toFixed(2)}]` : "";
    console.log(`  [${e.handle}] ${e.type} L=${e.layer} ${bbStr}`);
  }
}

console.log("\n=== TOTAL DUCT LINES ===", ents.filter(e => e.type === "LINE" && e.layer === "MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED").length);
