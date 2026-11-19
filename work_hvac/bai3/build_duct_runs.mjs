import fs from 'fs';

const data = JSON.parse(fs.readFileSync('work_hvac/bai3/survey_data.json', 'utf8'));
const paired = data.pairedLabels;
const segs = data.parallelSegments;

console.log('=== TOTAL SEGMENTS:', segs.length);
console.log('=== TOTAL LABELS:', paired.length);

// Function to find closest label to a segment midpoint
function findLabel(sx, sy, layer) {
  let best = null, bestDist = 1e9;
  for (const p of paired) {
    if (layer.includes(p.system)) {
      const d = Math.hypot(p.x - sx, p.y - sy);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
  }
  return { label: best, dist: bestDist };
}

// Let's inspect each segment and its matched label
const enriched = segs.map((s, idx) => {
  const mx = (s.p1.x + s.p2.x) / 2;
  const my = (s.p1.y + s.p2.y) / 2;
  const { label, dist } = findLabel(mx, my, s.layer);
  return {
    idx,
    layer: s.layer.includes('EAD') ? 'M-MVAC-EAD' : 'M-MVAC-SEAD',
    system: s.layer.includes('EAD') ? 'EAD' : 'SED',
    wSeg: s.widthMm,
    lSeg: s.lengthMm,
    ang: s.angleDeg,
    p1: s.p1,
    p2: s.p2,
    mx, my,
    labelW: label?.W,
    labelH: label?.H,
    labelBod: label?.bod,
    labelDist: dist
  };
});

// Check if any segment is inside Fan Room 1 or Fan Room 2
function inFanRoom1(x, y) {
  return x >= -83500 && x <= -75000 && y >= 114000 && y <= 120500;
}
function inFanRoom2(x, y) {
  return x >= -44500 && x <= -36000 && y >= 15000 && y <= 20500;
}

const shopSegs = enriched.filter(s => {
  // Check if inside fan room
  if (inFanRoom2(s.mx, s.my)) return false;
  // For fan room 1: keep outer header and north EAD run, exclude fan connections
  if (inFanRoom1(s.mx, s.my)) {
    // If it's fan room equipment duct (like L1250 silencers or fan connections at X < -76500)
    if (s.mx < -76500 && s.my < 118000) return false;
  }
  return true;
});

console.log(`Segs after excluding fan room interiors: ${shopSegs.length} (excluded ${enriched.length - shopSegs.length})`);

fs.writeFileSync('work_hvac/bai3/enriched_segments.json', JSON.stringify(shopSegs, null, 2), 'utf8');
