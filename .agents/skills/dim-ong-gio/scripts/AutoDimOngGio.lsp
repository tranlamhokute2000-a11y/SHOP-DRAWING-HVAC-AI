;;; ==========================================================================
;;; AUTO LISP: TU DONG DIM ONG GIO THEO BLOCK (HVAC DUCT AUTO DIMENSION)
;;; Lenh tat (Command):
;;;   - DOG  : Quet chon & Tu dong Dim ong gio (chi nhan HTS-OG* va HTS-CAP*)
;;;            + Ho tro Dao chieu Dim & Cap nhat khoang cach Dim den khi OK
;;;   - UDOG : Mo bang Dieu chinh nhanh (Dao chieu Dim / Doi khoang cach Dim)
;;; Quy trinh:
;;;   1. Quet chon cac doi tuong tren ban ve (chi loc HTS-OG* va HTS-CAP*)
;;;   2. Hop thoai DCL hien thi danh sach Block ong gio -> Tich chon Block
;;;   3. Nhap khoang cach tu Text Dim (duong Dim) den doi tuong
;;;   4. Tu dong tim tuyen ong GAN NHAT voi man hinh Zoom / con tro chuot
;;;      -> Pick chon huong dat Dim (co nut DaoChieu ngay neu pick nham phia)
;;;   5. Hop thoai Dieu Chinh Nhanh: Co nut [DAO CHIEU DIM], [CAP NHAT KHOANG
;;;      CACH], [PICK TUYEN ONG KHAC] cho den khi nguoi dung bam [OK]!
;;;   * Su dung 100% DimStyle va Layer hien hanh.
;;;   * Ong thang dung DIMLINEAR, ong cheo dung DIMALIGNED.
;;; ==========================================================================

(vl-load-com)

;; Bien toan cuc luu lich su cac tuyen ong da Dim
(if (not *DGO:SavedRuns*) (setq *DGO:SavedRuns* '()))

;; --------------------------------------------------------------------------
;; 1. Lay ten that cua Block (Ho tro ca Dynamic Block *U...)
;;    va kiem tra Block co phai la Ong Gio (HTS-OG* hoac HTS-CAP*) khong
;; --------------------------------------------------------------------------
(defun DGO:GetBlockName (vlaObj / name)
  (if (vlax-property-available-p vlaObj 'EffectiveName)
    (setq name (vla-get-EffectiveName vlaObj))
    (setq name (vla-get-Name vlaObj))
  )
  name
)

(defun DGO:IsDuctBlock (bName / uName)
  (if bName
    (progn
      (setq uName (strcase (vl-string-trim " " bName)))
      (or (wcmatch uName "HTS-OG*")
          (wcmatch uName "HTS-COG*")
          (wcmatch uName "HTS-CAP*")
      )
    )
    nil
  )
)

;; --------------------------------------------------------------------------
;; 2. Ham xoay 1 diem 2D quanh diem goc basePt voi goc ang (radian)
;; --------------------------------------------------------------------------
(defun DGO:RotatePoint2D (pt basePt ang / dx dy c s)
  (setq dx (- (car pt) (car basePt))
        dy (- (cadr pt) (cadr basePt))
        c  (cos ang)
        s  (sin ang)
  )
  (list
    (+ (car basePt) (- (* dx c) (* dy s)))
    (+ (cadr basePt) (+ (* dx s) (* dy c)))
    0.0
  )
)

;; --------------------------------------------------------------------------
;; 3. Cac ham vector co ban
;; --------------------------------------------------------------------------
(defun DGO:VecSub (p1 p2)
  (list (- (car p1) (car p2)) (- (cadr p1) (cadr p2)) 0.0)
)

(defun DGO:VecAdd (p1 p2)
  (list (+ (car p1) (car p2)) (+ (cadr p1) (cadr p2)) 0.0)
)

(defun DGO:VecScale (v k)
  (list (* (car v) k) (* (cadr v) k) 0.0)
)

(defun DGO:VecDot (v1 v2)
  (+ (* (car v1) (car v2)) (* (cadr v1) (cadr v2)))
)

(defun DGO:VecLen (v)
  (sqrt (+ (* (car v) (car v)) (* (cadr v) (cadr v))))
)

;; --------------------------------------------------------------------------
;; 4. Lay thong tin hinh hoc & Bounding Box dinh huong cua Block
;;    Tra ve: (list cPtWCS e1 e2 minPt maxPt insPt rot ent maxSize)
;; --------------------------------------------------------------------------
(defun DGO:GetOrientedBBox (ent / vlaObj insPt rot minVar maxVar minPt maxPt
                                  cPtLocal cPtWCS e1 e2 needRot rotOk dx dy maxSize)
  (setq vlaObj (vlax-ename->vla-object ent)
        insPt  (vlax-safearray->list (vlax-variant-value (vla-get-InsertionPoint vlaObj)))
        rot    (vla-get-Rotation vlaObj)
  )
  (setq needRot (> (abs (sin (* 2.0 rot))) 1e-4)
        rotOk   nil
  )
  (if needRot
    (setq rotOk
      (not (vl-catch-all-error-p
             (vl-catch-all-apply 'vla-Rotate (list vlaObj (vlax-3d-point insPt) (- rot)))
           )
      )
    )
  )
  (vla-GetBoundingBox vlaObj 'minVar 'maxVar)
  (if (and needRot rotOk)
    (vl-catch-all-apply 'vla-Rotate (list vlaObj (vlax-3d-point insPt) rot))
  )
  (setq minPt (vlax-safearray->list minVar)
        maxPt (vlax-safearray->list maxVar)
        dx    (abs (- (car maxPt) (car minPt)))
        dy    (abs (- (cadr maxPt) (cadr minPt)))
        maxSize (max dx dy 1.0)
  )
  (setq cPtLocal (list (* 0.5 (+ (car minPt) (car maxPt)))
                       (* 0.5 (+ (cadr minPt) (cadr maxPt)))
                       0.0
                 )
  )
  (if (and needRot rotOk)
    (setq cPtWCS (DGO:RotatePoint2D cPtLocal insPt rot)
          e1     (list (cos rot) (sin rot) 0.0)
          e2     (list (- (sin rot)) (cos rot) 0.0)
    )
    (setq cPtWCS cPtLocal
          rot    0.0
          e1     '(1.0 0.0 0.0)
          e2     '(0.0 1.0 0.0)
    )
  )
  (list cPtWCS e1 e2 minPt maxPt insPt rot ent maxSize)
)

;; --------------------------------------------------------------------------
;; 5. Kiem tra 2 Block co LIEN NHAU (thuoc cung 1 tuyen ong lien mach) khong
;;    Chi gop thanh 1 tuyen khi 2 dot ong (HTS-OG* / HTS-CAP*) cham sat dau
;;    vao nhau (khoang ho <= 25mm). Neu cach nhau hoac ngan cach boi phu kien
;;    khac thi tach thanh 2 tuyen ong rieng biet.
;; --------------------------------------------------------------------------
(defun DGO:AreSameDuctRun (b1 b2 / c1 e1a e2a min1 max1 dx1 dy1
                                   c2 e1b e2b min2 max2 dx2 dy2
                                   v dist sameAngle dot1 dot2
                                   uAxis paraDist perpDist
                                   halfLen1 halfWid1 halfLen2 halfWid2 gapDist)
  (setq c1   (nth 0 b1)
        e1a  (nth 1 b1)
        e2a  (nth 2 b1)
        min1 (nth 3 b1)
        max1 (nth 4 b1)
        dx1  (abs (- (car max1) (car min1)))
        dy1  (abs (- (cadr max1) (cadr min1)))

        c2   (nth 0 b2)
        e1b  (nth 1 b2)
        e2b  (nth 2 b2)
        min2 (nth 3 b2)
        max2 (nth 4 b2)
        dx2  (abs (- (car max2) (car min2)))
        dy2  (abs (- (cadr max2) (cadr min2)))

        v    (DGO:VecSub c2 c1)
        dist (DGO:VecLen v)
  )
  ;; Kiem tra 2 block co cung phuong xoay (song song hoac vuong goc)
  (setq sameAngle (or (> (abs (DGO:VecDot e1a e1b)) 0.98)
                      (> (abs (DGO:VecDot e1a e2b)) 0.98)
                  )
  )
  (if (and sameAngle (> dist 1.0))
    (progn
      (setq dot1 (abs (DGO:VecDot v e1a))
            dot2 (abs (DGO:VecDot v e2a))
      )
      ;; Xac dinh truc doc tuyen (uAxis) va ban kinh kich thuoc cua Block 1
      (if (>= dot1 dot2)
        (setq uAxis    e1a
              paraDist dot1
              perpDist dot2
              halfLen1 (* 0.5 dx1)
              halfWid1 (* 0.5 dy1)
        )
        (setq uAxis    e2a
              paraDist dot2
              perpDist dot1
              halfLen1 (* 0.5 dy1)
              halfWid1 (* 0.5 dx1)
        )
      )
      ;; Xac dinh ban kinh chieu dai & chieu rong cua Block 2 theo uAxis
      (if (>= (abs (DGO:VecDot uAxis e1b)) (abs (DGO:VecDot uAxis e2b)))
        (setq halfLen2 (* 0.5 dx2)
              halfWid2 (* 0.5 dy2)
        )
        (setq halfLen2 (* 0.5 dy2)
              halfWid2 (* 0.5 dx2)
        )
      )
      ;; Khoang ho thuc te giua 2 mep dau ong doc theo tuyen
      (setq gapDist (abs (- paraDist (+ halfLen1 halfLen2))))

      ;; 2 dot ong chi thuoc cung 1 tuyen khi:
      ;; - Dau ong cham sat nhau (gapDist <= 25mm) -> khong co phu kien khac chen giua
      ;; - Thang hang theo truc ong (cho phep do lech tam cua con thu lech HTS-CAP)
      (and (<= gapDist 25.0)
           (<= perpDist (+ (abs (- halfWid1 halfWid2)) 50.0))
      )
    )
    nil
  )
)

;; --------------------------------------------------------------------------
;; 6. Cac ham tinh khoang cach & tim tuyen ong GAN NHAT voi man hinh Zoom / Chuot
;; --------------------------------------------------------------------------
(defun DGO:SortBlocksLRTB (runBlocks)
  (vl-sort runBlocks
    '(lambda (a b / pa pb dx)
       (setq pa (nth 0 a)
             pb (nth 0 b)
             dx (abs (- (car pa) (car pb)))
       )
       (if (> dx 50.0)
         (< (car pa) (car pb))
         (< (cadr pa) (cadr pb))
       )
     )
  )
)

;; Tinh khoang cach ngan nhat tu 1 diem refPt (WCS) den bat ky dot ong nao trong tuyen
(defun DGO:DistPointToRun (refPt runBlocks / minDist d)
  (setq minDist 1e99)
  (foreach b runBlocks
    (setq d (DGO:VecLen (DGO:VecSub (nth 0 b) refPt)))
    (if (< d minDist)
      (setq minDist d)
    )
  )
  minDist
)

;; Tim dot ong trong tuyen nam gan diem refPt (WCS) nhat de neo day dan Pick
(defun DGO:ClosestBlockInRun (refPt runBlocks / bestBlk bestDist d)
  (setq bestBlk  (car runBlocks)
        bestDist 1e99
  )
  (foreach b runBlocks
    (setq d (DGO:VecLen (DGO:VecSub (nth 0 b) refPt)))
    (if (< d bestDist)
      (setq bestDist d
            bestBlk  b
      )
    )
  )
  bestBlk
)

;; Lay ra tuyen ong GAN NHAT voi diem refPt (WCS) tu danh sach remainingRuns
;; Tra ve: (cons bestRun otherRuns)
(defun DGO:PopNearestRun (refPt remainingRuns / bestRun bestDist d others)
  (setq bestRun  (car remainingRuns)
        bestDist 1e99
  )
  (foreach r remainingRuns
    (setq d (DGO:DistPointToRun refPt r))
    (if (< d bestDist)
      (setq bestDist d
            bestRun  r
      )
    )
  )
  (setq others '())
  (foreach r remainingRuns
    (if (not (eq r bestRun))
      (setq others (cons r others))
    )
  )
  (cons bestRun (reverse others))
)

;; --------------------------------------------------------------------------
;; 6b. Gom nhom danh sach cac Block thanh TUNG TUYEN ONG (Connected Components)
;; --------------------------------------------------------------------------
(defun DGO:ClusterIntoRuns (bboxList / remaining queue current runList allRuns other nextRemaining)
  (setq remaining bboxList
        allRuns   '()
  )
  (while remaining
    (setq queue     (list (car remaining))
          remaining (cdr remaining)
          runList   '()
    )
    (while queue
      (setq current       (car queue)
            queue         (cdr queue)
            runList       (cons current runList)
            nextRemaining '()
      )
      (foreach other remaining
        (if (DGO:AreSameDuctRun current other)
          (setq queue (cons other queue))
          (setq nextRemaining (cons other nextRemaining))
        )
      )
      (setq remaining (reverse nextRemaining))
    )
    (setq allRuns (cons (DGO:SortBlocksLRTB runList) allRuns))
  )
  (reverse allRuns)
)

;; --------------------------------------------------------------------------
;; 7. Lam sang (Highlight) hoac Bo sang (Unhighlight) 1 tuyen ong + Dim
;;    mode = 3 (Highlight), mode = 4 (Unhighlight)
;; --------------------------------------------------------------------------
(defun DGO:HighlightRun (runBlocks mode / ent)
  (foreach b runBlocks
    (setq ent (nth 7 b))
    (if (and ent (entget ent)) (redraw ent mode))
  )
)

(defun DGO:HighlightRunItems (items mode / dimEnt)
  (foreach item items
    (setq dimEnt (handent (nth 1 item)))
    (if (and dimEnt (entget dimEnt)) (redraw dimEnt mode))
  )
)

;; --------------------------------------------------------------------------
;; 8. Tao va hien thi hop thoai DCL de tich chon Block can Dim
;; --------------------------------------------------------------------------
(defun DGO:ShowBlockDialog (blkList / dclFile f dclId status i allIdxStr result selIdx)
  (setq dclFile (vl-filename-mktemp "DGO_Blocks.dcl"))
  (setq f (open dclFile "w"))

  (write-line "DGO_Dialog : dialog {" f)
  (write-line "  label = \"CHON BLOCK ONG GIO CAN DIM (DOG)\";" f)
  (write-line "  : boxed_column {" f)
  (write-line "    label = \"Danh sach Ong Gio (HTS-OG* & HTS-CAP*) trong vung quet:\";" f)

  (if (<= (length blkList) 15)
    (progn
      (setq i 0)
      (foreach blk blkList
        (write-line
          (strcat "    : toggle { key = \"blk_" (itoa i) "\"; label = \""
                  (car blk) "  (" (itoa (cdr blk)) " doi tuong)\"; value = \"1\"; }"
          )
          f
        )
        (setq i (1+ i))
      )
    )
    (write-line "    : list_box { key = \"blk_list\"; height = 16; width = 50; multiple_select = true; }" f)
  )

  (write-line "    : row {" f)
  (write-line "      : button { key = \"btn_all\"; label = \"Chon tat ca\"; width = 16; }" f)
  (write-line "      : button { key = \"btn_none\"; label = \"Bo chon tat ca\"; width = 16; }" f)
  (write-line "    }" f)
  (write-line "  }" f)

  (write-line "  spacer;" f)
  (write-line "  ok_cancel;" f)
  (write-line "}" f)
  (close f)

  (setq dclId (load_dialog dclFile))
  (if (not (new_dialog "DGO_Dialog" dclId))
    (progn
      (vl-file-delete dclFile)
      (exit)
    )
  )

  ;; Tao chuoi chi so "0 1 2 ..." an toan cho moi so luong doi tuong
  (setq allIdxStr ""
        i 0
  )
  (foreach blk blkList
    (setq allIdxStr (strcat allIdxStr (itoa i) " ")
          i         (1+ i)
    )
  )
  (setq allIdxStr (vl-string-right-trim " " allIdxStr))

  (if (> (length blkList) 15)
    (progn
      (start_list "blk_list")
      (foreach blk blkList
        (add_list (strcat (car blk) "  (" (itoa (cdr blk)) " doi tuong)"))
      )
      (end_list)
      (set_tile "blk_list" allIdxStr)
    )
  )

  (action_tile "btn_all"
    "(if (<= (length blkList) 15)
       (progn
         (setq i 0)
         (foreach blk blkList
           (set_tile (strcat \"blk_\" (itoa i)) \"1\")
           (setq i (1+ i))
         )
       )
       (set_tile \"blk_list\" allIdxStr)
     )"
  )

  (action_tile "btn_none"
    "(if (<= (length blkList) 15)
       (progn
         (setq i 0)
         (foreach blk blkList
           (set_tile (strcat \"blk_\" (itoa i)) \"0\")
           (setq i (1+ i))
         )
       )
       (set_tile \"blk_list\" \"\")
     )"
  )

  (action_tile "accept"
    "(progn
       (setq result '())
       (if (<= (length blkList) 15)
         (progn
           (setq i 0)
           (foreach blk blkList
             (if (= (get_tile (strcat \"blk_\" (itoa i))) \"1\")
               (setq result (cons (car blk) result))
             )
             (setq i (1+ i))
           )
         )
         (progn
           (setq selIdx (read (strcat \"(\" (get_tile \"blk_list\") \")\")))
           (foreach idx selIdx
             (setq result (cons (car (nth idx blkList)) result))
           )
         )
       )
       (done_dialog 1)
     )"
  )

  (action_tile "cancel" "(done_dialog 0)")

  (setq status (start_dialog))
  (unload_dialog dclId)
  (vl-file-delete dclFile)

  (if (= status 1)
    (reverse result)
    nil
  )
)

;; --------------------------------------------------------------------------
;; 9. Tao Dim (Tuyen ong thang dung DIMLINEAR, Tuyen ong cheo dung DIMALIGNED)
;; --------------------------------------------------------------------------
(defun DGO:CreateDim (pt1 pt2 ptDim / uPt1 uPt2 uPtDim dx dy)
  (setq uPt1   (trans pt1 0 1)
        uPt2   (trans pt2 0 1)
        uPtDim (trans ptDim 0 1)
        dx     (abs (- (car uPt2) (car uPt1)))
        dy     (abs (- (cadr uPt2) (cadr uPt1)))
  )
  (cond
    ;; Tuyen ong thang NGANG (dy ~ 0) -> Dung DIMLINEAR Horizontal
    ((<= dy (* 0.01 (max dx 1.0)))
     (command "_.DIMLINEAR" "_non" uPt1 "_non" uPt2 "_H" "_non" uPtDim)
    )
    ;; Tuyen ong thang DOC (dx ~ 0) -> Dung DIMLINEAR Vertical
    ((<= dx (* 0.01 (max dy 1.0)))
     (command "_.DIMLINEAR" "_non" uPt1 "_non" uPt2 "_V" "_non" uPtDim)
    )
    ;; Tuyen ong CHEO (xien goc) -> Dung DIMALIGNED
    (T
     (command "_.DIMALIGNED" "_non" uPt1 "_non" uPt2 "_non" uPtDim)
    )
  )
)

;; --------------------------------------------------------------------------
;; 9b. Tao Dim cho 1 Block dua tren diem Pick huong (sidePt) cua tuyen ong
;;     Luu ca canh hien tai va canh doi dien de ho tro DAO CHIEU DIM tuc thi!
;;     Tra ve: (list blkHandle dimHandle pt1 pt2 ptMid normVec opp_p1 opp_p2 opp_mid opp_norm)
;; --------------------------------------------------------------------------
(defun DGO:DimSingleBlockByPick (bboxData runCenters sidePt offsetDist /
                                 cPt e1 e2 minPt maxPt insPt rot ent blkHandle
                                 bestDist d vecToNeighbor dot1 dot2
                                 runAxisIsE1 pBL pBR pTR pTL
                                 edgeA_p1 edgeA_p2 edgeA_mid edgeA_norm
                                 edgeB_p1 edgeB_p2 edgeB_mid edgeB_norm
                                 vecPick chooseEdgeA
                                 pt1 pt2 ptMid normVec
                                 opp_p1 opp_p2 opp_mid opp_norm
                                 ptDim lastBefore newDim dimHandle)
  (setq cPt       (nth 0 bboxData)
        e1        (nth 1 bboxData)
        e2        (nth 2 bboxData)
        minPt     (nth 3 bboxData)
        maxPt     (nth 4 bboxData)
        insPt     (nth 5 bboxData)
        rot       (nth 6 bboxData)
        ent       (nth 7 bboxData)
        blkHandle (cdr (assoc 5 (entget ent)))
  )

  ;; Tim Block lang gieng gan nhat trong cung tuyen ong de xac dinh phuong doc tuyen
  (setq bestDist 1e99
        vecToNeighbor nil
  )
  (foreach otherC runCenters
    (setq d (DGO:VecLen (DGO:VecSub otherC cPt)))
    (if (and (> d 1.0) (< d bestDist))
      (progn
        (setq bestDist d
              vecToNeighbor (DGO:VecSub otherC cPt)
        )
      )
    )
  )

  (setq vecPick (DGO:VecSub sidePt cPt))

  (if vecToNeighbor
    ;; Neu tuyen ong co >= 2 block: phuong noi tam cac block la phuong doc tuyen
    (progn
      (setq dot1 (abs (DGO:VecDot vecToNeighbor e1))
            dot2 (abs (DGO:VecDot vecToNeighbor e2))
      )
      (setq runAxisIsE1 (>= dot1 dot2))
    )
    ;; Neu tuyen ong chi co 1 block: phuong vuong goc voi vector Pick la phuong Dim
    (progn
      (setq dot1 (abs (DGO:VecDot vecPick e1))
            dot2 (abs (DGO:VecDot vecPick e2))
      )
      (setq runAxisIsE1 (< dot1 dot2))
    )
  )

  ;; 4 dinh cua Block trong WCS
  (setq pBL (DGO:RotatePoint2D (list (car minPt) (cadr minPt) 0.0) insPt rot)
        pBR (DGO:RotatePoint2D (list (car maxPt) (cadr minPt) 0.0) insPt rot)
        pTR (DGO:RotatePoint2D (list (car maxPt) (cadr maxPt) 0.0) insPt rot)
        pTL (DGO:RotatePoint2D (list (car minPt) (cadr maxPt) 0.0) insPt rot)
  )

  (if runAxisIsE1
    (progn
      (setq edgeA_p1   pBL
            edgeA_p2   pBR
            edgeA_mid  (DGO:VecScale (DGO:VecAdd pBL pBR) 0.5)
            edgeA_norm (DGO:VecScale e2 -1.0)
      )
      (setq edgeB_p1   pTL
            edgeB_p2   pTR
            edgeB_mid  (DGO:VecScale (DGO:VecAdd pTL pTR) 0.5)
            edgeB_norm e2
      )
    )
    (progn
      (setq edgeA_p1   pBR
            edgeA_p2   pTR
            edgeA_mid  (DGO:VecScale (DGO:VecAdd pBR pTR) 0.5)
            edgeA_norm e1
      )
      (setq edgeB_p1   pBL
            edgeB_p2   pTL
            edgeB_mid  (DGO:VecScale (DGO:VecAdd pBL pTL) 0.5)
            edgeB_norm (DGO:VecScale e1 -1.0)
      )
    )
  )

  ;; Chon canh huong ve phia diem Pick (sidePt) va luu canh doi dien (opp_*)
  (setq chooseEdgeA
    (>= (DGO:VecDot vecPick edgeA_norm)
        (DGO:VecDot vecPick edgeB_norm)
    )
  )

  (if chooseEdgeA
    (setq pt1      edgeA_p1
          pt2      edgeA_p2
          ptMid    edgeA_mid
          normVec  edgeA_norm
          opp_p1   edgeB_p1
          opp_p2   edgeB_p2
          opp_mid  edgeB_mid
          opp_norm edgeB_norm
    )
    (setq pt1      edgeB_p1
          pt2      edgeB_p2
          ptMid    edgeB_mid
          normVec  edgeB_norm
          opp_p1   edgeA_p1
          opp_p2   edgeA_p2
          opp_mid  edgeA_mid
          opp_norm edgeA_norm
    )
  )

  ;; Tinh diem dat duong Dim cach mep ong 1 khoang = offsetDist ve phia da Pick
  (setq ptDim (DGO:VecAdd ptMid (DGO:VecScale normVec (abs offsetDist))))

  ;; Tao Dim (Linear cho ong thang Ngang/Doc, Aligned cho ong Cheo)
  (if (> (DGO:VecLen (DGO:VecSub pt2 pt1)) 1.0)
    (progn
      (setq lastBefore (entlast))
      (DGO:CreateDim pt1 pt2 ptDim)
      (setq newDim (entlast))
      (if (and newDim (not (equal newDim lastBefore)))
        (setq dimHandle (cdr (assoc 5 (entget newDim))))
        (setq dimHandle "")
      )
      (list blkHandle dimHandle pt1 pt2 ptMid normVec opp_p1 opp_p2 opp_mid opp_norm)
    )
    nil
  )
)

;; --------------------------------------------------------------------------
;; 10. Tim tuyen ong da luu trong *DGO:SavedRuns* theo Handle cua Block hoac Dim
;; --------------------------------------------------------------------------
(defun DGO:FindSavedRunByHandle (h / foundRun)
  (setq foundRun nil)
  (foreach runRec *DGO:SavedRuns*
    (if (not foundRun)
      (progn
        (foreach item (nth 1 runRec)
          (if (or (equal (nth 0 item) h)
                  (equal (nth 1 item) h)
              )
            (setq foundRun runRec)
          )
        )
        (if (not foundRun)
          (foreach b (nth 0 runRec)
            (if (and (nth 7 b)
                     (entget (nth 7 b))
                     (equal (cdr (assoc 5 (entget (nth 7 b)))) h)
                )
              (setq foundRun runRec)
            )
          )
        )
      )
    )
  )
  foundRun
)

;; --------------------------------------------------------------------------
;; 10b. Ham cap nhat lai Dim cua 1 tuyen ong (ho tro DAO CHIEU & DOI KHOANG CACH)
;;      - doFlip = T  : Dao chieu Dim sang canh doi dien cua ong gio
;;      - doFlip = nil: Giu nguyen phia, chi cap nhat khoang cach newOffset
;;      Tra ve: updatedRec (va tu dong cap nhat trong *DGO:SavedRuns*)
;; --------------------------------------------------------------------------
(defun DGO:RebuildRunDims (targetRun newOffset doFlip doc oldCmdEcho oldOsMode /
                           runBlocks items newItems
                           blkHandle oldDim
                           pt1 pt2 ptMid normVec
                           opp_p1 opp_p2 opp_mid opp_norm
                           ptDim lastBefore newDim newDimHandle updatedRec)
  (setq runBlocks (nth 0 targetRun)
        items     (nth 1 targetRun)
  )
  (if (or (not newOffset) (<= newOffset 0.0))
    (setq newOffset (nth 2 targetRun))
  )
  (setq *DGO:LastOffset* newOffset)

  (vla-StartUndoMark doc)
  (setvar 'CMDECHO 0)
  (setvar 'OSMODE 0)

  (setq newItems '())
  (foreach item items
    (setq blkHandle (nth 0 item)
          oldDim    (handent (nth 1 item))
    )
    ;; Neu doFlip = T thi hoan doi canh hien tai <-> canh doi dien cua ong gio
    (if doFlip
      (setq pt1      (nth 6 item)
            pt2      (nth 7 item)
            ptMid    (nth 8 item)
            normVec  (nth 9 item)
            opp_p1   (nth 2 item)
            opp_p2   (nth 3 item)
            opp_mid  (nth 4 item)
            opp_norm (nth 5 item)
      )
      (setq pt1      (nth 2 item)
            pt2      (nth 3 item)
            ptMid    (nth 4 item)
            normVec  (nth 5 item)
            opp_p1   (nth 6 item)
            opp_p2   (nth 7 item)
            opp_mid  (nth 8 item)
            opp_norm (nth 9 item)
      )
    )
    ;; Xoa Dim cu
    (if (and oldDim (entget oldDim))
      (entdel oldDim)
    )
    ;; Tao Dim moi
    (setq ptDim      (DGO:VecAdd ptMid (DGO:VecScale normVec (abs newOffset)))
          lastBefore (entlast)
    )
    (DGO:CreateDim pt1 pt2 ptDim)
    (setq newDim (entlast))
    (if (and newDim (not (equal newDim lastBefore)))
      (setq newDimHandle (cdr (assoc 5 (entget newDim))))
      (setq newDimHandle "")
    )
    (setq newItems
      (cons (list blkHandle newDimHandle pt1 pt2 ptMid normVec opp_p1 opp_p2 opp_mid opp_norm)
            newItems
      )
    )
  )

  (setvar 'OSMODE oldOsMode)
  (setvar 'CMDECHO oldCmdEcho)
  (vla-EndUndoMark doc)

  (setq newItems        (reverse newItems)
        updatedRec      (list runBlocks newItems newOffset)
        *DGO:SavedRuns* (subst updatedRec targetRun *DGO:SavedRuns*)
  )
  updatedRec
)

;; --------------------------------------------------------------------------
;; 11. Hop thoai DCL Dieu Chinh Nhanh (Co nut DAO CHIEU DIM & CAP NHAT KHOANG CACH
;;     cho den khi nguoi dung bam OK!)
;;     Tra ve: (cons actionCode typedOffset)
;;       actionCode = 1 : OK (Hoan tat)
;;       actionCode = 2 : Dao chieu Dim (Lat sang phia doi dien)
;;       actionCode = 3 : Cap nhat khoang cach Dim moi
;;       actionCode = 4 : Pick chon tuyen ong khac tren ban ve
;;       actionCode = 0 : Dong / Huy
;; --------------------------------------------------------------------------
(defun DGO:ShowAdjustDialog (curRun / dclFile f dclId status nSegs curOffset typedStr typedVal)
  (setq nSegs     (length (nth 1 curRun))
        curOffset (nth 2 curRun)
        typedStr  (rtos curOffset 2 0)
        dclFile   (vl-filename-mktemp "DGO_Adjust.dcl")
        f         (open dclFile "w")
  )

  (write-line "DGO_Adjust : dialog {" f)
  (write-line "  label = \"DIEU CHINH CHIEU & KHOANG CACH DIM (DOG)\";" f)
  (write-line "  : boxed_column {" f)
  (write-line
    (strcat "    label = \"Tuyen ong dang chon (" (itoa nSegs) " dot ong):\";")
    f
  )
  (write-line "    spacer;" f)
  (write-line "    : button {" f)
  (write-line "      key = \"btn_flip\";" f)
  (write-line "      label = \"<-> DAO CHIEU DIM (Doi sang phia doi dien)\";" f)
  (write-line "      height = 2.0;" f)
  (write-line "      width = 44;" f)
  (write-line "    }" f)
  (write-line "    spacer;" f)
  (write-line "    : row {" f)
  (write-line "      : edit_box {" f)
  (write-line "        key = \"edt_offset\";" f)
  (write-line "        label = \"Khoang cach Dim:\";" f)
  (write-line (strcat "        value = \"" typedStr "\";") f)
  (write-line "        edit_width = 10;" f)
  (write-line "      }" f)
  (write-line "      : button {" f)
  (write-line "        key = \"btn_dist\";" f)
  (write-line "        label = \"Cap nhat khoang cach\";" f)
  (write-line "        width = 20;" f)
  (write-line "      }" f)
  (write-line "    }" f)
  (write-line "    spacer;" f)
  (write-line "    : button {" f)
  (write-line "      key = \"btn_pick\";" f)
  (write-line "      label = \"Pick chon tuyen ong khac tren ban ve...\";" f)
  (write-line "      width = 44;" f)
  (write-line "    }" f)
  (write-line "  }" f)
  (write-line "  spacer;" f)
  (write-line "  : row {" f)
  (write-line "    alignment = centered;" f)
  (write-line "    : button {" f)
  (write-line "      key = \"accept\";" f)
  (write-line "      label = \"OK (Hoan tat)\";" f)
  (write-line "      is_default = true;" f)
  (write-line "      width = 20;" f)
  (write-line "      height = 1.8;" f)
  (write-line "    }" f)
  (write-line "    : button {" f)
  (write-line "      key = \"cancel\";" f)
  (write-line "      label = \"Dong\";" f)
  (write-line "      is_cancel = true;" f)
  (write-line "      width = 14;" f)
  (write-line "      height = 1.8;" f)
  (write-line "    }" f)
  (write-line "  }" f)
  (write-line "}" f)
  (close f)

  (setq dclId (load_dialog dclFile))
  (if (not (new_dialog "DGO_Adjust" dclId))
    (progn
      (vl-file-delete dclFile)
      (exit)
    )
  )

  (action_tile "edt_offset" "(setq typedStr $value)")
  (action_tile "btn_flip"   "(setq typedStr (get_tile \"edt_offset\")) (done_dialog 2)")
  (action_tile "btn_dist"   "(setq typedStr (get_tile \"edt_offset\")) (done_dialog 3)")
  (action_tile "btn_pick"   "(setq typedStr (get_tile \"edt_offset\")) (done_dialog 4)")
  (action_tile "accept"     "(setq typedStr (get_tile \"edt_offset\")) (done_dialog 1)")
  (action_tile "cancel"     "(done_dialog 0)")

  (setq status (start_dialog))
  (unload_dialog dclId)
  (vl-file-delete dclFile)

  (setq typedVal (distof typedStr))
  (if (or (null typedVal) (<= typedVal 0.0))
    (setq typedVal curOffset)
  )

  (cons status typedVal)
)

;; --------------------------------------------------------------------------
;; 11b. Vong lap Dieu chinh (Dao chieu Dim / Doi khoang cach / Pick tuyen khac)
;;      cho den khi nguoi dung bam OK
;; --------------------------------------------------------------------------
(defun DGO:UpdateRunDistanceLoop (initRun doc oldCmdEcho oldOsMode /
                                  curRun keepLooping dlgRes act typedOffset
                                  picking sel ent h pickedRun)
  (setq curRun initRun)

  ;; Neu chua co tuyen nao duoc chon san -> Yeu cau nguoi dung Pick chon tren ban ve
  (if (null curRun)
    (progn
      (setq picking T)
      (while picking
        (setvar 'ERRNO 0)
        (setq sel
          (entsel
            "\nPick chon tuyen ong (hoac Dim) can Dao chieu / Sua khoang cach <Enter de thoat>: "
          )
        )
        (cond
          ((and (null sel) (/= (getvar 'ERRNO) 7))
           (setq picking nil)
          )
          ((null sel)
           (princ "\nChua pick trung! Hay click vao Block ong gio hoac duong Dim (hoac Enter de thoat).")
          )
          (T
           (setq ent       (car sel)
                 h         (cdr (assoc 5 (entget ent)))
                 pickedRun (DGO:FindSavedRunByHandle h)
           )
           (if pickedRun
             (setq curRun  pickedRun
                   picking nil
             )
             (princ "\nDoi tuong vua chon khong thuoc tuyen ong nao vua Dim! Hay chon lai.")
           )
          )
        )
      )
    )
  )

  ;; Mo hop thoai Dieu chinh nhanh cho den khi nguoi dung bam OK
  (setq keepLooping (if curRun T nil))
  (while keepLooping
    ;; Lam sang tuyen ong va Dim dang chon
    (DGO:HighlightRun (nth 0 curRun) 3)
    (DGO:HighlightRunItems (nth 1 curRun) 3)

    (setq dlgRes      (DGO:ShowAdjustDialog curRun)
          act         (car dlgRes)
          typedOffset (cdr dlgRes)
    )

    ;; Bo sang truoc khi cap nhat / ket thuc
    (DGO:HighlightRun (nth 0 curRun) 4)
    (DGO:HighlightRunItems (nth 1 curRun) 4)

    (cond
      ;; [2] Nguoi dung bam nut "<-> DAO CHIEU DIM"
      ((= act 2)
       (setq curRun (DGO:RebuildRunDims curRun typedOffset T doc oldCmdEcho oldOsMode))
       (princ
         (strcat "\n-> Da DAO CHIEU Dim sang phia doi dien (khoang cach "
                 (rtos (nth 2 curRun) 2 0) ")!"
         )
       )
      )

      ;; [3] Nguoi dung bam nut "Cap nhat khoang cach"
      ((= act 3)
       (setq curRun (DGO:RebuildRunDims curRun typedOffset nil doc oldCmdEcho oldOsMode))
       (princ
         (strcat "\n-> Da cap nhat khoang cach Dim thanh "
                 (rtos (nth 2 curRun) 2 0) "!"
         )
       )
      )

      ;; [4] Nguoi dung bam nut "Pick chon tuyen ong khac tren ban ve..."
      ((= act 4)
       ;; Neu nguoi dung co nhap khoang cach moi truoc khi bam Pick tuyen khac, cap nhat luon
       (if (> (abs (- typedOffset (nth 2 curRun))) 1e-3)
         (setq curRun (DGO:RebuildRunDims curRun typedOffset nil doc oldCmdEcho oldOsMode))
       )
       (setq picking T)
       (while picking
         (setvar 'ERRNO 0)
         (setq sel
           (entsel
             "\nPick chon tuyen ong (hoac Dim) can Dao chieu / Sua khoang cach <Quay lai bang dieu chinh>: "
           )
         )
         (cond
           ((and (null sel) (/= (getvar 'ERRNO) 7))
            (setq picking nil)
           )
           ((null sel)
            (princ "\nChua pick trung! Hay click vao Block ong gio hoac duong Dim.")
           )
           (T
            (setq ent       (car sel)
                  h         (cdr (assoc 5 (entget ent)))
                  pickedRun (DGO:FindSavedRunByHandle h)
            )
            (if pickedRun
              (setq curRun  pickedRun
                    picking nil
              )
              (princ "\nDoi tuong vua chon khong thuoc tuyen ong nao vua Dim! Hay chon lai.")
            )
           )
         )
       )
      )

      ;; [1] Nguoi dung bam nut "OK (Hoan tat)"
      ((= act 1)
       ;; Neu nguoi dung vua sua so trong o Khoang cach roi bam OK luon -> tu dong ap dung!
       (if (> (abs (- typedOffset (nth 2 curRun))) 1e-3)
         (progn
           (setq curRun (DGO:RebuildRunDims curRun typedOffset nil doc oldCmdEcho oldOsMode))
           (princ
             (strcat "\n-> Da cap nhat khoang cach Dim thanh "
                     (rtos (nth 2 curRun) 2 0) "!"
             )
           )
         )
       )
       (setq keepLooping nil)
      )

      ;; [0] Nguoi dung bam Dong / ESC
      (T
       (setq keepLooping nil)
      )
    )
  )
)

;; --------------------------------------------------------------------------
;; 12. Lenh chinh: DOG
;; --------------------------------------------------------------------------
(defun c:DOG (/ *error* doc oldCmdEcho oldOsMode ss i ent vlaObj bName blkCounts assocItem
                selectedNames offsetDist targetEnts bboxList
                allRuns remainingRuns popRes refPt totalRuns runIdx runBlocks runCenters
                anchorBlock basePt sidePt itemRec runItems lastCreatedRun countDim)

  (defun *error* (msg)
    (if allRuns
      (foreach r allRuns (DGO:HighlightRun r 4))
    )
    (if *DGO:SavedRuns*
      (foreach rec *DGO:SavedRuns*
        (DGO:HighlightRun (nth 0 rec) 4)
        (DGO:HighlightRunItems (nth 1 rec) 4)
      )
    )
    (if oldOsMode (setvar 'OSMODE oldOsMode))
    (if oldCmdEcho (setvar 'CMDECHO oldCmdEcho))
    (if (and doc (= 8 (logand 8 (getvar 'UNDOCTL))))
      (vla-EndUndoMark doc)
    )
    (if (not (wcmatch (strcase msg) "*BREAK,*CANCEL*,*EXIT*"))
      (princ (strcat "\n[Loi]: " msg))
    )
    (princ)
  )

  (setq doc        (vla-get-ActiveDocument (vlax-get-acad-object))
        oldCmdEcho (getvar 'CMDECHO)
        oldOsMode  (getvar 'OSMODE)
  )

  (princ (strcat "\n=== TU DONG DIM ONG GIO (DimStyle hien hanh: " (getvar 'DIMSTYLE) ") ==="))
  (if *DGO:SavedRuns*
    (princ "\nQuet chon vung chua cac Block ong gio can Dim (hoac nhan Enter de Dao chieu / Sua khoang cach tuyen vua Dim): ")
    (princ "\nQuet chon vung chua cac Block ong gio can Dim: ")
  )
  (setq ss (ssget '((0 . "INSERT"))))

  ;; Neu nguoi dung nhan Enter khong quet chon va da co tuyen vua Dim -> Mo bang Dieu chinh luon!
  (if (not ss)
    (if *DGO:SavedRuns*
      (progn
        (DGO:UpdateRunDistanceLoop (car *DGO:SavedRuns*) doc oldCmdEcho oldOsMode)
        (exit)
      )
      (progn
        (princ "\nKhong tim thay Block nao trong vung quet!")
        (exit)
      )
    )
  )

  ;; Chi loc va thong ke cac Block ong gio co ten bat dau bang HTS-OG* va HTS-CAP*
  (setq blkCounts '()
        i 0
  )
  (repeat (sslength ss)
    (setq ent    (ssname ss i)
          vlaObj (vlax-ename->vla-object ent)
          bName  (DGO:GetBlockName vlaObj)
    )
    (if (DGO:IsDuctBlock bName)
      (if (setq assocItem (assoc bName blkCounts))
        (setq blkCounts (subst (cons bName (1+ (cdr assocItem))) assocItem blkCounts))
        (setq blkCounts (cons (cons bName 1) blkCounts))
      )
    )
    (setq i (1+ i))
  )

  (if (null blkCounts)
    (progn
      (princ "\nKhong tim thay Block ong gio (HTS-OG* hoac HTS-CAP*) nao trong vung quet!")
      (exit)
    )
  )

  (setq blkCounts (vl-sort blkCounts '(lambda (a b) (< (strcase (car a)) (strcase (car b))))))

  ;; Buoc 1: Hien thi hop thoai tich chon Block ong gio can Dim
  (setq selectedNames (DGO:ShowBlockDialog blkCounts))
  (if (null selectedNames)
    (progn
      (princ "\nDa huy hoac chua tich chon Block nao.")
      (exit)
    )
  )

  ;; Buoc 2: Nhap khoang cach Text Dim cach doi tuong
  (if (not *DGO:LastOffset*) (setq *DGO:LastOffset* 300.0))
  (setq offsetDist
    (getdist
      (strcat "\nNhap khoang cach Text Dim cach doi tuong <" (rtos *DGO:LastOffset* 2 0) ">: ")
    )
  )
  (if (not offsetDist)
    (setq offsetDist *DGO:LastOffset*)
    (setq *DGO:LastOffset* offsetDist)
  )

  ;; Loc ra cac Block ong gio thuoc danh sach da tich chon
  (setq targetEnts '()
        i 0
  )
  (repeat (sslength ss)
    (setq ent    (ssname ss i)
          vlaObj (vlax-ename->vla-object ent)
          bName  (DGO:GetBlockName vlaObj)
    )
    (if (and (DGO:IsDuctBlock bName) (member bName selectedNames))
      (setq targetEnts (cons ent targetEnts))
    )
    (setq i (1+ i))
  )

  ;; Tinh Bounding Box va gom nhom thanh TUNG TUYEN ONG
  (setq bboxList       (mapcar 'DGO:GetOrientedBBox (reverse targetEnts))
        allRuns        (DGO:ClusterIntoRuns bboxList)
        remainingRuns  allRuns
        totalRuns      (length allRuns)
        runIdx         1
        countDim       0
        lastCreatedRun nil
        ;; Uu tien bat dau tu tuyen ong gan tam man hinh Zoom hien tai nhat
        refPt          (trans (getvar 'VIEWCTR) 1 0)
  )

  (vla-StartUndoMark doc)

  ;; Buoc 3: Uu tien chon tuyen ong GAN NHAT voi vung Zoom / diem vua Pick cho den khi xong
  (while remainingRuns
    (setq popRes        (DGO:PopNearestRun refPt remainingRuns)
          runBlocks     (car popRes)
          remainingRuns (cdr popRes)
    )

    ;; Lam sang (highlight) tuyen ong gan nhat hien tai
    (DGO:HighlightRun runBlocks 3)

    (setq runCenters  (mapcar 'car runBlocks)
          anchorBlock (DGO:ClosestBlockInRun (trans (getvar 'VIEWCTR) 1 0) runBlocks)
          basePt      (trans (car anchorBlock) 0 1)
    )

    (if lastCreatedRun
      (progn
        (initget "DAO")
        (setq sidePt
          (getpoint
            basePt
            (strcat "\nPick chon huong Dim tuyen ["
                    (itoa runIdx) "/" (itoa totalRuns)
                    "] (" (itoa (length runBlocks)) " dot) [Dao chieu tuyen vua roi (DAO)] <Bo qua>: "
            )
          )
        )
      )
      (setq sidePt
        (getpoint
          basePt
          (strcat "\nPick chon huong dat Dim cho tuyen ong gan nhat ["
                  (itoa runIdx) "/" (itoa totalRuns)
                  "] (" (itoa (length runBlocks)) " dot ong) <Bo qua tuyen nay>: "
          )
        )
      )
    )

    (cond
      ;; Neu nguoi dung go [DAO] ngay trong luc dang Pick -> Lat chieu tuyen vua Dim!
      ((= sidePt "DAO")
       (DGO:HighlightRun runBlocks 4)
       (setq lastCreatedRun (DGO:RebuildRunDims lastCreatedRun nil T doc oldCmdEcho oldOsMode))
       (princ "\n-> Da DAO CHIEU Dim cua tuyen ong vua roi sang phia doi dien!")
       ;; Dua tuyen hien tai quay lai danh sach de tiep tuc Pick cho tuyen hien tai
       (setq remainingRuns (cons runBlocks remainingRuns))
      )

      ;; Nguoi dung da Pick 1 diem dat Dim
      ((listp sidePt)
       (setq sidePt   (trans sidePt 1 0)
             refPt    sidePt
             runItems '()
       )
       (setvar 'CMDECHO 0)
       (setvar 'OSMODE 0)
       (foreach bboxData runBlocks
         (setq itemRec (DGO:DimSingleBlockByPick bboxData runCenters sidePt offsetDist))
         (if itemRec
           (setq runItems (cons itemRec runItems)
                 countDim (1+ countDim)
           )
         )
       )
       (setvar 'OSMODE oldOsMode)
       (setvar 'CMDECHO oldCmdEcho)

       ;; Luu tuyen ong vua Dim vao lich su *DGO:SavedRuns*
       (if runItems
         (progn
           (setq lastCreatedRun (list runBlocks (reverse runItems) offsetDist)
                 *DGO:SavedRuns* (cons lastCreatedRun *DGO:SavedRuns*)
           )
         )
       )
       (DGO:HighlightRun runBlocks 4)
       (setq runIdx (1+ runIdx))
      )

      ;; Nguoi dung nhan Enter / Space bo qua tuyen nay
      (T
       (setq refPt (trans (getvar 'VIEWCTR) 1 0))
       (DGO:HighlightRun runBlocks 4)
       (setq runIdx (1+ runIdx))
      )
    )
  )

  (vla-EndUndoMark doc)

  (princ
    (strcat "\nHoan tat! Da tao " (itoa countDim)
            " Dim tren " (itoa totalRuns)
            " tuyen ong theo DimStyle hien hanh [" (getvar 'DIMSTYLE) "]."
    )
  )

  ;; Buoc 4: Mo hop thoai Dieu Chinh Nhanh (co nut DAO CHIEU DIM, CAP NHAT KHOANG CACH, PICK TUYEN KHAC)
  ;;         cho den khi nguoi dung bam OK!
  (if lastCreatedRun
    (DGO:UpdateRunDistanceLoop lastCreatedRun doc oldCmdEcho oldOsMode)
  )

  (princ)
)

;; --------------------------------------------------------------------------
;; 13. Lenh UDOG: Goi bang Dieu Chinh Nhanh (Dao chieu Dim / Doi khoang cach)
;; --------------------------------------------------------------------------
(defun c:UDOG (/ *error* doc oldCmdEcho oldOsMode)
  (defun *error* (msg)
    (if *DGO:SavedRuns*
      (foreach rec *DGO:SavedRuns*
        (DGO:HighlightRun (nth 0 rec) 4)
        (DGO:HighlightRunItems (nth 1 rec) 4)
      )
    )
    (if oldOsMode (setvar 'OSMODE oldOsMode))
    (if oldCmdEcho (setvar 'CMDECHO oldCmdEcho))
    (if (and doc (= 8 (logand 8 (getvar 'UNDOCTL))))
      (vla-EndUndoMark doc)
    )
    (if (not (wcmatch (strcase msg) "*BREAK,*CANCEL*,*EXIT*"))
      (princ (strcat "\n[Loi]: " msg))
    )
    (princ)
  )

  (setq doc        (vla-get-ActiveDocument (vlax-get-acad-object))
        oldCmdEcho (getvar 'CMDECHO)
        oldOsMode  (getvar 'OSMODE)
  )

  (if (null *DGO:SavedRuns*)
    (princ "\nChua co tuyen ong nao duoc Dim trong phien lam viec nay! Hay chay lenh DOG truoc.")
    (DGO:UpdateRunDistanceLoop nil doc oldCmdEcho oldOsMode)
  )
  (princ)
)

;; Lenh DAO / DGO / DIMOG
(defun c:DAO () (c:UDOG))
(defun c:DGO () (c:DOG))
(defun c:DIMOG () (c:DOG))

(princ "\n===================================================================")
(princ "\n Da tai Lisp Dim Ong Gio!")
(princ "\n - Go lenh DOG  : Quet chon & Tu dong Dim ong gio (HTS-OG*, HTS-CAP*)")
(princ "\n - Go lenh DAO  : Dao chieu Dim / Cap nhat khoang cach Dim tuyen ong")
(princ "\n===================================================================")
(princ)
