import fs from 'node:fs';
import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const DIM_STYLE = 'HỒ-DIM 1-70';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Restore pure HỒ-DIM 1-70 BEFORE touching any dim!
await callTool('send_command', { command: '_.OSMODE\n0\n_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
await sleep(150);

// Inspect exact aligned-dim handles to replace on Z-01b, Z-03, Z-06, Z-07 + vertical dims on Z-01a, Z-06
const targets = [
  { id: 'Z-01b', elev: ['1E0BA', '1E0BB', '1E0BC'], H: 450, dZ: 545, area: [60000, 48800, 62200, 51200], fixVert: false },
  { id: 'Z-03',  elev: ['1E131', '1E139', '1E13A'], H: 450, dZ: 420, area: [26600, 56800, 29000, 58900], fixVert: false },
  { id: 'Z-06',  elev: ['1E172', '1E17A', '1E17B'], H: 500, dZ: 350, area: [45000, 64000, 47400, 66200], fixVert: true },
  { id: 'Z-07',  elev: ['1E1B5', '1E1B6', '1E1B7'], H: 500, dZ: 440, area: [46500, 60000, 49000, 62200], fixVert: false },
  { id: 'Z-01a', elev: ['1E085', '1E08D', '1E08E'], H: 450, dZ: 545, area: [56600, 48800, 59000, 51200], fixVert: true, stepDown: true },
];

for (const tg of targets) {
  const ents = (await callTool('get_entities_in_area', {
    minX: tg.area[0], minY: tg.area[1], maxX: tg.area[2], maxY: tg.area[3],
  })).data || [];
  const dims = ents.filter(e => e.type === 'DIMENSION' && e.layer === 'M-MVAC-DIM');
  const ebb = (await callTool('get_bounding_box', { handles: tg.elev })).data;
  const t = tg.H * (SQRT2 - 1);
  const xLeft = ebb.minX, xRight = ebb.maxX, xSq = xLeft + t, ySq = ebb.minY + tg.H / 2;
  const dimX = xLeft - 140;
  const dOff = t / SQRT2, wOff = (tg.H / 2) / SQRT2;

  // Erase existing dims in this callout and redraw cleanly with pure HỒ-DIM 1-70
  await callTool('batch_erase_entities', { handles: dims.map(d => d.handle) });
  await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  await sleep(80);

  if (tg.stepDown) {
    await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + tg.dZ - tg.H / 2, x2: xLeft, y2: ySq + tg.dZ + tg.H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + tg.dZ - tg.H / 2, x2: xRight, y2: ySq - tg.H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    const sp1x = xSq + dOff, sp1y = ySq + tg.dZ - dOff;
    const sp2x = xSq + tg.dZ - dOff, sp2y = ySq + dOff;
    await callTool('draw_aligned_dim', {
      x1: sp1x + wOff, y1: sp1y + wOff, x2: sp2x + wOff, y2: sp2y + wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  } else {
    await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq - tg.H / 2, x2: xLeft, y2: ySq + tg.H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + tg.H / 2, x2: xRight, y2: ySq + tg.dZ + tg.H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    // Place aligned dim on lower-right outer wall with generous offset=380 so text sits 100% clear of elbow!
    const sp1x = xSq + dOff, sp1y = ySq + dOff;
    const sp2x = xSq + tg.dZ - dOff, sp2y = ySq + tg.dZ - dOff;
    await callTool('draw_aligned_dim', {
      x1: sp2x + wOff, y1: sp2y - wOff, x2: sp1x + wOff, y2: sp1y - wOff,
      offset: 380, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  }
  console.log(`[${tg.id}] Polished 3 dims cleanly`);
}

await callTool('send_command', { command: '_.OSMODE\n4031\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
await callTool('save_drawing');

const outDir = 'C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2';
await callTool('export_plan_image', { outDir, fileName: 'qa_z_01ab', format: 'png', grid: false, widthPx: 2200, minX: 56200, minY: 46200, maxX: 62400, maxY: 51300 });
await callTool('export_plan_image', { outDir, fileName: 'qa_z_03', format: 'png', grid: false, widthPx: 2200, minX: 26400, minY: 53800, maxX: 29400, maxY: 59100 });
await callTool('export_plan_image', { outDir, fileName: 'qa_z_06_07', format: 'png', grid: false, widthPx: 2200, minX: 44000, minY: 59800, maxX: 49400, maxY: 66500 });
await callTool('export_plan_image', { outDir, fileName: 'qa_full_z_offsets', format: 'png', grid: true, widthPx: 2800 });
console.log('POLISH DONE & SAVED!');
