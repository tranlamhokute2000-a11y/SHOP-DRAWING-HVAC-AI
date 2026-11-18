import fs from "fs";
import path from "path";

const OUT_DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
fs.mkdirSync(OUT_DIR, { recursive: true });

async function callTool(name, args = {}) {
  const res = await fetch("http://localhost:5088/mcp/tools/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch {
    return { raw: txt };
  }
}

async function main() {
  const results = {};
  for (const [key, tool, args] of [
    ["drawing_info", "get_drawing_info", {}],
    ["current_settings", "get_current_settings", {}],
    ["layer_list", "get_layer_list", {}],
    ["group_summary", "group_summary_by_layer", {}],
    ["block_defs", "list_block_definitions", {}],
    ["all_text", "extract_all_text", {}],
    ["plan_image", "export_plan_image", {
      outputPath: path.join(OUT_DIR, "survey_full.png"),
      width: 2400,
      height: 1800,
      grid: true
    }],
  ]) {
    console.log("Calling", tool, "...");
    results[key] = await callTool(tool, args);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "survey_overview.json"),
    JSON.stringify(results, null, 2),
    "utf8"
  );

  // Also list available query/read tools
  const toolsRes = await fetch("http://localhost:5088/mcp/tools/list");
  const toolsJson = await toolsRes.json();
  const toolsList = Array.isArray(toolsJson) ? toolsJson : (toolsJson.tools || []);
  const relevant = toolsList
    .filter(t => /get_|list_|select_|export_|extract_|block|duct|hvac|entity|layer|geom/i.test(t.name))
    .map(t => ({ name: t.name, desc: (t.description || "").slice(0, 120), params: t.parameters || t.inputSchema }));
  fs.writeFileSync(
    path.join(OUT_DIR, "tools_relevant.json"),
    JSON.stringify(relevant, null, 2),
    "utf8"
  );

  console.log("DONE! Layers:", results.layer_list?.data?.length ?? "check json");
  console.log("Summary:", JSON.stringify(results.group_summary?.data, null, 2));
  console.log("Plan image:", JSON.stringify(results.plan_image));
}

main().catch(e => { console.error(e); process.exit(1); });
