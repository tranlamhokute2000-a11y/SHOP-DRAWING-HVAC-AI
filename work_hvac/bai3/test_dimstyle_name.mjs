import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/test_ds_restore.txt';
  
  // Test 1: Restore with "HỒ-DIM 1-70"
  await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  // Test 2: Check active dimstyle name
  const lisp = `
  (progn
    (setq f (open "${logPath}" "w"))
    (write-line (getvar "DIMSTYLE") f)
    (close f)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 600));
  if (fs.existsSync(logPath)) {
    console.log('Active DIMSTYLE after restoring "HỒ-DIM 1-70":', fs.readFileSync(logPath, 'utf8'));
  }
}

main().catch(console.error);
