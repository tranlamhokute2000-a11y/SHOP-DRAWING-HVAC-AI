#!/usr/bin/env node
// Turbo Endcap Converter (Spec & Fabrication Rule: delete end stubs < 100mm, convert last real duct via HTS hvac-cap!)
// Uses deterministic (handent "...") input — zero zooming, zero mouse-pick misses, < 0.3s per endcap!
//
// Usage:
//   node apply_endcaps.mjs --targets "1D5A7:2600:M-MVAC-SEAD,1D34B:2720:M-MVAC-SEAD" [--erase-short "1D972,1D4C2"]

import { checkHealth, callTool } from './hts_mcp.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function parseArgs(argv) {
  const opts = { targets: [], eraseShort: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--targets' && argv[i + 1]) {
      for (const item of argv[++i].split(',').filter(Boolean)) {
        const [handle, bod, layer] = item.split(':');
        if (handle) opts.targets.push({ handle: handle.trim(), bod: Number(bod), layer: (layer || 'M-MVAC-SEAD').trim() });
      }
    } else if (a === '--erase-short' && argv[i + 1]) {
      opts.eraseShort = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return opts;
}

async function main() {
  const t0 = Date.now();
  const opts = parseArgs(process.argv);
  if (opts.targets.length === 0) {
    throw new Error('Provide --targets "handle:bod:layer,..."');
  }
  await checkHealth();

  if (opts.eraseShort.length) {
    await callTool('batch_erase_entities', { handles: opts.eraseShort });
    console.log(`[apply_endcaps] Erased ${opts.eraseShort.length} end stubs (<100mm): ${opts.eraseShort.join(', ')}`);
  }

  const elevGroups = [];
  for (const tg of opts.targets) {
    const before = new Set((await callTool('select_by_layer', { layer: tg.layer })).data?.handles || []);
    await callTool('set_layer', { layerName: tg.layer });
    await callTool('ui_feature_run', { id: 'hvac-cap', inputs: [`(handent "${tg.handle}")`] });
    await sleep(300);
    const after = (await callTool('select_by_layer', { layer: tg.layer })).data?.handles || [];
    const newHandle = after.find(h => !before.has(h));
    if (!newHandle) {
      console.warn(`[apply_endcaps] WARN: no new handle detected on ${tg.layer} for ${tg.handle}`);
      continue;
    }
    await callTool('set_entity_properties', { handle: newHandle, layer: tg.layer, color: 'ByLayer' });
    if (Number.isFinite(tg.bod)) elevGroups.push({ handles: [newHandle], day: tg.bod });
    console.log(`[apply_endcaps] ${tg.handle} -> ${newHandle} (${tg.layer}, BOD=${tg.bod})`);
  }

  if (elevGroups.length) {
    await callTool('duct_set_elevation', { nhom: elevGroups });
  }
  await callTool('purge_unused_blocks');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`[apply_endcaps] DONE ${elevGroups.length}/${opts.targets.length} endcaps in ${elapsed}s`);
}

main().catch(err => {
  console.error('[apply_endcaps] ERROR:', err.message);
  process.exit(1);
});
