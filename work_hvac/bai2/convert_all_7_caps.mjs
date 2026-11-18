import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });

// Convert remaining 6 end ducts directly via HTS hvac-cap (_HG2M8Q7X) using deterministic (handent "...")!
const remaining = [
  { id: 'CAP-01', h: '1E4F2', bod: 2950, area: [49900, 38100, 51200, 40500] },
  { id: 'CAP-02', h: '1D34B', bod: 2720, area: [22300, 54200, 23050, 55850] },
  { id: 'CAP-03', h: '1D364', bod: 2770, area: [22950, 60150, 23500, 60550] },
  { id: 'CAP-04', h: '1D3DD', bod: 2820, area: [22800, 20150, 23650, 20700] },
  { id: 'CAP-05', h: '1D4B9', bod: 3150, area: [50300, 72600, 51600, 73300] },
  { id: 'CAP-06', h: '1D54F', bod: 2500, area: [21550, 10980, 22700, 11650] },
];

const elevGroups = [{ handles: ['1E4FA'], day: 2600 }]; // CAP-07 already converted!

for (const tg of remaining) {
  await callTool('ui_feature_run', { id: 'hvac-cap', inputs: [`(handent "${tg.h}")`] });
  await sleep(300);
  const ents = (await callTool('get_entities_in_area', {
    minX: tg.area[0], minY: tg.area[1], maxX: tg.area[2], maxY: tg.area[3],
  })).data || [];
  const capEnt = ents.find(e => e.type === 'INSERT' && (e.blockName || '').startsWith('HTS-CAP-'));
  console.log(`[${tg.id}] -> ${capEnt ? capEnt.handle + ' ' + capEnt.blockName + ' layer=' + capEnt.layer + ' rot=' + capEnt.rotation.toFixed(4) : 'MISSING!'}`);
  if (capEnt) {
    if (capEnt.layer !== 'M-MVAC-SEAD') {
      await callTool('set_entity_properties', { handle: capEnt.handle, layer: 'M-MVAC-SEAD', color: 'ByLayer' });
    }
    elevGroups.push({ handles: [capEnt.handle], day: tg.bod });
  }
}

// Assign HTS_OG_DAY to all 7 new HTS-CAP-* blocks
await callTool('duct_set_elevation', { nhom: elevGroups });
await callTool('purge_unused_blocks');
await callTool('zoom_extents');
await callTool('save_drawing');

// Export verification PNGs of CAP-07, CAP-01, CAP-05, CAP-02/03
const outDir = 'C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2';
await callTool('export_plan_image', { outDir, fileName: 'qa_cap07_v2', format: 'png', grid: false, widthPx: 1600, minX: 64800, minY: 16700, maxX: 66400, maxY: 18400 });
await callTool('export_plan_image', { outDir, fileName: 'qa_cap01_v2', format: 'png', grid: false, widthPx: 1800, minX: 49600, minY: 37800, maxX: 52000, maxY: 40800 });
await callTool('export_plan_image', { outDir, fileName: 'qa_cap05_v2', format: 'png', grid: false, widthPx: 1800, minX: 50000, minY: 72200, maxX: 52000, maxY: 73600 });
console.log('ALL 7 ENDCAPS CONVERTED, ELEVATED, PURGED & SAVED!');
