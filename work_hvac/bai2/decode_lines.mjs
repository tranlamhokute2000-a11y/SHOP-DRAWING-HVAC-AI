import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const full = JSON.parse(fs.readFileSync(path.join(DIR, "entities_full.json"), "utf8"));
const lines = full.entities.filter(e => e.type === "LINE" && e.layer === "MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED");

const parsed = lines.map(l => {
  const x1 = l.endpoints?.start?.x ?? l.startX;
  const y1 = l.endpoints?.start?.y ?? l.startY;
  const x2 = l.endpoints?.end?.x ?? l.endX;
  const y2 = l.endpoints?.end?.y ?? l.endY;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  let ang = Math.atan2(dy, dx);
  // Normalize direction to [0, pi)
  let ax1 = x1, ay1 = y1, ax2 = x2, ay2 = y2;
  if (ang < 0) { ang += Math.PI; [ax1, ay1, ax2, ay2] = [x2, y2, x1, y1]; }
  if (ang >= Math.PI - 1e-6) { ang = 0; [ax1, ay1, ax2, ay2] = [x2, y2, x1, y1]; }
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const mx = (ax1 + ax2) / 2, my = (ay1 + ay2) / 2;
  // Projection along direction and perpendicular
  const t1 = ax1 * ux + ay1 * uy;
  const t2 = ax2 * ux + ay2 * uy;
  const n = -mx * uy + my * ux; // signed perp coord
  return {
    handle: l.handle,
    x1: ax1, y1: ay1, x2: ax2, y2: ay2,
    mx, my, len, ang, angDeg: ang * 180 / Math.PI,
    ux, uy, tMin: Math.min(t1, t2), tMax: Math.max(t1, t2), n
  };
});

// Pair parallel lines with matching length & t-range (within 15mm) and perpendicular distance between 150 and 2500mm
const used = new Set();
const pairs = [];

// Sort longest first so duct edges pair before short end-flange lines
parsed.sort((a, b) => b.len - a.len);

for (let i = 0; i < parsed.length; i++) {
  if (used.has(parsed[i].handle)) continue;
  const a = parsed[i];
  let bestJ = -1;
  let bestScore = Infinity;
  for (let j = i + 1; j < parsed.length; j++) {
    if (used.has(parsed[j].handle)) continue;
    const b = parsed[j];
    let dang = Math.abs(a.ang - b.ang);
    if (dang > Math.PI / 2) dang = Math.PI - dang;
    if (dang > 0.01) continue; // ~0.57 deg
    const dLen = Math.abs(a.len - b.len);
    const dT1 = Math.abs(a.tMin - b.tMin);
    const dT2 = Math.abs(a.tMax - b.tMax);
    if (dT1 > 20 || dT2 > 20 || dLen > 20) continue;
    const w = Math.abs(a.n - b.n);
    if (w < 100 || w > 2500) continue;
    // Prefer widths close to standard multiples of 50mm and small dT
    const score = dT1 + dT2 + w * 0.001;
    if (score < bestScore) {
      bestScore = score;
      bestJ = j;
    }
  }
  if (bestJ !== -1) {
    const b = parsed[bestJ];
    used.add(a.handle);
    used.add(b.handle);
    const cx1 = (a.x1 + b.x1) / 2;
    const cy1 = (a.y1 + b.y1) / 2;
    const cx2 = (a.x2 + b.x2) / 2;
    const cy2 = (a.y2 + b.y2) / 2;
    const w = Math.abs(a.n - b.n);
    pairs.push({
      h1: a.handle,
      h2: b.handle,
      W: Number(w.toFixed(2)),
      len: Number(((a.len + b.len) / 2).toFixed(2)),
      angDeg: Number(((a.angDeg + b.angDeg) / 2).toFixed(4)),
      c1: { x: Number(cx1.toFixed(2)), y: Number(cy1.toFixed(2)) },
      c2: { x: Number(cx2.toFixed(2)), y: Number(cy2.toFixed(2)) },
      edge1: { x1: Number(a.x1.toFixed(2)), y1: Number(a.y1.toFixed(2)), x2: Number(a.x2.toFixed(2)), y2: Number(a.y2.toFixed(2)) },
      edge2: { x1: Number(b.x1.toFixed(2)), y1: Number(b.y1.toFixed(2)), x2: Number(b.x2.toFixed(2)), y2: Number(b.y2.toFixed(2)) },
    });
  }
}

const unpaired = parsed.filter(l => !used.has(l.handle));

console.log(`Paired ${pairs.length} duct segments (${pairs.length * 2} lines), ${unpaired.length} unpaired lines:`);
console.log("\n=== DUCT SEGMENTS (sorted by Y desc, X asc) ===");
pairs.sort((a, b) => b.c1.y - a.c1.y || a.c1.x - b.c1.x);
pairs.forEach((p, idx) => {
  console.log(
    `S${String(idx + 1).padStart(2, "0")}: W=${p.W.toFixed(2)} L=${p.len.toFixed(2)} ang=${p.angDeg.toFixed(3)}° ` +
    `(${p.c1.x.toFixed(2)}, ${p.c1.y.toFixed(2)}) -> (${p.c2.x.toFixed(2)}, ${p.c2.y.toFixed(2)}) [${p.h1},${p.h2}]`
  );
});

console.log("\n=== UNPAIRED LINES ===");
for (const u of unpaired) {
  console.log(
    `  [${u.handle}] L=${u.len.toFixed(2)} ang=${u.angDeg.toFixed(3)}° (${u.x1.toFixed(2)}, ${u.y1.toFixed(2)}) -> (${u.x2.toFixed(2)}, ${u.y2.toFixed(2)})`
  );
}

fs.writeFileSync(
  path.join(DIR, "decoded_segments.json"),
  JSON.stringify({ pairs, unpaired }, null, 2),
  "utf8"
);
