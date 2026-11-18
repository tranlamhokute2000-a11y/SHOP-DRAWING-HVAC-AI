const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5088/mcp";
const OUT_DIR = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac";
let bearerToken = null;

async function callTool(name, args = {}) {
  const headers = { "Content-Type": "application/json" };
  if (bearerToken) headers["Authorization"] = "Bearer " + bearerToken;
  let res = await fetch(`${BASE}/tools/call`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, arguments: args }),
  });
  if (res.status === 401 && !bearerToken) {
    const tokRes = await fetch(`${BASE}/auth/token`);
    const tok = await tokRes.json();
    bearerToken = tok.token;
    return callTool(name, args);
  }
  const text = await res.text();
  return JSON.parse(text);
}

(async () => {
  const calls = [
    ["get_drawing_info", {}],
    ["get_layer_list", {}],
    ["group_summary_by_layer", {}],
    ["list_block_definitions", { includeUnused: false }],
    ["extract_all_text", {}],
    [
      "export_plan_image",
      {
        outDir: OUT_DIR,
        fileName: "plan_overview",
        format: "png",
        grid: true,
        widthPx: 2000,
      },
    ],
  ];
  for (const [name, args] of calls) {
    console.log("Calling", name);
    const res = await callTool(name, args);
    fs.writeFileSync(
      path.join(OUT_DIR, `_mcp_${name}.json`),
      JSON.stringify(res, null, 2),
      "utf8"
    );
    console.log("  -> success:", res.success);
  }
})();
