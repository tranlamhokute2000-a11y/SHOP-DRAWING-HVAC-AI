(vl-load-com)

(defun safe-str (v)
  (cond
    ((null v) "")
    ((= (type v) 'STR) v)
    ((= (type v) 'INT) (itoa v))
    ((= (type v) 'REAL) (rtos v 2 3))
    ((= (type v) 'SYM) (vl-symbol-name v))
    (T (vl-princ-to-string v))
  )
)

(defun pt-str (pt)
  (if (and pt (listp pt))
    (strcat "(" (rtos (car pt) 2 2) ", " (rtos (cadr pt) 2 2)
            (if (and (caddr pt) (numberp (caddr pt))) (strcat ", " (rtos (caddr pt) 2 2)) "") ")")
    ""
  )
)

(defun truecolor-int->rgb (tc / r g b)
  (if (and tc (numberp tc))
    (progn
      (setq r (lsh (logand tc 16711680) -16)
            g (lsh (logand tc 65280) -8)
            b (logand tc 255))
      (strcat "RGB(" (itoa r) "," (itoa g) "," (itoa b) ")")
    )
    ""
  )
)

(defun dxf-val (code alist)
  (cdr (assoc code alist))
)

(defun dxf-all (code alist / res item)
  (setq res '())
  (foreach item alist
    (if (= (car item) code)
      (setq res (append res (list (cdr item))))
    )
  )
  res
)

(defun join-strs (lst sep / res s)
  (setq res "")
  (foreach s lst
    (setq res (if (= res "") (safe-str s) (strcat res sep (safe-str s))))
  )
  res
)

(defun out-line (fp s)
  (if fp (write-line s fp))
  (princ (strcat s "\n"))
)

(defun dump-dxf-entity (fp e prefix / dxf etype hnd lay space col tc lt lw vobj effname bbox minp maxp err extra pts p3s p1s p302s p304s props prop val r c rows cols cell)
  (setq dxf   (entget e '("*"))
        etype (safe-str (dxf-val 0 dxf))
        hnd   (safe-str (dxf-val 5 dxf))
        lay   (safe-str (dxf-val 8 dxf))
        space (safe-str (dxf-val 410 dxf))
        col   (dxf-val 62 dxf)
        tc    (dxf-val 420 dxf)
        lt    (dxf-val 6 dxf)
        lw    (dxf-val 370 dxf)
        extra ""
        bbox  ""
  )
  (if (null col) (setq col "ByLayer") (setq col (itoa col)))
  (if (null lt)  (setq lt "ByLayer"))
  (if (null lw)  (setq lw "ByLayer") (setq lw (itoa lw)))

  (setq vobj (vl-catch-all-apply 'vlax-ename->vla-object (list e)))
  (if (or (vl-catch-all-error-p vobj) (null vobj))
    (setq vobj nil)
  )

  (if vobj
    (progn
      (setq err (vl-catch-all-apply 'vla-GetBoundingBox (list vobj 'minp 'maxp)))
      (if (and (not (vl-catch-all-error-p err)) minp maxp)
        (setq bbox (strcat "BBox[" (pt-str (vlax-safearray->list minp)) " -> " (pt-str (vlax-safearray->list maxp)) "]"))
      )
    )
  )

  (cond
    ((or (= etype "TEXT") (= etype "ATTRIB") (= etype "ATTDEF"))
     (setq extra (strcat "Pos=" (pt-str (dxf-val 10 dxf))
                         " AlignPos=" (pt-str (dxf-val 11 dxf))
                         " H=" (safe-str (dxf-val 40 dxf))
                         " RotRad=" (safe-str (dxf-val 50 dxf))
                         " Style=\"" (safe-str (dxf-val 7 dxf)) "\""
                         (if (or (= etype "ATTRIB") (= etype "ATTDEF"))
                           (strcat " Tag=\"" (safe-str (dxf-val 2 dxf)) "\"")
                           "")
                         " Text=\"" (safe-str (dxf-val 1 dxf)) "\""))
    )
    ((= etype "MTEXT")
     (setq p3s (join-strs (dxf-all 3 dxf) "")
           p1s (safe-str (dxf-val 1 dxf))
           extra (strcat "Pos=" (pt-str (dxf-val 10 dxf))
                         " H=" (safe-str (dxf-val 40 dxf))
                         " Width=" (safe-str (dxf-val 41 dxf))
                         " Style=\"" (safe-str (dxf-val 7 dxf)) "\""
                         " Text=\"" p3s p1s "\""))
    )
    ((= etype "MULTILEADER")
     (setq p304s (join-strs (dxf-all 304 dxf) " | ")
           pts   (join-strs (mapcar 'pt-str (dxf-all 10 dxf)) " ")
           extra (strcat "MLeaderText=\"" p304s "\" Pts=[" pts "]"))
    )
    ((= etype "LEADER")
     (setq pts   (join-strs (mapcar 'pt-str (dxf-all 10 dxf)) " ")
           extra (strcat "LeaderPts=[" pts "]"))
    )
    ((= etype "ACAD_TABLE")
     (setq p1s   (join-strs (dxf-all 1 dxf) " | ")
           p302s (join-strs (dxf-all 302 dxf) " | ")
           extra (strcat "Pos=" (pt-str (dxf-val 10 dxf))
                         " Rows=" (safe-str (dxf-val 91 dxf))
                         " Cols=" (safe-str (dxf-val 92 dxf))
                         " DXF1=[" p1s "] DXF302=[" p302s "]"))
    )
    ((= etype "INSERT")
     (setq effname (safe-str (dxf-val 2 dxf)))
     (if vobj
       (progn
         (setq err (vl-catch-all-apply 'vla-get-EffectiveName (list vobj)))
         (if (and (not (vl-catch-all-error-p err)) err)
           (setq effname (safe-str err))
         )
       )
     )
     (setq extra (strcat "Block=\"" (safe-str (dxf-val 2 dxf)) "\""
                         " EffName=\"" effname "\""
                         " Ins=" (pt-str (dxf-val 10 dxf))
                         " Scale=(" (safe-str (dxf-val 41 dxf)) "," (safe-str (dxf-val 42 dxf)) "," (safe-str (dxf-val 43 dxf)) ")"
                         " RotRad=" (safe-str (dxf-val 50 dxf))))
    )
    ((= etype "LINE")
     (setq extra (strcat "Start=" (pt-str (dxf-val 10 dxf))
                         " End=" (pt-str (dxf-val 11 dxf))))
    )
    ((= etype "LWPOLYLINE")
     (setq pts "")
     (foreach item dxf
       (cond
         ((= (car item) 10) (setq pts (strcat pts " V" (pt-str (cdr item)))))
         ((and (= (car item) 42) (/= (cdr item) 0.0)) (setq pts (strcat pts "{b=" (rtos (cdr item) 2 3) "}")))
       )
     )
     (setq extra (strcat "Flags=" (safe-str (dxf-val 70 dxf))
                         " ConstWidth=" (safe-str (dxf-val 43 dxf))
                         " Verts=[" pts "]"))
    )
    ((= etype "CIRCLE")
     (setq extra (strcat "Center=" (pt-str (dxf-val 10 dxf))
                         " R=" (safe-str (dxf-val 40 dxf))))
    )
    ((= etype "ARC")
     (setq extra (strcat "Center=" (pt-str (dxf-val 10 dxf))
                         " R=" (safe-str (dxf-val 40 dxf))
                         " A1=" (safe-str (dxf-val 50 dxf))
                         " A2=" (safe-str (dxf-val 51 dxf))))
    )
    ((= etype "HATCH")
     (setq extra (strcat "Pattern=\"" (safe-str (dxf-val 2 dxf)) "\""
                         " Solid=" (safe-str (dxf-val 70 dxf))))
    )
    ((= etype "MLINE")
     (setq pts (join-strs (mapcar 'pt-str (dxf-all 11 dxf)) " ")
           extra (strcat "Style=\"" (safe-str (dxf-val 2 dxf)) "\""
                         " Scale=" (safe-str (dxf-val 40 dxf))
                         " Verts=[" pts "]"))
    )
    ((= etype "DIMENSION")
     (setq extra (strcat "DimText=\"" (safe-str (dxf-val 1 dxf)) "\""
                         " Meas=" (safe-str (dxf-val 42 dxf))
                         " DefPt=" (pt-str (dxf-val 10 dxf))
                         " P13=" (pt-str (dxf-val 13 dxf))
                         " P14=" (pt-str (dxf-val 14 dxf))))
    )
    (T
     (setq extra (strcat "P10=" (pt-str (dxf-val 10 dxf)) " DXF1=\"" (safe-str (dxf-val 1 dxf)) "\""))
    )
  )

  (out-line fp (strcat prefix "[" hnd "] " etype
                       (if (/= space "") (strcat " (" space ")") "")
                       " | Layer=\"" lay "\""
                       " | ACI=" col
                       (if tc (strcat " " (truecolor-int->rgb tc)) "")
                       " | LT=\"" lt "\" | LW=" lw
                       (if (/= bbox "") (strcat " | " bbox) "")
                       " | " extra))

  ;; Dynamic block properties via VLA if available
  (if (and (= etype "INSERT") vobj)
    (if (= (vl-catch-all-apply 'vla-get-IsDynamicBlock (list vobj)) :vlax-true)
      (progn
        (setq props (vl-catch-all-apply 'vlax-invoke (list vobj 'GetDynamicBlockProperties)))
        (if (and (not (vl-catch-all-error-p props)) (listp props))
          (foreach prop props
            (setq val (vl-catch-all-apply 'vlax-get (list prop 'Value)))
            (if (not (vl-catch-all-error-p val))
              (out-line fp (strcat prefix "   DYNPROP \"" (safe-str (vl-catch-all-apply 'vla-get-PropertyName (list prop)))
                                   "\" = \"" (safe-str val) "\""))
            )
          )
        )
      )
    )
  )

  ;; Table structured cells via VLA if available
  (if (and (= etype "ACAD_TABLE") vobj)
    (progn
      (setq rows (vl-catch-all-apply 'vla-get-Rows (list vobj))
            cols (vl-catch-all-apply 'vla-get-Columns (list vobj)))
      (if (and (numberp rows) (numberp cols))
        (progn
          (setq r 0)
          (while (< r rows)
            (setq c 0 cell "")
            (while (< c cols)
              (setq cell (strcat cell (if (> c 0) " || " "")
                                 "[" (itoa r) "," (itoa c) "]: "
                                 (safe-str (vl-catch-all-apply 'vla-GetText (list vobj r c)))))
              (setq c (1+ c))
            )
            (out-line fp (strcat prefix "   ROW " (itoa r) ": " cell))
            (setq r (1+ r))
          )
        )
      )
    )
  )
)

(defun c:EXTSPEC (/ fp outpath tbl lname lobj ldxf vlay desc bname bflags sub e)
  (setq outpath "C:/Users/Nguye/Desktop/SHOP DRAWING-AI/work_hvac/spec_extracted.txt")
  (setq fp (vl-catch-all-apply 'open (list outpath "w" "utf8")))
  (if (or (vl-catch-all-error-p fp) (null fp))
    (setq fp (open outpath "w"))
  )

  (out-line fp "==========================================")
  (out-line fp "1. DRAWING HEADER VARIABLES")
  (out-line fp "==========================================")
  (out-line fp (strcat "INSUNITS = " (safe-str (getvar "INSUNITS"))))
  (out-line fp (strcat "MEASUREMENT = " (safe-str (getvar "MEASUREMENT"))))
  (out-line fp (strcat "CLAYER = " (safe-str (getvar "CLAYER"))))
  (out-line fp (strcat "EXTMIN = " (pt-str (getvar "EXTMIN"))))
  (out-line fp (strcat "EXTMAX = " (pt-str (getvar "EXTMAX"))))
  (out-line fp (strcat "LTSCALE = " (safe-str (getvar "LTSCALE"))))

  (out-line fp "")
  (out-line fp "==========================================")
  (out-line fp "2. LAYER TABLE (100%)")
  (out-line fp "==========================================")
  (setq tbl (tblnext "LAYER" T))
  (while tbl
    (setq lname (dxf-val 2 tbl)
          lobj  (tblobjname "LAYER" lname)
          ldxf  (if lobj (entget lobj '("*")) tbl)
          desc  ""
    )
    (if lobj
      (progn
        (setq vlay (vl-catch-all-apply 'vlax-ename->vla-object (list lobj)))
        (if (and vlay (not (vl-catch-all-error-p vlay)))
          (progn
            (setq desc (vl-catch-all-apply 'vla-get-Description (list vlay)))
            (if (vl-catch-all-error-p desc) (setq desc ""))
          )
        )
      )
    )
    (out-line fp
      (strcat "LAYER: \"" (safe-str lname) "\""
              " | ACI=" (safe-str (dxf-val 62 ldxf))
              (if (dxf-val 420 ldxf) (strcat " | " (truecolor-int->rgb (dxf-val 420 ldxf))) "")
              " | Linetype=\"" (safe-str (dxf-val 6 ldxf)) "\""
              " | Lineweight=" (safe-str (dxf-val 370 ldxf))
              " | Plot=" (safe-str (dxf-val 290 ldxf))
              " | Flags=" (safe-str (dxf-val 70 ldxf))
              " | Desc=\"" (safe-str desc) "\""))
    (setq tbl (tblnext "LAYER"))
  )

  (out-line fp "")
  (out-line fp "==========================================")
  (out-line fp "3. BLOCK DEFINITIONS")
  (out-line fp "==========================================")
  (setq tbl (tblnext "BLOCK" T))
  (while tbl
    (setq bname  (safe-str (dxf-val 2 tbl))
          bflags (dxf-val 70 tbl)
          sub    (dxf-val -2 tbl))
    (if (not (wcmatch (strcase bname) "*MODEL_SPACE*,*PAPER_SPACE*"))
      (progn
        (out-line fp (strcat "BLOCK_DEF: \"" bname "\" | Flags=" (safe-str bflags) " | BasePt=" (pt-str (dxf-val 10 tbl))))
        (while sub
          (dump-dxf-entity fp sub "  [BLK_ENT] ")
          (setq sub (entnext sub))
        )
      )
    )
    (setq tbl (tblnext "BLOCK"))
  )

  (out-line fp "")
  (out-line fp "==========================================")
  (out-line fp "4. ALL DRAWING ENTITIES (MODEL & LAYOUTS)")
  (out-line fp "==========================================")
  (setq e (entnext))
  (while e
    (dump-dxf-entity fp e "  ")
    (setq e (entnext e))
  )

  (if fp (close fp))
  (princ "\n=== EXTSPEC COMPLETED ===\n")
  (princ)
)
