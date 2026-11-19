import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/bai2_dimstyles.txt';
  
  const lisp = `
  (progn
    (vl-load-com)
    (setq dbx (vla-GetInterfaceObject (vlax-get-acad-object) (strcat "ObjectDBX.AxDbDocument." (substr (getvar "ACADVER") 1 2))))
    (vla-open dbx "C:\\\\Users\\\\Admin\\\\Desktop\\\\SHOPDRAWING-HVAC-AI\\\\bai 2.dwg")
    (setq f (open "${logPath}" "w"))
    (vlax-for ds (vla-get-dimstyles dbx)
      (write-line (vla-get-name ds) f)
    )
    (close f)
    (vlax-release-object dbx)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 1000));
  if (fs.existsSync(logPath)) {
    console.log('DimStyles in bai 2.dwg:\n', fs.readFileSync(logPath, 'utf8'));
  } else {
    console.log('File not created');
  }
}

main().catch(console.error);
