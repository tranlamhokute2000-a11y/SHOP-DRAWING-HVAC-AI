# HỒ SƠ PHÂN TÍCH KỸ THUẬT BẢN VẼ THIẾT KẾ ỐNG GIÓ HVAC
**Tệp bản vẽ khảo sát**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\shop drawwing onng gio.dwg`
**Chuyên gia thực hiện**: `plan-analyst` (Chế độ 100% Read-Only qua HTS MCP + `accoreconsole.exe` AutoLISP + Phân tích hình học)
**Dữ liệu cấu trúc đi kèm**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac\02_duct_network.json` & `02_raw_entities.json`

---

## 1. Tổng Quan Bản Vẽ & Kiểm Tra Đồng Bộ Phiên AutoCAD Đang Mở vs. Tệp Trên Đĩa

- **Đơn vị bản vẽ (`INSUNITS`)**: `Millimeters` (mm)
- **Phạm vi hình học (`Extents`)**: `min = (4390.11, -4344.41)` → `max = (45848.62, 63989.85)` (Kích thước vùng bản vẽ ~ `41.46 m × 68.33 m`)
- **Tổng số Layer**: `8` layers (`0`, `MEPG-XREF-ARC`, `MEPG-M-EQUIP`, `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`, `MEPG-AC-M-Cấp gió tạo áp-Pressurization Air-PAD`, `MEPG-AC-M-Cấp gió tươi không khí-Fresh Air-FAD`, `MEPG-AC`, `MEPG-AC-TEXT`) — trong đó chỉ có **4 layer chứa đối tượng**.
- **Đối chiếu số lượng thực thể giữa Phiên AutoCAD đang mở (cổng 5088) và File lưu trên đĩa**:
  - File trên đĩa (`temp_design_copy.dwg`): **228 thực thể** (`99 LINE` + `34 MTEXT` + `95 INSERT`).
  - Phiên AutoCAD đang mở trực tiếp: **229 thực thể** (`99 LINE` + `34 MTEXT` + `95 INSERT` + **`01 LWPOLYLINE` chưa lưu**).
  - **Phát hiện 02 thay đổi chưa nhấn Save (`Ctrl+S`) trên phiên AutoCAD đang mở** (đã được đồng bộ 100% vào dữ liệu phân tích):
    1. Toàn bộ **17 nhãn kích thước `MTEXT`** trên layer `MEPG-AC-TEXT` đã được đổi tiền tố từ `"SED-..."` (trên đĩa) thành **`"SEAD-..."`** (trên AutoCAD đang mở) để khớp với ký hiệu chuẩn `SEAD` của file Spec.
    2. Có thêm **01 thực thể `LWPOLYLINE` dạng đám mây `REVCLOUD`** (`Handle = 10E5A`, Layer `"0"`, `bbox = [5412.24, -4344.41 .. 10793.01, -1590.79]`) nằm ở khoảng trắng góc dưới bên trái (không bao quanh đối tượng nào — khả năng là nét test `REVCLOUD` mẫu của Sếp Hồ với bước cung ~`450–550 mm`). **Lưu ý cho `@cad-drafter`**: Giữ nguyên `10E5A` không xóa, và dùng bước cung ~`500 mm` tương tự khi vẽ các `REVCLOUD` hỏi Sếp.
- **Lưu ý góc xoay trục cực nhỏ từ Revit**: Các tuyến ống dài xuất từ mô hình Revit có độ nghiêng lưới cực nhỏ `~0.00485°` (`dx ≈ -1.34 mm` trên chiều dài `15,844 mm`). Tọa độ tim dưới đây giữ nguyên chính xác đến `0.01 mm` theo đúng hình học thực tế để vẽ đè khít 100% lên bản thiết kế.

---

## 2. Nhận Diện Hệ Thống HVAC & Bảng Quy Đổi Layer Sang Chuẩn Spec

- **Chủng loại hệ thống**: Bản vẽ thể hiện **01 hệ thống duy nhất** là **Hệ thống Ống gió Hút khói Sự cố Tầng hầm B1 (`Smoke Exhaust Air Duct - SEAD`)**, tiêu chuẩn chống cháy **`EI60`**, kết nối bích nẹp **`TDC Flange`** (xuất từ View Revit `MB HỆ THỐNG ĐHKK HẦM B1`).
- **Nguyên lý làm việc & Chiều dòng không khí**:
  - Khi có sự cố cháy tại tầng hầm B1, khói được hút qua **24 miệng gió hút khói kèm van điều chỉnh lưu lượng (`EAG_OBD 600x300mm`)** gắn trên 24 chân rẽ gót giày dọc hai nhánh chính:
    1. **Nhánh Trái (`LEFT_BRANCH`, gồm 09 miệng gió)**: bắt đầu từ đầu bịt `550x350` tại `(16001.87, 52835.08)` thu gom khói đi về phía Nam tăng dần tiết diện `550x350 → 800x400 → 1100x400 → 1450x400`, rẽ cút 90° sang phía Đông `1450x400 → 1600x450`, qua van `VCD` (`10B17`) và côn mở `1600x450 → 2200x600` vào ống góp chính.
    2. **Nhánh Phải & Tuyến Trên (`RIGHT_TOP_BRANCH`, gồm 15 miệng gió)**: bắt đầu từ đầu bịt `550x350` góc Tây-Bắc tại `(4415.11, 59204.66)`, qua 2 cút bậc thang lên tuyến ngang phía Bắc đi sang Đông `550x350 → 800x400 → 950x450`, rẽ cút 90° đi về phía Nam dọc biên Đông qua 2 cụm chuyển hướng tránh kết cấu (Jog #2 và Jog #1) tăng dần tiết diện `950x450 → 1150x500 → 1400x500 → 1700x500`, qua van `VCD` (`10BAE`) và đấu vào sườn Bắc của ống góp chính `2200x600` qua chân rẽ gót giày `1700x500` (`10D51`).
  - Từ **Ống góp chính `SEAD-2200x600` (`BOD=FFL+2450`)**, luồng khói chia đôi qua **Chạc quần (`Trouser Piece 10CBD`)** vào **02 cụm Quạt hướng trục hút khói song song (`Kruger Axial Fan TDC 1250`, `10CA7` & `10CA5`)**, mỗi cụm gồm: `Van chặn lửa động cơ MFD-EI60 → Côn tăng chiều cao 1700x600/1000 → Tiêu âm hút W1700xH1000xL900 → Côn Vuông-Tròn Ø1250 → Khớp mềm tròn Ø1250 → Quạt trục TDC 1250 → Khớp mềm tròn Ø1250 → Côn Tròn-Vuông 1250x1400 → Tiêu âm đẩy W1250xH1400xL900 → Van một chiều NRD → Van MFD-EI60 → Đầu ống thải ra trục/louver tại X = 45603.42`.

| Hạng mục | Layer trên bản vẽ thiết kế | Layer chuẩn (`Spec-layer ký hiệu ống gió.dwg`) | Màu chuẩn (ACI) | Ghi chú |
| --- | --- | --- | :---: | --- |
| Ống gió & Phụ kiện hút khói (`SEAD`) | `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` | **`M-MVAC-SEAD`** | **190** | Bắt buộc vẽ bằng 100% HTS Tool |
| Thiết bị cơ (`Quạt hút khói`) | `MEPG-M-EQUIP` | **`M-MVAC-Equipment`** | **47** | 02 Quạt hướng trục Kruger TDC 1250 |
| Chữ ghi chú kích thước & cao độ | `MEPG-AC-TEXT` | **`M-MVAC-TEXT`** | **2** | 34 MTEXT (`SEAD-WxH` + `BOD=FFL+...`) |
| Đường kích thước (`Dim`) | *(Chưa có)* | **`M-MVAC-DIM`** | **97** | Dùng khi Dim kích thước Shop Drawing |
| Đám mây khoanh vùng hỏi Sếp (`REVCLOUD`) | `0` (1 mây test `10E5A`) | **`CLOUND`** | **240** | Khoanh mây `RC-01` .. `RC-08` |

---

## 3. Quy Luật Cao Độ (`BOD` / `TOD`) & Bảng Tuyến Chạy Liên Tục Cho HTS Tool (`16 Runs`)

### 3.1. Giải mã quy luật cao độ 3D của thiết kế
1. **Ống góp chính (`SEG-M01`, `2200x600`)**: `BOD = FFL+2450` → Tim ống `Z = +2750`, Đỉnh ống `TOD = +3050`.
2. **Toàn bộ Nhánh Trái (`1600x450 → 1450x400 → 1100x400 → 800x400 → 550x350`)**: Đi **PHẲNG ĐÁY (`Flat Bottom`, `BOD = FFL+2500`)** xuyên suốt toàn tuyến!
3. **Nhánh Phải phần dưới (`1700x500 → 1400x500`, từ `Y = 3427` đến `Y = 37128`)**: Đi **PHẲNG ĐÁY (`BOD = FFL+2500`, `H = 500`, `TOD = +3000`, Tim `Z = +2750` — đồng tâm cao độ với ống góp `2200x600`)**.
4. **Bước nhảy cao độ `+45 mm` tại Jog #2 (`Y = 37332 .. 40735`)**: Trong mô hình Revit 3D gốc, đoạn ống ngang Jog #2 (`W=1150, H=500`) bị nghiêng dốc ~`1.09°` làm xuất hiện **nét đôi lệch `9.49 mm`** trên mặt bằng và nâng đáy ống từ `BOD = FFL+2500` lên **`BOD = FFL+2545`** (đã đánh dấu khoanh mây **`RC-03`**).
5. **Nhánh Phải phần trên & Tuyến Ngang Phía Bắc (`1150x500 → 950x450 → 800x400 → 550x350`, từ `Y = 40735` đến hết tuyến)**: Đi **PHẲNG ĐỈNH (`Flat Top`, `TOD = FFL+3045`)**! Cụ thể khi `H` giảm `50 mm` qua mỗi côn thu (`500 → 450 → 400 → 350`), `BOD` tăng tương ứng `+50 mm` (`+2545 → +2595 → +2645 → +2695`).

### 3.2. Bảng 16 Tuyến Ống Chữ Nhật Chạy Liên Tục (`hts_continuous_runs`)
> Dành trực tiếp cho `@cad-drafter` gọi `draw_rectangular_duct` (các tuyến cùng tiết diện `WxH` đi qua đỉnh góc sẽ tự động sinh cút vuông 90° đúng vị trí):

| Mã Run | Kích thước `W×H` (mm) | `BOD` (FFL+) | Cút 90° tự động | Chuỗi tọa độ tim `(X, Y)` chính xác | Các phân đoạn cấu thành |
| --- | :---: | :---: | :---: | --- | --- |
| **`RUN-M01`** | `2200×600` | `+2450` | 0 | (37579.39, 2175.33) → (35222.39, 2175.33) | `SEG-M01` |
| **`RUN-L01A`** | `1600×450` | `+2500` | 0 | (35018.39, 2175.34) → (34731.76, 2175.34) | `SEG-L01A` |
| **`RUN-L01B`** | `1600×450` | `+2500` | 0 | (34581.7, 2175.33) → (20644.36, 2175.33) | `SEG-L01B` |
| **`RUN-L02-L03`** | `1450×400` | `+2500` | 1 | (20440.36, 2175.32) → (15830.93, 2175.06) → (15829.91, 15018.8) | `SEG-L02, SEG-L03` |
| **`RUN-L04`** | `1100×400` | `+2500` | 0 | (16004.85, 15668.82) → (16003.51, 31513.08) | `SEG-L04` |
| **`RUN-L05`** | `800×400` | `+2500` | 0 | (16003.49, 31717.08) → (16002.6, 42282.08) | `SEG-L05` |
| **`RUN-L06`** | `550×350` | `+2500` | 0 | (16002.73, 42486.08) → (16001.87, 52835.08) | `SEG-L06` |
| **`RUN-R01A`** | `1700×500` | `+2500` | 0 | (36459.09, 3427.34) → (36459.06, 3958.23) | `SEG-R01A` |
| **`RUN-R01B-R02-R03`** | `1700×500` | `+2500` | 2 | (36459.05, 4108.26) → (36458.95, 7455.34) → (44966.72, 7455.77) → (44966.72, 20994.85) | `SEG-R01B, SEG-R02, SEG-R03` |
| **`RUN-R04-R05-R06`** | `1400×500` | `+2500` | 2 | (45116.72, 21198.84) → (45116.19, 28879.73) → (40680.65, 28879.58) → (40680.65, 37127.69) | `SEG-R04, SEG-R05, SEG-R06` |
| **`RUN-R07-R08`** | `1150×500` | `+2545` | 2 | (40680.54, 37331.69) → (40680.45, 39577.65) → (45083.15, 39577.84) → (45082.04, 53864.99) | `SEG-R07A, SEG-R07B, SEG-R08` |
| **`RUN-R09-T01`** | `950×450` | `+2595` | 1 | (45082.02, 54068.99) → (45081.3, 63484.78) → (34735.8, 63483.98) | `SEG-R09, SEG-T01` |
| **`RUN-T02`** | `800×400` | `+2645` | 0 | (34531.8, 63483.92) → (21317.76, 63482.79) | `SEG-T02` |
| **`RUN-T03-T04-T05`** | `550×350` | `+2695` | 2 | (21113.76, 63482.77) → (14335.01, 63482.25) → (14335.28, 59204.66) → (4415.11, 59204.66) | `SEG-T03, SEG-T04, SEG-T05` |
| **`RUN-FAN1-STUBS`** | `1700×600` | `+2450` | 0 | SEG-F1-IN1[1700x600]: (39399.39,1250.33)→(39444.94,1250.33)<br>SEG-F1-IN2[1700x600]: (39594.94,1250.32)→(39998.68,1250.3)<br>SEG-F1-OUT1A[1250x1400]: (44814.68,1250.22)→(44886.11,1250.22)<br>SEG-F1-OUT1B[1250x1400]: (44978.61,1250.22)→(45103.51,1250.22)<br>SEG-F1-OUT2[1250x1400]: (45253.51,1250.22)→(45603.42,1250.22) | `SEG-F1-IN1, SEG-F1-IN2, SEG-F1-OUT1A, SEG-F1-OUT1B, SEG-F1-OUT2` |
| **`RUN-FAN2-STUBS`** | `1700×600` | `+2450` | 0 | SEG-F2-IN1[1700x600]: (39399.39,3100.33)→(39444.94,3100.33)<br>SEG-F2-IN2[1700x600]: (39594.94,3100.32)→(39998.68,3100.3)<br>SEG-F2-OUT1A[1250x1400]: (44814.68,3100.08)→(44886.11,3100.08)<br>SEG-F2-OUT1B[1250x1400]: (44978.61,3100.08)→(45103.52,3100.08)<br>SEG-F2-OUT2[1250x1400]: (45253.52,3100.08)→(45603.42,3100.08) | `SEG-F2-IN1, SEG-F2-IN2, SEG-F2-OUT1A, SEG-F2-OUT1B, SEG-F2-OUT2` |

### 3.3. Bảng Chi Tiết Toàn Bộ 34 Phân Đoạn Ống Thẳng & Ghép Nhãn `MTEXT` (100%)

| Mã Đoạn | Nhánh | `W×H` (mm) | `BOD` | Điểm đầu tim `(x1, y1)` | Điểm cuối tim `(x2, y2)` | Dài `L` (mm) | Nhãn Size (`Handle`) | Nhãn BOD (`Handle`) | Nguồn xác định |
| --- | --- | :---: | :---: | --- | --- | ---: | --- | --- | --- |
| `SEG-F1-OUT2` | `FAN_TRAIN_1_SOUTH` | **`1250×1400`** | `N/A` | `(45253.51, 1250.22)` | `(45603.42, 1250.22)` | `349.91` | *(Trống)* | *(Trống)* | `inferred_from_silencer_block_W1250xH1400` |
| `SEG-F1-OUT1B` | `FAN_TRAIN_1_SOUTH` | **`1250×1400`** | `N/A` | `(44978.61, 1250.22)` | `(45103.51, 1250.22)` | `124.9` | *(Trống)* | *(Trống)* | `inferred_from_silencer_block_W1250xH1400` |
| `SEG-F1-OUT1A` | `FAN_TRAIN_1_SOUTH` | **`1250×1400`** | `N/A` | `(44814.68, 1250.22)` | `(44886.11, 1250.22)` | `71.43` | *(Trống)* | *(Trống)* | `inferred_from_silencer_block_W1250xH1400` |
| `SEG-F1-IN2` | `FAN_TRAIN_1_SOUTH` | **`1700×600`** | `+2450` | `(39594.94, 1250.32)` | `(39998.68, 1250.3)` | `403.74` | *(Trống)* | *(Trống)* | `inferred_width_1700_height_from_header_600` |
| `SEG-F1-IN1` | `FAN_TRAIN_1_SOUTH` | **`1700×600`** | `+2450` | `(39399.39, 1250.33)` | `(39444.94, 1250.33)` | `45.55` | *(Trống)* | *(Trống)* | `inferred_width_1700_height_from_header_600` |
| `SEG-F2-OUT2` | `FAN_TRAIN_2_NORTH` | **`1250×1400`** | `N/A` | `(45253.52, 3100.08)` | `(45603.42, 3100.08)` | `349.9` | *(Trống)* | *(Trống)* | `inferred_from_silencer_block_W1250xH1400` |
| `SEG-F2-OUT1B` | `FAN_TRAIN_2_NORTH` | **`1250×1400`** | `N/A` | `(44978.61, 3100.08)` | `(45103.52, 3100.08)` | `124.91` | *(Trống)* | *(Trống)* | `inferred_from_silencer_block_W1250xH1400` |
| `SEG-F2-OUT1A` | `FAN_TRAIN_2_NORTH` | **`1250×1400`** | `N/A` | `(44814.68, 3100.08)` | `(44886.11, 3100.08)` | `71.43` | *(Trống)* | *(Trống)* | `inferred_from_silencer_block_W1250xH1400` |
| `SEG-F2-IN2` | `FAN_TRAIN_2_NORTH` | **`1700×600`** | `+2450` | `(39594.94, 3100.32)` | `(39998.68, 3100.3)` | `403.74` | *(Trống)* | *(Trống)* | `inferred_width_1700_height_from_header_600` |
| `SEG-F2-IN1` | `FAN_TRAIN_2_NORTH` | **`1700×600`** | `+2450` | `(39399.39, 3100.33)` | `(39444.94, 3100.33)` | `45.55` | *(Trống)* | *(Trống)* | `inferred_width_1700_height_from_header_600` |
| `SEG-M01` | `MAIN_HEADER` | **`2200×600`** | `+2450` | `(37579.39, 2175.33)` | `(35222.39, 2175.33)` | `2357` | `SEAD-2200x600` (`10DAD`) | `BOD=FFL+2450` (`10DAE`) | `mtext_explicit` |
| `SEG-L01A` | `LEFT_BRANCH` | **`1600×450`** | `+2500` | `(35018.39, 2175.34)` | `(34731.76, 2175.34)` | `286.63` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-L01B` | `LEFT_BRANCH` | **`1600×450`** | `+2500` | `(34581.7, 2175.33)` | `(20644.36, 2175.33)` | `13937.34` | `SEAD-1600x450` (`10DAF`) | `BOD=FFL+2500` (`10DB0`) | `mtext_explicit` |
| `SEG-L02` | `LEFT_BRANCH` | **`1450×400`** | `+2500` | `(20440.36, 2175.32)` | `(17283.05, 2175.06)` | `3157.31` | `SEAD-1450x400` (`10DB1`) | `BOD=FFL+2500` (`10DB2`) | `mtext_explicit` |
| `SEG-L03` | `LEFT_BRANCH` | **`1450×400`** | `+2500` | `(15830.93, 3626.93)` | `(15829.91, 15018.8)` | `11391.87` | `SEAD-1450x400` (`10DB3`) | `BOD=FFL+2500` (`10DB4`) | `mtext_explicit` |
| `SEG-L04` | `LEFT_BRANCH` | **`1100×400`** | `+2500` | `(16004.85, 15668.82)` | `(16003.51, 31513.08)` | `15844.26` | `SEAD-1100x400` (`10DB5`) | `BOD=FFL+2500` (`10DB6`) | `mtext_explicit` |
| `SEG-L05` | `LEFT_BRANCH` | **`800×400`** | `+2500` | `(16003.49, 31717.08)` | `(16002.6, 42282.08)` | `10565` | `SEAD-800x400` (`10DB7`) | `BOD=FFL+2500` (`10DB8`) | `mtext_explicit` |
| `SEG-L06` | `LEFT_BRANCH` | **`550×350`** | `+2500` | `(16002.73, 42486.08)` | `(16001.87, 52835.08)` | `10349` | `SEAD-550x350` (`10DB9`) | `BOD=FFL+2500` (`10DBA`) | `mtext_explicit` |
| `SEG-R01A` | `RIGHT_TOP_BRANCH` | **`1700×500`** | `+2500` | `(36459.09, 3427.34)` | `(36459.06, 3958.23)` | `530.89` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-R01B` | `RIGHT_TOP_BRANCH` | **`1700×500`** | `+2500` | `(36459.05, 4108.26)` | `(36458.95, 5753.24)` | `1644.98` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-R02` | `RIGHT_TOP_BRANCH` | **`1700×500`** | `+2500` | `(38160.81, 7455.34)` | `(43264.87, 7455.77)` | `5104.06` | `SEAD-1700x500` (`10DBB`) | `BOD=FFL+2500` (`10DBC`) | `mtext_explicit` |
| `SEG-R03` | `RIGHT_TOP_BRANCH` | **`1700×500`** | `+2500` | `(44966.72, 9157.92)` | `(44966.72, 20994.85)` | `11836.93` | `SEAD-1700x500` (`10DBD`) | `BOD=FFL+2500` (`10DBE`) | `mtext_explicit` |
| `SEG-R04` | `RIGHT_TOP_BRANCH` | **`1400×500`** | `+2500` | `(45116.72, 21198.84)` | `(45116.19, 27477.84)` | `6279` | `SEAD-1400x500` (`10DBF`) | `BOD=FFL+2500` (`10DC0`) | `mtext_explicit` |
| `SEG-R05` | `RIGHT_TOP_BRANCH` | **`1400×500`** | `+2500` | `(43756.37, 28879.73)` | `(42082.77, 28879.58)` | `1673.6` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-R06` | `RIGHT_TOP_BRANCH` | **`1400×500`** | `+2500` | `(40680.65, 30281.46)` | `(40680.65, 37127.69)` | `6846.23` | `SEAD-1400x500` (`10DC1`) | `BOD=FFL+2500` (`10DC2`) | `mtext_explicit` |
| `SEG-R07A` | `RIGHT_TOP_BRANCH` | **`1150×500`** | `+2500` | `(40680.54, 37331.69)` | `(40680.45, 38425.2)` | `1093.51` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-R07B` | `RIGHT_TOP_BRANCH` | **`1150×500`** | `+2522.5` | `(41832.35, 39577.65)` | `(43931.25, 39577.84)` | `2098.9` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-R08` | `RIGHT_TOP_BRANCH` | **`1150×500`** | `+2545` | `(45083.15, 40734.68)` | `(45082.04, 53864.99)` | `13130.31` | `SEAD-1150x500` (`10DC3`) | `BOD=FFL+2545` (`10DC4`) | `mtext_explicit` |
| `SEG-R09` | `RIGHT_TOP_BRANCH` | **`950×450`** | `+2595` | `(45082.02, 54068.99)` | `(45081.3, 62532.86)` | `8463.87` | `SEAD-950x450` (`10DC5`) | `BOD=FFL+2595` (`10DC6`) | `mtext_explicit` |
| `SEG-T01` | `RIGHT_TOP_BRANCH` | **`950×450`** | `+2595` | `(44129.22, 63484.78)` | `(34735.8, 63483.98)` | `9393.42` | `SEAD-950x450` (`10DC7`) | `BOD=FFL+2595` (`10DC8`) | `mtext_explicit` |
| `SEG-T02` | `RIGHT_TOP_BRANCH` | **`800×400`** | `+2645` | `(34531.8, 63483.92)` | `(21317.76, 63482.79)` | `13214.04` | `SEAD-800x400` (`10DC9`) | `BOD=FFL+2645` (`10DCA`) | `mtext_explicit` |
| `SEG-T03` | `RIGHT_TOP_BRANCH` | **`550×350`** | `+2695` | `(21113.76, 63482.77)` | `(14886.96, 63482.25)` | `6226.8` | `SEAD-550x350` (`10DCB`) | `BOD=FFL+2695` (`10DCC`) | `mtext_explicit` |
| `SEG-T04` | `RIGHT_TOP_BRANCH` | **`550×350`** | `+2695` | `(14335.01, 62930.2)` | `(14335.28, 59756.71)` | `3173.49` | *(Trống)* | *(Trống)* | `inferred_continuity` |
| `SEG-T05` | `RIGHT_TOP_BRANCH` | **`550×350`** | `+2695` | `(13783.33, 59204.66)` | `(4415.11, 59204.66)` | `9368.22` | `SEAD-550x350` (`10DCD`) | `BOD=FFL+2695` (`10DCE`) | `mtext_explicit` |

---

## 4. Giải Mã 100% Phụ Kiện, Thiết Bị, Van Gió & Miệng Gió (`95 Block + 01 Côn Vẽ Tay`)

### 4.1. Cút Vuông 90° (`10 Cút - Bán kính cổ trong R_in = 0.5×W, R_tim = 1.0×W`)

| Mã | Handle | Kích thước `W×H` | Bán kính trong `R_in` | Giao điểm 2 tim `(cx, cy)` | Cổng 1 `(x, y)` | Cổng 2 `(x, y)` | Hướng rẽ |
| --- | :---: | :---: | :---: | --- | --- | --- | --- |
| `ELB-01` | `10D4C` | `1450×400` | `725` | `(15830.93, 2175.06)` | `(17283.05, 2175.06)` | `(15830.93, 3626.93)` | West (-X) -> North (+Y) |
| `ELB-02` | `10D4F` | `1700×500` | `850` | `(36458.95, 7455.34)` | `(36458.95, 5753.24)` | `(38160.81, 7455.34)` | North (+Y) -> East (+X) |
| `ELB-03` | `10D4D` | `1700×500` | `850` | `(44966.72, 7455.77)` | `(43264.87, 7455.77)` | `(44966.72, 9157.92)` | East (+X) -> North (+Y) |
| `ELB-04` | `10BAC` | `1400×500` | `700` | `(45116.19, 28879.73)` | `(45116.19, 27477.84)` | `(43756.37, 28879.73)` | North (+Y) -> West (-X) [Jog #1] |
| `ELB-05` | `10BAB` | `1400×500` | `700` | `(40680.65, 28879.58)` | `(42082.77, 28879.58)` | `(40680.65, 30281.46)` | West (-X) -> North (+Y) [Jog #1] |
| `ELB-06` | `10B49` | `1150×500` | `575` | `(40680.45, 39577.65)` | `(40680.45, 38425.2)` | `(41832.35, 39577.65)` | North (+Y) -> East (+X) [Jog #2 - tilted 1.09° in 3D] |
| `ELB-07` | `10B51` | `1150×500` | `575` | `(45083.15, 39577.84)` | `(43931.25, 39577.84)` | `(45083.15, 40734.68)` | East (+X) -> North (+Y) [Jog #2] |
| `ELB-08` | `10B4F` | `950×450` | `475` | `(45081.3, 63484.78)` | `(45081.3, 62532.86)` | `(44129.22, 63484.78)` | North (+Y) -> West (-X) |
| `ELB-09` | `10B2B` | `550×350` | `275` | `(14335.01, 63482.25)` | `(14886.96, 63482.25)` | `(14335.01, 62930.2)` | West (-X) -> South (-Y) |
| `ELB-10` | `10B2A` | `550×350` | `275` | `(14335.28, 59204.66)` | `(14335.28, 59756.71)` | `(13783.33, 59204.66)` | South (-Y) -> West (-X) |

### 4.2. Côn Thu Vuông & Côn Chuyển Vuông-Tròn (`16 Phụ kiện chuyển tiết diện`)

| Mã | Handle | Loại phụ kiện | Kiểu đồng tâm / lệch tâm (Mặt bằng) | Tiết diện 1 → Tiết diện 2 | Dài `L` (mm) | Cổng 1 `(x, y)` | Cổng 2 `(x, y)` |
| --- | :---: | --- | --- | :---: | ---: | --- | --- |
| `RED-01` | `10D50` | `SQUARE_REDUCER` | `concentric` | `2200×600` → `1600×450` | `204` | `(35222.39, 2175.33)` | `(35018.39, 2175.34)` |
| `RED-02` | `10C85` | `SQUARE_REDUCER` | `concentric` | `1600×450` → `1450×400` | `204` | `(20644.36, 2175.33)` | `(20440.36, 2175.32)` |
| `RED-03-MANUAL` | `10E35,10E36,10E37,10E38` | `SQUARE_REDUCER_MANUAL_LINES` | `eccentric_flat_right_X_16554.9` | `1450×400` → `1100×400` | `650.02` | `(15829.91, 15018.8)` | `(16004.85, 15668.82)` |
| `RED-04` | `10B4C` | `SQUARE_REDUCER` | `concentric` | `1100×400` → `800×400` | `204` | `(16003.51, 31513.08)` | `(16003.49, 31717.08)` |
| `RED-05` | `10C97` | `SQUARE_REDUCER` | `concentric` | `800×400` → `550×350` | `204` | `(16002.6, 42282.08)` | `(16002.73, 42486.08)` |
| `RED-06` | `10D4E` | `SQUARE_REDUCER` | `eccentric_flat_right_X_45816.7` | `1700×500` → `1400×500` | `204` | `(44966.72, 20994.85)` | `(45116.72, 21198.84)` |
| `RED-07` | `10BAA` | `SQUARE_REDUCER` | `concentric` | `1400×500` → `1150×500` | `204` | `(40680.65, 37127.69)` | `(40680.54, 37331.69)` |
| `RED-08` | `10B50` | `SQUARE_REDUCER` | `concentric` | `1150×500` → `950×450` | `204` | `(45082.04, 53864.99)` | `(45082.02, 54068.99)` |
| `RED-09` | `10B4E` | `SQUARE_REDUCER` | `concentric` | `950×450` → `800×400` | `204` | `(34735.8, 63483.98)` | `(34531.8, 63483.92)` |
| `RED-10` | `10B4D` | `SQUARE_REDUCER` | `concentric` | `800×400` → `550×350` | `204` | `(21317.76, 63482.79)` | `(21113.76, 63482.77)` |
| `RED-11-FAN1` | `10D6D` | `SQUARE_REDUCER_HEIGHT_ONLY` | `concentric_same_W_1700` | `1700×600` → `1700×1000` | `204` | `(39998.68, 1250.3)` | `(40202.61, 1250.26)` |
| `RED-12-FAN2` | `10D6C` | `SQUARE_REDUCER_HEIGHT_ONLY` | `concentric_same_W_1700` | `1700×600` → `1700×1000` | `204` | `(39998.68, 3100.3)` | `(40202.61, 3100.22)` |
| `SQRD-01-FAN1-IN` | `10CD1` | `SQUARE_TO_ROUND` | `concentric` | `1700×1000` → `Ø1250` | `532` | `(41100.68, 1250.22)` | `(41632.68, 1250.22)` |
| `SQRD-02-FAN1-OUT` | `10CD3` | `ROUND_TO_SQUARE` | `concentric` | `Ø1250` → `1250×1400` | `532` | `(43382.68, 1250.22)` | `(43914.68, 1250.22)` |
| `SQRD-03-FAN2-IN` | `10CD0` | `SQUARE_TO_ROUND` | `concentric` | `1700×1000` → `Ø1250` | `532` | `(41100.68, 3100.18)` | `(41632.68, 3100.09)` |
| `SQRD-04-FAN2-OUT` | `10CD2` | `ROUND_TO_SQUARE` | `concentric` | `Ø1250` → `1250×1400` | `532` | `(43382.68, 3100.09)` | `(43914.68, 3100.08)` |

### 4.3. Phụ Kiện Chia Nhánh Chính (`01 Chạc Quần Trouser Piece + 01 Gót Giày Nhánh Chính 1700×500`)
- **`BR-01-TROUSER` (`Handle: 10CBD`)**: Chạc quần chia đôi đối xứng (`Trouser Piece / Breeches`), dài `L = 1820 mm`, đầu chung bên trái `(37579.39, 2175.33)` cỡ `2200×600` chia thành 2 đầu nhánh bên phải cỡ `1700×600` tại `(39399.39, 1250.33)` và `(39399.39, 3100.33)` (khoảng cách mép trong giữa 2 nhánh = `150 mm`).
- **`BR-02-MAIN-TAP` (`Handle: 10D51`)**: Chân rẽ gót giày lớn cỡ cổ `1700×500` (đáy rộng `1850 mm`, vát 45° bên phải `150 mm`, cao `152 mm`), trích từ thành Bắc ống góp `2200×600` tại `(36459.09, 3275.33)` ra cổ nhánh tại `(36459.09, 3427.34)`.

### 4.4. Thiết Bị Chính, Tiêu Âm, Van Gió, Khớp Nối Mềm & Nắp Bịt Đầu Ống

| Nhóm | Mã | Handle | Chủng loại / Quy cách | Kích thước | Dài `L` | Tâm / Vị trí lắp đặt `(X, Y)` |
| --- | --- | :---: | --- | :---: | ---: | --- |
| Thiết bị | `EQ-FAN-01` | `10CA7` | KRUGER AXIAL FAN TDC 1250_C25_J_7-7V_15 | `Ø1250` | `1250` | `(42507.68, 1250.22)` |
| Thiết bị | `EQ-FAN-02` | `10CA5` | KRUGER AXIAL FAN TDC 1250_C25_J_7-7V_15 | `Ø1250` | `1250` | `(42507.68, 3100.09)` |
| Thiết bị | `EQ-SIL-01` | `10CA8` | SILENCER L900xW1700xH1000 | `1700×1000` | `900` | `(40202.61, 1250.26)→(41100.75, 1250.26)` |
| Thiết bị | `EQ-SIL-02` | `10CA6` | SILENCER L900xW1700xH1000 | `1700×1000` | `900` | `(40202.61, 3100.22)→(41100.75, 3100.22)` |
| Thiết bị | `EQ-SIL-03` | `10CA9` | SILENCER L900xW1250xH1400 | `1250×1400` | `900` | `(43914.68, 1250.22)→(44814.68, 1250.22)` |
| Thiết bị | `EQ-SIL-04` | `10CB3` | SILENCER L900xW1250xH1400 | `1250×1400` | `900` | `(43914.68, 3100.08)→(44814.68, 3100.08)` |
| Van gió | `DMP-VCD-01` | `10B17` | `VCD` (HORIZONTAL_RUN) | `1600×450` | `150` | `(34656.73, 2175.34)` |
| Van gió | `DMP-VCD-02` | `10BAE` | `VCD` (VERTICAL_RUN) | `1700×500` | `150` | `(36459.06, 4033.25)` |
| Van gió | `DMP-MFD-01` | `10CC2` | `MFD_EI60` (HORIZONTAL_RUN) | `1700×600` | `150` | `(39519.94, 1250.33)` |
| Van gió | `DMP-MFD-02` | `10CBE` | `MFD_EI60` (HORIZONTAL_RUN) | `1700×600` | `150` | `(39519.94, 3100.33)` |
| Van gió | `DMP-NRD-01` | `10CAC` | `NRD` (HORIZONTAL_RUN) | `1250×1400` | `92.5` | `(44932.36, 1250.22)` |
| Van gió | `DMP-MFD-03` | `10CAF` | `MFD_EI60` (HORIZONTAL_RUN) | `1250×1400` | `150` | `(45178.51, 1250.22)` |
| Van gió | `DMP-NRD-02` | `10CB6` | `NRD` (HORIZONTAL_RUN) | `1250×1400` | `92.5` | `(44932.36, 3100.08)` |
| Van gió | `DMP-MFD-04` | `10CB9` | `MFD_EI60` (HORIZONTAL_RUN) | `1250×1400` | `150` | `(45178.52, 3100.08)` |
| Khớp mềm | `FLX-01` | `10CCF` | Khớp nối mềm tròn chống rung | `Ø1250` | `250` | `(41632.68, 1250.22)→(41882.68, 1250.22)` |
| Khớp mềm | `FLX-02` | `10CCE` | Khớp nối mềm tròn chống rung | `Ø1250` | `250` | `(43132.68, 1250.22)→(43382.68, 1250.22)` |
| Khớp mềm | `FLX-03` | `10CCD` | Khớp nối mềm tròn chống rung | `Ø1250` | `250` | `(41632.68, 3100.09)→(41882.68, 3100.09)` |
| Khớp mềm | `FLX-04` | `10CCC` | Khớp nối mềm tròn chống rung | `Ø1250` | `250` | `(43132.68, 3100.09)→(43382.68, 3100.09)` |
| Bịt đầu | `CAP-01` | `10BAF` | Nắp bịt đầu ống gió EI60 (+Y (North)) | `550×350` | `25` | `(16001.87, 52835.08)` |
| Bịt đầu | `CAP-02` | `10BAD` | Nắp bịt đầu ống gió EI60 (-X (West)) | `550×350` | `25` | `(4415.11, 59204.66)` |

### 4.5. Bảng Toàn Bộ 24 Cụm Chân Rẽ Gót Giày + Miệng Gió Hút Khói `EAG_OBD 600×300mm`
> Cả 24 bộ có cùng cấu tạo tiêu chuẩn: Gót giày đế `750 mm` thu vát 1 bên về cổ `600×300 mm`, vươn ra `150 mm` từ mép sườn ống chính, gắn trực tiếp miệng gió hút khói kèm van OBD `EAG_OBD 600×300mm` (phủ bì mặt `630 mm`).

| Mã Bộ | Đoạn ống chủ | Hướng thổi/hút | Handle Gót giày | Handle Miệng gió | Điểm bám thành ống `(X, Y)` | Tâm cổ miệng gió `(X, Y)` | Tâm mặt miệng gió `(X, Y)` |
| --- | :---: | :---: | :---: | :---: | --- | --- | --- |
| `GT-L01` | `SEG-L03` | `-X` | `10BCF` | `10BCE` | `(15105.52, 8162.25)` | `(14947.39, 8162.25)` | `(14925.47, 8162.25)` |
| `GT-L02` | `SEG-L03` | `-X` | `10BD1` | `10BD0` | `(15104.97, 14362.06)` | `(14946.86, 14362.06)` | `(14924.94, 14362.06)` |
| `GT-L03` | `SEG-L04` | `-X` | `10BD5` | `10BD2` | `(15454.49, 20013.25)` | `(15296.35, 20013.25)` | `(15274.44, 20013.25)` |
| `GT-L04` | `SEG-L04` | `-X` | `10BD6` | `10BD3` | `(15454.03, 25411.58)` | `(15295.89, 25411.58)` | `(15273.98, 25411.58)` |
| `GT-L05` | `SEG-L04` | `-X` | `10BD7` | `10BD4` | `(15453.57, 30838.73)` | `(15295.43, 30838.73)` | `(15273.52, 30838.73)` |
| `GT-L06` | `SEG-L05` | `-X` | `10BDC` | `10BD8` | `(15603.15, 36177.93)` | `(15445.1, 36177.93)` | `(15423.18, 36177.93)` |
| `GT-L07` | `SEG-L05` | `-X` | `10BDD` | `10BD9` | `(15602.69, 41592.32)` | `(15444.64, 41592.32)` | `(15422.72, 41592.32)` |
| `GT-L08` | `SEG-L06` | `-X` | `10BDE` | `10BDA` | `(15727.44, 46396.51)` | `(15569.3, 46396.51)` | `(15547.39, 46396.51)` |
| `GT-L09` | `SEG-L06` | `-X` | `10BDF` | `10BDB` | `(15726.9, 52402.24)` | `(15568.77, 52402.24)` | `(15546.85, 52402.24)` |
| `GT-R01` | `SEG-R02` | `+Y` | `10BB1` | `10BB0` | `(40343.27, 8305.52)` | `(40343.27, 8463.66)` | `(40343.27, 8485.59)` |
| `GT-R02` | `SEG-R03` | `-X` | `10BC0` | `10BB2` | `(44116.72, 14615.84)` | `(43958.61, 14615.84)` | `(43936.67, 14615.84)` |
| `GT-R03` | `SEG-R03` | `-X` | `10BC1` | `10BB3` | `(44116.72, 20533.92)` | `(43958.61, 20533.92)` | `(43936.67, 20533.92)` |
| `GT-R04` | `SEG-R04` | `-X` | `10BC2` | `10BB4` | `(44416.37, 25405.73)` | `(44258.23, 25405.73)` | `(44236.29, 25405.73)` |
| `GT-R05` | `SEG-R06` | `-X` | `10BC3` | `10BB5` | `(39986.77, 30817.95)` | `(39822.51, 30817.95)` | `(39800.51, 30817.95)` |
| `GT-R06` | `SEG-R06` | `-X` | `10BC4` | `10BB6` | `(39980.65, 35810.61)` | `(39822.51, 35810.61)` | `(39800.57, 35810.61)` |
| `GT-R07` | `SEG-R08` | `-X` | `10BC5` | `10BB7` | `(44508.06, 41808.04)` | `(44349.95, 41808.04)` | `(44328.01, 41808.04)` |
| `GT-R08` | `SEG-R08` | `-X` | `10BC6` | `10BB8` | `(44507.62, 46979.67)` | `(44349.51, 46979.67)` | `(44327.57, 46979.67)` |
| `GT-R09` | `SEG-R08` | `-X` | `10BC7` | `10BB9` | `(44507.09, 53283.12)` | `(44348.98, 53283.12)` | `(44327.03, 53283.12)` |
| `GT-R10` | `SEG-R09` | `-X` | `10BC8` | `10BBA` | `(44606.63, 58593.48)` | `(44448.5, 58593.48)` | `(44426.56, 58593.48)` |
| `GT-T01` | `SEG-T01` | `-Y` | `10BC9` | `10BBB` | `(42328.43, 63009.62)` | `(42328.43, 62851.51)` | `(42328.43, 62829.57)` |
| `GT-T02` | `SEG-T01` | `-Y` | `10BCA` | `10BBC` | `(35512.39, 63009.04)` | `(35512.39, 62850.93)` | `(35512.39, 62828.99)` |
| `GT-T03` | `SEG-T02` | `-Y` | `10BCB` | `10BBD` | `(28692.39, 63083.44)` | `(28692.39, 62925.3)` | `(28692.39, 62903.36)` |
| `GT-T04` | `SEG-T02` | `-Y` | `10BCC` | `10BBE` | `(21892.39, 63082.84)` | `(21892.39, 62924.7)` | `(21892.39, 62902.76)` |
| `GT-T05` | `SEG-T03` | `-Y` | `10BCD` | `10BBF` | `(15716.23, 63207.31)` | `(15716.23, 63049.17)` | `(15716.23, 63027.23)` |

---

## 5. Danh Sách Khung Bao `REVCLOUD` (`RC-01` .. `RC-08`) Giao `@cad-drafter` Khoanh Mây Hỏi Sếp Hồ

> **Quy cách vẽ đề xuất cho `@cad-drafter`**: Vẽ trên Layer **`CLOUND`** (Màu **ACI 240**, Lineweight `0.20 mm` theo đúng `Spec-layer ký hiệu ống gió.dwg`), bước cung mây `Arc Length ≈ 450–550 mm` (đồng bộ với mây mẫu `10E5A` của Sếp Hồ).

| Mã Mây | Mức độ | Tọa độ khung bao `(minX, minY, maxX, maxY)` | Handle liên quan | Vấn đề kỹ thuật / Câu hỏi cần trình Sếp Hồ xác nhận |
| --- | :---: | --- | --- | --- |
| **`RC-01`** | `HIGH` | `(37450, 200, 43250, 4150)` | `10CBD, 10CC2, 10CBE, 10D6D, 10D6C, 10CA8...` | **Cụm đầu hút 2 Quạt Hút Khói: Chạc quần + Côn đổi chiều cao ẩn + Quạt trục thiếu hoàn toàn Text kích thước, cao độ & thông số quạt**: Cụm chạc quần (Trouser Piece) và tuyến đầu hút 2 quạt hướng trục chưa có Text kích thước ống, cao độ BOD và thông số quạt (Lưu lượng/Cột áp). Đoạn ống nối vào van MFD chỉ dài 45.5mm (quá ngắn để bẻ bích TDC), và cặp côn 10D6D/10D6C giữ nguyên bề rộng W=1700 trên mặt bằng (suy từ tên block tiêu âm là tăng chiều cao H từ 600 lên 1000). Xin Sếp xác nhận kích thước chính xác từng đoạn để gia công! |
| **`RC-02`** | `HIGH` | `(43250, 400, 45800, 3900)` | `10CCE, 10CCC, 10CD3, 10CD2, 10CA9, 10CB3...` | **Cụm đầu đẩy 2 Quạt Hút Khói: Thiếu Text kích thước/cao độ, chữ NRD/MFD bị lật ngược, ống nối quá ngắn & đầu ống kết thúc cụt tại X=45603.4**: Tuyến đẩy sau 2 quạt thiếu Text kích thước ống (suy từ tiêu âm là 1250x1400) & cao độ BOD; đoạn ống giữa Tiêu âm - NRD (71.4mm) và NRD - MFD (124.9mm) rất ngắn; chữ NRD/MFD đang bị mirror; và 2 đầu ống tại X=45603.4 kết thúc cụt chưa rõ đấu vào trục kỹ thuật (Shaft) hay cửa gió Louver? |
| **`RC-03`** | `HIGH` | `(39850, 37000, 45800, 40900)` | `10BAA, 10BA7, 10BA9, 10BA3, 10B49, 10B40...` | **Chuyển hướng Jog #2 Nhánh Phải: Nét đôi lệch 9.49mm do ống nghiêng 3D (cút ELLIPSE), nhảy cao độ BOD +45mm (FFL+2500 -> FFL+2545) & thiếu Text kích thước**: Đoạn chuyển hướng Jog #2 thiếu Text kích thước (suy luận W=1150x500), xuất hiện nét đôi lệch 9.49mm ở biên cút 10B49 và ống ngang (Y=40152.6 & 40162.1) do ống trong Revit 3D bị nghiêng dốc ~1.09° để nâng cao độ từ BOD=FFL+2500 lên BOD=FFL+2545 (+45mm dù H vẫn = 500). Xin Sếp xác nhận đi phẳng hay xử lý chênh cao độ +45mm tại vị trí nào? |
| **`RC-04`** | `MEDIUM` | `(14950, 14850, 16750, 15850)` | `10E35, 10E36, 10E37, 10E38` | **Côn thu lệch nhánh trái (1450x400 -> 1100x400) vẽ thủ công bằng 4 nét LINE rời không bích, chiều dài L=650mm khác chuẩn L=200mm**: Côn thu lệch phẳng phải (1450x400 -> 1100x400) tại Y=15019..15669 được vẽ bằng 4 nét LINE rời không có bích TDC và dài L=650mm (trong khi 11 côn thu khác trên bản vẽ đều là Block dài L=200mm). Xin Sếp xác nhận giữ chiều dài côn L=650mm hay chuẩn hóa theo chuẩn HTS? |
| **`RC-05`** | `LOW` | `(39850, 27350, 45950, 30400)` | `10BAC, 10B45, 10B46, 10BAB` | **Đoạn ngang chuyển hướng Jog #1 Nhánh Phải (Y=28180..29580): Thiếu Text kích thước & cao độ BOD**: Đoạn ngang chuyển hướng Jog #1 giữa 2 cút 10BAC - 10BAB (W=1400) chưa có Text ghi kích thước và cao độ (tạm lấy liên tục SEAD-1400x500, BOD=FFL+2500). Xin Sếp xác nhận đoạn này không đổi tiết diện/cao độ qua dầm? |
| **`RC-06`** | `MEDIUM` | `(35400, 3200, 37600, 5850)` | `10D51, 10B1E, 10B1F, 10BAE, 10CA2, 10CA1` | **Điểm trích Nhánh Phải 1700x500 từ thành ống góp 2200x600 bằng gót giày 10D51 & đoạn qua van VCD thiếu Text kích thước**: Nhánh chính phía Bắc rộng W=1700mm (1700x500) đang trích vuông góc vào sườn ống góp 2200x600 bằng chân rẽ gót giày 10D51 và đoạn ống qua van VCD 10BAE chưa có Text kích thước/cao độ. Xin Sếp xác nhận giữ kết cấu gót giày 1700x500 hay đổi sang Tê/Chạc chia nhánh giảm tổn thất áp suất? |
| **`RC-07`** | `LOW` | `(13650, 58750, 15000, 63900)` | `10B2B, 10B27, 10B26, 10B2A` | **Đoạn chuyển hướng góc Tây-Bắc giữa 2 cút 10B2B & 10B2A (X=14060..14610): Thiếu Text kích thước & cao độ BOD**: Đoạn ống chuyển hướng giữa 2 cút 10B2B - 10B2A (W=550) chưa có Text ghi kích thước và cao độ (tạm lấy liên tục SEAD-550x350, BOD=FFL+2695). Xin Sếp xác nhận! |
| **`RC-08`** | `MEDIUM` | `(39750, 8200, 40800, 8650)` | `10BB1, 10BB0` | **Miệng gió hút khói đại diện (1/24 bộ EAG+OBD): Toàn bộ 24 miệng gió & gót giày trên bản vẽ đều thiếu Text ghi kích thước & lưu lượng**: Khoanh đại diện 01/24 cụm miệng gió gắn sườn ống: Toàn bộ 24 miệng gió trên bản vẽ đều chưa có Text ghi quy cách kích thước cổ/mặt và lưu lượng gió (giải mã từ tên Block Revit là EAG_OBD 600x300mm gắn trên gót giày cổ 600x300). Xin Sếp xác nhận quy cách áp dụng chung cho cả 24 miệng gió! |
