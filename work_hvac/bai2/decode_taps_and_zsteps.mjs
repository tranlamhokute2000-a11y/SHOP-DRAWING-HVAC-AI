import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const blocks = JSON.parse(fs.readFileSync(path.join(DIR, "classified_blocks.json"), "utf8"));
const full = JSON.parse(fs.readFileSync(path.join(DIR, "entities_full.json"), "utf8"));

// Find matching grille for each tap
console.log("=== ALL 34 TAPS (CLASSIFIED: BRANCH vs GRILLE COLLAR) ===");
const branchTaps = [];
const grilleTaps = [];

for (const t of blocks.taps) {
  // Check if a grille bbox is within 50mm of tap bbox
  const g = blocks.grilles.find(gr => {
    const dx = Math.max(t.minX - gr.maxX, 0, gr.minX - t.maxX);
    const dy = Math.max(t.minY - gr.maxY, 0, gr.minY - t.maxY);
    return Math.hypot(dx, dy) < 50;
  });
  const isHorizTap = t.dx < t.dy; // protrudes along X (left or right)
  const collarW = isHorizTap ? t.dy - 180 : t.dx - 180; // approx: 600 + 150 bevel + 30 flange = 780!
  const item = {
    handle: t.handle,
    type: g ? "GRILLE_600x300" : (Math.max(t.dx, t.dy) === 780 ? "GRILLE_NO_GRILLE_BLK_600x300" : "BRANCH_TAP"),
    rotDeg: t.rotDeg,
    bbox: [t.minX, t.minY, t.maxX, t.maxY],
    dx: t.dx, dy: t.dy,
    grilleHandle: g ? g.handle : null,
    grilleCenter: g ? [g.cx, g.cy] : null,
    grilleBbox: g ? [g.minX, g.minY, g.maxX, g.maxY] : null,
  };
  if (item.type === "BRANCH_TAP") branchTaps.push(item);
  else grilleTaps.push(item);
}

console.log(`\n--- BRANCH TAPS (${branchTaps.length}) ---`);
for (const b of branchTaps) {
  console.log(`  [${b.handle}] (${b.dx}x${b.dy}) rot=${b.rotDeg}° bbox=[${b.bbox.join(", ")}]`);
}

console.log(`\n--- GRILLE COLLAR TAPS (${grilleTaps.length}) ---`);
for (const t of grilleTaps) {
  // Determine protrusion side & bevel side using grilleCenter vs tap bbox center!
  const tcx = (t.bbox[0] + t.bbox[2]) / 2;
  const tcy = (t.bbox[1] + t.bbox[3]) / 2;
  let info = "";
  if (t.grilleCenter) {
    const [gx, gy] = t.grilleCenter;
    if (t.dx < t.dy) {
      // protrudes in X
      const dir = gx < tcx ? "-X (LEFT)" : "+X (RIGHT)";
      const bevelSide = tcy > gy ? "+Y (bevel UP)" : "-Y (bevel DOWN)";
      const attachX = gx < tcx ? t.bbox[2] : t.bbox[0];
      info = `protrudes=${dir} attachX=${attachX.toFixed(2)} collarY=${gy.toFixed(2)} ${bevelSide} (diff=${(tcy-gy).toFixed(1)})`;
    } else {
      // protrudes in Y
      const dir = gy < tcy ? "-Y (DOWN)" : "+Y (UP)";
      const bevelSide = tcx > gx ? "+X (bevel RIGHT)" : "-X (bevel LEFT)";
      const attachY = gy < tcy ? t.bbox[3] : t.bbox[1];
      info = `protrudes=${dir} attachY=${attachY.toFixed(2)} collarX=${gx.toFixed(2)} ${bevelSide} (diff=${(tcx-gx).toFixed(1)})`;
    }
  } else {
    info = "NO GRILLE BLOCK! bbox center=(" + tcx.toFixed(2) + ", " + tcy.toFixed(2) + ")";
  }
  console.log(`  [${t.handle}] (g=${t.grilleHandle || "NONE"}) rot=${t.rotDeg}° | ${info}`);
}

console.log("\n=== CHECK UNMATCHED GRILLES ===");
for (const g of blocks.grilles) {
  if (!grilleTaps.some(t => t.grilleHandle === g.handle)) {
    console.log("  UNMATCHED GRILLE:", g.handle, g.bbox);
  }
}

console.log("\n=== ALL 15 VALVES ===");
for (const v of blocks.valves) {
  console.log(`  [${v.handle}] (${v.dx}x${v.dy}) [${v.minX}, ${v.minY}]..[${v.maxX}, ${v.maxY}] | ${v.name.split("-MB")[0]}`);
}

console.log("\n=== ALL 7 ENDCAPS ===");
for (const c of blocks.endcaps) {
  console.log(`  [${c.handle}] (${c.dx}x${c.dy}) [${c.minX}, ${c.minY}]..[${c.maxX}, ${c.maxY}] rot=${c.rotDeg}°`);
}
