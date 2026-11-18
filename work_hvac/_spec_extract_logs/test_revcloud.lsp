(defun c:TESTRC (/ e1 e2)
  (setvar "CMDECHO" 1)
  ;; Method 1: Draw closed polyline first, then convert to REVCLOUD via Object option
  (command "_RECTANG" '(1000.0 1000.0) '(4000.0 2500.0))
  (setq e1 (entlast))
  (command "_.REVCLOUD" "_A" 300 "_O" e1 "_N")
  (princ (strcat "\n[TEST1_OBJECT] CMDACTIVE=" (itoa (getvar "CMDACTIVE")) " ENT=" (vl-princ-to-string (entget (entlast))) "\n"))

  ;; Method 2: Rectangular REVCLOUD directly
  (command "_.REVCLOUD" "_A" 300 "_R" '(5000.0 1000.0) '(8000.0 2500.0))
  (princ (strcat "\n[TEST2_RECT] CMDACTIVE=" (itoa (getvar "CMDACTIVE")) " ENT=" (vl-princ-to-string (entget (entlast))) "\n"))
  (princ)
)
