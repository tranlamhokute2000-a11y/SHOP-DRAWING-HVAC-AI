import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function inspectStretch(name, filterFn) {
  const all = (await callTool('get_entities_in_area', { minX: -100000, minY: -10000, maxX: 0, maxY: 150000 })).data;
  const items = all.filter(filterFn);
  console.log(`=== ${name} === (${items.length} entities)`);
  for (const e of items) {
    if (e.type === 'LINE') {
      console.log(`  LINE: ${e.handle} (${e.x1?.toFixed(1)}, ${e.y1?.toFixed(1)}) -> (${e.x2?.toFixed(1)}, ${e.y2?.toFixed(1)})`);
    } else if (e.type === 'INSERT' && Math.abs(e.x) < 200000) {
      console.log(`  INSERT: ${e.handle} ${e.blockName} (${e.x?.toFixed(1)}, ${e.y?.toFixed(1)})`);
    }
  }
}

async function main() {
  // 1. NW: X around -74300, Y from 74000 to 78000
  await inspectStretch('NW Z-offset', e => e.layer.includes('SED') && ((e.x1 && Math.abs(e.x1 - -74282) < 2000) || (e.x && Math.abs(e.x - -74282) < 2000)) && ((e.y1 && e.y1 >= 74000 && e.y1 <= 78000) || (e.y && e.y >= 74000 && e.y <= 78000)));

  // 2. South Main 1: corner X around -51000, Y=29000 to 34000
  await inspectStretch('South Main 1', e => e.layer.includes('SED') && ((e.x1 && e.x1 >= -53000 && e.x1 <= -50000) || (e.x && e.x >= -53000 && e.x <= -50000)) && ((e.y1 && e.y1 >= 29000 && e.y1 <= 34000) || (e.y && e.y >= 29000 && e.y <= 34000)));

  // 3. South Main 2: Y around 33500, X from -75000 to -73000
  await inspectStretch('South Main 2', e => e.layer.includes('SED') && ((e.y1 && Math.abs(e.y1 - 33500) < 2000) || (e.y && Math.abs(e.y - 33500) < 2000)) && ((e.x1 && e.x1 >= -75000 && e.x1 <= -73000) || (e.x && e.x >= -75000 && e.x <= -73000)));

  // 4. Southeast: X around -50900, Y from 6500 to 8500
  await inspectStretch('Southeast Z-offset', e => e.layer.includes('SED') && ((e.x1 && Math.abs(e.x1 - -50900) < 2000) || (e.x && Math.abs(e.x - -50900) < 2000)) && ((e.y1 && e.y1 >= 6500 && e.y1 <= 8500) || (e.y && e.y >= 6500 && e.y <= 8500)));
}

main().catch(console.error);
