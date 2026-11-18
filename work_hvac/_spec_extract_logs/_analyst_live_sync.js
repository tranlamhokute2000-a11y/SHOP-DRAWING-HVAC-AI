const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5088/mcp";
const RAW_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_raw_entities.json";

async function callTool(name, args = {}) {
  const res = await fetch(`${BASE}/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  return JSON.parse(await res.text());
}

(async () => {
  const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));
  const diskByHandle = new Map();
  for (const e of raw.entities) {
    diskByHandle.set(e.handle.toUpperCase(), e);
  }

  const layersRes = await callTool("get_layer_list", {});
  const layers = layersRes.data.layers.map((l) => l.name);

  const liveHandlesByLayer = {};
  const missingInDisk = [];
  let totalLive = 0;

  for (const lay of layers) {
    const r = await callTool("select_by_layer", { layer: lay });
    const handles = (r.data && (r.data.handles || r.data.items)) || [];
    liveHandlesByLayer[lay] = handles;
    totalLive += handles.length;
    for (const h of handles) {
      const hu = String(h).toUpperCase();
      if (!diskByHandle.has(hu)) {
        missingInDisk.push({ handle: hu, layer: lay });
      }
    }
  }

  console.log("Total disk entities:", raw.entities.length);
  console.log("Total live entities:", totalLive);
  console.log("Unsaved entities in live session:", missingInDisk);

  // Inspect unsaved entities
  const unsavedDetails = [];
  for (const m of missingInDisk) {
    const bb = await callTool("get_bounding_box", { handles: [m.handle] });
    const ep = await callTool("get_curve_endpoints", { handle: m.handle });
    let areaInfo = null;
    if (bb.data) {
      const minX = bb.data.minX ?? (bb.data.minPoint && bb.data.minPoint.x) ?? 4000;
      const minY = bb.data.minY ?? (bb.data.minPoint && bb.data.minPoint.y) ?? -5000;
      const maxX = bb.data.maxX ?? (bb.data.maxPoint && bb.data.maxPoint.x) ?? 12000;
      const maxY = bb.data.maxY ?? (bb.data.maxPoint && bb.data.maxPoint.y) ?? 0;
      areaInfo = await callTool("get_entities_in_area", {
        minX: minX - 10,
        minY: minY - 10,
        maxX: maxX + 10,
        maxY: maxY + 10,
      });
    }
    unsavedDetails.push({ ...m, bboxResp: bb.data, endpointsResp: ep.data, areaResp: areaInfo && areaInfo.data });
  }
  console.log("Unsaved details:", JSON.stringify(unsavedDetails, null, 2));

  // Fetch exact live bounding boxes for all 95 INSERT entities
  const inserts = raw.entities.filter((e) => e.type === "INSERT");
  console.log("Fetching live bbox for", inserts.length, "INSERT entities...");
  for (const ins of inserts) {
    const bb = await callTool("get_bounding_box", { handles: [ins.handle] });
    if (bb.success && bb.data) {
      ins.liveBbox = bb.data;
    }
  }

  raw.live_session_sync = {
    live_entity_count: totalLive,
    disk_entity_count: raw.model_entity_count,
    unsaved_live_entities: unsavedDetails,
  };

  fs.writeFileSync(RAW_PATH, JSON.stringify(raw, null, 2), "utf8");
  console.log("Updated 02_raw_entities.json with live session sync & exact INSERT bboxes!");
})();
