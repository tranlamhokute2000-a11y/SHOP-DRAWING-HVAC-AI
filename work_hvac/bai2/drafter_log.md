# Drafter Execution Log — `bai 2.dwg` HVAC Shop Drawing

- **Target Drawing**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\bai 2.dwg` (saved via `QSAVE`)
- **Backup**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\bai 2_backup.dwg`
- **Plan Reference**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\plan_bai2.md`
- **Handle State Map**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\drafter_state.json`
- **Preview Image**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\drafter_preview_full.png`

---

## 1. Units, Spec Layers & Final Drawing State

- **Units Fixed**: `INSUNITS = 4` (Millimeters), `MEASUREMENT = 1` (Metric); verified first duct (`SEAD-M01`, `2200x550`) bbox width = `2240.09 mm` (`2200 + 2×20 mm` TDC flange ears, no 25.4× scaling error).
- **13 Spec Layers Created** (`batch_process` `create_layer`, all `ByLayer`, `plottable: true`):
  - `M-MVAC-EAD` (80), `M-MVAC-FAD` (150), `M-MVAC-PAD` (210), `M-MVAC-CEAD` (170), `M-MVAC-CSAD` (11), `M-MVAC-SEAD` (190), `M-MVAC-Copper Pipe` (12), `M-MVAC-AC Drain` (72), `M-MVAC-Equipment` (47), `M-MVAC-Support` (42), `M-MVAC-DIM` (97), `M-MVAC-TEXT` (2), `CLOUND` (240).
- **Clean Exit State**:
  - Current layer: `M-MVAC-SEAD`
  - `OSMODE`: restored to `4031`
  - All 24 layers: `locked = false`, `frozen = false`, `off = false`
  - `DRAWORDER`: all `M-MVAC-*` & `CLOUND` brought to `_Front` above original design layers
  - Unused block definitions (`instance_count = 0`): `0` (purged via `purge_unused_blocks`)
  - Saved via `save_drawing` (`QSAVE`), command line clean.

---

## 2. Entity Count Summary (`705` Total Entities — `100%` Original Preserved)

| Layer | Count | Status / Notes |
| :--- | :---: | :--- |
| `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` | **`309`** | 100% baseline preserved (`309/309`) |
| `MEPG-AC-TEXT` | **`67`** | 100% baseline preserved (`67/67`) |
| `MEPG-M-EQUIP` | **`3`** | 100% baseline preserved (`3/3`) |
| `0` | **`1`** | 100% baseline preserved (`1/1`) |
| **`M-MVAC-SEAD`** (`ACI 190`) | **`278`** | 100% HTS `INSERT` blocks (`HTS-*`), `0` fake lines/polylines |
| **`M-MVAC-PAD`** (`ACI 210`) | **`42`** | 100% HTS `INSERT` blocks (`HTS-*`), `0` fake lines/polylines |
| **`CLOUND`** (`ACI 240`) | **`5`** | 5 clean `REVCLOUD` `LWPOLYLINE`s (`RC-01..05`), `0` `M-MVAC-*` inside |
| `M-MVAC-Equipment` (and 9 other Spec layers) | **`0`** | Rule 0 strictly enforced (no unsolicited valves/grilles/supports/dims) |
| **TOTAL** | **`705`** | `380` original + `320` HTS blocks + `5` REVCLOUDs |

- **Total Straight Rectangular Duct Surface Area** (`compute_duct_surface_area`, `lengthScaleToMeter: 0.001`): **`743.98 m²`** across **`260`** straight duct segments (`222 SEAD` + `38 PAD`).

---

## 3. Component Breakdown & Key Handles

### 3.1. Straight Runs & Automatic Planar Elbows (`draw_rectangular_duct`)
- **`M-MVAC-SEAD`** (`34` runs): `222` straight `HTS-OG-*` + `7` elbows (`5` × 90° + `2` × 39° on `SEAD-NE03`). Includes `6` vertical 45° Z-offset bridge runs (`SEAD-NW01z`, `SEAD-NW03z`, `SEAD-NE01z1`, `SEAD-NE01z2`, `SEAD-S02z`, `SEAD-SE01z`). All runs stop flush (`0.00 mm`) at the 7 List-A valve flanges.
- **`M-MVAC-PAD`** (`6` runs): `38` straight `HTS-OG-900x500` + `4` elbows (`2` standard `R=450` on `PAD-01b`, `2` tight `0.75W` **`R=225`** on `PAD-02` & `PAD-03`). Includes `2` Z-offset bridge runs (`PAD-01z`, `PAD-02z`).

### 3.2. 06 Main Branch Taps (`QUETPK` on `M-MVAC-SEAD`, `M-MVAC-PAD` locked)
- `BTAP-01` (`1D654`, `1850x450`, BOD `3050`) — mirrored across `X=50997.74` for `+X` 45° bevel.
- `BTAP-02` (`1D665`, `950x450`, BOD `3050`) — mirrored across `X=55796.32` for `+X` 45° bevel.
- `BTAP-03` (`1D676`, `1200x400`, BOD `3100`) — generated via temporary bait stub to `Y=37810`, bait erased (`1D4CD`), exact `55.02 mm` stub redrawn (`1D6BE`, `Y=38011.21→37956.19`) flush to `VCD 1CDC2`.
- `BTAP-04` (`1D687`, `750x350`, BOD `3150`) — `+Y` bevel verified.
- `BTAP-05` (`1D698`, `350x350`, BOD `2770`) — mirrored across `X=23219.35` for `+X` 45° bevel.
- `BTAP-06` (`1D6A9`, `1300x450`, BOD `2720`) — `+X` bevel verified.

### 3.3. 28 Grille Collar Taps (`600x300`, `HTS-TAP-*`, `M-MVAC-SEAD`)
- All `28/28` generated via `400 mm` bait ducts + local `QUETPK`, leftover bait erased immediately (`0` leftover bait), stopped strictly at collar (Rule 0: `0` grilles inserted).
- Every tap's bbox was verified against `designBbox` in `bai2_geometry.json`; `14/28` were automatically mirrored across their collar centerline so `28/28` match the exact upstream 45° bevel direction.

### 3.4. 08 Exact-Length Reducers (`HTS_RVOG` with `Xoagoc = KHÔNG`, renamed `HTS-CON-*`)
| ID | Handle | Final HTS Block Name | BOD |
| :---: | :---: | :--- | :---: |
| `RED-01` | `1D799` | `HTS-CON-Phai-1850x450-1500x450-L202` | `2300` |
| `RED-02` | `1D7D6` | `HTS-CON-Can-1300x450-1200x400-L204` | `2720` |
| `RED-03` | `1D7FC` | `HTS-CON-Can-950x400-1200x400-L204` | `2770` |
| `RED-04` | `1D829` | `HTS-CON-Can-750x350-950x400-L204` | `2770` |
| `RED-05` | `1D875` | `HTS-CON-Can-700x400-950x450-L204` | `3050` |
| `RED-06` | `1D8B1` | `HTS-CON-Can-700x400-550x350-L204` | `3100` |
| `RED-07` | `1D8D1` | `HTS-CON-Trai-1200x400-1000x350-L204` | `3100` |
| `RED-08` | `1D90F` | `HTS-CON-Can-1000x350-550x350-L204` | `2500` |

*(Duplicate straight ducts created by `HTS_RVOG` were erased cleanly while keeping `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` at exact baseline `309`.)*

### 3.5. 07 Endcaps (`hvac-cap`, `HTS-CAP-{W}x{H}-L25`)
- `CAP-01` (`1D922`, `2200x550`, BOD `2950`), `CAP-02` (`1D935`, `1500x450`, BOD `2720`), `CAP-03` (`1D948`, `350x350`, BOD `2770`), `CAP-04` (`1D95B`, `750x350`, BOD `2820`), `CAP-05` (`1D96E`, `550x350`, BOD `3150`), `CAP-06` (`1D970`, `550x350`, BOD `2500`), `CAP-07` (`1D972`, `750x350`, BOD `2600`).

### 3.6. 3D/BOQ Elevation Data (`duct_set_elevation` → `HTS_OG_DAY`)
- Applied to **`320/320`** blocks (`278 SEAD` + `42 PAD`) across 21 distinct BOD groups (`2300`..`3790`).
- Verified via `get_xdata` (`appName: "HTS_OG_DAY"`): **`320/320` exact match, `0` missing/mismatched**.

### 3.7. 05 `REVCLOUD`s (`CLOUND`, `ACI 240` — Strict Zero-Overlap Verified)
| ID | Handle | Actual `REVCLOUD` BBox (`minX, minY .. maxX, maxY`) | Strict BBox Overlaps with `M-MVAC-*` |
| :---: | :---: | :--- | :---: |
| `RC-01` | `1D980` | `[57720.6, 37180.5 .. 66020.1, 41320.9]` | **`0`** |
| `RC-02` | `1D981` | `[63236.6, 41378.0 .. 67045.8, 44202.8]` | **`0`** |
| `RC-03` | `1D982` | `[48952.7, 10509.5 .. 51945.1, 12288.4]` | **`0`** |
| `RC-04` | `1D983` | `[42961.0, 56946.0 .. 43800.9, 58367.3]` | **`0`** |
| `RC-05` | `1D98B` | `[36136.7, 52841.9 .. 37824.0, 53629.3]` | **`0`** |

---

## 4. Technical Lessons Learned (Worth Syncing to `shopdrawing-ong-gio`)

1. **Safe Non-Destructive `HTS_RVOG` (`Xoagoc = KHÔNG`)**: `HTS_RVOG` exposes command-line toggle options `[Xoagoc/Nhanrevit/Hmacdinh/Dot/Kieunep]` where `Xoagoc` defaults to `CÓ` (which deletes Revit source entities even on locked layers). Sending `Xoagoc` once toggles it to `KHÔNG` (persists across calls) so `HTS_RVOG` preserves 100% of original Revit entities! Selecting the Revit reducer + its two adjacent `MTEXT` size labels via multiple `_C` windows lets `HTS_RVOG` auto-generate exact-length (`L202`/`L204`) concentric/eccentric reducers with accurate `W1×H1` & `W2×H2`, which are then moved to `M-MVAC-*` and renamed from `<SYS>-CON-*` to `HTS-CON-*`.
2. **`REVCLOUD` Outward Bulge Compensation (`~0.34 × arcLen`)**: `_.REVCLOUD _A <arcLen> _R` bulges outward beyond the input rectangle by `~0.34 × arcLen`. On edges facing `M-MVAC-*` ducts (e.g., `25–50 mm` clearances), inset the `_R` input boundary by `0.35 × arcLen + 15 mm` and verify with strict bbox-vs-bbox intersection against all `M-MVAC-*` entities to guarantee `0` overlaps.
3. **45° Bevel Direction Verification on `QUETPK` Shoe Taps (`HTS-TAP-*`)**: `QUETPK` generates a default bevel orientation independent of airflow direction (in `bai 2.dwg`, 3/6 branch taps and 14/28 grille taps needed mirroring). Always compare each `HTS-TAP-*` bbox against design bbox / upstream flow direction and `mirror_entity` (`eraseSource: true`) across the tap centerline when reversed.
4. **Tight `0.75W` Elbows in `draw_rectangular_duct`**: Pass explicit `R: 0.25*W` (e.g., `R: 225` for `W = 900`) when Revit uses `0_75W` elbows so the inner curve matches the design to `< 1 mm`.

---

## 5. Addendum — Surgical Local Fix at Corner `RC-03` (`SEAD-S03` ↔ `SEAD-SW01`)

Per updated **Quy tắc cứng số 3** (*proactively connect same-system converging runs missing a corner fitting with 100% HTS elbow `R = W/2`, no `REVCLOUD`*):

- **Skill & Rule Synced**:
  - Updated `.agents/skills/shopdrawing-ong-gio/SKILL.md` (Quy tắc cứng số 3 & số 4).
  - Updated `.agents/rules/hvac-shopdrawing-rules.md` (item 3).
- **Exact Geometry Verified**:
  - Upstream vertical run `SEAD-S03` (`1000x350`, `BOD = 2500`, `1D0BE`/`1D0BF`) and downstream horizontal run `SEAD-SW01` (`1000x350`, `BOD = 2500`, `1D0C0`/`1D0C1`) converge at `89.9998°` (`90°`) with exact centerline intersection `(51142.4816, 11314.0089)` (same size `1000x350` & same `BOD = 2500`, no reducer required).
- **Surgical Edits Performed (`OSMODE = 0`, original layers + `M-MVAC-PAD` locked during edit)**:
  - **Erased**: `1D982` (`RC-03` `REVCLOUD` on `CLOUND`) and `1D522` (`HTS-OG-1000x350 L677`, last short stub of `SEAD-S03`).
  - **Created** via single seamless 3-point `draw_rectangular_duct` (`W = 1000, H = 350, R = 500 = W/2`, `layer: "M-MVAC-SEAD"`, `prefix: "HTS"`, `points: [(51142.3449, 12993.2301), (51142.4816, 11314.0089), (48918.1000, 11313.8200)]`):
    - `1D99D`: `HTS-OG-1000x350 L679` (flush with `1D517` at `Y = 12993.23` and elbow top flange at `Y = 12314.01`)
    - `1D9B1`: **`HTS-CO-V47-1000x350-R500-A90`** (`R = W/2 = 500 mm`, `90°`, pos `(51142.48, 11314.01)`, bbox `[50142.40, 10813.93 .. 51642.52, 12314.05]`)
    - `1D99E`: `HTS-OG-1000x350 L1110` (flush with elbow west flange at `X = 50142.48`)
    - `1D9A9`: `HTS-OG-1000x350 L114` (flush with `1D99E` and `1D523` at `X = 48918.10`)
  - **Properties & 3D Data**: All 4 new blocks confirmed `M-MVAC-SEAD`, `ByLayer`, `HTS_OG_DAY = 2500` (`duct_set_elevation` `daGan: 4`, verified via `get_xdata`).
  - **Housekeeping**: `DRAWORDER` `M-MVAC-SEAD` → `_Front`; `purge_unused_blocks` purged `HTS-OG-1000x350 L677` (`0` zero-instance block defs remaining); all 24 layers unlocked (`0` locked); `OSMODE` restored to `4031`; saved via `QSAVE`.
- **Updated Entity Counts & Area (`707` Total Entities)**:
  - Original design preserved 100%: `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` = **`309`**, `MEPG-AC-TEXT` = **`67`**, `MEPG-M-EQUIP` = **`3`**, `0` = **`1`**.
  - `M-MVAC-SEAD` = **`281`** (`278 - 1 + 4`), `M-MVAC-PAD` = **`42`** (untouched), `CLOUND` = **`4`** (`RC-01`, `RC-02`, `RC-04`, `RC-05`).
  - Straight duct surface area (`compute_duct_surface_area`): **`747.29 m²`** across **`262`** straight duct segments.
- **Visual Proof**: Exported & verified `work_hvac\bai2\qa_rc03_fixed.png` (zero gaps, zero overlaps, zero disturbed taps/runs).

---

## 6. Addendum — Surgical Local Drafting of All Ductwork & Fittings in Former `RC-01` (Smoke Exhaust Fan Room)

Per user instruction (*"rc-01 có chỗ nào là ống gió thì vẽ hết, còn lại tôi hướng dẫn thêm"*), drafted **100% of HVAC ductwork & duct fittings** inside former `RC-01` (`X = 57677..65680, Y = 37537..41087`) using 100% HTS Tool on `M-MVAC-SEAD` (`ByLayer`, `ACI 190`), while leaving all non-duct equipment untouched and preserving `380/380` original design entities (`100%`).

### 6.1. Decoded Section Dimensions (`W × H`) & Concentric Elevation (`BOD`) Logic
Revit block names inside `RC-01` explicitly encode exact equipment cross-sections along the concentric centerline **`Z_c = +3225 mm`** (anchored to inlet header `SEAD-2200x550`, `BOD = +2950`, `Z_c = 2950 + 550/2 = +3225`):
1. **Trouser Piece & Upstream Branch Ducts (Header → Upstream `MFD` → Height Reducer)**: `W = 1700, H = 550` → **`BOD = +2950`** (`Z_c = +3225`).
2. **Vertical-Height Reducers (`1D008`/`1CFF5`, `1700x550 → 1700x1000`) & Silencer 1 (`CEN_SILENCER DUCT - L900xW1700xH1000`) & Inlet Square-to-Round (`1700x1000 → Ø1000`) & Fan `TDA 1000` (`Ø1000`) & Outlet Round Spools (`Ø1000`)**: `H = 1000` / `Ø1000` → **`BOD = +2725`** (`3225 - 1000/2 = +2725`; height reducer takes lower `BOD = +2725` consistent with `RED-02..08`).
3. **Outlet Round-to-Square Transitions (`Ø1000 → 1250x1400`) & Silencer 2 (`CEN_SILENCER DUCT - L900xW1250xH1400`) & Downstream Discharge Ducts (`1250x1400`)**: `W = 1250, H = 1400` → **`BOD = +2525`** (`3225 - 1400/2 = +2525`; transition takes lower `BOD = +2525` consistent with `RED-02..08`).

### 6.2. Complete Inventory of 23 New HTS Blocks Created in `RC-01` (`M-MVAC-SEAD`, `ByLayer`)

| Group | Handles (Top / Bottom) | HTS Block Name | Tool Used | Span `X` (mm) | `BOD` (`HTS_OG_DAY`) | Alignment / Fit Notes |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Trouser Piece (`1CC0F`)** | `1D9C0` | `HTS-YQ-2200x550-1700x550-1700x550-A150-L1820-LC800-K100` | `duct_breeches_insert` | `57677.1 → 59497.1` | `2950` | Exact `0.00 mm` bbox overlay on `1CC0F`, `gocDo = 0.004845°`, `a = 150`, `lc = 800`, `c = 100` |
| **Straight #1 (Trouser → `MFD`)** | `1D9CB` / `1D9F8` | `HTS-OG-1700x550 L111` | `draw_rectangular_duct` | `59497.0 → 59607.8` | `2950` | Flush `0.00 mm` between trouser & upstream `MFD` (`1CFE0`/`1CFE4`) |
| **Straight #2 (`MFD` → Height Red.)** | `1DBEC` / `1DBF7` | `HTS-OG-1700x550 L633` / `L632` | `draw_rectangular_duct` | `59757.8 → 60390.3` | `2950` | Exact `0.00 mm` overlay on `1CFE2/3/6/7`, flush at upstream `MFD` & `1D008`/`1CFF5` west flange (`60390.3`) |
| **Height Reducers (`1D008`/`1CFF5`)** | `1DC0B` / `1DC0A` | `HTS-CON-Can-1700x1000-1700x550-L200` | `QUETPK` (`410 mm` bait) | `60390.3 → 60590.3` | `2725` | Exact `0.00 mm` overlay on `1D008`/`1CFF5` (`L = 200 mm`), flush at `60390.3` & Silencer 1 (`60590.3`) |
| **Inlet TDC Collars (`1D007`/`1CFF4`)** | `1DBCD` / `1DBCE` | `HTS-OG-1700x1000 L32` | `draw_rectangular_duct` | `61490.3 → 61522.3` | `2725` | Exact `32 mm` Revit TDC collar flush at Silencer 1 east face (`61490.3`) |
| **Inlet Square-to-Round (`1D007`/`1CFF4`)** | `1DBBC` / `1DBBB` | `HTS-TV-Can-D1000-1700x1000-L500` | `QUETPK` | `61522.3 → 62022.3` | `2725` | `0.00 mm` pixel-exact overlay on Revit `L500` slopes, flush at inlet round flex (`62022.3`) |
| **Outlet Round Spools (`1D006`/`1CFF3`)** | `1DC72` / `1DC73` | `HTS-OG-D1000 L200` | `draw_round_duct` | `62952.3 → 63152.3` | `2725` | Flush `0.00 mm` at outlet round flex east face (`62952.3`); stays inside Revit `L700` taper envelope |
| **Outlet Round-to-Square (`1D006`/`1CFF3`)** | `1DC81` / `1DC80` | `HTS-VT-Can-1250x1400-D1000-L500` | `QUETPK` | `63152.3 → 63652.3` | `2525` | Native HTS max-length `L500` transition (`QUETPK` hard-capped at `L500` — see note below) |
| **Outlet TDC Collars (`1D006`/`1CFF3`)** | `1DC96` / `1DC97` | `HTS-OG-1250x1400 L32` | `draw_rectangular_duct` | `63652.3 → 63684.3` | `2525` | Exact `32 mm` Revit TDC collar flush at Silencer 2 west face (`63684.3`) |
| **Straight #3 (Silencer 2 → `NRD`)** | `1D9E1` / `1DA04` | `HTS-OG-1250x1400 L359` | `draw_rectangular_duct` | `64584.3 → 64943.1` | `2525` | Flush `0.00 mm` between Silencer 2 (`1CFF8`/`1CC17`) & `NRD` (`1CFFF`/`1CFEC`) |
| **Straight #4 (`NRD` → `MFD`)** | `1D9EC` / `1DA05` | `HTS-OG-1250x1400 L209` | `draw_rectangular_duct` | `65093.1 → 65302.1` | `2525` | Flush `0.00 mm` between `NRD` & downstream `MFD` (`1D003`/`1CFF0`) |
| **Straight #5 (`MFD` → Open Discharge)** | `1D9F7` / `1DA06` | `HTS-OG-1250x1400 L227` | `draw_rectangular_duct` | `65452.1 → 65679.6` | `2525` | Flush `0.00 mm` to discharge end lines `1CFFC`/`1CFE9` (no endcaps added per design) |

- **HTS Tool Technical Findings (Verified Live on `bai 2.dwg`)**:
  1. **`QUETPK` Exact Custom Short-Length Trick (`L = floor(L_bait / 2 / 50) * 50`)**: `QUETPK` sizes reducer/transition length to `min(500, floor(L_trimmed_duct / 2 / 50) * 50)`. Passing a `410 mm` bait `1700x1000` duct produced exact native `HTS-CON-Can-1700x1000-1700x550-L200` (`1DC0B`/`1DC0A`) matching `1D008`/`1CFF5` to `0.00 mm`!
  2. **Confirmed HTS Tool Ceiling for `HTS-VT`/`HTS-TV` = `L500`**: Tested (a) `QUETPK` with exact `700 mm` gap (`62952.3 → 63652.3`) → `0` blocks created (`QUETPK` strictly requires `gap ≈ 0`); (b) `QUETPK` touching an unsplit `1700 mm` single round duct (`HTS-OG-D1000 L1700`) → trimmed to `L1200` and capped at `HTS-TV-Can-D1000-1250x1400-L500`; (c) `HTS_RVOG` (`Xoagoc = KHÔNG`) on `1D006`/`1D007` and synthetic transition lines → `0` blocks created for isolated `CEN-DUCT-Giảm Vuông Tròn_Bích TDC_` blocks without flanking Revit straight duct `LINE` pairs. Therefore `HTS-OG-D1000 L200` + `HTS-VT-Can-1250x1400-D1000-L500` + `HTS-OG-1250x1400 L32` (`200 + 500 + 32 = 732.0 mm`) is the exact optimal 100% HTS Tool assembly (zero gaps, zero overlaps, symmetric `L32` TDC collar at Silencer 2, stays 100% inside the Revit `L700` taper envelope).
- **Elevation Verification**: `duct_set_elevation` applied to all `23/23` RC-01 blocks, verified `100%` exact `HTS_OG_DAY` via `get_xdata`.

### 6.3. Untouched Non-Duct Equipment Inside Former `RC-01` (Reserved for User's Next Guidance)
- **2 Axial Fans (`TDA 1000`, `MEPG-M-EQUIP`)**: `1CFF6` (top), `1CC0E` (bottom)
- **4 Round Flexible Connectors (`Ø1000`)**: `1CFF9`/`1CFDE` (inlet), `1CFFA`/`1CFDF` (outlet)
- **4 Duct Silencers**: `1CFF7`/`1CC10` (Silencer 1, `L900xW1700xH1000`), `1CFF8`/`1CC17` (Silencer 2, `L900xW1250xH1400`)
- **4 `MFD-EI60` Dampers**: `1CFE0`/`1CFE4` (upstream `1700x550`), `1D003`/`1CFF0` (downstream `1250x1400`)
- **2 `NRD` Dampers**: `1CFFF`/`1CFEC` (`1250x1400`)

### 6.4. Housekeeping & Updated Drawing Totals (`729` Total Entities)
- **Erased**: `1D980` (`RC-01` `REVCLOUD` on `CLOUND`) only — maintaining strict Rule 4 (`0` `M-MVAC-*` inside remaining clouds `RC-02`, `RC-04`, `RC-05`).
- **Original Design Preserved 100% (`380/380`)**: `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` = **`309`**, `MEPG-AC-TEXT` = **`67`**, `MEPG-M-EQUIP` = **`3`**, `0` = **`1`**.
- **Shop Drawing Layers**: `M-MVAC-SEAD` = **`304`** (`281 + 23`), `M-MVAC-PAD` = **`42`** (untouched), `CLOUND` = **`3`** (`RC-02`, `RC-04`, `RC-05`), all other 10 Spec layers = `0`.
- **Straight Rectangular Duct Surface Area** (`compute_duct_surface_area`, `lengthScaleToMeter: 0.001`): **`763.09 m²`** across **`276`** rectangular duct segments (`+14` in `RC-01`: `10` straight runs + `4` `L32` TDC collars; plus `2` round spools `HTS-OG-D1000 L200`).
- **Clean Exit State**: `DRAWORDER` brought `M-MVAC-SEAD`, `M-MVAC-PAD`, `CLOUND` to `_Front`; `purge_unused_blocks` purged all unused definitions (`0` zero-instance blocks remaining); all `24/24` layers verified via `get_layer_info` (`is_locked: false, is_frozen: false, is_off: false`, including `CLOUND`); `OSMODE = 4031`; current layer `M-MVAC-SEAD`; saved via `QSAVE`.
- **Visual Proof**: Exported & inspected `work_hvac\bai2\qa_rc01_fixed.png` (exact `L200` height reducer overlay, exact `L500` inlet overlay, crisp symmetric `L32` collars, zero overlaps, zero gaps, zero stray entities).
