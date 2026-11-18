import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const CROPS_DIR = path.join(DIR, "crops");
fs.mkdirSync(CROPS_DIR, { recursive: true });

async function callTool(name, args = {}) {
  const res = await fetch("http://localhost:5088/mcp/tools/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  return res.json();
}

const crops = [
  { name: "crop1_fan_room", minX: 54500, minY: 36500, maxX: 67500, maxY: 48500, gridStep: 1000 },
  { name: "crop2_pad_upper", minX: 42500, minY: 56500, maxX: 61000, maxY: 64000, gridStep: 1000 },
  { name: "crop3_sead_top_right", minX: 49500, minY: 58500, maxX: 70500, maxY: 74000, gridStep: 2000 },
  { name: "crop4_sead_top_left", minX: 21500, minY: 49500, maxX: 53000, maxY: 61000, gridStep: 2000 },
  { name: "crop5_sead_left_vert", minX: 21500, minY: 19500, maxX: 25500, maxY: 56500, gridStep: 2000 },
  { name: "crop6_sead_lower_mid", minX: 49000, minY: 10000, maxX: 67000, maxY: 41500, gridStep: 2000 },
  { name: "crop7_sead_bottom_left", minX: 21000, minY: 10000, maxX: 52500, maxY: 14500, gridStep: 2000 },
];

async function main() {
  for (const c of crops) {
    const r = await callTool("export_plan_image", {
      minX: c.minX,
      minY: c.minY,
      maxX: c.maxX,
      maxY: c.maxY,
      widthPx: 1800,
      grid: true,
      gridStep: c.gridStep,
      outDir: CROPS_DIR,
      fileName: c.name,
    });
    console.log(c.name, "->", r.success, r.data?.png || r.content);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
