import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/copy_dimstyle_log.txt';
  
  const lisp = `
  (progn
    (vl-load-com)
    (setq acadApp (vlax-get-acad-object))
    (setq doc (vla-get-activedocument acadApp))
    (setq dbx (vla-GetInterfaceObject acadApp (strcat "ObjectDBX.AxDbDocument." (substr (getvar "ACADVER") 1 2))))
    (vla-open dbx "C:\\\\Users\\\\Admin\\\\Desktop\\\\SHOPDRAWING-HVAC-AI\\\\bai 2.dwg")
    
    (setq toCopy (vlax-make-safearray vlax-vbObject '(0 . 0)))
    (vlax-for ds (vla-get-dimstyles dbx)
      (if (vl-string-search "DIM 1-70" (vla-get-name ds))
        (progn
          (vlax-safearray-put-element toCopy 0 ds)
          (vla-CopyObjects dbx toCopy (vla-get-dimstyles doc))
        )
      )
    )
    (vlax-release-object dbx)
    (setq f (open "${logPath}" "w"))
    (setq ds (tblnext "dimstyle" T))
    (while ds
      (write-line (cdr (assoc 2 ds)) f)
      (setq ds (tblnext "dimstyle"))
    )
    (close f)
  )
  `;
  await callTool('send_command', { command: `${lisp}\n` });
  await new Promise(r => setTimeout(r, 1200));
  if (fs.existsSync(logPath)) {
    console.log('DimStyles in bai 3.dwg after copy:\n', fs.readFileSync(logPath, 'utf8'));
  } else {
    console.log('File not created');
  }
}

main().catch(console.error);
