---
name: hts-cad
description: >-
  Kết nối và điều khiển AutoCAD qua HTS MCP Server (hts-autocad, cổng 5088 - 214 tools)
  và VCS BOQ Server (vcs-boq, cổng 5077 - 11 tools). Dùng khi Sếp Hồ yêu cầu đọc bản vẽ,
  vẽ/sửa đối tượng MEP trên AutoCAD hoặc bóc khối lượng BOQ sang Excel.
---

# Điều Khiển AutoCAD Qua HTS & VCS MCP (`hts-cad`)

## 1. Kiến trúc kết nối hiện hành
- **Cầu nối Node.js** (thư mục `C:\Users\Public\HTS-MCP\`):
  - `hts-mcp-bridge.js` ↔ **HTS Tool** (`http://localhost:5088/mcp`, 214 tools)
  - `vcs-mcp-bridge.js` ↔ **VCS BOQ** (`http://localhost:5077/mcp`, 11 tools)
- **Tệp cấu hình Antigravity**: `~/.gemini/config/mcp_config.json`

## 2. Quy tắc kích hoạt VCS (BẮT BUỘC)
- Trong các tác vụ vẽ, kiểm tra, chỉnh sửa bản vẽ thông thường: **chỉ dùng `hts-autocad` (cổng `5088`)**, bỏ qua trạng thái `OFFLINE` của cổng `5077`.
- **Chỉ khi Sếp Hồ yêu cầu bóc khối lượng (BOQ)**: nếu `vcs-boq` chưa sẵn sàng (chỉ có tool `vcs_status`), hãy **hỏi lại Sếp** để Sếp gõ lệnh `VCS` và đăng nhập bản quyền trong AutoCAD rồi mới tiến hành bóc tách.

## 3. Kiểm tra nhanh kết nối
```powershell
curl.exe http://localhost:5088/mcp/health
# Chỉ kiểm tra cổng 5077 khi làm tác vụ bóc khối lượng:
curl.exe http://localhost:5077/mcp/health
```

## 4. Nguyên tắc thao tác trên bản vẽ
1. **Đọc trước, ghi sau**: luôn khảo sát bằng `get_drawing_info`, `group_summary_by_layer`, `export_plan_image` trước khi sửa bản vẽ.
2. **Hỏi xác nhận trước thao tác lớn / xoá**: đối tượng tham chiếu qua `handle`; lưu bản sao trước khi chỉnh sửa hàng loạt hoặc chạy `batch_process_drawings`.
3. **Bóc khối lượng (khi Sếp yêu cầu)**: `vcs_drawing_overview` → `vcs_takeoff` (`hvac`, `ctn`, `pccc`, `tray`, `wire`, `block`, `dynblock`...) → `vcs_get_table` → `vcs_export_excel`.
