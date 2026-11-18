#!/usr/bin/env node
// Turbo Vertical Z-Offset (dZ > 200mm) Generator (Spec v3 & Square-Trick Standard)
// Draws plan RECTANG + Z-step PL, 100% HTS 2x45 deg + spool side elevation (W_elev=H, H_elev=W, R=H/2),
// 0.000mm vertex-snapped HỒ-DIM 1-70 detail dims, snug CLOUND REVCLOUD, and MATCHPROP Spec Leaders!
//
// Usage:
//   node draw_z_offsets.mjs --spec <z_offsets.json> [--leader-src <handle>] [--dim-style "HỒ-DIM 1-70"]
//
// Input JSON array item schema:
// {
//   "id": "Z-01",
//   "layer": "M-MVAC-SEAD",
//   "eraseHandles": ["1D41F"],           // optional straight bridge handle(s) to replace
//   "rx1": 57649.13, "ry1": 46821.28,    // exact plan rectangle outer bounds
//   "rx2": 58570.91, "ry2": 47771.28,
//   "W": 950, "H": 450,                  // plan duct W x H (mm)
//   "z1": 3050, "z2": 2505,              // BOD1 & BOD2 (mm); must have |z1-z2| > 200
//   "orient": "H",                       // "H" (horizontal duct) or "V" (vertical duct)
//   "stepDir": "DOWN",                   // "DOWN" or "UP" left-to-right in side elevation
//   "side": "UP",                        // callout placement: "RIGHT" | "LEFT" | "UP" | "DOWN"
//   "xShift": 0                          // optional horizontal offset for UP/DOWN callouts
// }

import fs from 'node:fs';
import { checkHealth, callTool } from './hts_mcp.mjs';

const SQRT2 = Math.SQRT2;
const LEADER_GAP = 1260;
const CLOUD_ARC = 200;
const CLOUD_PAD = 150;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function parseArgs(argv) {
  const opts = { spec: null, leaderSrc: null, dimStyle: 'HỒ-DIM 1-70', out: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--spec' && argv[i + 1]) opts.spec = argv[++i];
    else if (a === '--leader-src' && argv[i + 1]) opts.leaderSrc = argv[++i];
    else if (a === '--dim-style' && argv[i + 1]) opts.dimStyle = argv[++i];
    else if (a === '--out' && argv[i + 1]) opts.out = argv[++i];
  }
  return opts;
}

async function buildOne(cfg, dimStyle) {
  const { id, layer, eraseHandles, rx1, ry1, rx2, ry2, W, H, z1, z2, orient, stepDir, side, xShift = 0 } = cfg;
  const dZ = Math.abs(z1 - z2);
  if (dZ <= 200) {
    console.log(`[${id}] SKIP: dZ=${dZ} <= 200 mm`);
    return null;
  }
  const lowBod = Math.min(z1, z2);
  const t = H * (SQRT2 - 1);
  const elevW = dZ + 2 * t;

  // 1. Erase old straight Z-bridge handle(s) if provided
  if (eraseHandles && eraseHandles.length) {
    await callTool('batch_erase_entities', { handles: eraseHandles });
  }

  // 2. Plan-view RECTANG + 4-vertex Z-step PL on duct layer
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
    plPts = stepDir === 'DOWN'
      ? [
          { x: rx1 + insE, y: ry2 - insS },
          { x: rx1 + insE + stub, y: ry2 - insS },
          { x: rx2 - insE - stub, y: ry1 + insS },
          { x: rx2 - insE, y: ry1 + insS },
        ]
      : [
          { x: rx1 + insE, y: ry1 + insS },
          { x: rx1 + insE + stub, y: ry1 + insS },
          { x: rx2 - insE - stub, y: ry2 - insS },
          { x: rx2 - insE, y: ry2 - insS },
        ];
  }
  const rPl = await callTool('draw_polyline', { layer, closed: false, points: plPts });

  // 3. Compute side-elevation anchor using dZ x dZ square trick
  const cx = (rx1 + rx2) / 2, cy = (ry1 + ry2) / 2;
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
  const rDuct = await callTool('draw_rectangular_duct', {
    runs: [{
      W: H, H: W, R: H / 2, layer, prefix: 'HTS',
      points: [
        { x: xLeft, y: yLv },
        { x: xLv, y: yLv },
        { x: xRv, y: yRv },
        { x: xRight, y: yRv },
      ],
    }],
  });
  const runInfo = rDuct.data?.runs?.[0] || {};
  const elevHandles = [...(runInfo.straightHandles || []), ...(runInfo.elbowHandles || [])];
  await callTool('duct_set_elevation', { nhom: [{ handles: elevHandles, day: lowBod }] });

  // 5. Draw 3 EXACT 0.000mm vertex-snapped dims directly from (xLv, yLv) & (xRv, yRv) — NEVER from rotated bbox!
  await callTool('send_command', { command: `_.-DIMSTYLE\n_R\n${dimStyle}\n` });
  await sleep(60);
  const dimX = xLeft - 140;
  const dOff = t / SQRT2;
  const wOff = (H / 2) / SQRT2;
  let d1, d2, d3;

  if (stepDir === 'DOWN') {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2, x2: xLeft, y2: yLv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2, x2: xRight, y2: yRv - H / 2,
      rotation: 90, dimLineX: dimX, dimStyle, layer: 'M-MVAC-DIM',
    });
    d3 = await callTool('draw_aligned_dim', {
      x1: xLv + dOff + wOff, y1: yLv - dOff + wOff,
      x2: xRv - dOff + wOff, y2: yRv + dOff + wOff,
      offset: 200, dimStyle, layer: 'M-MVAC-DIM',
    });
  } else {
    d1 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv - H / 2, x2: xLeft, y2: yLv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle, layer: 'M-MVAC-DIM',
    });
    d2 = await callTool('draw_linear_dim', {
      x1: xLeft, y1: yLv + H / 2, x2: xRight, y2: yRv + H / 2,
      rotation: 90, dimLineX: dimX, dimStyle, layer: 'M-MVAC-DIM',
    });
    d3 = await callTool('draw_aligned_dim', {
      x1: xRv - dOff + wOff, y1: yRv - dOff - wOff,
      x2: xLv + dOff + wOff, y2: yLv + dOff - wOff,
      offset: 340, dimStyle, layer: 'M-MVAC-DIM',
    });
  }
  const dimHandles = [d1.data.handle, d2.data.handle, d3.data.handle];

  // 6. Snug REVCLOUD on CLOUND
  const bb = (await callTool('get_bounding_box', { handles: [...elevHandles, ...dimHandles] })).data;
  const beforeC = new Set((await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles);
  await callTool('set_layer', { layerName: 'CLOUND' });
  await callTool('send_command', {
    command: `_.REVCLOUD\n_A\n${CLOUD_ARC}\n_R\n${(bb.minX - CLOUD_PAD).toFixed(2)},${(bb.minY - CLOUD_PAD).toFixed(2)}\n${(bb.maxX + CLOUD_PAD).toFixed(2)},${(bb.maxY + CLOUD_PAD).toFixed(2)}\n`,
  });
  await sleep(250);
  const afterC = (await callTool('select_by_layer', { layer: 'CLOUND' })).data.handles;
  const cloudH = afterC.find(h => !beforeC.has(h));
  const cbb = (await callTool('get_bounding_box', { handles: [cloudH] })).data;

  // 7. Leader Arrow pointing straight into exact midpoint of Z-offset plan rectangle
  let arrowPt, tailPt;
  if (side === 'RIGHT')      { arrowPt = { x: rx2, y: cy }; tailPt = { x: cbb.minX, y: cy }; }
  else if (side === 'LEFT')  { arrowPt = { x: rx1, y: cy }; tailPt = { x: cbb.maxX, y: cy }; }
  else if (side === 'UP')    { arrowPt = { x: cx, y: ry2 }; tailPt = { x: cx, y: cbb.minY }; }
  else                       { arrowPt = { x: cx, y: ry1 }; tailPt = { x: cx, y: cbb.maxY }; }

  const rLdr = await callTool('draw_leader', { layer: 'M-MVAC-DIM', points: [arrowPt, tailPt] });
  console.log(`[${id}] OK: elev=${elevHandles.join(',')} dims=${dimHandles.join(',')} cloud=${cloudH} ldr=${rLdr.data.handle}`);

  return { id, rect: rRect.data.handle, pl: rPl.data.handle, elevHandles, dimHandles, cloud: cloudH, leader: rLdr.data.handle };
}

async function main() {
  const t0 = Date.now();
  const opts = parseArgs(process.argv);
  if (!opts.spec || !fs.existsSync(opts.spec)) {
    throw new Error('Provide --spec <path/to/z_offsets.json>');
  }
  await checkHealth();

  const cur = (await callTool('get_current_settings')).data;
  const origOsmode = cur.osmode ?? 4031;
  const specs = JSON.parse(fs.readFileSync(opts.spec, 'utf8'));

  await callTool('send_command', { command: '_.OSMODE\n0\n' });
  const results = [];
  for (const cfg of specs) {
    const r = await buildOne(cfg, opts.dimStyle);
    if (r) results.push(r);
  }

  // Apply Spec Leader MATCHPROP if --leader-src handle is supplied
  const leaders = results.map(r => r.leader).filter(Boolean);
  if (opts.leaderSrc && leaders.length) {
    const mpCmd = `_.MATCHPROP\n(handent "${opts.leaderSrc}")\n` + leaders.map(h => `(handent "${h}")`).join('\n') + '\n\n';
    await callTool('send_command', { command: mpCmd });
    await sleep(300);
    console.log(`[draw_z_offsets] MATCHPROP applied from ${opts.leaderSrc} -> ${leaders.length} leaders`);
  }

  await callTool('send_command', { command: `_.OSMODE\n${origOsmode}\n` });
  if (opts.out) fs.writeFileSync(opts.out, JSON.stringify(results, null, 2), 'utf8');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`[draw_z_offsets] DONE ${results.length} Z-offsets in ${elapsed}s`);
}

main().catch(err => {
  console.error('[draw_z_offsets] ERROR:', err.message);
  process.exit(1);
});
