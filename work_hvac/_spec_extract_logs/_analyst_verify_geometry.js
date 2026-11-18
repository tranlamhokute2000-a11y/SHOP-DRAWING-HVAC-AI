const fs = require("fs");

const RAW_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_raw_entities.json";
const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));

const lines = raw.entities.filter((e) => e.type === "LINE");
const mtexts = raw.entities.filter((e) => e.type === "MTEXT");
const inserts = raw.entities.filter((e) => e.type === "INSERT");

// Let's inspect all 11 SQUARE REDUCER blocks + 4 SQ_TO_ROUND blocks + 10 ELBOW blocks in detail
function cat(name) {
  if (name.includes("AXIAL FAN")) return "AXIAL_FAN";
  if (name.includes("SILENCER")) return "SILENCER";
  if (name.includes("Trouser Piece")) return "TROUSER_PIECE";
  if (name.includes("Giảm Vuông Tròn")) return "SQ_TO_ROUND";
  if (name.includes("Khớp Nối Mềm Tròn")) return "ROUND_FLEX";
  if (name.includes("Van VCD")) return "DAMPER_VCD";
  if (name.includes("Van MFD")) return "DAMPER_MFD";
  if (name.includes("Van NRD")) return "DAMPER_NRD";
  if (name.includes("SQUARE ELBOW")) return "SQUARE_ELBOW";
  if (name.includes("SQUARE REDUCER")) return "SQUARE_REDUCER";
  if (name.includes("SQUARE TAP")) return "SQUARE_TAP_SHOE";
  if (name.includes("EAG_OBD")) return "GRILLE_EAG_OBD";
  if (name.includes("ENDCAP")) return "ENDCAP";
  return "OTHER";
}

console.log("=== ALL 11 SQUARE REDUCERS ===");
for (const r of inserts.filter((i) => cat(i.name) === "SQUARE_REDUCER")) {
  const b = r.liveBbox;
  console.log(
    `${r.handle} | X=[${b.minX.toFixed(2)}, ${b.maxX.toFixed(2)}] (${b.width.toFixed(2)}) | Y=[${b.minY.toFixed(2)}, ${b.maxY.toFixed(2)}] (${b.height.toFixed(2)}) | rot=${((r.rotation * 180) / Math.PI).toFixed(1)}`
  );
}

console.log("\n=== ALL 10 SQUARE ELBOWS ===");
for (const e of inserts.filter((i) => cat(i.name) === "SQUARE_ELBOW")) {
  const b = e.liveBbox;
  console.log(
    `${e.handle} | X=[${b.minX.toFixed(2)}, ${b.maxX.toFixed(2)}] (${b.width.toFixed(2)}) | Y=[${b.minY.toFixed(2)}, ${b.maxY.toFixed(2)}] (${b.height.toFixed(2)}) | rot=${((e.rotation * 180) / Math.PI).toFixed(1)}`
  );
}

console.log("\n=== ALL DAMPERS, SILENCERS, FANS, FLEX, SQ-ROUND, ENDCAPS, TROUSER ===");
for (const e of inserts.filter((i) => !["SQUARE_REDUCER", "SQUARE_ELBOW", "SQUARE_TAP_SHOE", "GRILLE_EAG_OBD"].includes(cat(i.name)))) {
  const b = e.liveBbox;
  console.log(
    `${cat(e.name).padEnd(15)} | ${e.handle} | X=[${b.minX.toFixed(2)}, ${b.maxX.toFixed(2)}] (${b.width.toFixed(2)}) | Y=[${b.minY.toFixed(2)}, ${b.maxY.toFixed(2)}] (${b.height.toFixed(2)}) | rot=${((e.rotation * 180) / Math.PI).toFixed(1)}`
  );
}
