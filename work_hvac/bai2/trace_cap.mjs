import fs from 'node:fs';
import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai2/cap_trace.txt';

// Clear command line
await callTool('send_command', { command: '\x03\x03' });
await sleep(200);

// Zoom tight & call _HG2M8Q7X with (handent "1D5A7") via send_command, then inspect LASTPROMPT!
await callTool('zoom_to_window', { minX: 64900, minY: 16800, maxX: 66300, maxY: 17900 });
await sleep(200);
await callTool('send_command', { command: '_HG2M8Q7X\n(handent "1D5A7")\n' });
await sleep(500);
await callTool('send_command', {
  command: `(progn (setq f (open "${out}" "w")) (write-line (strcat "AFTER_HANDENT: CMD=" (getvar "CMDNAMES") " | PROMPT=" (getvar "LASTPROMPT")) f) (close f) (princ))\n`,
});
await sleep(300);
console.log(fs.readFileSync(out, 'utf8'));

// Cancel cleanly
await callTool('send_command', { command: '\x03\x03' });
await sleep(200);
const ents = (await callTool('get_entities_in_area', { minX: 65200, minY: 16980, maxX: 66100, maxY: 17700 })).data || [];
console.log('ENTS:', JSON.stringify(ents.filter(e => e.layer === 'M-MVAC-SEAD').map(e => ({ h: e.handle, name: e.blockName, rot: e.rotation }))));
