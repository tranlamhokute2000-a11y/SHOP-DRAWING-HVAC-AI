---
name: shopdrawing-ong-gio
description: >-
  Triển khai bản vẽ Shop Drawing hệ thống ống gió HVAC trên AutoCAD trực tiếp từ
  bản vẽ thiết kế bằng 100% HTS Tool (hts-autocad, cổng 5088) theo tiêu chuẩn
  Spec-layer ký hiệu ống gió.dwg. Kích hoạt khi người dùng yêu cầu vẽ Shop
  Drawing ống gió, triển khai ống gió & phụ kiện từ bản vẽ thiết kế, chuẩn hóa
  layer ống gió theo Spec, khoanh mây REVCLOUD các vị trí thiết kế chưa rõ, hoặc
  nghiệm thu QA/QC bản vẽ Shop Drawing HVAC.
---

# Skill: Triển Khai Shop Drawing Hệ Thống Ống Gió HVAC (`shopdrawing-ong-gio`)

Quy trình chuẩn kỹ sư MEP triển khai bản vẽ Shop Drawing ống gió trên AutoCAD qua **HTS MCP Server (`hts-autocad`, cổng `5088`)**, đảm bảo chia đốt gia công chuẩn nhà máy, đầy đủ dữ liệu cao độ dựng 3D (`OG3D` / `COMBINE 3D`), tương thích Lisp Dim ống gió (`dim-ong-gio`) và bóc tách khối lượng (`VCS`).

---

## 1. Năm Quy Tắc Cứng Bất Di Bất Dịch (Kỷ Luật Thép)

> **BẮT BUỘC TUÂN THỦ 100% TRONG MỌI BẢN VẼ SHOP DRAWING ỐNG GIÓ:**

### Quy tắc cứng số 0 (Tối thượng) — Yêu cầu gì làm đúng nấy & Nghiêm cấm phá hỏng thành quả trước
- Người dùng yêu cầu hạng mục nào thì **chỉ thực hiện đúng 100% hạng mục đó**, tuyệt đối không tự suy diễn làm thêm công việc/đối tượng khác khi chưa được yêu cầu!
  - Ví dụ: Khi được yêu cầu vẽ **ống gió và phụ kiện ống gió**, chỉ dựng ống gió và phụ kiện đường ống (cút, côn thu, tê, chạc quần, chân rẽ/gót giày `HTS-TAP-*`, nắp bịt đầu `HTS-CAP-*`); **TUYỆT ĐỐI KHÔNG tự ý đặt cửa gió/miệng gió (`HTS_Mieng gio *`), van gió (`VCD/FD/MFD/MD/NRD`), giá đỡ, Dim hay ghi chú phụ** trừ khi người dùng yêu cầu rõ ràng! (Tại vị trí van gió có sẵn trên nền thiết kế gốc, chỉ dừng 2 đầu ống khít mặt bích van gốc, giữ nguyên ký hiệu van gốc bên dưới).
- **Bảo vệ tuyệt đối thành quả đã đạt được**: Khi người dùng yêu cầu sửa một vị trí cụ thể, **CHỈ thao tác cục bộ đúng vị trí đó**; nghiêm cấm làm thay đổi, xóa, xê dịch hay đè ngược `DRAWORDER` lên các đoạn ống/phụ kiện đã làm đúng trước đó!

### Quy tắc cứng số 1 — Bắt buộc sử dụng 100% HTS Tool
- **100% ống gió và phụ kiện ống gió** (ống thẳng chia đốt `1110mm`, ống tròn, cút bo/cút vuông/cánh hướng, côn thu đồng tâm/côn lệch đúng chiều dài thiết kế, côn chuyển vuông–tròn, chân rẽ/gót giày, tê, chạc quần Y, nắp bịt đầu, trục đứng, ống mềm; và van gió/cửa gió/giá đỡ *chỉ khi được yêu cầu rõ ràng*) **phải được tạo hoàn toàn bằng bộ công cụ HTS Tool (`hts-autocad`) và thư viện Block động `Library\HVAC\Phụ kiện\`**.
- **TUYỆT ĐỐI CẤM** dùng `draw_line`, `draw_polyline`, `draw_rectangle`, `draw_arc`, `offset_curve` để vẽ giả nét ống gió hoặc phụ kiện rời rạc (vì làm mất định nghĩa Block `HTS-*`/`HTS_*`, mất XData cao độ `HTS_OG_DAY`, hỏng `OG3D` và sai lệch bóc khối lượng `VCS`).

### Quy tắc cứng số 2 — Vẽ đè trực tiếp 100% ngay tại tọa độ thiết kế gốc (`In-Place Overlay`)
- Toàn bộ ống gió và phụ kiện mới **phải vẽ đè khít 100% trực tiếp ngay trên tọa độ nét vẽ thiết kế cũ** (sai số đường tim ngang `< 1 mm`, khớp 100% chiều dài & góc vát côn thu thiết kế, lớp `M-MVAC-*` nằm trên lớp thiết kế gốc qua `DRAWORDER`).
- **Bảo toàn nguyên vẹn 100%** toàn bộ thực thể của bản vẽ thiết kế gốc bên dưới làm nền đối chiếu (không xóa, không xê dịch nét cũ).
- **TUYỆT ĐỐI CẤM** vẽ lệch ra ngoài hoặc dựng tạm ở vùng nháp ngoài tọa độ gốc rồi mới `move` về!
- **Kỹ thuật quét phụ kiện tại chỗ an toàn**: Trước khi gọi `QUETPK` (`hvac-fitting-scan`), đặt `OSMODE = 0` và khóa tạm (`locked: true`) các layer thiết kế cũ; sau khi xong khôi phục nguyên trạng `OSMODE` và mở khóa (`locked: false`). *(Lưu ý đặc biệt với `HTS_RVOG`: lệnh này có thể xóa thực thể nguồn nằm trong vùng quét kể cả khi layer bị khóa — luôn đối chiếu đếm số lượng thực thể layer nền trước/sau khi chạy và đảm bảo nền thiết kế gốc nguyên vẹn 100% + `DRAWORDER` nằm dưới lớp `M-MVAC-*`)*.

### Quy tắc cứng số 3 — Quy tắc Nội suy Kích thước Dọc Tuyến Ống & Côn Thu
- **Cùng 1 tuyến ống gió khi chuyển hướng (cút 90°/45°, đoạn chuyển hướng Jog)** mà người vẽ thiết kế thiếu Text ghi kích thước: **BẮT BUỘC nội suy kích thước từ Text có trên tuyến ống đó** để triển khai vẽ hoàn chỉnh, **KHÔNG khoanh mây bỏ trống**!
- **Kích thước ống gió CHỈ thay đổi khi đi qua phụ kiện Côn thu (`Reducer / Transition`)**: kể từ ngay sau mặt bích đầu ra của côn thu, toàn bộ đoạn ống thẳng và các đoạn chuyển hướng tiếp theo lấy kích thước theo **tuyến ống tiếp theo**!

### Quy tắc cứng số 4 — Nguyên tắc Loại trừ Lẫn nhau 100% giữa Vẽ Shop và Khoanh Mây `REVCLOUD`
- **TUYỆT ĐỐI KHÔNG BAO GIỜ VỪA VẼ SHOP DRAWING VỪA KHOANH MÂY `REVCLOUD` CÙNG MỘT VỊ TRÍ!** Mọi khu vực trên mặt bằng chỉ thuộc **1 trong 2 trạng thái loại trừ nhau**:
  1. **Vùng ĐÃ HIỂU & CHẮC CHẮN ĐÚNG** *(bao gồm các đoạn chuyển hướng đã nội suy được theo Quy tắc số 3)*: Vẽ đè khít 100% bằng HTS Tool và **KHÔNG khoanh mây**.
  2. **Vùng THỰC SỰ KHÔNG HIỂU / THIẾU HOÀN TOÀN THÔNG SỐ KHÔNG THỂ NỘI SUY / HTS CHƯA CÓ BLOCK THIẾT BỊ** *(ví dụ cụm phòng quạt + tiêu âm thiếu toàn bộ Text kích thước & đầu chờ cụt)*: **Khoanh mây `REVCLOUD` trên Layer `CLOUND` (`ACI 240`) và BỎ TRỐNG HOÀN TOÀN (`0` block `M-MVAC-*` bên trong mây)** — chỉ giữ nguyên nét thiết kế gốc bên dưới, không chèn chữ/leader dài đè rối bản vẽ. Chỉ sau khi kết thúc toàn bộ tiến trình vẽ mới liệt kê câu hỏi theo từng mây để hỏi người dùng!

---

## 2. Quy Tắc Đầu Mỗi Dự Án Mới: Xác Nhận Spec Layer & Ký Hiệu Hệ Thống

Ở **lượt đầu tiên của mỗi dự án mới** (trước khi vẽ bất kỳ đối tượng nào), Agent bắt buộc:
1. Đọc danh sách Layer (`get_layer_list`), nhãn chữ (`extract_all_text`) trên bản vẽ thiết kế và đối chiếu với chuẩn mặc định tại [spec-layer-ong-gio.md](./references/spec-layer-ong-gio.md) (`M-MVAC-EAD`, `M-MVAC-FAD`, `M-MVAC-PAD`, `M-MVAC-CEAD`, `M-MVAC-CSAD`, `M-MVAC-SEAD`, `M-MVAC-Equipment`, `M-MVAC-Support`, `M-MVAC-DIM`, `M-MVAC-TEXT`, `CLOUND`).
2. **Hỏi người dùng xác nhận bảng ánh xạ Layer, màu ACI và quy tắc ký hiệu hệ thống** của dự án (cho phép xác nhận dùng mặc định theo `Spec-layer ký hiệu ống gió.dwg` hoặc thay đổi/bổ sung nếu dự án có hệ thống mở rộng như `SAD`/`SA`, `RAD`/`RA`, `OAD`, `TEAD`...).
3. Chỉ dùng kết nối `hts-autocad` (cổng `5088`); không yêu cầu bật `vcs-boq` (cổng `5077`) trừ khi người dùng yêu cầu bóc khối lượng BOQ.

---

## 3. Quy Trình 5 Bước Triển Khai Shop Drawing Ống Gió

### Bước 1 — Khảo sát Read-Only, Sao lưu & Khởi tạo Layer Spec
1. Kiểm tra kết nối cổng `5088`, gọi `get_drawing_info`, `get_layer_list`, `group_summary_by_layer`, `list_block_definitions`, `extract_all_text` và `export_plan_image` (soi kỹ mặt bằng bằng `read_file`).
2. Tạo bản sao lưu `.dwg` gốc trước khi chỉnh sửa.
3. Sau khi người dùng xác nhận thông số Layer dự án, gọi `batch_process` (`create_layer`) tạo đầy đủ bộ Layer chuẩn `M-MVAC-*` và `CLOUND` (chi tiết JSON mẫu trong [spec-layer-ong-gio.md](./references/spec-layer-ong-gio.md)). Đảm bảo mọi đối tượng tạo mới dùng màu `ByLayer`.

### Bước 2 — Giải mã Mạng lưới Tuyến ống & Phân vùng Rạch ròi (Vẽ vs. Khoanh Mây)
1. **Giải mã Text thông số theo Spec**:
   - Mẫu chuẩn: `<HỆ>-<W>x<H>` (dòng 1) + `BOD=FFL+<Z>` (dòng 2). Ví dụ `SEAD-1700x500` / `BOD=FFL+2500` $\Rightarrow$ Hệ `SEAD` (`M-MVAC-SEAD`), rộng `W = 1700 mm`, cao `H = 500 mm`, cao độ đáy `day = 2500 mm`.
   - Kiểm tra quy luật cao độ dọc tuyến: đi **Phẳng đáy (`Flat Bottom`, `BOD` giữ nguyên)** hay **Phẳng đỉnh (`Flat Top`, khi `H` giảm `ΔH` thì `BOD` tăng `+ΔH`)**.
2. **Trích xuất chính xác tọa độ đường tim (`Centerline`)** từ cặp biên song song của thiết kế (`(bien_1 + bien_2) / 2`, giữ độ chính xác đến `0.01 mm` kể cả khi bản vẽ xuất từ Revit có góc xoay lưới nhỏ).
3. **Phân tách dứt khoát 2 danh sách không giao nhau**:
   - **Danh sách A (Vùng Đã Hiểu Chắc Chắn)**: Đủ thông số `WxH` (hoặc `ØD`), cao độ `BOD`, hình học rõ ràng và có đủ công cụ/block HTS tương ứng $\rightarrow$ Đưa vào kế hoạch vẽ ở Bước 3.
   - **Danh sách B (Vùng Chưa Rõ / Bất Thường)**: Cụm thiết bị/phòng máy thiếu hoàn toàn Text kích thước & không có block thiết bị trong thư viện HTS (ví dụ quạt trục, tiêu âm khối), đoạn ống có nét đôi/cút `ELLIPSE` do nghiêng dốc 3D chưa rõ phương án gia công, đầu chờ kết thúc cụt chưa rõ đấu nối... $\rightarrow$ Cắt dừng các tuyến Danh sách A ngay trước ranh giới vùng này, tuyệt đối không vẽ vào bên trong và đưa vào kế hoạch khoanh mây ở Bước 4.

### Bước 3 — Triển khai Ống Gió & Phụ Kiện bằng 100% HTS Tool Đè Khít Tại Chỗ
Tra cứu cú pháp JSON chi tiết từng công cụ trong [hts-hvac-tools-cheatsheet.md](./references/hts-hvac-tools-cheatsheet.md):
1. **Khóa tạm toàn bộ Layer thiết kế cũ**: Gọi `set_layer_state` (`locked: true`) cho mọi layer thiết kế gốc.
2. **Vẽ tuyến ống thẳng + cút bo tự động**:
   - Dùng `draw_rectangular_duct` (chế độ batch `runs`) và `draw_round_duct` đi đúng tọa độ đường tim thiết kế trên layer `M-MVAC-<HỆ>`. HTS tự động chia đốt tiêu chuẩn `L = 1110 mm` + đốt lẻ và tự đặt cút bo `HTS-CO-V47-{W}x{H}-R{W/2}-A90` tại các đỉnh gãy góc cùng tiết diện.
   - Tại vị trí **côn thu lệch phẳng 1 mép**: dịch đường tim đoạn ống nhỏ một khoảng $\Delta = (W_{\text{lớn}} - W_{\text{nhỏ}}) / 2$ về phía mép phẳng để biên ống trùng khít 100% nét thiết kế.
   - Tại vị trí có **van gió (`VCD`, `FD`, `MFD`, `NRD`)** hoặc **côn thu**: ngắt đầu mút các `runs` đúng tại mặt bích thiết kế để phụ kiện/van chèn vào khít `0 mm`.
3. **Sinh Côn thu khớp đúng chiều dài thiết kế & Chân rẽ Gót giày (`HTS-TAP-*`)**:
   - **Côn thu chuẩn thiết kế**: Lệnh `QUETPK` (`hvac-fitting-scan`) tạo côn thu mặc định dài `L = 500 mm` khi 2 đầu ống khác cỡ chạm nhau (`gap ≈ 0`). Nếu côn thiết kế gốc (xuất từ Revit) có chiều dài khác (`L = 204 mm`, `L = 202 mm`, `L = 650 mm`...) cần đè khít 100% 2 mặt bích & đường vát thiết kế, sử dụng `HTS_RVOG` (`hvac-revit-convert`) kết hợp đổi tiền tố block về `HTS-CON-...` để sinh đúng block côn HTS trùng khít `0.00 mm` với bản vẽ thiết kế, đồng thời đối chiếu đảm bảo nền thiết kế gốc nguyên vẹn 100%!
   - **Chân rẽ gót giày (`HTS-TAP-*`)**: Vẽ đoạn ống mồi ngắn cùng cỡ cổ trích bắt từ mép biên ống chính vươn ra ngoài tại đúng tọa độ thiết kế → đặt `OSMODE = 0`, `set_layer` đúng `M-MVAC-<HỆ>`, gọi `QUETPK` (`hvac-fitting-scan`) sinh `HTS-TAP-*` đúng hướng vát `45°` thượng lưu → xóa đoạn ống thẳng mồi dư ngoài cổ gót giày.
4. **Chèn phụ kiện đặc thù & Nắp bịt đầu**:
   - Chạc quần Y chia đôi: `duct_breeches_insert` (`xemTruoc: true` kiểm tra miệng nối trước khi chèn thật).
   - Cút vuông vát / cánh hướng / lên xuống tròn: `place_duct_elbow`.
   - Nắp bịt đầu ống (`HTS-CAP-*`): vẽ đốt ngắn `25–50 mm` ở cuối tuyến rồi gọi `ui_feature_run` `{"id": "hvac-cap", "inputs": ["x_bien,y_bien"]}`.
5. **Van gió, Khớp nối mềm & Cửa gió (`M-MVAC-Equipment`) — CHỈ THỰC HIỆN KHI ĐƯỢC YÊU CẦU RÕ RÀNG**:
   - **CẢNH BÁO PHẠM VI**: Tuyệt đối **KHÔNG tự ý đặt van gió (`VCD/FD/MFD/MD/NRD`) hay cửa gió (`HTS_Mieng gio *`)** nếu người dùng chỉ yêu cầu vẽ ống gió và phụ kiện ống gió! Chỉ mở rộng sang bước này khi có yêu cầu rõ từ người dùng.
   - Khi được yêu cầu: chèn từ `Library\HVAC\Phụ kiện\` bằng `insert_block` / `batch_insert_blocks` (`rotation` tính bằng **Radian**); kiểm soát 3 block gốc `Inches` (`HTS_Van gio tron VCD`, `MD vuông`, `RND` → kiểm tra `get_bounding_box`, scale `1/25.4` nếu phóng `25.4x`); cập nhật `Width1` và Attribute.
6. **Gán cao độ đáy & Mở khóa trả nguyên trạng Layer cũ**:
   - Gọi `duct_set_elevation` gán `HTS_OG_DAY` (`day = BOD`) cho 100% ống và phụ kiện trên `M-MVAC-<HỆ>`; gọi `block_set_elevation_system` (`he: "HVAC"`) cho thiết bị/van nếu cần.
   - Gọi `set_layer_state` (`locked: false`) mở khóa toàn bộ các layer thiết kế cũ.

### Bước 4 — Khoanh Mây `REVCLOUD` Sạch Gọn Trên Vùng Chưa Rõ (`Layer CLOUND`)
1. Đặt layer hiện hành là `CLOUND` (`ACI 240`, `lineweight = 20`).
2. Trên **AutoCAD 2021–2027**, tùy chọn `_A` của `_.REVCLOUD` **chỉ nhận 1 số chiều dài cung duy nhất** (ví dụ `400` hoặc `500` mm):
   ```json
   { "command": "_.REVCLOUD\n_A\n450\n_R\n37450,200\n45850,4150\n" }
   ```
   *(Hoặc vẽ `draw_polyline` kín rồi chạy `"_.REVCLOUD\n_A\n450\n_O\n_L\n_N\n"` để bụng mây quay ra ngoài).*
3. **Kiểm tra sạch bên trong mây**: Không rải chữ/leader dài đè rối bản vẽ; xác nhận bên trong mỗi khung `REVCLOUD` có **`0` thực thể thuộc các layer `M-MVAC-*`**.

### Bước 5 — Nghiệm Thu QA/QC Độc Lập & Báo Cáo Hỏi Xác Nhận Cuối Tiến Trình
Trước khi bàn giao cho người dùng, bắt buộc chạy kiểm tra độc lập bằng các tool chỉ-đọc (`get_drawing_info`, `get_layer_info`, `group_summary_by_layer`, `list_block_definitions`, `get_entities_in_area`, `get_bounding_box`, `get_xdata`, `export_plan_image` + `read_file` soi ảnh trực quan):
- [ ] **100% HTS Tool**: Mọi thực thể trên `M-MVAC-<HỆ>` là `INSERT` tên `HTS-*`; mọi thực thể trên `M-MVAC-Equipment` là `INSERT` tên `HTS_*`; `0` LINE/POLYLINE giả ống gió; `0` block thừa (`instance_count = 0`).
- [ ] **Đè khít 100% tại chỗ & Bảo toàn gốc**: Số lượng thực thể trên các layer thiết kế cũ giữ nguyên 100%; sai số đường tim `< 1 mm`; tất cả layer đều `is_locked = false`, `is_frozen = false`, `is_off = false`; `extmin/extmax` không có rác ngoài phạm vi bản vẽ.
- [ ] **Loại trừ 100% giữa Vẽ & Mây**: Vùng đã hiểu không có mây; bên trong mọi mây `CLOUND` có đúng **`0` đối tượng `M-MVAC-*`**.
- [ ] **Đủ dữ liệu 3D/BOQ**: `100%` block trên `M-MVAC-<HỆ>` có XData `HTS_OG_DAY`; các van/khớp mềm/miệng gió khớp đúng `Width1` (không bị lỗi phóng `25.4x` Inches).
- [ ] **Trạng thái AutoCAD sạch**: Không treo lệnh dở dang trên Command Line, đã `save_drawing` (`QSAVE`), tổng hợp bảng câu hỏi ngắn gọn theo từng đám mây `RC-01..RC-n` trình người dùng giải đáp.

---

## 4. Tài Liệu Tham Chiếu Chuyên Sâu (`references/`)
- **Tiêu chuẩn Layer, giải mã nhãn thông số & mẫu câu hỏi đầu dự án**: [spec-layer-ong-gio.md](./references/spec-layer-ong-gio.md)
- **Cẩm nang cú pháp MCP 100% HTS Tool HVAC, toán học hình học & lệnh cấm**: [hts-hvac-tools-cheatsheet.md](./references/hts-hvac-tools-cheatsheet.md)
