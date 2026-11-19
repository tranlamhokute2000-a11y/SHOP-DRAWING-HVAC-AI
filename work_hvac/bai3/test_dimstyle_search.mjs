import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  const r = await callTool('send_command', {
    command: '(if (tblsearch "dimstyle" "HỒ-DIM 1-70") (setvar "USERR1" 1.0) (setvar "USERR1" 0.0))\n'
  });
  const res = await callTool('send_command', { command: '(getvar "USERR1")\n' });
  console.log('Result:', res);
}

main().catch(console.error);
