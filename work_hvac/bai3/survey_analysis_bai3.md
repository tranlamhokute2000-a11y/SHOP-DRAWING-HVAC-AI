# Báo Cáo Khảo Sát & Giải Mã Hình Học Hệ Thống Ống Gió — `bai 3.dwg`

- **Tệp bản vẽ**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\bai 3.dwg`
- **Bản sao lưu bảo vệ**: `work_hvac\bai3\bai 3_backup.dwg`
- **Dữ liệu Baseline**: `work_hvac\bai3\baseline.json`
- **Ảnh tổng quan khảo sát**: `work_hvac\bai3\survey_full.png` (2400x5476 px)
- **Đơn vị bản vẽ**: `Millimeters` (`INSUNITS = 4`, `MEASUREMENT = 1` đã chuẩn hóa)
- **Hệ tọa độ Extents**: `(-90611.5, -1707.2) .. (-36300.4, 122223.7)` (~54m x 124m, Tầng Hầm B1)

---

## 1. Bảng Kiểm Kê Thực Thể Gốc (Baseline 100% Bảo Toàn)

Số lượng thực thể gốc phải được giữ nguyên vẹn 100% (không xóa, không di chuyển, `DRAWORDER` nằm dưới lớp Shop):

| Lớp (Layer) Gốc | Loại Thực Thể | Số Lượng | Ghi Chú |
| :--- | :--- | :---: | :--- |
| `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` | `LINE` (208), `INSERT` (188) | **396** | Nét thành ống, van, phụ kiện Revit hệ Hút khói |
| `MEPG-AC-M-Hút gió thải-Exhaust Air-EAD` | `LINE` (73), `INSERT` (31) | **104** | Nét thành ống, van, phụ kiện Revit hệ Gió thải |
| `MEPG-AC-TEXT` | `MTEXT` (94) | **94** | 47 cặp nhãn `<HỆ>-WxH` và `BOD=FFL+<Z>` |
| `MEPG-M-EQUIP` | `INSERT` (6) | **6** | 6 Block quạt Kruger trục đứng/ngang |
| `MEPG-XREF-ARC` | `MTEXT` (8) | **8** | Ký hiệu trục kiến trúc (`\u001e`, `\u001f`) |
| **TỔNG CỘNG THỰC THỂ GỐC** | | **608** | **Mục tiêu QA/QC: Giữ nguyên đúng 608** |

---

## 2. Bảng Ánh Xạ Layer Chuẩn Hóa Theo Spec v3

| Tiền Tố | Layer Đích Spec v3 | Màu ACI | Bề Rộng Nét In | Tiêu Chuẩn | Số Lượng Nhãn |
| :---: | :--- | :---: | :---: | :---: | :---: |
| `EAD` | `M-MVAC-EAD` | **80** | 0.20 mm | Spec v3 Chuẩn | 11 cặp |
| `SED` | `M-MVAC-SEAD` | **190** | 0.20 mm | Spec v3 Chuẩn | 36 cặp |
| `CLOUND` | `CLOUND` | **240** | 0.05 mm | Spec v3 Chuẩn | Dành cho vùng chưa rõ |
| `DIM` | `M-MVAC-DIM` | **97** | 0.05 mm | Spec v3 Chuẩn | DimStyle `HỒ-DIM 1-70` |
| `TEXT` | `M-MVAC-TEXT` | **2** | 0.09 mm | Spec v3 Chuẩn | Leader chỉ dẫn chuyển cao độ |

---

## 3. Phân Loại Rạch Ròi: Tuyến Vẽ Shop vs. Vùng Khoanh Mây CLOUND

### Danh Sách A: Các Tuyến Ống Đủ Thông Số (Triển khai vẽ Shop 100% HTS Tool)

Toàn bộ 47 vị trí nhãn đều có đầy đủ 100% kích thước tiết diện `WxH` và cao độ đáy `BOD`:

#### A1. Hệ Thống Hút Gió Thải (`EAD` -> `M-MVAC-EAD`, ACI 80) — 11 Đoạn
1. **Nhánh Phía Bắc (Ngang)**:
   - `EAD-900x300`, `BOD=3200` tại `(-71972, 119431)`
   - `EAD-700x300`, `BOD=3200` tại `(-66707, 119431)`
   - `EAD-700x300`, `BOD=3200` tại `(-59697, 118385)`
2. **Trục Dọc Chính Phía Tây**:
   - `EAD-1250x500`, `BOD=2400` tại `(-78552, 113420)`
   - `EAD-1250x500`, `BOD=2400` tại `(-76125, 110036)`
   - `EAD-1250x500`, `BOD=2400` tại `(-76124, 93326)`
   - `EAD-1250x500`, `BOD=2400` tại `(-76124, 79588)`
   - `EAD-1250x500`, `BOD=2550` tại `(-76124, 73226)` *(Chuyển cao độ ΔZ = 150 mm)*
   - `EAD-1250x500`, `BOD=2550` tại `(-80259, 70362)`
   - `EAD-1000x450`, `BOD=2575` tại `(-86296, 69938)`
   - `EAD-1000x450`, `BOD=2575` tại `(-86045, 66945)`

#### A2. Hệ Thống Hút Khói (`SED` -> `M-MVAC-SEAD`, ACI 190) — 36 Đoạn
1. **Tuyến Trục Dọc Tây Bắc (Từ Phòng Quạt 1 Đi Xuống)**:
   - Header: `SED-2200x550`, `BOD=2350` tại `(-74224, 116644)`, `(-68687, 112949)`, `(-68687, 109458)`
   - Phân nhánh: `SED-1400x450`, `BOD=2400` tại `(-71654, 109659)`, `(-73918, 102239)`
   - Thu hẹp: `SED-1200x450`, `BOD=2400` tại `(-73818, 93232)`, `(-74399, 79561)`
   - Thu hẹp & Chuyển cao độ: `SED-1000x400`, `BOD=2650` tại `(-74399, 69841)` *(Z-offset ΔZ = 250 mm)*
   - Thu hẹp: `SED-800x350`, `BOD=2675` tại `(-74399, 59578)`, `(-76756, 58366)`, `(-85232, 56175)`
   - Đoạn cuối: `SED-500x350`, `BOD=2675` tại `(-86702, 47358)`
2. **Tuyến Trục Dọc Đông Bắc (Từ X=-61000 Đi Xuống)**:
   - `SED-1400x450`, `BOD=2800` tại `(-61040, 109760)`, `(-54697, 103725)`
   - `SED-1200x450`, `BOD=2800` tại `(-54597, 93386)`
   - `SED-1000x400`, `BOD=2800` tại `(-54496, 76820)`
   - `SED-800x350`, `BOD=2800` tại `(-54496, 71282)`, `(-57321, 64680)`
   - `SED-500x350`, `BOD=2800` tại `(-57320, 56908)`, `(-60785, 51050)` *(BOD=2800 ổn định xuyên suốt)*
3. **Tuyến Phía Nam (Từ Phòng Quạt 2 Đi Tỏa Ra)**:
   - Header: `SED-2200x550`, `BOD=2950` tại `(-48400, 17936)`
   - Nhánh Đông Bắc: `SED-950x450`, `BOD=3050` tại `(-46300, 21217)`
   - Nhánh chính Tây Bắc: `SED-1850x450`, `BOD=3050` tại `(-51099, 23184)`
   - **Vị trí chuyển cao độ cực lớn**: `SED-1850x450`, `BOD=2300` tại `(-58893, 33460)` *(ΔZ = 750 mm)*
   - Tiếp tục sang Tây: `SED-1500x450`, `BOD=2300` tại `(-70078, 33635)`
   - **Vị trí chuyển cao độ lớn**: `SED-1500x450`, `BOD=2720` tại `(-77677, 33635)` *(ΔZ = 420 mm)*
   - Dọc trục Nam: `SED-1300x450`, `BOD=2720` tại `(-78877, 27685)` -> `SED-1200x400`, `BOD=2770` tại `(-78876, 19709)` -> `SED-950x400`, `BOD=2770` tại `(-78875, 13338)` -> `SED-750x350`, `BOD=2820` tại `(-78875, 3498)` (nhánh rẽ `SED-350x350`, `BOD=2770` tại `(-78877, 36283)`)
   - Tuyến phụ Tây Nam: `SED-1000x400`, `BOD=3150` tại `(-63072, 24082)` -> `SED-800x350`, `BOD=3200` tại `(-63063, 10622)`
   - Tuyến phụ Đông Nam (Trục X=-51000): `SED-1200x400`, `BOD=3100` tại `(-51056, 14092)` -> `SED-1000x350`, `BOD=3150` tại `(-50956, 9799)` -> `SED-1000x350`, `BOD=2500` tại `(-50955, 1389)` *(ΔZ = 650 mm)*

---

### Danh Sách B: Vùng Cần Khoanh Mây `CLOUND` Hoặc Xin Ý Kiến Chỉ Đạo

1. **Cụm Phòng Quạt 1 (Phía Bắc, X: -83000 .. -75000, Y: 114000 .. 120500)**:
   - 2 Quạt hút khói Kruger TDC 1120 (`2FE91`, `303FB`), 4 khối tiêu âm `L900xW1250xH1300`, chạc quần chia đôi `30400` (`Trouser Piece-R2`), các đoạn côn chuyển vuông-tròn `L500` và ống nối không có nhãn kích thước Text chi tiết.
   - Quạt thải `TDA 900` (`2FEA0`) và quạt `TDA 630` (`2FEAF`).
   - *Khuyến nghị*: Dừng ống gió Shop ngoài mặt bích van/ống chờ của phòng quạt; khoanh mây `CLOUND` bảo toàn nguyên vẹn nền thiết kế bên trong.
2. **Cụm Phòng Quạt 2 (Phía Đông Nam, X: -44500 .. -36500, Y: 15500 .. 20000)**:
   - 2 Quạt hút khói Kruger TDA 1000 (`318AF`, `318E1`), 4 khối tiêu âm (`L900xW1700xH1000` & `L900xW1250xH1400`), chạc quần `318B0` (`Trouser Piece-R2`), các van MFD/NRD và chuyển vuông-tròn `L700/L500`.
   - *Khuyến nghị*: Dừng ống Shop tại mặt bích ngoài của header `SED-2200x550` (`BOD=2950`); khoanh mây `CLOUND` cụm phòng quạt 2.

---

### Danh Sách C: Các Vị Trí Chuyển Cao Độ Đứng Dọc Tuyến (`ΔZ > 200 mm` - Bàn giao cho `@detailer`)

1. **SED Trục Tây Bắc**: Giữa `SED-1200x450` (`BOD=2400`) tại Y=79561 và `SED-1000x400` (`BOD=2650`) tại Y=69841: $\Delta Z = 250\text{ mm}$.
2. **SED Trục Chính Nam (Đoạn 1)**: Giữa `SED-1850x450` (`BOD=3050`) tại `(-51099, 23184)` và `SED-1850x450` (`BOD=2300`) tại `(-58893, 33460)`: $\Delta Z = 750\text{ mm}$.
3. **SED Trục Chính Nam (Đoạn 2)**: Giữa `SED-1500x450` (`BOD=2300`) tại `(-70078, 33635)` và `SED-1500x450` (`BOD=2720`) tại `(-77677, 33635)`: $\Delta Z = 420\text{ mm}$.
4. **SED Trục Đông Nam (Trục X=-51000)**: Giữa `SED-1000x350` (`BOD=3150`) tại Y=9799 và `SED-1000x350` (`BOD=2500`) tại Y=1389: $\Delta Z = 650\text{ mm}$.
5. *(Tùy chọn phụ)* **EAD Trục Dọc**: Giữa `EAD-1250x500` (`BOD=2400`) tại Y=79588 và `EAD-1250x500` (`BOD=2550`) tại Y=73226: $\Delta Z = 150\text{ mm}$ (dưới 200 mm, có thể dùng côn thu lệch hoặc chếch nhẹ).

---

## 4. Kế Hoạch Bàn Giao Triển Khai Cho Swarm
- **`@coordinator`**: Tiếp nhận báo cáo khảo sát và điều phối `@duct-author` dựng các tuyến ống danh sách A.
- **`@duct-author`**: Dựng các tuyến ống thẳng và cút theo đúng tim trục thiết kế trên layer `M-MVAC-EAD` và `M-MVAC-SEAD`, ngắt chừa mặt bích tại 4 vị trí Z-offset và ranh giới 2 phòng quạt.
- **`@detailer`**: Tiếp nhận 4 vị trí Z-offset trong Danh sách C để dựng chi tiết mặt bằng + trích hình chiếu đứng kèm 3 Dim `HỒ-DIM 1-70` + mây `CLOUND` + mũi tên `MATCHPROP`.
- **`@endcap-finisher`**: Rà soát các đầu cụt cuối tuyến, xóa đốt lẻ `< 100 mm` và chuyển đốt thật thành `HTS-CAP-*`.
- **`@qa-auditor`**: Kiểm toán độc lập 5/5 tiêu chí nghiệm thu bảo toàn 608 thực thể gốc theo `baseline.json`.
