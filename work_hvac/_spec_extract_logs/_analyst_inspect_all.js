const fs = require("fs");

const RAW_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_raw_entities.json";
const OUT_TXT = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\_analyst_dump.txt";

const raw = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));
const lines = raw.entities.filter((e) => e.type === "LINE");
const mtexts = raw.entities.filter((e) => e.type === "MTEXT");
const inserts = raw.entities.filter((e) => e.type === "INSERT");

const out = [];
out.push(`=== SUMMARY ===`);
out.push(`Disk entities: ${raw.entities.length}, Live unsaved: ${raw.live_session_sync.unsaved_live_entities.length}`);
out.push(`LINE: ${lines.length}, MTEXT: ${mtexts.length}, INSERT: ${inserts.length}`);

out.push(`\n=== ALL 34 MTEXTS ===`);
for (const m of mtexts) {
  const rotDeg = ((m.rotation * 180) / Math.PI).toFixed(1);
  out.push(
    `${m.handle} | text="${m.text}" | pos=(${m.pos[0].toFixed(2)}, ${m.pos[1].toFixed(2)}) | rot=${rotDeg}deg | h=${m.height.toFixed(1)} | lay=${m.layer}`
  );
}

out.push(`\n=== ALL 99 LINES ===`);
lines.sort((a, b) => {
  const ay = Math.min(a.start[1], a.end[1]);
  const by = Math.min(b.start[1], b.end[1]);
  return ay - by || Math.min(a.start[0], a.end[0]) - Math.min(b.start[0], b.end[0]);
});
for (const l of lines) {
  const dx = l.end[0] - l.start[0];
  const dy = l.end[1] - l.start[1];
  const len = Math.hypot(dx, dy);
  let dir = "DIAG";
  if (Math.abs(dy) < 0.5) dir = "HORIZ";
  else if (Math.abs(dx) < 0.5) dir = "VERT";
  const x1 = Math.min(l.start[0], l.end[0]);
  const x2 = Math.max(l.start[0], l.end[0]);
  const y1 = Math.min(l.start[1], l.end[1]);
  const y2 = Math.max(l.start[1], l.end[1]);
  out.push(
    `${l.handle} | ${dir.padEnd(5)} | len=${len.toFixed(2).padStart(9)} | X=[${x1.toFixed(2)}, ${x2.toFixed(2)}] | Y=[${y1.toFixed(2)}, ${y2.toFixed(2)}] | raw=(${l.start[0].toFixed(2)},${l.start[1].toFixed(2)})->(${l.end[0].toFixed(2)},${l.end[1].toFixed(2)}) | col=${l.color}`
  );
}

out.push(`\n=== ALL 95 INSERTS ===`);
inserts.sort((a, b) => {
  const ay = a.liveBbox ? a.liveBbox.minY : 0;
  const by = b.liveBbox ? b.liveBbox.minY : 0;
  return ay - by || (a.liveBbox ? a.liveBbox.minX : 0) - (b.liveBbox ? b.liveBbox.minX : 0);
});
for (const ins of inserts) {
  const bb = ins.liveBbox || {};
  const rotDeg = ((ins.rotation * 180) / Math.PI).toFixed(1);
  out.push(
    `${ins.handle} | lay=${ins.layer} | bbox=[${(bb.minX ?? 0).toFixed(2)}, ${(bb.minY ?? 0).toFixed(2)} .. ${(bb.maxX ?? 0).toFixed(2)}, ${(bb.maxY ?? 0).toFixed(2)}] (${(bb.width ?? 0).toFixed(2)} x ${(bb.height ?? 0).toFixed(2)}) | rot=${rotDeg}deg | scale=[${ins.scale.map((s) => s.toFixed(2)).join(",")}] | name="${ins.name}"`
  );
}

fs.writeFileSync(OUT_TXT, out.join("\n"), "utf8");
console.log("Wrote _analyst_dump.txt, lines:", out.length);
