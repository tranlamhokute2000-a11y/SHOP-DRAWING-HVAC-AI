(defun dxf-val (code alist) (cdr (assoc code alist)))

(defun dump-eval-graph (bname / btbl bobj bdxf dict edxf ditem gitem sub sdxf sname)
  (setq btbl (tblsearch "BLOCK" bname))
  (if btbl
    (progn
      (setq sub (dxf-val -2 btbl))
      (while sub
        (setq sdxf (entget sub))
        (if (= (dxf-val 0 sdxf) "ATTDEF")
          (princ (strcat "  ATTDEF: Tag=\"" (vl-princ-to-string (dxf-val 2 sdxf))
                         "\" Default=\"" (vl-princ-to-string (dxf-val 1 sdxf))
                         "\" Prompt=\"" (vl-princ-to-string (dxf-val 3 sdxf)) "\"\n"))
        )
        (setq sub (entnext sub))
      )
      (setq bobj (tblobjname "BLOCK" bname))
      (if bobj
        (progn
          (setq bdxf (entget (dxf-val 330 (entget bobj))))
          (foreach item bdxf
            (if (= (car item) 360)
              (progn
                (setq dict (entget (cdr item)))
                (foreach ditem dict
                  (if (or (= (car ditem) 350) (= (car ditem) 360))
                    (progn
                      (setq edxf (entget (cdr ditem)))
                      (if (= (dxf-val 0 edxf) "ACAD_EVALUATION_GRAPH")
                        (foreach gitem edxf
                          (if (= (car gitem) 360)
                            (progn
                              (setq sdxf (entget (cdr gitem)))
                              (setq sname (dxf-val 0 sdxf))
                              (if (wcmatch sname "*PARAMETER*,*VISIBILITY*")
                                (progn
                                  (princ (strcat "  DYN_NODE (" sname "): "))
                                  (foreach p sdxf
                                    (if (member (car p) '(305 301 302 140 303))
                                      (princ (strcat "[" (itoa (car p)) "]=" (vl-princ-to-string (cdr p)) " "))
                                    )
                                  )
                                  (princ "\n")
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
)

(defun c:INSPBLK (/ files bname f ins idxf rpline rcloud)
  (setq files (list
    "HTS_Van gio vuong VCD"
    "HTS_Van gio tron VCD"
    "HTS_Van chan lua FD"
    "HTS_Van chan lua dieu khien bang motor MFD"
    "HTS_Van gio vuong dieu chinh gio bang motor MD"
    "HTS_Van gio tron dieu chinh gio bang motor MD"
    "HTS_Van gio mot chieu RND"
    "HTS_Khop noi mem vuong"
    "HTS_Khop noi mem tron"
    "HTS_Mieng gio khuyech tan 4 huong"
    "HTS_Mieng gio khuyech tan tron"
    "HTS_Mieng gio louver"
    "HTS_Mieng gio nan don"
    "HTS_Mieng gio sot trung"
    "HTS-BOCHIAGA"
  ))
  (setvar "ATTDIA" 0)
  (setvar "ATTREQ" 0)
  (setvar "CMDECHO" 1)
  (foreach bname files
    (setq f (strcat (getenv "APPDATA") "/Autodesk/ApplicationPlugins/Htools.bundle/Contents/Windows/Library/HVAC/Phụ kiện/" bname ".dwg"))
    (if (findfile f)
      (progn
        (command "_.-INSERT" f "_S" 1.0 "_R" 0.0 '(0.0 0.0 0.0))
        (while (> (getvar "CMDACTIVE") 0) (command ""))
        (setq ins (entlast))
        (setq idxf (entget ins))
        (princ (strcat "\n=== BLOCK: \"" bname "\" ===\n"))
        (dump-eval-graph bname)
      )
    )
  )
  (princ "\n=== TEST 1: REVCLOUD FROM RECTANG ===\n")
  (command "_RECTANG" '(0.0 0.0) '(2000.0 1000.0))
  (setq rpline (entlast))
  (command "_.REVCLOUD" "_A" 300 300 "_O" rpline "_N")
  (while (> (getvar "CMDACTIVE") 0) (command ""))
  (setq rcloud (entlast))
  (princ (strcat "REVCLOUD_CMDACTIVE=" (itoa (getvar "CMDACTIVE")) " DXF=" (vl-princ-to-string (entget rcloud)) "\n"))
  (princ "\n=== INSPBLK3 DONE ===\n")
  (princ)
)
