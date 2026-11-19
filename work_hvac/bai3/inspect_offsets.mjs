import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function inspectAreaDetailed(name, minX, minY, maxX, maxY) {
  console.log('\n========================================');
  console.log(name, { minX, minY, maxX, maxY });
  const ents = (await callTool('get_entities_in_area', { minX, minY, maxX, maxY })).data || [];
  for (const e of ents) {
    if (e.type === 'LINE') {
      const dx = e.endX - e.startX, dy = e.endY - e.startY;
      console.log('LINE:', e.handle, e.layer, `[${e.startX.toFixed(1)}, ${e.startY.toFixed(1)}] -> [${e.endX.toFixed(1)}, ${e.endY.toFixed(1)}]`, `L=${Math.hypot(dx,dy).toFixed(1)}`);
    } else if (e.type === 'INSERT') {
      console.log('INSERT:', e.handle, e.blockName, `[${e.x?.toFixed(1)}, ${e.y?.toFixed(1)}]`, `rot=${e.rotation?.toFixed(2)}`);
    } else if (e.type === 'MTEXT' || e.type === 'TEXT') {
      console.log('TEXT:', e.handle, JSON.stringify(e.text || e.content), `[${e.x?.toFixed(1)}, ${e.y?.toFixed(1)}]`);
    }
  }
}

async function main() {
  await inspectAreaDetailed('1. NW', -75200, 74400, -73400, 76000);
  await inspectAreaDetailed('2. South 1', -52200, 28500, -49800, 31600);
  await inspectAreaDetailed('3. South 2', -75000, 32500, -73500, 34500);
  await inspectAreaDetailed('4. SE', -51600, 6800, -50000, 8200);
}

main().catch(console.error);
