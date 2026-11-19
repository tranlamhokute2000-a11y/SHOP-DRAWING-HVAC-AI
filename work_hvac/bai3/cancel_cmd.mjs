import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  // Send Esc Esc Esc to clear command line
  await callTool('send_command', { command: '\x1B\x1B\x1B' });
  const cur = (await callTool('get_current_settings')).data;
  console.log('Settings:', cur);
}

main().catch(console.error);
