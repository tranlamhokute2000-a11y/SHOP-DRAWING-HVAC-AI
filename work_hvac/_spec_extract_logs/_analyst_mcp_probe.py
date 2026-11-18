import json
import os
import urllib.request

BASE = "http://localhost:5088/mcp"
OUT_DIR = r"C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac"
os.makedirs(OUT_DIR, exist_ok=True)

def call_tool(name, arguments=None):
    if arguments is None:
        arguments = {}
    url = f"{BASE}/tools/call"
    payload = json.dumps({"name": name, "arguments": arguments}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 401:
            tok_resp = urllib.request.urlopen(f"{BASE}/auth/token", timeout=10)
            tok = json.loads(tok_resp.read().decode("utf-8")).get("token")
            req2 = urllib.request.Request(
                url,
                data=payload,
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {tok}"},
                method="POST",
            )
            with urllib.request.urlopen(req2, timeout=60) as resp2:
                return json.loads(resp2.read().decode("utf-8"))
        raise

results = {}
for tname, targs in [
    ("get_drawing_info", {}),
    ("get_layer_list", {}),
    ("group_summary_by_layer", {}),
    ("list_block_definitions", {"includeUnused": False}),
    ("extract_all_text", {}),
    ("export_plan_image", {
        "outDir": OUT_DIR,
        "fileName": "plan_overview",
        "format": "png",
        "grid": True,
        "widthPx": 2000
    }),
]:
    print(f"Calling {tname}...")
    res = call_tool(tname, targs)
    results[tname] = res
    with open(os.path.join(OUT_DIR, f"_mcp_{tname}.json"), "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    print(f"  -> success={res.get('success')}")

print("Done MCP probe.")
