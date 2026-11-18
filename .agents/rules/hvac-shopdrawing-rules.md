# Quy Tắc Triển Khai Shop Drawing Ống Gió HVAC (Workspace Rules)

- **Kỷ luật phạm vi công việc & Bảo vệ thành quả**:
  - Yêu cầu gì làm đúng 100% như thế; tuyệt đối không tự ý đặt cửa gió, van gió, giá đỡ hay làm thêm hạng mục ngoài yêu cầu.
  - Khi sửa một vị trí cụ thể, chỉ thao tác cục bộ đúng vị trí đó; nghiêm cấm phá hỏng thành quả trước đó và luôn đảm bảo `DRAWORDER` lớp Shop Drawing (`M-MVAC-*`) nằm trên nền thiết kế gốc.
- **Kỷ luật Shop Drawing Ống gió HVAC** *(xem chi tiết trong `.agents/skills/shopdrawing-ong-gio/`)*:
  1. **Bắt buộc 100% HTS Tool (`hts-autocad`, cổng `5088`)**: Không vẽ giả ống gió/phụ kiện bằng `LINE`/`POLYLINE` rời.
  2. **Vẽ đè trực tiếp 100% tại chỗ (`In-Place Overlay`)**: Đè khít lên tọa độ nét thiết kế cũ, bảo toàn 100% nền thiết kế gốc, cấm dựng ở vùng nháp bên ngoài.
  3. **Nội suy kích thước dọc tuyến & Chủ động đấu nối góc thiếu phụ kiện**: Cùng 1 tuyến ống khi chuyển hướng thiếu Text thì nội suy theo Text trên tuyến đó; kích thước chỉ thay đổi khi đi qua **côn thu** sang tuyến tiếp theo. Khi 2 nhánh ống cùng hệ thống hội tụ nhau (góc `90°` hoặc góc $\theta$ bất kỳ) mà thiết kế bị vẽ thiếu phụ kiện nối góc, chủ động nối hoàn chỉnh bằng 100% phụ kiện HTS (cút khớp đúng góc giữa 2 tim với bán kính cong trong chuẩn `R = W / 2`, kèm côn thu nếu kích thước khác nhau) và **KHÔNG khoanh mây `REVCLOUD`** tại góc đó.
  4. **Loại trừ 100% Vẽ vs Khoanh mây `REVCLOUD`**: Chỗ đã hiểu chắc chắn đúng thì vẽ và không khoanh mây; chỗ thực sự không hiểu thì khoanh mây trên Layer `CLOUND` và bỏ trống không vẽ bên trong, xong tiến trình mới hỏi lại kỹ sư.
  5. **Đầu mỗi dự án mới**: Trình bảng thông số Layer Spec (`M-MVAC-*`) để xác nhận hoặc điều chỉnh trước khi vẽ.
  6. **Kết nối MCP**: Mặc định chỉ dùng `hts-autocad` (`5088`); chỉ hỏi bật `vcs-boq` (`5077`) khi có yêu cầu bóc khối lượng (BOQ).
- **Đúc kết Skill sau khi duyệt "OK"**: Sau mỗi tác vụ hoàn thành và được xác nhận "OK", chủ động đúc kết kinh nghiệm mới vào đúng Skill tương ứng (không lặp lại những gì đã có).
