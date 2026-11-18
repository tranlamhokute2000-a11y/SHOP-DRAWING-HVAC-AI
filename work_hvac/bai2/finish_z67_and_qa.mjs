import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const CLOUD_ARC = 200;
const CLOUD_PAD = 150;
const DIM_STYLE = 'HỒ-DIM 1-70';
const sleep = ms => new Promise(r => setTimeout(r, ms));

await callTool('send_command', { command: '_.OSMODE\n0\n_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });

async function drawCrispLeader(arrowPt, tailPt) {
  await callTool('send_command', { command: '_.DIMLDRBLK\n.\n_.DIMASZ\n3\n' });
  await sleep(100);
  const r = await callTool('draw_leader', { layer: 'M-MVAC-DIM', points: [arrowPt, tailPt] });
  await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  await sleep(100);
  return r;
}

// 1. Z-06 leader (cloud 1E2BC already created!)
const c6bb = (await callTool('get_bounding_box', { handles: ['1E2BC'] })).data;
const cx6 = (45795.97 + 46564.18) / 2;
const ry2_6 = 62585.89 + 450;
const l6 = await drawCrispLeader({ x: cx6, y: ry2_6 }, { x: cx6, y: c6bb.minY });
console.log('[Z-06] cloud=1E2BC', `${c6bb.width.toFixed(0)}x${c6bb.height.toFixed(0)}`, 'ldr=', l6.data.handle);

// 2. Z-07: 3 dims + snug cloud + crisp leader
const elev7 = ['1E1B5', '1E1B6', '1E1B7'];
const H7 = 500, dZ7 = 440, t7 = H7 * (SQRT2 - 1);
const ebb7 = (await callTool('get_bounding_box', { handles: elev7 })).data;
const xLeft7 = ebb7.minX, xRight7 = ebb7.maxX, xSq7 = xLeft7 + t7, ySq7 = ebb7.minY + H7 / 2;
const dimX7 = xLeft7 - 140;
const dOff7 = t7 / SQRT2, wOff7 = (H7 / 2) / SQRT2;

const d1 = await callTool('draw_linear_dim', {
  x1: xLeft7, y1: ySq7 - H7 / 2, x2: xLeft7, y2: ySq7 + H7 / 2,
  rotation: 90, dimLineX: dimX7, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
});
const d2 = await callTool('draw_linear_dim', {
  x1: xLeft7, y1: ySq7 + H7 / 2, x2: xRight7, y2: ySq7 + dZ7 + H7 / 2,
  rotation: 90, dimLineX: dimX7, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
});
const sp1x = xSq7 + dOff7, sp1y = ySq7 + dOff7;
const sp2x = xSq7 + dZ7 - dOff7, sp2y = ySq7 + dZ7 - dOff7;
const d3 = await callTool('draw_aligned_dim', {
  x1: sp2x + wOff7, y1: sp2y - wOff7, x2: sp1x + wOff7, y2: sp1y - wOff7,
  offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
});
const bb7 = (await callTool('get_bounding_box', { handles: [...elev7, d1.data.handle, d2.data.handle, d3.data.handle] })).data;

const beforeClouds = new Set((await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles);
await callTool('set_layer', { layerName: 'CLOUND' });
await callTool('send_command', {
  command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${(bb7.minX - CLOUD_PAD).toFixed(2)},${(bb7.minY - CLOUD_PAD).toFixed(2)}\n${(bb7.maxX + CLOUD_PAD).toFixed(2)},${(bb7.maxY + CLOUD_PAD).toFixed(2)}\n`,
});
await sleep(300);
const afterClouds = (await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles;
const c7h = afterClouds.find(h => !beforeClouds.has(h));
const c7bb = (await callTool('get_bounding_box', { handles: [c7h] })).data;
const cy7 = (60583.40 + 61441.60) / 2;
const l7 = await drawCrispLeader({ x: 44976.32 + 450, y: cy7 }, { x: c7bb.minX, y: cy7 });
console.log('[Z-07] cloud=' + c7h, `${c7bb.width.toFixed(0)}x${c7bb.height.toFixed(0)}`, 'ldr=', l7.data.handle);

// 3. Clean up, purge, restore OSMODE, save
await callTool('purge_unused_blocks');
await callTool('send_command', { command: '_.OSMODE\n4031\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
await callTool('save_drawing');

// 4. Export verification PNGs
const outDir = 'C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2';
const crops = [
  ['qa_z_01ab', 56200, 46200, 62400, 51300],
  ['qa_z_02',   46000, 49500, 52400, 52300],
  ['qa_z_03',   26400, 53800, 29400, 59100],
  ['qa_z_04_05',50000, 27600, 69500, 30500],
  ['qa_z_06_07',44000, 59800, 49400, 66500],
];
for (const [name, minX, minY, maxX, maxY] of crops) {
  await callTool('export_plan_image', { outDir, fileName: name, format: 'png', grid: false, widthPx: 2200, minX, minY, maxX, maxY });
}
await callTool('export_plan_image', { outDir, fileName: 'qa_full_z_offsets', format: 'png', grid: true, widthPx: 2800 });
console.log('ALL Z-OFFSETS SAVED & 6 QA PNGS EXPORTED!');
