import fs from 'fs';

const data = JSON.parse(fs.readFileSync('work_hvac/bai3/survey_data.json', 'utf8'));
const paired = data.pairedLabels;

console.log('=== SYSTEMS BREAKDOWN ===');
const ead = paired.filter(p => p.system === 'EAD');
const sed = paired.filter(p => p.system === 'SED');

console.log(`EAD Labels: ${ead.length}`);
console.log(`SED Labels: ${sed.length}`);

// Check elevation transitions along SED
console.log('\n--- SED Elevations ---');
const sedBods = [...new Set(sed.map(p => p.bod))].sort((a,b) => a-b);
console.log('Unique SED BODs:', sedBods);

console.log('\n--- EAD Elevations ---');
const eadBods = [...new Set(ead.map(p => p.bod))].sort((a,b) => a-b);
console.log('Unique EAD BODs:', eadBods);

// Check potential Z-offsets along continuous lines or adjacent labels
// Let's inspect where BOD changes
console.log('\n--- SED Labels grouped by BOD ---');
for (const b of sedBods) {
  const matching = sed.filter(p => p.bod === b);
  console.log(`BOD = ${b} (${matching.length} labels):`);
  for (const m of matching) {
    console.log(`   ${m.W}x${m.H} at (${m.x.toFixed(0)}, ${m.y.toFixed(0)})`);
  }
}
