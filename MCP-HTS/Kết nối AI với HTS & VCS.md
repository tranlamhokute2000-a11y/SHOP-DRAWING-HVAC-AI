HTS Software · Hướng dẫn cho người dùng

# Kết nối AI với HTS & VCS

Cho trợ lý AI trên máy (Claude, Cursor, Copilot…) đọc bản vẽ, vẽ ống, rải phụ kiện, soát lỗi và bóc khối lượng ngay trên AutoCAD bạn đang mở, qua giao thức MCP.

**214 công cụ**HTS: thiết kế & triển khai MEP · cổng 5088

**11 công cụ**VCS: bóc khối lượng · cổng 5077

**Node.js 18+**chạy cầu nối giữa ứng dụng AI và AutoCAD

[Cách hoạt động](#cach-hoat-dong)[Chuẩn bị](#chuan-bi)[Cài đặt](#cai-dat) [Cấu hình theo ứng dụng](#ung-dung)[Kiểm tra](#kiem-tra)[Dùng thử](#dung-thu) [An toàn](#an-toan)[Xử lý sự cố](#su-co)[Danh mục công cụ](#cong-cu)[Phụ lục](#phu-luc)

## Cách hoạt động

**Ứng dụng AI**Claude Desktop, Claude Code, Cursor, VS Code, Gemini CLI, LM Studio…

MCP\
stdio

**Cầu nối Node**`hts-mcp-bridge.js` và `vcs-mcp-bridge.js`, cài sẵn trong `C:\Users\Public\HTS-MCP`

HTTP\
localhost

**AutoCAD**HTS mở cổng 5088, VCS mở cổng 5077, sau khi bạn đăng nhập bản quyền

Mọi thứ chạy trên máy của bạn. Bản vẽ không được gửi lên máy chủ nào của HTS; ứng dụng AI chỉ nhận những gì công cụ trả về (số liệu, danh sách đối tượng, kết quả vẽ).

## Chuẩn bị

- AutoCAD 2017–2027 đã cài HTS / VCS (bộ cài HTools).
- Tài khoản có bản quyền: **HTS** cho các công cụ thiết kế, **VCS** cho các công cụ bóc khối lượng. Có bản quyền nào thì dùng được công cụ của sản phẩm đó.
- Node.js bản LTS (18 trở lên) tải ở [nodejs.org](https://nodejs.org/). Cài xong, mở PowerShell gõ `node --version` phải ra `v18` trở lên.
- Một ứng dụng AI hỗ trợ máy chủ MCP chạy trên máy (kiểu stdio). Danh sách ở mục [Cấu hình theo ứng dụng](#ung-dung).

## Cài đặt

1. ### Giải nén bộ hướng dẫn

   Giải nén `HTS-VCS-MCP.zip` ra một thư mục bất kỳ, ví dụ Desktop.
2. ### Chạy `CaiDat-MCP.bat`

   Bấm đúp tệp này. Script sẽ:
   - kiểm tra Node.js;
   - chép 2 cầu nối vào `C:\Users\Public\HTS-MCP` (không cần quyền quản trị);
   - thêm máy chủ `hts-autocad` và `vcs-boq` vào cấu hình **Claude Desktop** và **Cursor** nếu máy có cài (tệp cũ được sao lưu thành `.bak-…` trước khi sửa);
   - in sẵn đoạn cấu hình cho các ứng dụng khác.
3. ### Khởi động lại ứng dụng AI

   Thoát hẳn ứng dụng (với Claude Desktop: thoát cả biểu tượng ở khay hệ thống) rồi mở lại để nó nạp máy chủ mới.
4. ### Mở AutoCAD và đăng nhập

   Gõ lệnh `HTS` và đăng nhập để bật công cụ HTS; gõ `VCS` và đăng nhập để bật công cụ VCS. Mở sẵn bản vẽ cần làm.

Mở AutoCAD trước hay sau ứng dụng AI đều được. Cầu nối dò AutoCAD mỗi 4 giây và báo ứng dụng AI nạp lại danh sách công cụ khi AutoCAD bật lên hoặc tắt đi.

## Cấu hình theo ứng dụng

Mọi ứng dụng đều dùng cùng thông số: lệnh `node`, tham số là đường dẫn cầu nối. Trong JSON, dấu `\` phải viết đôi `\\`. Chỉ dùng một trong hai sản phẩm thì bỏ khối của sản phẩm còn lại.

Tự cấu hình khi chạy `CaiDat-MCP.bat`. Làm tay: trong Claude Desktop mở **Settings → Developer → Edit Config**, dán khối dưới vào tệp `claude_desktop_config.json` (giữ các máy chủ khác nếu có), lưu, rồi thoát hẳn Claude (cả biểu tượng ở khay hệ thống) và mở lại.

claude_desktop_config.json

```
{
  "mcpServers": {
    "hts-autocad": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\hts-mcp-bridge.js"]
    },
    "vcs-boq": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\vcs-mcp-bridge.js"]
    }
  }
}
```

Chạy 3 lệnh dưới trong PowerShell hoặc cmd. `claude mcp list` phải báo cả hai máy chủ **Connected** khi AutoCAD đang mở và đã đăng nhập.

PowerShell / cmd

```
claude mcp add --scope user hts-autocad -- node "C:\Users\Public\HTS-MCP\hts-mcp-bridge.js"
claude mcp add --scope user vcs-boq -- node "C:\Users\Public\HTS-MCP\vcs-mcp-bridge.js"
claude mcp list
```

Tự cấu hình khi chạy `CaiDat-MCP.bat` nếu máy đã cài Cursor. Làm tay: **Settings → MCP → Add new global MCP server**, dán khối dưới vào `%USERPROFILE%\.cursor\mcp.json`.

mcp.json

```
{
  "mcpServers": {
    "hts-autocad": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\hts-mcp-bridge.js"]
    },
    "vcs-boq": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\vcs-mcp-bridge.js"]
    }
  }
}
```

Gõ lệnh **MCP: Open User Configuration** trong Command Palette, dán khối dưới, rồi dùng Copilot Chat ở chế độ **Agent**. VS Code giới hạn 128 công cụ cho một lượt hỏi: bấm biểu tượng công cụ trong ô chat và chỉ bật những nhóm cần dùng.

mcp.json (VS Code)

```
{
  "servers": {
    "hts-autocad": {
      "type": "stdio",
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\hts-mcp-bridge.js"]
    },
    "vcs-boq": {
      "type": "stdio",
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\vcs-mcp-bridge.js"]
    }
  }
}
```

Mở **Settings → Cascade → MCP Servers → View raw config**, dán khối dưới vào `%USERPROFILE%\.codeium\windsurf\mcp_config.json`.

mcp_config.json

```
{
  "mcpServers": {
    "hts-autocad": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\hts-mcp-bridge.js"]
    },
    "vcs-boq": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\vcs-mcp-bridge.js"]
    }
  }
}
```

Dán khối dưới vào `%USERPROFILE%\.gemini\settings.json` (gộp với nội dung có sẵn), rồi mở lại Gemini CLI và gõ `/mcp` để kiểm.

settings.json

```
{
  "mcpServers": {
    "hts-autocad": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\hts-mcp-bridge.js"]
    },
    "vcs-boq": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\vcs-mcp-bridge.js"]
    }
  }
}
```

Tab **Program → Install → Edit mcp.json**, dán khối dưới. Mô hình chạy trên máy nhỏ dễ chọn nhầm khi có hơn 200 công cụ: nên dùng mô hình lớn hoặc chỉ bật máy chủ cần dùng.

mcp.json (LM Studio)

```
{
  "mcpServers": {
    "hts-autocad": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\hts-mcp-bridge.js"]
    },
    "vcs-boq": {
      "command": "node",
      "args": ["C:\\Users\\Public\\HTS-MCP\\vcs-mcp-bridge.js"]
    }
  }
}
```

**ChatGPT** hiện chỉ kết nối được máy chủ MCP chạy trên Internet (địa chỉ HTTPS), nên chưa dùng được với cầu nối chạy trên máy này.

## Kiểm tra kết nối

Bấm đúp `KiemTra-KetNoi.bat`, hoặc gõ trong PowerShell khi AutoCAD đang mở và đã đăng nhập:

PowerShell

```
curl.exe http://localhost:5088/mcp/health
```

Kết quả mong đợi

```
{"status":"ok","server":"HTS-MCP-AutoCAD","version":"2.0","licensed":true,"toolCount":214}
```

PowerShell

```
curl.exe http://localhost:5077/mcp/health
```

Trong ứng dụng AI, danh sách công cụ của `hts-autocad` phải có đủ khoảng 214 mục. Nếu chỉ thấy một công cụ `hts_status` (hoặc `vcs_status`), cầu nối đã chạy nhưng chưa thấy AutoCAD: hỏi AI "gọi hts_status" để xem lý do.

## Dùng thử

Gõ yêu cầu bằng tiếng Việt như nói với đồng nghiệp. Vài câu mẫu:

### HTS

- "Bản vẽ đang mở có những layer nào? Tổng chiều dài ống theo từng cỡ là bao nhiêu?"
- "Soát mạng ống cấp thoát nước, liệt kê cổng hở và ống trùng, rồi zoom tới lỗi đầu tiên."
- "Vẽ ống cấp nước uPVC D90 từ (0,0) qua (5000,0) đến (5000,3000), tự đặt cút."
- "Tra thư viện HTS van cổng DN100 rồi chèn tại (12000, 4500)."
- "Đổi toàn bộ chữ D110 thành Ø110 trên bản vẽ."
- "Với mọi tệp DWG trong thư mục D:\\DuAn\\MEP: purge rồi thống kê layer, lưu bản mới."

### VCS

- "Bóc khối lượng ống gió bản vẽ này, cho tôi tổng m² tôn theo độ dày."
- "Bóc cấp thoát nước, PCCC và thang máng cáp, rồi xuất tất cả ra một tệp Excel."
- "Trong bảng chi tiết cấp thoát nước, loại các đoạn ống ngắn hơn 50 mm rồi tính lại."

Mô hình càng mạnh càng chọn đúng công cụ. Với hơn 200 công cụ, nên dùng Claude Sonnet / Opus hoặc mô hình tương đương. Mô hình nhỏ chạy trên máy dễ gọi nhầm.

## An toàn khi dùng

- Máy chủ HTS / VCS chỉ nhận kết nối từ chính máy tính đó (localhost). Máy khác trong mạng không gọi được.
- Công cụ chỉ chạy khi phiên bản quyền còn hiệu lực. Hết hạn hoặc bị thu hồi thì mọi lời gọi bị từ chối (`NOT_LICENSED`).
- Công cụ Ghi sửa bản vẽ, Xoá xoá đối tượng. Hãy để ứng dụng AI hỏi trước khi chạy, và đừng chọn "luôn cho phép" với công cụ Xoá.
- Lưu bản vẽ trước khi giao việc lớn cho AI. Mỗi lần gọi công cụ là một bước, hoàn tác bằng `Ctrl+Z` / `UNDO`.
- Chạy lô nhiều tệp (`batch_process_drawings`) mặc định lưu bản mới sang thư mục riêng. Chỉ khi bạn yêu cầu rõ mới ghi đè tệp gốc.
- Khi AutoCAD mở và đã đăng nhập, mọi chương trình trên máy đều gọi được cổng 5088 / 5077. Chỉ cài phần mềm tin cậy.

## Xử lý sự cố

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
| --- | --- | --- |
| Chỉ thấy công cụ `hts_status` / `vcs_status` | AutoCAD chưa mở, hoặc chưa gõ HTS / VCS và đăng nhập | Mở AutoCAD, đăng nhập, đợi vài giây rồi hỏi lại. Vẫn kẹt thì khởi động lại ứng dụng AI. |
| Báo `NOT_LICENSED` | Phiên bản quyền hết hạn hoặc bị đăng xuất | Gõ lại lệnh HTS / VCS trong AutoCAD và đăng nhập. |
| Ứng dụng AI báo "Failed to connect" / máy chủ không chạy | Chưa cài Node.js, hoặc sai đường dẫn cầu nối | Gõ `node --version`. Chạy lại `CaiDat-MCP.bat`. Kiểm tra tệp có trong `C:\Users\Public\HTS-MCP`. |
| `curl.exe …/health` báo không kết nối được | Chưa đăng nhập, hoặc cổng 5088 / 5077 bị chương trình khác chiếm | Đăng nhập lại; gõ `netstat -ano \| findstr 5088` xem chương trình nào đang giữ cổng. |
| Công cụ báo "Không có document" | AutoCAD chưa mở bản vẽ nào | New hoặc Open một tệp .dwg. |
| AI nói đã chạy nhưng bản vẽ chưa đổi | Chức năng giao diện (`ui_feature_run`) đang chờ bạn trả lời câu hỏi trên dòng lệnh AutoCAD | Nhìn dòng lệnh AutoCAD và trả lời, hoặc bấm Esc rồi bảo AI làm lại. |
| VS Code báo quá nhiều công cụ | Một lượt hỏi tối đa 128 công cụ | Bấm biểu tượng công cụ trong ô chat, tắt bớt các nhóm không dùng. |

## Danh mục công cụ

Đây là toàn bộ công cụ AI thấy được. Bạn không cần nhớ tên, chỉ cần mô tả việc muốn làm. Bảng giúp bạn biết AI có thể làm những gì và công cụ nào sẽ sửa bản vẽ.

Đọc chỉ đọc, đo, tính (83) Ghi vẽ hoặc sửa bản vẽ (119) Xoá xoá đối tượng / dữ liệu (8) Tương tác chờ bạn chọn trên AutoCAD (4)

Lọc công cụ

·

### HTS · máy chủ `hts-autocad`

#### Khám phá 7

AI nên gọi trước để biết bản vẽ có gì.

| `get_layer_list` | Danh sách layer của bản vẽ. | Đọc |
| --- | --- | --- |
| `get_mline_styles` | Danh sách kiểu Mline (MlineStyle). | Đọc |
| `get_block_list` | Danh sách tên block đang định nghĩa trong bản vẽ. | Đọc |
| `get_current_settings` | Cài đặt hiện tại: layer hiện hành, tỉ lệ và kiểu Mline, chế độ bắt điểm. | Đọc |
| `get_layer_info` | Thông tin chi tiết một layer: màu, nét, độ dày nét, khoá / đóng băng / tắt / in. | Đọc |
| `get_drawing_info` | Thông tin bản vẽ đang mở: tên tệp, đơn vị, số layer, số block, phạm vi Model Space. | Đọc |
| `list_block_definitions` | Liệt kê block: số lần dùng, có attribute không, có phải block động không. | Đọc |

#### Chọn & đọc 16

Lấy đối tượng theo layer, loại, vùng; đọc dữ liệu gắn trên đối tượng.

| `get_entities_in_area` | Liệt kê đối tượng trong một vùng chữ nhật: loại, layer, handle, toạ độ. | Đọc |
| --- | --- | --- |
| `select_and_export` | Kỹ sư quét chọn đối tượng trên AutoCAD; HTS ghi chi tiết ra tệp để AI phân tích. | Tương tác |
| `read_exported_data` | Đọc dữ liệu vừa xuất bằng select_and_export. | Đọc |
| `filter_exported_data` | Lọc và tổng hợp dữ liệu đã xuất theo loại, layer, thuộc tính. | Đọc |
| `open_query_tools` | Mở cửa sổ Thống kê & bóc tách khối lượng của HTS trên AutoCAD. | Tương tác |
| `pick_points` | Kỹ sư bấm chọn điểm trên AutoCAD (Enter để xong); AI nhận toạ độ X, Y, Z. | Tương tác |
| `select_by_layer` | Lấy handle mọi đối tượng trên một layer. | Đọc |
| `select_by_type` | Lấy handle đối tượng theo loại (LINE, LWPOLYLINE, INSERT, MLINE, MTEXT…). | Đọc |
| `select_by_block_name` | Lấy handle các block theo tên (nhận cả block động). | Đọc |
| `select_in_window` | Lấy đối tượng nằm trọn trong cửa sổ chữ nhật. | Đọc |
| `select_crossing_window` | Lấy đối tượng cắt qua hoặc nằm trong cửa sổ chữ nhật (như Crossing). | Đọc |
| `select_by_color` | Lấy đối tượng theo màu ACI gán trực tiếp. | Đọc |
| `get_curve_endpoints` | Toạ độ điểm đầu và điểm cuối của một đường. | Đọc |
| `get_dynamic_block_properties` | Đọc thuộc tính động của block: tên, giá trị, giá trị cho phép. | Đọc |
| `get_xdata` | Đọc dữ liệu mở rộng (XData) của đối tượng theo tên ứng dụng. | Đọc |
| `get_block_attributes` | Đọc attribute của block: tag, giá trị, vị trí. | Đọc |

#### Đo & thống kê 12

Đo, đếm, cộng chiều dài và diện tích phục vụ bóc khối lượng.

| `measure_distance` | Đo khoảng cách giữa 2 điểm trên bản vẽ. | Đọc |
| --- | --- | --- |
| `get_entity_area` | Diện tích và chu vi của Hatch, Polyline kín, đường tròn… | Đọc |
| `get_curve_length` | Tổng chiều dài các đường (Line, Polyline, Arc, Spline, Mline). | Đọc |
| `get_bounding_box` | Khung bao (điểm min / max, dài × rộng × cao) của các đối tượng. | Đọc |
| `count_block_instances` | Đếm số block trên bản vẽ, có thể lọc theo layer. | Đọc |
| `calculate_total_length_by_layer` | Tổng chiều dài các đường trên một layer, dùng cho bóc khối lượng. | Đọc |
| `combined_bounding_box` | Khung bao chung của nhiều đối tượng, kèm diện tích khung. | Đọc |
| `count_entities_by_filter` | Đếm đối tượng theo layer, loại hoặc tên block. | Đọc |
| `group_summary_by_layer` | Thống kê từng layer: số đối tượng, tổng chiều dài, tổng diện tích. | Đọc |
| `calculate_center_of_gravity` | Trọng tâm của Region, Polyline kín, đường tròn. | Đọc |
| `count_blocks_along_curve` | Đếm block nằm dọc một tuyến, ví dụ phụ kiện trên một đường ống. | Đọc |
| `sum_curve_length_by_filter` | Tổng chiều dài các đường theo layer kết hợp loại đối tượng. | Đọc |

#### Tính toán 20

Phép tính hình học và công thức kỹ thuật, không cần đối tượng trên bản vẽ.

| `point_distance` | Khoảng cách giữa 2 toạ độ (không cần đối tượng). | Đọc |
| --- | --- | --- |
| `midpoint_xy` | Trung điểm của 2 toạ độ. | Đọc |
| `angle_at_vertex` | Góc tại đỉnh tạo bởi 3 điểm (0–180°). | Đọc |
| `polygon_area_xy` | Diện tích đa giác từ danh sách toạ độ. | Đọc |
| `polygon_perimeter_xy` | Chu vi đa giác từ danh sách toạ độ. | Đọc |
| `divide_curve_equal` | Chia đều một đường thành N đoạn, trả toạ độ các điểm chia (không vẽ thêm). | Đọc |
| `closest_point_on_curve` | Điểm trên đường gần một điểm cho trước nhất, kèm khoảng cách. | Đọc |
| `intersect_entities` | Giao điểm giữa 2 đối tượng. | Đọc |
| `convert_units` | Đổi đơn vị đo: mm, cm, m, inch, foot, yard. | Đọc |
| `transform_wcs_ucs` | Đổi toạ độ qua lại giữa WCS và UCS hiện hành. | Đọc |
| `scale_coordinates` | Toạ độ mới của một điểm sau khi scale quanh điểm gốc. | Đọc |
| `get_curve_intersections` | Giao điểm giữa 2 đường (Line, Polyline, Arc, Circle, Ellipse). | Đọc |
| `round_to_nearest_in_list` | Làm tròn về giá trị gần nhất trong danh sách, ví dụ chọn cỡ ống chuẩn. | Đọc |
| `linear_interpolate` | Nội suy tuyến tính từ một bảng tra (x, y). | Đọc |
| `evaluate_math_expression` | Tính biểu thức số học (+ − × ÷ %, ngoặc). | Đọc |
| `circle_area_from_diameter` | Diện tích tiết diện tròn từ đường kính. | Đọc |
| `flow_velocity` | Vận tốc dòng chảy V = Q / A. | Đọc |
| `pipe_diameter_from_flow` | Đường kính ống cần thiết từ lưu lượng và vận tốc cho phép. | Đọc |
| `voltage_drop` | Sụt áp trên cáp, 1 pha hoặc 3 pha. | Đọc |
| `lighting_count` | Số đèn cần theo phương pháp quang thông (độ rọi, diện tích, quang thông đèn). | Đọc |

#### Vẽ cơ bản 15

| `draw_line` | Vẽ một Line từ điểm đầu đến điểm cuối. | Ghi |
| --- | --- | --- |
| `draw_polyline` | Vẽ Polyline qua nhiều điểm. | Ghi |
| `insert_block` | Chèn block (đã có trong bản vẽ hoặc trong đường dẫn hỗ trợ) tại toạ độ chỉ định. | Ghi |
| `draw_circle` | Vẽ đường tròn theo tâm và bán kính. | Ghi |
| `draw_ellipse` | Vẽ Ellipse theo tâm, trục lớn và tỉ số trục. | Ghi |
| `draw_rectangle` | Vẽ hình chữ nhật (Polyline kín) theo 2 góc đối diện. | Ghi |
| `draw_point` | Tạo điểm (POINT) tại toạ độ chỉ định. | Ghi |
| `batch_draw_lines` | Vẽ nhiều Line trong một lần gọi. | Ghi |
| `batch_draw_polylines` | Vẽ nhiều Polyline trong một lần gọi. | Ghi |
| `batch_insert_blocks` | Chèn nhiều block trong một lần gọi. | Ghi |
| `draw_spline` | Vẽ đường cong Spline qua các điểm. | Ghi |
| `draw_arc` | Vẽ cung tròn theo tâm – bán kính – góc, hoặc qua 3 điểm. | Ghi |
| `draw_hatch` | Tô hatch (SOLID, ANSI31…) trong Polyline kín hoặc vùng điểm. | Ghi |
| `draw_text` | Viết chữ một dòng (Text). | Ghi |
| `draw_mtext` | Viết chữ nhiều dòng (MText). | Ghi |

#### Hiệu chỉnh 16

| `batch_erase_entities` | Xoá nhiều đối tượng theo danh sách handle. | Xoá |
| --- | --- | --- |
| `erase_entity` | Xoá một đối tượng theo handle. | Xoá |
| `move_entity` | Di chuyển đối tượng theo vector (dx, dy). | Ghi |
| `set_layer` | Đặt layer hiện hành (tạo mới nếu chưa có). | Ghi |
| `copy_entity` | Sao chép đối tượng sang vị trí mới. | Ghi |
| `rotate_entity` | Xoay đối tượng quanh điểm gốc. | Ghi |
| `scale_entity` | Phóng to / thu nhỏ đối tượng quanh điểm gốc. | Ghi |
| `mirror_entity` | Lấy đối xứng qua trục 2 điểm (giữ hoặc xoá bản gốc). | Ghi |
| `offset_curve` | Offset một đường theo khoảng cách. | Ghi |
| `array_rectangular` | Sao chép theo lưới hàng × cột. | Ghi |
| `array_polar` | Sao chép xoay đều quanh một tâm. | Ghi |
| `explode_entity` | Phá block / polyline / hatch / kích thước thành đối tượng con; bản gốc bị xoá. | Xoá |
| `join_polylines` | Gộp các Line / Polyline / Arc nối tiếp thành một Polyline. | Ghi |
| `set_entity_properties` | Đổi màu, layer, kiểu nét, độ dày nét của đối tượng. | Ghi |
| `align_entities` | Căn nhiều đối tượng thẳng hàng theo X hoặc Y. | Ghi |
| `set_xdata` | Ghi dữ liệu mở rộng (XData) cho đối tượng. | Ghi |

#### Layer 8

| `create_layer` | Tạo hoặc cập nhật layer: màu, độ dày nét, in / không in, mô tả. | Ghi |
| --- | --- | --- |
| `set_layer_state` | Khoá, đóng băng hoặc tắt layer. | Ghi |
| `delete_layer` | Xoá layer; đối tượng trên layer được chuyển về layer 0 trước. | Xoá |
| `rename_layer` | Đổi tên layer. | Ghi |
| `isolate_layer` | Cô lập một layer (đóng băng các layer khác), như LAYISO. | Ghi |
| `thaw_all_layers` | Mở băng mọi layer, như LAYTHW. | Ghi |
| `purge_unused_layers` | Xoá các layer không còn đối tượng nào. | Xoá |
| `load_linetype` | Nạp kiểu nét (DASHED, CENTER, HIDDEN…). | Ghi |

#### Block 7

| `change_block_base_point` | Đổi điểm gốc của block, giữ nguyên vị trí hình trên bản vẽ. | Ghi |
| --- | --- | --- |
| `set_dynamic_block_property` | Đổi một thuộc tính động của block (Visibility, kích thước…). | Ghi |
| `replace_block_instances` | Thay mọi block tên A bằng block tên B, giữ vị trí, góc, tỉ lệ. | Xoá |
| `rename_block` | Đổi tên block (mọi bản chèn tự cập nhật). | Ghi |
| `purge_unused_blocks` | Xoá các block định nghĩa không còn bản chèn nào. | Xoá |
| `set_block_attribute` | Đổi giá trị một attribute của block. | Ghi |
| `set_all_block_attributes` | Đổi nhiều attribute của một block cùng lúc. | Ghi |

#### Chữ & ghi chú 22

| `draw_leader` | Vẽ đường chỉ dẫn (Leader) kèm chữ. | Ghi |
| --- | --- | --- |
| `draw_mleader` | Vẽ ghi chú MLeader (mũi tên + chữ). | Ghi |
| `set_text_content` | Đổi nội dung chữ. | Ghi |
| `set_text_height` | Đổi chiều cao chữ. | Ghi |
| `set_text_rotation` | Đổi góc xoay chữ. | Ghi |
| `find_replace_text` | Tìm và thay chữ trên toàn bản vẽ (hỗ trợ biểu thức chính quy). | Ghi |
| `extract_all_text` | Liệt kê mọi chữ: nội dung, layer, vị trí, chiều cao. | Đọc |
| `count_text_matches` | Đếm chữ khớp mẫu. | Đọc |
| `prepend_text` | Thêm tiền tố vào chữ. | Ghi |
| `append_text` | Thêm hậu tố vào chữ. | Ghi |
| `change_text_case` | Đổi chữ HOA / thường / Hoa Đầu Từ. | Ghi |
| `trim_text` | Cắt khoảng trắng thừa ở đầu, cuối chữ. | Ghi |
| `set_text_style` | Đổi kiểu chữ (TextStyle) cho một hoặc nhiều chữ. | Ghi |
| `find_text_by_regex` | Tìm chữ theo biểu thức chính quy. | Đọc |
| `extract_numbers_from_text` | Tách các con số trong nội dung chữ. | Đọc |
| `find_duplicate_text` | Tìm chữ trùng nội dung (có thể giới hạn theo khoảng cách). | Đọc |
| `find_empty_text` | Tìm chữ rỗng hoặc chỉ có khoảng trắng. | Đọc |
| `get_mleader_text` | Đọc nội dung MLeader. | Đọc |
| `set_mleader_text` | Đổi nội dung MLeader. | Ghi |
| `set_mleader_style` | Đổi kiểu MLeader. | Ghi |
| `find_mleaders_by_text` | Tìm MLeader theo nội dung. | Đọc |
| `find_replace_mleader_text` | Tìm và thay nội dung trong mọi MLeader. | Ghi |

#### Kích thước 7

| `draw_aligned_dim` | Ghi kích thước thẳng (Aligned) giữa 2 điểm. | Ghi |
| --- | --- | --- |
| `draw_linear_dim` | Ghi kích thước ngang hoặc đứng (Linear). | Ghi |
| `draw_angular_dim` | Ghi kích thước góc qua 3 điểm. | Ghi |
| `draw_radius_dim` | Ghi kích thước bán kính cho cung / đường tròn. | Ghi |
| `dim_3d` | Ghi kích thước chiều cao các đoạn ống đứng trong mô hình 3D. | Ghi |
| `get_dimension_text` | Đọc giá trị đo và chữ hiển thị của kích thước. | Đọc |
| `set_dimension_text_override` | Ghi đè chữ hiển thị của kích thước. | Ghi |

#### Xem & bản vẽ 10

| `export_plan_image` | Xuất một vùng bản vẽ ra ảnh PNG kèm toạ độ để AI "nhìn" mặt bằng. | Đọc |
| --- | --- | --- |
| `map_image_cad` | Đổi toạ độ qua lại giữa ảnh đã xuất và bản vẽ. | Đọc |
| `zoom_extents` | Zoom toàn bộ bản vẽ. | Đọc |
| `zoom_to_window` | Zoom tới một cửa sổ chữ nhật. | Đọc |
| `zoom_to_entity` | Zoom tới một đối tượng. | Đọc |
| `pan_to_point` | Dời khung nhìn để một điểm nằm giữa màn hình. | Đọc |
| `regen_view` | Tính lại hiển thị (REGEN). | Đọc |
| `save_drawing` | Lưu bản vẽ (như Ctrl+S). | Ghi |
| `purge_all` | PURGE toàn bộ: block, layer, kiểu nét, kiểu chữ… không dùng. | Xoá |
| `set_drawing_units` | Đổi đơn vị chèn của bản vẽ (mm, m, inch…). | Ghi |

#### Ống nước 14

Vẽ ống Mline, rải phụ kiện, cộng chiều dài theo cỡ.

| `draw_mline` | Vẽ một đoạn ống (Mline) giữa 2 điểm; tỉ lệ = đường kính ống (110 = D110). | Ghi |
| --- | --- | --- |
| `batch_draw_mlines` | Vẽ nhiều đoạn ống Mline trong một lần gọi. | Ghi |
| `draw_pipe_system` | Vẽ hệ ống nước qua nhiều điểm, tự cắt giao và đặt cút, tê, thập, côn. | Ghi |
| `draw_hdpe_pipe_system` | Vẽ hệ ống HDPE qua nhiều điểm, tự cắt giao và đặt phụ kiện. | Ghi |
| `auto_place_pipe_fittings` | Quét lại ống Mline có sẵn, cắt giao và rải phụ kiện tự động (uPVC, PPR, HDPE…). | Ghi |
| `set_pipe_elevation_z` | Gán cao độ Z cho ống / block để dựng 3D. | Ghi |
| `build_3d_pipe_system` | Dựng mô hình 3D đơn giản từ ống 2D đã có cao độ. | Ghi |
| `ctn_design_to_shop` | TKtoShop: chuyển bản thiết kế (Line + chữ cỡ ống) sang bản shop (ống Mline + phụ kiện). | Ghi |
| `convert_lines_to_mline` | Gộp cụm 3 nét song song (tim + 2 biên) thành một ống Mline. | Ghi |
| `change_mline_style` | Đổi kiểu và / hoặc tỉ lệ (cỡ) của ống Mline. | Ghi |
| `text_to_mline` | Chuyển Polyline thành ống Mline với cỡ đọc từ chữ gần đó (D110, Ø50…). | Ghi |
| `sum_mline_length_by_scale` | Tổng chiều dài ống theo cỡ (D110: … m, D90: … m). | Đọc |
| `compute_pipe_volume_by_layer` | Thể tích nước trong ống theo từng layer (m³). | Đọc |
| `find_unconnected_curve_ends` | Tìm đầu ống / đường còn hở (tuyến chưa nối). | Đọc |

#### Đồng bộ cao độ & 3D 7

Chuỗi cấp thoát nước: quét → chuyển nét → cao độ → 3D.

| `ctn_scan_drawing` | Gọi đầu tiên khi đồng bộ cao độ / dựng 3D cấp thoát nước: nhận dạng bản vẽ, layer, block, chữ cao độ (chỉ đọc). | Đọc |
| --- | --- | --- |
| `ctn_convert_to_hts` | Chuyển Line / Polyline thành ống HTS theo bảng layer → hệ / cỡ ống đã duyệt. | Ghi |
| `ctn_elevation_preview` | Xem trước kết quả đồng bộ cao độ ống (chưa ghi vào bản vẽ). | Đọc |
| `ctn_elevation_apply` | Ghi cao độ cho ống theo đúng quy tắc đã xem trước. | Ghi |
| `ctn_build_3d` | Dựng 3D cấp thoát nước: tuyến 3D, ống khối, phụ kiện, đặt cạnh mặt bằng. | Ghi |
| `ctn_normalize_spec` | Chuẩn hoá bản vẽ vẽ bằng Mline / block khác thành ống + phụ kiện HTS theo hồ sơ Spec. | Ghi |
| `ctn_revit_to_hts` | Chuẩn hoá 2D bản thoát nước xuất từ Revit sang chuẩn HTS, một lần cho mọi hệ. | Ghi |

#### PCCC 3

| `draw_fire_pipe_system` | Vẽ hệ ống PCCC qua nhiều điểm, tự đặt phụ kiện. | Ghi |
| --- | --- | --- |
| `pccc_draw_pipes` | Vẽ ống PCCC theo tuyến bằng đúng bộ máy lệnh vẽ tay: cút, tê, tê thu, côn, măng sông. | Ghi |
| `place_pccc_supports` | Rải giá đỡ PCCC trên ống chữa cháy theo DN. | Ghi |

#### Mạng ống & tự soát 3

Kiểm lỗi mạng ống trước khi xuất bản vẽ.

| `mep_model_summary` | Tóm tắt mạng ống MEP theo hệ: số ống, tổng dài theo layer / cỡ, số phụ kiện. | Đọc |
| --- | --- | --- |
| `mep_check` | Tự soát mạng ống: cổng phụ kiện hở, ống trùng, ống vụn, phụ kiện lệch cỡ… | Đọc |
| `mep_check_devices` | Soát thiết bị có cổng nối (bơm, bình, van…) xem đã nối ống chưa. | Ghi |

#### Ống gió HVAC 6

| `draw_rectangular_duct` | Vẽ ống gió chữ nhật qua nhiều điểm, tự chia đoạn và đặt cút ở góc. | Ghi |
| --- | --- | --- |
| `draw_round_duct` | Vẽ ống gió tròn qua nhiều điểm. | Ghi |
| `duct_set_elevation` | Gán cao độ đáy cho ống gió và phụ kiện ống gió. | Ghi |
| `duct_breeches_insert` | Chèn chạc quần ống gió (Y chia đôi, vuông hoặc tròn). | Ghi |
| `place_duct_elbow` | Chèn cút vào tuyến ống gió đã vẽ. | Ghi |
| `compute_duct_surface_area` | Tổng diện tích tôn ống gió chữ nhật (m²). | Đọc |

#### Điện 16

| `tray_set_elevation` | Gán cao độ đáy cho thang / máng / trunking cáp. | Ghi |
| --- | --- | --- |
| `electric_power_conduit_adjust` | Điều chỉnh ống cấp nguồn: dời đoạn tuyến chính, nhánh tự co giãn theo. | Ghi |
| `auto_wire_lighting_direct` | Tự luồn dây L + N từ tủ điện đến đèn (không qua công tắc). | Ghi |
| `auto_wire_lighting_circuit` | Tự luồn đủ dây L, N, K, D qua công tắc theo lộ chiếu sáng. | Ghi |
| `draw_cable_tray` | Vẽ máng / thang cáp hệ V1 (block động) qua nhiều điểm. | Ghi |
| `setup_lighting_circuits` | Gán dữ liệu lộ chiếu sáng cho tủ điện, công tắc, đèn. | Ghi |
| `normalize_socket_blocks` | Chuẩn hoá block ổ cắm (thêm điểm đấu nối chuẩn). | Ghi |
| `boq_export_cable` | Bóc khối lượng cáp điện từ tuyến cáp + tủ điện, gồm cả đoạn lên / xuống. | Ghi |
| `auto_dim_cable_tray` | Ghi kích thước chiều dài từng đoạn máng / thang. | Ghi |
| `draw_cable_tray_v2` | Vẽ tuyến máng / thang / trunking cáp hệ V2 (block theo kích thước). | Ghi |
| `resize_cable_tray_v2` | Đổi kích thước máng / thang / trunking cáp hệ V2. | Ghi |
| `boq_cable_tray` | Bóc khối lượng thang / máng / trunking theo loại và W × H. | Ghi |
| `set_panel_xdata` | Gán dữ liệu tủ điện (tên, cao độ, đoạn chờ) để bóc cáp. | Ghi |
| `add_ground_wire_to_dims` | Thêm hậu tố dây tiếp địa ({N}E) vào kích thước ghi số dây. | Ghi |
| `auto_place_tray_fittings` | Tự thêm phụ kiện máng / thang: cút 90 / 45, côn, tê, thập, nối. | Ghi |
| `extract_cable_schedule` | Lập bảng cáp từ các tuyến có dữ liệu cáp (tiết diện, chiều dài). | Đọc |

#### Giá đỡ 3

| `place_supports` | Rải giá đỡ dọc máng / thang / trunking cáp hoặc ống gió. | Ghi |
| --- | --- | --- |
| `dim_supports` | Ghi chuỗi kích thước giữa các giá đỡ thẳng hàng. | Ghi |
| `place_drop_hangers` | Rải quang treo / hanger / kẹp đều dọc tuyến. | Ghi |

#### Cao độ theo hệ 1

| `block_set_elevation_system` | Gán cao độ cho block bất kỳ và ghi block vào hệ (cấp thoát nước, PCCC, HVAC, điện). | Ghi |
| --- | --- | --- |

#### Combine & kết cấu 4

| `mep_build_3d_all` | COMBINE 3D toàn hệ trong một lần: cấp thoát nước, PCCC, ống gió, thang máng, cáp, ống điện. | Ghi |
| --- | --- | --- |
| `ceiling_zone_set` | Gán chiều cao trần (trần thô, trần giả, đáy sàn) cho vùng phòng. | Ghi |
| `struct_draw_beam` | Vẽ dầm kết cấu: tim dầm, kích thước, cao độ. | Ghi |
| `struct_draw_wall` | Vẽ tường: 2 nét song song bo kín hai đầu. | Ghi |

#### Mặt cắt 2

| `section_draw` | Vẽ mặt cắt đứng (thang máng, cấp thoát nước, PCCC, mặt cắt combine). | Ghi |
| --- | --- | --- |
| `electric_wall_section` | Vẽ mặt cắt điện tường với thiết bị trên mặt tường. | Ghi |

#### Đào đắp 1

| `ctn_trench_excavation` | Tính đào đắp ống ngầm: khối lượng đào, cát đệm, cát phủ, đắp, tấm đan. | Ghi |
| --- | --- | --- |

#### Danh mục bản vẽ 1

| `drawing_index_export_excel` | Xuất danh mục bản vẽ ra tệp Excel (.xlsx). | Ghi |
| --- | --- | --- |

#### Block 3D 3

| `block3d_inspect` | Đọc hình chiếu block để chuẩn bị dựng state 3D (gọi đầu tiên). | Đọc |
| --- | --- | --- |
| `block3d_preview` | Dựng thử khối 3D và trả số đo để soát (không đổi bản vẽ). | Đọc |
| `block3d_apply` | Ghi khối 3D vào block động: thêm state "3D" và điểm cổng nối. | Ghi |

#### Thư viện block HTS 2

| `library_catalog` | Tra cứu thư viện block HTS: phụ kiện, van, thiết bị theo bảng PCCC, thoát nước, cấp nước, HDPE… | Đọc |
| --- | --- | --- |
| `library_insert_block` | Chèn block thư viện HTS theo bảng + họ + cỡ tại một hoặc nhiều vị trí. | Ghi |

#### Trợ lý AI HTS 2

| `htsai_tools` | Liệt kê công cụ của Trợ lý AI HTS (thoát nước, cấp nước, chiếu sáng). | Đọc |
| --- | --- | --- |
| `htsai_run` | Chạy một công cụ Trợ lý AI HTS: triển khai thoát nước, cấp nước, rải đèn… | Ghi |

#### Chức năng giao diện & chạy lô 6

Chạy bất kỳ nút nào trên giao diện HTS và xử lý hàng loạt tệp DWG.

| `send_command` | Gửi một chuỗi lệnh AutoCAD tuỳ ý. Chỉ dùng khi không có công cụ riêng. | Ghi |
| --- | --- | --- |
| `ui_feature_list` | Danh mục mọi chức năng trên giao diện HTS (thẻ HTS.V2 + lệnh bảng V1), kèm id để chạy. | Đọc |
| `ui_feature_run` | Chạy một chức năng giao diện HTS theo id, đúng như bấm nút; câu hỏi chưa trả lời sẽ chờ kỹ sư trên AutoCAD. | Tương tác |
| `batch_process` | Chạy nhiều bước công cụ liên tiếp trên bản vẽ đang mở trong một lần gọi (tối đa 60 bước). | Ghi |
| `batch_process_drawings` | Chạy cùng chuỗi bước cho cả loạt tệp DWG ở nền, không mở lên AutoCAD; mặc định lưu bản mới. | Ghi |
| `batch_process_status` | Xem tiến độ và kết quả từng tệp của việc chạy lô. | Đọc |

### VCS · máy chủ `vcs-boq`

#### Bóc khối lượng VCS 11

Mọi tool VCS chỉ đọc bản vẽ; "Ghi" ở đây là ghi dữ liệu bóc hoặc tệp Excel.

| `vcs_drawing_overview` | Tổng quan bản vẽ: số đối tượng theo loại, các block nhiều nhất kèm tên chuẩn hoá, layer. Giúp chọn tab bóc phù hợp. | Đọc |
| --- | --- | --- |
| `vcs_takeoff` | Bóc khối lượng một tab đúng cách tính của VCS (diễn giải chiều dài, m² tôn, quy đổi DN, làm tròn). Phạm vi: cả bản vẽ, một vùng, hoặc vùng đang chọn. | Đọc |
| `vcs_get_table` | Đọc một bảng của lần bóc gần nhất theo trang hoặc bộ lọc chữ. | Đọc |
| `vcs_zoom_to` | Zoom tới đối tượng của một dòng trong bảng chi tiết. | Đọc |
| `vcs_standard_names` | Tra tên chuẩn hoá tiếng Việt của tên block, và VCS đọc được gì từ tên đó. | Đọc |
| `vcs_library_audit` | Đối chiếu block thư viện HTS với danh mục tên chuẩn: tỉ lệ theo hệ, danh sách còn thiếu. | Đọc |
| `vcs_exclude` | Loại đối tượng rác khỏi dữ liệu bóc rồi tính lại bảng (không xoá bản vẽ); khôi phục khi cần. | Ghi |
| `vcs_export_excel` | Xuất các bảng đã bóc ra một tệp Excel, mỗi bảng một sheet. | Ghi |
| `vcs_feature_list` | Danh mục mọi nút / chức năng giao diện VCS, kèm id để chạy. | Đọc |
| `vcs_feature_run` | Chạy một chức năng giao diện VCS theo id, đúng như bấm nút. | Tương tác |
| `vcs_batch_process` | Chạy nhiều bước VCS liên tiếp trong một lần gọi (tối đa 40), ví dụ bóc đủ các tab rồi xuất Excel. | Ghi |

## Phụ lục: chức năng giao diện

Ngoài các công cụ trên, AI chạy được mọi nút trên giao diện qua `ui_feature_run` (HTS, 177 thẻ HTS.V2) và `vcs_feature_run` (VCS, 41 mục), đúng như khi bạn bấm. Chức năng nào cần chọn đối tượng thì AutoCAD sẽ chờ bạn chọn.

Cấp thoát nước 26 chức năng

##### Triển khai bản vẽ

- Vẽ đường ống Mline theo HT, kích thước, cao độ, loại ống đã chọn `water-draw`
- Vẽ ống thoát tự động Từ nét đơn thiết kế: tự vẽ ống + phụ kiện + cao độ `water-auto-drain`
- Vẽ ống cấp tự động Từ nét đơn thiết kế: tự vẽ ống cấp + phụ kiện + cao độ `water-auto-supply`
- Điều chỉnh tuyến ống (PED) Kéo ống, phụ kiện hoặc cụm; tự co giãn kết nối ngoài `water-edit`
- Chỉnh sửa tuyến ống Quét tuyến + mặt bằng: kéo thả, đổi cỡ ống trên mô phỏng; phụ kiện tự cập nhật `water-route-edit`
- Nối nhanh ống Nối 2 ống cách xa: cút · côn · Tê — lệnh tắt NO `water-connect`
- Quét thêm phụ kiện Tự động nhận diện và thêm phụ kiện `water-fitting`
- Rải quang treo Quét để thêm quang treo tự động `water-hanger`
- Rải giá đỡ Rải giá đỡ thép hình cho hệ ống `water-support`
- Đào đắp + tấm đan Hào ống chôn ngầm mọi loại ống (đào chung nhiều ống): bảng preview, taluy, khối lượng, tấm đan, 3D `water-trench`
- Insert block Chọn và chèn block phụ kiện `water-insert-block`
- Thiết bị vệ sinh Bồn cầu, lavabo, phễu thu, chậu, bồn tắm… 2D ⇄ 3D `water-sanitary`

##### 3D

- 3D cấp thoát nước Đặt bản sao Pline 3D theo Layer ống `water-build-3d`
- Quét mô hình 3D Dựng Solid ống + phụ kiện Visibility 3D `water-scan-3d`
- Xoay 3D → Block mặt bằng Xoay góc nhìn, gom mô hình thành Block `water-rotate-3d`
- Mặt cắt đứng 3 điểm: đường cắt + hướng/độ sâu nhìn `water-section-3d`
- HCAD trực tiếp Vẽ ống tới đâu, 3D hiện bên HCAD tới đó — bấm lần nữa để tắt `water-hcad-live`
- Soát thiết bị 3D Block thiết bị / block ngoài có POINT: vào 3D chưa, nối ống chưa, lý do — khoanh dấu `water-check-devices`

##### Setup cao độ

- Đánh độ dốc Tạo bản đồ độ dốc thoát nước `water-slope-map`
- Chèn cao độ Chèn text cao độ trên ống `water-level`
- Cài đặt cao độ Gán cao độ Z cho Mline/phụ kiện `water-elevation`
- 3D cấp nước — bản 01 Dựng mô hình một nét từ hình 2D đã gán cao độ (thay hình 2D) `water-3d-v1`

##### Ghi chú và ký hiệu

- Smart Tag Gắn nhãn thông tin ống `water-smart-tag`
- Ghi chú ống TEXT chạy dọc thân ống `water-note`
- Tag ống cấp thoát nước Tên hệ, cỡ ống, độ dốc, cao độ + mũi tên leader `water-tag`
- Điền tên block Tên chuẩn hóa cạnh block · thống kê, hoàn công `water-block-name`

Điện 44 chức năng

##### Điện chiếu sáng

- Auto đi ống Tự động vẽ ống điện chiếu sáng theo thiết bị `electric-conduit`
- Đi ống thủ công Đi tuyến ống điện theo điểm chọn `electric-conduit-manual`
- Rải box — khoét lỗ đáy Bố trí box theo thiết bị, khoét lỗ đáy `electric-box`
- Rải box — không khoét đáy Bố trí box theo thiết bị, không khoét đáy `electric-box-nocut`
- Auto Dim Tự động ghi kích thước `electric-auto-dim`
- Thêm dây E Thêm hậu tố E cho Dim đã chọn `electric-dim-e`
- Insert block Chọn và chèn block phụ kiện điện `electric-insert-block`
- Cấu hình thiết bị Gán Line / Lộ cho thiết bị `electric-device-config`
- Dim → Text Đổi DIM thành chữ + leader `electric-dim-text`
- View 3D Ống điện + thiết bị 3D, vai bò dầm `electric-light-view-3d`
- Quét mô hình 3D Xem HCAD + chốt góc đặt mô hình `electric-light-scan-3d`
- Thiết lập cao độ thiết bị Gán cao độ Z cho thiết bị / đường ống `electric-device-z`

##### Điện cấp nguồn

- Đi ống cấp nguồn Tự động vẽ ống cấp nguồn cho ổ cắm `electric-power-conduit`
- Điều chỉnh ống cấp nguồn Dời đoạn tuyến chính, ống nhánh tới ổ cắm chạy theo `electric-power-conduit-edit`
- Đi dây cấp nguồn ổ cắm Cấu hình lộ, chọn tủ + ổ cắm, vẽ dây L-N-E `electric-socket-wiring`
- View 3D Ống điện + thiết bị 3D, vai bò dầm `electric-view-3d`
- Quét mô hình 3D Xem HCAD + chốt góc đặt mô hình `electric-power-scan-3d`
- Dim 3D Dim ống + ký hiệu dây `electric-dim-3d`
- Mặt cắt điện tường Kẻ đường tường → quét ổ cắm / công tắc / tủ → mặt cắt + ống âm tường `electric-wall-section`

##### Kiểm tra - hiệu chỉnh

- Kiểm tra lộ Xem ID / lộ đã gán cho thiết bị `electric-check-circuit`
- Xóa ID Xóa ID đã gán cho thiết bị `electric-clear-id`
- Xóa lộ Xóa lộ đã gán cho thiết bị `electric-clear-circuit`

##### Thang máng cáp

- Vẽ máng cáp Máng cáp đục lỗ theo rộng / cao / cao độ đáy trên thanh `electric-tray-perf`
- Vẽ thang cáp Thang cáp theo rộng / cao / bước nan / cao độ đáy `electric-ladder`
- Trunking Máng cáp trơn theo rộng / cao / cao độ đáy `electric-trunking`
- Dim thang máng Ghi kích thước thang / máng cáp `electric-tray-dim`
- Quét thêm phụ kiện Tự thêm Elbow / Tee / Cross `electric-tray-auto`
- Điều chỉnh tuyến Dời cụm thang / máng — đoạn nối tự co giãn `electric-tray-route`
- Thay đổi kích thước Đổi W × H từng tuyến — phụ kiện hai đầu tự kéo theo `electric-tray-resize`
- 3D thang máng Theo cao độ + xem HCAD `electric-tray-3d`
- Mặt cắt đứng Thang máng + ống `electric-tray-section`
- Giá đỡ máng cáp Rải giá đỡ theo khoảng cách SETUP SPEC `electric-support-tray`
- Giá đỡ thang cáp Rải giá đỡ theo khoảng cách SETUP SPEC `electric-support-ladder`

##### Ghi chú và ký hiệu

- Tag thang máng cáp Tên, kích thước, cao độ + mũi tên leader `electric-tray-tag`
- Smart Tag Gắn nhãn thông tin đường dây điện `electric-smart-tag`

##### Đi dây trong thang/máng cáp

- Gán dữ liệu tủ điện Gán tên, cao độ, đầu chờ cho tủ điện `electric-panel-data`
- Kiểm tra dữ liệu tủ Hiển thị tên tủ điện đã gán `electric-panel-check`
- Xóa dữ liệu tủ Xóa XData khỏi block tủ điện `electric-panel-clear`
- Vẽ tuyến cáp Tự động đi dây cáp qua thang / máng `electric-cable-route`
- Vẽ cáp theo SĐNL Quét list Text tủ + cáp, sắp xếp X/Y, vẽ tự động `electric-cable-sld`
- Bóc khối lượng cáp Xuất bảng khối lượng cáp điện `electric-cable-boq`
- 3D tuyến cáp Trong máng → lên trần, vai bò dầm → xuống tủ `electric-cable-3d`
- Quét mô hình 3D Dựng Solid cáp + xem HCAD `electric-cable-scan-3d`
- Xoay 3D → Block mặt bằng Xoay góc nhìn bằng HCAD, gom thành Block `electric-cable-rotate-3d`

HVAC 31 chức năng

##### Vẽ đường ống

- Vẽ ống gió Auto vẽ ống gió vuông theo thông số trên thanh (TDC / Nẹp C) `hvac-duct`
- Vẽ ống gió tròn Auto vẽ ống gió tròn theo Ø trên thanh `hvac-round`
- Ống mềm cấp NMC1 Bịt tròn hai đầu `hvac-flex-supply`
- Ống mềm cấp NMC2 Đầu cuối cắt phẳng `hvac-flex-c2`
- Ống mềm cấp NMC3 Đầu đầu bo tròn kín `hvac-flex-c3`
- Ống mềm hồi NMH1 Bịt tròn hai đầu `hvac-flex-return`
- Ống mềm hồi NMH2 Đầu cuối cắt phẳng `hvac-flex-h2`
- Ống mềm hồi NMH3 Đầu đầu bo tròn kín `hvac-flex-h3`
- Chọn ống bịt đầu Chuyển ống thẳng thành đầu bịt `hvac-cap`
- Chạc quần ống gió (Y) Y chia đôi vuông / tròn — nhập thông số có xem trước `hvac-breeches`
- Vẽ ống đồng Định tuyến ống đồng + tự lấy bộ chia ga + auto-fillet `hvac-copper`
- Vẽ ống đồng theo Pline định hướng Pline mồi → ống + bộ chia ga tự động `hvac-ong-dong-moi`
- Vẽ ống nước ngưng theo Pline định hướng Nối Y, bẻ 45°, cỡ ống theo công suất `hvac-nuoc-ngung-moi`
- Điểm đấu nối ống đồng POINT COPPER cho block dàn lạnh ngoài HTS `hvac-diem-noi-dong`
- Điểm đấu nối ống nước ngưng POINT DP cho block dàn lạnh ngoài HTS `hvac-diem-noi-nuoc`
- Trích chi tiết Đường cắt + hướng nhìn → mặt chiếu cạnh ống gió `hvac-detail`

##### Vẽ tự động

- Chuyển ống gió Revit → CAD Bản Revit xuất DWG → ống + phụ kiện HTS `hvac-revit-convert`
- Quét để thêm phụ kiện Tự chèn cút / côn thu / chân rẽ vào chỗ ống chạm nhau `hvac-fitting-scan`
- Điều chỉnh tuyến ống gió Kéo tuyến, phụ kiện hoặc cụm; ống nối vào tự co giãn `hvac-edit`
- Thay đổi kích thước ống gió Quét tuyến, kéo dời tuyến và sửa W × H trên mô phỏng; phụ kiện tự theo `hvac-resize`
- Rải giá đỡ ống gió Quét chọn để rải giá đỡ ống gió tự động `hvac-support`
- Insert block Chèn van gió / khớp nối mềm HVAC `hvac-insert-block`
- 3D ống gió Dựng Solid ống gió + xem HCAD `hvac-build-3d`
- Xoay 3D → Block mặt bằng Xoay góc nhìn bằng HCAD, gom thành Block `hvac-rotate-3d`
- Viewport 3D Đặt khung nhìn 3D ống gió vào Layout `hvac-viewport-3d`

##### Tiêu âm & bảo ôn

- Tiêu âm ống gió Đoạn A–B dọc ống thẳng · chọn phụ kiện = cả phụ kiện `hvac-acoustic`
- Bảo ôn ống gió Quét chọn ống + phụ kiện · chọn lại = gỡ `hvac-insulation`
- Cập nhật theo ống Dựng lại hatch sau khi dời / copy / kéo ống `hvac-insul-update`
- Thống kê tiêu âm / bảo ôn m² theo loại, độ dày, quy cách → bảng `hvac-insul-stats`

##### Ghi chú và ký hiệu

- Smart Tag Gắn nhãn thông tin ống gió / Block HVAC `hvac-smart-tag`
- Tag ống gió Tên hệ, kích thước R × C / Ø, cao độ + mũi tên leader `hvac-tag`

PCCC 23 chức năng

##### Cấu hình hệ thống

- Vẽ đường ống chữa cháy Mline theo DN, kiểu nối, phụ kiện, cao độ đã chọn `fire-pipe`
- Nối nhanh ống PCCC Nối 2 ống cách xa: cút · côn · tê (phụ kiện SIDE) `fire-connect`

##### Vẽ tự động

- Quét thêm phụ kiện Tự động nhận diện và gắn phụ kiện ống (theo kiểu nối) `fire-fitting-scan`
- Rải quang treo Quét để rải quang treo tự động `fire-hanger`
- Rải giá đỡ Quét để rải giá đỡ tự động `fire-support`
- Đào đắp + tấm đan Hào ống thép chôn ngầm (đào chung nhiều ống): bảng preview, taluy, khối lượng, tấm đan, 3D `fire-trench`
- Insert block Chèn block phụ kiện PCCC `fire-insert-block`
- Tạo layer Pline Tạo bộ layer đường kính DN `fire-layer-create`
- Gán layer Pline Gán layer DN cho polyline `fire-layer-assign`
- Vẽ nhanh Pline Tự nối sprinkler theo cột về ống chính (DN25 → DN cao dần) `fire-pline`
- Kết nối đầu phun & vẽ tay nhánh Chèn TEE / ELB / RED / Kepren + convert Mline `fire-sprinkler-connect`
- Smart Tag Gắn nhãn thông tin ống PCCC `fire-smart-tag`
- 2.5D PCCC Chuyển mặt bằng 2D → sơ đồ không gian isometric `fire-build-25d`
- 3D PCCC Đặt bản sao Pline 3D theo cao độ ống `fire-build-3d`
- Quét mô hình 3D Dựng Solid ống thép + phụ kiện Visibility 3D `fire-scan-3d`
- Xoay 3D → Block mặt bằng Xoay góc nhìn, gom mô hình thành Block `fire-rotate-3d`
- Mặt cắt đứng 3 điểm: đường cắt + hướng / độ sâu nhìn `fire-section`
- HCAD trực tiếp Vẽ ống tới đâu, 3D hiện bên HCAD tới đó — bấm lần nữa để tắt `fire-hcad-live`
- Soát thiết bị 3D Block thiết bị / block ngoài có POINT: vào 3D chưa, nối ống chưa, lý do — khoanh dấu `fire-check-devices`

##### Setup cao độ

- Chèn cao độ Chèn text cao độ trên ống PCCC `fire-level`
- Cài đặt cao độ Gán cao độ Z cho Mline / phụ kiện `fire-elevation`

##### Ghi chú và ký hiệu

- Tag ống chữa cháy Tên hệ, DN, cao độ + mũi tên leader `fire-tag`
- Điền tên block Tên chuẩn hóa cạnh block · thống kê, hoàn công `fire-block-name`

Tiện ích 43 chức năng

##### Block và đánh tên

- Thay thế block Giữ vị trí, góc xoay và layer của block cũ (TRB) `util-replace-block`
- Điền nhanh tên thiết bị Đặt tên thiết bị hàng loạt (TTB) `util-device-name`
- Copy tăng dần Copy text / thuộc tính tăng số (CTD) `util-copy-increment`
- Chèn thư viện Chèn block từ thư viện HTS `util-library`

##### Layout

- Tạo layout hàng loạt Tạo layout theo khung tên (LYT) `util-layout-create`
- Đổi tên layout Đổi tên layout hàng loạt `util-layout-rename`

##### Danh mục bản vẽ

- Tạo danh mục bản vẽ Danh mục bản vẽ (DMBV) `util-drawing-index`
- Cập nhật danh mục Cập nhật danh mục bản vẽ `util-drawing-index-update`

##### Xref và chuyển đổi

- Làm sạch BV về 2D Đưa Z về 0, chuẩn hóa đối tượng `util-clean`
- Fillet nhiều Pline vuông góc Bo góc vuông hàng loạt (R90) `util-fillet`
- Làm sạch Xref Dọn Xref (C1) `util-xref-clean`
- Chuyển Line sang Mline Line → Mline (L2M) `util-line-mline-2`
- Chuyển Line sang Pline Line → Pline (L2P) `util-line-pline`
- Line / Pline → Mline Theo layer (1L2M) `util-line-mline`
- 3 Line → Mline Ghép 3 line thành Mline (3L2M) `util-3line-mline`
- Đổi Mline Style Chọn style hiện tại → style mới (CHML) `util-mline-style`

##### Xử lý block

- Xuất file tên block Xuất danh sách tên block (EXP) `util-block-export`
- Đổi tên block hàng loạt Đổi tên block (REN) `util-block-rename`
- Đổi basepoint block Đổi điểm chèn định nghĩa block (CHBP) `util-basepoint`
- Xuất block Xuất block ra file (EXP) `util-export-blocks`
- Ghi chú block Ghi chú cho block (GCB) `util-block-note`

##### Dim - kích thước

- Cắt chân Dim Cắt chân Dim (CD) `util-dim-cut`
- Dóng chân Dim Dóng chân Dim (BD) `util-dim-align`
- Tính tổng Dim Tổng các Dim chọn (SD) `util-dim-sum`
- Dim ống gió Ghi kích thước ống gió (DIM) `util-dim-duct`
- Dim giá đỡ Ghi kích thước giá đỡ (GĐ) `util-dim-support`
- Dim block Ghi kích thước block (DB) `util-dim-block`
- Đo chiều dài Mline Chiều dài Mline (MLL) `util-mline-length`

##### Tính toán và thống kê

- Tổng chiều dài Line / Pline Tổng chiều dài (TL) `util-total-length`
- Thống kê block Đếm block `util-block-count`
- Thống kê text Đếm text (TKT) `util-text-count`
- Tính tổng các số bằng text Cộng số trong text (TT) `util-text-sum`

##### In ấn và màu sắc

- In hàng loạt In model hàng loạt (IN) `util-batch-plot`
- Đổi màu toàn bản vẽ COLORX `util-colorx`
- In hàng loạt 02 MPL `util-mpl`

##### Tiện ích khác

- HTS AI (Beta) Trợ lý AI vẽ thoát nước, cấp nước, chiếu sáng `util-htsai`
- Trình duyệt web Tab trình duyệt ngay trên palette — Zalo, YouTube, nghe nhạc, mọi trang web `util-browser`
- Zalo Mở tab Trình duyệt và vào Zalo Web — nhắn tin, gửi file, dán ảnh bản vẽ bằng Ctrl+V `util-zalo`
- Quản lý ghi chú GC `util-note-manager`
- Chuẩn hoá block CHB `util-block-std`
- Ký hiệu bản vẽ KHBV `util-khbv`
- Đổi font chữ VNI / TCVN3 → Unicode, có xem trước `util-convert-font`
- Dịch thuật AI Dịch TEXT / MTEXT qua AI Gateway `util-ai-translate`

Phối hợp MEP 10 chức năng

##### Bố trí kết cấu

- Vẽ dầm Dầm b × h trên thanh (VD) `coord-beam`
- Vẽ tường Tường t × H trên thanh (VT) `coord-wall`
- Bo chiều cao trần PLine kín · trần thô / trần giả trên thanh `coord-ceiling`

##### Combine MEP - kết cấu

- Combine chiếu sáng / ổ cắm - kết cấu Vai bò dưới dầm + VIEW 3D `coord-clash-electric`
- Kiểm tra va chạm ống nước - dầm Xuyên dầm · chạm dầm · sát đáy dầm `coord-clash-water`
- Xoá dấu va chạm Dọn kết quả kiểm tra `coord-clear-clash`

##### Combine MEP - MEP

- Setup Combine MEP Vai bò qua dầm · ống xuyên dầm `coord-setup-combine`
- Combine 3D toàn hệ CTN · PCCC · Điện · HVAC · Kết cấu → HCAD → đặt mô hình `coord-mep-3d`
- HCAD trực tiếp Mọi ống / phụ kiện vẽ trong AutoCAD hiện 3D ngay bên HCAD — bấm lần nữa để tắt `coord-hcad-live`
- Mặt cắt combine Toàn hệ + dầm / tường, hatch phần bị cắt `coord-section`

VCS 41 chức năng

##### Bóc khối lượng: 11 tab (tham số `module` của vcs_takeoff)

- `ctn` Cấp thoát nước ống Mline + phụ kiện
- `pccc` PCCC ống thép DN + phụ kiện
- `hvac` Ống gió HVAC ống gió, phụ kiện, tổng tôn theo độ dày, giá đỡ
- `tray` Thang máng cáp thang, máng, trunking
- `wire` Dây điện số dây × chiều dài
- `block` Block đếm block theo tên chuẩn hoá
- `dynblock` Block động block động + attribute
- `text` Text thống kê chữ
- `lpl` Line / Polyline chiều dài theo layer
- `dim` Kích thước cộng giá trị Dim
- `lib` Thư viện block HTS không cần bản vẽ

##### Bảng kết quả

- Tổng quan bản vẽ Đếm đối tượng theo loại / layer, gợi ý tab nên bóc `bang:tong-quan` có tool riêng
- Xem bảng (lọc / trang) Đọc bảng tổng hợp / chi tiết của lần bóc gần nhất `bang:xem` có tool riêng
- Zoom tới đối tượng Zoom theo ObjectID của dòng bảng `bang:zoom` có tool riêng
- Loại dòng / khôi phục Bỏ đối tượng khỏi bảng (không xoá bản vẽ), khôi phục `bang:loai-dong` có tool riêng
- AI chuẩn hoá tên Gợi ý / áp tên chuẩn cho block, text `bang:chuan-hoa-ten` có tool riêng
- Soát thư viện Soát block thư viện so danh mục chuẩn `bang:soat-thu-vien` có tool riêng
- Xuất Excel Xuất bảng ra Excel theo mẫu BOQ `bang:xuat-excel` có tool riêng
- Chèn bảng vào bản vẽ Bảng AutoCAD từ lần bóc gần nhất — kỹ sư chọn vị trí đặt bảng. `bang:chen-cad` kỹ sư chọn trên AutoCAD

##### Công cụ bản vẽ

- Kiểm tra bản vẽ Purge + kiểm tỷ lệ 1:1 `cong-cu:kiem-ban-ve` chạy ngay
- Chuyển kích thước ống Đổi tỷ lệ Mline từ cỡ 'tu' sang 'sang' — kỹ sư chọn Mline. `cong-cu:doi-co-ong` kỹ sư chọn trên AutoCAD
- Chuẩn hoá layer ống PCCC: layer theo DN; khác: layer theo tỷ lệ Mline — kỹ sư chọn ống. `cong-cu:chuan-hoa-layer` kỹ sư chọn trên AutoCAD
- AutoDim AutoDim các đối tượng — kỹ sư chọn `cong-cu:autodim` kỹ sư chọn trên AutoCAD
- AutoDim Pline AutoDim từng đoạn polyline — kỹ sư chọn `cong-cu:autodim-pline` kỹ sư chọn trên AutoCAD
- Lọc trùng Xoá đối tượng trùng trong vùng chọn — kỹ sư chọn `cong-cu:loc-trung` kỹ sư chọn trên AutoCAD
- Link block mẫu Nối block mẫu tới block cùng tên — kỹ sư chọn mẫu + vùng `cong-cu:link-block` kỹ sư chọn trên AutoCAD
- Link text mẫu Nối TEXT mẫu tới text cùng nội dung — kỹ sư chọn mẫu + vùng `cong-cu:link-text` kỹ sư chọn trên AutoCAD
- Công thức ống gió Cửa sổ công thức diện tích tôn ống gió `cong-cu:cong-thuc-ong-gio` mở hộp thoại
- Công thức phụ kiện ống gió Cửa sổ công thức phụ kiện ống gió `cong-cu:cong-thuc-phu-kien` mở hộp thoại

##### Cấu hình

- Setup Cửa sổ cấu hình VCS `cua-so:setup` mở hộp thoại
- Setup BOQ Cửa sổ mẫu BOQ / Excel `cua-so:boq` mở hộp thoại
- Cấu hình dự án Cửa sổ thông tin dự án `cua-so:du-an` mở hộp thoại
- Cập nhật HTools Mở trình cập nhật `cua-so:cap-nhat` chạy ngay
- Làm tròn khối lượng Thiết lập làm tròn chung. `cai-dat:lam-tron` chạy ngay

##### Dự án

- Lưu / mở dự án Hộp thoại lưu / mở dự án bóc khối lượng — dùng trên cửa sổ VCS V2 `v2:luu-du-an` chỉ trên cửa sổ VCS V2
- Gom nhóm theo thuộc tính Chọn thuộc tính block để gom nhóm — dùng trên cửa sổ VCS V2 `v2:gom-thuoc-tinh` chỉ trên cửa sổ VCS V2

##### Lệnh V1

- Mở VCS (đăng nhập + cửa sổ) `lenh:VCS` kỹ sư trả lời câu hỏi trên AutoCAD
- Tạo Mline từ LINE `lenh:TML` kỹ sư trả lời câu hỏi trên AutoCAD
- Thêm hậu tố `lenh:ZZ` kỹ sư trả lời câu hỏi trên AutoCAD
- Cộng Dim `lenh:CCD1` kỹ sư trả lời câu hỏi trên AutoCAD
- Block giao Pline `lenh:FindBlockPlineIntersection` kỹ sư trả lời câu hỏi trên AutoCAD

HTS Software · Bộ hướng dẫn kết nối MCP · cập nhật 15/11/2026. Danh mục sinh tự động từ phiên bản HTS / VCS hiện hành; bản bạn đang cài có thể nhiều hoặc ít hơn vài công cụ. Xem thêm: [Thư viện, Block 3D & Spec](https://claude.ai/artifact/9314TFtzFzrXPon2idath9).