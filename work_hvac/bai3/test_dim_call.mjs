import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  const r = await callTool('draw_linear_dim', {
    x1: 0, y1: 0, x2: 1000, y2: 0,
    rotation: 0, dimLineY: 200,
    dimStyle: 'HỒ-DIM 1-70',
    layer: 'M-MVAC-DIM'
  });
  console.log('Result with HỒ-DIM 1-70:', r);
  if (r.data?.handle) {
    // Erase the test dim
    await callTool('batch_erase_entities', { handles: [r.data.handle] });
    console.log('Test dim cleaned up!');
  }
}

main().catch(console.error);
