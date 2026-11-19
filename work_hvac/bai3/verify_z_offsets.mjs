import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  console.log('=== VERIFYING Z-OFFSETS ON BAI 3.DWG ===');
  
  // 1. Verify baseline protection (must still be exactly 608 original entities)
  const baseline = JSON.parse(fs.readFileSync('work_hvac/bai3/baseline.json', 'utf8'));
  let origPassed = true;
  for (const [layer, expected] of Object.entries(baseline.originalLayerCounts)) {
    const res = await callTool('select_by_layer', { layer });
    const actual = res.data?.handles?.length || 0;
    const ok = actual === expected;
    if (!ok) origPassed = false;
    console.log(`Layer [${layer}]: expected ${expected}, got ${actual} -> ${ok ? 'PASS' : 'FAIL'}`);
  }
  console.log(`Baseline Protection: ${origPassed ? '100% PRESERVED (608/608)' : 'VIOLATION DETECTED!'}`);

  // 2. Read results
  const results = JSON.parse(fs.readFileSync('work_hvac/bai3/z_offsets_result.json', 'utf8'));
  console.log(`\nVerified ${results.length} Z-offsets:`);
  for (const r of results) {
    console.log(`\n--- ${r.id} (${r.W}x${r.H}, dZ=${r.dZ}, lowBOD=${Math.min(r.z1, r.z2)}) ---`);
    console.log(`  Plan Rect: ${r.rect}`);
    console.log(`  Plan PL: ${r.pl}`);
    console.log(`  Elev Blocks: ${r.elevHandles.join(', ')}`);
    console.log(`  Dims: ${r.dimHandles.join(', ')}`);
    console.log(`  Cloud: ${r.cloud}`);
    console.log(`  Leader: ${r.leader}`);

    // Check block elevations
    for (const h of r.elevHandles) {
      const bData = (await callTool('duct_get_elevation', { handle: h })).data;
      console.log(`    Block ${h}: day=${bData?.day} caoDoDay=${bData?.caoDoDay}`);
    }
  }

  // Summary counts
  const seadHandles = (await callTool('select_by_layer', { layer: 'M-MVAC-SEAD' })).data?.handles?.length;
  const cloudHandles = (await callTool('select_by_layer', { layer: 'CLOUND' })).data?.handles?.length;
  const dimHandles = (await callTool('select_by_layer', { layer: 'M-MVAC-DIM' })).data?.handles?.length;
  console.log('\n=== LAYER SUMMARY ===');
  console.log(`M-MVAC-SEAD: ${seadHandles}`);
  console.log(`CLOUND: ${cloudHandles}`);
  console.log(`M-MVAC-DIM: ${dimHandles}`);
}

main().catch(console.error);
