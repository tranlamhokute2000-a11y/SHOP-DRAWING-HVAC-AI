import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function listEnts(label, box) {
  console.log(`\n--- ${label} ---`);
  const ents = (await callTool('get_entities_in_area', box)).data || [];
  for (const e of ents) {
    if (e.type === 'LINE') {
      console.log(`  LINE: [${e.startX.toFixed(0)}, ${e.startY.toFixed(0)}] -> [${e.endX.toFixed(0)}, ${e.endY.toFixed(0)}] on ${e.layer}`);
    } else if (e.type === 'MTEXT' || e.type === 'TEXT') {
      console.log(`  TEXT: "${e.text || e.content}" at [${e.x.toFixed(0)}, ${e.y.toFixed(0)}]`);
    } else {
      console.log(`  ${e.type} on ${e.layer} (${e.blockName || ''})`);
    }
  }
}

async function main() {
  // 1. SED NW: check RIGHT
  await listEnts('1. NW RIGHT', { minX: -73700, maxX: -70500, minY: 73500, maxY: 76500 });

  // 2. South 1: check RIGHT and LEFT
  await listEnts('2. South 1 RIGHT', { minX: -50000, maxX: -47500, minY: 28000, maxY: 31000 });
  await listEnts('2. South 1 LEFT', { minX: -54500, maxX: -52000, minY: 28000, maxY: 31000 });

  // 3. South 2: check UP and DOWN
  await listEnts('3. South 2 UP', { minX: -75500, maxX: -72500, minY: 34300, maxY: 37500 });
  await listEnts('3. South 2 DOWN', { minX: -75500, maxX: -72500, minY: 29500, maxY: 32700 });

  // 4. SE: check RIGHT and LEFT
  await listEnts('4. SE RIGHT', { minX: -50300, maxX: -47500, minY: 6000, maxY: 9000 });
  await listEnts('4. SE LEFT', { minX: -54000, maxX: -51400, minY: 6000, maxY: 9000 });
}

main().catch(console.error);
