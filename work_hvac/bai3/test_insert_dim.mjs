import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/import_log2.txt';
  
  // Use _.-INSERT with Esc/Cancel trick or insert and delete
  const cmd = `_.-INSERT\nC:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/bai 2.dwg\n0,0\n1\n1\n0\n_.ERASE\n_L\n\n(progn (setq f (open "${logPath}" "w")) (write-line (if (tblsearch "dimstyle" "HỒ-DIM 1-70") "FOUND_HO_DIM" "STILL_NOT_FOUND") f) (close f))\n`;
  await callTool('send_command', { command: cmd });
  await new Promise(r => setTimeout(r, 2000));
  if (fs.existsSync(logPath)) {
    console.log('Result:', fs.readFileSync(logPath, 'utf8'));
  } else {
    console.log('Log file not found');
  }
}

main().catch(console.error);
