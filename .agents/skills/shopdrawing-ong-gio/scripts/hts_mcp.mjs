// Shared zero-dependency HTTP JSON-RPC client for HTS AutoCAD MCP Server (port 5088)
// Works on Node.js 18+ (built-in fetch).

export const DEFAULT_MCP_BASE = process.env.HTS_MCP_URL || 'http://localhost:5088/mcp';

let cachedToken = null;

export async function checkHealth(baseUrl = DEFAULT_MCP_BASE) {
  const res = await fetch(`${baseUrl}/health`);
  if (!res.ok) {
    throw new Error(`HTS MCP health check failed: HTTP ${res.status}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { status: text.trim() };
  }
}

async function fetchAuthToken(baseUrl) {
  const res = await fetch(`${baseUrl}/auth/token`);
  if (!res.ok) {
    throw new Error(`Failed to fetch HTS MCP auth token: HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedToken = data.token || null;
  return cachedToken;
}

export async function callTool(name, args = {}, { baseUrl = DEFAULT_MCP_BASE, timeoutMs = 60000 } = {}) {
  const doRequest = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (cachedToken) headers.Authorization = `Bearer ${cachedToken}`;
      return await fetch(`${baseUrl}/tools/call`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, arguments: args }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };

  let res = await doRequest();
  if (res.status === 401) {
    await fetchAuthToken(baseUrl);
    res = await doRequest();
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`MCP tool '${name}' failed: HTTP ${res.status} ${body.slice(0, 200)}`);
  }
  return res.json();
}

export async function batchCall(steps, { chunkSize = 55, baseUrl = DEFAULT_MCP_BASE } = {}) {
  const allResults = [];
  for (let i = 0; i < steps.length; i += chunkSize) {
    const chunk = steps.slice(i, i + chunkSize);
    const res = await callTool('batch_process', { buoc: chunk }, { baseUrl, timeoutMs: 120000 });
    if (!res.success || !res.data || !Array.isArray(res.data.ketQua)) {
      throw new Error(`batch_process chunk [${i}..${i + chunk.length}] failed: ${res.content || 'unknown error'}`);
    }
    allResults.push(...res.data.ketQua);
  }
  return allResults;
}

export function isShopDuctLayer(layerName) {
  if (!layerName || !layerName.startsWith('M-MVAC-')) return false;
  const nonDuct = new Set([
    'M-MVAC-Equipment',
    'M-MVAC-Support',
    'M-MVAC-DIM',
    'M-MVAC-TEXT',
    'M-MVAC-Copper Pipe',
    'M-MVAC-AC Drain',
  ]);
  return !nonDuct.has(layerName);
}

export const SPEC_LAYERS = {
  EAD:  { layerName: 'M-MVAC-EAD',  color: 80,  lineweight: 20, desc: 'EXHAUST AIR DUCT / Duong ong gio thai' },
  FAD:  { layerName: 'M-MVAC-FAD',  color: 150, lineweight: 20, desc: 'FRESH AIR DUCT / Duong ong gio tuoi' },
  PAD:  { layerName: 'M-MVAC-PAD',  color: 210, lineweight: 20, desc: 'PRESSURIZATION AIR DUCT / Ong gio tao ap' },
  CEAD: { layerName: 'M-MVAC-CEAD', color: 170, lineweight: 20, desc: 'CAR EXHAUST AIR DUCT / Ong gio thai nha xe' },
  CSAD: { layerName: 'M-MVAC-CSAD', color: 11,  lineweight: 20, desc: 'CAR SUPPLY AIR DUCT / Ong gio cap nha xe' },
  SEAD: { layerName: 'M-MVAC-SEAD', color: 190, lineweight: 20, desc: 'SMOKE EXHAUST AIR DUCT / Duong ong hut khoi' },
  SED:  { layerName: 'M-MVAC-SEAD', color: 190, lineweight: 20, desc: 'SMOKE EXHAUST AIR DUCT (alias SED -> SEAD)' },
};
