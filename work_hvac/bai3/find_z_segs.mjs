import fs from 'fs';

const data = JSON.parse(fs.readFileSync('work_hvac/bai3/survey_data.json', 'utf8'));
const segs = data.parallelSegments;

function findSegsInBox(name, x1, y1, x2, y2) {
  const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
  const found = segs.filter(s => {
    const sx = (s.p1.x + s.p2.x) / 2;
    const sy = (s.p1.y + s.p2.y) / 2;
    return sx >= minX && sx <= maxX && sy >= minY && sy <= maxY;
  });
  console.log(`=== ${name} === (${found.length} segments)`);
  for (const s of found) {
    console.log(`  W=${s.widthMm} L=${s.lengthMm.toFixed(0)} ang=${s.angleDeg.toFixed(1)}: (${s.p1.x.toFixed(1)}, ${s.p1.y.toFixed(1)}) -> (${s.p2.x.toFixed(1)}, ${s.p2.y.toFixed(1)})`);
  }
}

// 1. NW
findSegsInBox('NW Stretch (Y=65000..85000)', -76000, 65000, -73000, 85000);

// 2. South Main 1 (from X=-51000, Y=20000 to X=-60000, Y=34000)
findSegsInBox('South Main 1 Stretch', -60000, 20000, -49000, 35000);

// 3. South Main 2 (from X=-70000 to X=-79000, Y=32000..35000)
findSegsInBox('South Main 2 Stretch', -80000, 32000, -68000, 35000);

// 4. Southeast (X=-52000..-49000, Y=0..15000)
findSegsInBox('Southeast Stretch', -52000, 0, -49000, 15000);
