#!/usr/bin/env node
// Turbo Step 1.3 Helper: Normalize INSUNITS=4 & MEASUREMENT=1, create all 13 Spec v3 layers,
// and optionally lock/unlock layers in < 0.2 seconds!
// Usage:
//   node init_spec_layers.mjs [--extra SAD:140,RAD:200] [--lock-orig] [--unlock-all]

import { checkHealth, callTool, batchCall } from './hts_mcp.mjs';

const STANDARD_LAYERS = [
  { layerName: 'M-MVAC-EAD',         color: 80,  lineweight: 20, plottable: true, description: 'EXHAUST AIR DUCT / Duong ong gio thai' },
  { layerName: 'M-MVAC-FAD',         color: 150, lineweight: 20, plottable: true, description: 'FRESH AIR DUCT / Duong ong gio tuoi' },
  { layerName: 'M-MVAC-PAD',         color: 210, lineweight: 20, plottable: true, description: 'PRESSURIZATION AIR DUCT / Ong gio tao ap' },
  { layerName: 'M-MVAC-CEAD',        color: 170, lineweight: 20, plottable: true, description: 'CAR EXHAUST AIR DUCT / Ong gio thai nha xe' },
  { layerName: 'M-MVAC-CSAD',        color: 11,  lineweight: 20, plottable: true, description: 'CAR SUPPLY AIR DUCT / Ong gio cap nha xe' },
  { layerName: 'M-MVAC-SEAD',        color: 190, lineweight: 20, plottable: true, description: 'SMOKE EXHAUST AIR DUCT / Duong ong hut khoi' },
  { layerName: 'M-MVAC-Copper Pipe', color: 12,  lineweight: 20, plottable: true, description: 'COPPER PIPE / Duong ong dong' },
  { layerName: 'M-MVAC-AC Drain',    color: 72,  lineweight: 20, plottable: true, description: 'DRAIN FOR AIR CONDITIONER / Ong nuoc ngung' },
  { layerName: 'M-MVAC-Equipment',   color: 47,  lineweight: 9,  plottable: true, description: 'EQUIPMENT / Thiet bi HVAC' },
  { layerName: 'M-MVAC-Support',     color: 42,  lineweight: 9,  plottable: true, description: 'SUPPORT / Gia do HVAC' },
  { layerName: 'M-MVAC-DIM',         color: 97,  lineweight: 5,  plottable: true, description: 'DIMENSION / Kich thuoc HVAC (M-DIM 1-400 & HO-DIM 1-70)' },
  { layerName: 'M-MVAC-TEXT',        color: 2,   lineweight: 9,  plottable: true, description: 'TEXT / Ghi chu & Chi dan mui ten HVAC' },
  { layerName: 'CLOUND',             color: 240, lineweight: 5,  plottable: true, description: 'Revision Cloud & Trich chi tiet vat the (Spec v3)' },
];

function parseArgs(argv) {
  const opts = { extra: [], lockOrig: false, unlockAll: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--extra' && argv[i + 1]) {
      for (const pair of argv[++i].split(',').filter(Boolean)) {
        const [sys, col] = pair.split(':');
        if (sys) opts.extra.push({ layerName: `M-MVAC-${sys.trim()}`, color: Number(col) || 140, lineweight: 20, plottable: true, description: `${sys.trim()} DUCT` });
      }
    } else if (a === '--lock-orig') opts.lockOrig = true;
    else if (a === '--unlock-all') opts.unlockAll = true;
  }
  return opts;
}

async function main() {
  const t0 = Date.now();
  const opts = parseArgs(process.argv);
  await checkHealth();

  // 1. Force Metric Millimeters (prevents 25.4x Revit Inches trap!)
  await callTool('send_command', { command: '_.INSUNITS\n4\n_.MEASUREMENT\n1\n' });

  // 2. Create all Spec v3 layers + extras in a single batch
  const allSpec = [...STANDARD_LAYERS, ...opts.extra];
  await batchCall(allSpec.map(args => ({ tool: 'create_layer', args })));

  // 3. Optional lock original design layers or unlock all layers
  if (opts.lockOrig || opts.unlockAll) {
    const layers = (await callTool('get_layer_list')).data?.layers || [];
    if (opts.unlockAll) {
      await batchCall(layers.map(l => ({ tool: 'set_layer_state', args: { layerName: l.name, locked: false } })));
    } else if (opts.lockOrig) {
      const orig = layers.filter(l => !l.name.startsWith('M-MVAC-') && l.name !== 'CLOUND' && l.name !== 'Defpoints');
      await batchCall(orig.map(l => ({ tool: 'set_layer_state', args: { layerName: l.name, locked: true } })));
    }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`[init_spec_layers] DONE in ${elapsed}s | INSUNITS=4, MEASUREMENT=1 | ${allSpec.length} Spec layers ensured${opts.lockOrig ? ' | orig layers LOCKED' : ''}${opts.unlockAll ? ' | ALL layers UNLOCKED' : ''}`);
}

main().catch(err => {
  console.error('[init_spec_layers] ERROR:', err.message);
  process.exit(1);
});
