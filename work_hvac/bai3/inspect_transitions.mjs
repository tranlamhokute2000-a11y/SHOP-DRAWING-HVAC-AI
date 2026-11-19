import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function inspectAreaLines(name, minX, minY, maxX, maxY) {
  const ents = (await callTool('get_entities_in_area', { minX, minY, maxX, maxY })).data;
  console.log(`\n=== ${name} === (total ${ents.length} entities)`);
  for (const e of ents) {
    if (e.type === 'LINE') {
      console.log(`  LINE ${e.handle} [${e.layer}]: (${e.startX?.toFixed(1)}, ${e.startY?.toFixed(1)}) -> (${e.endX?.toFixed(1)}, ${e.endY?.toFixed(1)})`);
    } else if (e.type === 'INSERT') {
      console.log(`  INSERT ${e.handle} [${e.layer}]: ${e.blockName} at (${e.x?.toFixed(1)}, ${e.y?.toFixed(1)})`);
    } else if (e.type === 'MTEXT' || e.type === 'TEXT') {
      console.log(`  TEXT ${e.handle} [${e.layer}]: "${(e.content || e.text || '').replace(/\n/g, ' ')}"`);
    }
  }
}

async function main() {
  await inspectAreaLines('1. NW Transition (Y=74500..77500)', -75500, 74500, -73500, 77500);
  await inspectAreaLines('2. South Main 1 Transition', -53500, 31000, -50500, 34000);
  await inspectAreaLines('3. South Main 2 Transition', -75000, 32500, -73000, 34500);
  await inspectAreaLines('4. Southeast Transition', -51500, 6500, -50500, 8500);
}

main().catch(console.error);
