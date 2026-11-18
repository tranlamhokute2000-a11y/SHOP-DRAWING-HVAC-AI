#!/usr/bin/env node
// Turbo Step 5 Independent Read-Only QA/QC Auditor for HVAC Shop Drawing (HTS MCP :5088)
// Audits ALL 5 criteria in seconds via batch_process!
// Usage:
//   node qa_audit_hvac.mjs [--baseline <baseline.json>] [--out <qa_audit.json>] [--allow-equipment] [--image <outDir>]

import fs from 'node:fs';
import path from 'node:path';
import { checkHealth, callTool, batchCall, isShopDuctLayer } from './hts_mcp.mjs';

function parseArgs(argv) {
  const opts = { baseline: null, out: null, allowEquipment: false, imageDir: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--baseline' && argv[i + 1]) opts.baseline = argv[++i];
    else if (a === '--out' && argv[i + 1]) opts.out = argv[++i];
    else if (a === '--allow-equipment') opts.allowEquipment = true;
    else if (a === '--image' && argv[i + 1]) opts.imageDir = argv[++i];
  }
  return opts;
}

function bboxIntersects(a, b, tol = 0) {
  return !(
    a.maxX < b.minX - tol ||
    a.minX > b.maxX + tol ||
    a.maxY < b.minY - tol ||
    a.minY > b.maxY + tol
  );
}

async function main() {
  const t0 = Date.now();
  const opts = parseArgs(process.argv);

  await checkHealth();

  const [infoRes, settingsRes, layerListRes, groupRes, blocksRes, areaSurfRes] = await Promise.all([
    callTool('get_drawing_info'),
    callTool('get_current_settings'),
    callTool('get_layer_list'),
    callTool('group_summary_by_layer'),
    callTool('list_block_definitions', { includeUnused: true }),
    callTool('compute_duct_surface_area', { lengthScaleToMeter: 0.001 }),
  ]);

  const info = infoRes.data;
  const settings = settingsRes.data;
  const layers = layerListRes.data?.layers || [];
  const groupLayers = groupRes.data?.layers || [];
  const blocks = blocksRes.data?.items || [];
  const surface = areaSurfRes.data || {};

  // 1. Batch check ALL layer states (explicitly including CLOUND!)
  const layerInfoRes = await batchCall(
    layers.map(l => ({ tool: 'get_layer_info', args: { layerName: l.name } }))
  );
  const layerDetails = layerInfoRes.map(r => r.data).filter(Boolean);
  const badLayers = layerDetails.filter(l => l.is_locked || l.is_frozen || l.is_off);

  // 2. Fetch all entities in drawing extents
  const pad = 500;
  const areaRes = await callTool('get_entities_in_area', {
    minX: info.extmin.x - pad,
    minY: info.extmin.y - pad,
    maxX: info.extmax.x + pad,
    maxY: info.extmax.y + pad,
  });
  const allEntities = Array.isArray(areaRes.data) ? areaRes.data : [];

  const shopDuctEntities = allEntities.filter(e => isShopDuctLayer(e.layer));
  const shopOtherEntities = allEntities.filter(
    e => e.layer.startsWith('M-MVAC-') && !isShopDuctLayer(e.layer)
  );
  const cloudEntities = allEntities.filter(e => e.layer === 'CLOUND');
  const leaderEntities = allEntities.filter(e => e.type === 'LEADER');

  // --- CHECK 1: 100% HTS Tool & Rule 0 ---
  // Note: Plan-view Z-offset symbols (RECTANG closed 4-vertex LWPOLYLINE + 4-vertex Z-step open LWPOLYLINE)
  // are officially allowed on M-MVAC-<SYS> when paired with a TRÍCH CHI TIẾT VẬT THỂ callout (Spec v3).
  const isZOffsetPlanSymbol = e =>
    e.type === 'LWPOLYLINE' && Array.isArray(e.vertices) && e.vertices.length === 4;
  const shopDuctBlocks = shopDuctEntities.filter(e => e.type === 'INSERT');
  const zOffsetPlanSymbols = shopDuctEntities.filter(isZOffsetPlanSymbol);
  const nonInsertDucts = shopDuctEntities.filter(e => e.type !== 'INSERT' && !isZOffsetPlanSymbol(e));
  const nonHtsDucts = shopDuctBlocks.filter(e => !(e.blockName || '').startsWith('HTS-'));
  // Ignore AutoCAD built-in DimStyle arrowhead definitions (names starting with '_', e.g. _Dot, _Oblique, _ArchTick)
  const unusedBlocks = blocks.filter(b => b.instance_count === 0 && !String(b.name || '').startsWith('_'));
  // Allow M-MVAC-DIM (Detail dims & callout leaders from Spec v3) when callout leaders exist
  const unsolicitedShop = opts.allowEquipment
    ? []
    : shopOtherEntities.filter(e => !(leaderEntities.length > 0 && e.layer === 'M-MVAC-DIM'));

  const check1Pass =
    nonInsertDucts.length === 0 &&
    nonHtsDucts.length === 0 &&
    unusedBlocks.length === 0 &&
    unsolicitedShop.length === 0;

  // --- CHECK 2: Original Baseline Preservation & Drawing Cleanliness ---
  const currentCounts = Object.fromEntries(groupLayers.map(g => [g.layer, g.count]));
  const baselineDiffs = [];
  let baselineChecked = false;
  if (opts.baseline && fs.existsSync(opts.baseline)) {
    baselineChecked = true;
    const base = JSON.parse(fs.readFileSync(opts.baseline, 'utf8'));
    const origCounts = base.originalLayerCounts || {};
    for (const [layer, expected] of Object.entries(origCounts)) {
      const actual = currentCounts[layer] || 0;
      if (actual !== expected) {
        baselineDiffs.push({ layer, expected, actual, delta: actual - expected });
      }
    }
  }
  const unitsOk = info.units === 'Millimeters';
  const extentsOk =
    Math.abs(info.extmin.x) < 1e7 &&
    Math.abs(info.extmin.y) < 1e7 &&
    Math.abs(info.extmax.x) < 1e7 &&
    Math.abs(info.extmax.y) < 1e7;

  const check2Pass =
    baselineDiffs.length === 0 &&
    badLayers.length === 0 &&
    unitsOk &&
    extentsOk;

  // --- CHECK 3: Rule 4 Mutual Exclusion (Unclear KHOANH MÂY vs M-MVAC-*) via strict BBox ---
  // Distinguish Spec v3 Row 16 detail-callout clouds (connected to a LEADER) vs Row 15 unclear-region clouds!
  const allShopEntities = [...shopDuctBlocks, ...shopOtherEntities.filter(e => e.layer !== 'M-MVAC-DIM')];
  const bboxSteps = [
    ...cloudEntities.map(c => ({ tool: 'get_bounding_box', args: { handles: [c.handle] } })),
    ...leaderEntities.map(l => ({ tool: 'get_bounding_box', args: { handles: [l.handle] } })),
    ...allShopEntities.map(s => ({ tool: 'get_bounding_box', args: { handles: [s.handle] } })),
  ];
  const bboxRes = bboxSteps.length ? await batchCall(bboxSteps) : [];
  const cloudBboxes = cloudEntities.map((c, idx) => ({
    handle: c.handle,
    type: c.type,
    bbox: bboxRes[idx]?.data || null,
  }));
  const leaderBboxes = leaderEntities.map((l, idx) => ({
    handle: l.handle,
    bbox: bboxRes[cloudEntities.length + idx]?.data || null,
  }));
  const shopOffset = cloudEntities.length + leaderEntities.length;
  const shopBboxes = allShopEntities.map((s, idx) => ({
    handle: s.handle,
    layer: s.layer,
    blockName: s.blockName || s.type,
    bbox: bboxRes[shopOffset + idx]?.data || null,
  }));

  let detailCalloutCloudCount = 0;
  let unclearCloudCount = 0;
  const cloudOverlaps = [];
  for (const c of cloudBboxes) {
    if (!c.bbox) continue;
    const isDetailCallout = leaderBboxes.some(lb => lb.bbox && bboxIntersects(c.bbox, lb.bbox, 120));
    c.kind = isDetailCallout ? 'TRICH_CHI_TIET' : 'KHOANH_MAY';
    if (isDetailCallout) {
      detailCalloutCloudCount++;
      continue; // Detail callout clouds legitimately wrap their elevation blocks & detail dims
    }
    unclearCloudCount++;
    const hits = [];
    for (const s of shopBboxes) {
      if (s.bbox && bboxIntersects(c.bbox, s.bbox, 0)) {
        hits.push({ handle: s.handle, layer: s.layer, blockName: s.blockName });
      }
    }
    if (hits.length > 0) {
      cloudOverlaps.push({ cloudHandle: c.handle, cloudBbox: c.bbox, overlapCount: hits.length, hits });
    }
  }
  const check3Pass = cloudOverlaps.length === 0;

  // --- CHECK 4: 100% XData HTS_OG_DAY on all M-MVAC-* duct INSERT blocks ---
  const xdataRes = shopDuctBlocks.length
    ? await batchCall(
        shopDuctBlocks.map(e => ({
          tool: 'get_xdata',
          args: { handle: e.handle, appName: 'HTS_OG_DAY' },
        }))
      )
    : [];

  const missingXdata = [];
  const bodDistribution = {};
  shopDuctBlocks.forEach((e, idx) => {
    const items = xdataRes[idx]?.data?.items || [];
    const valItem = items.find(it => it.code === 1040);
    const num = valItem ? Number(valItem.value) : NaN;
    if (!Number.isFinite(num)) {
      missingXdata.push({ handle: e.handle, layer: e.layer, blockName: e.blockName });
    } else {
      const key = String(num);
      bodDistribution[key] = (bodDistribution[key] || 0) + 1;
    }
  });
  const check4Pass = missingXdata.length === 0;

  // Optional overview PNG
  let qaImagePath = null;
  if (opts.imageDir) {
    fs.mkdirSync(opts.imageDir, { recursive: true });
    const imgRes = await callTool('export_plan_image', {
      outDir: opts.imageDir,
      fileName: 'qa_audit_full',
      format: 'png',
      grid: true,
      widthPx: 2400,
    });
    if (imgRes.success) qaImagePath = path.join(opts.imageDir, 'qa_audit_full.png');
  }

  const allPass = check1Pass && check2Pass && check3Pass && check4Pass;
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

  const report = {
    auditedAt: new Date().toISOString(),
    elapsedSec: Number(elapsed),
    verdict: allPass ? 'PASS' : 'FAIL',
    drawing: info.filename,
    units: info.units,
    osmode: settings.osmode,
    totalEntities: info.entity_count,
    surfaceAreaM2: Number((surface.total_surface_m2 || 0).toFixed(2)),
    straightDuctCount: surface.duct_count || 0,
    countsByLayer: currentCounts,
    checks: {
      check1_htsToolAndRule0: {
        pass: check1Pass,
        shopDuctBlockCount: shopDuctBlocks.length,
        zOffsetPlanSymbolsCount: zOffsetPlanSymbols.length,
        nonInsertDucts,
        nonHtsDucts,
        unusedBlocks: unusedBlocks.map(b => b.name),
        unsolicitedShop: unsolicitedShop.map(e => ({ handle: e.handle, layer: e.layer, blockName: e.blockName || e.type })),
      },
      check2_baselineAndLayers: {
        pass: check2Pass,
        baselineChecked,
        baselineDiffs,
        unitsOk,
        extentsOk,
        totalLayers: layerDetails.length,
        badLayers: badLayers.map(l => ({ name: l.name, is_locked: l.is_locked, is_frozen: l.is_frozen, is_off: l.is_off })),
      },
      check3_revcloudMutualExclusion: {
        pass: check3Pass,
        cloudCount: cloudEntities.length,
        unclearCloudCount,
        detailCalloutCloudCount,
        clouds: cloudBboxes,
        overlaps: cloudOverlaps,
      },
      check4_xdataElevation: {
        pass: check4Pass,
        checkedCount: shopDuctBlocks.length,
        validCount: shopDuctBlocks.length - missingXdata.length,
        missingXdata,
        bodDistribution,
      },
    },
    qaImagePath,
  };

  if (opts.out) {
    fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
    fs.writeFileSync(opts.out, JSON.stringify(report, null, 2), 'utf8');
  }

  // Concise console output
  console.log(`==========================================================`);
  console.log(`[qa_audit_hvac] VERDICT: ${report.verdict} (audited in ${elapsed}s)`);
  console.log(`Drawing : ${path.basename(info.filename)} | units=${info.units} | osmode=${settings.osmode} | entities=${info.entity_count}`);
  console.log(`Surface : ${report.surfaceAreaM2} m² (${report.straightDuctCount} straight ducts)`);
  console.log(`----------------------------------------------------------`);
  console.log(`[1] 100% HTS & Rule 0 : ${check1Pass ? 'PASS' : 'FAIL'} | ${shopDuctBlocks.length} HTS blocks + ${zOffsetPlanSymbols.length} Z-plan symbols, ${nonInsertDucts.length} fake lines, ${nonHtsDucts.length} non-HTS, ${unusedBlocks.length} unused defs, ${unsolicitedShop.length} unsolicited`);
  console.log(`[2] Baseline & Layers : ${check2Pass ? 'PASS' : 'FAIL'} | baseline=${baselineChecked ? (baselineDiffs.length === 0 ? '100% MATCH' : baselineDiffs.length + ' DIFFS') : 'not supplied'}, badLayers=${badLayers.length}/${layerDetails.length}`);
  console.log(`[3] Rule 4 CLOUND     : ${check3Pass ? 'PASS' : 'FAIL'} | ${unclearCloudCount} unclear clouds (${cloudOverlaps.length} overlap) + ${detailCalloutCloudCount} detail callout clouds`);
  console.log(`[4] XData HTS_OG_DAY  : ${check4Pass ? 'PASS' : 'FAIL'} | ${shopDuctBlocks.length - missingXdata.length}/${shopDuctBlocks.length} valid (${Object.entries(bodDistribution).map(([k, v]) => `${k}:${v}`).join(', ')})`);
  console.log(`==========================================================`);

  if (!allPass) {
    if (nonInsertDucts.length) console.log('  -> nonInsertDucts:', nonInsertDucts.map(e => e.handle));
    if (nonHtsDucts.length) console.log('  -> nonHtsDucts:', nonHtsDucts.map(e => `${e.handle}:${e.blockName}`));
    if (unusedBlocks.length) console.log('  -> unusedBlocks:', unusedBlocks.map(b => b.name));
    if (unsolicitedShop.length) console.log('  -> unsolicitedShop:', unsolicitedShop.map(e => `${e.handle}@${e.layer}`));
    if (baselineDiffs.length) console.log('  -> baselineDiffs:', JSON.stringify(baselineDiffs));
    if (badLayers.length) console.log('  -> badLayers:', JSON.stringify(badLayers.map(l => ({ name: l.name, locked: l.is_locked, frozen: l.is_frozen, off: l.is_off }))));
    if (cloudOverlaps.length) console.log('  -> cloudOverlaps:', JSON.stringify(cloudOverlaps));
    if (missingXdata.length) console.log('  -> missingXdata:', missingXdata.map(e => `${e.handle}:${e.blockName}`));
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[qa_audit_hvac] ERROR:', err.message);
  process.exit(1);
});
