import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/all_dimstyles.txt';
  
  // Dump all dimstyles currently in AutoCAD
  const lisp = `
  (progn
    (setq f (open "${logPath}" "w"))
    (setq ds (tblnext "dimstyle" T))
    (while ds
      (write-line (cdr (assoc 2 ds)) f)
      (setq ds (tblnext "dimstyle"))
    )
    (close f)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 600));
  if (fs.existsSync(logPath)) {
    console.log('DimStyles currently loaded:\n', fs.readFileSync(logPath, 'utf8'));
  }
}

main().catch(console.error);
