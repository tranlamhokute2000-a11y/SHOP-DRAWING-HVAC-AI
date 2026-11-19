import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/dim_check.txt';
  await callTool('send_command', {
    command: `(progn (setq f (open "${logPath}" "w")) (write-line (if (tblsearch "dimstyle" "HỒ-DIM 1-70") "EXISTS" "NOT_FOUND") f) (close f))\n`
  });
  await new Promise(r => setTimeout(r, 500));
  if (fs.existsSync(logPath)) {
    console.log('File content:', fs.readFileSync(logPath, 'utf8'));
  } else {
    console.log('File not created yet');
  }
}

main().catch(console.error);
