// Fix BOTH:
// 1) Exact 0.000 mm snapped detail Dims derived directly from HTS elbow insertion vertices (NOT rotated bbox!)
// 2) Exact Spec Leader style via MATCHPROP from reference leader 1DFB3 (Sếp Hồ's Spec leader on Z-04)

import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const DIM_STYLE = 'HỒ-DIM 1-70';
const CLOUD_ARC = 200;
const CLOUD_PAD = 150;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const zConfigs = [
  { id: 'Z-01a', H: 450, side: 'UP',    rx1: 57649.13, ry1: 46821.28, rx2: 58570.91, ry2: 47771.28, search: [56400, 48700, 58900, 51300], elev: ['1E085','1E08D','1E08E'], cloudH: '1E212', ldrH: '1E213' },
  { id: 'Z-01b', H: 450, side: 'UP',    rx1: 59950.78, ry1: 46821.48, rx2: 60872.55, ry2: 47771.48, search: [59900, 48700, 62400, 51300], elev: ['1E0BA','1E0BB','1E0BC'], cloudH: '1E23B', ldrH: '1E23C' },
  { id: 'Z-02',  H: 450, side: 'LEFT',  rx1: 50072.71, ry1: 50339.25, rx2: 51922.71, ry2: 51466.04, search: [46200, 49600, 49200, 52300], elev: ['1E0F2','1E0FA','1E0FB'], cloudH: '1E264', ldrH: '1E265' },
  { id: 'Z-03',  H: 450, side: 'UP',    rx1: 27417.12, ry1: 54259.78, rx2: 28212.53, ry2: 55759.78, search: [26400, 56600, 29300, 59200], elev: ['1E131','1E139','1E13A'], cloudH: '1E28F', ldrH: '1E290' },
  { id: 'Z-05',  H: 350, side: 'RIGHT', rx1: 65274.56, ry1: 28744.94, rx2: 66024.56, ry2: 29588.89, search: [66800, 28000, 69400, 30300], elev: ['1E027','1E02F','1E030'], cloudH: '1E077', ldrH: '1E1EA' },
  { id: 'Z-06',  H: 500, side: 'UP',    rx1: 45795.97, ry1: 62135.89, rx2: 46564.18, ry2: 63035.89, search: [44900, 63800, 47600, 66500], elev: ['1E172','1E17A','1E17B'], cloudH: '1E2BC', ldrH: '1E2BD' },
  { id: 'Z-07',  H: 500, side: 'RIGHT', rx1: 44526.32, ry1: 60583.40, rx2: 45426.32, ry2: 61441.60, search: [46300, 59900, 49200, 62400], elev: ['1E1B5','1E1B6','1E1B7'], cloudH: '1E2E7', ldrH: '1E2E8' },
];

await callTool('send_command', { command: '_.OSMODE\n0\n_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
await sleep(150);

const newLeaders = [];

for (const cfg of zConfigs) {
  const { id, H, side, rx1, ry1, rx2, ry2, search, cloudH, ldrH } = cfg;
  const cx = (rx1 + rx2) / 2, cy = (ry1 + ry2) / 2;

  // 1. Query actual elevation blocks & old dims in callout area
  const ents = (await callTool('get_entities_in_area', {
    minX: search[0], minY: search[1], maxX: search[2], maxY: search[3],
  })).data || [];

  const elevSet = new Set(cfg.elev);
  const elbows = ents.filter(e => elevSet.has(e.handle) && (e.blockName || '').startsWith('HTS-CO-'));
  const spools = ents.filter(e => elevSet.has(e.handle) && (e.blockName || '').startsWith('HTS-OG-'));
  const oldDims = ents.filter(e => e.type === 'DIMENSION' && e.layer === 'M-MVAC-DIM');

  if (elbows.length !== 2 || spools.length !== 1) {
    throw new Error(`${id}: expected 2 elbows + 1 spool, found ${elbows.length} elbows, ${spools.length} spools`);
  }

  // Sort elbows left-to-right by actual insertion point X!
  elbows.sort((a, b) => a.x - b.x);
  const [eL, eR] = elbows;
  const xLv = eL.x, yLv = eL.y;
  const xRv = eR.x, yRv = eR.y;
  const t = H * (SQRT2 - 1);
  const xLeft = xLv - t;
  const xRight = xRv + t;
  const dOff = t / SQRT2;
  const wOff = (H / 2) / SQRT2;
  const stepDown = yLv > yRv;

  // Erase old shifted dims, old cloud, and old leader
  await callTool('batch_erase_entities', { handles: [...oldDims.map(d => d.handle), cloudH, ldrH] });
  await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  await sleep(60);

  // 2. Draw 3 EXACT 0.000 mm snapped dims directly from (xLv, yLv) and (xRv, yRv)!
  const dimX = xLeft - 140;
  let d1, d2, d3;
  if (stepDown) {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2, x2: xLeft, y2: yLv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2, x2: xRight, y2: yRv - H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    // Exact upper-right outer wall corners of sloped spool
    const p1x = xLv + dOff + wOff, p1y = yLv - dOff + wOff;
    const p2x = xRv - dOff + wOff, p2y = yRv + dOff + wOff;
    d3 = await callTool('draw_aligned_dim', {
      x1: p1x, y1: p1y, x2: p2x, y2: p2y,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  } else {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2, x2: xLeft, y2: yLv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv + H / 2, x2: xRight, y2: yRv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    // Exact lower-right outer wall corners of sloped spool (offset 340 so text sits completely clear outside!)
    const p1x = xRv - dOff + wOff, p1y = yRv - dOff - wOff;
    const p2x = xLv + dOff + wOff, p2y = yLv + dOff - wOff;
    d3 = await callTool('draw_aligned_dim', {
      x1: p1x, y1: p1y, x2: p2x, y2: p2y,
      offset: 340, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  }

  const dimHandles = [d1.data.handle, d2.data.handle, d3.data.handle];
  const elevHandles = [eL.handle, eR.handle, spools[0].handle];

  // 3. Re-wrap snug REVCLOUD on CLOUND around exact new bbox
  const bb = (await callTool('get_bounding_box', { handles: [...elevHandles, ...dimHandles] })).data;
  const beforeC = new Set((await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles);
  await callTool('set_layer', { layerName: 'CLOUND' });
  await callTool('send_command', {
    command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${(bb.minX - CLOUD_PAD).toFixed(2)},${(bb.minY - CLOUD_PAD).toFixed(2)}\n${(bb.maxX + CLOUD_PAD).toFixed(2)},${(bb.maxY + CLOUD_PAD).toFixed(2)}\n`,
  });
  await sleep(250);
  const afterC = (await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles;
  const newCloudH = afterC.find(h => !beforeC.has(h));
  const cbb = (await callTool('get_bounding_box', { handles: [newCloudH] })).data;

  // 4. Create new Leader touching exact midpoint of Z-offset rectangle -> facing cloud edge
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
  const rLdr = await callTool('draw_leader', { layer: 'M-MVAC-DIM', points: [arrowPt, tailPt] });
  newLeaders.push(rLdr.data.handle);

  console.log(`[${id}] EXACT DIMS=${dimHandles.join(',')} | vtx=(${xLv.toFixed(1)},${yLv.toFixed(1)})->(${xRv.toFixed(1)},${yRv.toFixed(1)}) | cloud=${newCloudH} | ldr=${rLdr.data.handle}`);
}

// 5. Apply Sếp Hồ's MATCHPROP trick from reference Spec Leader 1DFB3 (Z-04) onto ALL 7 leaders!
const mpCmd = '_.MATCHPROP\n(handent "1DFB3")\n' + newLeaders.map(h => `(handent "${h}")`).join('\n') + '\n\n';
console.log('Running MATCHPROP from 1DFB3 onto', newLeaders.length, 'leaders...');
const mpRes = await callTool('send_command', { command: mpCmd });
console.log('MATCHPROP result:', JSON.stringify(mpRes));
await sleep(300);

// Restore OSMODE, current layer, QSAVE
await callTool('send_command', { command: '_.OSMODE\n4031\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
await callTool('save_drawing');

// Export high-res verification PNGs of EVERY Z-offset!
const outDir = 'C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2';
const crops = [
  ['qa_z_01ab_v2', 56200, 46200, 62400, 51300],
  ['qa_z_02_v2',   46000, 49500, 52400, 52300],
  ['qa_z_03_v2',   26400, 53800, 29400, 59100],
  ['qa_z_04_05_v2',50000, 27600, 69500, 30500],
  ['qa_z_06_07_v2',44000, 59800, 49400, 66500],
];
for (const [name, minX, minY, maxX, maxY] of crops) {
  await callTool('export_plan_image', { outDir, fileName: name, format: 'png', grid: false, widthPx: 2200, minX, minY, maxX, maxY });
}
console.log('ALL FIXED, MATCHPROPPED, SAVED & EXPORTED!');
