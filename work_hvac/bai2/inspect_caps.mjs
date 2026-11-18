import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const info = (await callTool('get_drawing_info')).data;
const ents = (await callTool('get_entities_in_area', {
  minX: info.extmin.x - 100, minY: info.extmin.y - 100,
  maxX: info.extmax.x + 100, maxY: info.extmax.y + 100,
})).data || [];

const caps = ents.filter(e => e.type === 'INSERT' && (e.blockName || '').startsWith('HTS-CAP-'));
console.log('FOUND', caps.length, 'CAPS:');
for (const c of caps) {
  const cbb = (await callTool('get_bounding_box', { handles: [c.handle] })).data;
  const near = ents.filter(
    e => e.type === 'INSERT' && e.layer === c.layer && e.handle !== c.handle && Math.hypot(e.x - c.x, e.y - c.y) < 1600
  );
  console.log(`\nCAP: ${c.handle} ${c.blockName} (${c.layer}) pos=(${c.x.toFixed(1)},${c.y.toFixed(1)}) rot=${c.rotation.toFixed(4)} bbox=(${cbb.minX.toFixed(1)},${cbb.minY.toFixed(1)})->(${cbb.maxX.toFixed(1)},${cbb.maxY.toFixed(1)})`);
  for (const n of near) {
    const nbb = (await callTool('get_bounding_box', { handles: [n.handle] })).data;
    const xd = (await callTool('get_xdata', { handle: n.handle, appName: 'HTS_OG_DAY' })).data?.items?.find(i => i.code === 1040)?.value;
    console.log(`   NEAR: ${n.handle} ${n.blockName} pos=(${n.x.toFixed(1)},${n.y.toFixed(1)}) rot=${n.rotation.toFixed(4)} bod=${xd} bbox=(${nbb.minX.toFixed(1)},${nbb.minY.toFixed(1)})->(${nbb.maxX.toFixed(1)},${nbb.maxY.toFixed(1)})`);
  }
}
