#!/usr/bin/env node
// Turbo Step 1 & 2 Read-Only Survey + Geometry Decoder for HVAC Shop Drawing (HTS MCP :5088)
// Usage:
//   node survey_hvac.mjs [--out <dir>] [--backup] [--image]

import fs from 'node:fs';
import path from 'node:path';
import { checkHealth, callTool, batchCall, SPEC_LAYERS } from './hts_mcp.mjs';

function parseArgs(argv) {
  const opts = { out: null, backup: false, image: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' && argv[i + 1]) opts.out = argv[++i];
    else if (a === '--backup') opts.backup = true;
    else if (a === '--image') opts.image = true;
  }
  return opts;
}

function cleanMtext(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/\\P/g, '\n')
    .replace(/\{\\[^;]*;([^}]*)\}/g, '$1')
    .replace(/[{}]/g, '')
    .trim();
}

function parseDuctLabels(textItems) {
  const sizeLabels = [];
  const elevLabels = [];
  const otherLabels = [];

  const rectRe = /\b([A-Z]{2,5})\s*[-–]\s*(\d{3,4})\s*[xX×]\s*(\d{3,4})\b/;
  const roundRe = /\b([A-Z]{2,5})\s*[-–]?\s*(?:Ø|D|DN)\s*(\d{2,4})\b/i;
  const elevRe = /\b(BOD|TOD|CL)\s*=\s*(?:FFL\s*)?([+-]?\d{3,5})\b/i;

  for (const t of textItems) {
    const content = cleanMtext(t.content);
    const lines = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    let matched = false;

    for (const line of lines) {
      const mRect = line.match(rectRe);
      if (mRect) {
        sizeLabels.push({
          handle: t.handle,
          layer: t.layer,
          raw: content,
          system: mRect[1].toUpperCase(),
          shape: 'rect',
          W: Number(mRect[2]),
          H: Number(mRect[3]),
          x: t.x,
          y: t.y,
        });
        matched = true;
      } else {
        const mRound = line.match(roundRe);
        if (mRound) {
          sizeLabels.push({
            handle: t.handle,
            layer: t.layer,
            raw: content,
            system: mRound[1].toUpperCase(),
            shape: 'round',
            D: Number(mRound[2]),
            x: t.x,
            y: t.y,
          });
          matched = true;
        }
      }
      const mElev = line.match(elevRe);
      if (mElev) {
        elevLabels.push({
          handle: t.handle,
          layer: t.layer,
          raw: content,
          refType: mElev[1].toUpperCase(),
          value: Number(mElev[2]),
          x: t.x,
          y: t.y,
        });
        matched = true;
      }
    }
    if (!matched && content) {
      otherLabels.push({ handle: t.handle, layer: t.layer, raw: content, x: t.x, y: t.y });
    }
  }

  // Pair each sizeLabel with closest elevLabel within 600 mm
  const paired = sizeLabels.map(sl => {
    let best = null;
    let bestDist = Infinity;
    for (const el of elevLabels) {
      const d = Math.hypot(el.x - sl.x, el.y - sl.y);
      if (d < bestDist && d <= 600) {
        bestDist = d;
        best = el;
      }
    }
    let bod = null;
    if (best) {
      if (best.refType === 'BOD') bod = best.value;
      else if (best.refType === 'TOD' && sl.H) bod = best.value - sl.H;
      else if (best.refType === 'CL' && sl.H) bod = best.value - sl.H / 2;
      else bod = best.value;
    }
    return {
      ...sl,
      elevRef: best ? `${best.refType}=${best.value}` : null,
      bod,
      elevDistMm: best ? Number(bestDist.toFixed(1)) : null,
    };
  });

  return { paired, elevLabels, otherLabels };
}

function detectParallelDuctSegments(entities, knownWidths) {
  const lines = entities
    .filter(e => e.type === 'LINE' && !e.layer.startsWith('M-MVAC-') && e.layer !== 'CLOUND' && e.layer !== '0')
    .map(e => {
      const dx = e.endX - e.startX;
      const dy = e.endY - e.startY;
      const len = Math.hypot(dx, dy);
      if (len < 30) return null;
      let ang = Math.atan2(dy, dx);
      if (ang < 0) ang += Math.PI;
      if (ang >= Math.PI - 1e-6) ang = 0;
      const ux = Math.cos(ang);
      const uy = Math.sin(ang);
      const nx = -uy;
      const ny = ux;
      const t1 = e.startX * ux + e.startY * uy;
      const t2 = e.endX * ux + e.endY * uy;
      const offset = ((e.startX + e.endX) / 2) * nx + ((e.startY + e.endY) / 2) * ny;
      return {
        handle: e.handle,
        layer: e.layer,
        startX: e.startX,
        startY: e.startY,
        endX: e.endX,
        endY: e.endY,
        len,
        ang,
        ux,
        uy,
        nx,
        ny,
        tMin: Math.min(t1, t2),
        tMax: Math.max(t1, t2),
        offset,
      };
    })
    .filter(Boolean);

  const widthList = [...knownWidths].sort((a, b) => a - b);
  const used = new Set();
  const segments = [];

  for (let i = 0; i < lines.length; i++) {
    const a = lines[i];
    if (used.has(a.handle)) continue;
    let bestJ = -1;
    let bestScore = Infinity;

    for (let j = i + 1; j < lines.length; j++) {
      const b = lines[j];
      if (used.has(b.handle) || a.layer !== b.layer) continue;
      let dAng = Math.abs(a.ang - b.ang);
      if (dAng > Math.PI / 2) dAng = Math.PI - dAng;
      if (dAng > 0.01) continue; // > ~0.57 deg

      const overlap = Math.min(a.tMax, b.tMax) - Math.max(a.tMin, b.tMin);
      if (overlap < 20) continue;

      const perpDist = Math.abs(a.offset - b.offset);
      if (perpDist < 100 || perpDist > 3000) continue;

      // Prefer matching a known duct width within +/- 4 mm (or standard 50mm step)
      const matchedKnown = widthList.some(w => Math.abs(perpDist - w) <= 4);
      const rem50 = Math.min(perpDist % 50, 50 - (perpDist % 50));
      if (!matchedKnown && rem50 > 4) continue;

      const lenDiff = Math.abs(a.len - b.len);
      const score = (matchedKnown ? 0 : 1000) + lenDiff + Math.abs(a.tMin - b.tMin) + Math.abs(a.tMax - b.tMax);
      if (score < bestScore) {
        bestScore = score;
        bestJ = j;
      }
    }

    if (bestJ >= 0) {
      const b = lines[bestJ];
      used.add(a.handle);
      used.add(b.handle);
      const tStart = Math.max(a.tMin, b.tMin);
      const tEnd = Math.min(a.tMax, b.tMax);
      const midOff = (a.offset + b.offset) / 2;
      const cx1 = tStart * a.ux + midOff * a.nx;
      const cy1 = tStart * a.uy + midOff * a.ny;
      const cx2 = tEnd * a.ux + midOff * a.nx;
      const cy2 = tEnd * a.uy + midOff * a.ny;
      segments.push({
        layer: a.layer,
        wallHandles: [a.handle, b.handle],
        widthMm: Number(Math.abs(a.offset - b.offset).toFixed(2)),
        lengthMm: Number((tEnd - tStart).toFixed(2)),
        angleDeg: Number(((a.ang * 180) / Math.PI).toFixed(4)),
        p1: { x: Number(cx1.toFixed(2)), y: Number(cy1.toFixed(2)) },
        p2: { x: Number(cx2.toFixed(2)), y: Number(cy2.toFixed(2)) },
      });
    }
  }
  return segments;
}

async function main() {
  const t0 = Date.now();
  const opts = parseArgs(process.argv);

  await checkHealth();

  const [infoRes, settingsRes, layerListRes, groupRes, blocksRes, textRes] = await Promise.all([
    callTool('get_drawing_info'),
    callTool('get_current_settings'),
    callTool('get_layer_list'),
    callTool('group_summary_by_layer'),
    callTool('list_block_definitions', { includeUnused: true }),
    callTool('extract_all_text'),
  ]);

  const info = infoRes.data;
  const settings = settingsRes.data;
  const layers = layerListRes.data?.layers || [];
  const groupLayers = groupRes.data?.layers || [];
  const blocks = blocksRes.data?.items || [];
  const textItems = textRes.data?.items || [];

  const dwgPath = info.filename;
  const dwgStem = path.basename(dwgPath, path.extname(dwgPath)).replace(/\s+/g, '_');
  const outDir = opts.out || path.resolve(path.dirname(dwgPath), 'work_hvac', `${dwgStem}_survey`);
  fs.mkdirSync(outDir, { recursive: true });

  // Optional backup
  let backupPath = null;
  if (opts.backup && fs.existsSync(dwgPath)) {
    backupPath = path.join(outDir, `${path.basename(dwgPath, '.dwg')}_backup.dwg`);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(dwgPath, backupPath);
    }
  }

  // Batch fetch full layer info (locked/frozen/off/aci/lineweight)
  const layerInfoRes = await batchCall(
    layers.map(l => ({ tool: 'get_layer_info', args: { layerName: l.name } }))
  );
  const layerDetails = layerInfoRes.map(r => r.data).filter(Boolean);

  // Pull all entities in drawing extents
  const pad = 500;
  const areaRes = await callTool('get_entities_in_area', {
    minX: info.extmin.x - pad,
    minY: info.extmin.y - pad,
    maxX: info.extmax.x + pad,
    maxY: info.extmax.y + pad,
  });
  const entities = Array.isArray(areaRes.data) ? areaRes.data : [];

  // Optional overview PNG
  let imagePath = null;
  if (opts.image) {
    const imgRes = await callTool('export_plan_image', {
      outDir,
      fileName: 'survey_full',
      format: 'png',
      grid: true,
      widthPx: 2400,
    });
    if (imgRes.success) {
      imagePath = path.join(outDir, 'survey_full.png');
    }
  }

  // Parse duct text labels & detect systems
  const { paired, elevLabels, otherLabels } = parseDuctLabels(textItems);
  const systemsFound = [...new Set(paired.map(p => p.system))].sort();
  const knownWidths = new Set(paired.filter(p => p.W).map(p => p.W));
  const parallelSegments = detectParallelDuctSegments(entities, knownWidths);

  // Anomalies check
  const ellipses = entities.filter(e => e.type === 'ELLIPSE');
  const designEquips = entities.filter(
    e => e.type === 'INSERT' && !e.layer.startsWith('M-MVAC-') && e.layer !== 'CLOUND'
  );
  const anomalies = [];
  if (info.units !== 'Millimeters') {
    anomalies.push(`INSUNITS WARNING: Drawing reports '${info.units}' instead of 'Millimeters' -> run _.INSUNITS=4 & _.MEASUREMENT=1 before drawing!`);
  }
  if (ellipses.length > 0) {
    anomalies.push(`REVIT 3D SLOPE WARNING: Found ${ellipses.length} ELLIPSE entities (possible 3D sloped duct projections).`);
  }
  const lockedLayers = layerDetails.filter(l => l.is_locked).map(l => l.name);
  if (lockedLayers.length > 0) {
    anomalies.push(`LOCKED LAYERS PRESENT: ${lockedLayers.join(', ')}`);
  }

  // Build baseline JSON for qa_audit_hvac.mjs
  const baselineCounts = {};
  for (const g of groupLayers) {
    if (!g.layer.startsWith('M-MVAC-') && g.layer !== 'CLOUND') {
      baselineCounts[g.layer] = g.count;
    }
  }
  const baseline = {
    capturedAt: new Date().toISOString(),
    drawing: dwgPath,
    units: info.units,
    osmode: settings.osmode,
    originalLayerCounts: baselineCounts,
    originalTotal: Object.values(baselineCounts).reduce((s, n) => s + n, 0),
    extmin: info.extmin,
    extmax: info.extmax,
  };

  // Spec mapping proposal
  const specMapping = systemsFound.map(sys => {
    const std = SPEC_LAYERS[sys];
    return std
      ? { system: sys, targetLayer: std.layerName, color: std.color, lineweight: std.lineweight, standard: true }
      : { system: sys, targetLayer: `M-MVAC-${sys}`, color: 140, lineweight: 20, standard: false };
  });

  fs.writeFileSync(path.join(outDir, 'baseline.json'), JSON.stringify(baseline, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'survey_data.json'),
    JSON.stringify(
      {
        drawingInfo: info,
        settings,
        layerDetails,
        groupLayers,
        specMapping,
        pairedLabels: paired,
        otherLabels,
        parallelSegments,
        designEquipmentBlocks: designEquips,
        ellipses,
        blockDefinitionsCount: blocks.length,
        anomalies,
      },
      null,
      2
    ),
    'utf8'
  );

  // Markdown summary
  const mdLines = [
    `# Turbo HVAC Survey Report — \`${path.basename(dwgPath)}\``,
    ``,
    `- **File**: \`${dwgPath}\``,
    `- **Units**: \`${info.units}\` | **OSMODE**: \`${settings.osmode}\` | **Total Entities**: \`${info.entity_count}\``,
    `- **Extents**: \`(${info.extmin.x.toFixed(1)}, ${info.extmin.y.toFixed(1)}) .. (${info.extmax.x.toFixed(1)}, ${info.extmax.y.toFixed(1)})\``,
    backupPath ? `- **Backup**: \`${backupPath}\`` : `- **Backup**: *(pass --backup to create)*`,
    imagePath ? `- **Overview PNG**: \`${imagePath}\`` : `- **Overview PNG**: *(pass --image to export)*`,
    ``,
    `## 1. Original Baseline Layer Counts (Preserve 100%)`,
    `| Layer | Entity Count |`,
    `| :--- | :---: |`,
    ...Object.entries(baselineCounts).map(([k, v]) => `| \`${k}\` | **${v}** |`),
    `| **TOTAL ORIGINAL** | **${baseline.originalTotal}** |`,
    ``,
    `## 2. Detected HVAC Systems & Spec Layer Mapping`,
    `| System Prefix | Target Layer | ACI Color | Standard Spec? | Labels Found |`,
    `| :---: | :--- | :---: | :---: | :---: |`,
    ...specMapping.map(m => {
      const cnt = paired.filter(p => p.system === m.system).length;
      return `| \`${m.system}\` | \`${m.targetLayer}\` | \`${m.color}\` | ${m.standard ? 'YES' : 'EXTENDED'} | ${cnt} |`;
    }),
    ``,
    `## 3. Geometry & Anomalies`,
    `- **Parsed Duct Size Labels**: \`${paired.length}\` (paired with BOD/TOD/CL elevations: \`${paired.filter(p => p.bod !== null).length}\`)`,
    `- **Auto-Detected Parallel Duct Centerline Segments**: \`${parallelSegments.length}\``,
    `- **Design Equipment/Fitting INSERTs**: \`${designEquips.length}\``,
    `- **ELLIPSE Entities**: \`${ellipses.length}\``,
    ``,
    anomalies.length
      ? `### Warnings / Anomalies\n${anomalies.map(a => `- ⚠️ ${a}`).join('\n')}`
      : `### Warnings / Anomalies\n- ✅ None detected.`,
  ];
  fs.writeFileSync(path.join(outDir, 'survey_summary.md'), mdLines.join('\n'), 'utf8');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`[survey_hvac] DONE in ${elapsed}s -> ${outDir}`);
  console.log(`  Drawing : ${path.basename(dwgPath)} | units=${info.units} | osmode=${settings.osmode} | entities=${info.entity_count}`);
  console.log(`  Baseline: ${baseline.originalTotal} original entities across ${Object.keys(baselineCounts).length} layers`);
  console.log(`  Systems : ${systemsFound.join(', ') || 'none'} (${paired.length} duct labels, ${parallelSegments.length} parallel wall pairs)`);
  if (anomalies.length) {
    for (const a of anomalies) console.log(`  WARN    : ${a}`);
  }
}

main().catch(err => {
  console.error('[survey_hvac] ERROR:', err.message);
  process.exit(1);
});
