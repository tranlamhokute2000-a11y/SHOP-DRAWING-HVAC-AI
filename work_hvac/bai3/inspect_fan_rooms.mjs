import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function inspectArea(name, minX, minY, maxX, maxY) {
  console.log(`\n========================================`);
  console.log(`INSPECTING: ${name} [${minX}, ${minY}] .. [${maxX}, ${maxY}]`);
  console.log(`========================================`);
  
  const res = await callTool('get_entities_in_area', { minX, minY, maxX, maxY });
  const entities = res.data || [];
  console.log(`Total entities: ${entities.length}`);
  
  const byLayer = {};
  for (const e of entities) {
    byLayer[e.layer] = byLayer[e.layer] || [];
    byLayer[e.layer].push(e);
  }
  for (const [l, list] of Object.entries(byLayer)) {
    console.log(`  Layer '${l}': ${list.length} entities (${[...new Set(list.map(e => e.type))].join(', ')})`);
  }

  const inserts = entities.filter(e => e.type === 'INSERT');
  console.log(`\nINSERT Blocks (${inserts.length}):`);
  for (const ins of inserts) {
    console.log(`  [${ins.handle}] ${ins.blockName} at (${ins.x?.toFixed(1)}, ${ins.y?.toFixed(1)}) rot=${ins.rotation?.toFixed(2)} layer=${ins.layer}`);
  }

  const texts = entities.filter(e => e.type === 'MTEXT' || e.type === 'TEXT');
  console.log(`\nTexts (${texts.length}):`);
  for (const t of texts) {
    console.log(`  [${t.handle}] "${t.content?.replace(/\n/g, ' ')}" at (${t.x?.toFixed(1)}, ${t.y?.toFixed(1)}) layer=${t.layer}`);
  }

  const lines = entities.filter(e => e.type === 'LINE');
  console.log(`\nLines: ${lines.length}`);
}

async function main() {
  // Fan Room 1 (North)
  await inspectArea('Fan Room 1 (North)', -83000, 108000, -73000, 120500);

  // Fan Room 2 (South-East)
  await inspectArea('Fan Room 2 (South-East)', -44500, 15000, -36500, 20500);
}

main().catch(console.error);
