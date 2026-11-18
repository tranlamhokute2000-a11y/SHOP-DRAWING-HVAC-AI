# 04 — BÁO CÁO NGHIỆM THU QA/QC ĐỘC LẬP & ĐÓNG GÓI SKILL `shopdrawing-ong-gio`

- **Người thực hiện**: `@qa-verifier` (Kỹ sư Nghiệm thu QA/QC HVAC & Kiến trúc sư Đóng gói Skill)
- **Bản vẽ nghiệm thu trực tiếp (Read-Only MCP)**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\shop drawwing onng gio.dwg` (cổng `5088`)
- **Bộ ảnh nghiệm thu độc lập**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac\qa_check_imgs\` (`qa_final_01_overview.png` .. `qa_final_06_top_west_clean.png`)
- **Gói bản thảo Skill chuẩn Antigravity**: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac\skill_package\shopdrawing-ong-gio\`
- **KẾT LUẬN NGHIỆM THU CUỐI CÙNG**: **ĐẠT CHUẨN 100% (`PASS — ZERO DEFECTS`)**

---

## 1. Kết Quả Kiểm Chứng Độc Lập Trên Phiên AutoCAD Đang Mở

Đã chạy kiểm tra độc lập bằng các công cụ MCP chỉ-đọc (`get_drawing_info`, `get_current_settings`, `get_layer_list`, `get_layer_info`, `group_summary_by_layer`, `select_by_layer`, `list_block_definitions`, `compute_duct_surface_area`, `get_entities_in_area`, `get_bounding_box`, `get_xdata`, `get_dynamic_block_properties`, `get_block_attributes`, `export_plan_image`) và đối chiếu toán học từng thực thể với `02_duct_network.json`:

### 1.1. Bảng Tổng Hợp Các Chỉ Tiêu QA/QC Cốt Lõi

| Hạng mục kiểm tra | Yêu cầu tiêu chuẩn & Chỉ đạo của Sếp Hồ (`#4`, `#8`, `#10`) | Kết quả đo kiểm độc lập trên AutoCAD | Đánh giá |
| :--- | :--- | :--- | :---: |
| **1. Quy tắc 100% HTS Tool** | 100% ống gió & phụ kiện mới tạo bằng HTS Tool; cấm vẽ giả bằng Line/Polyline | `203/203` trên `M-MVAC-SEAD` là Block `HTS-*`; `26/26` trên `M-MVAC-Equipment` là Block động `HTS_*`; **`0` LINE/POLYLINE giả**; **`0` block thừa (`instance_count = 0`)** | **ĐẠT 100%** |
| **2. Bảo toàn thiết kế gốc** | Giữ nguyên vẹn `229/229` thực thể thiết kế cũ bên dưới (kể cả mây mẫu `10E5A`) | Tổng nguyên vẹn **`229/229`**: `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED` (`192`), `MEPG-M-EQUIP` (`2`), `MEPG-AC-TEXT` (`34`), `0` (`1` mây `10E5A`) | **ĐẠT 100%** |
| **3. Vẽ đè khít tại chỗ (`In-Place Overlay`)** | Đè trực tiếp trên tọa độ nét cũ, không lệch ra ngoài, không còn rác vùng nháp | Sai số lệch tim ngang toàn tuyến: **tối đa `0.537 mm`** (`< 1 mm`); sai số trục ngang `24/24` miệng gió: **`0.000 mm`**; `24/24` gót giày đúng hướng vát `45°` thượng lưu; `extmin = (4390.11, -4344.41)`, `extmax = (45899.61, 63989.85)` — **`0` rác ngoài bản vẽ** | **ĐẠT 100%** |
| **4. Loại trừ lẫn nhau Vẽ Shop vs. `REVCLOUD` (`#10`)** | Chỗ hiểu rõ: vẽ 100% & không khoanh mây. Chỗ chưa hiểu: khoanh mây & bỏ trống `0` block mới bên trong | Đã xóa sạch 5 mây cũ ở vùng hiểu rõ (`RC-04..08`). Cả 3 mây `CLOUND` (`12863`, `12864`, `12865`) kiểm tra kép `get_entities_in_area` + `bbox` đều có **`0` đối tượng `M-MVAC-*` bên trong**, lộ rõ nét thiết kế gốc (`27`, `26`, `14` thực thể gốc), không có chữ/leader đè rối bản vẽ | **ĐẠT 100%** |
| **5. Tiêu chuẩn Layer & Màu Spec** | Đúng 100% bảng Layer & màu ACI của `Spec-layer ký hiệu ống gió.dwg` | Đủ `13/13` Layer chuẩn: `EAD (80)`, `FAD (150)`, `PAD (210)`, `CEAD (170)`, `CSAD (11)`, `SEAD (190)`, `Copper Pipe (12)`, `AC Drain (72)`, `Equipment (47)`, `Support (42)`, `DIM (97)`, `TEXT (2)`, `CLOUND (240)`; `plottable = true` | **ĐẠT 100%** |
| **6. Dữ liệu cao độ 3D & BOQ** | Đủ XData `HTS_OG_DAY` theo `BOD` thiết kế; đúng `Width1` block động | **`203/203`** block trên `M-MVAC-SEAD` có XData `HTS_OG_DAY` (`+2450`, `+2500`, `+2545`, `+2595`, `+2645`, `+2695`); tổng diện tích tôn `159` đốt thẳng = **`515.79 m²`**; `Width1` khớp 100% bề rộng ống | **ĐẠT 100%** |
| **7. Trạng thái phiên AutoCAD** | Sạch lệnh, không khóa sót layer thiết kế cũ, đã lưu bản vẽ | Toàn bộ `21/21` layer đều `is_locked = false, is_frozen = false, is_off = false`; layer hiện hành `M-MVAC-SEAD`; tổng thực thể `461` sạch tuyệt đối | **ĐẠT 100%** |

---

### 1.2. Thống Kê Khối Lượng Thực Thể Đã Nghiệm Thu Trên Bản Vẽ (`461 Thực Thể`)

1. **Layer `M-MVAC-SEAD` (`ACI 190`, `203` Block HTS)**:
   - **`159` đốt ống thẳng chữ nhật** (`HTS-OG-{W}x{H} L{len}`, chia đốt tiêu chuẩn `1110 mm` + đốt bù, diện tích tôn `515.7947 m²`):
     + Ống góp chính `2200×600` (`BOD +2450`): `3` đốt (dừng gọn tại mặt bích `X = 37579.39` ngay mép trái ngoài mây `RC-01`).
     + Nhánh Trái (`Flat Bottom BOD +2500`): `1600×450` (`14`), `1450×400` (`14`), `1100×400` (`15`), `800×400` (`10`), `550×350` (`10`).
     + Nhánh Phải dưới (`BOD +2500`, dừng gọn tại mặt bích `Y = 37127.69` ngay mép dưới ngoài mây `RC-03`): `1700×500` (`19`), `1400×500` (`15`).
     + Nhánh Phải trên & Tuyến Bắc (bắt đầu từ mặt bích `Y = 40734.68` ngay mép trên ngoài mây `RC-03`, `Flat Top TOD +3045`): `1150×500` (`12`, `BOD +2545`), `950×450` (`17`, `BOD +2595`), `800×400` (`12`, `BOD +2645`), `550×350` (`18`, `BOD +2695`).
   - **`08` cút vuông bo tròn `90°` (`R = W/2`)**: `HTS-CO-V47-1450x400-R725-A90` (`1`), `1700x500-R850` (`2`), `1400x500-R700` (`2` tại Jog #1), `950x450-R475` (`1`), `550x350-R275` (`2` tại góc Tây-Bắc).
   - **`09` côn thu đồng tâm & côn thu lệch**: `7` côn đồng tâm `HTS-CON-Can-*` (`L202..L204`) + `2` côn lệch phẳng phải `HTS-CON-Phai-1450x400-1100x400-L650` & `HTS-CON-Phai-1700x500-1400x500-L202`.
   - **`25` chân rẽ gót giày**: `1` bộ nhánh chính `HTS-TAP-Phai-1700x500-L200-D200` + `24` bộ cổ miệng gió `HTS-TAP-Trai-600x300-L150-D150`.
   - **`02` nắp bịt đầu ống**: `HTS-CAP-550x350-L25` tại 2 đầu cuối Nhánh Trái và Nhánh Tây-Bắc.
2. **Layer `M-MVAC-Equipment` (`ACI 47`, `26` Block Động Thư Viện HTS)**:
   - **`02` van điều chỉnh lưu lượng**: `HTS_Van gio vuong VCD` (`Width1 = 1600` tại `(34656.7, 2175.3)` và `Width1 = 1700` xoay `90°` tại `(36459.1, 4033.3)`).
   - **`24` miệng gió hút khói sườn ống**: `HTS_Mieng gio louver` (`Width1 = 600, Distance1 = 30`) áp khít cổ `24` gót giày.
3. **Layer `CLOUND` (`ACI 240`, `03` Đám Mây `REVCLOUD` Bỏ Trống Bên Trong)**:
   - Chi tiết tại Mục 2 dưới đây để `@coordinator` tổng hợp trình hỏi Sếp Hồ.

---

## 2. Danh Mục 03 Vùng Khoanh Mây `REVCLOUD` (Đã Bỏ Trống Không Vẽ) Để Trình Hỏi Sếp Hồ

| Mã Mây | Handle | Khung tọa độ `bbox` (mm) | Thực thể mới bên trong | Nội dung kỹ thuật cần trình Sếp Hồ giải thích / xác nhận |
| :---: | :---: | :--- | :---: | :--- |
| **`RC-01`** | `12863` | `[37595.4, 94.8 .. 43274.3, 4242.1]` | **`0`** | **Cụm Chạc quần + Đầu hút & Thân 02 Quạt Hút Khói `Kruger TDC 1250`**: Toàn bộ khu vực này không có bất kỳ nhãn Text ghi kích thước `WxH`, cao độ `BOD` hay thông số lưu lượng/cột áp quạt; đoạn ống nối từ chạc quần vào van `MFD` quá ngắn (`45.5 mm`); cặp côn trước tiêu âm không đổi bề rộng `W = 1700` trên mặt bằng; đồng thời Quạt hướng trục & Bộ tiêu âm khối chưa có block tương ứng trong thư viện HTS. |
| **`RC-02`** | `12864` | `[43115.5, 308.3 .. 45899.6, 4032.9]` | **`0`** | **Cụm Đầu đẩy 02 Quạt Hút Khói `Kruger TDC 1250`**: Thiếu toàn bộ Text kích thước ống & cao độ `BOD`; chữ `NRD` / `MFD` trên thiết kế gốc bị lật ngược (mirror); đoạn ống giữa Tiêu âm – `NRD` (`71.4 mm`) rất ngắn; và 02 đầu ống tại `X = 45603.42` kết thúc cụt chưa rõ đấu nối vào trục kỹ thuật (Shaft) hay cửa gió Louver thải khói. |
| **`RC-03`** | `12865` | `[39789.7, 37143.2 .. 45856.4, 40716.7]` | **`0`** | **Cụm Chuyển hướng Jog #2 Nhánh Phải (`Y = 37128 .. 40735`)**: Đoạn ống ngang thiếu Text kích thước, đặc biệt trên thiết kế gốc xuất hiện **nét đôi lệch `9.49 mm`** và cút `ELLIPSE` do ống trong mô hình Revit 3D đi nghiêng dốc `~1.09°` để nâng cao độ đáy từ `BOD = FFL+2500` lên `BOD = FFL+2545` (`+45 mm`). Cần Sếp Hồ xác nhận phương án gia công (đi phẳng hay làm phụ kiện chuyển cao độ Z). |

---

## 3. Đóng Gói Bản Thảo Skill `shopdrawing-ong-gio` (Sẵn Sàng Trình Sếp Hồ Qua `/learn`)

Đã đóng gói hoàn chỉnh cấu trúc Skill theo chuẩn Antigravity Customization System tại thư mục workspace (tuyệt đối chưa ghi vào `C:\Users\Nguye\.gemini\` để `@coordinator` trình Sếp Hồ phê duyệt trước):

```text
C:\Users\Nguye\Desktop\SHOP DRAWING-AI\work_hvac\skill_package\shopdrawing-ong-gio\
├── SKILL.md                                  # Quy trình chính (YAML frontmatter + 3 Quy tắc cứng + Quy tắc hỏi Layer đầu dự án + 5 Bước chuẩn)
└── references/
    ├── spec-layer-ong-gio.md                 # Bảng chuẩn 13 Layer Spec-layer ký hiệu ống gió.dwg, mẫu hỏi đầu dự án, giải mã nhãn WxH/BOD & chuẩn chế tạo HTS
    └── hts-hvac-tools-cheatsheet.md          # Cú pháp MCP 100% HTS Tool HVAC, giao thức khóa tạm layer cũ In-Place Overlay, toán học côn lệch/gót giày, xử lý block Inches 1/25.4 & REVCLOUD AutoCAD 2027
```

### Các đúc kết cốt lõi đã đưa đầy đủ vào `SKILL.md` & `references/`:
1. **Quy tắc cứng số 1 — Bắt buộc 100% HTS Tool**: Chỉ dùng bộ công cụ HTS (`draw_rectangular_duct`, `draw_round_duct`, `QUETPK` / `hvac-fitting-scan`, `duct_breeches_insert`, `place_duct_elbow`, `hvac-cap`, `duct_set_elevation`, `Library\HVAC\Phụ kiện\`); cấm tuyệt đối vẽ LINE/POLYLINE giả ống gió.
2. **Quy tắc cứng số 2 — Vẽ đè trực tiếp 100% tại chỗ (`In-Place Overlay`)**: Bảo toàn 100% nét cũ bên dưới; cấm vẽ lệch hoặc dựng ở vùng nháp rồi move về; dùng `set_layer_state` khóa tạm các layer thiết kế cũ trước khi chạy `QUETPK` tại chỗ rồi mở khóa trả nguyên trạng.
3. **Quy tắc cứng số 3 — Nguyên tắc Loại trừ Lẫn nhau 100% giữa Vẽ Shop và Khoanh Mây `REVCLOUD`**: Chỗ đã hiểu chắc chắn thì vẽ đè khít 100% và không khoanh mây; chỗ chưa hiểu / thiếu thông số / bất thường 3D / thiếu block thiết bị HTS thì khoanh mây `REVCLOUD` trên Layer `CLOUND` (`ACI 240`) và **bỏ trống hoàn toàn bên trong mây (`0` block mới)** để hỏi lại người dùng sau khi kết thúc tiến trình vẽ.
4. **Quy tắc đầu mỗi dự án mới**: Khảo sát bản vẽ thiết kế, đối chiếu bảng chuẩn `Spec-layer ký hiệu ống gió.dwg` (`M-MVAC-*`) và hỏi người dùng xác nhận/điều chỉnh thông số Layer trước khi triển khai.
5. **Quy trình 5 bước khép kín + Kinh nghiệm kỹ thuật thực chiến**: Chia đốt `1110 mm`, công thức dịch tim côn lệch `Δ = (W1 - W2)/2`, kỹ thuật mồi nhánh cho gót giày miệng gió sườn ống, kiểm tra scale `1/25.4` cho 3 block van gốc `Inches`, cú pháp `_.REVCLOUD` 1 tham số `_A` trên AutoCAD 2021–2027, và danh sách đen các lệnh UI cấm gọi tự động chống treo AutoCAD.
