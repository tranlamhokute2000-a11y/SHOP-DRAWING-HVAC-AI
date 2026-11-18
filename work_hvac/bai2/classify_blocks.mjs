import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const full = JSON.parse(fs.readFileSync(path.join(DIR, "entities_full.json"), "utf8"));
const segs = JSON.parse(fs.readFileSync(path.join(DIR, "decoded_segments.json"), "utf8"));

const inserts = full.entities.filter(e => e.type === "INSERT");

// Classify all 142 inserts
const groups = {
  fans: [],
  silencers: [],
  trouser: [],
  sq_to_rd: [],
  flex: [],
  valves: [],
  grilles: [],
  taps: [],
  endcaps: [],
  reducers: [],
  elbows_planar: [],
  elbows_vertical_or_zstep: [],
  other: [],
};

for (const b of inserts) {
  const n = b.blockName;
  const bb = b.bbox;
  const dx = bb ? +(bb.maxX - bb.minX).toFixed(2) : 0;
  const dy = bb ? +(bb.maxY - bb.minY).toFixed(2) : 0;
  const rec = {
    handle: b.handle,
    layer: b.layer,
    rotDeg: +((b.rotation || 0) * 180 / Math.PI).toFixed(2),
    minX: +bb.minX.toFixed(2),
    minY: +bb.minY.toFixed(2),
    maxX: +bb.maxX.toFixed(2),
    maxY: +bb.maxY.toFixed(2),
    dx, dy,
    cx: +((bb.minX + bb.maxX) / 2).toFixed(2),
    cy: +((bb.minY + bb.maxY) / 2).toFixed(2),
    name: n,
  };
  if (/AXIAL FAN/i.test(n)) groups.fans.push(rec);
  else if (/SILENCER/i.test(n)) groups.silencers.push(rec);
  else if (/Trouser Piece/i.test(n)) groups.trouser.push(rec);
  else if (/Vuông Tròn|SQUARE TO ROUND/i.test(n)) groups.sq_to_rd.push(rec);
  else if (/Khớp Nối Mềm/i.test(n)) groups.flex.push(rec);
  else if (/Van Vuông/i.test(n)) groups.valves.push(rec);
  else if (/Grille/i.test(n)) groups.grilles.push(rec);
  else if (/SQUARE TAP|Gót giày/i.test(n)) groups.taps.push(rec);
  else if (/ENDCAP|Bít ống/i.test(n)) groups.endcaps.push(rec);
  else if (/SQUARE REDUCER|Giảm vuông/i.test(n)) groups.reducers.push(rec);
  else if (/SQUARE ELBOW|Co vuông/i.test(n)) {
    // Distinguish planar elbows (dx ~ dy) vs vertical/Z-offset elbows (one side much smaller than duct width!)
    const ratio = Math.min(dx, dy) / Math.max(dx, dy);
    if (ratio > 0.85) groups.elbows_planar.push(rec);
    else groups.elbows_vertical_or_zstep.push(rec);
  } else {
    groups.other.push(rec);
  }
}

for (const [k, v] of Object.entries(groups)) {
  console.log(`\n=== ${k.toUpperCase()} (${v.length}) ===`);
  for (const x of v) {
    console.log(`  [${x.handle}] (${x.dx}x${x.dy}) [${x.minX}, ${x.minY}]..[${x.maxX}, ${x.maxY}] rot=${x.rotDeg}° | ${x.name.split("-MB")[0]}`);
  }
}

fs.writeFileSync(path.join(DIR, "classified_blocks.json"), JSON.stringify(groups, null, 2), "utf8");
