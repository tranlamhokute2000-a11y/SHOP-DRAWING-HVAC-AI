import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';

async function main() {
  const textRes = await callTool('extract_all_text', {});
  const items = textRes.data?.items || [];
  console.log(`Total text items: ${items.length}`);
  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    console.log(`${String(i+1).padStart(2)}. [${t.layer}] (${t.x.toFixed(0)}, ${t.y.toFixed(0)}) : ${JSON.stringify(t.content)}`);
  }
}

main().catch(console.error);
