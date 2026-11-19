import fs from 'fs';
const data = JSON.parse(fs.readFileSync('work_hvac/bai3/survey_data.json', 'utf8'));

const paired = data.pairedLabels;
paired.sort((a, b) => b.y - a.y || a.x - b.x);

console.log('=== DUCT LABELS (Sorted by Y desc) ===');
for (const p of paired) {
  const sz = p.shape === 'rect' ? `${p.W}x${p.H}` : `D${p.D}`;
  console.log(`${p.system.padEnd(5)} ${sz.padEnd(12)} BOD=${String(p.bod).padEnd(5)} at X=${p.x.toFixed(0).padStart(7)}, Y=${p.y.toFixed(0).padStart(7)}`);
}

// Check fans and equipment locations
console.log('\n=== FANS & MAJOR EQUIPMENT ===');
for (const b of data.designEquipmentBlocks) {
  const name = b.blockName || '';
  if (name.includes('FAN') || name.includes('SILENCER') || name.includes('Trouser')) {
    console.log(`  Handle ${b.handle} | ${name} at X=${b.x.toFixed(0).padStart(7)}, Y=${b.y.toFixed(0).padStart(7)}`);
  }
}
