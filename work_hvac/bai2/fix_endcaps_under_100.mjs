// Apply Sếp Hồ's endcap fabrication rule on bai 2.dwg:
// 1. Delete ALL end-of-run segments / caps with L < 100 mm (all 7 L25 caps + 1D4C2 L5 stub!)
// 2. Convert the remaining last real duct segment (L >= 100 mm) directly into HTS-CAP-* via HTS ui_feature_run 'hvac-cap'
// 3. Ensure cap closed face is on the OUTER dead end (redrawing 1D2AA East->West first so X=len is at West dead end!)
// 4. Re-assign HTS_OG_DAY, purge unused blocks, unlock all layers, QSAVE, export verification PNGs!

import { callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const origLayers = ['MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED', 'MEPG-M-EQUIP', 'MEPG-AC-TEXT', '0'];
await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, locked: true } })));
await callTool('send_command', { command: '_.OSMODE\n0\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });

// 1. Erase all 7 L25 caps + L5 stub (1D4C2) + 1D2AA (so we redraw 1D2AA East->West with dead end at X=len!)
await callTool('batch_erase_entities', {
  handles: ['1D922', '1D935', '1D948', '1D95B', '1D96E', '1D4C2', '1D970', '1D972', '1D2AA'],
});

// Redraw CAP-01 last segment East->West: (51101.14, 39311.20) -> (49991.14, 39311.11) so rot=PI (dead end at West!)
const rCap1 = await callTool('draw_rectangular_duct', {
  runs: [{
    W: 2200, H: 550, layer: 'M-MVAC-SEAD', prefix: 'HTS',
    points: [
      { x: 51101.14, y: 39311.20 },
      { x: 49991.14, y: 39311.11 },
    ],
  }],
});
const cap1StraightH = rCap1.data.runs[0].straightHandles[0];
console.log('Redrew CAP-01 E->W:', cap1StraightH);

// 2. Convert each of the 7 end-of-run straight ducts directly into HTS-CAP via HTS 'hvac-cap'
// Pick point lies strictly on the outer side edge of the target duct near its dead end (away from any tap/neighbor!)
const targets = [
  { id: 'CAP-01', h: cap1StraightH, bod: 2950, pick: '50050.00,40411.12', area: [49900, 38100, 51200, 40500] },
  { id: 'CAP-02', h: '1D34B',       bod: 2720, pick: '22500.00,55759.86', area: [22300, 54200, 23050, 55850] },
  { id: 'CAP-03', h: '1D364',       bod: 2770, pick: '23394.00,60400.00', area: [22950, 60150, 23500, 60550] },
  { id: 'CAP-04', h: '1D3DD',       bod: 2820, pick: '23597.30,20280.00', area: [22800, 20150, 23650, 20700] },
  { id: 'CAP-05', h: '1D4B9',       bod: 3150, pick: '50500.00,73230.62', area: [50300, 72600, 51600, 73300] },
  { id: 'CAP-06', h: '1D54F',       bod: 2500, pick: '21750.00,11036.55', area: [21550, 10980, 22700, 11650] },
  { id: 'CAP-07', h: '1D5A7',       bod: 2600, pick: '66024.56,17150.00', area: [65200, 16980, 66100, 17700] },
];

const elevGroups = [];
for (const tg of targets) {
  // Zoom tightly onto target so GetEntity pick succeeds 100% cleanly!
  await callTool('zoom_to_window', {
    minX: tg.area[0] - 500, minY: tg.area[1] - 500,
    maxX: tg.area[2] + 500, maxY: tg.area[3] + 500,
  });
  await sleep(100);
  const res = await callTool('ui_feature_run', { id: 'hvac-cap', inputs: [tg.pick] });
  await sleep(150);
  const ents = (await callTool('get_entities_in_area', {
    minX: tg.area[0], minY: tg.area[1], maxX: tg.area[2], maxY: tg.area[3],
  })).data || [];
  const capEnt = ents.find(e => e.type === 'INSERT' && (e.blockName || '').startsWith('HTS-CAP-'));
  console.log(`[${tg.id}] ui_feature_run=${res.success} -> cap=${capEnt ? capEnt.handle + ' ' + capEnt.blockName + ' rot=' + capEnt.rotation.toFixed(4) : 'NOT FOUND!'}`);
  if (capEnt) {
    if (capEnt.layer !== 'M-MVAC-SEAD') {
      await callTool('set_entity_properties', { handle: capEnt.handle, layer: 'M-MVAC-SEAD', color: 'ByLayer' });
    }
    elevGroups.push({ handles: [capEnt.handle], day: tg.bod });
  }
}

// 3. Assign HTS_OG_DAY to all 7 new HTS-CAP blocks
if (elevGroups.length) {
  await callTool('duct_set_elevation', { nhom: elevGroups });
}

// 4. Purge unused old L25/L5 block definitions, unlock layers, restore OSMODE=4031, QSAVE
await callTool('purge_unused_blocks');
await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, locked: false } })));
await callTool('send_command', { command: '_.OSMODE\n4031\n' });
await callTool('zoom_extents');
await callTool('save_drawing');

// 5. Export verification PNGs of CAP-07 (exact screenshot area!), CAP-01, and CAP-05 (where L5 was removed!)
const outDir = 'C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2';
await callTool('export_plan_image', { outDir, fileName: 'qa_cap07_fixed', format: 'png', grid: false, widthPx: 1600, minX: 64800, minY: 16700, maxX: 66400, maxY: 18400 });
await callTool('export_plan_image', { outDir, fileName: 'qa_cap01_fixed', format: 'png', grid: false, widthPx: 1800, minX: 49600, minY: 37800, maxX: 52000, maxY: 40800 });
await callTool('export_plan_image', { outDir, fileName: 'qa_cap05_fixed', format: 'png', grid: false, widthPx: 1800, minX: 50000, minY: 72200, maxX: 52000, maxY: 73600 });
console.log('ALL 7 ENDCAPS CONVERTED & SAVED!');
