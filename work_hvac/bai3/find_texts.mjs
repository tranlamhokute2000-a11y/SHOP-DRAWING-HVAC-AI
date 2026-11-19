import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  const res = await callTool('extract_all_text', {});
  const items = res.data?.items || [];
  for (const t of items) {
    if (t.content.includes('BOD') || t.content.includes('SED') || t.content.includes('EAD')) {
      console.log(`[${t.x.toFixed(0)}, ${t.y.toFixed(0)}] : ${t.content}`);
    }
  }
}

main().catch(console.error);
