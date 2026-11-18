import { callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const origLayers = ['MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED', 'MEPG-M-EQUIP', 'MEPG-AC-TEXT', '0'];

// Cancel any stuck command cleanly with Ctrl-C (^C)
await callTool('send_command', { command: '\x03\x03' });
await sleep(250);

await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, off: true } })));
await callTool('send_command', { command: '_.OSMODE\n0\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });
await callTool('zoom_to_window', { minX: 64900, minY: 16800, maxX: 66300, maxY: 17900 });
await sleep(250);

// Test 1: direct entity pick via point on right wall after clean cancel
await callTool('ui_feature_run', { id: 'hvac-cap', inputs: ['66024.56,17300.00'] });
await sleep(500);
await callTool('send_command', { command: '\x03\x03' });
await sleep(200);

const ents = (await callTool('get_entities_in_area', { minX: 65200, minY: 16980, maxX: 66100, maxY: 17700 })).data || [];
console.log('AFTER POINT PICK:', JSON.stringify(ents.filter(e => e.layer === 'M-MVAC-SEAD').map(e => ({ h: e.handle, name: e.blockName, x: e.x, y: e.y, rot: e.rotation }))));

await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, off: false } })));
await callTool('send_command', { command: '_.OSMODE\n4031\n' });
