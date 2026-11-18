async function callTool(name, args = {}) {
  const res = await fetch("http://localhost:5088/mcp/tools/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  return res.json();
}

async function main() {
  const r = await fetch("http://localhost:5088/mcp/tools/list");
  const j = await r.json();
  const list = Array.isArray(j) ? j : (j.tools || []);
  for (const t of list) {
    if (/hvac|duct|elbow|riser|offset|elev|ui_feature|revit|convert|fitting|cap|tap/i.test(t.name + " " + (t.description || ""))) {
      console.log("TOOL:", t.name);
      console.log("  DESC:", (t.description || "").slice(0, 260));
      console.log("  PARAMS:", JSON.stringify(t.parameters || t.inputSchema));
    }
  }
  // Check if ui_feature_list exists
  if (list.some(t => t.name === "ui_feature_list")) {
    console.log("\n=== ui_feature_list (hvac) ===");
    const fl = await callTool("ui_feature_list", { category: "hvac" });
    console.log(JSON.stringify(fl, null, 2));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
