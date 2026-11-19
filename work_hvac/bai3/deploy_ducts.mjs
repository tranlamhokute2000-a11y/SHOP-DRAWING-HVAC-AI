#!/usr/bin/env node
import fs from 'fs';
import { checkHealth, callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  const t0 = Date.now();
  console.log('=== STARTING DUCT-AUTHOR SHOP DRAWING DEPLOYMENT ===');
  await checkHealth();

  // 1. Ensure original layers are locked and OSMODE=0
  const origLayers = [
    'MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED',
    'MEPG-AC-M-Hút gió thải-Exhaust Air-EAD',
    'MEPG-AC-TEXT',
    'MEPG-M-EQUIP',
    'MEPG-XREF-ARC',
    '0'
  ];
  await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, locked: true } })));
  await callTool('send_command', { command: '_.OSMODE\n0\n' });

  // 2. Define ALL runs with exact centerline coordinates, W, H, R, layer, BOD
  const runs = [
    // ==========================================
    // SYSTEM 1: EAD (M-MVAC-EAD, color 80)
    // ==========================================
    // EAD North Branch (BOD = 3200)
    {
      name: 'EAD-N1', layer: 'M-MVAC-EAD', W: 900, H: 300, R: 450, bod: 3200,
      points: [
        { x: -73422.8, y: 119314.3 },
        { x: -68682.1, y: 119314.7 }
      ]
    },
    {
      name: 'EAD-N2', layer: 'M-MVAC-EAD', W: 700, H: 300, R: 350, bod: 3200,
      points: [
        { x: -68478.1, y: 119314.7 },
        { x: -62698.5, y: 119315.3 },
        { x: -61652.0, y: 118268.7 },
        { x: -56775.0, y: 118269.1 }
      ]
    },

    // EAD West Trunk North (BOD = 2400)
    {
      name: 'EAD-W1', layer: 'M-MVAC-EAD', W: 1250, H: 500, R: 312.5, bod: 2400,
      points: [
        { x: -79390.1, y: 113303.7 },
        { x: -76007.8, y: 113303.9 },
        { x: -76007.8, y: 112363.9 }
      ]
    },
    {
      name: 'EAD-W2', layer: 'M-MVAC-EAD', W: 1250, H: 500, R: 625, bod: 2400,
      points: [
        { x: -76007.6, y: 107741.1 },
        { x: -76007.6, y: 77798.3 }
      ]
    },

    // EAD West Trunk South (BOD = 2550)
    {
      name: 'EAD-W3a', layer: 'M-MVAC-EAD', W: 1250, H: 500, R: 625, bod: 2550,
      points: [
        { x: -76007.6, y: 77180.1 },
        { x: -76007.6, y: 75181.2 }
      ]
    },
    {
      name: 'EAD-W3b', layer: 'M-MVAC-EAD', W: 1250, H: 500, R: 625, bod: 2550,
      points: [
        { x: -76007.6, y: 74516.6 },
        { x: -76007.6, y: 72482.7 }
      ]
    },
    {
      name: 'EAD-W4', layer: 'M-MVAC-EAD', W: 1250, H: 500, R: 625, bod: 2550,
      points: [
        { x: -76007.6, y: 72482.7 },
        { x: -76375.2, y: 71595.4 },
        { x: -77100.0, y: 70870.6 },
        { x: -78541.9, y: 70245.9 },
        { x: -81207.4, y: 70245.9 }
      ]
    },
    {
      name: 'EAD-W5', layer: 'M-MVAC-EAD', W: 1250, H: 500, R: 625, bod: 2550,
      points: [
        { x: -81398.3, y: 70245.9 },
        { x: -82027.1, y: 70077.4 },
        { x: -82686.4, y: 69696.8 },
        { x: -84491.8, y: 69821.8 }
      ]
    },
    {
      name: 'EAD-W6', layer: 'M-MVAC-EAD', W: 1000, H: 450, R: 500, bod: 2575,
      points: [
        { x: -84491.8, y: 69821.8 },
        { x: -87316.7, y: 69821.8 }
      ]
    },
    {
      name: 'EAD-W7_Tap', layer: 'M-MVAC-EAD', W: 1000, H: 450, R: 500, bod: 2575,
      points: [
        { x: -83729.3, y: 68590.2 },
        { x: -83729.3, y: 66828.3 },
        { x: -87091.7, y: 66828.3 }
      ]
    },

    // ==========================================
    // SYSTEM 2: SED (M-MVAC-SEAD, color 190)
    // ==========================================
    // --- Group SED-NW: Northwest (Fan Room 1 down to South) ---
    {
      name: 'SED-NW_Header', layer: 'M-MVAC-SEAD', W: 2200, H: 550, R: 1100, bod: 2350,
      points: [
        { x: -76045.1, y: 116526.8 },
        { x: -68570.8, y: 116530.3 },
        { x: -68570.8, y: 112062.6 }
      ]
    },
    {
      name: 'SED-NW_HeaderCont', layer: 'M-MVAC-SEAD', W: 2200, H: 550, R: 1100, bod: 2350,
      points: [
        { x: -68570.6, y: 111912.6 },
        { x: -68570.6, y: 108605.6 }
      ]
    },
    {
      name: 'SED-NW_Branch1', layer: 'M-MVAC-SEAD', W: 1400, H: 450, R: 700, bod: 2400,
      points: [
        { x: -68570.6, y: 109542.6 },
        { x: -70147.1, y: 109542.6 }
      ]
    },
    {
      name: 'SED-NW_Branch2', layer: 'M-MVAC-SEAD', W: 1400, H: 450, R: 700, bod: 2400,
      points: [
        { x: -70297.2, y: 109542.6 },
        { x: -73801.9, y: 109542.3 },
        { x: -73801.9, y: 96706.6 }
      ]
    },
    {
      name: 'SED-NW_Trunk1200', layer: 'M-MVAC-SEAD', W: 1200, H: 450, R: 600, bod: 2400,
      points: [
        { x: -73701.9, y: 95517.6 },
        { x: -73701.9, y: 89418.4 },
        { x: -73863.7, y: 88814.6 },
        { x: -74120.9, y: 88369.2 },
        { x: -74282.6, y: 87765.5 },
        { x: -74282.6, y: 77791.6 }
      ]
    },
    // Z-OFFSET Z-01 GAP: Y = 77451.8 .. 74505.5
    {
      name: 'SED-NW_Trunk1000', layer: 'M-MVAC-SEAD', W: 1000, H: 400, R: 500, bod: 2650,
      points: [
        { x: -74282.6, y: 74505.5 },
        { x: -74282.6, y: 63378.2 }
      ]
    },
    {
      name: 'SED-NW_Trunk800', layer: 'M-MVAC-SEAD', W: 800, H: 350, R: 400, bod: 2675,
      points: [
        { x: -74282.6, y: 62874.2 },
        { x: -74282.6, y: 58851.7 },
        { x: -74884.6, y: 58249.7 },
        { x: -80872.7, y: 58249.7 }
      ]
    },
    {
      name: 'SED-NW_Jog800', layer: 'M-MVAC-SEAD', W: 800, H: 350, R: 400, bod: 2675,
      points: [
        { x: -80872.7, y: 58249.7 },
        { x: -81441.8, y: 58014.0 },
        { x: -82421.4, y: 57034.4 },
        { x: -83731.1, y: 56058.1 },
        { x: -85783.7, y: 56058.1 },
        { x: -86585.7, y: 55256.1 },
        { x: -86585.7, y: 54788.8 }
      ]
    },
    {
      name: 'SED-NW_End500', layer: 'M-MVAC-SEAD', W: 500, H: 350, R: 250, bod: 2675,
      points: [
        { x: -86585.7, y: 53731.4 },
        { x: -86585.7, y: 42270.8 }
      ]
    },

    // --- Group SED-NE: Northeast (from X=-61000 down to South) ---
    {
      name: 'SED-NE_Header', layer: 'M-MVAC-SEAD', W: 1400, H: 450, R: 700, bod: 2800,
      points: [
        { x: -65629.3, y: 109643.1 },
        { x: -55982.3, y: 109643.9 },
        { x: -54580.2, y: 108241.9 },
        { x: -54580.2, y: 100662.9 }
      ]
    },
    {
      name: 'SED-NE_Trunk1200', layer: 'M-MVAC-SEAD', W: 1200, H: 450, R: 600, bod: 2800,
      points: [
        { x: -54480.2, y: 100458.9 },
        { x: -54480.2, y: 85131.9 }
      ]
    },
    {
      name: 'SED-NE_Trunk1000', layer: 'M-MVAC-SEAD', W: 1000, H: 400, R: 500, bod: 2800,
      points: [
        { x: -54380.2, y: 84549.9 },
        { x: -54380.2, y: 72723.4 }
      ]
    },
    {
      name: 'SED-NE_Trunk800', layer: 'M-MVAC-SEAD', W: 800, H: 350, R: 400, bod: 2800,
      points: [
        { x: -54379.3, y: 72519.4 },
        { x: -54379.3, y: 70853.2 },
        { x: -55181.1, y: 70051.1 },
        { x: -56402.4, y: 70051.1 },
        { x: -57204.4, y: 69249.0 },
        { x: -57204.4, y: 60196.0 }
      ]
    },
    {
      name: 'SED-NE_Trunk500', layer: 'M-MVAC-SEAD', W: 500, H: 350, R: 250, bod: 2800,
      points: [
        { x: -57203.6, y: 59992.0 },
        { x: -57203.2, y: 55269.5 },
        { x: -57705.2, y: 54767.5 },
        { x: -60166.8, y: 54767.3 },
        { x: -60668.8, y: 54265.2 },
        { x: -60668.8, y: 48780.0 }
      ]
    },

    // --- Group SED-South: South Network (Fan Room 2 outward) ---
    // Header outside Fan Room 2
    {
      name: 'SED-S_Header', layer: 'M-MVAC-SEAD', W: 2200, H: 550, R: 1100, bod: 2950,
      points: [
        { x: -44303.0, y: 17820.3 },
        { x: -51989.0, y: 17819.6 }
      ]
    },
    // Branch Northeast
    {
      name: 'SED-S_NE_Branch', layer: 'M-MVAC-SEAD', W: 950, H: 450, R: 475, bod: 3050,
      points: [
        { x: -46183.7, y: 19072.1 },
        { x: -46183.7, y: 24852.7 }
      ]
    },
    // Branch Southeast (along X=-51000)
    {
      name: 'SED-SE_Trunk1200', layer: 'M-MVAC-SEAD', W: 1200, H: 400, R: 600, bod: 3100,
      points: [
        { x: -50939.7, y: 16567.6 },
        { x: -50939.7, y: 12868.4 }
      ]
    },
    {
      name: 'SED-SE_Trunk1000', layer: 'M-MVAC-SEAD', W: 1000, H: 350, R: 500, bod: 3150,
      points: [
        { x: -50839.0, y: 12292.7 },
        { x: -50839.0, y: 7985.6 }
      ]
    },
    // Z-OFFSET Z-04 GAP: Y = 7985.6 .. 7041.7
    {
      name: 'SED-SE_Trunk1000Low', layer: 'M-MVAC-SEAD', W: 1000, H: 350, R: 500, bod: 2500,
      points: [
        { x: -50838.3, y: 7041.7 },
        { x: -50838.3, y: -1707.1 }
      ]
    },

    // Main Trunk heading North along X=-50982.3 (BOD=3050)
    {
      name: 'SED-S_MainNorth', layer: 'M-MVAC-SEAD', W: 1850, H: 450, R: 925, bod: 3050,
      points: [
        { x: -50982.3, y: 19071.8 },
        { x: -50982.3, y: 31491.4 }
      ]
    },
    // Z-OFFSET Z-02 GAP: between (-50982.3, 31491.4) and (-52834.3, 33343.4)
    {
      name: 'SED-S_MainWest1850', layer: 'M-MVAC-SEAD', W: 1850, H: 450, R: 925, bod: 2300,
      points: [
        { x: -52834.3, y: 33343.4 },
        { x: -63701.9, y: 33343.4 }
      ]
    },
    {
      name: 'SED-S_MainWest1500', layer: 'M-MVAC-SEAD', W: 1500, H: 450, R: 750, bod: 2300,
      points: [
        { x: -63906.0, y: 33519.1 },
        { x: -67891.1, y: 33518.8 },
        { x: -67901.2, y: 33518.7 },
        { x: -73767.5, y: 33518.1 }
      ]
    },
    // Z-OFFSET Z-03 GAP: between X=-73767.5 and X=-74562.9
    {
      name: 'SED-S_MainWest1500High', layer: 'M-MVAC-SEAD', W: 1500, H: 450, R: 750, bod: 2720,
      points: [
        { x: -74562.9, y: 33518.3 },
        { x: -78760.6, y: 33518.3 }
      ]
    },
    // Corner at (-78760.6, 33518.3)
    {
      name: 'SED-S_NorthBranch350', layer: 'M-MVAC-SEAD', W: 350, H: 350, R: 175, bod: 2770,
      points: [
        { x: -78761.1, y: 34420.4 },
        { x: -78761.1, y: 38977.0 }
      ]
    },
    {
      name: 'SED-S_SouthTrunk1300', layer: 'M-MVAC-SEAD', W: 1300, H: 450, R: 650, bod: 2720,
      points: [
        { x: -78760.6, y: 32616.2 },
        { x: -78760.6, y: 24085.5 }
      ]
    },
    {
      name: 'SED-S_SouthTrunk1200', layer: 'M-MVAC-SEAD', W: 1200, H: 400, R: 600, bod: 2770,
      points: [
        { x: -78759.8, y: 23881.5 },
        { x: -78759.8, y: 17336.5 }
      ]
    },
    {
      name: 'SED-S_SouthTrunk950', layer: 'M-MVAC-SEAD', W: 950, H: 400, R: 475, bod: 2770,
      points: [
        { x: -78759.2, y: 17132.5 },
        { x: -78759.2, y: 10457.5 }
      ]
    },
    {
      name: 'SED-S_SouthTrunk750', layer: 'M-MVAC-SEAD', W: 750, H: 350, R: 375, bod: 2820,
      points: [
        { x: -78758.7, y: 10253.5 },
        { x: -78758.7, y: -1259.5 }
      ]
    },

    // Southwest Branch along X=-62946.8
    {
      name: 'SED-SW_Branch1000', layer: 'M-MVAC-SEAD', W: 1000, H: 400, R: 500, bod: 3150,
      points: [
        { x: -62946.8, y: 32418.3 },
        { x: -62946.8, y: 17411.6 }
      ]
    },
    {
      name: 'SED-SW_Branch800', layer: 'M-MVAC-SEAD', W: 800, H: 350, R: 400, bod: 3200,
      points: [
        { x: -62946.8, y: 17207.6 },
        { x: -62946.8, y: 3908.6 }
      ]
    }
  ];

  console.log(`Prepared ${runs.length} duct runs to draw.`);

  // 3. Draw ducts in batches using draw_rectangular_duct
  // Let's call draw_rectangular_duct in chunks of 5 runs to ensure smooth execution and detailed logging
  const allCreatedHandles = [];
  const runResults = [];
  const elevationGroups = {};

  for (let i = 0; i < runs.length; i += 5) {
    const chunk = runs.slice(i, i + 5);
    const mcpRuns = chunk.map(r => ({
      W: r.W,
      H: r.H,
      R: r.R,
      layer: r.layer,
      prefix: 'HTS',
      points: r.points
    }));

    console.log(`--> Calling draw_rectangular_duct for chunk [${i}..${i + chunk.length - 1}]...`);
    const res = await callTool('draw_rectangular_duct', { runs: mcpRuns });
    if (!res.success || !res.data) {
      throw new Error(`Failed to draw duct chunk [${i}]: ${res.content}`);
    }

    const resRuns = res.data.runs || [];
    for (let j = 0; j < chunk.length; j++) {
      const cfg = chunk[j];
      const rInfo = resRuns[j] || {};
      const straights = rInfo.straightHandles || [];
      const elbows = rInfo.elbowHandles || [];
      const handles = [...straights, ...elbows];

      allCreatedHandles.push(...handles);
      runResults.push({
        name: cfg.name,
        layer: cfg.layer,
        W: cfg.W,
        H: cfg.H,
        bod: cfg.bod,
        straights: straights.length,
        elbows: elbows.length,
        handles
      });

      // Group handles by BOD for duct_set_elevation
      elevationGroups[cfg.bod] = elevationGroups[cfg.bod] || [];
      elevationGroups[cfg.bod].push(...handles);

      console.log(`  [OK] ${cfg.name} (${cfg.W}x${cfg.H}, BOD=${cfg.bod}): ${straights.length} straights + ${elbows.length} elbows -> ${handles.length} blocks`);
    }
  }

  console.log(`\n=== TOTAL BLOCKS CREATED: ${allCreatedHandles.length} ===`);

  // 4. Assign HTS_OG_DAY to 100% of created blocks
  console.log('--> Assigning BOD elevation to HTS_OG_DAY for 100% created blocks...');
  const nhom = Object.entries(elevationGroups).map(([bodStr, handles]) => ({
    handles,
    day: Number(bodStr)
  }));
  const elevRes = await callTool('duct_set_elevation', { nhom });
  console.log('Elevation assignment result:', elevRes.content);

  // 5. Verification: check baseline entity preservation
  const origEad = (await callTool('select_by_layer', { layer: 'MEPG-AC-M-Hút gió thải-Exhaust Air-EAD' })).data?.handles?.length;
  const origSed = (await callTool('select_by_layer', { layer: 'MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED' })).data?.handles?.length;
  const origText = (await callTool('select_by_layer', { layer: 'MEPG-AC-TEXT' })).data?.handles?.length;
  const origEquip = (await callTool('select_by_layer', { layer: 'MEPG-M-EQUIP' })).data?.handles?.length;
  const origArc = (await callTool('select_by_layer', { layer: 'MEPG-XREF-ARC' })).data?.handles?.length;
  const totalOrig = origEad + origSed + origText + origEquip + origArc;

  console.log('\n--- BASELINE ENTITY VERIFICATION ---');
  console.log(`Original EAD: ${origEad} (expected 104)`);
  console.log(`Original SED: ${origSed} (expected 396)`);
  console.log(`Original TEXT: ${origText} (expected 94)`);
  console.log(`Original EQUIP: ${origEquip} (expected 6)`);
  console.log(`Original XREF-ARC: ${origArc} (expected 8)`);
  console.log(`TOTAL ORIGINAL ENTITIES: ${totalOrig} (expected 608)`);

  if (totalOrig !== 608) {
    console.error(`WARNING: Baseline entity count changed! ${totalOrig} !== 608`);
  } else {
    console.log('✅ BASELINE 100% PRESERVED (608/608 original entities intact)!');
  }

  // 6. Save results to work_hvac/bai3/duct_author_result.json
  const summary = {
    totalRuns: runs.length,
    totalBlocks: allCreatedHandles.length,
    elevationGroupsCount: Object.keys(elevationGroups).length,
    runResults,
    originalPreserved: totalOrig === 608
  };
  fs.writeFileSync('work_hvac/bai3/duct_author_result.json', JSON.stringify(summary, null, 2), 'utf8');

  // 7. Save drawing (QSAVE)
  await callTool('save_drawing');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`\n=== DUCT-AUTHOR FINISHED IN ${elapsed}s ===`);
}

main().catch(err => {
  console.error('ERROR in deploy_ducts:', err);
  process.exit(1);
});
