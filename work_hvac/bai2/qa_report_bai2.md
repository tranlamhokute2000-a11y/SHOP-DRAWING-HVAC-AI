# BÁO CÁO NGHIỆM THU QA/QC ĐỘC LẬP — SHOP DRAWING ỐNG GIÓ HVAC (`bai 2.dwg`)

- **Trạng thái nghiệm thu**: **PASS 100% (5/5 Tiêu chí)** — Đủ điều kiện bàn giao.
- **Bản vẽ đã nghiệm thu**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\bai 2.dwg` (đã `QSAVE`, sạch Command Line)
- **Bản sao lưu gốc**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\work_hvac\bai2\bai 2_backup.dwg`
- **Tài liệu đối chiếu**: `work_hvac\bai2\plan_bai2.md`, `work_hvac\bai2\bai2_geometry.json`, `work_hvac\bai2\drafter_log.md`
- **Phương pháp kiểm tra**: Truy vấn chỉ-đọc 100% trực tiếp trên AutoCAD qua HTS MCP (`http://localhost:5088/mcp`: `get_drawing_info`, `get_current_settings`, `get_layer_list`, `get_layer_info`, `group_summary_by_layer`, `list_block_definitions`, `get_entities_in_area`, `get_bounding_box`, `get_xdata`, `select_by_color`, `compute_duct_surface_area`, `extract_all_text`, `export_plan_image`) + kiểm tra trực quan 14 ảnh PNG bằng mắt.

---

## 1. Bảng Ánh Xạ Layer Spec Đã Áp Dụng (High Autonomy Mapping)

Toàn bộ 13 Layer chuẩn theo `Spec-layer ký hiệu ống gió.dwg` đã được khởi tạo đủ (`ByLayer`, `Continuous`, `is_plottable = true`, `is_locked = false`, `is_frozen = false`, `is_off = false`):

| Hệ thống / Hạng mục | Tên Layer Spec | Màu ACI | Lineweight | Số thực thể | Ghi chú phạm vi (Quy tắc cứng số 0) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Hút khói sự cố (`SEAD`) | **`M-MVAC-SEAD`** | `190` | `20` | **`278`** | 100% `INSERT` `HTS-*` (`222` ống thẳng, `7` cút, `8` côn thu, `6` nhánh rẽ chính, `28` cổ miệng gió `600x300`, `7` nắp bịt đầu) |
| Tăng áp (`PAD`) | **`M-MVAC-PAD`** | `210` | `20` | **`42`** | 100% `INSERT` `HTS-*` (`38` ống thẳng `900x500`, `4` cút phẳng gồm `2` cút hẹp `R=225`) |
| Khoanh mây chưa rõ | **`CLOUND`** | `240` | `20` | **`5`** | `5` đám mây `REVCLOUD` kín (`RC-01..RC-05`), `0` thực thể `M-MVAC-*` bên trong |
| Thiết bị / Van / Cửa gió | `M-MVAC-Equipment` | `47` | `9` | **`0`** | Đúng Quy tắc số 0 — không tự ý chèn van/cửa gió |
| 9 Layer Spec còn lại | `EAD (80)`, `FAD (150)`, `CEAD (170)`, `CSAD (11)`, `Copper Pipe (12)`, `AC Drain (72)`, `Support (42)`, `DIM (97)`, `TEXT (2)` | Chuẩn Spec | Chuẩn Spec | **`0`** | Khởi tạo sẵn đúng chuẩn, không sinh đối tượng thừa |

---

## 2. Kết Quả Kiểm Tra 5 Tiêu Chí QA/QC Độc Lập

### [1] 100% HTS Tool & Tuân Thủ Phạm Vi Quy Tắc Số 0 — **PASS**
- **100% Block HTS chuẩn**: Tất cả **`320 / 320`** thực thể trên `M-MVAC-SEAD` (`278`) và `M-MVAC-PAD` (`42`) đều là `INSERT` mang tên `HTS-*`:
  - `260` đốt ống thẳng `HTS-OG-*` (`222 SEAD` + `38 PAD`, gồm 8 cầu nối Z-offset `45°`)
  - `11` cút bo `HTS-CO-V47-*` (`7 SEAD` gồm `2` cút góc chéo `39°` `R350-A39`; `4 PAD` gồm `2` cút hẹp `0.75W` `R225-A90`)
  - `8` côn thu chính xác chiều dài thiết kế `HTS-CON-*` (`1` `L202` phẳng biên trên `RED-01`, `1` `L204` phẳng biên phải `RED-07`, `6` `L204` đồng tâm `RED-02..06, 08`)
  - `34` chân rẽ gót giày `HTS-TAP-*` (`6` nhánh chính `BTAP-01..06` + `28` cổ miệng gió `600x300` `L150-D150`)
  - `7` nắp bịt đầu ống `HTS-CAP-*-L25` (`CAP-01..07`)
- **0 nét vẽ giả**: `0` `LINE`/`LWPOLYLINE`/`ARC`/`CIRCLE` trên các layer `M-MVAC-*`.
- **0 Block thừa**: `list_block_definitions` xác nhận **`0`** block có `instance_count = 0`.
- **100% ByLayer**: `select_by_color` xác nhận `0` thực thể mang màu cưỡng bức ngoài `ByLayer`.
- **Quy tắc số 0**: `0` thực thể ngoài yêu cầu trên `M-MVAC-Equipment`, `Support`, `DIM`, `TEXT`. Cả `7` van gió Danh sách A (`1CDD9`, `1CDD6`, `1CDC2`, `1CDC6`, `1CDBF`, `1CED0`, `1D00B`) đều còn nguyên vẹn bên dưới với **`0`** block xuyên thân van; cả `28` cổ miệng gió dừng đúng tại cổ gót giày `HTS-TAP-*`.

### [2] Đè Khít 100% Tại Chỗ (`In-Place Overlay`) & Bảo Toàn 100% Nền Gốc — **PASS**
- **Bảo toàn 100% thực thể thiết kế gốc (`380 / 380`)**:
  - `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`: **`309 / 309`** (`100%`)
  - `MEPG-AC-TEXT`: **`67 / 67`** (`100%`)
  - `MEPG-M-EQUIP`: **`3 / 3`** (`100%`)
  - `0`: **`1 / 1`** (`100%`)
  - Tổng thực thể bản vẽ: **`705`** (`380` gốc + `320` HTS + `5` REVCLOUD).
- **Độ chính xác đường tim `< 1 mm`**: Kiểm tra toàn bộ `260` đốt ống thẳng trên `40` tuyến so với đường tim thiết kế trong `bai2_geometry.json` → **sai số tim lớn nhất = `0.005 mm`** (`<< 1.0 mm`).
- **Độ chính xác phụ kiện**:
  - Cả `8/8` côn thu (`RED-01..08`), `6/6` nhánh chính (`BTAP-01..06`), `28/28` cổ miệng gió `600x300` (đều đúng chiều vát `45°` hướng thượng lưu về phía quạt), `7/7` nắp bịt đầu (`CAP-01..07`), và `11/11` cút phẳng đều trùng khít mặt bích & đường cong thiết kế gốc.
- **Trạng thái Layer & Bản vẽ sạch**:
  - Đơn vị: **`Millimeters`** (`INSUNITS = 4`, `MEASUREMENT = 1`), `OSMODE` khôi phục đúng gốc **`4031`**.
  - Toàn bộ **`24 / 24`** layer đều `is_locked = false`, `is_frozen = false`, `is_off = false`.
  - Phạm vi `Extents`: `(21594.36, 10509.50) .. (93916.47, 73336.01)` — không có đối tượng rác ngoài khung bản vẽ.

### [3] Loại Trừ Lẫn Nhau 100% Giữa Vẽ & `REVCLOUD` (Quy Tắc Số 4) — **PASS**
- Kiểm tra bằng cả `get_entities_in_area` lẫn thuật toán giao cắt Bounding Box chặt với toàn bộ `320` block `M-MVAC-*`:

| Mã Mây | Handle | Bounding Box thực tế `(minX, minY) .. (maxX, maxY)` | Giao cắt `M-MVAC-*` | Đánh giá bao phủ vùng chưa rõ |
| :---: | :---: | :--- | :---: | :--- |
| **`RC-01`** | `1D980` | `(57720.55, 37180.51) .. (66020.15, 41320.86)` | **`0`** | Bao trọn phòng quạt đôi `SEAD` (`53` thực thể gốc) |
| **`RC-02`** | `1D981` | `(63236.63, 41378.04) .. (67045.79, 44202.78)` | **`0`** | Bao trọn quạt `PAD` + nhãn mâu thuẫn `SEAD-900x350` (`22` thực thể gốc) |
| **`RC-03`** | `1D982` | `(48952.74, 10509.50) .. (51945.08, 12288.37)` | **`0`** | Bao trọn góc đứt gãy đáy Nam thiếu cút nối |
| **`RC-04`** | `1D983` | `(42960.99, 56946.02) .. (43800.90, 58367.33)` | **`0`** | Bao trọn trục đứng cuối tuyến `PAD` (`1CCFA + Hatch 1CBFF`) |
| **`RC-05`** | `1D98B` | `(36136.66, 52841.85) .. (37823.95, 53629.32)` | **`0`** | Bao trọn cả 2 dòng `MTEXT` lạc `1D0D6/1D0D7` (`PAD-1200x450 / BOD=FFL+3550`) |

- Không có chữ/leader rải rối bên trong các đám mây; không có đám mây thừa trên vùng đã hiểu.

### [4] Toàn Vẹn Dữ Liệu 3D / BOQ (`HTS_OG_DAY` & Diện Tích Tôn) — **PASS**
- Quét `get_xdata` (`appName: "HTS_OG_DAY"`) trên **`320 / 320`** block (`278 SEAD` + `42 PAD`): **`320 / 320` có đầy đủ XData `code: 1040` khớp chính xác 100% cao độ `BOD`** trong `plan_bai2.md` (`0` thiếu, `0` sai lệch — bao gồm toàn bộ 40 runs, 8 côn thu, 6 nhánh rẽ chính, 28/28 cổ miệng gió `600x300`, 7 nắp bịt đầu).
- Tổng diện tích tôn ống thẳng (`compute_duct_surface_area`, `lengthScaleToMeter: 0.001`): **`743.98 m²`** trên **`260`** đốt ống thẳng chữ nhật.

### [5] Kiểm Tra Trực Quan Bằng Ảnh Xuất (`export_plan_image` + `read_file`) — **PASS**
Đã xuất và soi kiểm tra trực quan toàn bộ **14 ảnh QA** trong `work_hvac\bai2\`:
1. `work_hvac\bai2\qa_full.png` — Toàn mặt bằng tổng thể
2. `work_hvac\bai2\qa_crop01_header_rc01_rc02.png` — Ống góp `2200x550`, `BTAP-01..03`, `VCD`, `MFD`, `RC-01`, `RC-02`
3. `work_hvac\bai2\qa_crop02_btap03_04_red07.png` — `BTAP-03` + đốt ngắn `55 mm` khít `VCD 1CDC2`, `BTAP-04`, `RED-07` lệch phẳng phải + `VCD 1CDC6`
4. `work_hvac\bai2\qa_crop03_crossing_sead_pad.png` — Giao cắt khác cao độ `SEAD-950x450` dưới `PAD-900x500`, `Z-01a/b`, 2 cút `90°`, cổ `1CDDF`
5. `work_hvac\bai2\qa_crop04_pad_tight_elbows_rc04.png` — 2 cút hẹp `0.75W` (`R=225`) trên `PAD-02/03`, `Z-06/07`, `RC-04`
6. `work_hvac\bai2\qa_crop05_red01_rc05_nw.png` — Côn lệch phẳng trên `RED-01` (`L202`) & `RC-05` bao trọn 2 dòng `PAD-1200x450 / BOD=FFL+3550`
7. `work_hvac\bai2\qa_crop06_nw_west_btap05_06_cap02_03.png` — `CAP-02/03`, `BTAP-05/06`, `VCD 1CED0`, `Z-03`, cổ `1CE18` & `1D05B`
8. `work_hvac\bai2\qa_crop07a_west_red02_03.png` — Nhánh đứng Tây: `RED-02`, `RED-03`, cổ `1CE15`, cặp đối xứng `1CE13/1CE14`
9. `work_hvac\bai2\qa_crop07b_west_red04_cap04.png` — Nhánh đứng Tây đoạn dưới: `RED-04`, cặp đối xứng `1CE11/12`, `1CE10/0F`, `1CE0D/0E`, `CAP-04`
10. `work_hvac\bai2\qa_crop08_ne_39deg_red05_06_cap05.png` — Nhánh Đông-Bắc: `RED-05`, 2 cút góc chéo `39°`, cút `90°`, `RED-06`, `CAP-05`, 4 cổ miệng gió
11. `work_hvac\bai2\qa_crop09_south_rc03_red08_cap06.png` — Nhánh đáy Nam: `RED-08`, `CAP-06`, 4 cổ miệng gió `+Y`, `RC-03`
12. `work_hvac\bai2\qa_crop10_rc03_zoom.png` — Zoom cận `RC-03` kiểm tra khe hở tuyệt đối `0` giao cắt với `SEAD-S03` & `SEAD-SW01`
13. `work_hvac\bai2\qa_crop11_se_elbow_cap07.png` — Nhánh Đông-Nam: cút `90°`, `Z-05`, 3 cổ miệng gió, `CAP-07`
14. `work_hvac\bai2\qa_crop12_nw_elbow_z02.png` — Cút lớn `1850x450` (`R925`), `Z-02`, cổ miệng gió `1CF15`

**Nhận xét trực quan**: Toàn bộ đường nét `M-MVAC-SEAD` và `M-MVAC-PAD` hiển thị sắc nét nằm trên (`DRAWORDER _Front`) nét thiết kế màu vàng gốc; đường tim, góc vát côn thu, bán kính cút (gồm cả `39°` và `R=225`), chiều vát `45°` của toàn bộ `34` gót giày, mặt bích dừng tại `7` van gió, và `5` đám mây `CLOUND` đều đạt độ sạch và chính xác cao, không có khe hở bất thường, chồng chéo hay nắp bịt trôi.

---

## 3. Bảng Câu Hỏi Xác Nhận Cho 05 Đám Mây `REVCLOUD` (`Layer CLOUND`)

| Mã Mây | Vị trí trên mặt bằng | Vướng mắc cần Kỹ sư xác nhận |
| :---: | :--- | :--- |
| **`RC-01`** | Phòng Quạt Hút Khói Đôi `SEAD` (`X=57720..66020, Y=37180..41320`) | Cụm chạc quần + 2 quạt `TDA 1000` + 4 tiêu âm + 2 `MFD` + 2 `NRD` + 2 đầu đẩy cụt thiếu toàn bộ nhãn `WxH`/`ØD` & `BOD`, chưa rõ đấu nối đầu đẩy ra Shaft/Louver; đồng thời thư viện HTS chưa có block Quạt hướng trục & Tiêu âm khối. Cần xác nhận kích thước, cao độ và phương án xử lý cụm thiết bị này. |
| **`RC-02`** | Cụm Quạt Tăng Áp `PAD` (`X=63237..67046, Y=41378..44203`) | Quạt `TDA 900` chưa có block HTS; ngay sau cút nối từ `PAD-900x500 (BOD=+3000)` xuất hiện nhãn leader **`SEAD-900x350 / BOD=FFL+3075`** mâu thuẫn cả tên hệ (`SEAD` vs `PAD`) lẫn kích thước/cao độ (không có côn thu); đầu ống dừng cụt tại `Y=41521.5`. Cần xác nhận đúng hệ/cỡ ống và điểm đấu nối đầu cụt. |
| **`RC-03`** | Góc Đáy Nam `SEAD-1000x350` (`X=48953..51945, Y=10510..12288`) | Tuyến đứng dừng cụt ở `Y=12316`, tuyến ngang dừng lệch mép ở `X=48918.1` (khoảng hở `~2.2 m x 1.0 m` không có cút nối hay nắp bịt). Cần xác nhận nối bằng cút `90°` `1000x350` hay đang thiếu trục/thiết bị tại góc này. |
| **`RC-04`** | Trục đứng cuối tuyến `PAD-900x500` (`X=42961..43801, Y=56946..58367`) | Trục đứng (`1CCFA + Hatch 1CBFF`) không có ghi chú hướng đi **LÊN (UP)** hay **XUỐNG (DOWN)** và thiếu cao độ đích trục tăng áp. Cần xác nhận hướng đi để chọn đúng block cút/trục đứng HTS. |
| **`RC-05`** | Nhãn Text lạc dưới `SEAD-1500x450` (`X=36137..37824, Y=52842..53629`) | Cặp nhãn **`PAD-1200x450 / BOD=FFL+3550`** nằm trơ trọi giữa khoảng trống, không có nét ống tương ứng. Cần xác nhận là Text dư thừa của thiết kế hay bị thiếu tuyến ống `PAD-1200x450`. |

---

## 4. Kinh Nghiệm Kỹ Thuật Mới Đề Xuất Đúc Kết Vào Skill `shopdrawing-ong-gio`

1. **Kiểm tra `INSUNITS` trước khi vẽ trên bản vẽ xuất từ Revit**: Nhiều file Revit xuất DWG mang tọa độ thực tế hệ `mm` nhưng cờ hệ thống `INSUNITS = 1` (`Inches`). Bắt buộc chạy `_.INSUNITS\n4\n` và `_.MEASUREMENT\n1\n` trước khi gọi `draw_rectangular_duct`, rồi đo `get_bounding_box` đốt ống đầu tiên để tránh lỗi phóng `25.4x`.
2. **Dùng `HTS_RVOG` an toàn không xóa nền gốc (`Xoagoc = KHÔNG`)**: Trong lệnh `HTS_RVOG`, tùy chọn `Xoagoc` mặc định là `CÓ` (xóa cả thực thể trên layer đang khóa). Gửi tùy chọn `Xoagoc` để chuyển sang `KHÔNG` giúp sinh côn thu chuẩn chiều dài thiết kế (`L202`/`L204`) mà vẫn bảo toàn 100% thực thể thiết kế gốc, sau đó chuyển layer về `M-MVAC-*` và đổi tên block về tiền tố `HTS-CON-*`.
3. **Bù phồng ngoài của `_.REVCLOUD` (`~0.34 × arcLen`)**: Lệnh `_.REVCLOUD _A <arcLen> _R` phồng cung tròn ra ngoài khung chữ nhật đầu vào khoảng `0.34 × arcLen`. Tại các mép gần ống `M-MVAC-*`, cần thu lùi khung nhập vào `0.35 × arcLen + 15 mm` rồi kiểm chứng giao cắt Bounding Box chặt = `0`.
4. **Kiểm chứng hướng vát `45°` cho toàn bộ gót giày `HTS-TAP-*` sau `QUETPK`**: `QUETPK` sinh chiều vát mặc định không phụ thuộc chiều gió thực tế — luôn đối chiếu `get_bounding_box` từng `HTS-TAP-*` với hình học thiết kế gốc / hướng gió thượng lưu và dùng `mirror_entity` (`eraseSource: true`) qua trục cổ trích nếu bị ngược.
5. **Cút bán kính hẹp `0.75W` & Giao cắt 2D khác cao độ**: Truyền tường minh `"R": 0.25 * W` (VD `R: 225` cho `W = 900`) trong `draw_rectangular_duct` với các cút `0.75W`; khi 2 hệ ống gió cắt nhau trên mặt bằng 2D ở cao độ khác nhau (`SEAD` chui dưới `PAD`), bắt buộc khóa tạm layer hệ còn lại (`M-MVAC-PAD`) và dùng cửa sổ quét cục bộ khi chạy `QUETPK`.

---

## 5. Nghiệm Thu Bổ Sung — Xử Lý Cục Bộ Góc `RC-03` & Live Skill Sync (`RC-03 Revision Pass`) — **PASS 100%**

Thực hiện kiểm định chỉ-đọc độc lập sau khi `@rc03-fixer` xử lý góc hội tụ `SEAD-S03` ↔ `SEAD-SW01` theo **Quy tắc cứng số 3 (cập nhật)**: *chủ động đấu nối 2 nhánh cùng hệ thống bị thiết kế vẽ thiếu phụ kiện tại góc bằng 100% phụ kiện HTS (`R = W / 2`), không khoanh mây `REVCLOUD`*.

### 5.1. Kiểm Tra Đồng Bộ Skill & Workspace Rules — **PASS**
- **`.agents\skills\shopdrawing-ong-gio\SKILL.md`**: Đã cập nhật chính xác Quy tắc cứng số 3 (*Chủ động đấu nối góc thiếu phụ kiện giữa 2 nhánh ống cùng hệ thống*, cút chuẩn `R = W / 2`, kèm côn thu nếu khác cỡ, tuyệt đối không khoanh mây `REVCLOUD`) và đồng bộ Quy tắc cứng số 4.
- **`.agents\rules\hvac-shopdrawing-rules.md`**: Đã cập nhật chính xác mục 3 khớp 100% nội dung Skill.

### 5.2. Kết Quả Kiểm Định Chỉ-Đọc Trực Tiếp Trên `bai 2.dwg` (`port 5088`) — **PASS**
- **Bảo toàn 100% nền thiết kế gốc (`380 / 380`)**:
  - `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`: **`309 / 309`**
  - `MEPG-AC-TEXT`: **`67 / 67`**
  - `MEPG-M-EQUIP`: **`3 / 3`**
  - `0`: **`1 / 1`**
  - Tổng thực thể bản vẽ sau hiệu chỉnh: **`707`** (`380` gốc + `323` HTS + `4` `REVCLOUD`).
- **100% HTS Tool, `ByLayer`, `0` Block Thừa & Quy Tắc Số 0**:
  - **`M-MVAC-SEAD` = `281`** (`224` `HTS-OG`, `8` `HTS-CO`, `34` `HTS-TAP`, `8` `HTS-CON`, `7` `HTS-CAP`); **`M-MVAC-PAD` = `42`** (`38` `HTS-OG`, `4` `HTS-CO`); tổng **`323 / 323`** đều là `INSERT` tên `HTS-*`, `0` nét vẽ giả.
  - Quét toàn bộ dải màu cưỡng bức `ACI 1..255` (`select_by_color`) trên cả `323` block `M-MVAC-*`: **`0`** vi phạm (`100% ByLayer`).
  - `list_block_definitions` (`includeUnused: true`): `211` định nghĩa block, **`0`** block thừa (`instance_count = 0`; đã purge sạch `HTS-OG-1000x350 L677`).
  - Quy tắc số 0: **`0`** thực thể ngoài yêu cầu trên `M-MVAC-Equipment` và `9` layer Spec chưa dùng.
- **Kiểm định hình học & cao độ độc lập tại nút góc `RC-03`**:
  - Tái dựng độc lập đường tim từ 4 nét gốc (`1CCC2`/`1CCC5` cho `SEAD-S03` rộng `1000.00 mm` và `1CCBE`/`1CCBF` cho `SEAD-SW01` rộng `1000.00 mm`): giao điểm lý thuyết `(51142.4812, 11314.0085)`, góc hội tụ **`89.9998°`** (`90°`).
  - Cút mới **`1D9B1`** (`HTS-CO-V47-1000x350-R500-A90`): bán kính cong trong chuẩn **`R = 500 = W / 2`**, sai số điểm chèn so với giao điểm lý thuyết **`0.0019 mm`** (`errS03 = 0.0012 mm`, `errSW01 = 0.0015 mm`), BBox `1500.12 × 1500.12 mm`, `HTS_OG_DAY = 2500`.
  - Chuỗi đấu nối liền mạch `1D517 (L1110)` → `1D99D (L679)` → `1D9B1 (R500-A90)` → `1D99E (L1110)` → `1D9A9 (L114)` → `1D523 (L1110)`: sai số tim lớn nhất **`0.0047 mm`** (`<< 1.0 mm`), **`0` khe hở**, **`0` chồng chéo**, toàn bộ đoạn lân cận & cổ gót giày không bị xô lệch.
  - Xác minh XData `HTS_OG_DAY` trên **`323 / 323`** (`100%`) block `M-MVAC-SEAD` & `M-MVAC-PAD`: `0` thiếu, `0` lỗi (cả `4/4` block mới = `2500`).
- **Xác minh `REVCLOUD` còn lại (`4` đám mây trên `CLOUND`)**:
  - Đám mây cũ `RC-03` (`1D982`) đã xóa hoàn toàn (`exists = false`).
  - Còn đúng **`4`** `REVCLOUD` (`RC-01`: `1D980`, `RC-02`: `1D981`, `RC-04`: `1D983`, `RC-05`: `1D98B`), kiểm tra giao cắt BBox chặt với tất cả `323` block `M-MVAC-*`: **`0`** giao cắt.
- **Trạng thái Layer, Đơn vị & Diện tích tôn cập nhật**:
  - Toàn bộ **`24 / 24`** layer đều `is_locked = false`, `is_frozen = false`, `is_off = false`.
  - `OSMODE = 4031`, `units = Millimeters` (`INSUNITS = 4`).
  - Tổng diện tích tôn ống thẳng (`compute_duct_surface_area`, `lengthScaleToMeter: 0.001`): **`747.29 m²`** trên **`262`** đốt ống thẳng (`+3.31 m²`, `+2` đốt so với bản đầu `743.98 m² / 260`).

### 5.3. Kiểm Tra Trực Quan Sau Hiệu Chỉnh (`export_plan_image` + `read_file`) — **PASS**
- `work_hvac\bai2\qa_rc03_verify_zoom.png` — Zoom cận góc `RC-03` (`X=47200..52500, Y=10200..14200`): cút `R500` và 3 đoạn nối mới khít mặt bích tuyệt đối với `1D517` và `1D523`, không còn mây `RC-03`, `DRAWORDER` sắc nét nằm trên nét thiết kế gốc.
- `work_hvac\bai2\qa_full_v2.png` — Toàn mặt bằng cập nhật: góc đáy Nam đấu nối hoàn chỉnh, còn đúng `4` đám mây `RC-01, RC-02, RC-04, RC-05`, toàn bộ các tuyến khác giữ nguyên vẹn 100%.

---

## 6. Nghiệm Thu Bổ Sung — Triển Khai Cục Bộ Toàn Bộ Ống Gió & Phụ Kiện Trong Vùng `RC-01` (`RC-01 Revision Pass`) — **PASS 100%**

Thực hiện kiểm định chỉ-đọc độc lập (2 vòng QA: vòng 1 phát hiện và gửi trả `@rc01-drafter` 3 điểm gồm layer `CLOUND` còn khóa, côn thu cao độ `L400` lệch mặt bích `200 mm`, và tổ hợp côn chuyển đầu đẩy thiếu cổ bích TDC `L32`; vòng 2 xác nhận **PASS 100% 5/5 tiêu chí** sau khi `@rc01-drafter` hoàn thiện).

### 6.1. Danh Mục 23 Block HTS Mới Tạo Trong Vùng `RC-01` (`M-MVAC-SEAD`, `ByLayer`, `Z_c = +3225 mm`)

| Nhóm cấu kiện | Handle (Nhánh trên / Dưới) | Tên Block HTS chuẩn | Công cụ HTS | Khoảng `X` (mm) | `BOD` (`HTS_OG_DAY`) | Đánh giá độ khít độc lập |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Chạc quần Y (`1CC0F`)** | `1D9C0` | `HTS-YQ-2200x550-1700x550-1700x550-A150-L1820-LC800-K100` | `duct_breeches_insert` | `57677.0 → 59497.3` | `2950` | Trùng BBox `1CC0F` sai số `[0, 0, 0, -0.01] mm`; khít ống góp `1D2BA` (`0.24 mm`) |
| **Ống thẳng #1 (Chạc → `MFD`)** | `1D9CB` / `1D9F8` | `HTS-OG-1700x550 L111` | `draw_rectangular_duct` | `59497.0 → 59608.0` | `2950` | Khít `<= 0.31 mm` giữa chạc quần & `MFD` thượng lưu (`1CFE0`/`1CFE4`) |
| **Ống thẳng #2 (`MFD` → Côn cao độ)** | `1DBEC` / `1DBF7` | `HTS-OG-1700x550 L633` / `L632` | `draw_rectangular_duct` | `59757.8 → 60390.3` | `2950` | Khít `<= 0.11 mm` giữa `MFD` & mặt bích côn `1D008`/`1CFF5` tại `X=60390.3` |
| **Côn thu cao độ (`1D008`/`1CFF5`)** | `1DC0B` / `1DC0A` | `HTS-CON-Can-1700x1000-1700x550-L200` | `QUETPK` (mồi `L410`) | `60390.3 → 60590.3` | `2725` | Đè khít tuyệt đối `0.00 mm` mặt bích `L200` thiết kế & Tiêu âm 1 (`0.11 mm`) |
| **Cổ bích TDC đầu hút (`1D007`/`1CFF4`)** | `1DBCD` / `1DBCE` | `HTS-OG-1700x1000 L32` | `draw_rectangular_duct` | `61490.3 → 61522.3` | `2725` | Khít `<= 0.08 mm` cổ bích TDC `32 mm` tại mặt ra Tiêu âm 1 |
| **Côn chuyển Vuông–Tròn hút (`1D007`/`1CFF4`)** | `1DBBC` / `1DBBB` | `HTS-TV-Can-D1000-1700x1000-L500` | `QUETPK` | `61522.2 → 62022.4` | `2725` | Đè khít tuyệt đối `0.00 mm` đường vát `L500` Revit & khớp mềm hút (`0.11 mm`) |
| **Đoạn tròn đầu đẩy (`1D006`/`1CFF3`)** | `1DC72` / `1DC73` | `HTS-OG-D1000 L200` | `draw_round_duct` | `62952.2 → 63152.4` | `2725` | Khít `<= 0.12 mm` khớp mềm đẩy (`1CFFA`/`1CFDF`), nằm gọn trong biên vát `L700` |
| **Côn chuyển Tròn–Vuông đẩy (`1D006`/`1CFF3`)** | `1DC81` / `1DC80` | `HTS-VT-Can-1250x1400-D1000-L500` | `QUETPK` | `63152.2 → 63652.3` | `2525` | Khít `<= 0.12 mm` giữa ống tròn `L200` & cổ bích `L32` *(đạt ngưỡng tối đa `L500` của `QUETPK`)* |
| **Cổ bích TDC đầu đẩy (`1D006`/`1CFF3`)** | `1DC96` / `1DC97` | `HTS-OG-1250x1400 L32` | `draw_rectangular_duct` | `63652.3 → 63684.3` | `2525` | Khít `<= 0.05 mm` cổ bích TDC `32 mm` tại mặt vào Tiêu âm 2 (`200+500+32 = 732.0 mm`) |
| **Ống thẳng #3 (Tiêu âm 2 → `NRD`)** | `1D9E1` / `1DA04` | `HTS-OG-1250x1400 L359` | `draw_rectangular_duct` | `64584.2 → 64943.2` | `2525` | Khít `<= 0.12 mm` giữa Tiêu âm 2 (`1CFF8`/`1CC17`) & `NRD` (`1CFFF`/`1CFEC`) |
| **Ống thẳng #4 (`NRD` → `MFD`)** | `1D9EC` / `1DA05` | `HTS-OG-1250x1400 L209` | `draw_rectangular_duct` | `65093.1 → 65302.1` | `2525` | Khít `0.00 mm` giữa `NRD` & `MFD` hạ lưu (`1D003`/`1CFF0`) |
| **Ống thẳng #5 (`MFD` → Đầu đẩy hở)** | `1D9F7` / `1DA06` | `HTS-OG-1250x1400 L227` | `draw_rectangular_duct` | `65452.0 → 65679.6` | `2525` | Khít `<= 0.03 mm` đến mép đẩy `1CFFC`/`1CFE9` (không tự thêm nắp bịt theo thiết kế) |

### 6.2. Hạng Mục Thiết Bị Ngoài Ống Gió Giữ Nguyên Trong Vùng `RC-01` (Chờ Hướng Dẫn Tiếp Của Kỹ Sư)
Toàn bộ **16** thiết bị/phụ kiện thiết bị gốc trong vùng `RC-01` được giữ nguyên vẹn `100%` với **`0`** đoạn ống lấn vào thân thiết bị (dung sai tiếp xúc mặt bích tối đa `0.16 mm`):
- **02 Quạt hướng trục `TDA 1000`** (`MEPG-M-EQUIP`): `1CFF6` (nhánh trên), `1CC0E` (nhánh dưới).
- **04 Khớp nối mềm tròn `Ø1000`**: `1CFF9`/`1CFDE` (đầu hút), `1CFFA`/`1CFDF` (đầu đẩy).
- **04 Bộ tiêu âm ống gió**: `1CFF7`/`1CC10` (Tiêu âm 1 `L900xW1700xH1000`), `1CFF8`/`1CC17` (Tiêu âm 2 `L900xW1250xH1400`).
- **04 Van chặn lửa động cơ `MFD-EI60`**: `1CFE0`/`1CFE4` (thượng lưu `1700x550`), `1D003`/`1CFF0` (hạ lưu `1250x1400`).
- **02 Van 1 chiều `NRD`**: `1CFFF`/`1CFEC` (`1250x1400`).

### 6.3. Kết Quả Kiểm Định Chỉ-Đọc Tổng Hợp Sau `RC-01` (`port 5088`) — **PASS 100%**
- **Bảo toàn 100% nền thiết kế gốc (`380 / 380`)**: `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` = **`309`**, `MEPG-AC-TEXT` = **`67`**, `MEPG-M-EQUIP` = **`3`**, `0` = **`1`**.
- **Tổng thực thể bản vẽ**: **`729`** (`380` gốc + `346` HTS + `3` `REVCLOUD`).
- **100% HTS Tool, `ByLayer`, `0` Block thừa & Quy tắc số 0**:
  - **`M-MVAC-SEAD` = `304`** (`240` `HTS-OG`, `8` `HTS-CO`, `34` `HTS-TAP`, `10` `HTS-CON`, `7` `HTS-CAP`, `1` `HTS-YQ`, `2` `HTS-TV`, `2` `HTS-VT`); **`M-MVAC-PAD` = `42`** (`38` `HTS-OG`, `4` `HTS-CO`); tổng **`346 / 346`** đều là `INSERT` tên `HTS-*`, `0` nét vẽ giả.
  - Quét toàn bộ `ACI 1..255` (`select_by_color`): **`0`** màu cưỡng bức trên cả `346` block `M-MVAC-*` (`100% ByLayer`).
  - `list_block_definitions` (`includeUnused: true`): `224` định nghĩa block, **`0`** block thừa (`instance_count = 0`).
  - `0` thực thể ngoài yêu cầu trên `M-MVAC-Equipment` và `9` layer Spec chưa dùng.
- **Quy tắc số 4 & Dữ liệu 3D/BOQ**:
  - `RC-01` (`1D980`) đã xóa hoàn toàn (`exists = false`).
  - Còn đúng **`3`** `REVCLOUD` trên `CLOUND` (`RC-02: 1D981`, `RC-04: 1D983`, `RC-05: 1D98B`), **`0`** giao cắt BBox chặt với toàn bộ `346` block `M-MVAC-*`.
  - XData `HTS_OG_DAY` xác minh **`346 / 346` (`100%`)** có đủ `code 1040` (`0` thiếu).
  - Toàn bộ **`24 / 24`** layer ở trạng thái `is_locked = false`, `is_frozen = false`, `is_off = false`; `OSMODE = 4031`; `units = Millimeters` (`INSUNITS = 4`).
  - Diện tích tôn ống thẳng chữ nhật (`compute_duct_surface_area`, `lengthScaleToMeter: 0.001`): **`763.09 m²`** trên **`276`** đốt ống chữ nhật (`+15.80 m²`, `+14` đốt so với bản `RC-03`; bổ sung thêm `2` đoạn ống tròn `HTS-OG-D1000 L200`).

### 6.4. Kiểm Tra Trực Quan (`export_plan_image` + `read_file`) — **PASS**
- `work_hvac\bai2\qa_rc01_verify_zoom.png` — Zoom cận toàn vùng `RC-01` (`X=57200..66100, Y=37100..41400`): chạc quần `1D9C0`, côn thu cao độ `L200` (`1DC0B`/`1DC0A`) đè khít `0.00 mm` mặt bích `X=60390.3`, cụm côn chuyển đầu hút `L32+L500` và đầu đẩy `L200+L500+L32`, cùng các đoạn ống thẳng dừng khít tại `MFD`, `NRD`, Tiêu âm và khớp mềm; `0` khe hở, `0` lấn thiết bị.
- `work_hvac\bai2\qa_full_v3.png` — Toàn mặt bằng cập nhật: phòng quạt `RC-01` đã hoàn thiện toàn bộ ống gió & phụ kiện và bỏ mây `1D980`, còn đúng `3` đám mây `RC-02, RC-04, RC-05`, mọi tuyến khác giữ nguyên `100%`.

### 6.5. Kinh Nghiệm Kỹ Thuật Mới Đề Xuất Cập Nhật Vào Skill `shopdrawing-ong-gio`
1. **Điều khiển chính xác chiều dài côn thu bằng chiều dài ống mồi trong `QUETPK`**: Với côn thu có chiều dài thiết kế `L < 500 mm` (như côn chuyển chiều cao `L200`: `1700x550 → 1700x1000`), `QUETPK` tính chiều dài côn theo công thức `L_con = min(500, floor(L_bait / 2 / 50) * 50)`. Dùng ống mồi `L_bait = 410 mm` cho ra trực tiếp block chuẩn **`HTS-CON-Can-1700x1000-1700x550-L200`** mà không bị giới hạn mặc định `L400/L500`.
2. **Ngưỡng trần `L500` của côn chuyển Vuông–Tròn (`HTS-VT-*` / `HTS-TV-*`) trong `QUETPK` & Cổ bích TDC `32 mm`**: `QUETPK` yêu cầu `gap ≈ 0` và giới hạn chiều dài tối đa `L = 500 mm` cho côn chuyển vuông–tròn; khi Revit dùng côn chuyển dài `L700` kèm cổ bích TDC `32 mm` (và `HTS_RVOG` không nhận block đơn lẻ thiếu cặp `LINE` ống thẳng 2 bên), tổ hợp chuẩn 100% HTS là **đoạn ống tròn bù (`HTS-OG-D... L200`) + côn chuyển `L500` (`HTS-VT-Can-...-L500`) + cổ bích TDC (`HTS-OG-... L32`)** đảm bảo kín bích `0.00 mm` và nằm gọn trong biên vát thiết kế.
3. **Mở khóa đủ cả `CLOUND` sau thao tác cục bộ**: Khi khóa tạm các layer gốc và `CLOUND` trước `QUETPK`/`HTS_RVOG`, luôn chạy kiểm tra `get_layer_info` trên toàn bộ `24/24` layer để đảm bảo không bỏ sót `CLOUND` ở trạng thái `is_locked = true`.
