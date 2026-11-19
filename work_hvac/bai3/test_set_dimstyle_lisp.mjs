import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/test_ds_lisp.txt';
  
  const lisp = `
  (progn
    (vl-load-com)
    (setq acadApp (vlax-get-acad-object))
    (setq doc (vla-get-activedocument acadApp))
    (vlax-for ds (vla-get-dimstyles doc)
      (if (vl-string-search "DIM 1-70" (vla-get-name ds))
        (vla-put-activedimstyle doc ds)
      )
    )
    (setq f (open "${logPath}" "w"))
    (write-line (getvar "DIMSTYLE") f)
    (close f)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 800));
  if (fs.existsSync(logPath)) {
    console.log('Active DIMSTYLE via Lisp:', fs.readFileSync(logPath, 'utf8'));
  } else {
    console.log('File not created');
  }
}

main().catch(console.error);
