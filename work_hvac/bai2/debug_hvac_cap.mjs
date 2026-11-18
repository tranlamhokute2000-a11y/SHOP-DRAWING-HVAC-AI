import fs from 'node:fs';
import { callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai2/cap_prompt_debug.txt';

// Turn off original layers so pick hits ONLY M-MVAC-SEAD
const origLayers = ['MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED', 'MEPG-M-EQUIP', 'MEPG-AC-TEXT', '0'];
await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, off: true } })));
await callTool('send_command', { command: '_.OSMODE\n0\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
await callTool('zoom_to_window', { minX: 64900, minY: 16800, maxX: 66300, maxY: 17900 });
await callTool('regen_view');
await sleep(300);

// Try picking right side wall of 1D5A7 (x=66024.56, y=17300.00) with 1 input and wait 1000ms
await callTool('ui_feature_run', { id: 'hvac-cap', inputs: ['66024.56,17300.00'] });
await sleep(1000);

// Log LASTPROMPT and CMDNAMES
await callTool('send_command', {
  command: `(progn (setq f (open "${out}" "w")) (write-line (strcat "CMD=" (getvar "CMDNAMES") " | PROMPT=" (getvar "LASTPROMPT")) f) (close f) (princ))\n`,
});
await sleep(400);
console.log('DEBUG:', fs.readFileSync(out, 'utf8'));

const ents = (await callTool('get_entities_in_area', { minX: 65200, minY: 16980, maxX: 66100, maxY: 17700 })).data || [];
console.log('ENTS:', JSON.stringify(ents.filter(e => e.layer === 'M-MVAC-SEAD').map(e => ({ h: e.handle, name: e.blockName, rot: e.rotation }))));

await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, off: false } })));
await callTool('send_command', { command: '_.OSMODE\n4031\n' });
