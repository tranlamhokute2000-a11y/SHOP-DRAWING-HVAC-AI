import fs from "fs";
import path from "path";

const OUT_DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";

async function callTool(name, args = {}) {
  const res = await fetch("http://localhost:5088/mcp/tools/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  return res.json();
}

async function main() {
  // 1. Get ALL entities in the full drawing bounding box (with generous padding)
  const allArea = await callTool("get_entities_in_area", {
    minX: 20000,
    minY: 9000,
    maxX: 96000,
    maxY: 75000,
  });

  const entities = allArea.data?.entities || allArea.data || [];
  console.log("get_entities_in_area count:", entities.length, "keys:", Object.keys(allArea.data || {}));

  // Also check select_by_layer for each non-empty layer to be 100% sure we didn't miss any entity outside box
  const layerNames = [
    "MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED",
    "MEPG-M-EQUIP",
    "MEPG-AC-TEXT",
    "0",
  ];
  const byLayer = {};
  for (const ln of layerNames) {
    const r = await callTool("select_by_layer", { layer: ln });
    byLayer[ln] = r.data;
    console.log("Layer", ln, "count:", r.data?.count ?? r.data?.handles?.length ?? JSON.stringify(r.data).slice(0, 120));
  }

  // Build handle map from get_entities_in_area
  const map = new Map();
  for (const e of entities) {
    if (e.handle) map.set(e.handle, e);
  }

  // Gather all handles from byLayer
  const allHandles = [];
  for (const ln of layerNames) {
    const list = byLayer[ln]?.handles || byLayer[ln]?.entities || [];
    for (const h of list) {
      const handle = typeof h === "string" ? h : h.handle;
      if (handle) allHandles.push({ handle, layer: ln });
    }
  }
  console.log("Total handles across layers:", allHandles.length, "in area:", map.size);

  // Get bounding box for EVERY entity in one batch or per entity? Check get_bounding_box signature: takes `handles` (array) -> might return combined bbox!
  // Let's test get_bounding_box on 1 entity and get_curve_endpoints on 1 line first, and check what fields `get_entities_in_area` already returned!
  console.log("Sample entities from get_entities_in_area:");
  const seenTypes = new Set();
  for (const e of entities) {
    const t = e.type || e.dxfType || e.objectName;
    if (!seenTypes.has(t)) {
      seenTypes.add(t);
      console.log(JSON.stringify(e));
    }
  }

  // Enrich each entity with individual get_bounding_box (and get_curve_endpoints if curve)
  const enriched = [];
  for (const e of entities) {
    const item = { ...e };
    const bb = await callTool("get_bounding_box", { handles: [e.handle] });
    if (bb.success && bb.data) {
      item.bbox = bb.data;
    }
    const t = (e.type || e.dxfType || "").toUpperCase();
    if (/LINE|POLYLINE|ARC|ELLIPSE|SPLINE|CIRCLE/.test(t)) {
      const ep = await callTool("get_curve_endpoints", { handle: e.handle });
      if (ep.success && ep.data) item.endpoints = ep.data;
    }
    enriched.push(item);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "entities_full.json"),
    JSON.stringify({ total: enriched.length, byLayer, entities: enriched }, null, 2),
    "utf8"
  );
  console.log("Saved entities_full.json with", enriched.length, "entities!");
}

main().catch(e => { console.error(e); process.exit(1); });
