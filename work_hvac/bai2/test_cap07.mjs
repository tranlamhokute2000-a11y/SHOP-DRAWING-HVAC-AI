import { callTool, batchCall } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

const origLayers = ['MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED', 'MEPG-M-EQUIP', 'MEPG-AC-TEXT', '0'];
await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, off: true } })));
await callTool('send_command', { command: '_.OSMODE\n0\n' });
await callTool('set_layer', { layerName: 'M-MVAC-SEAD' });

// Zoom right onto CAP-07 (1D5A7: X=65274.56..66024.56, Y=17035.36..17644.94)
await callTool('zoom_to_window', { minX: 64800, minY: 16800, maxX: 66400, maxY: 18000 });
await new Promise(r => setTimeout(r, 150));

// Pick directly on the bottom flange edge of 1D5A7: (65649.56, 17035.36)
const res = await callTool('ui_feature_run', { id: 'hvac-cap', inputs: ['65649.56,17035.36', ''] });
console.log('HVAC-CAP RES:', JSON.stringify(res));
await new Promise(r => setTimeout(r, 200));

const ents = (await callTool('get_entities_in_area', { minX: 65200, minY: 16980, maxX: 66100, maxY: 17700 })).data || [];
console.log('ENTS AFTER:', JSON.stringify(ents.filter(e => e.layer === 'M-MVAC-SEAD').map(e => ({ h: e.handle, name: e.blockName, x: e.x, y: e.y, rot: e.rotation }))));

// Restore original layers ON immediately
await batchCall(origLayers.map(layerName => ({ tool: 'set_layer_state', args: { layerName, off: false } })));
await callTool('send_command', { command: '_.OSMODE\n4031\n' });
