const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5088/mcp";
const OUT_DIR = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac";

async function callTool(name, args = {}) {
  const res = await fetch(`${BASE}/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  return JSON.parse(await res.text());
}

(async () => {
  const regions = [
    ["zoom_1_fan_header", 31000, -500, 46500, 12000, 1800],
    ["zoom_2_bottom_left", 4000, -5000, 35500, 16500, 1800],
    ["zoom_3_left_branch", 13500, 13500, 18500, 54500, 1400],
    ["zoom_4_right_branch", 37500, 10000, 46500, 64500, 1400],
    ["zoom_5_top_branch", 4000, 57500, 45500, 64500, 2000],
  ];
  for (const [fileName, minX, minY, maxX, maxY, widthPx] of regions) {
    const r = await callTool("export_plan_image", {
      outDir: OUT_DIR,
      fileName,
      format: "png",
      grid: true,
      minX,
      minY,
      maxX,
      maxY,
      widthPx,
    });
    console.log(fileName, "->", r.success);
  }
})();
