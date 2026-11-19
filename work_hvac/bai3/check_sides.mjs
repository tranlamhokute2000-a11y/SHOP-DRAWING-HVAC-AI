import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function checkSides(name, cx, cy) {
  console.log(`\n=== SIDES CHECK FOR ${name} at (${cx.toFixed(0)}, ${cy.toFixed(0)}) ===`);
  const r = 3500;
  const sides = [
    { dir: 'RIGHT (+X)', minX: cx + 500, maxX: cx + r, minY: cy - 1500, maxY: cy + 1500 },
    { dir: 'LEFT (-X)', minX: cx - r, maxX: cx - 500, minY: cy - 1500, maxY: cy + 1500 },
    { dir: 'UP (+Y)', minX: cx - 1500, maxX: cx + 1500, minY: cy + 500, maxY: cy + r },
    { dir: 'DOWN (-Y)', minX: cx - 1500, maxX: cx + 1500, minY: cy - r, maxY: cy - 500 },
  ];
  for (const s of sides) {
    const ents = (await callTool('get_entities_in_area', s)).data || [];
    console.log(`  Direction ${s.dir}: ${ents.length} entities`);
  }
}

async function main() {
  await checkSides('1. SED NW', -74282, 74885);
  await checkSides('2. SED South 1', -50982, 29411);
  await checkSides('3. SED South 2', -74165, 33518);
  await checkSides('4. SED SE', -50839, 7513);
}

main().catch(console.error);
