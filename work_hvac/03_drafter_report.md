# 03 — BÁO CÁO TRIỂN KHAI SHOP DRAWING ỐNG GIÓ HVAC (`cad-drafter` — CẬP NHẬT THEO CHỈ ĐẠO #10 CỦA SẾP HỒ)

- **Bản vẽ triển khai**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\shop drawwing onng gio.dwg`
- **Bản sao lưu gốc trước khi vẽ**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac\backup_shop_drawwing_onng_gio.dwg` (`3,499,826 bytes`)
- **Ảnh kiểm tra trực quan mới nhất**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac\drafter_check_imgs\` (`shop_full_overview.png`, `shop_zoom_fans_header.png`, `shop_zoom_left_red03.png`, `shop_zoom_right_jog2.png`, `shop_zoom_top_west.png`)
- **Hệ thống triển khai**: **Hệ thống Ống gió Hút khói Sự cố Tầng hầm B1 (`Smoke Exhaust Air Duct — SEAD`)**

---

## 1. Tuân Thủ Tuyệt Đối Nguyên Tắc Loại Trừ Lẫn Nhau 100% Của Sếp Hồ (`#10`)

1. **Vị trí ĐÃ HIỂU & CHẮC CHẮN ĐÚNG**:
   - Đã vẽ đè khít **100% trực tiếp lên tọa độ nét vẽ thiết kế cũ** bằng **100% HTS Tool** (`203` block trên `M-MVAC-SEAD` + `26` block động trên `M-MVAC-Equipment` = **`229` block HTS**).
   - **KHÔNG KHOANH MÂY** (đã xóa toàn bộ 5 mây cũ `RC-04 .. RC-08` ở các khu vực đã hiểu rõ hình học và thông số).
2. **Vị trí KHÔNG HIỂU / THIẾU THÔNG SỐ CHƯA CHẮC CHẮN / HTS TOOL CHƯA CÓ BLOCK THIẾT BỊ (`RC-01`, `RC-02`, `RC-03`)**:
   - Đã **KHOANH MÂY `REVCLOUD` trên Layer `CLOUND` (ACI `240`)** và **BỎ TRỐNG 100% KHÔNG VẼ SHOP DRAWING Ở BÊN TRONG MÂY** (`0` đối tượng `M-MVAC-*` bên trong cả 3 khung bao `REVCLOUD` khi kiểm tra bằng `get_entities_in_area` Crossing Window!).
   - Các tuyến ống thẳng đã hiểu ở hai đầu dừng gọn gàng đúng tại mặt bích ranh giới ngay mép ngoài đám mây (`SEG-M01` dừng tại `X = 37579.39`; `SEG-R06` dừng tại `Y = 37127.69`; `SEG-R08` bắt đầu tại `Y = 40734.68`), để lộ nguyên vẹn 100% nét vẽ thiết kế gốc bên trong mây chờ Sếp Hồ giải thích sau khi kết thúc tiến trình vẽ.
3. **Bảo toàn 100% thực thể thiết kế gốc (`229/229` nguyên vẹn)**:
   - `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`: **`192`** thực thể gốc.
   - `MEPG-M-EQUIP`: **`2`** quạt hướng trục Kruger TDC 1250 gốc.
   - `MEPG-AC-TEXT`: **`34`** nhãn `MTEXT` thông số gốc.
   - `0`: **`1`** đám mây mẫu `10E5A` của Sếp Hồ ở góc Tây-Nam.
   - Phạm vi `Extents` toàn bản vẽ: `extmin = (4390.11, -4344.41)` → `extmax = (45884.21, 63989.85)` — **0 thực thể nháp ngoài vùng thiết kế**, **0 block `HTS-*` thừa (`instance_count = 0`)**.

---

## 2. Thống Kê Layer & Đối Tượng Trên Bản Vẽ Hiện Hành (`Tổng 461 thực thể`)

| Layer | Màu ACI | Lineweight | Số lượng | Nội dung |
| :--- | :---: | :---: | :---: | :--- |
| **`M-MVAC-SEAD`** | **`190`** | `0.20 mm` | **`203`** | 100% Block ống gió & phụ kiện chế tạo HTS (`ByLayer`) ở các vùng đã hiểu chắc chắn |
| **`M-MVAC-Equipment`** | **`47`** | `0.10 mm` | **`26`** | `02` van `HTS_Van gio vuong VCD` + `24` miệng gió `HTS_Mieng gio louver` (`600×300`, `ByLayer`) |
| **`CLOUND`** | **`240`** | `0.20 mm` | **`3`** | `03` đám mây `REVCLOUD` (`RC-01`, `RC-02`, `RC-03`) bao quanh 3 vùng chưa rõ, bên trong để trống 100% (`0` `M-MVAC-*`) |
| `MEPG-*` & `0` | Gốc | Gốc | **`229`** | Toàn bộ bản vẽ thiết kế gốc được giữ nguyên 100% làm nền đối chiếu |
| 10 Layer Spec còn lại (`EAD`, `FAD`, `PAD`, `CEAD`, `CSAD`, `Copper Pipe`, `AC Drain`, `Support`, `DIM`, `TEXT`) | Chuẩn Spec | Chuẩn Spec | `0` | Đã khởi tạo sẵn đầy đủ bảng Layer tiêu chuẩn của file `Spec-layer ký hiệu ống gió.dwg` |

---

## 3. Chi Tiết 229 Block Shop Drawing HTS Đã Triển Khai (Ngoài Vùng Mây)

> Tổng diện tích tôn ống gió chữ nhật kiểm chứng qua `compute_duct_surface_area`: **`515.79 m²` (`159` đốt ống chữ nhật)**.

### 3.1. Trên Layer `M-MVAC-SEAD` (`203` Block HTS)
- **Ống thẳng chia đốt chuẩn `1110 mm` + đốt bù (`159` đốt)**:
  - Ống góp chính `HTS-OG-2200x600`: `3` đốt (`BOD = +2450`, dừng đúng tại mặt bích `X = 37579.39` trước `RC-01`).
  - Nhánh Trái (`Flat Bottom BOD = +2500`): `HTS-OG-1600x450` (`14`), `HTS-OG-1450x400` (`14`), `HTS-OG-1100x400` (`15`), `HTS-OG-800x400` (`10`), `HTS-OG-550x350` (`10`).
  - Nhánh Phải phần dưới (`BOD = +2500`, dừng tại `Y = 37127.69` trước `RC-03`): `HTS-OG-1700x500` (`19`), `HTS-OG-1400x500` (`15`).
  - Nhánh Phải phần trên & Tuyến Bắc (bắt đầu từ `Y = 40734.68` sau `RC-03`, `Flat Top TOD = +3045`): `HTS-OG-1150x500` (`12`, `BOD = +2545`), `HTS-OG-950x450` (`17`, `BOD = +2595`), `HTS-OG-800x400` (`12`, `BOD = +2645`), `HTS-OG-550x350` (`18`, `BOD = +2695`).
- **Cút vuông bo tròn `90°` (`R = W/2`, `08` bộ)**:
  - `HTS-CO-V47-1450x400-R725-A90` (`1`), `HTS-CO-V47-1700x500-R850-A90` (`2`), `HTS-CO-V47-1400x500-R700-A90` (`2` tại Jog #1), `HTS-CO-V47-950x450-R475-A90` (`1`), `HTS-CO-V47-550x350-R275-A90` (`2` tại góc Tây-Bắc). *(02 cút nghiêng 3D tại Jog #2 nằm trong mây `RC-03` để trống chờ Sếp xác nhận).*
- **Côn thu đồng tâm & Côn thu lệch (`09` bộ)**:
  - `HTS-CON-Can-2200x600-1600x450-L204` (`RED-01`)
  - `HTS-CON-Can-1450x400-1600x450-L202` (`RED-02`)
  - `HTS-CON-Phai-1450x400-1100x400-L650` (`RED-03` lệch phẳng phải `L=650`)
  - `HTS-CON-Can-800x400-1100x400-L204` (`RED-04`)
  - `HTS-CON-Can-550x350-800x400-L204` (`RED-05`)
  - `HTS-CON-Phai-1700x500-1400x500-L202` (`RED-06` lệch phẳng phải `L=202`)
  - `HTS-CON-Can-1150x500-950x450-L204` (`RED-08`)
  - `HTS-CON-Can-950x450-800x400-L204` (`RED-09`)
  - `HTS-CON-Can-800x400-550x350-L204` (`RED-10`)
  *(Côn `RED-07` tại đầu vào Jog #2 nằm trong mây `RC-03` để trống).*
- **Chân rẽ gót giày (`25` bộ)**:
  - `01` bộ nhánh chính `HTS-TAP-Phai-1700x500-L200-D200` trích từ ống góp `2200×600`.
  - `24` bộ cổ trích miệng gió `HTS-TAP-Trai-600x300-L150-D150` đúng hướng vát 45° đầu dòng.
- **Nắp bịt đầu ống (`02` bộ)**:
  - `02` bộ `HTS-CAP-550x350-L25` tại cuối Nhánh Trái `(16001.87, 52835.08)` và cuối Nhánh Tây-Bắc `(4415.11, 59204.66)`.

### 3.2. Trên Layer `M-MVAC-Equipment` (`26` Block Động HTS)
- `02` bộ **`HTS_Van gio vuong VCD`**: `DMP-VCD-01` (`Width1 = 1600`, `W1600xH450` tại `(34656.73, 2175.34)`) và `DMP-VCD-02` (`Width1 = 1700`, `W1700xH500`, xoay `90°` tại `(36459.06, 4033.25)`).
- `24` bộ **`HTS_Mieng gio louver`**: `Width1 = 600, Distance1 = 30, Duct = "600x300"` gắn khít cổ `24` chân rẽ gót giày (`-X`, `+Y`, `-Y`).

---

## 4. Danh Sách 03 Đám Mây `REVCLOUD` Bỏ Trống Chờ Trình Hỏi Sếp Hồ (`Layer CLOUND`, ACI `240`)

| Mã Mây | Handle | Khung bao thực tế `bbox` | Số đối tượng `M-MVAC-*` bên trong | Vấn đề kỹ thuật chưa rõ — Đã bỏ trống không vẽ để hỏi Sếp Hồ |
| :---: | :---: | :--- | :---: | :--- |
| **`RC-01`** | `12863` | `[37595.4, 94.8 .. 43274.3, 4242.1]` | **`0`** | **Cụm Chạc quần + Đầu hút & Thân 02 Quạt Hút Khói `Kruger TDC 1250`**: Toàn bộ cụm không có bất kỳ Text ghi kích thước `WxH`, cao độ `BOD` hay lưu lượng/cột áp quạt; đoạn ống nối vào van `MFD` chỉ dài `45.5 mm` (không đủ bẻ bích TDC); cặp chuyển tiếp trước tiêu âm không đổi bề rộng `W=1700` trên mặt bằng; quạt trục & tiêu âm khối chưa có block trong thư viện HTS. |
| **`RC-02`** | `12864` | `[43115.5, 308.3 .. 45899.6, 4032.9]` | **`0`** | **Cụm Đầu đẩy 02 Quạt Hút Khói `Kruger TDC 1250`**: Thiếu toàn bộ Text kích thước ống & cao độ `BOD`; chữ `NRD` / `MFD` trên thiết kế gốc bị lật ngược (mirror); đoạn ống giữa Tiêu âm – `NRD` (`71.4 mm`) rất ngắn; hai đầu ống tại `X = 45603.42` kết thúc cụt chưa rõ đấu vào trục kỹ thuật (Shaft) hay cửa gió Louver. |
| **`RC-03`** | `12865` | `[39789.7, 37143.2 .. 45856.4, 40716.7]` | **`0`** | **Cụm Chuyển hướng Jog #2 Nhánh Phải (`Y = 37128 .. 40735`)**: Thiếu Text ghi kích thước ống ngang; bản thiết kế gốc xuất hiện **nét đôi lệch `9.49 mm`** và cút `ELLIPSE` do ống trong mô hình 3D đi nghiêng dốc `~1.09°` để nâng cao độ đáy từ `BOD = FFL+2500` lên `BOD = FFL+2545` (`+45 mm`). Cần Sếp Hồ chỉ đạo gia công ống vát đổi cao độ Z hay đi phẳng. |

---

## 5. Tổng Hợp Các Quy Tắc Cốt Lõi Đúc Kết Vào Skill `shopdrawing-ong-gio`

1. **Quy tắc Vàng số 1 — 100% HTS Tool**: Bắt buộc dùng 100% công cụ & thư viện HTS (`draw_rectangular_duct`, `draw_round_duct`, `duct_breeches_insert`, `place_duct_elbow`, `QUETPK` / `hvac-fitting-scan`, `hvac-cap`, `duct_set_elevation`, `Library\HVAC\Phụ kiện\`). Tuyệt đối cấm vẽ LINE/POLYLINE thường giả làm ống gió/phụ kiện.
2. **Quy tắc Vàng số 2 — Vẽ Đè Trực Tiếp 100% Tại Chỗ (`In-Place Direct Overlay`)**: Giữ nguyên 100% nét thiết kế gốc làm nền đối chiếu; vẽ trực tiếp đúng tọa độ tim/biên thiết kế gốc (cấm dựng ra vùng nháp bên ngoài rồi move về; khi chạy `QUETPK` tại chỗ thì dùng `set_layer_state` khóa tạm các layer thiết kế cũ trước khi quét rồi mở khóa trả lại nguyên trạng).
3. **Quy tắc Vàng số 3 — Loại Trừ Lẫn Nhau Giữa Vẽ Shop & Khoanh Mây `REVCLOUD` (`100% Mutually Exclusive`)**:
   - **Đã hiểu & chắc chắn đúng**: Vẽ đè khít 100% bằng HTS Tool, **tuyệt đối không khoanh mây**.
   - **Không hiểu / thiếu thông số không chắc chắn / thiếu block thiết bị HTS**: **Khoanh mây `REVCLOUD` (Layer `CLOUND`, ACI `240`) và BỎ TRỐNG HOÀN TOÀN (`0` block mới bên trong mây)**, dừng tuyến ống ngay mép ngoài đám mây, kết thúc tiến trình vẽ rồi mới tổng hợp báo cáo hỏi Sếp.
4. **Quy tắc Vàng số 4 — Đầu mỗi dự án mới**: Đối chiếu bảng Layer thiết kế với bảng chuẩn `Spec-layer ký hiệu ống gió.dwg` (`M-MVAC-*`) và hỏi người dùng xác nhận thông số Layer / màu sắc trước khi triển khai.
