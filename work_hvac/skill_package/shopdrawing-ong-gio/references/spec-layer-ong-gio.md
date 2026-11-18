# Tiêu Chuẩn Layer, Ký Hiệu Thông Số & Chế Tạo Ống Gió (`Spec-layer ký hiệu ống gió.dwg`)

Tài liệu chuẩn trích xuất 100% từ tệp tiêu chuẩn `Spec-layer ký hiệu ống gió.dwg` kết hợp cấu hình chế tạo gốc của HTS (`SpecHVAC.json` & `Setup-HVAC.xlsx`).

---

## 1. Bảng Tra Cứu Chuẩn 13 Layer HVAC (`LAYER DRAWING STANDARD`)

- **Đơn vị bản vẽ chuẩn**: `INSUNITS = 4` (`Millimeters`), `MEASUREMENT = 1` (Hệ Mét).
- **Mã phân hệ**: `MVAC` $\rightarrow$ Tiền tố Layer chuẩn: **`M-MVAC-<Hạng mục>`**.
- **Thuộc tính đối tượng**: Mọi Block ống gió, phụ kiện, thiết bị, đám mây phải để màu **`ByLayer`** (`ACI 256`) để hiển thị đúng màu tiêu chuẩn của Layer.

| STT | Ký hiệu hệ | Tên Layer chuẩn (`layerName`) | Màu ACI (`color`) | Kiểu nét (`Linetype`) | Nét in thuyết minh (mm) | Tham số `lineweight` MCP hợp lệ* | Ý nghĩa hệ thống (Tiếng Anh / Tiếng Việt) |
| :-: | :--- | :--- | :-: | :--- | :-: | :-: | :--- |
| 1 | **`EAD`** | **`M-MVAC-EAD`** | **`80`** | `Continuous` | `0.20` | `20` | **EXHAUST AIR DUCT** — Đường ống gió thải |
| 2 | **`FAD`** | **`M-MVAC-FAD`** | **`150`** | `Continuous` | `0.20` | `20` | **FRESH AIR DUCT** — Đường ống gió tươi |
| 3 | **`PAD`** | **`M-MVAC-PAD`** | **`210`** | `Continuous` | `0.20` | `20` | **PRESSURIZATION AIR DUCT** — Ống gió tạo áp (tăng áp cầu thang/buồng đệm) |
| 4 | **`CEAD`** | **`M-MVAC-CEAD`** | **`170`** | `Continuous` | `0.20` | `20` | **CAR EXHAUST AIR DUCT** — Đường ống gió thải nhà xe |
| 5 | **`CSAD`** | **`M-MVAC-CSAD`** | **`11`** | `Continuous` | `0.20` | `20` | **CAR SUPPLY AIR DUCT** — Đường ống gió cấp nhà xe |
| 6 | **`SEAD`** | **`M-MVAC-SEAD`** | **`190`** | `Continuous` | `0.20` | `20` | **SMOKE EXHAUST AIR DUCT** — Đường ống hút khói sự cố |
| 7 | `Copper Pipe` | **`M-MVAC-Copper Pipe`** | **`12`** | `Continuous` | `0.20` | `20` | **COPPER PIPE** — Đường ống đồng điều hòa |
| 8 | `AC Drain` | **`M-MVAC-AC Drain`** | **`72`** | `Continuous` | `0.20` | `20` | **DRAIN FOR AIR CONDITIONER** — Đường ống nước ngưng điều hòa |
| 9 | `Equipment` | **`M-MVAC-Equipment`** | **`47`** | `Continuous` | `0.10` | `9` *(hoặc `-3`)* | **EQUIPMENT** — Thiết bị, van gió (`VCD/FD/MFD/NRD`), khớp mềm, miệng gió |
| 10 | `Support` | **`M-MVAC-Support`** | **`42`** | `Continuous` | `0.10` | `9` *(hoặc `-3`)* | **SUPPORT** — Giá đỡ, quang treo ống gió |
| 11 | `DIM` | **`M-MVAC-DIM`** | **`97`** | `Continuous` | `0.05` | `5` | **DIMENSION** — Đường ghi kích thước |
| 12 | `TEXT` | **`M-MVAC-TEXT`** | **`2`** | `Continuous` | `0.10` | `9` *(hoặc `-3`)* | **TEXT** — Nhãn ghi chú thông số ống gió & thiết bị |
| 13 | *(Cloud)* | **`CLOUND`** | **`240`** | `Continuous` | `0.20` | `20` | **REVISION CLOUD** — Đám mây `REVCLOUD` khoanh vùng thiết kế chưa rõ (giữ đúng chính tả `CLOUND` của file Spec gốc) |

> **\*Lưu ý kỹ thuật về `lineweight` trong AutoCAD API**: Enum `LineWeight` chuẩn của AutoCAD chỉ nhận các giá trị `0, 5, 9, 13, 15, 18, 20, 25, 30...` (không có số `10`). Trong bảng Layer gốc của `Spec-layer ký hiệu ống gió.dwg`, các layer `M-MVAC-*` để `Lineweight = -3` (`Default`) và `CLOUND` để `Lineweight = 20`. Khi gọi `create_layer`, truyền `9` (`0.09 mm`) hoặc `13` (`0.13 mm`) nếu muốn ép nét mảnh gần `0.10 mm`, hoặc truyền `10` để HTS tự gán về `-3` (`Default`) giống hệt file Spec gốc.

---

## 2. Quy Trình Hỏi Xác Nhận Bảng Layer Ở Đầu Mỗi Dự Án Mới

Mỗi dự án tư vấn thiết kế có thể đặt tên layer khác nhau (ví dụ `MEPG-AC-M-Hút khói-SED`, `M-AC-SA`, `HVAC-DUCT-RA`...) hoặc có thêm hệ thống ngoài 6 hệ ống gió mặc định ở Bảng 1. **Trước khi bắt đầu vẽ ở dự án mới**, Agent phải khảo sát bản vẽ và trình bảng đề xuất ngắn gọn để người dùng xác nhận:

- **Các hệ có sẵn trong Spec gốc** $\rightarrow$ Tự động gợi ý ánh xạ sang đúng `M-MVAC-EAD` (`80`), `FAD` (`150`), `PAD` (`210`), `CEAD` (`170`), `CSAD` (`11`), `SEAD` (`190`).
- **Các hệ phát sinh ngoài Spec gốc** $\rightarrow$ Gợi ý theo chuẩn họ `M-MVAC-<KÝ HIỆU>` và hỏi người dùng chốt tên Layer + màu ACI trước khi tạo:
  - `SAD` (Supply Air Duct — Ống gió cấp lạnh): gợi ý `M-MVAC-SAD` (hỏi màu ACI mong muốn, ví dụ `140` / `4` Cyan).
  - `RAD` (Return Air Duct — Ống gió hồi lạnh): gợi ý `M-MVAC-RAD` (ví dụ `200` / `6` Magenta).
  - `OAD` (Outdoor Air Duct — Gió tươi ngoài trời): hỏi gộp vào `M-MVAC-FAD` (`150`) hay tách `M-MVAC-OAD`.
  - `TEAD` / `KEAD` (Gió thải vệ sinh / thải bếp): hỏi gộp vào `M-MVAC-EAD` (`80`) hay tách riêng.

### Mẫu JSON `batch_process` khởi tạo 13 Layer Spec mặc định (1 lượt gọi duy nhất)

```json
{
  "buoc": [
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-EAD", "color": 80, "lineweight": 20, "plottable": true, "description": "EXHAUST AIR DUCT / Duong ong gio thai" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-FAD", "color": 150, "lineweight": 20, "plottable": true, "description": "FRESH AIR DUCT / Duong ong gio tuoi" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-PAD", "color": 210, "lineweight": 20, "plottable": true, "description": "PRESSURIZATION AIR DUCT / Ong gio tao ap" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-CEAD", "color": 170, "lineweight": 20, "plottable": true, "description": "CAR EXHAUST AIR DUCT / Ong gio thai nha xe" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-CSAD", "color": 11, "lineweight": 20, "plottable": true, "description": "CAR SUPPLY AIR DUCT / Ong gio cap nha xe" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-SEAD", "color": 190, "lineweight": 20, "plottable": true, "description": "SMOKE EXHAUST AIR DUCT / Duong ong hut khoi" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-Copper Pipe", "color": 12, "lineweight": 20, "plottable": true, "description": "COPPER PIPE / Duong ong dong" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-AC Drain", "color": 72, "lineweight": 20, "plottable": true, "description": "DRAIN FOR AIR CONDITIONER / Ong nuoc ngung" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-Equipment", "color": 47, "lineweight": 9, "plottable": true, "description": "EQUIPMENT / Thiet bi HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-Support", "color": 42, "lineweight": 9, "plottable": true, "description": "SUPPORT / Gia do HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-DIM", "color": 97, "lineweight": 5, "plottable": true, "description": "DIMENSION / Kich thuoc HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-TEXT", "color": 2, "lineweight": 9, "plottable": true, "description": "TEXT / Ghi chu HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "CLOUND", "color": 240, "lineweight": 20, "plottable": true, "description": "Revision Cloud - Khu vuc can lam ro" } }
  ]
}
```

---

## 3. Quy Tắc Giải Mã Nhãn Thông Số Ống Gió (`QUY TẮC ĐỌC THÔNG SỐ ỐNG GIÓ`)

Theo sơ đồ quy ước trong `Spec-layer ký hiệu ống gió.dwg`:

```text
SEAD-1700x500
BOD=FFL+2500
```

| Thành phần | Ví dụ | Giải nghĩa kỹ thuật | Tham số ánh xạ vào HTS Tool |
| :--- | :--- | :--- | :--- |
| **Tiền tố hệ** | `SEAD` *(hoặc `SED`)* | Mã hệ thống ống gió | `layer: "M-MVAC-SEAD"` |
| **Số thứ nhất (`W`)** | `1700` | **Chiều rộng ống gió `W = 1700 mm`** *(cạnh nằm ngang đo trực tiếp giữa 2 nét biên trên mặt bằng 2D!)* | `W: 1700` trong `draw_rectangular_duct` *(phải kiểm chứng lại bằng khoảng cách 2 nét biên thực tế trên mặt bằng)* |
| **Số thứ hai (`H`)** | `500` | **Chiều cao ống gió `H = 500 mm`** *(cạnh theo phương đứng Z)* | `H: 500` trong `draw_rectangular_duct` |
| **Ống tròn** | `Ø400` / `D400` | **Đường kính ống tròn `D = 400 mm`** | `D: 400` trong `draw_round_duct` |
| **`BOD=FFL+2500`** | `+2500` | **Cao độ đáy ống gió (`Bottom Of Duct`)** cao hơn sàn hoàn thiện (`FFL`) `2500 mm` | `day: 2500` trong `duct_set_elevation` (ghi XData `HTS_OG_DAY`) |
| *(Trường hợp ghi `TOD` / `CL`)* | `TOD=FFL+3000` | Nếu bản vẽ ghi đỉnh ống (`TOD`) hoặc tâm ống (`CL`), quy đổi về đáy ống: `BOD = TOD - H` hoặc `BOD = CL - H/2` | `day: TOD - H` |

### Kiểm tra tính liên tục trên tuyến:
- **Đoạn trung gian cùng bề rộng `W` giữa 2 cút chuyển hướng** (ví dụ Jog tránh cột/dầm hoặc bậc thang cuối tuyến): nếu hai đầu trước và sau có cùng `W x H` và cùng quy luật `BOD`, không có côn thu ở giữa, thì kế thừa trực tiếp `W x H` và `BOD` đó — vẽ liền mạch bằng 1 `run` của `draw_rectangular_duct` (không khoanh mây thừa).
- **Cảnh báo bất thường 3D xuất từ Revit**: Nếu trên mặt bằng 2D xuất hiện **nét biên đôi lệch nhau vài mm** hoặc cút biến thành **`ELLIPSE`** kèm bước nhảy `BOD` bất thường dù `H` không đổi $\Rightarrow$ ống trong Revit đang đi nghiêng dốc 3D! Đây là vùng **không tự ý vẽ đoán** $\rightarrow$ dừng ống thẳng ở hai đầu ngoài và khoanh mây `REVCLOUD` bỏ trống bên trong để hỏi người dùng.

---

## 4. Tiêu Chuẩn Chế Tạo Mặc Định Của HTS (`SpecHVAC.json` & `Setup-HVAC.xlsx`)

- **Chiều dài 1 đốt ống thẳng tiêu chuẩn**: **`L = 1110 mm`** (`draw_rectangular_duct` tự chia các đốt `1110 mm` + 1 đốt bù chiều dài lẻ; tai bích nẹp TDC nhô `20 mm` mỗi bên).
- **Bán kính cổ trong của cút bo chữ nhật `90°`**: **`R_in = W / 2`** (`R_tim = W`), sinh block `HTS-CO-V47-{W}x{H}-R{W/2}-A90`.
- **Quy cách bích/nẹp ghép nối theo cạnh lớn `max(W, H)`**:
  - `100 – 200 mm`: Nẹp C | `250 – 1950 mm`: Bích nẹp TDC | `≥ 2000 mm`: Bích thép góc `V30x3`.
- **Độ dày tôn mạ kẽm theo `max(W, H)`**:
  - `≤ 400 mm`: `0.58 mm` | `401 – 1000 mm`: `0.75 mm` | `1001 – 2500 mm`: `0.95 mm` | `> 2500 mm`: `1.15 mm`.
- **Khoảng cách giá đỡ tiêu chuẩn**: `1800 mm` (`U40x40x2`), cách phụ kiện `600 mm`.
