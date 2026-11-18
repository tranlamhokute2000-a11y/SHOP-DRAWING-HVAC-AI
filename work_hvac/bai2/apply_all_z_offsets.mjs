// Apply vertical elevation-change (Z-offset, dZ > 200mm) shop drawing detail standard
// across all 8 Z-offsets on bai 2.dwg per Sếp Hồ's Spec v3 & square-trick prototype.

import fs from 'node:fs';
import { callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const LEADER_GAP = 1260;
const CLOUD_ARC = 200;
const CLOUD_PAD = 150;
const DIM_STYLE = 'HỒ-DIM 1-70';

async function drawLeaderWithArrow(fromPt, toPt) {
  // Use standard closed-filled arrowhead (DIMLDRBLK = ".") with crisp size matching Z-04 prototype
  await callTool('send_command', { command: '_.DIMLDRBLK\n.\n_.DIMASZ\n180\n' });
  const r = await callTool('draw_leader', {
    layer: 'M-MVAC-DIM',
    points: [fromPt, toPt],
  });
  return r;
}

async function buildZOffset(cfg) {
  const { id, layer, eraseHandles, rx1, ry1, rx2, ry2, W, H, z1, z2, orient, stepDir, side } = cfg;
  const dZ = Math.abs(z1 - z2);
  const lowBod = Math.min(z1, z2);
  const t = H * (SQRT2 - 1);
  const elevW = dZ + 2 * t;
  const elevH = dZ + H;

  // 1. Erase old straight Z-bridge block(s)
  if (eraseHandles && eraseHandles.length) {
    await callTool('batch_erase_entities', { handles: eraseHandles });
  }

  // 2. Plan-view RECTANG + Z-step diagonal PL on duct's Spec layer
  const rRect = await callTool('draw_rectangle', { x1: rx1, y1: ry1, x2: rx2, y2: ry2, layer });
  let plPts;
  if (orient === 'V') {
    const L = ry2 - ry1;
    const insS = W * 0.11, insE = L * 0.06, stub = L * 0.13;
    plPts = [
      { x: rx1 + insS, y: ry2 - insE },
      { x: rx1 + insS, y: ry2 - insE - stub },
      { x: rx2 - insS, y: ry1 + insE + stub },
      { x: rx2 - insS, y: ry1 + insE },
    ];
  } else {
    const L = rx2 - rx1;
    const insS = W * 0.11, insE = L * 0.06, stub = L * 0.13;
    if (stepDir === 'DOWN') {
      plPts = [
        { x: rx1 + insE, y: ry2 - insS },
        { x: rx1 + insE + stub, y: ry2 - insS },
        { x: rx2 - insE - stub, y: ry1 + insS },
        { x: rx2 - insE, y: ry1 + insS },
      ];
    } else {
      plPts = [
        { x: rx1 + insE, y: ry1 + insS },
        { x: rx1 + insE + stub, y: ry1 + insS },
        { x: rx2 - insE - stub, y: ry2 - insS },
        { x: rx2 - insE, y: ry2 - insS },
      ];
    }
  }
  const rPl = await callTool('draw_polyline', { layer, closed: false, points: plPts });

  // 3. Compute Side Elevation anchor (xLeft, ySq) so cloud edge is ~1260 mm from duct
  const cx = (rx1 + rx2) / 2;
  const cy = (ry1 + ry2) / 2;
  const dimLeftPad = 360; // space on left of xLeft for vertical H & dZ dims
  const cloudExtra = CLOUD_PAD + CLOUD_ARC * 0.34; // ~218 mm beyond elev+dim bbox

  let xLeft, ySq;
  if (side === 'RIGHT') {
    xLeft = rx2 + LEADER_GAP + cloudExtra + dimLeftPad;
    ySq = cy - dZ / 2;
  } else if (side === 'LEFT') {
    const rightSpace = 220; // aligned dim protrusion to right
    const xRight = rx1 - LEADER_GAP - cloudExtra - rightSpace;
    xLeft = xRight - elevW;
    ySq = cy - dZ / 2;
  } else if (side === 'UP') {
    // Center horizontally over cx (or shifted slightly if cfg.xShift provided)
    const xShift = cfg.xShift || 0;
    xLeft = cx + xShift - elevW / 2 + 80;
    ySq = ry2 + LEADER_GAP + cloudExtra + H / 2 + 80;
  } else {
    const xShift = cfg.xShift || 0;
    xLeft = cx + xShift - elevW / 2 + 80;
    ySq = ry1 - LEADER_GAP - cloudExtra - dZ - H / 2 - 180;
  }

  const xSq = xLeft + t;
  const xRight = xSq + dZ + t;

  // 4. Draw 2x45 deg elbows + spool via 100% HTS draw_rectangular_duct (swapped W_elev=H, H_elev=W, R=H/2)
  const pts = stepDir === 'DOWN'
    ? [
        { x: xLeft, y: ySq + dZ },
        { x: xSq, y: ySq + dZ },
        { x: xSq + dZ, y: ySq },
        { x: xRight, y: ySq },
      ]
    : [
        { x: xLeft, y: ySq },
        { x: xSq, y: ySq },
        { x: xSq + dZ, y: ySq + dZ },
        { x: xRight, y: ySq + dZ },
      ];

  const rDuct = await callTool('draw_rectangular_duct', {
    runs: [{ W: H, H: W, R: H / 2, layer, prefix: 'HTS', points: pts }],
  });
  const runInfo = rDuct.data?.runs?.[0] || {};
  const elevHandles = [...(runInfo.straightHandles || []), ...(runInfo.elbowHandles || [])];
  if (elevHandles.length !== 3) {
    console.warn(`WARN ${id}: expected 3 elevation handles, got ${elevHandles.length}`, JSON.stringify(runInfo));
  }

  // Assign HTS_OG_DAY to elevation blocks
  await callTool('duct_set_elevation', { nhom: [{ handles: elevHandles, day: lowBod }] });

  // 5. Add 3 Detail Dimensions (HỒ-DIM 1-70 on M-MVAC-DIM)
  const dimX = xLeft - 140;
  const dOff = t / SQRT2;
  const wOff = (H / 2) / SQRT2;
  let d1, d2, d3;

  if (stepDir === 'DOWN') {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + dZ - H / 2,
      x2: xLeft, y2: ySq + dZ + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + dZ - H / 2,
      x2: xRight, y2: ySq - H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    const sp1x = xSq + dOff, sp1y = ySq + dZ - dOff;
    const sp2x = xSq + dZ - dOff, sp2y = ySq + dOff;
    d3 = await callTool('draw_aligned_dim', {
      x1: sp1x + wOff, y1: sp1y + wOff,
      x2: sp2x + wOff, y2: sp2y + wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  } else {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq - H / 2,
      x2: xLeft, y2: ySq + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: ySq + H / 2,
      x2: xRight, y2: ySq + dZ + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    // Spool climbs UP left-to-right; upper-left outer wall normal is (-1/sqrt2, +1/sqrt2)
    // Wait: to keep dim text clean outside on lower-right side (away from left vertical dims!), place on lower-right outer wall (+1/sqrt2, -1/sqrt2)!
    const sp1x = xSq + dOff, sp1y = ySq + dOff;
    const sp2x = xSq + dZ - dOff, sp2y = ySq + dZ - dOff;
    d3 = await callTool('draw_aligned_dim', {
      x1: sp2x + wOff, y1: sp2y - wOff,
      x2: sp1x + wOff, y2: sp1y - wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  }

  const dimHandles = [d1.data.handle, d2.data.handle, d3.data.handle];
  const bb = (await callTool('get_bounding_box', { handles: [...elevHandles, ...dimHandles] })).data;

  // 6. Snug REVCLOUD on CLOUND (Spec v3)
  await callTool('set_layer', { layerName: 'CLOUND' });
  const cMinX = (bb.minX - CLOUD_PAD).toFixed(2);
  const cMinY = (bb.minY - CLOUD_PAD).toFixed(2);
  const cMaxX = (bb.maxX + CLOUD_PAD).toFixed(2);
  const cMaxY = (bb.maxY + CLOUD_PAD).toFixed(2);
  await callTool('send_command', {
    command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${cMinX},${cMinY}\n${cMaxX},${cMaxY}\n`,
  });

  const areaC = await callTool('get_entities_in_area', {
    minX: bb.minX - 400, minY: bb.minY - 400,
    maxX: bb.maxX + 400, maxY: bb.maxY + 400,
  });
  const cloud = (areaC.data || []).find(e => e.layer === 'CLOUND');
  const cbb = (await callTool('get_bounding_box', { handles: [cloud.handle] })).data;

  // 7. Leader Arrow pointing straight into exact midpoint of Z-offset rectangle
  let arrowPt, tailPt;
  if (side === 'RIGHT') {
    arrowPt = { x: rx2, y: cy };
    tailPt = { x: cbb.minX, y: cy };
  } else if (side === 'LEFT') {
    arrowPt = { x: rx1, y: cy };
    tailPt = { x: cbb.maxX, y: cy };
  } else if (side === 'UP') {
    arrowPt = { x: cx, y: ry2 };
    tailPt = { x: cx, y: cbb.minY };
  } else {
    arrowPt = { x: cx, y: ry1 };
    tailPt = { x: cx, y: cbb.maxY };
  }
  const rLdr = await drawLeaderWithArrow(arrowPt, tailPt);

  console.log(`[${id}] DONE: rect=${rRect.data.handle} pl=${rPl.data.handle} elev=${elevHandles.join(',')} dims=${dimHandles.join(',')} cloud=${cloud.handle} ldr=${rLdr.data.handle}`);
  return {
    id, layer, W, H, z1, z2, dZ, side, stepDir,
    rect: rRect.data.handle, pl: rPl.data.handle,
    elevHandles, dimHandles, cloud: cloud.handle, leader: rLdr.data.handle,
    cloudBbox: cbb,
  };
}

async function main() {
  // Lock original design layers & OSMODE=0
  const origLayers = ['MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED', 'MEPG-M-EQUIP', 'MEPG-AC-TEXT', '0'];
  await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, locked: true } })));
  await callTool('send_command', { command: '_.OSMODE\n0\n' });

  // 1. Polish Z-04 prototype layers to Spec v3 (preserve 100% of Sếp Hồ's geometry!)
  await batchCall([
    { tool: 'set_entity_properties', args: { handle: '1DFB2', layer: 'CLOUND', color: 'ByLayer' } },
    { tool: 'set_entity_properties', args: { handle: '1DFA9', layer: 'M-MVAC-DIM', color: 'ByLayer' } },
    { tool: 'set_entity_properties', args: { handle: '1DFAC', layer: 'M-MVAC-DIM', color: 'ByLayer' } },
    { tool: 'set_entity_properties', args: { handle: '1DFAF', layer: 'M-MVAC-DIM', color: 'ByLayer' } },
  ]);
  await callTool('duct_set_elevation', { nhom: [{ handles: ['1DFA6', '1DFA7', '1DFA8'], day: 2500 }] });
  console.log('[Z-04] Polished layers (1DFB2->CLOUND, 1DFA9/AC/AF->M-MVAC-DIM) & HTS_OG_DAY=2500');

  // 2. Upgrade Z-05 cloud pad & leader arrowhead cleanly (replace 1E05A, 1E05B)
  await callTool('batch_erase_entities', { handles: ['1E05A', '1E05B'] });
  const z5bb = (await callTool('get_bounding_box', { handles: ['1E027', '1E02F', '1E030', '1E031', '1E040', '1E04D'] })).data;
  await callTool('set_layer', { layerName: 'CLOUND' });
  await callTool('send_command', {
    command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${(z5bb.minX - CLOUD_PAD).toFixed(2)},${(z5bb.minY - CLOUD_PAD).toFixed(2)}\n${(z5bb.maxX + CLOUD_PAD).toFixed(2)},${(z5bb.maxY + CLOUD_PAD).toFixed(2)}\n`,
  });
  const z5Area = await callTool('get_entities_in_area', {
    minX: z5bb.minX - 400, minY: z5bb.minY - 400, maxX: z5bb.maxX + 400, maxY: z5bb.maxY + 400,
  });
  const z5Cloud = (z5Area.data || []).find(e => e.layer === 'CLOUND');
  const z5Cbb = (await callTool('get_bounding_box', { handles: [z5Cloud.handle] })).data;
  const z5MidY = (28744.94 + 29588.89) / 2;
  const z5Ldr = await drawLeaderWithArrow({ x: 65649.56 + 375, y: z5MidY }, { x: z5Cbb.minX, y: z5MidY });
  console.log(`[Z-05] Upgraded cloud=${z5Cloud.handle} & crisp arrow leader=${z5Ldr.data.handle}`);

  // 3. Build remaining 6 Z-offsets (Z-01a, Z-01b, Z-02, Z-03, Z-06, Z-07)
  const specs = [
    {
      id: 'Z-01a', layer: 'M-MVAC-SEAD', eraseHandles: ['1D41F'],
      rx1: 57649.13, ry1: 47296.28 - 475, rx2: 58570.91, ry2: 47296.28 + 475,
      W: 950, H: 450, z1: 3050, z2: 2505, orient: 'H', stepDir: 'DOWN', side: 'UP', xShift: -380,
    },
    {
      id: 'Z-01b', layer: 'M-MVAC-SEAD', eraseHandles: ['1D42C'],
      rx1: 59950.78, ry1: 47296.48 - 475, rx2: 60872.55, ry2: 47296.48 + 475,
      W: 950, H: 450, z1: 2505, z2: 3050, orient: 'H', stepDir: 'UP', side: 'UP', xShift: 420,
    },
    {
      id: 'Z-02', layer: 'M-MVAC-SEAD', eraseHandles: ['1D2E3', '1D2EC'],
      rx1: 50997.71 - 925, ry1: 50339.25, rx2: 50997.71 + 925, ry2: 51466.04,
      W: 1850, H: 450, z1: 3050, z2: 2300, orient: 'V', stepDir: 'DOWN', side: 'LEFT',
    },
    {
      id: 'Z-03', layer: 'M-MVAC-SEAD', eraseHandles: ['1D33C'],
      rx1: 27417.12, ry1: 55009.78 - 750, rx2: 28212.53, ry2: 55009.78 + 750,
      W: 1500, H: 450, z1: 2300, z2: 2720, orient: 'H', stepDir: 'UP', side: 'UP',
    },
    {
      id: 'Z-06', layer: 'M-MVAC-PAD', eraseHandles: ['1D60B'],
      rx1: 45795.97, ry1: 62585.89 - 450, rx2: 46564.18, ry2: 62585.89 + 450,
      W: 900, H: 500, z1: 3000, z2: 3350, orient: 'H', stepDir: 'UP', side: 'UP',
    },
    {
      id: 'Z-07', layer: 'M-MVAC-PAD', eraseHandles: ['1D634'],
      rx1: 44976.32 - 450, ry1: 60583.40, rx2: 44976.32 + 450, ry2: 61441.60,
      W: 900, H: 500, z1: 3350, z2: 3790, orient: 'V', stepDir: 'UP', side: 'RIGHT',
    },
  ];

  const results = [];
  for (const cfg of specs) {
    results.push(await buildZOffset(cfg));
  }

  // Restore DIMSTYLE, purge unused blocks, unlock all layers, restore OSMODE=4031, QSAVE
  await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  await callTool('purge_unused_blocks');
  await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, locked: false } })));
  await callTool('send_command', { command: '_.OSMODE\n4031\n' });
  await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
  await callTool('save_drawing');

  fs.writeFileSync('work_hvac/bai2/z_offsets_result.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('ALL 8 Z-OFFSETS COMPLETED & SAVED!');
}

main().catch(err => {
  console.error('ERR:', err);
  process.exit(1);
});
