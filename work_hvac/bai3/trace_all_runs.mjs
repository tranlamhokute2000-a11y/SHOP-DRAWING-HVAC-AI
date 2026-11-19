import fs from 'fs';

const segs = JSON.parse(fs.readFileSync('work_hvac/bai3/enriched_segments.json', 'utf8'));

console.log(`Analyzing ${segs.length} shop drawing segments...`);

// Separate by system
const eadSegs = segs.filter(s => s.system === 'EAD');
const sedSegs = segs.filter(s => s.system === 'SED');

console.log(`EAD segments: ${eadSegs.length}`);
console.log(`SED segments: ${sedSegs.length}`);

// Group EAD segments
console.log('\n--- EAD Segments Summary ---');
for (const s of eadSegs) {
  console.log(`  [${s.idx}] W=${s.wSeg} H=${s.labelH} L=${s.lSeg.toFixed(0)} ang=${s.ang.toFixed(1)}: (${s.p1.x.toFixed(0)}, ${s.p1.y.toFixed(0)}) -> (${s.p2.x.toFixed(0)}, ${s.p2.y.toFixed(0)}) | BOD=${s.labelBod} (dist=${s.labelDist.toFixed(0)})`);
}

// Group SED segments by geographic cluster / branch
console.log('\n--- SED Segments Summary ---');
for (const s of sedSegs) {
  console.log(`  [${s.idx}] W=${s.wSeg} H=${s.labelH} L=${s.lSeg.toFixed(0)} ang=${s.ang.toFixed(1)}: (${s.p1.x.toFixed(0)}, ${s.p1.y.toFixed(0)}) -> (${s.p2.x.toFixed(0)}, ${s.p2.y.toFixed(0)}) | BOD=${s.labelBod} (dist=${s.labelDist.toFixed(0)})`);
}
