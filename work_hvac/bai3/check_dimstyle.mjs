import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  const r = await callTool('send_command', { command: '_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n' });
  console.log('Restore HỒ-DIM 1-70:', r);
  const cur = await callTool('send_command', { command: '(princ (getvar "DIMSTYLE"))\n' });
  console.log('Current dimstyle:', cur);
}

main().catch(console.error);
