import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/leaders_info.txt';
  
  const lisp = `
  (progn
    (vl-load-com)
    (setq acadApp (vlax-get-acad-object))
    (setq dbx (vla-GetInterfaceObject acadApp (strcat "ObjectDBX.AxDbDocument." (substr (getvar "ACADVER") 1 2))))
    (vla-open dbx "C:\\\\Users\\\\Admin\\\\Desktop\\\\SHOPDRAWING-HVAC-AI\\\\bai 2.dwg")
    (setq f (open "${logPath}" "w"))
    (vlax-for blk (vla-get-blocks dbx)
      (if (= (vla-get-name blk) "*Model_Space")
        (vlax-for obj blk
          (if (= (vla-get-objectname obj) "AcDbLeader")
            (write-line (strcat "Handle: " (vla-get-handle obj) " Layer: " (vla-get-layer obj)) f)
          )
        )
      )
    )
    (close f)
    (vlax-release-object dbx)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 1200));
  if (fs.existsSync(logPath)) {
    console.log('Leaders in bai 2.dwg:\n', fs.readFileSync(logPath, 'utf8'));
  }
}

main().catch(console.error);
