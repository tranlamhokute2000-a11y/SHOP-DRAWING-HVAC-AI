import { callTool } from '../../.agents/skills/shopdrawing-ong-gio/scripts/hts_mcp.mjs';
import fs from 'node:fs';

async function main() {
  const logPath = 'C:/Users/Admin/Desktop/SHOPDRAWING-HVAC-AI/work_hvac/bai3/import_log.txt';
  
  // Try inserting Spec-layer or bai 2 at 0,0,0 exploded or as a temp block
  // First check if Spec-layer has it
  const lispCode = `
  (progn
    (setq dbx (vla-GetInterfaceObject (vlax-get-acad-object) (strcat "ObjectDBX.AxDbDocument." (substr (getvar "ACADVER") 1 2))))
    (vla-open dbx "C:\\\\Users\\\\Admin\\\\Desktop\\\\SHOPDRAWING-HVAC-AI\\\\bai 2.dwg")
    (setq srcStyles (vla-get-dimstyles dbx))
    (vlax-for ds srcStyles
      (if (= (strcase (vla-get-name ds)) "HỒ-DIM 1-70")
        (progn
          (setq objList (vlax-make-safearray vlax-vbObject '(0 . 0)))
          (vlax-safearray-put-element objList 0 ds)
          (vla-CopyObjects dbx objList (vla-get-dimstyles (vla-get-activedocument (vlax-get-acad-object))))
        )
      )
    )
    (vlax-release-object dbx)
    (setq f (open "${logPath}" "w"))
    (write-line (if (tblsearch "dimstyle" "HỒ-DIM 1-70") "SUCCESS" "FAILED") f)
    (close f)
  )
  `;
  await callTool('send_command', { command: `${lispCode}\n` });
  await new Promise(r => setTimeout(r, 1000));
  if (fs.existsSync(logPath)) {
    console.log('Result:', fs.readFileSync(logPath, 'utf8'));
  } else {
    console.log('Log file not found');
  }
}

main().catch(console.error);
