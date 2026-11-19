# Quy Tắc Triển Khai Shop Drawing Ống Gió HVAC (Workspace Rules)

## 0. Quy Tắc Bắt Buộc Kích Hoạt Đội Ngũ Swarm (/swarm Orchestration Trigger)
- **Trigger bắt buộc**: Khi người dùng ra lệnh **"triển khai bản vẽ ống gió cho tôi"** (hoặc các câu lệnh yêu cầu triển khai Shop Drawing toàn bản vẽ / tuyến ống gió tương đương), **BẮT BUỘC KHỞI TẠO ĐỘI NGŨ `/swarm`** tác chiến đa Agent song song, tuyệt đối không làm việc đơn lẻ nếu khối lượng công việc có thể phân tách.
- **Cơ cấu đội ngũ Swarm tiêu chuẩn cho Shop Drawing HVAC**:
  1. `coordinator` (Chỉ huy / Điều phối): Tiếp nhận yêu cầu, chia slice công việc theo tuyến ống / phân khu độc lập, giám sát Message Board, tổng hợp và báo cáo Sếp Hồ.
  2. `surveyor` (Khảo sát & Chuẩn bị): Chạy `survey_hvac.mjs`, trích xuất `baseline.json`, phân tích cặp nhãn `WxH` & `BOD`, phân loại Vùng Đã Hiểu (Vẽ) vs. Vùng Chưa Rõ (Khoanh mây `CLOUND`), khóa tạm layer thiết kế cũ.
  3. `duct-author` (Dựng ống & Phụ kiện): Sử dụng 100% HTS Tool (`hts-autocad` cổng `5088`) vẽ đè tại chỗ (`In-Place Overlay`), chia đốt `1110/1180mm`, nối góc `R = W/2`, gán XData cao độ `HTS_OG_DAY`.
  4. `detailer` (Chi tiết Chuyển cao độ): Chuyên trách các vị trí $\Delta Z > 200\text{ mm}$, dựng ký hiệu mặt bằng (`RECTANG` + `PL` chữ Z) và trích hình chiếu đứng ($2$ chếch $45^\circ$ + đốt bù bằng mẹo hình vuông $\Delta Z \times \Delta Z$), Dim `HỒ-DIM 1-70` bắt chuẩn $0.000\text{ mm}$ từ tâm cút, khoanh mây `CLOUND` và mũi tên `LEADER` `MATCHPROP` từ Spec.
  5. `endcap-finisher` (Xử lý nắp bịt cuối tuyến): Tự động xóa sạch các đốt lẻ $< 100\text{ mm}$, chuyển đốt thật cuối cùng ($\ge 100\text{ mm}$) thành `HTS-CAP-*` bằng `hvac-cap` (`(handent)`).
  6. `qa-auditor` (Kiểm toán Độc lập - Verifier): Chạy `qa_audit_hvac.mjs` kiểm toán 5 tiêu chí vàng trước khi bàn giao; phát hiện lỗi gửi trả tác giả sửa cục bộ.
- **Cơ chế Cập nhật & Nạp lại Liên tục (Live Skill Sync & Reload)**:
  - Bất kỳ khi nào Sếp Hồ chỉnh sửa, bổ sung, đính chính hay lưu ý thêm kinh nghiệm mới, hệ thống phải NGAY LẬP TỨC ghi lại vào Skill và Rule tương ứng, đồng thời nạp lại (reload) ngay lập tức để áp dụng xuyên suốt cho các bước tiếp theo, không bao giờ lặp lại sai sót cũ.

---

## 1. Kỷ Luật Phạm Vi Công Việc & Bảo Vệ Thành Quả (Quy Tắc Vàng)
- **Quy tắc cứng số 0 (Tối thượng) — Yêu cầu gì làm đúng nấy & Không phá hỏng thành quả**:
  - Người dùng yêu cầu hạng mục nào thì chỉ thực hiện đúng 100% hạng mục đó, tuyệt đối không tự suy diễn làm thêm công việc/đối tượng khác khi chưa được yêu cầu.
  - Khi được yêu cầu vẽ ống gió và phụ kiện, chỉ dựng ống gió và phụ kiện đường ống (cút, côn thu, tê, chạc quần, chân rẽ gót giày `HTS-TAP-*`, nắp bịt đầu `HTS-CAP-*`); **TUYỆT ĐỐI KHÔNG tự ý đặt cửa gió/miệng gió (`HTS_Mieng gio *`), van gió (`VCD/FD/MFD/MD/NRD`), giá đỡ, Dim hay ghi chú phụ** trừ khi người dùng yêu cầu rõ ràng. Tại vị trí van gió có sẵn trên nền thiết kế gốc, chỉ dừng 2 đầu ống khít mặt bích van gốc, giữ nguyên ký hiệu van gốc bên dưới.
  - Khi sửa một vị trí cụ thể, **CHỈ thao tác cục bộ đúng vị trí đó**; nghiêm cấm phá hỏng thành quả trước đó và luôn đảm bảo `DRAWORDER` lớp Shop Drawing (`M-MVAC-*`) nằm trên nền thiết kế gốc.

---

## 2. Kỷ Luật Shop Drawing Ống Gió HVAC (5 Quy Tắc Cứng)
1. **Bắt buộc 100% HTS Tool (`hts-autocad`, cổng `5088`)**: Không vẽ giả ống gió/phụ kiện bằng `LINE`/`POLYLINE` rời rạc.
2. **Vẽ đè trực tiếp 100% tại chỗ (`In-Place Overlay`)**: Đè khít lên tọa độ nét thiết kế cũ, bảo toàn 100% nền thiết kế gốc, cấm dựng ở vùng nháp bên ngoài rồi move về.
3. **Nội suy kích thước dọc tuyến & Chủ động đấu nối góc thiếu phụ kiện**:
   - Cùng 1 tuyến ống khi chuyển hướng thiếu Text thì nội suy theo Text trên tuyến đó; kích thước chỉ thay đổi khi đi qua **côn thu** sang tuyến tiếp theo.
   - Khi 2 nhánh ống cùng hệ thống hội tụ nhau (góc `90°` hoặc góc $\theta$ bất kỳ) mà thiết kế bị vẽ thiếu phụ kiện nối góc, chủ động nối hoàn chỉnh bằng 100% phụ kiện HTS (cút khớp đúng góc giữa 2 tim với bán kính cong trong chuẩn `R = W / 2`, kèm côn thu nếu kích thước khác nhau) và **KHÔNG khoanh mây `REVCLOUD`** tại góc đó.
4. **Loại trừ 100% Vẽ vs Khoanh mây `REVCLOUD`**:
   - Chỗ đã hiểu chắc chắn đúng thì vẽ và không khoanh mây.
   - Chỗ thực sự không hiểu thì khoanh mây trên Layer `CLOUND` và bỏ trống không vẽ bên trong (`0` block `M-MVAC-*`), xong tiến trình mới hỏi lại kỹ sư. *(Phân biệt rõ với `TRÍCH CHI TIẾT VẬT THỂ` có kèm mũi tên `LEADER` của Spec v3).*
5. **Chuẩn gia công Chuyển cao độ đứng (`ΔZ > 200 mm`) & Bịt đầu cuối tuyến (`L < 100 mm`)**:
   - Vị trí chuyển cao độ đứng $\Delta Z > 200\text{ mm}$: vẽ mặt bằng `RECTANG + PL` chữ Z + trích hình chiếu đứng 2 chếch `45°` (`R = H/2`) + 1 đốt bù bằng mẹo hình vuông `ΔZ×ΔZ`, Dim `HỒ-DIM 1-70` bắt chính xác `0.000 mm` từ tâm cút (cấm lấy từ BBox xoay), `REVCLOUD` `CLOUND` và `LEADER` `MATCHPROP` chuẩn Spec.
   - Cuối tuyến ống gió: xóa bỏ hoàn toàn mọi đốt lẻ $< 100\text{ mm}$, chuyển trực tiếp đốt ống thật cuối cùng (`L ≥ 100 mm`) thành `HTS-CAP-*` bằng `hvac-cap` (`(handent)`).
6. **Tối ưu tốc độ bằng Bộ Script Turbo (`.agents/skills/shopdrawing-ong-gio/scripts/`)**: Luôn ưu tiên dùng `survey_hvac.mjs`, `init_spec_layers.mjs`, `draw_z_offsets.mjs`, `apply_endcaps.mjs`, và `qa_audit_hvac.mjs` để rút thời gian vẽ toàn bản vẽ xuống `10–15 phút` và sửa cục bộ xuống `1–3 phút`.
7. **Đầu mỗi dự án mới**: Trình/áp dụng bảng thông số Layer Spec v3 (`M-MVAC-*`, `M-DIM 1-400`, `HỒ-DIM 1-70`, 14 ký hiệu Block thiết bị).
8. **Kết nối MCP**: Mặc định chỉ dùng `hts-autocad` (`5088`); chỉ hỏi bật `vcs-boq` (`5077`) khi có yêu cầu bóc khối lượng (BOQ).
