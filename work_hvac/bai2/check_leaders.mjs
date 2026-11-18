import fs from 'node:fs';
import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const out = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai2/leader_dxf_check.txt';
const handles = ['1DFB3', '1E3EA', '1E413', '1E43C', '1E467', '1E492', '1E4BF', '1E4EA'];
const hList = handles.map(h => `"${h}"`).join(' ');
const lisp = `(progn (setq f (open "${out}" "w")) (foreach h (list ${hList}) (write-line (strcat h " => " (vl-princ-to-string (entget (handent h) (list "*")))) f)) (close f) (princ))\n`;
await callTool('send_command', { command: lisp });
await new Promise(r => setTimeout(r, 500));
console.log(fs.readFileSync(out, 'utf8'));
