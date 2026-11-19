import fs from 'fs';
const data = JSON.parse(fs.readFileSync('work_hvac/bai3/survey_data.json', 'utf8'));

console.log('=== SYSTEMS & LABELS ===');
console.log('Total paired labels:', data.pairedLabels.length);
const bySys = {};
for (const p of data.pairedLabels) {
  bySys[p.system] = bySys[p.system] || [];
  bySys[p.system].push(p);
}
for (const [sys, list] of Object.entries(bySys)) {
  console.log(`\n--- System ${sys} (${list.length} labels) ---`);
  for (const p of list) {
    const sz = p.shape === 'rect' ? `${p.W}x${p.H}` : `D${p.D}`;
    console.log(`  ${p.system}-${sz} | BOD=${p.bod} (${p.elevRef}) at (${p.x.toFixed(0)}, ${p.y.toFixed(0)})`);
  }
}

console.log('\n=== OTHER LABELS ===');
console.log('Count:', data.otherLabels.length);
for (const o of data.otherLabels) {
  console.log(`  [${o.layer}] ${JSON.stringify(o.raw)} at (${o.x.toFixed(0)}, ${o.y.toFixed(0)})`);
}

console.log('\n=== DESIGN EQUIPMENT / FITTING INSERTS ===');
console.log('Count:', data.designEquipmentBlocks.length);
const blockCounts = {};
for (const b of data.designEquipmentBlocks) {
  const name = b.name || b.block_name || 'UNKNOWN';
  blockCounts[name] = (blockCounts[name] || 0) + 1;
}
for (const [k, v] of Object.entries(blockCounts)) {
  console.log(`  ${k}: ${v}`);
}
