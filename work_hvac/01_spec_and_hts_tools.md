# 01 — TIÊU CHUẨN LAYER KÝ HIỆU ỐNG GIÓ & CẨM NANG 100% HTS TOOL HVAC

> **Biên soạn**: `@spec-reader` (Kỹ sư Tiêu chuẩn HVAC & Chuyên gia Công cụ HTS)  
> **Nguồn trích xuất thực tế**:
> 1. Bản vẽ tiêu chuẩn: `C:\Users\Nguye\Desktop\SHOP DRAWING-AI\Spec-layer ký hiệu ống gió.dwg` *(trích xuất 100% Layer, Block, Text/MText/Leader, hình học qua `accoreconsole.exe` AutoCAD 2027 và giải mã font TCVN3 `VNTIMEH` sang Unicode)*.
> 2. Hệ sinh thái **HTS Tool** (`hts-autocad`, cổng `5088`, v2.0 — 214 MCP tools, 31 chức năng HVAC giao diện V2, `SpecHVAC.json`, `Setup-HVAC.xlsx`, và 15 tệp `.dwg` trong `Library\HVAC\`).

---

## PHẦN 1. TIÊU CHUẨN LAYER & KÝ HIỆU ỐNG GIÓ (`Spec-layer ký hiệu ống gió.dwg`)

### 1.1. Thông số gốc của bản vẽ tiêu chuẩn
- **Đơn vị bản vẽ (`INSUNITS`)**: `4` (`Millimeters` — mm), `MEASUREMENT = 1` (hệ Mét).
- **Hệ thống (`SYSTEM`)**: `AIR CONDITIONAL SYSTEM & VENTILATION SYSTEM` *(HỆ THỐNG ĐIỀU HÒA & THÔNG GIÓ)*.
- **Mã phân hệ (`SYMBOL`)**: **`MVAC`** → Tiền tố Layer chuẩn: **`M-MVAC-<Hạng mục>`**.

### 1.2. Bảng tra cứu chuẩn 100% Layer HVAC (`LAYER DRAWING STANDARD`)

| STT | Ký hiệu viết tắt | Tên Layer chuẩn (`layerName`) | Màu ACI (`color`) | Kiểu nét (`Linetype`) | Nét in quy định (mm) | Tham số `lineweight` MCP | Hạng mục Tiếng Anh / Tiếng Việt (theo đúng Spec) |
| :-: | :--- | :--- | :-: | :-: | :-: | :-: | :--- |
| 1 | **`EAD`** | **`M-MVAC-EAD`** | **`80`** | `Continuous` | `0.20` | `20` | **EXHAUST AIR DUCT** / Đường ống gió thải |
| 2 | **`FAD`** | **`M-MVAC-FAD`** | **`150`** | `Continuous` | `0.20` | `20` | **FRESH AIR DUCT** / Đường ống gió tươi |
| 3 | **`PAD`** | **`M-MVAC-PAD`** | **`210`** | `Continuous` | `0.20` | `20` | **PRESSURIZATION AIR DUCT** / Ống gió tạo áp (tăng áp cầu thang/buồng đệm) |
| 4 | **`CEAD`** | **`M-MVAC-CEAD`** | **`170`** | `Continuous` | `0.20` | `20` | **CAR EXHAUST AIR DUCT** / Đường ống gió thải nhà xe |
| 5 | **`CSAD`** | **`M-MVAC-CSAD`** | **`11`** | `Continuous` | `0.20` | `20` | **CAR SUPPLY AIR DUCT** / Đường ống gió cấp nhà xe |
| 6 | **`SEAD`** | **`M-MVAC-SEAD`** | **`190`** | `Continuous` | `0.20` | `20` | **SMOKE EXHAUST AIR DUCT** / Đường ống hút khói *(Spec gốc gõ nhầm "AID")* |
| 7 | `Copper Pipe` | **`M-MVAC-Copper Pipe`** | **`12`** | `Continuous` | `0.20` | `20` | **COPPER PIPE** / Đường ống đồng điều hòa |
| 8 | `AC Drain` | **`M-MVAC-AC Drain`** | **`72`** | `Continuous` | `0.20` | `20` | **DRAIN FOR AIR CONDITIONER** / Đường ống nước ngưng điều hòa |
| 9 | `Equipment` | **`M-MVAC-Equipment`** | **`47`** | `Continuous` | `0.10` | `10` | **EQUIPMENT** / Thiết bị (Quạt, FCU, AHU, Miệng gió, Van gió...) |
| 10 | `Support` | **`M-MVAC-Support`** | **`42`** | `Continuous` | `0.10` | `10` | **SUPPORT** / Giá đỡ, quang treo ống gió |
| 11 | `DIM` | **`M-MVAC-DIM`** | **`97`** | `Continuous` | `0.05` | `5` | **DIMENSION** / Đường ghi kích thước |
| 12 | `TEXT` | **`M-MVAC-TEXT`** | **`2`** | `Continuous` | `0.10` | `10` | **TEXT** / Chữ viết, nhãn ghi chú thông số ống gió |
| 13 | *(Cloud)* | **`CLOUND`** | **`240`** | `Continuous` | `0.20` | `20` | **Đám mây `REVCLOUD` & Leader khoanh vùng chưa rõ / RFI** *(Layer có sẵn trong file Spec gốc)* |

> **Ghi chú kỹ thuật quan trọng từ file Spec gốc**:
> - Ở dòng số 5 (`CSAD`), đường `LINE` mẫu `[handle 38C]` nằm đúng trên layer **`M-MVAC-CSAD`** (`ACI = 11`), trong khi 3 chữ thuyết minh bên cạnh vô tình đặt ở layer `M-MVAC-TEXT`. Khi vẽ ống gió cấp nhà xe bắt buộc dùng **`M-MVAC-CSAD` (màu ACI `11`)**.
> - Các layer phụ trợ khung bảng khác có trong file Spec (không dùng để vẽ ống): `0` (ACI 7), `Defpoints` (ACI 7, `Plot=0`), `KD-1-3000` (ACI 97, LW 13), `M-PEA-DIM` (ACI 97), `MEPG-AC-TEXT` (ACI 7, LW 25), `ZZ` (ACI 81).
> - **Quy tắc mở rộng khi đóng gói Skill cho dự án mới**: Nếu bản vẽ thiết kế phát sinh ký hiệu hệ thống chưa liệt kê trong 6 hệ ống gió mặc định trên (ví dụ `SAD` / `SA` = Cấp lạnh điều hòa, `RAD` / `RA` = Hồi điều hòa, `OAD` = Gió tươi ngoài trời, `TEAD` = Thải vệ sinh...), đầu dự án phải đối chiếu bảng Layer của bản vẽ thiết kế và **hỏi người dùng xác nhận bảng ánh xạ Layer + màu ACI** trước khi vẽ (mặc định gợi ý theo chuẩn họ `M-MVAC-<KÝ HIỆU>`).
> - Mọi đối tượng ống gió, phụ kiện, thiết bị sau khi tạo phải đảm bảo thuộc tính màu là **`ByLayer`** để hiển thị đúng màu ACI tiêu chuẩn của Layer.

### 1.3. Quy tắc giải mã Text thông số ống gió (`QUY TẮC ĐỌC THÔNG SỐ ỐNG GIÓ`)

Trích xuất nguyên văn sơ đồ giải thích tại vùng `Y = -4554 .. -29569` của `Spec-layer ký hiệu ống gió.dwg`:

```text
SEAD-1700x500
BOD=FFL+2500
```

| Thành phần ký hiệu | Giá trị ví dụ | Ý nghĩa kỹ thuật chuẩn xác | Ánh xạ vào tham số HTS Tool |
| :--- | :--- | :--- | :--- |
| **Tiền tố hệ thống** | `SEAD` | Ký hiệu hệ thống ống gió (`EAD`, `FAD`, `PAD`, `CEAD`, `CSAD`, `SEAD`...) | Đặt `layer: "M-MVAC-SEAD"` |
| **Số thứ nhất (`W`)** | `1700` | **Chiều rộng ống gió `W = 1700 mm`** *(cạnh nằm ngang nhìn thấy trực tiếp trên mặt bằng 2D)* | `W: 1700` trong `draw_rectangular_duct` |
| **Số thứ hai (`H`)** | `500` | **Chiều cao ống gió `H = 500 mm`** *(cạnh theo phương đứng Z)* | `H: 500` trong `draw_rectangular_duct` |
| **Ống tròn (nếu có)** | `Ø400` / `D400` | **Đường kính ống gió tròn `D = 400 mm`** | `D: 400` trong `draw_round_duct` |
| **Chuỗi cao độ đáy** | `BOD=FFL` | **Cao độ đáy ống gió (`BOD` = Bottom Of Duct) so với sàn hoàn thiện (`FFL` = Finished Floor Level)** | Dùng tool `duct_set_elevation` (cao độ đáy) |
| **Giá trị cao độ** | `+2500` | Đáy ống gió cao **`2500 mm`** so với sàn hoàn thiện | `day: 2500` trong `duct_set_elevation` |

### 1.4. Tiêu chuẩn chế tạo mặc định trong HTS (`SpecHVAC.json` & `Setup-HVAC.xlsx`)
- **Chiều dài 1 đốt ống thẳng tiêu chuẩn**: `L = 1110 mm` (`draw_rectangular_duct` tự động chia đốt `1110mm` + đốt bù).
- **Kiểu cút ống gió vuông mặc định**: `Thuong` (cút bo bán kính trong `R = W/2`, block `HTS-OG-CO-V47-...`).
- **Quy cách bích/nẹp ghép nối (`BangNep`)**:
  - Cạnh lớn `100 – 200 mm`: `NẸP C`
  - Cạnh lớn `250 – 1950 mm`: `NẸP TDC`
  - Cạnh lớn `≥ 2000 mm`: `THÉP GÓC V30X3`
- **Độ dày tôn theo cạnh lớn nhất `max(W, H)` (`Setup-HVAC.xlsx`)**:
  - `≤ 400 mm` → `0.58 mm` | `401 – 1000 mm` → `0.75 mm` | `1001 – 2500 mm` → `0.95 mm` | `> 2500 mm` → `1.15 mm`.
- **Khoảng cách giá đỡ ống gió (`SpecHVAC.json`)**: `Spacing = 1800 mm`, thép `U40x40x2`.

---

## PHẦN 2. QUY TẮC BẮT BUỘC 100% HTS TOOL CHO ỐNG GIÓ & PHỤ KIỆN

### 2.1. Kỷ luật thép (TUYỆT ĐỐI TUÂN THỦ)
1. **BẮT BUỘC SỬ DỤNG 100% CÔNG CỤ HTS (`hts-autocad`)** để tạo ống gió thẳng, cút/co, côn thu/côn lệch, chuyển tiếp vuông-tròn, chân rẽ/gót giày, chạc quần Y, bịt đầu, van gió, khớp nối mềm, miệng gió và giá đỡ.
2. **TUYỆT ĐỐI CẤM** dùng `draw_line`, `draw_polyline`, `draw_rectangle`, `draw_arc`, `offset_curve` để vẽ giả nét ống gió hay phụ kiện ống gió rời rạc (vì sẽ không có định nghĩa Block chuẩn HTS, hỏng XData cao độ `HTS_OG_DAY`, không dựng được `OG3D`/`COMBINE 3D` và không bóc được khối lượng `VCS`!).
3. **Danh mục mẫu tên Block chuẩn do HTS sinh ra** (dùng để `@cad-drafter` tự kiểm và `@qa-verifier` nghiệm thu):
   - Ống thẳng chữ nhật: `HTS-OG-{W}x{H} L{len}` *(VD: `HTS-OG-1700x500 L1110`)*
   - Ống thẳng tròn: `HTS-OG-D{D} L{len}` *(VD: `HTS-OG-D400 L2500`)*
   - Cút bo góc vuông: `HTS-OG-CO-V47-{W}x{H}-R{R}-A{goc}` *(hoặc `-CO-EI-...`)*
   - Cút vuông 90° / Cút cánh hướng: `HTS-COV90-W{W}xH{H}-L{l1}` / `HTS-COCANHHUONG-W{W}xH{H}-L{l1}`
   - Cút tròn bo góc: `HTS-OG-CO-TRON-D{D}-R{R}-A{goc}` (hoặc `HTS-CO-TRON-D...`)
   - Cút tròn lên / xuống: `HTS-COLTR01-D{D}-R{r}` / `HTS-COXTR01-D{D}-R{r}`
   - Côn thu chữ nhật (đồng tâm / lệch trái / lệch phải): `HTS-CON-(Can|Trai|Phai)-{W1}x{H1}-{W2}x{H2}-L{L}`
   - Côn thu tròn: `HTS-CON-TRON-(Can|Trai|Phai)-D{D1}-D{D2}-L{L}`
   - Côn chuyển vuông–tròn / tròn–vuông: `HTS-VT-(Can|Trai|Phai)-{W}x{H}-D{D}-L{L}` / `HTS-TV-...`
   - Chân rẽ / Gót giày (Takeoff / Shoe tap): `HTS-TAP-(Can|Trai|Phai)-{W}x{H}-L{L}-D{loe}` hoặc `HTS-VT-TAP-...`
   - Tê ống gió: `HTS-...-TEE-...` / `TEE01` / `TEETH02` / `TEEBR01`
   - Chạc quần (Y chia đôi): `HTS-...-YQ-...` (sinh bởi `duct_breeches_insert`)
   - Bịt đầu ống gió (End Cap): `HTS-CAP-{W}x{H}-L{L}` (vuông) / `HTS-CAP-TRON-D{D}-L{L}` (tròn)
   - Trục đứng ống gió: `HTS-TRUCOG-...`
   - Giá đỡ ống gió: `HTS-GIADO`
   - Van gió / Khớp nối mềm / Miệng gió thư viện HTS: `HTS_Van gio...`, `HTS_Van chan lua...`, `HTS_Khop noi mem...`, `HTS_Mieng gio...`

---

## PHẦN 3. CẨM NANG CHI TIẾT TỪNG TOOL HTS HVAC & CÚ PHÁP JSON MẪU

### 3.1. Bước khởi tạo toàn bộ Layer chuẩn Spec (gọi `batch_process` 1 lần đầu tiên)
Sử dụng `batch_process` gói các lệnh `create_layer` để khởi tạo đầy đủ 13 Layer chuẩn của Spec trong 1 lượt gọi duy nhất:

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
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-Equipment", "color": 47, "lineweight": 10, "plottable": true, "description": "EQUIPMENT / Thiet bi HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-Support", "color": 42, "lineweight": 10, "plottable": true, "description": "SUPPORT / Gia do HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-DIM", "color": 97, "lineweight": 5, "plottable": true, "description": "DIMENSION / Kich thuoc HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "M-MVAC-TEXT", "color": 2, "lineweight": 10, "plottable": true, "description": "TEXT / Ghi chu HVAC" } },
    { "tool": "create_layer", "args": { "layerName": "CLOUND", "color": 240, "lineweight": 20, "plottable": true, "description": "Revision Cloud - Khu vuc can lam ro" } }
  ]
}
```

---

### 3.2. Vẽ ống gió chữ nhật + tự chia đốt `1110mm` + tự đặt Cút bo góc: `draw_rectangular_duct`
- **Chức năng**: Vẽ tuyến ống gió vuông/chữ nhật đi qua chuỗi điểm **TIM ỐNG (`points`)**. Tự động chia đốt thẳng `L = 1110mm` (`HTS-OG-{W}x{H} L{len}`) và tự động đặt Cút bo góc (`HTS-OG-CO-V47-...`) tại mọi điểm gãy góc trên cùng 1 `run`!
- **Tham số**:
  - Chế độ đơn: `W` (rộng mm), `H` (cao mm), `R` (bán kính trong của cút mm — bỏ trống = mặc định `W/2`), `layer` (tên layer Spec), `prefix` (`"HTS"`), `points: [{"x": ..., "y": ...}, ...]`.
  - **Chế độ Batch (`runs`) — KHUYÊN DÙNG** để vẽ nhiều đoạn/nhánh cùng lúc nhanh gấp 10 lần!
- **Cú pháp JSON mẫu (Batch `runs`)**:
```json
{
  "runs": [
    {
      "W": 1700,
      "H": 500,
      "layer": "M-MVAC-SEAD",
      "prefix": "HTS",
      "points": [
        { "x": 10000, "y": 25000 },
        { "x": 18500, "y": 25000 },
        { "x": 18500, "y": 32000 }
      ]
    },
    {
      "W": 1200,
      "H": 500,
      "layer": "M-MVAC-SEAD",
      "prefix": "HTS",
      "points": [
        { "x": 18500, "y": 32000 },
        { "x": 26000, "y": 32000 }
      ]
    }
  ]
}
```
> **Quy tắc hình học sống còn để khớp thiết kế & tự bắt phụ kiện**:
> 1. **`points` luôn là ĐƯỜNG TIM (CENTERLINE)** của ống gió (`x_tim = (x_bien1 + x_bien2)/2` hoặc `y_tim = (y_bien1 + y_bien2)/2`).
> 2. **Tại vị trí đổi tiết diện (Côn thu đồng tâm vs Côn lệch)**:
>    - Nếu bản vẽ thiết kế thu **đồng tâm (`Can`)**: tim đoạn ống nhỏ nối tiếp đúng trên đường thẳng tim ống lớn.
>    - Nếu bản vẽ thiết kế thu **lệch phẳng 1 mép (`Trai` / `Phai`)**: đường tim đoạn ống nhỏ phải dịch ngang `(W_lon - W_nho) / 2` để mép phẳng trùng khít 100% với nét biên bản vẽ thiết kế!
>    - Hai đoạn ống khác cỡ vẽ **chạm đầu nhau tại vị trí chuyển tiếp** (hoặc gối nhẹ vào vùng côn trên thiết kế), đảm bảo mỗi đoạn ống thẳng dài tối thiểu `>= 400mm` để bước `QUETPK` tự động cắt ống và chèn đúng block Côn đồng tâm / Côn lệch!
> 3. **Tại vị trí tách nhánh (Chân rẽ gót giày / Takeoff)**:
>    - Vẽ tuyến nhánh bắt đầu từ điểm giao trên **mép biên (cạnh)** hoặc **đường tim** của thân ống chính và vuông góc với ống chính, chiều dài đoạn thẳng đầu nhánh tối thiểu `>= 250mm`.

---

### 3.3. Vẽ ống gió tròn + tự đặt Cút tròn: `draw_round_duct`
- **Chức năng**: Vẽ tuyến ống gió tròn qua danh sách điểm tim `points`. Khác ống vuông, mỗi đoạn thẳng là 1 block liền `HTS-OG-D{D} L{len}`, tại góc cua tự đặt cút tròn `HTS-OG-CO-TRON-...`.
- **Cú pháp JSON mẫu**:
```json
{
  "runs": [
    {
      "D": 400,
      "layer": "M-MVAC-FAD",
      "prefix": "HTS",
      "points": [
        { "x": 12000, "y": 15000 },
        { "x": 16000, "y": 15000 },
        { "x": 16000, "y": 19000 }
      ]
    }
  ]
}
```

---

### 3.4. Tự động sinh Côn thu / Côn lệch / Vuông-Tròn / Chân rẽ gót giày / Cút: `hvac-fitting-scan` (`QUETPK`)
- **Chức năng**: Đây là công cụ chủ lực của HTS để tự động sinh **100% phụ kiện nối ống gió HTS** (`HTS-CON-Can/Trai/Phai-...`, `HTS-VT-...`, `HTS-TAP-...`, `HTS-OG-CO-...`) tại mọi điểm các ống thẳng HTS chạm nhau!
- **Cơ chế dòng lệnh (đã giải mã kiểm chứng từ `HTS.dll`)**:
  - Lệnh `QUETPK` **KHÔNG mở hộp thoại WPF**, chỉ hỏi duy nhất 1 câu chọn tập đối tượng trên Command Line:
    `[QUÉT PK] Quét chọn các ống gió cần thêm phụ kiện:`
  - Sau khi xong sẽ in: `[QUÉT PK] Đã thêm: {0} cút · {1} côn thu · {2} chân rẽ.`
- **Cú pháp gọi qua `ui_feature_run` (hoặc `send_command`)**:
```json
{
  "id": "hvac-fitting-scan",
  "inputs": ["_C", "10000,10000", "50000,40000", ""]
}
```
*(Hoặc quét toàn bộ ống gió vừa vẽ bằng `"inputs": ["_ALL", ""]`! Lưu ý dấu `""` cuối cùng chính là phím `Enter` kết thúc chọn đối tượng).*
- **Quy tắc kiểm tra sau khi gọi `ui_feature_run`**:
  1. Đảm bảo tất cả các layer ống gió **không bị khóa (`Lock = false`)** trước khi chạy.
  2. Đặt `set_layer` về đúng layer hệ ống gió (nếu quét từng vùng/từng hệ, nên quét theo từng vùng hoặc sau khi `QUETPK` xong dùng `get_entities_in_area` kiểm tra `layer` của các block `-CON-`, `-TAP-` vừa sinh; nếu phụ kiện nào rơi vào `CLAYER` khác hệ thì dùng `set_entity_properties` đổi `layer` về đúng hệ của tuyến ống!).
  3. Vì `ui_feature_run` gửi lệnh bất đồng bộ, ngay sau đó hãy gọi `list_block_definitions` hoặc `get_entities_in_area` để xác nhận các block `HTS-CON-...`, `HTS-TAP-...` đã được tạo sạch sẽ trên bản vẽ.

---

### 3.5. Chèn Cút vuông 90° / Cút cánh hướng / Cút tròn lên-xuống: `place_duct_elbow`
- **Khi nào dùng**:
  - Khi bản vẽ thiết kế thể hiện **Cút vuông 90° vát góc / có cánh hướng dòng** thay vì cút bo tròn (`type: "square"` → `COV90`, hoặc `type: "vaned"` → `COCANHHUONG`).
  - Hoặc khi tuyến ống tròn đi lên/xuống trục đứng (`type: "riser_up"` → `COLTR01`, `type: "riser_down"` → `COXTR01`).
- **Ưu điểm**: Tool MCP riêng, tự động đọc `W x H` (hoặc `D`) và góc xoay từ đoạn ống tại điểm `point`!
- **Cú pháp JSON mẫu**:
```json
{
  "items": [
    {
      "point": { "x": 18500, "y": 25000 },
      "type": "vaned",
      "l1": 300,
      "down": true
    }
  ]
}
```

---

### 3.6. Chèn Chạc quần ống gió (Y chia đôi vuông / tròn): `duct_breeches_insert`
- **Khi nào dùng**: Khi 1 ống chính tách đôi đối xứng hoặc bất đối xứng thành 2 nhánh đi song song cạnh nhau (Pant-leg Wye / Breeches — lệnh `HTSYQOG`).
- **Quy trình chuẩn 2 bước**:
  1. Gọi với `"xemTruoc": true` trước để kiểm tra hợp lệ (`c < lc < l - c`) và lấy **tọa độ chính xác của 3 miệng nối** (`vao`, `trai`, `phai`).
  2. Gọi với `"xemTruoc": false` (hoặc bỏ `xemTruoc`) để chèn thật, sau đó nối tiếp `draw_rectangular_duct` / `draw_round_duct` từ đúng tọa độ miệng `trai` và `phai`!
- **Cú pháp JSON mẫu**:
```json
{
  "vao": { "w": 1200, "h": 500 },
  "trai": { "w": 600, "h": 500 },
  "phai": { "w": 600, "h": 500 },
  "a": 200,
  "l": 800,
  "lc": 400,
  "c": 100,
  "diem": { "x": 26000, "y": 32000 },
  "gocDo": 0,
  "day": 2500,
  "xemTruoc": true
}
```
*(Chú ý: Sau khi chèn, kiểm tra `layer` của block `...-YQ-...` và dùng `set_entity_properties` gán về đúng layer hệ ống nếu cần).*

---

### 3.7. Bịt đầu ống gió (End Cap): `hvac-cap` (`_HG2M8Q7X`)
- **Cơ chế hoạt động (đã kiểm chứng từ `HTS.dll`)**:
  - Lệnh `_HG2M8Q7X` hỏi duy nhất 1 prompt `GetEntity`: `"Chọn đoạn ống gió thẳng muốn chuyển thành Bịt đầu:"`.
  - Khi nhận tọa độ pick trúng một đốt ống thẳng `HTS-OG-...`, HTS tự động dò đầu đang hở (không nối với ống khác) và chuyển đốt thẳng đó thành Block đầu bịt chuẩn **`HTS-CAP-{W}x{H}-L{L}`** (hoặc **`HTS-CAP-TRON-D{D}-L{L}`**) rồi kết thúc lệnh ngay lập tức!
- **Quy trình thực hiện chuẩn 100%**:
  1. Tại mỗi đầu cụt kết thúc nhánh ống gió, vẽ 1 đoạn ống thẳng ngắn dài **`50 mm`** (hoặc `50–100 mm`) nối tiếp đầu mút tuyến ống bằng `draw_rectangular_duct` (hoặc `draw_round_duct`) trên đúng layer hệ ống.
  2. Lấy tọa độ một điểm trên cạnh biên của đoạn ống `50 mm` đó (ví dụ điểm giữa cạnh biên `x_mid, y_mid + W/2` đối với ống chạy ngang theo trục X, vì `GetEntity` bắt theo nét vẽ của block!).
  3. Gọi `ui_feature_run`:
```json
{
  "id": "hvac-cap",
  "inputs": ["30025,32300"]
}
```
  4. Kiểm tra lại bằng `get_entities_in_area` để xác nhận block đã đổi tên thành `HTS-CAP-{W}x{H}-L50`.

---

### 3.8. Trục đứng ống gió (`TRUCOG`) & Ống gió mềm (`NMC1..NMC3` / `NMH1..NMH3`)
1. **Trục đứng ống gió (`TRUCOG`)**:
   - Sinh block trục đứng chuẩn HTS (`HTS-TRUCOG-...`) có khung chữ nhật `W x H`, viền bao ngoài và đường chéo ký hiệu ống đứng; điểm chèn là **TÂM** tiết diện ống đứng.
   - Đặt `set_layer` đúng layer hệ ống trước, rồi gọi `send_command`:
   ```json
   {
     "command": "TRUCOG\n1700\n500\n10000,25000\n0\n"
   }
   ```
   *(Kiểm tra bằng `get_entities_in_area` sau khi gọi; nếu góc xoay khác 0 có thể dùng `rotate_entity` sau).*

2. **Ống gió mềm (`NMC1` cấp / `NMH1` hồi)**:
   - Khi bản vẽ có ống gió mềm nối ra hộp gió / miệng gió:
     1. Đặt `set_layer` về layer hệ thống tương ứng.
     2. Dùng `draw_polyline` hoặc `draw_spline` vẽ đường tim ống mềm trước.
     3. Gọi `send_command` chuyển đường vừa vẽ (`_L`) thành ống gió mềm HTS (ví dụ đường kính `Ø200` cấp lạnh):
     ```json
     {
       "command": "NMC1\n200\nC\n_L\n\n"
     }
     ```
     *(Với ống mềm hồi dùng `NMH1`; đầu cuối cắt phẳng dùng `NMC2` / `NMH2`; đầu bo tròn kín dùng `NMC3` / `NMH3`).*

---

### 3.9. Chèn Van gió (VCD, FD, MFD, MD, RND), Khớp nối mềm & Miệng gió từ Thư viện HTS (`Library\HVAC\`)

> **LƯU Ý QUAN TRỌNG**:
> - Tool `library_catalog` / `library_insert_block` chỉ quản lý 5 bảng `PCCC | TN | CN | DIEN | TBVS` (không có bảng `HVAC`).
> - Thẻ `hvac-insert-block` mở hộp thoại UI nên **TUYỆT ĐỐI KHÔNG gọi qua `ui_feature_run`**.
> - Thay vào đó, toàn bộ 14 Block động HVAC chuẩn của HTS nằm sẵn tại thư mục:  
>   `C:\Users\Nguye\AppData\Roaming\Autodesk\ApplicationPlugins\Htools.bundle\Contents\Windows\Library\HVAC\Phụ kiện\`  
>   *(chèn trực tiếp bằng `insert_block` / `batch_insert_blocks` + chỉnh kích thước bằng `set_dynamic_block_property` + điền nhãn bằng `set_all_block_attributes`!)*.

#### Bảng thông số kỹ thuật 14 Block Động Thư viện HTS HVAC (đã kiểm tra thực tế bằng `accoreconsole.exe`)

| Nhóm | Tên Block chuẩn HTS | Đơn vị gốc file `.dwg` | Tham số động (`set_dynamic_block_property`) | Tag Attribute (`set_all_block_attributes`) |
| :--- | :--- | :-: | :--- | :--- |
| **Van gió** | `HTS_Van gio vuong VCD` | `mm` (1:1) | `Width1` (= rộng ống `W`), `L` (dài thân van) | `NAME_FITTING` (`"VCD"`), `Duct` (`"W...xH..."`) |
| **Van gió** | `HTS_Van gio tron VCD` | ⚠️ `Inches` | `Width1` (= đường kính `D`) | `NAME_FITTING` (`"VCD"`), `Duct` (`"D..."`) |
| **Van chặn lửa** | `HTS_Van chan lua FD` | `mm` (1:1) | `Width1` (= rộng ống `W`), `L` (dài thân van) | `NAME_FITTING` (`"FD"`), `Duct` (`"W...xH..."`) |
| **Van chặn lửa** | `HTS_Van chan lua dieu khien bang motor MFD` | `mm` (1:1) | `Width1` (= rộng ống `W`), `L` (dài thân van) | `NAME_FITTING` (`"MFD"`), `Duct` (`"W...xH..."`) |
| **Van động cơ** | `HTS_Van gio vuong dieu chinh gio bang motor MD` | ⚠️ `Inches` | `Width1` (= rộng ống `W`) | `NAME_FITTING` (`"MD"`), `Duct` (`"W...xH..."`) |
| **Van động cơ** | `HTS_Van gio tron dieu chinh gio bang motor MD` | `mm` (1:1) | `Width1` (= đường kính `D`), `L` | `NAME_FITTING` (`"MD"`), `Duct` (`"D..."`) |
| **Van 1 chiều** | `HTS_Van gio mot chieu RND` | ⚠️ `Inches` | `Width1` (= rộng ống `W`) | `NAME_FITTING` (`"RND"`), `Duct` (`"W...xH..."`) |
| **Khớp mềm** | `HTS_Khop noi mem vuong` | `mm` (1:1) | `Width1` (= rộng ống `W`) | *(Không có attribute)* |
| **Khớp mềm** | `HTS_Khop noi mem tron` | `mm` (1:1) | `Width1` (= đường kính `D`) | *(Không có attribute)* |
| **Miệng gió** | `HTS_Mieng gio khuyech tan 4 huong` | `mm` (1:1) | `Width1` (cạnh phủ bì mặt) | `Duct` (`"600x600"` / cổ) |
| **Miệng gió** | `HTS_Mieng gio khuyech tan tron` | `mm` (1:1) | `Diameter` (đường kính) | `Duct` |
| **Miệng gió** | `HTS_Mieng gio louver` | `mm` (1:1) | `Width1` (rộng), `Distance1` (dài/dày), `Flip state1` | `Duct` |
| **Miệng gió** | `HTS_Mieng gio nan don` | `mm` (1:1) | `Width1`, `Width2` | `Duct` |
| **Miệng gió** | `HTS_Mieng gio sot trung` | `mm` (1:1) | `Width1`, `Width2` | `Duct` |

#### Quy trình chèn Block Thư viện HTS HVAC chuẩn xác 100%:
1. **Nạp & Chèn Block (`insert_block` / `batch_insert_blocks`)**:
   - Lần đầu tiên dùng một loại block trong bản vẽ (nếu `get_block_list` chưa có tên block đó), truyền đường dẫn đầy đủ tệp `.dwg` vào `blockName` của `insert_block`; từ lần thứ 2 trở đi chỉ cần truyền tên ngắn (ví dụ `"HTS_Van chan lua FD"`).
   - **Chú ý góc xoay**: Trong `insert_block` và `batch_insert_blocks`, tham số `rotation` tính bằng **RADIAN** (`0` = ngang `0°`, `1.5707963268` = đứng `90°`, `3.1415926536` = `180°`, `4.7123889804` = `270°`). Trong `rotate_entity`, tham số `angleDeg` mới tính bằng **ĐỘ**.
   - **Chú ý 3 file đơn vị `Inches`** (`HTS_Van gio tron VCD`, `HTS_Van gio vuong dieu chinh gio bang motor MD`, `HTS_Van gio mot chieu RND`): Hình vẽ bên trong file đã vẽ theo số mm nhưng biến `INSUNITS` của file `.dwg` thư viện đang để `Inches`. Ngay sau khi chèn lần đầu, gọi `get_bounding_box` kiểm tra: nếu kích thước bị nhân `25.4` lần (~`7620 mm`), đặt `scaleX: 0.0393700787, scaleY: 0.0393700787` (tức `1/25.4`)!
   - **Layer đặt thiết bị / van / miệng gió**: Theo `Spec-layer ký hiệu ống gió.dwg` là **`M-MVAC-Equipment` (ACI `47`)**.
2. **Cập nhật chiều rộng động `Width1` khớp 100% bề rộng ống `W` (`set_dynamic_block_property`)**:
   ```json
   {
     "handle": "1A2F",
     "propertyName": "Width1",
     "value": 1700
   }
   ```
   *(Bước này giúp van phủ khít 2 biên ống gió trên mặt bằng và không bị cảnh báo lọt lòng khi dựng `OG3D`!).*
3. **Cập nhật nhãn Attribute (`set_all_block_attributes`)**:
   ```json
   {
     "handle": "1A2F",
     "attributes": {
       "NAME_FITTING": "FD",
       "Duct": "W1700xH500"
     }
   }
   ```

---

### 3.10. Gán cao độ đáy ống gió & thiết bị, Rải giá đỡ, Ghi chú & Kích thước

1. **Gán cao độ đáy ống gió & phụ kiện (`duct_set_elevation`)**:
   - Ghi XData `HTS_OG_DAY` phục vụ dựng 3D (`OG3D` / `mep_build_3d_all`) và trích mặt cắt.
   ```json
   {
     "nhom": [
       {
         "handles": ["2B01", "2B02", "2B03"],
         "day": 2500
       }
     ]
   }
   ```
2. **Gán cao độ đáy cho Block van gió / miệng gió / thiết bị HVAC (`block_set_elevation_system`)**:
   ```json
   {
     "he": "HVAC",
     "z": 2500,
     "handles": ["1A2F", "1A30"]
   }
   ```
3. **Rải giá đỡ ống gió tự động (`place_supports`)** *(nếu cần triển khai giá đỡ)*:
   ```json
   {
     "mode": "duct",
     "spacing": 1800,
     "fitting_distance": 600,
     "handles": ["2B01", "2B02"]
   }
   ```
   *(Sau khi rải, chuyển các block `HTS-GIADO` về layer `M-MVAC-Support` màu `42` bằng `set_entity_properties`).*
4. **Ghi chú thông số ống gió (`draw_mtext` / `draw_mleader`) & Kích thước (`draw_linear_dim` / `draw_aligned_dim`)**:
   - Ghi chú đặt trên layer **`M-MVAC-TEXT`** (ACI `2`), theo đúng chuẩn 2 dòng của Spec:
     `SEAD-1700x500\PBOD=FFL+2500`
   - Đường kích thước đặt trên layer **`M-MVAC-DIM`** (ACI `97`).
5. **Tính diện tích tôn kiểm chứng (`compute_duct_surface_area`)**:
   ```json
   {
     "lengthScaleToMeter": 0.001
   }
   ```

---

### 3.11. Danh sách ĐEN các lệnh CẤM gọi tự động (Tránh treo AutoCAD chờ hộp thoại / chuột)
`@cad-drafter` **TUYỆT ĐỐI KHÔNG** gọi các lệnh/tool sau đây:
- ❌ `pick_points`, `select_and_export`, `open_query_tools` *(chờ người dùng click trên AutoCAD)*.
- ❌ `ui_feature_run` với `id`: `"hvac-duct"`, `"hvac-round"`, `"hvac-breeches"`, `"hvac-insert-block"`, `"hvac-acoustic"`, `"hvac-insulation"` *(kiểu `bang` mở giao diện)*.
- ❌ `ui_feature_run` với `id`: `"hvac-resize"` (`HTSDOIKTOG` — mở cửa sổ mô phỏng WPF Modal), `"hvac-edit"` (`HTS_DCTOG` — chờ rê chuột jig), `"hvac-tag"` (`HTS_TAGOG` — mở hộp thoại cấu hình tag).

---

## PHẦN 4. CÁCH KHOANH MÂY `REVCLOUD` CHUẨN TRONG AUTOCAD 2027 (KHÔNG BAO GIỜ TREO LỆNH)

Đã kiểm thử thực tế trực tiếp trên **AutoCAD 2027 Core Console (`X.118.0.0`)**:

> ⚠️ **CẢNH BÁO QUAN TRỌNG VỀ AUTOCAD 2027**:  
> Trong AutoCAD 2021–2027, tùy chọn `_A` (`Arc length`) của lệnh `_.REVCLOUD` **CHỈ HỎI MỘT CON SỐ DUY NHẤT** (`Specify approximate length of arc <...>:`), **KHÔNG hỏi 2 số Min/Max** như AutoCAD 2020 trở về trước! Nếu truyền 2 số liên tiếp (`300\n300\n`), số thứ hai sẽ bị đẩy vào prompt tiếp theo gây báo lỗi `Point or option keyword required`!

### Quy trình chuẩn số 1 (Khuyên dùng — Vẽ khung kín rồi chuyển sang `REVCLOUD` trên Layer `CLOUND`)
Áp dụng cho cả vùng chữ nhật lẫn vùng đa giác bất kỳ quanh các nét vẽ/ký hiệu chưa hiểu rõ trên bản vẽ thiết kế:

1. **Bước 1**: Đặt layer hiện hành là **`CLOUND`** (màu ACI `240` theo đúng `Spec-layer ký hiệu ống gió.dwg`):
   ```json
   // Tool: set_layer
   {
     "layerName": "CLOUND",
     "color": 240
   }
   ```
2. **Bước 2**: Vẽ hình chữ nhật `draw_rectangle` (hoặc đa giác kín `draw_polyline` với `"closed": true`) bao quanh khu vực chưa rõ (mở rộng biên `300–500 mm` để không đè sát nét thiết kế):
   ```json
   // Tool: draw_rectangle
   {
     "x1": 12000,
     "y1": 18000,
     "x2": 15500,
     "y2": 20500,
     "layer": "CLOUND"
   }
   ```
3. **Bước 3**: Gọi `send_command` biến đổi đối tượng vừa tạo (`_L` = Last) thành đám mây `REVCLOUD` chuẩn AutoCAD:
   ```json
   // Tool: send_command
   {
     "command": "_.REVCLOUD\n_A\n400\n_O\n_L\n_N\n"
   }
   ```
   - Giải thích từng dòng lệnh đã kiểm chứng 100%:
     - `_.REVCLOUD` : Gọi lệnh Revision Cloud gốc tiếng Anh.
     - `_A` → `400` : Đặt chiều dài cung xấp xỉ = `400 mm` *(dùng `250–300` cho chi tiết nhỏ, `400–600` cho cụm lớn)*.
     - `_O` → `_L` : Chọn đối tượng (`Object`) → đối tượng vừa tạo cuối cùng (`Last`).
     - `_N` : `Reverse direction [Yes/No] <No>:` → chọn `No` (bụng mây phình chuẩn ra ngoài) → AutoCAD tự xóa hình chữ nhật tạm, sinh `LWPOLYLINE` khép kín có `bulge = 0.520567` trên layer `CLOUND` và thoát về `Command:` sạch 100%!
4. **Bước 4 (Khuyến nghị kèm theo)**: Dùng `draw_mleader` trên layer `CLOUND` chỉ vào đám mây ghi ngắn gọn nội dung cần làm rõ (ví dụ: `"RFI-01: Chưa rõ ký hiệu / thiếu thông số kích thước ống"`), và kiểm tra `select_by_layer` `{"layerName": "CLOUND"}` để chắc chắn đám mây đã tạo thành công.

### Quy trình thay thế số 2 (Vẽ trực tiếp `REVCLOUD` hình chữ nhật chỉ bằng 1 lệnh `send_command`)
Sau khi `set_layer` `"CLOUND"`, có thể gọi trực tiếp:
```json
{
  "command": "_.REVCLOUD\n_A\n400\n_R\n12000,18000\n15500,20500\n"
}
```
*(Sinh ngay `LWPOLYLINE` đám mây chữ nhật khép kín `bulge = -0.520567` từ góc `(12000, 18000)` đến `(15500, 20500)` và kết thúc lệnh ngay lập tức, không hỏi thêm bất kỳ câu nào).*
