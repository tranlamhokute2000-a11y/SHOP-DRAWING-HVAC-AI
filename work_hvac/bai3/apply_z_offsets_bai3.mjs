#!/usr/bin/env node
// Apply vertical elevation-change (Z-offset, dZ > 200mm) shop drawing details
// for 4 locations on bai 3.dwg per Spec v3 & square-trick prototype.

import fs from 'node:fs';
import { callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const LEADER_GAP = 1260;
const CLOUD_ARC = 200;
const CLOUD_PAD = 150;
const DIM_STYLE = 'HỒ-DIM 1-70';
const PROTOTYPE_LEADER = '336A1';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function buildZOffset(cfg) {
  const { id, layer, eraseHandles, rx1, ry1, rx2, ry2, W, H, z1, z2, orient, stepDir, side, xShift = 0 } = cfg;
  const dZ = Math.abs(z1 - z2);
  const lowBod = Math.min(z1, z2);
  const t = H * (SQRT2 - 1);
  const elevW = dZ + 2 * t;

  console.log(`\n=== Building ${id} (W=${W}, H=${H}, dZ=${dZ}, BOD=${z1}->${z2}) ===`);

  // 1. Erase old straight Z-bridge block(s) if any
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

  // 3. Compute Side Elevation anchor using dZ x dZ square trick
  const cx = (rx1 + rx2) / 2;
  const cy = (ry1 + ry2) / 2;
  const dimLeftPad = 360;
  const cloudExtra = CLOUD_PAD + CLOUD_ARC * 0.34;

  let xLeft, ySq;
  if (side === 'RIGHT') {
    xLeft = rx2 + LEADER_GAP + cloudExtra + dimLeftPad;
    ySq = cy - dZ / 2;
  } else if (side === 'LEFT') {
    xLeft = rx1 - LEADER_GAP - cloudExtra - 240 - elevW;
    ySq = cy - dZ / 2;
  } else if (side === 'UP') {
    xLeft = cx + xShift - elevW / 2 + 80;
    ySq = ry2 + LEADER_GAP + cloudExtra + H / 2 + 80;
  } else {
    xLeft = cx + xShift - elevW / 2 + 80;
    ySq = ry1 - LEADER_GAP - cloudExtra - dZ - H / 2 - 180;
  }

  const xLv = xLeft + t;
  const xRv = xLv + dZ;
  const xRight = xRv + t;
  const yLv = stepDir === 'DOWN' ? ySq + dZ : ySq;
  const yRv = stepDir === 'DOWN' ? ySq : ySq + dZ;

  // 4. Draw 2x45 deg elbows + spool via 100% HTS draw_rectangular_duct (swapped W_elev=H, H_elev=W, R=H/2)
  const pts = [
    { x: xLeft, y: yLv },
    { x: xLv, y: yLv },
    { x: xRv, y: yRv },
    { x: xRight, y: yRv },
  ];

  const rDuct = await callTool('draw_rectangular_duct', {
    runs: [{ W: H, H: W, R: H / 2, layer, prefix: 'HTS', points: pts }],
  });
  const runInfo = rDuct.data?.runs?.[0] || {};
  const elevHandles = [...(runInfo.straightHandles || []), ...(runInfo.elbowHandles || [])];
  console.log(`[${id}] Elevation blocks created:`, elevHandles);

  // Assign HTS_OG_DAY to elevation blocks
  await callTool('duct_set_elevation', { nhom: [{ handles: elevHandles, day: lowBod }] });

  // 5. Add 3 Detail Dimensions (HỒ-DIM 1-70 on M-MVAC-DIM)
  const dimX = xLeft - 140;
  const dOff = t / SQRT2;
  const wOff = (H / 2) / SQRT2;
  let d1, d2, d3;

  if (stepDir === 'DOWN') {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2,
      x2: xLeft, y2: yLv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2,
      x2: xRight, y2: yRv - H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d3 = await callTool('draw_aligned_dim', {
      x1: xLv + dOff + wOff, y1: yLv - dOff + wOff,
      x2: xRv - dOff + wOff, y2: yRv + dOff + wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  } else {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2,
      x2: xLeft, y2: yLv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv + H / 2,
      x2: xRight, y2: yRv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
    d3 = await callTool('draw_aligned_dim', {
      x1: xRv - dOff + wOff, y1: yRv - dOff - wOff,
      x2: xLv + dOff + wOff, y2: yLv + dOff - wOff,
      offset: 200, dimStyle: DIM_STYLE, layer: 'M-MVAC-DIM',
    });
  }
  const dimHandles = [d1.data.handle, d2.data.handle, d3.data.handle];
  console.log(`[${id}] Dim handles:`, dimHandles);

  // 6. Snug REVCLOUD on CLOUND
  const bb = (await callTool('get_bounding_box', { handles: [...elevHandles, ...dimHandles] })).data;
  const beforeC = new Set((await callTool('select_by_layer', { layer: 'CLOUND' })).data?.handles || []);
  await callTool('set_layer', { layerName: 'CLOUND' });
  const cMinX = (bb.minX - CLOUD_PAD).toFixed(2);
  const cMinY = (bb.minY - CLOUD_PAD).toFixed(2);
  const cMaxX = (bb.maxX + CLOUD_PAD).toFixed(2);
  const cMaxY = (bb.maxY + CLOUD_PAD).toFixed(2);
  await callTool('send_command', {
    command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${cMinX},${cMinY}\n${cMaxX},${cMaxY}\n`,
  });
  await sleep(300);

  const afterC = (await callTool('select_by_layer', { layer: 'CLOUND' })).data?.handles || [];
  const cloudH = afterC.find(h => !beforeC.has(h));
  const cbb = (await callTool('get_bounding_box', { handles: [cloudH] })).data;
  console.log(`[${id}] Cloud handle:`, cloudH);

  // 7. Leader Arrow pointing straight into exact midpoint of Z-offset rectangle
  let arrowPt, tailPt;
  if (side === 'RIGHT')      { arrowPt = { x: rx2, y: cy }; tailPt = { x: cbb.minX, y: cy }; }
  else if (side === 'LEFT')  { arrowPt = { x: rx1, y: cy }; tailPt = { x: cbb.maxX, y: cy }; }
  else if (side === 'UP')    { arrowPt = { x: cx, y: ry2 }; tailPt = { x: cx, y: cbb.minY }; }
  else                       { arrowPt = { x: cx, y: ry1 }; tailPt = { x: cx, y: cbb.maxY }; }

  await callTool('send_command', { command: '_.DIMLDRBLK\n.\n_.DIMASZ\n180\n' });
  const rLdr = await callTool('draw_leader', { layer: 'M-MVAC-DIM', points: [arrowPt, tailPt] });
  console.log(`[${id}] Leader handle:`, rLdr.data?.handle);

  return {
    id, layer, W, H, z1, z2, dZ, side, stepDir,
    rect: rRect.data?.handle, pl: rPl.data?.handle,
    elevHandles, dimHandles, cloud: cloudH, leader: rLdr.data?.handle,
    cloudBbox: cbb,
  };
}

async function main() {
  const t0 = Date.now();
  console.log('=== STARTING 4 Z-OFFSETS ON BAI 3.DWG ===');

  // Lock original design layers & OSMODE=0
  const origLayers = [
    'MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED',
    'MEPG-AC-M-Hút gió thải-Exhaust Air-EAD',
    'MEPG-M-EQUIP',
    'MEPG-AC-TEXT',
    'MEPG-XREF-ARC',
    '0'
  ];
  await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, locked: true } })));
  await callTool('send_command', { command: '_.OSMODE\n0\n' });

  const specs = [
    {
      id: 'Z-01',
      description: 'SED Trục Tây Bắc',
      layer: 'M-MVAC-SEAD',
      eraseHandles: [],
      rx1: -74782.56, ry1: 74505.50,
      rx2: -73782.56, ry2: 75265.88,
      W: 1000, H: 400,
      z1: 2650, z2: 2400,
      orient: 'V', stepDir: 'DOWN', side: 'RIGHT',
    },
    {
      id: 'Z-02',
      description: 'SED Trục Chính Nam (Đoạn 1)',
      layer: 'M-MVAC-SEAD',
      eraseHandles: [],
      rx1: -51907.35, ry1: 28847.74,
      rx2: -50057.35, ry2: 29974.53,
      W: 1850, H: 450,
      z1: 3050, z2: 2300,
      orient: 'V', stepDir: 'DOWN', side: 'RIGHT',
    },
    {
      id: 'Z-03',
      description: 'SED Trục Chính Nam (Đoạn 2)',
      layer: 'M-MVAC-SEAD',
      eraseHandles: [],
      rx1: -74562.94, ry1: 32768.20,
      rx2: -73767.50, ry2: 34268.20,
      W: 1500, H: 450,
      z1: 2720, z2: 2300,
      orient: 'H', stepDir: 'DOWN', side: 'UP',
    },
    {
      id: 'Z-04',
      description: 'SED Trục Đông Nam',
      layer: 'M-MVAC-SEAD',
      eraseHandles: [],
      rx1: -51339.00, ry1: 7041.76,
      rx2: -50339.00, ry2: 7985.63,
      W: 1000, H: 350,
      z1: 2500, z2: 3150,
      orient: 'V', stepDir: 'UP', side: 'RIGHT',
    },
  ];

  const results = [];
  for (const cfg of specs) {
    const r = await buildZOffset(cfg);
    if (r) results.push(r);
  }

  // Apply Spec Leader MATCHPROP from prototype leader
  const leaders = results.map(r => r.leader).filter(Boolean);
  if (PROTOTYPE_LEADER && leaders.length) {
    const mpCmd = `_.MATCHPROP\n(handent "${PROTOTYPE_LEADER}")\n` + leaders.map(h => `(handent "${h}")`).join('\n') + '\n\n';
    await callTool('send_command', { command: mpCmd });
    await sleep(400);
    console.log(`[apply_z_offsets] MATCHPROP applied from ${PROTOTYPE_LEADER} -> ${leaders.length} leaders`);

    // Clean up temporary prototype leader
    await callTool('batch_erase_entities', { handles: [PROTOTYPE_LEADER] });
    console.log(`[apply_z_offsets] Temporary prototype leader ${PROTOTYPE_LEADER} cleaned up`);
  }

  // Restore OSMODE=4031, layer to M-MVAC-SEAD, save drawing
  await callTool('send_command', { command: '_.OSMODE\n4031\n' });
  await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
  await callTool('save_drawing');

  fs.writeFileSync('work_hvac/bai3/z_offsets_result.json', JSON.stringify(results, null, 2), 'utf8');
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`\n========================================`);
  console.log(`ALL 4 Z-OFFSETS COMPLETED SUCCESSFULLY IN ${elapsed}s!`);
  console.log(`========================================`);
}

main().catch(err => {
  console.error('[apply_z_offsets] ERROR:', err);
  process.exit(1);
});
