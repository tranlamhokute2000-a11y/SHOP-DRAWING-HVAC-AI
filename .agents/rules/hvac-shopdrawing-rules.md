# Quy Tắc Triển Khai Shop Drawing Ống Gió HVAC (Workspace Rules)

- **Kỷ luật phạm vi công việc & Bảo vệ thành quả**:
  - Yêu cầu gì làm đúng 100% như thế; tuyệt đối không tự ý đặt cửa gió, van gió, giá đỡ hay làm thêm hạng mục ngoài yêu cầu.
  - Khi sửa một vị trí cụ thể, chỉ thao tác cục bộ đúng vị trí đó; nghiêm cấm phá hỏng thành quả trước đó và luôn đảm bảo `DRAWORDER` lớp Shop Drawing (`M-MVAC-*`) nằm trên nền thiết kế gốc.
- **Kỷ luật Shop Drawing Ống gió HVAC** *(xem chi tiết trong `.agents/skills/shopdrawing-ong-gio/`)*:
  1. **Bắt buộc 100% HTS Tool (`hts-autocad`, cổng `5088`)**: Không vẽ giả ống gió/phụ kiện bằng `LINE`/`POLYLINE` rời.
  2. **Vẽ đè trực tiếp 100% tại chỗ (`In-Place Overlay`)**: Đè khít lên tọa độ nét thiết kế cũ, bảo toàn 100% nền thiết kế gốc, cấm dựng ở vùng nháp bên ngoài.
  3. **Nội suy kích thước dọc tuyến & Chủ động đấu nối góc thiếu phụ kiện**: Cùng 1 tuyến ống khi chuyển hướng thiếu Text thì nội suy theo Text trên tuyến đó; kích thước chỉ thay đổi khi đi qua **côn thu** sang tuyến tiếp theo. Khi 2 nhánh ống cùng hệ thống hội tụ nhau (góc `90°` hoặc góc $\theta$ bất kỳ) mà thiết kế bị vẽ thiếu phụ kiện nối góc, chủ động nối hoàn chỉnh bằng 100% phụ kiện HTS (cút khớp đúng góc giữa 2 tim với bán kính cong trong chuẩn `R = W / 2`, kèm côn thu nếu kích thước khác nhau) và **KHÔNG khoanh mây `REVCLOUD`** tại góc đó.
  4. **Loại trừ 100% Vẽ vs Khoanh mây `REVCLOUD`**: Chỗ đã hiểu chắc chắn đúng thì vẽ và không khoanh mây; chỗ thực sự không hiểu thì khoanh mây trên Layer `CLOUND` và bỏ trống không vẽ bên trong, xong tiến trình mới hỏi lại kỹ sư. *(Phân biệt rõ với `TRÍCH CHI TIẾT VẬT THỂ` có kèm mũi tên `LEADER` của Spec v3).*
  5. **Chuẩn gia công Chuyển cao độ đứng (`ΔZ > 200 mm`) & Bịt đầu cuối tuyến (`L < 100 mm`)**:
     - Vị trí chuyển cao độ đứng $\Delta Z > 200\text{ mm}$: vẽ mặt bằng `RECTANG + PL` chữ Z + trích hình chiếu đứng 2 chếch `45°` (`R = H/2`) + 1 đốt bù bằng mẹo hình vuông `ΔZ×ΔZ`, Dim `HỒ-DIM 1-70` bắt chính xác `0.000 mm` từ tâm cút (cấm lấy từ BBox xoay), `REVCLOUD` `CLOUND` và `LEADER` `MATCHPROP` chuẩn Spec.
     - Cuối tuyến ống gió: xóa bỏ hoàn toàn mọi đốt lẻ `< 100 mm`, chuyển trực tiếp đốt ống thật cuối cùng (`L ≥ 100 mm`) thành `HTS-CAP-*` bằng `hvac-cap` (`(handent)`).
  6. **Tối ưu tốc độ bằng Bộ Script Turbo (`.agents/skills/shopdrawing-ong-gio/scripts/`)**: Luôn ưu tiên dùng `survey_hvac.mjs`, `init_spec_layers.mjs`, `draw_z_offsets.mjs`, `apply_endcaps.mjs`, và `qa_audit_hvac.mjs` để rút thời gian vẽ toàn bản vẽ xuống `10–15 phút` và sửa cục bộ xuống `1–3 phút`.
  7. **Đầu mỗi dự án mới**: Trình/áp dụng bảng thông số Layer Spec v3 (`M-MVAC-*`, `M-DIM 1-400`, `HỒ-DIM 1-70`, 14 ký hiệu Block thiết bị).
  8. **Kết nối MCP**: Mặc định chỉ dùng `hts-autocad` (`5088`); chỉ hỏi bật `vcs-boq` (`5077`) khi có yêu cầu bóc khối lượng (BOQ).
- **Đúc kết Skill sau khi duyệt "OK"**: Sau mỗi tác vụ hoàn thành và được xác nhận "OK", chủ động đúc kết kinh nghiệm mới vào đúng Skill tương ứng (không lặp lại những gì đã có).
