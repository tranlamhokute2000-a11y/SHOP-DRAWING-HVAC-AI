import fs from 'node:fs';
import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const CLOUD_ARC = 200;
const CLOUD_PAD = 150;
const DIM_STYLE = 'HỒ-DIM 1-70';

const prev = JSON.parse(fs.readFileSync('work_hvac/bai2/z_offsets_result.json', 'utf8'));
const toErase = ['1E078', '1E1E1', '1E1A7', '1E164', '1E123', '1E0E4', '1E0B6'];
for (const p of prev) {
  toErase.push(...p.dimHandles, p.leader);
}
await callTool('batch_erase_entities', { handles: [...new Set(toErase)] });

await callTool('send_command', { command: '_.OSMODE\n0\n_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });

async function drawCrispLeader(arrowPt, tailPt) {
  await callTool('send_command', { command: '_.DIMLDRBLK\n.\n_.DIMASZ\n3\n' });
  const r = await callTool('draw_leader', { layer: 'M-MVAC-DIM', points: [arrowPt, tailPt] });
  await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  return r;
}

const z5Cbb = (await callTool('get_bounding_box', { handles: ['1E077'] })).data;
const z5MidY = (28744.94 + 29588.89) / 2;
const z5Ldr = await drawCrispLeader({ x: 65649.56 + 375, y: z5MidY }, { x: z5Cbb.minX, y: z5MidY });
console.log('[Z-05] crisp leader:', z5Ldr.data.handle);

const rectBoxes = {
  'Z-01a': { rx1: 57649.13, ry1: 47296.28 - 475, rx2: 58570.91, ry2: 47296.28 + 475 },
  'Z-01b': { rx1: 59950.78, ry1: 47296.48 - 475, rx2: 60872.55, ry2: 47296.48 + 475 },
  'Z-02':  { rx1: 50997.71 - 925, ry1: 50339.25, rx2: 50997.71 + 925, ry2: 51466.04 },
  'Z-03':  { rx1: 27417.12, ry1: 55009.78 - 750, rx2: 28212.53, ry2: 55009.78 + 750 },
  'Z-06':  { rx1: 45795.97, ry1: 62585.89 - 450, rx2: 46564.18, ry2: 62585.89 + 450 },
  'Z-07':  { rx1: 44976.32 - 450, ry1: 60583.40, rx2: 44976.32 + 450, ry2: 61441.60 },
};

const updated = [];
for (const p of prev) {
  const { id, H, dZ, side, stepDir, elevHandles } = p;
  const { rx1, ry1, rx2, ry2 } = rectBoxes[id];
  const cx = (rx1 + rx2) / 2, cy = (ry1 + ry2) / 2;
  const t = H * (SQRT2 - 1);
  const ebb = (await callTool('get_bounding_box', { handles: elevHandles })).data;
  const xLeft = ebb.minX;
  const xRight = ebb.maxX;
  const xSq = xLeft + t;
  const ySq = ebb.minY + H / 2;

  const dimX = xLeft - 140;
  const dOff = t / SQRT2;
  const wOff = (H / 2) / SQRT2;
  let d1, d2, d3;
  if (stepDir === 'DOWN') {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + dZ - H / 2, x2: xLeft, y2: ySq + dZ + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + dZ - H / 2, x2: xRight, y2: ySq - H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    const sp1x = xSq + dOff, sp1y = ySq + dZ - dOff;
    const sp2x = xSq + dZ - dOff, sp2y = ySq + dOff;
    d3 = await callTool('draw_aligned_dim', {
      x1: sp1x + wOff, y1: sp1y + wOff, x2: sp2x + wOff, y2: sp2y + wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  } else {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq - H / 2, x2: xLeft, y2: ySq + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + H / 2, x2: xRight, y2: ySq + dZ + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    const sp1x = xSq + dOff, sp1y = ySq + dOff;
    const sp2x = xSq + dZ - dOff, sp2y = ySq + dZ - dOff;
    d3 = await callTool('draw_aligned_dim', {
      x1: sp2x + wOff, y1: sp2y - wOff, x2: sp1x + wOff, y2: sp1y - wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  }

  const dimHandles = [d1.data.handle, d2.data.handle, d3.data.handle];
  const bb = (await callTool('get_bounding_box', { handles: [...elevHandles, ...dimHandles] })).data;

  const beforeClouds = new Set((await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles);
  await callTool('set_layer', { layerName: 'CLOUND' });
  await callTool('send_command', {
    command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${(bb.minX - CLOUD_PAD).toFixed(2)},${(bb.minY - CLOUD_PAD).toFixed(2)}\n${(bb.maxX + CLOUD_PAD).toFixed(2)},${(bb.maxY + CLOUD_PAD).toFixed(2)}\n`,
  });
  const afterClouds = (await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles;
  const newCloudHandle = afterClouds.find(h => !beforeClouds.has(h));
  const cbb = (await callTool('get_bounding_box', { handles: [newCloudHandle] })).data;

  let arrowPt, tailPt;
  if (side === 'RIGHT') {
    arrowPt = { x: rx2, y: cy }; tailPt = { x: cbb.minX, y: cy };
  } else if (side === 'LEFT') {
    arrowPt = { x: rx1, y: cy }; tailPt = { x: cbb.maxX, y: cy };
  } else if (side === 'UP') {
    arrowPt = { x: cx, y: ry2 }; tailPt = { x: cx, y: cbb.minY };
  } else {
    arrowPt = { x: cx, y: ry1 }; tailPt = { x: cx, y: cbb.maxY };
  }
  const rLdr = await drawCrispLeader(arrowPt, tailPt);
  console.log(`[${id}] OK cloud=${newCloudHandle} (${cbb.width.toFixed(0)}x${cbb.height.toFixed(0)}) ldr=${rLdr.data.handle}`);
  updated.push({ ...p, dimHandles, cloud: newCloudHandle, leader: rLdr.data.handle, cloudBbox: cbb });
}

await callTool('send_command', { command: '_.OSMODE\n4031\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
await callTool('save_drawing');
fs.writeFileSync('work_hvac/bai2/z_offsets_result.json', JSON.stringify(updated, null, 2), 'utf8');
