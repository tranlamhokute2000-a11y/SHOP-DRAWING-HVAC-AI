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

### Quy tắc cứng số 3 — Quy tắc Nội suy Kích thước Dọc Tuyến Ống, Côn Thu & Chủ Động Đấu Nối Góc Thiếu Phụ Kiện
- **Cùng 1 tuyến ống gió khi chuyển hướng (cút 90°/45°, đoạn chuyển hướng Jog)** mà người vẽ thiết kế thiếu Text ghi kích thước: **BẮT BUỘC nội suy kích thước từ Text có trên tuyến ống đó** để triển khai vẽ hoàn chỉnh, **KHÔNG khoanh mây bỏ trống**!
- **Kích thước ống gió CHỈ thay đổi khi đi qua phụ kiện Côn thu (`Reducer / Transition`)**: kể từ ngay sau mặt bích đầu ra của côn thu, toàn bộ đoạn ống thẳng và các đoạn chuyển hướng tiếp theo lấy kích thước theo **tuyến ống tiếp theo**!
- **Chủ động đấu nối góc thiếu phụ kiện giữa 2 nhánh ống cùng hệ thống**: Khi 2 tuyến ống thuộc **cùng 1 hệ thống** hội tụ nhau (vuông góc `90°` hoặc bất kỳ góc nghiêng $\theta$ nào) mà bản vẽ thiết kế gốc **bị vẽ thiếu phụ kiện nối tại góc**, căn cứ theo nhãn Text thượng lưu & hạ lưu để suy luận rằng người thiết kế chỉ vẽ sót phụ kiện — **CHỦ ĐỘNG đấu nối hoàn chỉnh 2 tuyến bằng 100% phụ kiện HTS phù hợp** (cút cong/cút góc khớp chính xác góc giữa 2 đường tim với bán kính cong trong tiêu chuẩn **`R = W / 2`**, kèm **côn thu** nếu kích thước `WxH` hai nhánh khác nhau) và **TUYỆT ĐỐI KHÔNG khoanh mây `REVCLOUD`** tại góc nối đó!

### Quy tắc cứng số 4 — Nguyên tắc Loại trừ Lẫn nhau 100% giữa Vẽ Shop và Khoanh Mây `REVCLOUD`
- **TUYỆT ĐỐI KHÔNG BAO GIỜ VỪA VẼ SHOP DRAWING VỪA KHOANH MÂY `REVCLOUD` CÙNG MỘT VỊ TRÍ!** Mọi khu vực trên mặt bằng chỉ thuộc **1 trong 2 trạng thái loại trừ nhau**:
  1. **Vùng ĐÃ HIỂU & CHẮC CHẮN ĐÚNG** *(bao gồm các đoạn chuyển hướng đã nội suy được và các góc hội tụ cùng hệ thống thiếu phụ kiện đã chủ động đấu nối theo Quy tắc số 3)*: Vẽ đè khít 100% bằng HTS Tool và **KHÔNG khoanh mây**.
  2. **Vùng THỰC SỰ KHÔNG HIỂU / THIẾU HOÀN TOÀN THÔNG SỐ KHÔNG THỂ NỘI SUY / HTS CHƯA CÓ BLOCK THIẾT BỊ** *(ví dụ cụm phòng quạt + tiêu âm thiếu toàn bộ Text kích thước & đầu chờ cụt)*: **Khoanh mây `REVCLOUD` trên Layer `CLOUND` (`ACI 240`) và BỎ TRỐNG HOÀN TOÀN (`0` block `M-MVAC-*` bên trong mây)** — chỉ giữ nguyên nét thiết kế gốc bên dưới, không chèn chữ/leader dài đè rối bản vẽ. Chỉ sau khi kết thúc toàn bộ tiến trình vẽ mới liệt kê câu hỏi theo từng mây để hỏi người dùng!

---

## 2. Quy Tắc Đầu Mỗi Dự Án Mới: Xác Nhận Spec Layer & Ký Hiệu Hệ Thống

Ở **lượt đầu tiên của mỗi dự án mới** (trước khi vẽ bất kỳ đối tượng nào), Agent bắt buộc:
1. Đọc danh sách Layer (`get_layer_list`), nhãn chữ (`extract_all_text`) trên bản vẽ thiết kế và đối chiếu với chuẩn mặc định tại [spec-layer-ong-gio.md](./references/spec-layer-ong-gio.md) (`M-MVAC-EAD`, `M-MVAC-FAD`, `M-MVAC-PAD`, `M-MVAC-CEAD`, `M-MVAC-CSAD`, `M-MVAC-SEAD`, `M-MVAC-Equipment`, `M-MVAC-Support`, `M-MVAC-DIM`, `M-MVAC-TEXT`, `CLOUND`).
2. **Hỏi người dùng xác nhận bảng ánh xạ Layer, màu ACI và quy tắc ký hiệu hệ thống** của dự án (cho phép xác nhận dùng mặc định theo `Spec-layer ký hiệu ống gió.dwg` hoặc thay đổi/bổ sung nếu dự án có hệ thống mở rộng như `SAD`/`SA`, `RAD`/`RA`, `OAD`, `TEAD`...).
3. Chỉ dùng kết nối `hts-autocad` (cổng `5088`); không yêu cầu bật `vcs-boq` (cổng `5077`) trừ khi người dùng yêu cầu bóc khối lượng BOQ.

---

## 3. Quy Trình 5 Bước Triển Khai Shop Drawing Ống Gió

### Bước 1 — Khảo sát Read-Only Siêu Tốc (`survey_hvac.mjs`), Sao lưu & Khởi tạo Layer Spec
1. **Chạy 1 lệnh khảo sát Turbo (`< 1 giây`)** thay vì gọi lẻ từng tool MCP:
   ```powershell
   node .agents/skills/shopdrawing-ong-gio/scripts/survey_hvac.mjs --backup --image --out work_hvac/<du_an>
   ```
   Script tự động kiểm tra cổng `5088`, sao lưu `.dwg` gốc, ghi nhận chính xác `baseline.json` (số lượng thực thể từng layer gốc), cảnh báo `INSUNITS != Millimeters` / `ELLIPSE` / layer khóa, giải mã cặp nhãn `<HỆ>-WxH` + `BOD`, bắt cặp thành ống song song tạo tim trục `0.01 mm` và xuất `survey_full.png` để soi bằng `read_file`.
2. **Khởi tạo bộ Layer Spec v3 + Chuẩn hóa đơn vị bằng 1 lệnh duy nhất (`< 0.2 giây`)**:
   ```powershell
   node .agents/skills/shopdrawing-ong-gio/scripts/init_spec_layers.mjs --lock-orig
   ```
   Script tự ép `INSUNITS = 4` (`Millimeters`), `MEASUREMENT = 1` (chống lỗi phóng `25.4x` Inches từ file Revit), tạo đủ 13 layer chuẩn `M-MVAC-*` & `CLOUND` (`ByLayer`, `Continuous`, nét in chuẩn) và khóa tạm toàn bộ các layer thiết kế gốc trước khi vẽ. (Nếu dự án có thêm hệ phụ như `SAD`/`RAD`, truyền thêm `--extra SAD:140,RAD:200`).

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
4. **Chèn phụ kiện đặc thù, Nắp bịt đầu & Trích chi tiết Chuyển cao độ đứng (`ΔZ > 200 mm`)**:
   - Chạc quần Y chia đôi: `duct_breeches_insert` (`xemTruoc: true` kiểm tra miệng nối trước khi chèn thật).
   - Cút vuông vát / cánh hướng / lên xuống tròn: `place_duct_elbow`.
   - **Nắp bịt đầu ống (`HTS-CAP-*`) — Kỷ luật xóa đốt `< 100 mm` cuối tuyến**: **TUYỆT ĐỐI KHÔNG vẽ thêm đốt mỏng `< 100 mm`** (như `L25`/`L50`) ở cuối tuyến; mọi đốt cuối tuyến có `L < 100 mm` phải xóa bỏ hoàn toàn, sau đó chuyển trực tiếp **đốt ống thật cuối cùng (`L ≥ 100 mm`, chiều `rotation` hướng ra đầu cụt)** thành ống bịt đầu bằng HTS `ui_feature_run` `{"id": "hvac-cap", "inputs": ["(handent \"<handle>\")"]}` rồi gán lại `HTS_OG_DAY`.
   - **Vị trí chuyển cao độ đứng dọc tuyến (`ΔZ = |BOD₁ - BOD₂| > 200 mm`)**: **KHÔNG vẽ ống thẳng `HTS-OG-*` bắc cầu đè qua!** Thực hiện trọn bộ chuẩn mặt bằng + trích mặt đứng (chi tiết toán học & mẹo hình vuông `ΔZ × ΔZ` tại [hts-hvac-tools-cheatsheet.md](./references/hts-hvac-tools-cheatsheet.md#L265-L276)):
     1. **Trên mặt bằng**: Dừng ống thẳng khít 2 mặt bích ngoài; vẽ hình chữ nhật `RECTANG` (`draw_rectangle`) bao khung chuyển cao độ + 1 `LWPOLYLINE` 4 đỉnh dạng chữ Z vát chéo ở giữa (cùng layer `M-MVAC-<HỆ>`, `ByLayer`).
     2. **Trích hình chiếu đứng (`2` chếch `45°` + `1` đốt bù) bằng 100% HTS Tool**: Đảo ngược kích thước `W_đứng = H`, `H_đứng = W`, bán kính `R = H / 2`; dựng theo **mẹo hình vuông mồi `ΔZ × ΔZ`** (4 điểm tim trục → `draw_rectangular_duct` tự sinh đúng 2 cút `HTS-CO-V47-{H}x{W}-R{H/2}-A45` + 1 đốt bù `HTS-OG-{H}x{W} L{L_bù}` với $L_{\text{bù}} = \Delta Z\sqrt{2} - 2H(\sqrt{2}-1)$).
     3. **Dim chi tiết & Khoanh mây trích + Mũi tên theo Spec v3**: Dim 3 kích thước (`H`, `ΔZ`, `L_bù`) bằng DimStyle **`HỒ-DIM 1-70`** trên Layer `M-MVAC-DIM` → khoanh mây `_.REVCLOUD` (`_A 200`, Layer `CLOUND`) bao khít hình chiếu đứng + Dim → vẽ `LEADER` mũi tên chỉ thẳng vào **chính giữa cạnh khung chữ nhật chuyển cao độ** với khoảng cách `~1260 mm` (tại vùng trống không đè ống/chữ).
5. **Van gió, Khớp nối mềm & Cửa gió (`M-MVAC-Equipment`) — CHỈ THỰC HIỆN KHI ĐƯỢC YÊU CẦU RÕ RÀNG**:
   - **CẢNH BÁO PHẠM VI**: Tuyệt đối **KHÔNG tự ý đặt van gió (`VCD/FD/MFD/MD/NRD`) hay cửa gió (`HTS_Mieng gio *`)** nếu người dùng chỉ yêu cầu vẽ ống gió và phụ kiện ống gió! Chỉ mở rộng sang bước này khi có yêu cầu rõ từ người dùng.
   - Khi được yêu cầu: chèn từ `Library\HVAC\Phụ kiện\` bằng `insert_block` / `batch_insert_blocks` (`rotation` tính bằng **Radian**); kiểm soát 3 block gốc `Inches` (`HTS_Van gio tron VCD`, `MD vuông`, `RND` → kiểm tra `get_bounding_box`, scale `1/25.4` nếu phóng `25.4x`); cập nhật `Width1` và Attribute.
6. **Gán cao độ đáy & Mở khóa trả nguyên trạng Layer cũ**:
   - Gọi `duct_set_elevation` gán `HTS_OG_DAY` (`day = BOD`) cho 100% ống và phụ kiện trên `M-MVAC-<HỆ>`; gọi `block_set_elevation_system` (`he: "HVAC"`) cho thiết bị/van nếu cần.
   - Gọi `set_layer_state` (`locked: false`) mở khóa toàn bộ các layer thiết kế cũ.

### Bước 4 — Khoanh Mây `REVCLOUD` Sạch Gọn Trên Vùng Chưa Rõ (`Layer CLOUND`)
1. Đặt layer hiện hành là `CLOUND` (theo Spec v2: thuyết minh nét in mảnh `0.05 mm`, màu `01` Đỏ; layer `CLOUND` gốc trong file Spec đang giữ `ACI 240`, đồng thời có sẵn layer `REVCLOUD` `ACI 1` — luôn đồng bộ nhất quán trong cùng 1 bản vẽ). Khi cần **trích chi tiết vật thể** (Spec v2 dòng 15), vẽ đám mây kèm 1 đường gióng thẳng chỉ về vùng ghi chú; đường **chỉ dẫn mũi tên** (`LEADER`) dùng nét `0.10`, màu `2` (`M-MVAC-TEXT`).
2. Trên **AutoCAD 2021–2027**, tùy chọn `_A` của `_.REVCLOUD` **chỉ nhận 1 số chiều dài cung duy nhất** (ví dụ `400` hoặc `500` mm):
   ```json
   { "command": "_.REVCLOUD\n_A\n450\n_R\n37450,200\n45850,4150\n" }
   ```
   *(Hoặc vẽ `draw_polyline` kín rồi chạy `"_.REVCLOUD\n_A\n450\n_O\n_L\n_N\n"` để bụng mây quay ra ngoài).*
3. **Kiểm tra sạch bên trong mây**: Không rải chữ/leader dài đè rối bản vẽ; xác nhận bên trong mỗi khung `REVCLOUD` có **`0` thực thể thuộc các layer `M-MVAC-*`**.

### Bước 5 — Nghiệm Thu QA/QC Độc Lập Siêu Tốc (`qa_audit_hvac.mjs`) & Báo Cáo Cuối Tiến Trình
Trước khi bàn giao cho người dùng, **chạy ngay script nghiệm thu độc lập Turbo (`< 1 giây`)** qua cổng `5088`:
```powershell
node .agents/skills/shopdrawing-ong-gio/scripts/qa_audit_hvac.mjs --baseline work_hvac/<du_an>/baseline.json --out work_hvac/<du_an>/qa_audit.json --image work_hvac/<du_an>
```
Sau đó dùng `read_file` soi trực quan ảnh tổng `qa_audit_full.png` cùng 2–3 ảnh zoom các nút phức tạp, đối chiếu trọn vẹn 5 tiêu chí:
- [ ] **100% HTS Tool**: Mọi thực thể trên `M-MVAC-<HỆ>` là `INSERT` tên `HTS-*`; mọi thực thể trên `M-MVAC-Equipment` là `INSERT` tên `HTS_*`; `0` LINE/POLYLINE giả ống gió; `0` block thừa (`instance_count = 0`).
- [ ] **Đè khít 100% tại chỗ & Bảo toàn gốc**: Số lượng thực thể trên các layer thiết kế cũ khớp 100% với `baseline.json`; sai số đường tim `< 1 mm`; tất cả layer (kể cả `CLOUND`) đều `is_locked = false`, `is_frozen = false`, `is_off = false`; `extmin/extmax` không có rác ngoài phạm vi bản vẽ.
- [ ] **Loại trừ 100% giữa Vẽ & Mây**: Vùng đã hiểu không có mây; giao cắt Bounding Box chặt giữa mọi mây `CLOUND` và toàn bộ `M-MVAC-*` bằng **`0`**.
- [ ] **Đủ dữ liệu 3D/BOQ**: `100%` block trên `M-MVAC-<HỆ>` có XData `HTS_OG_DAY`; các van/khớp mềm/miệng gió khớp đúng `Width1` (không bị lỗi phóng `25.4x` Inches).
- [ ] **Trạng thái AutoCAD sạch**: Không treo lệnh dở dang trên Command Line, đã `save_drawing` (`QSAVE`), tổng hợp bảng câu hỏi ngắn gọn theo từng đám mây `RC-01..RC-n` trình người dùng giải đáp.

> **Mẹo tăng tốc tiến độ (Turbo Playbook — Mục tiêu `10–15 phút` / bản vẽ lớn & `1–3 phút` / sửa cục bộ)**:
> 1. **Đợt tổng triển khai bản vẽ mới**: `survey_hvac.mjs` (`0.2s`) → `init_spec_layers.mjs --lock-orig` (`0.15s`) → gom **1–2 lượt batch** `draw_rectangular_duct` (`runs`) → xử lý côn/gót giày (`QUETPK` / `HTS_RVOG Xoagoc=KHÔNG`) → `draw_z_offsets.mjs` (`< 3s` cho toàn bộ Z-offset `ΔZ > 200mm` kèm 3 Dim `0.000mm` + `CLOUND` + `MATCHPROP` mũi tên) → `apply_endcaps.mjs` (`< 2s` xóa đốt `< 100mm` & bịt đầu `hvac-cap`) → `duct_set_elevation` gom 1 lượt → `init_spec_layers.mjs --unlock-all` → `qa_audit_hvac.mjs` (`0.2s`) + soi 1 ảnh tổng & 2–3 ảnh nút phức tạp.
> 2. **Ca sửa cục bộ (gỡ 1–2 mây, thêm phụ kiện, chỉnh góc)**: Triển khai **trực tiếp 1 luồng** (không cần khởi động Swarm mới) kết hợp script Turbo + `qa_audit_hvac.mjs` + 1 ảnh zoom để hoàn tất chỉ trong `1–3 phút`.

---

## 4. Kịch Bản Tác Chiến Swarm Đa Agent (`/swarm` HVAC Orchestration)

Khi người dùng ra lệnh **"triển khai bản vẽ ống gió cho tôi"** (hoặc yêu cầu Shop Drawing HVAC tương đương), Agent đóng vai trò `coordinator` bắt buộc khởi tạo đội ngũ Swarm:

1. **Khởi tạo và đặt tiêu đề Swarm**:
   ```json
   { "action": "title", "title": "Triển khai Shop Drawing Hệ Thống Ống Gió HVAC" }
   ```

2. **Khởi tạo các Worker chuyên biệt bằng các lệnh `swarm{action:"add", name, brief}`**:
   - **`@surveyor`**:
     ```
     Brief: "Bạn phụ trách khảo sát hệ thống ống gió. Chạy survey_hvac.mjs lưu baseline.json, chạy init_spec_layers.mjs --lock-orig chuẩn hóa INSUNITS=4 và khóa tạm layer gốc. Phân tách danh sách A (tuyến ống đủ thông số để vẽ) và danh sách B (vùng chưa rõ để khoanh mây CLOUND). Post [done] kèm baseline lên bảng tin."
     ```
   - **`@duct-author`**:
     ```
     Brief: "Bạn phụ trách dựng 100% ống gió và phụ kiện HTS đè tại chỗ (In-Place Overlay) theo tọa độ đường tim từ surveyor. Tuân thủ 5 Quy tắc cứng: 100% HTS Tool, chia đốt 1110mm, nối góc R=W/2, bảo toàn nét gốc, gán BOD vào HTS_OG_DAY. Tuyệt đối không tự ý đặt cửa gió/van/giá đỡ. Post [done] khi dựng xong."
     ```
   - **`@detailer`**:
     ```
     Brief: "Bạn phụ trách toàn bộ vị trí chuyển cao độ đứng ΔZ > 200mm. Chạy draw_z_offsets.mjs hoặc dựng mặt bằng RECTANG + PL chữ Z, trích hình chiếu đứng 2 chếch 45° R=H/2 + đốt bù (mẹo ΔZ×ΔZ), 3 Dim HỒ-DIM 1-70 bắt chính xác 0.000mm từ tâm cút, khoanh mây CLOUND và LEADER MATCHPROP chuẩn Spec. Post [done] khi hoàn thành."
     ```
   - **`@endcap-finisher`**:
     ```
     Brief: "Bạn phụ trách hoàn thiện các đầu cụt cuối tuyến ống. Chạy apply_endcaps.mjs: xóa sạch toàn bộ các đốt lẻ < 100mm, chuyển đốt ống thật cuối cùng (L >= 100mm) thành HTS-CAP-* bằng hvac-cap (handent). Đồng bộ lại HTS_OG_DAY. Post [done] khi hoàn thành."
     ```
   - **`@qa-auditor`** (Verifier):
     ```
     Brief: "Bạn là kiểm toán viên độc lập. Chạy qa_audit_hvac.mjs kiểm tra 5 tiêu chí: 100% Block HTS, XData BOD, Không va chạm CLOUND, Nắp bịt không đốt mỏng, Bảo toàn 100% nét gốc từ baseline.json. Nếu PASS 5/5 post [done] cho coordinator; nếu có lỗi chỉ đích danh handle và tag tên tác giả sửa."
     ```

3. **Điều phối qua Message Board**:
   - Sử dụng `@worker-name` để giao việc và bàn giao theo chuỗi kết quả `#seq`.
   - Khi `@qa-auditor` báo `[done]` đạt 5/5 tiêu chí PASS, `coordinator` mở khóa toàn bộ layer (`init_spec_layers.mjs --unlock-all`), lưu bản vẽ (`save_drawing`), và phát âm thanh thông báo báo cáo hoàn thành.

---

## 5. Tài Liệu Tham Chiếu & Bộ 6 Script Tăng Tốc (`references/` & `scripts/`)
- **Tiêu chuẩn Layer Spec v3 (16 hạng mục + 2 DimStyle + 14 Block ký hiệu thiết bị)**: [spec-layer-ong-gio.md](./references/spec-layer-ong-gio.md)
- **Cẩm nang cú pháp MCP 100% HTS Tool HVAC, toán học hình học & 8 kinh nghiệm thực chiến**: [hts-hvac-tools-cheatsheet.md](./references/hts-hvac-tools-cheatsheet.md)
- **Bộ Script Turbo Node.js không phụ thuộc ngoài (`scripts/` — 0 dependency, chạy ngay trên mọi máy cài HTS)**:
  - [hts_mcp.mjs](./scripts/hts_mcp.mjs) — Client HTTP JSON-RPC (`:5088`), tự xử lý Bearer Token và chia chunk `batch_process` tối đa `55` bước/lần (dưới ngưỡng cứng `60` của HTS).
  - [survey_hvac.mjs](./scripts/survey_hvac.mjs) — Khảo sát Read-Only toàn bản vẽ + sao lưu + lưu `baseline.json` + giải mã nhãn/tim ống trong **`< 1 giây`**.
  - [init_spec_layers.mjs](./scripts/init_spec_layers.mjs) — Ép `INSUNITS = 4` / `MEASUREMENT = 1`, khởi tạo đủ 13 layer Spec v3, khóa/mở khóa layer gốc trong **`< 0.2 giây`**.
  - [draw_z_offsets.mjs](./scripts/draw_z_offsets.mjs) — Tự động dựng trọn bộ chuyển cao độ đứng `ΔZ > 200 mm` (khung `RECTANG` + `PL` chữ Z mặt bằng, 2 chếch `45°` `R=H/2` + đốt bù hình chiếu đứng theo mẹo hình vuông `ΔZ×ΔZ`, 3 Dim `HỒ-DIM 1-70` bắt chính xác `0.000 mm` theo tâm cút, `REVCLOUD` `CLOUND`, và `LEADER` `MATCHPROP` chuẩn Spec) trong **`< 3 giây`**.
  - [apply_endcaps.mjs](./scripts/apply_endcaps.mjs) — Tự động xóa các đốt lẻ cuối tuyến `< 100 mm`, chuyển đốt ống thật cuối cùng thành `HTS-CAP-*` bằng `hvac-cap` qua `(handent)` (không cần Zoom/Pick chuột), gán lại `HTS_OG_DAY` và `purge_unused_blocks` trong **`< 2 giây`**.
  - [qa_audit_hvac.mjs](./scripts/qa_audit_hvac.mjs) — Kiểm toán độc lập 5/5 tiêu chí QA/QC (100% `HTS-*`, đối chiếu `baseline.json`, mở khóa 100% layer, phân tách `KHOANH MÂY` vs `TRÍCH CHI TIẾT VẬT THỂ`, 100% XData `HTS_OG_DAY`, bỏ qua mũi tên hệ thống `_Dot`/`_Oblique`) trong **`< 0.3 giây`**.
