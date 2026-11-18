const fs = require("fs");

const BASE = "http://localhost:5088/mcp";
const RAW_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_raw_entities.json";
const TEXT_MCP_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\_mcp_extract_all_text.json";

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
  const mcpTexts = JSON.parse(fs.readFileSync(TEXT_MCP_PATH, "utf8")).data.items;
  const mcpTextByHandle = new Map(mcpTexts.map((t) => [t.handle.toUpperCase(), t]));

  let textDiffs = 0;
  for (const e of raw.entities) {
    if (e.type === "MTEXT" || e.type === "TEXT") {
      const liveT = mcpTextByHandle.get(e.handle.toUpperCase());
      if (liveT && liveT.content !== e.text) {
        textDiffs++;
        e.diskText = e.text;
        e.text = liveT.content; // Sync to live AutoCAD text!
      }
    }
  }
  console.log("MTEXT live vs disk diffs updated:", textDiffs);

  let lineDiffs = 0;
  for (const e of raw.entities) {
    if (e.type === "LINE") {
      const r = await callTool("get_curve_endpoints", { handle: e.handle });
      if (r.success && r.data) {
        const ls = r.data.start;
        const le = r.data.end;
        const d1 = Math.hypot(ls.x - e.start[0], ls.y - e.start[1]);
        const d2 = Math.hypot(le.x - e.end[0], le.y - e.end[1]);
        if (d1 > 0.01 || d2 > 0.01) {
          lineDiffs++;
          console.log(`LINE diff on ${e.handle}: d1=${d1}, d2=${d2}`);
          e.diskStart = e.start;
          e.diskEnd = e.end;
          e.start = [ls.x, ls.y, ls.z || 0];
          e.end = [le.x, le.y, le.z || 0];
        }
      }
    }
  }
  console.log("LINE live vs disk diffs:", lineDiffs);

  fs.writeFileSync(RAW_PATH, JSON.stringify(raw, null, 2), "utf8");
  console.log("Saved 100% live-synced 02_raw_entities.json!");
})();
