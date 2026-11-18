# KẾ HOẠCH TRIỂN KHAI SHOP DRAWING ỐNG GIÓ HVAC — `bai 2.dwg`

- **Bản vẽ mục tiêu**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\bai 2.dwg` (đang mở sẵn trên AutoCAD / HTS MCP cổng `5088`, version `2.0`, `licensed: true`, `214 tools`)
- **Bản sao lưu gốc (đã tạo trước khi chỉnh sửa)**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\bai 2_backup.dwg` (`5,596,008 bytes`)
- **Dữ liệu tọa độ máy đọc (JSON 0.01 mm)**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\bai2_geometry.json`
- **Ảnh khảo sát trực quan**: `work_hvac\bai2\survey_full.png` & 7 ảnh zoom `work_hvac\bai2\crops\crop1_fan_room.png` .. `crop7_sead_bottom_left.png`
- **Phạm vi công việc (Quy tắc cứng số 0)**:
  - **CHỈ triển khai Ống gió & Phụ kiện đường ống bằng 100% HTS Tool**: Ống thẳng chia đốt `L = 1110 mm` (`HTS-OG-*`), Cút bo góc (`HTS-CO-V47-*`), Côn thu đúng chiều dài thiết kế `L = 204 mm` (`HTS-CON-*`), Chân rẽ gót giày (`HTS-TAP-*` gồm 6 cổ nhánh chính + 28 cổ miệng gió `600x300`), Nắp bịt đầu ống (`HTS-CAP-*`), Gán cao độ đáy (`HTS_OG_DAY`), và Khoanh mây `REVCLOUD` trên Layer `CLOUND`.
  - **TUYỆT ĐỐI KHÔNG chèn**: Miệng gió/cửa gió (`HTS_Mieng gio *`), Van gió (`VCD/FD/MFD/NRD`), Giá đỡ, Dim hay Text phụ (`0` đối tượng trên `M-MVAC-Equipment`). Giữ nguyên toàn bộ van gió & miệng gió gốc bên dưới; dừng ống thẳng **khít 0.00 mm** tại hai mặt bích van gốc!

---

## 1. Hiện Trạng Baseline Bản Vẽ Gốc (Bắt Buộc Bảo Toàn 100%)

- **Cảnh báo kỹ thuật cực kỳ quan trọng về đơn vị (`INSUNITS`)**:
  - `get_drawing_info` hiện trả về `units: "Inches"` (`INSUNITS = 1`), trong khi toàn bộ tọa độ và kích thước ống đều là **Millimeters** (`W = 350..2200 mm`, `Extents ~ 72.3 m x 62.5 m`).
  - **BẮT BUỘC** trước khi vẽ: chạy `_.INSUNITS\n4\n` và `_.MEASUREMENT\n1\n` (chuẩn Millimeters hệ Mét theo `Spec-layer ký hiệu ống gió.dwg`), sau đó kiểm tra `get_bounding_box` của đốt ống đầu tiên xác nhận `W = 2200 mm` (không bị nhân `25.4x`).
- **Trạng thái `OSMODE` gốc**: `4031` (nhớ lưu và khôi phục về `4031` sau khi tắt tạm `OSMODE = 0` để chạy `QUETPK` / `HTS_RVOG`!).
- **Phạm vi `Extents` gốc**: `min = (21594.36, 10782.64)` .. `max = (93916.47, 73336.01)`.
- **Đếm chính xác thực thể nền gốc (`Tổng = 380 thực thể`, phải giữ nguyên 100% sau khi vẽ xong!)**:

| Layer gốc trên `bai 2.dwg` | Số thực thể Baseline | Chi tiết thành phần | Trạng thái yêu cầu sau khi xong |
| :--- | :---: | :--- | :--- |
| `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` | **`309`** | `169` LINE + `139` INSERT (Revit ducts/fittings/valves/grilles) + `1` HATCH (`1CBFF`) | **Giữ nguyên 309**, `locked: false`, `DRAWORDER` nằm dưới `M-MVAC-*` |
| `MEPG-AC-TEXT` | **`67`** | `66` MTEXT thông số (`SEAD-*`, `PAD-*`, `BOD=FFL+*`) + `1` LINE leader (`1D097`) | **Giữ nguyên 67**, `locked: false` |
| `MEPG-M-EQUIP` | **`3`** | `2` quạt hút khói `TDA 1000` (`1CC0E`, `1CFF6`) + `1` quạt tăng áp `TDA 900` (`1CC23`) | **Giữ nguyên 3**, `locked: false` |
| `0` | **`1`** | `1` LWPOLYLINE đám mây mẫu gốc (`1D291` tại góc Đông-Nam `X=85056..93916`) | **Giữ nguyên 1**, không xóa |
| *(7 layer thiết kế trống còn lại)* | `0` | `MEPG-XREF-ARC`, `MEPG-AC`, `...-PAD`, `...-FAD`, `...-EAD`, `...-SAD`, `...-RAD` | Giữ nguyên |

---

## 2. Bảng Ánh Xạ Layer Spec Chuẩn (High Autonomy Mapping)

Dù bản vẽ Revit gốc gộp chung cả 2 hệ thống trên layer `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`, nhãn `MTEXT` phân tách rõ **2 hệ thống ống gió chuẩn Spec**:

| Ký hiệu trên `MTEXT` | Tên Layer Spec chuẩn | Màu ACI | Lineweight MCP | Phạm vi áp dụng trên `bai 2.dwg` |
| :--- | :--- | :---: | :---: | :--- |
| **`SEAD`** | **`M-MVAC-SEAD`** | **`190`** | `20` (`0.20 mm`) | Toàn bộ mạng ống gió Hút khói Sự cố (`34` runs + `8` côn thu + `6` nhánh rẽ + `28` cổ miệng gió + `7` bịt đầu) |
| **`PAD`** | **`M-MVAC-PAD`** | **`210`** | `20` (`0.20 mm`) | Toàn bộ mạng ống gió Tăng áp `900x500` (`6` runs, `4` cút phẳng) |
| *(Cloud)* | **`CLOUND`** | **`240`** | `20` (`0.20 mm`) | `05` đám mây `REVCLOUD` (`RC-01` .. `RC-05`), bên trong `0` đối tượng `M-MVAC-*` |
| *(Các layer Spec còn lại)* | `M-MVAC-EAD` (`80`), `FAD` (`150`), `CEAD` (`170`), `CSAD` (`11`), `Copper Pipe` (`12`), `AC Drain` (`72`), `Equipment` (`47`), `Support` (`42`), `DIM` (`97`), `TEXT` (`2`) | Theo Spec | Theo Spec | Khởi tạo đủ bộ 13 Layer Spec bằng `batch_process` (`create_layer`), để `0` thực thể |

> Mọi đối tượng tạo mới bắt buộc dùng màu **`ByLayer`** (`ACI 256`).

---

## 3. Phân Tách Loại Trừ 100%: Danh Sách A (Vẽ 100% HTS) vs. Danh Sách B (`REVCLOUD` Bỏ Trống)

### 3.1. Lưu Ý Kỹ Thuật Quan Trọng Về Hình Học `bai 2.dwg`
1. **Góc xoay lưới Revit rất nhỏ (`~0.0049°`)**: Giữ nguyên tọa độ chính xác `0.01 mm` từ bảng dưới / `bai2_geometry.json` (KHÔNG làm tròn về số nguyên).
2. **Giao cắt khác cao độ tại `(59376, 47296)`**:
   - `SEAD-950x450` (`SEAD-NE01low`, `BOD = +2505`, đỉnh `+2955`) chui **BÊN DƯỚI** `PAD-900x500` (`PAD-01b`, `BOD = +3000`, hở 45 mm).
   - **CẢNH BÁO CHO `@drafter`**: Khi chạy `QUETPK` trên `M-MVAC-SEAD`, **BẮT BUỘC khóa tạm `M-MVAC-PAD` (`locked: true`)** (và quét theo từng cửa sổ cục bộ, KHÔNG quét qua giao điểm `(59376, 47296)` khi cả 2 layer cùng mở) để `QUETPK` không cắt nhầm giao điểm 2D giữa `SEAD` và `PAD`!
3. **2 Cút Bán Kính Hẹp `0.75W` trên tuyến `PAD-900x500`**:
   - Hai cút `1CEDE` `(44976.14, 62585.80)` và `1CEE1` `(44976.58, 57650.79)` trên thiết kế gốc là loại **`0_75W`** (`tangent = 677 mm` $\Rightarrow$ `R_tim = 675 mm`, **`R_in = 225 mm`** thay vì mặc định `W/2 = 450 mm`!).
   - **BẮT BUỘC truyền `"R": 225`** trong `draw_rectangular_duct` cho 2 run `PAD-02` và `PAD-03`! (Tất cả 9 cút phẳng còn lại đều là bán kính chuẩn `R_in = W/2`, để trống `R` mặc định; riêng 2 cút góc chéo `39.00°` tại `SEAD-NE03` cũng là `R_in = 350 = W/2`, `draw_rectangular_duct` tự đặt khít!).
4. **8 Vị Trí Chuyển Cao Độ Đứng `45°` (Vertical Z-Offsets — Đều Đã Rõ `WxH` & `BOD` Hai Đầu)**:
   - Trên `bai 2.dwg` có 8 bộ cặp cút đứng `45°` chuyển cao độ (cổ bò đứng `Z-01a`, `Z-01b`, `Z-02`, `Z-03`, `Z-04`, `Z-05`, `Z-06`, `Z-07`), tất cả đều ghi rõ `WxH` và `BOD` trước/sau (không phải lỗi nghiêng dốc `ELLIPSE` 3D).
   - Vì HTS MCP chưa có block cút đứng `45°` chuyên biệt, **mỗi Z-offset được tách riêng thành 1 `run` thẳng độc lập đúng từ mặt bích ngoài 1 đến mặt bích ngoài 2 (`L = 768..1127 mm`)** — đảm bảo 100% HTS Tool (`HTS-OG-*`), khớp chính xác vị trí mặt bích thiết kế, nối liền mạch mặt bằng không tạo khoảng hở giả, giữ nguyên cao độ `BOD` chính xác trên toàn bộ các đoạn thượng/hạ lưu, và dễ dàng đổi sang phụ kiện đứng 3D sau này nếu cần.

---

### 3.2. DANH SÁCH A — Bảng Toàn Bộ 40 Tuyến `draw_rectangular_duct` (`34 SEAD` + `6 PAD`) & Cao Độ `BOD`

*(Xem chi tiết JSON sẵn sàng nạp tool trong `work_hvac\bai2\bai2_geometry.json` -> key `runs`)*

#### A.1. Hệ Thống Hút Khói `M-MVAC-SEAD` (ACI `190` — `34` runs)

| Run ID | Cỡ `WxH` | `R` | `BOD` (mm) | Điểm `points` (`x, y` chính xác `0.01 mm`) | Ghi chú điểm dừng / Phụ kiện |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **`SEAD-M01`** | `2200x550` | mặc định | **`2950`** | `(49991.10, 39311.12)` → `(57677.11, 39311.77)` | Ống góp chính: từ mặt bịt `CAP-01` → dừng khít mép `RC-01` (`57677.11`) |
| **`SEAD-NW01a`** | `1850x450` | mặc định | **`3050`** | `(50997.74, 40411.40)` → `(50997.72, 41043.75)` | Nối sát mép `SEAD-M01` (`40411.40`) cho `QUETPK` tạo `BTAP-01` → dừng khít mặt dưới `VCD 1CDD9` |
| **`SEAD-NW01b`** | `1850x450` | mặc định | **`3050`** | `(50997.71, 41193.78)` → `(50997.71, 50339.25)` | Mặt trên `VCD 1CDD9` → mặt dưới Z-offset `Z-02` |
| **`SEAD-NW01z`** | `1850x450` | mặc định | **`2675`** | `(50997.71, 50339.25)` → `(50997.71, 51466.04)` | *Cầu nối Z-offset `Z-02`* (`1CF1C+1CF1B`, `L=1126.79`, `+3050→+2300`) |
| **`SEAD-NW02`** | `1850x450` | mặc định | **`2300`** | `(50997.71, 51466.04)` → `(50997.71, 54834.94)` → `(38278.07, 54834.94)` | Tự đặt cút `90°` `1CF17` → dừng khít mặt Đông `RED-01` |
| **`SEAD-NW03`** | `1500x450` | mặc định | **`2300`** | `(38074.05, 55010.56)` → `(28212.53, 55009.71)` | Mặt Tây `RED-01` (lệch phẳng biên trên `Y=55760.56`, tim dịch `+175 mm`) → mặt Đông `Z-03` |
| **`SEAD-NW03z`** | `1500x450` | mặc định | **`2510`** | `(28212.53, 55009.71)` → `(27417.12, 55009.86)` | *Cầu nối Z-offset `Z-03`* (`1CFD0+1CFD1`, `L=795.41`, `+2300→+2720`) |
| **`SEAD-NW04`** | `1500x450` | mặc định | **`2720`** | `(27417.12, 55009.86)` → `(22396.25, 55009.86)` | Mặt Tây `Z-03` → mặt bịt `CAP-02` |
| **`SEAD-NW05`** | `350x350` | mặc định | **`2770`** | `(23219.35, 55759.86)` → `(23218.96, 60468.49)` | Nối sát mép trên `SEAD-NW04` (`55759.86`) tạo `BTAP-05` → mặt bịt `CAP-03` |
| **`SEAD-W01a`** | `1300x450` | mặc định | **`2720`** | `(23219.47, 54259.86)` → `(23219.49, 53843.81)` | Nối sát mép dưới `SEAD-NW04` (`54259.86`) tạo `BTAP-06` → dừng khít mặt trên `VCD 1CED0` |
| **`SEAD-W01b`** | `1300x450` | mặc định | **`2720`** | `(23219.51, 53693.81)` → `(23220.19, 45576.97)` | Mặt dưới `VCD 1CED0` → mặt trên `RED-02` |
| **`SEAD-W02`** | `1200x400` | mặc định | **`2770`** | `(23220.27, 45372.97)` → `(23220.82, 38827.97)` | `RED-02` → `RED-03` (Phẳng đỉnh `TOD=+3170`) |
| **`SEAD-W03`** | `950x400` | mặc định | **`2770`** | `(23220.84, 38623.97)` → `(23221.41, 31948.97)` | `RED-03` → `RED-04` |
| **`SEAD-W04`** | `750x350` | mặc định | **`2820`** | `(23221.40, 31744.97)` → `(23222.36, 20232.03)` | `RED-04` → mặt bịt `CAP-04` (Phẳng đỉnh `TOD=+3170`) |
| **`SEAD-NE01a`** | `950x450` | mặc định | **`3050`** | `(55796.32, 40411.61)` → `(55796.32, 40878.89)` | Nối sát mép `SEAD-M01` (`40411.61`) tạo `BTAP-02` → mặt dưới `VCD 1CDD6` |
| **`SEAD-NE01b`** | `950x450` | mặc định | **`3050`** | `(55796.32, 41028.89)` → `(55796.32, 47296.09)` → `(57649.13, 47296.25)` | Mặt trên `VCD 1CDD6` → cút `90°` `1CDA9` → mặt Tây `Z-01a` |
| **`SEAD-NE01z1`** | `950x450` | mặc định | **`2778`** | `(57649.13, 47296.25)` → `(58570.91, 47296.32)` | *Cầu nối Z-offset `Z-01a`* (`1CDB2+1CDB3`, `L=921.78`, `+3050→+2505`) |
| **`SEAD-NE01low`** | `950x450` | mặc định | **`2505`** | `(58570.91, 47296.32)` → `(59950.78, 47296.44)` | Đoạn chui dưới `PAD-900x500` (`BOD=+2505`) |
| **`SEAD-NE01z2`** | `950x450` | mặc định | **`2778`** | `(59950.78, 47296.44)` → `(60872.55, 47296.52)` | *Cầu nối Z-offset `Z-01b`* (`1CDB1+1CDB0`, `L=921.77`, `+2505→+3050`) |
| **`SEAD-NE02`** | `950x450` | mặc định | **`3050`** | `(60872.55, 47296.52)` → `(66268.04, 47296.50)` → `(66266.98, 59911.36)` | Mặt Đông `Z-01b` → cút `90°` `1CDB4` → mặt dưới `RED-05` |
| **`SEAD-NE03`** | `700x400` | mặc định | **`3100`** | `(66266.96, 60115.36)` → `(66266.87, 61400.72)` → `(69234.80, 65066.43)` → `(69234.80, 72956.07)` → `(63914.98, 72955.62)` | `RED-05` → 2 cút chéo `39°` (`1CCD1`, `1CCD0`) → cút `90°` (`1CCE5`) → `RED-06` |
| **`SEAD-NE04`** | `550x350` | mặc định | **`3150`** | `(63710.98, 72955.62)` → `(50385.52, 72955.62)` | `RED-06` → mặt bịt `CAP-05` (Phẳng đỉnh `TOD=+3500`) |
| **`SEAD-S01a`** | `1200x400` | mặc định | **`3100`** | `(51040.36, 38211.21)` → `(51040.36, 37956.19)` | **Lưu ý**: tổng dài `255 mm` tới `VCD 1CDC2`! Vẽ mồi dài xuống `Y=37750` để `QUETPK` tạo `BTAP-03`, sau đó xóa ống mồi và vẽ lại đúng đoạn thẳng `38059.11→37956.19` (`L=102.92`)! |
| **`SEAD-S01b`** | `1200x400` | mặc định | **`3100`** | `(51040.36, 37806.17)` → `(51040.64, 34359.93)` | Mặt dưới `VCD 1CDC2` → mặt trên `RED-07` |
| **`SEAD-S02a`** | `1000x350` | mặc định | **`3150`** | `(51140.66, 34155.94)` → `(51140.68, 33934.24)` | Mặt dưới `RED-07` (lệch phẳng biên phải `X=51640.66`, tim dịch `+100 mm`) → mặt trên `VCD 1CDC6` |
| **`SEAD-S02b`** | `1000x350` | mặc định | **`3150`** | `(51140.69, 33784.24)` → `(51141.04, 29477.18)` | Mặt dưới `VCD 1CDC6` → mặt trên `Z-04` |
| **`SEAD-S02z`** | `1000x350` | mặc định | **`2825`** | `(51141.04, 29477.18)` → `(51141.08, 28533.23)` | *Cầu nối Z-offset `Z-04`* (`1CFAD+1CFAF`, `L=943.95`, `+3150→+2500`) |
| **`SEAD-S03`** | `1000x350` | mặc định | **`2500`** | `(51141.08, 28533.23)` → `(51142.40, 12316.00)` | Mặt dưới `Z-04` → dừng đúng đầu cụt thiết kế `Y=12316.00` (trước `RC-03`) |
| **`SEAD-SW01`** | `1000x350` | mặc định | **`2500`** | `(48918.10, 11313.82)` → `(35022.39, 11312.64)` | Dừng vuông góc tại `X=48918.10` (trước `RC-03`) → mặt Đông `RED-08` |
| **`SEAD-SW02`** | `550x350` | mặc định | **`2500`** | `(34818.38, 11312.62)` → `(21619.38, 11311.50)` | Mặt Tây `RED-08` → mặt bịt `CAP-06` |
| **`SEAD-SE01a`** | `750x350` | mặc định | **`3150`** | `(51640.58, 35105.87)` → `(52348.10, 35105.87)` | Nối sát mép phải `SEAD-S01b` (`51640.58`) tạo `BTAP-04` → mặt trái `VCD 1CDBF` |
| **`SEAD-SE01b`** | `750x350` | mặc định | **`3150`** | `(52498.10, 35105.87)` → `(65649.56, 35105.87)` → `(65649.56, 29588.89)` | Mặt phải `VCD 1CDBF` → cút `90°` `1CEF5` → mặt trên `Z-05` |
| **`SEAD-SE01z`** | `750x350` | mặc định | **`2875`** | `(65649.56, 29588.89)` → `(65649.56, 28744.94)` | *Cầu nối Z-offset `Z-05`* (`1CF59+1CF58`, `L=843.95`, `+3150→+2600`) |
| **`SEAD-SE02`** | `750x350` | mặc định | **`2600`** | `(65649.56, 28744.94)` → `(65649.56, 17035.36)` | Mặt dưới `Z-05` → mặt bịt `CAP-07` |

#### A.2. Hệ Thống Tăng Áp `M-MVAC-PAD` (ACI `210` — `6` runs)

| Run ID | Cỡ `WxH` | `R` | `BOD` (mm) | Điểm `points` (`x, y` chính xác `0.01 mm`) | Ghi chú điểm dừng / Phụ kiện |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **`PAD-01a`** | `900x500` | mặc định | **`3000`** | `(63205.73, 43441.80)` → `(62284.12, 43441.79)` | Từ mép Tây côn vuông-tròn `1D00E` (trước `RC-02`) → mặt Đông `MFD-EI120 1D00B` |
| **`PAD-01b`** | `900x500` | mặc định (`450`) | **`3000`** | `(62134.12, 43441.89)` → `(59376.28, 43441.86)` → `(59374.65, 62586.97)` → `(46564.18, 62585.92)` | Mặt Tây `MFD 1D00B` → cút `90°` `1CEED` → cút `90°` `1CEEC` → mặt Đông `Z-06` |
| **`PAD-01z`** | `900x500` | mặc định | **`3175`** | `(46564.18, 62585.92)` → `(45795.97, 62585.86)` | *Cầu nối Z-offset `Z-06`* (`1CEEA+1CEEB`, `L=768.21`, `+3000→+3350`) |
| **`PAD-02`** | `900x500` | **`225`** | **`3350`** | `(45795.97, 62585.86)` → `(44976.14, 62585.80)` → `(44976.29, 61441.60)` | **BẮT BUỘC `R: 225`** khớp cút `0.75W` `1CEDE` → mặt Bắc `Z-07` |
| **`PAD-02z`** | `900x500` | mặc định | **`3570`** | `(44976.29, 61441.60)` → `(44976.36, 60583.40)` | *Cầu nối Z-offset `Z-07`* (`1CEE5+1CEE6`, `L=858.20`, `+3350→+3790`) |
| **`PAD-03`** | `900x500` | **`225`** | **`3790`** | `(44976.36, 60583.40)` → `(44976.58, 57650.79)` → `(43827.42, 57650.69)` | **BẮT BUỘC `R: 225`** khớp cút `0.75W` `1CEE1` → dừng khít mặt Đông trục đứng `1CCFA` (trước `RC-04`) |

---

### 3.3. Bảng 08 Côn Thu Chuẩn Thiết Kế (`L = 204.00 mm`, Layer `M-MVAC-SEAD`)

Toàn bộ 8 côn thu trên Danh sách A đều có chiều dài mặt bích thực tế **`L = 204.00 mm`** (ngắn hơn mặc định `500 mm` của `QUETPK`).
- **Kỹ thuật tạo an toàn 100% không làm mất nét gốc**: Tất cả côn thu gốc trên `bai 2.dwg` là `INSERT` (không phải `LINE`). Khóa toàn bộ layer gốc, vẽ 2 `LINE` tạm đúng 2 cạnh vát côn thu trên `M-MVAC-SEAD` → gọi `HTS_RVOG` (`hvac-revit-convert`) quét đúng 2 `LINE` tạm đó để sinh block `*-CON-(Can|Trai|Phai)-...-L204` trùng khít `0.00 mm` → đổi tiền tố block về `HTS-CON-...` → kiểm tra lại `group_summary_by_layer` xác nhận `MEPG-AC-M-...-SED` vẫn giữ nguyên đúng **`309`**!

| Mã Côn | Handle gốc | Tiết diện Lớn → Nhỏ | Chiều dài `L` | Kiểu lệch | Tọa độ tim bích 1 → bích 2 | `BOD` gán |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **`RED-01`** | `1CDD1` | `1850x450 → 1500x450` | `204 mm` | **Lệch phẳng biên TRÊN** (`Y=55760.56`, `ΔY=+175`) | `(38278.07, 54834.94)` → `(38074.05, 55010.56)` | `2300` |
| **`RED-02`** | `1CCE7` | `1300x450 → 1200x400` | `204 mm` | Đồng tâm (`Can`) | `(23220.19, 45576.97)` → `(23220.27, 45372.97)` | `2720` |
| **`RED-03`** | `1CCE4` | `1200x400 → 950x400` | `204 mm` | Đồng tâm (`Can`) | `(23220.82, 38827.97)` → `(23220.84, 38623.97)` | `2770` |
| **`RED-04`** | `1CCE6` | `950x400 → 750x350` | `204 mm` | Đồng tâm (`Can`) | `(23221.41, 31948.97)` → `(23221.40, 31744.97)` | `2770` |
| **`RED-05`** | `1CDB5` | `950x450 → 700x400` | `204 mm` | Đồng tâm (`Can`) | `(66266.98, 59911.36)` → `(66266.96, 60115.36)` | `3050` |
| **`RED-06`** | `1CEDB` | `700x400 → 550x350` | `204 mm` | Đồng tâm (`Can`) | `(63914.98, 72955.62)` → `(63710.98, 72955.62)` | `3100` |
| **`RED-07`** | `1CF44` | `1200x400 → 1000x350` | `204 mm` | **Lệch phẳng biên PHẢI** (`X=51640.66`, `ΔX=+100`) | `(51040.64, 34359.93)` → `(51140.66, 34155.94)` | `3100` |
| **`RED-08`** | `1CCE3` | `1000x350 → 550x350` | `204 mm` | Đồng tâm (`Can`) | `(35022.39, 11312.64)` → `(34818.38, 11312.62)` | `2500` |

---

### 3.4. Bảng 06 Chân Rẽ Gót Giày Nhánh Chính (`BTAP-01..06`) & 28 Cổ Miệng Gió `600x300` (`HTS-TAP-*`)

#### A. 06 Chân Rẽ Nhánh Chính (Layer `M-MVAC-SEAD`, `L = 150 mm`, `D = 150 mm`)

| Mã | Handle gốc | Cỡ nhánh `WxH` | Bám sườn ống chính | Điểm bám tim sườn `(x, y)` | Hướng vươn | Hướng vát `45°` (thượng lưu về quạt) | `BOD` |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| **`BTAP-01`** | `1CDCC` | `1850x450` | `SEAD-M01` (`2200x550`) | `(50997.74, 40411.40)` | `+Y` | **`+X`** (Phải) | `3050` |
| **`BTAP-02`** | `1CDA8` | `950x450` | `SEAD-M01` (`2200x550`) | `(55796.32, 40411.61)` | `+Y` | **`+X`** (Phải) | `3050` |
| **`BTAP-03`** | `1CDC9` | `1200x400` | `SEAD-M01` (`2200x550`) | `(51040.36, 38211.21)` | `-Y` | **`+X`** (Phải) | `3100` |
| **`BTAP-04`** | `1CDCA` | `750x350` | `SEAD-S01b` (`1200x400`) | `(51640.58, 35105.87)` | `+X` | **`+Y`** (Lên) | `3150` |
| **`BTAP-05`** | `1CECE` | `350x350` | `SEAD-NW04` (`1500x450`) | `(23219.35, 55759.86)` | `+Y` | **`+X`** (Phải) | `2770` |
| **`BTAP-06`** | `1CECF` | `1300x450` | `SEAD-NW04` (`1500x450`) | `(23219.47, 54259.86)` | `-Y` | **`+X`** (Phải) | `2720` |

#### B. 28 Cổ Miệng Gió Gót Giày `600x300` (`HTS-TAP-*-600x300-L150-D150`, Layer `M-MVAC-SEAD` — DỪNG TẠI CỔ, KHÔNG CHÈN CỬA GIÓ!)

*(Toàn bộ 28 tọa độ điểm bám `attach`, đầu ống mồi `baitEnd` dài `400 mm`, và `designBbox` đối chiếu chiều vát `45°` đã xuất sẵn trong `work_hvac\bai2\bai2_geometry.json` -> key `grilleTaps`)*:

- **Nhánh Đông-Bắc (`7` cổ)**: `1CDDF` (`+Y`, vát `-X`, `BOD 3050`), `1CDE5` (`-X`, vát `-Y`, `BOD 3050`), `1CDE6` (`-X`, vát `-Y`, `BOD 3050`), `1CDEA` (`-X`, vát `-Y`, `BOD 3100`), `1CDE9` (`-Y`, vát `+X`, `BOD 3100` — lưu ý trên gốc thiếu block cửa gió nhưng vẫn có gót giày `600x300` tại `collarX=64588.81, attachY=72605.68`), `1CDE8` (`-Y`, vát `+X`, `BOD 3150`), `1CDE7` (`-Y`, vát `+X`, `BOD 3150`).
- **Nhánh Tây-Bắc & Ngang Tây (`3` cổ)**: `1CF15` (`-Y`, vát `+X`, `BOD 2300`), `1CE01` (`+Y`, vát `+X`, `BOD 2300`), `1CE18` (`-X`, vát `-Y`, `BOD 2770` trên nhánh `350x350`).
- **Nhánh Đứng Trái (`11` cổ)**: `1D05B` (`-X`, vát `+Y`, `BOD 2720`), `1CE16` (`+X`, vát `+Y`, `BOD 2720`), `1CE15` (`-X`, vát `+Y`, `BOD 2720`), `1CE13`/`1CE14` (đối xứng `-X/+X`, vát `+Y`, `BOD 2770`), `1CE11`/`1CE12` (đối xứng `-X/+X`, vát `+Y`, `BOD 2770`), `1CE10`/`1CE0F` (đối xứng `-X/+X`, vát `+Y`, `BOD 2820`), `1CE0D`/`1CE0E` (đối xứng `-X/+X`, vát `+Y`, `BOD 2820`).
- **Nhánh Đông-Nam `750x350` (`3` cổ)**: `1CDEC` (`-X`, vát `+Y`, `BOD 3150`), `1CF54` (`-X`, vát `+Y`, `BOD 2600`), `1CF53` (`-X`, vát `+Y`, `BOD 2600`).
- **Nhánh Ngang Đáy Nam (`4` cổ)**: `1CDF4` (`+Y`, vát `+X`, `BOD 2500`), `1CDF3` (`+Y`, vát `+X`, `BOD 2500`), `1CDF2` (`+Y`, vát `+X`, `BOD 2500`), `1CDF1` (`+Y`, vát `+X`, `BOD 2500`).

> **Kiểm soát chiều vát `45°`**: Sau khi `QUETPK` sinh `HTS-TAP-*`, đối chiếu `get_bounding_box` của từng `HTS-TAP-*` với `designBbox` trong `bai2_geometry.json` — nếu ngược hướng vát `45°`, dùng `mirror_entity` (`eraseSource: true`) qua trục tim cổ trích!

---

### 3.5. Bảng 07 Nắp Bịt Đầu Ống (`hvac-cap` → `HTS-CAP-{W}x{H}-L25`, Layer `M-MVAC-SEAD`)

Vẽ đốt ống mồi `25 mm` từ `face` → `outer`, gọi `ui_feature_run` `{"id": "hvac-cap", "inputs": ["pickX,pickY"]}` tại điểm nằm chính xác trên cạnh biên:

| Mã | Handle gốc | Cỡ `WxH` | Hướng | Mặt ống `face` → Đầu ngoài `outer` (`25 mm`) | Điểm Pick biên (`pickEdge`) | `BOD` |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **`CAP-01`** | `1CDBE` | `2200x550` | `-X` | `(49991.10, 39311.12)` → `(49966.10, 39311.12)` | `49978.60,40411.12` | `2950` |
| **`CAP-02`** | `1CDD4` | `1500x450` | `-X` | `(22396.25, 55009.86)` → `(22371.25, 55009.86)` | `22383.75,55759.86` | `2720` |
| **`CAP-03`** | `1CDD3` | `350x350` | `+Y` | `(23218.96, 60468.49)` → `(23218.96, 60493.49)` | `23043.96,60480.99` | `2770` |
| **`CAP-04`** | `1CDD5` | `750x350` | `-Y` | `(23222.36, 20232.03)` → `(23222.36, 20207.03)` | `22847.36,20219.53` | `2820` |
| **`CAP-05`** | `1CDB6` | `550x350` | `-X` | `(50385.52, 72955.62)` → `(50360.52, 72955.62)` | `50373.02,73230.62` | `3150` |
| **`CAP-06`** | `1CDCB` | `550x350` | `-X` | `(21619.38, 11311.50)` → `(21594.38, 11311.50)` | `21606.88,11586.50` | `2500` |
| **`CAP-07`** | `1CF50` | `750x350` | `-Y` | `(65649.56, 17035.36)` → `(65649.56, 17010.36)` | `65274.56,17022.86` | `2600` |

---

### 3.6. Bảng 07 Van Gió Nằm Trên Danh Sách A (Giữ Nguyên Bản Gốc — KHÔNG Chèn Mới)

Các `run` đã được cắt dừng khít hai mặt bích của 7 van gió gốc sau (`8` van còn lại nằm bên trong `RC-01` và `RC-02`):
- `1CDD9` (`VCD 1850`, `Y = 41043.75..41193.78`)
- `1CDD6` (`VCD 950`, `Y = 40878.89..41028.89`)
- `1CDC2` (`VCD 1200`, `Y = 37806.17..37956.19`)
- `1CDC6` (`VCD 1000`, `Y = 33784.24..33934.24`)
- `1CDBF` (`VCD 750`, `X = 52348.10..52498.10`)
- `1CED0` (`VCD 1300`, `Y = 53693.81..53843.81`)
- `1D00B` (`MFD-EI120 900`, `X = 62134.12..62284.12`)

---

## 4. DANH SÁCH B — 05 Đám Mây `REVCLOUD` Trên Layer `CLOUND` (ACI `240`, Bỏ Trống `0` `M-MVAC-*` Bên Trong)

> Đã chạy kiểm tra toán học tự động (**ZERO-OVERLAP ASSERTION = PASS**): cả 5 khung bao `RC-01..RC-05` có khoảng hở tối thiểu `25–600 mm` so với toàn bộ biên ống + tai bích TDC của Danh sách A.

| Mã Mây | Lệnh `_.REVCLOUD` chuẩn AutoCAD 2021–2027 (`Layer CLOUND`, ACI `240`) | Nội dung vướng mắc cần hỏi Kỹ sư sau khi kết thúc vẽ |
| :---: | :--- | :--- |
| **`RC-01`** | `_.REVCLOUD\n_A\n450\n_R\n57710,37300\n65900,41320\n` | **Cụm Phòng Quạt Hút Khói Đôi `SEAD`** (`Chạc quần 1CC0F` + `2 quạt TDA 1000` + `4 tiêu âm` + `2 MFD` + `2 NRD` + `2 đầu đẩy cụt X=65680`): Thiếu toàn bộ Text `WxH`/`ØD` & `BOD`; HTS chưa có block Quạt hướng trục & Tiêu âm; đầu đẩy kết thúc cụt chưa rõ đấu nối Shaft/Louver. |
| **`RC-02`** | `_.REVCLOUD\n_A\n400\n_R\n63235,41350\n66950,44100\n` | **Cụm Quạt Tăng Áp `PAD` (`TDA 900`) & Mâu thuẫn nhãn `SEAD-900x350`**: Quạt hướng trục chưa có block HTS; ngay sau cút `1CCF9` nối từ `PAD-900x500 (BOD=+3000)` có nhãn leader ghi **`SEAD-900x350 / BOD=FFL+3075`** dù không có côn thu hay chuyển cao độ; đầu ống tại `Y=41521.5` kết thúc cụt. |
| **`RC-03`** | `_.REVCLOUD\n_A\n350\n_R\n48955,10600\n51850,12285\n` | **Góc Đứt Gãy Thiếu Cút Nối `SEAD-1000x350` Đáy Nam**: Tuyến đứng dừng cụt ở `Y=12316`, tuyến ngang dừng lệch mép `50.9 mm` ở `X=48918.1 / 48969.0` (khoảng hở `~2.2 m x 1.0 m` không cút, không bịt đầu). Cần xác nhận nối cút `90°` hay có trục/thiết bị thiếu. |
| **`RC-04`** | `_.REVCLOUD\n_A\n250\n_R\n43020,57000\n43800,58300\n` | **Cút Đứng / Trục Đứng Cuối Tuyến `PAD-900x500` (`1CCFA + Hatch 1CBFF`)**: Không có nhãn ghi chú hướng đi **LÊN (UP)** hay **XUỐNG (DOWN)**, không rõ cao độ đích của trục tăng áp cầu thang. |
| **`RC-05`** | `_.REVCLOUD\n_A\n250\n_R\n35700,52850\n37300,53650\n` | **Nhãn Text Lạc `PAD-1200x450 / BOD=FFL+3550`**: Nằm trơ trọi ở khoảng trống bên dưới ống `SEAD-1500x450` không có nét ống gió tương ứng. Cần xác nhận là Text dư hay bị thiếu tuyến ống `PAD-1200x450`. |

---

## 5. Trình Tự Thực Thi Khuyến Nghị Cho `@drafter`

1. **Thiết lập đơn vị & Layer**: Đặt `INSUNITS = 4`, `MEASUREMENT = 1`, lưu `OSMODE = 4031`; tạo đủ 13 Layer Spec bằng `batch_process` (`create_layer`).
2. **Khóa tạm toàn bộ Layer thiết kế gốc**: `set_layer_state` (`locked: true`) cho `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`, `MEPG-AC-TEXT`, `MEPG-M-EQUIP`, `0`.
3. **Vẽ toàn bộ 34 runs `M-MVAC-SEAD` & 6 runs `M-MVAC-PAD`** bằng `draw_rectangular_duct` (nhớ truyền `R: 225` cho `PAD-02`, `PAD-03`!; verify `W = 2200` trên đốt đầu tiên!).
4. **Sinh 06 Chân rẽ nhánh chính (`BTAP-01..06`) & 28 Cổ miệng gió `600x300`** bằng `QUETPK` (`OSMODE = 0`, **khóa tạm `M-MVAC-PAD` khi quét `M-MVAC-SEAD`**, tránh quét giao điểm `(59376, 47296)`), xóa đốt mồi dư và kiểm tra chiều vát `45°` khớp `designBbox` trong `bai2_geometry.json`.
5. **Sinh 08 Côn thu chuẩn `L = 204 mm`** (`RED-01..08`) khớp `0.00 mm` thiết kế, đảm bảo tên block chuẩn `HTS-CON-...` và kiểm tra `group_summary_by_layer` giữ nguyên `309` thực thể nền gốc!
6. **Sinh 07 Nắp bịt đầu `HTS-CAP-*`** (`CAP-01..07`) bằng `hvac-cap`.
7. **Gán cao độ đáy `HTS_OG_DAY`** bằng `duct_set_elevation` cho 100% block trên `M-MVAC-SEAD` và `M-MVAC-PAD` theo bảng `BOD`.
8. **Khoanh 05 đám mây `REVCLOUD` (`RC-01..RC-05`)** trên Layer `CLOUND` (ACI `240`), xác nhận `0` thực thể `M-MVAC-*` trong mỗi mây.
9. **Hoàn thiện**: `DRAWORDER` đưa toàn bộ `M-MVAC-SEAD` & `M-MVAC-PAD` lên trên cùng (`Front`), mở khóa trả nguyên trạng 100% layer thiết kế gốc (`locked: false`), khôi phục `OSMODE = 4031`, `save_drawing`.
