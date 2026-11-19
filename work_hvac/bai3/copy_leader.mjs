import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/copy_leader_log.txt';
  
  const lisp = `
  (progn
    (vl-load-com)
    (setq acadApp (vlax-get-acad-object))
    (setq doc (vla-get-activedocument acadApp))
    (setq dbx (vla-GetInterfaceObject acadApp (strcat "ObjectDBX.AxDbDocument." (substr (getvar "ACADVER") 1 2))))
    (vla-open dbx "C:\\\\Users\\\\Admin\\\\Desktop\\\\SHOPDRAWING-HVAC-AI\\\\bai 2.dwg")
    
    (setq toCopy (vlax-make-safearray vlax-vbObject '(0 . 0)))
    (setq srcLdr (vla-handletoobject dbx "1DFB3"))
    (vlax-safearray-put-element toCopy 0 srcLdr)
    (setq copied (vla-CopyObjects dbx toCopy (vla-get-modelspace doc)))
    (setq newObj (vlax-safearray-get-element (vlax-variant-value copied) 0))
    (setq newH (vla-get-handle newObj))
    (vlax-release-object dbx)
    (setq f (open "${logPath}" "w"))
    (write-line newH f)
    (close f)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 1200));
  if (fs.existsSync(logPath)) {
    console.log('Copied prototype leader handle in bai 3.dwg:\n', fs.readFileSync(logPath, 'utf8'));
  }
}

main().catch(console.error);
