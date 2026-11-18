import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const full = JSON.parse(fs.readFileSync(path.join(DIR, "entities_full.json"), "utf8"));
const segs = JSON.parse(fs.readFileSync(path.join(DIR, "decoded_segments.json"), "utf8"));
const blocks = JSON.parse(fs.readFileSync(path.join(DIR, "classified_blocks.json"), "utf8"));

// Helper: find line by handle
const byH = new Map(full.entities.map(e => [e.handle, e]));

console.log("=== 1. CHECK UNPAIRED LONG DUCT SEGMENTS ===");
for (const pair of [["1CCBE", "1CCBF"], ["1CDCF", "1CDCD"]]) {
  const a = byH.get(pair[0]), b = byH.get(pair[1]);
  const ax1 = a.endpoints.start.x, ay1 = a.endpoints.start.y, ax2 = a.endpoints.end.x, ay2 = a.endpoints.end.y;
  const bx1 = b.endpoints.start.x, by1 = b.endpoints.start.y, bx2 = b.endpoints.end.x, by2 = b.endpoints.end.y;
  console.log(pair.join("+"), ":");
  console.log("  A:", ax1.toFixed(2), ay1.toFixed(2), "->", ax2.toFixed(2), ay2.toFixed(2));
  console.log("  B:", bx1.toFixed(2), by1.toFixed(2), "->", bx2.toFixed(2), by2.toFixed(2));
  console.log("  W =", Math.abs((ay1 + ay2)/2 - (by1 + by2)/2).toFixed(2));
}

console.log("\n=== 2. EXACT REDUCER GEOMETRY (ALL 8 OUTSIDE FAN ROOM + 2 IN FAN ROOM) ===");
// For each reducer, find nearby duct segments touching its two ends
const allSegs = [...segs.pairs];
// Add the 2 manually paired segments
allSegs.push({
  h1: "1CCBE", h2: "1CCBF", W: 1000.00, len: 13921.17, angDeg: 0.005,
  c1: { x: 35022.39, y: 11312.64 }, c2: { x: 48943.55, y: 11313.82 }
});
allSegs.push({
  h1: "1CDCF", h2: "1CDCD", W: 1500.00, len: 3999.40, angDeg: 0.005,
  c1: { x: 34074.66, y: 55010.21 }, c2: { x: 38074.05, y: 55010.56 }
});

for (const r of blocks.reducers) {
  // Find segments whose endpoint is within 80mm of reducer bbox
  const touching = [];
  for (const s of allSegs) {
    for (const endName of ["c1", "c2"]) {
      const p = s[endName];
      const dx = Math.max(r.minX - p.x, 0, p.x - r.maxX);
      const dy = Math.max(r.minY - p.y, 0, p.y - r.maxY);
      if (Math.hypot(dx, dy) < 80) {
        touching.push({ W: s.W, p, endName, h: `${s.h1}/${s.h2}` });
      }
    }
  }
  console.log(`RED [${r.handle}] bbox=[${r.minX},${r.minY}]..[${r.maxX},${r.maxY}] (${r.dx}x${r.dy}) rot=${r.rotDeg}°`);
  for (const t of touching) {
    console.log(`   touches W=${t.W} at (${t.p.x.toFixed(2)}, ${t.p.y.toFixed(2)}) [${t.h}]`);
  }
  if (touching.length === 2) {
    const [a, b] = touching;
    const isHoriz = r.dx < r.dy;
    const L = isHoriz ? Math.abs(b.p.x - a.p.x) : Math.abs(b.p.y - a.p.y);
    const shift = isHoriz ? (b.p.y - a.p.y) : (b.p.x - a.p.x);
    console.log(`   => EXACT FLANGE-TO-FLANGE L = ${L.toFixed(2)} mm | CL shift = ${shift.toFixed(2)} mm (${Math.abs(shift) < 2 ? "CONCENTRIC Can" : "ECCENTRIC Trai/Phai"})`);
  }
}

console.log("\n=== 3. EXACT PLANAR ELBOW VERTICES (INTERSECTION OF ADJACENT CENTERLINES) ===");
for (const el of blocks.elbows_planar) {
  const touching = [];
  for (const s of allSegs) {
    for (const endName of ["c1", "c2"]) {
      const p = s[endName];
      const dx = Math.max(el.minX - p.x, 0, p.x - el.maxX);
      const dy = Math.max(el.minY - p.y, 0, p.y - el.maxY);
      if (Math.hypot(dx, dy) < 80) {
        const other = endName === "c1" ? s.c2 : s.c1;
        touching.push({ W: s.W, p, other, ang: s.angDeg, h: `${s.h1}/${s.h2}` });
      }
    }
  }
  console.log(`ELB [${el.handle}] bbox=[${el.minX},${el.minY}]..[${el.maxX},${el.maxY}] (${el.dx}x${el.dy}) rot=${el.rotDeg}°`);
  for (const t of touching) {
    console.log(`   seg W=${t.W} ang=${t.ang}° flange=(${t.p.x.toFixed(2)}, ${t.p.y.toFixed(2)})`);
  }
  if (touching.length === 2) {
    const [a, b] = touching;
    // Line-line intersection of (a.p -> a.other) and (b.p -> b.other)
    const x1 = a.p.x, y1 = a.p.y, x2 = a.other.x, y2 = a.other.y;
    const x3 = b.p.x, y3 = b.p.y, x4 = b.other.x, y4 = b.other.y;
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(den) > 1e-6) {
      const ix = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / den;
      const iy = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / den;
      const tA = Math.hypot(ix - a.p.x, iy - a.p.y);
      const tB = Math.hypot(ix - b.p.x, iy - b.p.y);
      const vx1 = a.p.x - ix, vy1 = a.p.y - iy;
      const vx2 = b.p.x - ix, vy2 = b.p.y - iy;
      const cosT = (vx1*vx2 + vy1*vy2) / (Math.hypot(vx1, vy1) * Math.hypot(vx2, vy2));
      const innerAng = Math.acos(Math.max(-1, Math.min(1, cosT))) * 180 / Math.PI;
      const bendAng = 180 - innerAng;
      // Tangent = R_cl * tan(bendAng/2) + straight_collar
      console.log(`   => VERTEX=(${ix.toFixed(2)}, ${iy.toFixed(2)}) | bend=${bendAng.toFixed(2)}° | tangentA=${tA.toFixed(2)}, tangentB=${tB.toFixed(2)} (W=${a.W}, W_expected_Rcl=${a.W})`);
    }
  }
}
