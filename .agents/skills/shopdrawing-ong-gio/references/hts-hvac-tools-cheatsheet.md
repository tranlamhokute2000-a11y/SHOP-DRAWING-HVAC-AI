# Cẩm Nang Cú Pháp MCP 100% HTS Tool HVAC & Toán Học Hình Học Tại Chỗ

Tài liệu kỹ thuật thực chiến tổng hợp toàn bộ công cụ vẽ ống gió, phụ kiện, van, miệng gió của **HTS Tool (`hts-autocad`, cổng `5088`)** và quy trình vẽ đè khít 100% ngay tại tọa độ thiết kế gốc (`In-Place Overlay`).

---

## 1. Danh Mục Tên Block Chuẩn Do HTS Sinh Ra (Dùng Để Tự Kiểm & Nghiệm Thu QA)

Mọi đối tượng ống gió & phụ kiện hợp lệ trên bản vẽ Shop Drawing bắt buộc mang tên Block thuộc hệ sinh thái HTS:
- **Ống thẳng chữ nhật**: `HTS-OG-{W}x{H} L{len}` *(VD: `HTS-OG-1700x500 L1110`)*
- **Ống thẳng tròn**: `HTS-OG-D{D} L{len}` *(VD: `HTS-OG-D400 L2500`)*
- **Cút bo góc chữ nhật**: `HTS-CO-V47-{W}x{H}-R{R}-A{goc}` *(hoặc `HTS-OG-CO-V47-...`)*
- **Cút vuông 90° / Cút cánh hướng**: `HTS-COV90-W{W}xH{H}-L{l1}` / `HTS-COCANHHUONG-W{W}xH{H}-L{l1}`
- **Cút tròn bo / Cút tròn lên–xuống**: `HTS-OG-CO-TRON-D{D}-R{R}-A{goc}` / `HTS-COLTR01-...` / `HTS-COXTR01-...`
- **Côn thu chữ nhật (đồng tâm / lệch trái / lệch phải)**: `HTS-CON-(Can|Trai|Phai)-{W1}x{H1}-{W2}x{H2}-L{L}`
- **Côn thu tròn**: `HTS-CON-TRON-(Can|Trai|Phai)-D{D1}-D{D2}-L{L}`
- **Chuyển tiếp Vuông–Tròn / Tròn–Vuông**: `HTS-VT-(Can|Trai|Phai)-{W}x{H}-D{D}-L{L}` / `HTS-TV-(Can|Trai|Phai)-D{D}-{W}x{H}-L{L}`
- **Chân rẽ gót giày (Shoe Tap / Takeoff)**: `HTS-TAP-(Can|Trai|Phai)-{W}x{H}-L{L}-D{loe}`
- **Chạc quần Y chia đôi (Breeches)**: `HTS-YQ-{W0}x{H0}-{W1}x{H1}-{W2}x{H2}-A{a}-L{l}-LC{lc}-K{c}`
- **Nắp bịt đầu ống (End Cap)**: `HTS-CAP-{W}x{H}-L{L}` / `HTS-CAP-TRON-D{D}-L{L}`
- **Trục đứng ống gió**: `HTS-TRUCOG-...` | **Giá đỡ**: `HTS-GIADO`
- **Block động Thư viện Phụ kiện HVAC (`Library\HVAC\Phụ kiện\`)**: `HTS_Van gio...`, `HTS_Van chan lua...`, `HTS_Khop noi mem...`, `HTS_Mieng gio...`

---

## 2. Giao Thức Khóa Tạm Layer Thiết Kế Cũ Khi Vẽ & Quét Phụ Kiện Tại Chỗ (`In-Place Overlay`)

Để vẽ trực tiếp ngay trên tọa độ thiết kế cũ mà lệnh `QUETPK` (`hvac-fitting-scan`) hoặc `hvac-cap` không bắt nhầm thực thể thiết kế gốc bên dưới:

1. **Trước khi vẽ & quét phụ kiện**: Khóa toàn bộ các layer của bản vẽ thiết kế cũ bằng `batch_process` (`set_layer_state`):
   ```json
   {
     "buoc": [
       { "tool": "set_layer_state", "args": { "layerName": "MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED", "locked": true } },
       { "tool": "set_layer_state", "args": { "layerName": "MEPG-M-EQUIP", "locked": true } },
       { "tool": "set_layer_state", "args": { "layerName": "MEPG-AC-TEXT", "locked": true } },
       { "tool": "set_layer_state", "args": { "layerName": "0", "locked": true } }
     ]
   }
   ```
2. **Thực hiện toàn bộ thao tác vẽ ống, `QUETPK`, `hvac-cap`, chèn van/miệng gió, `duct_set_elevation` ngay tại tọa độ gốc** trên các layer `M-MVAC-*` (đang `locked: false`).
3. **Sau khi hoàn tất**: Mở khóa trả lại nguyên trạng 100% (`locked: false`) cho toàn bộ các layer thiết kế cũ!

---

## 3. Vẽ Tuyến Ống Thẳng & Cút Bo Tự Động (`draw_rectangular_duct` & `draw_round_duct`)

### 3.1. Ống gió chữ nhật (`draw_rectangular_duct` — Ưu tiên chế độ Batch `runs`)
- `points` **luôn là tọa độ ĐƯỜNG TIM (`Centerline`)** của ống gió.
- Khi 1 `run` đi qua nhiều điểm `points` cùng tiết diện `W x H`, HTS tự động đặt cút bo `HTS-CO-V47-{W}x{H}-R{W/2}-A90` tại đỉnh giao 2 đường tim và tự động cắt lùi hai đầu ống thẳng khít vào mặt bích cút!

```json
{
  "runs": [
    {
      "W": 1700,
      "H": 500,
      "layer": "M-MVAC-SEAD",
      "prefix": "HTS",
      "points": [
        { "x": 36459.05, "y": 4108.26 },
        { "x": 36458.95, "y": 7455.34 },
        { "x": 44966.72, "y": 7455.77 },
        { "x": 44966.72, "y": 20994.85 }
      ]
    }
  ]
}
```

### 3.2. Toán học căn chỉnh Côn thu Đồng tâm (`Can`) vs Côn thu Lệch (`Trai` / `Phai`)
- **Côn đồng tâm (`Can`)**: Đường tim ống nhỏ `(W2)` nằm thẳng hàng trên đường tim ống lớn `(W1)`. Hai đầu mút của 2 `runs` dừng đúng tại tọa độ 2 mặt bích của côn trên thiết kế (cách nhau khoảng `L_con`, thường `200–204 mm` hoặc theo thực tế thiết kế như `650 mm`).
- **Côn lệch phẳng 1 biên (`Trai` / `Phai`)**:
  - Giả sử ống đứng chạy theo hướng `+Y` từ `W1 = 1450` thu về `W2 = 1100`, giữ phẳng biên phải tại `X_phai = 16554.9`:
    $$X_{\text{tim,1}} = X_{\text{phai}} - \frac{W_1}{2} = 15829.9, \qquad X_{\text{tim,2}} = X_{\text{phai}} - \frac{W_2}{2} = 16004.9$$
    $$\Delta X_{\text{dịch tim}} = \frac{W_1 - W_2}{2} = \frac{1450 - 1100}{2} = +175\text{ mm}$$
  - Khi hai đầu ống thẳng dừng đúng tại `Y_1` và `Y_2` với độ lệch tim `Δ = (W1 - W2)/2`, lệnh `QUETPK` sẽ tự động nhận diện khoảng hở chuyển tiếp và chèn đúng Block `HTS-CON-Phai-1450x400-1100x400-L650` trùng khít 100% biên thiết kế!

### 3.3. Ống gió tròn (`draw_round_duct`)
```json
{
  "runs": [
    {
      "D": 1250,
      "layer": "M-MVAC-SEAD",
      "prefix": "HTS",
      "points": [
        { "x": 41600.68, "y": 1250.22 },
        { "x": 41632.68, "y": 1250.22 }
      ]
    }
  ]
}
```

---

## 4. Tự Động Sinh Côn Thu (Khớp Đúng Chiều Dài Thiết Kế) & Chân Rẽ Gót Giày (`QUETPK` / `HTS_RVOG`)

### 4.1. Cú pháp `QUETPK` không hộp thoại (nhớ tắt `OSMODE = 0` tạm thời)
Lệnh `QUETPK` chỉ hỏi chọn đối tượng trên Command Line (không mở WPF dialog). Trước khi chạy, lưu giá trị `OSMODE` hiện tại (`get_current_settings`), đặt tạm `_.OSMODE\n0\n` (tránh bắt điểm lệch cửa sổ chọn), khóa tạm các layer thiết kế cũ, đặt `set_layer` về đúng layer `M-MVAC-<HỆ>`, rồi gọi:
```json
// Tool: ui_feature_run
{
  "id": "hvac-fitting-scan",
  "inputs": ["_C", "4000,-500", "46500,64500", ""]
}
```
*(Sau khi chạy xong khôi phục lại `OSMODE` cũ và mở khóa layer thiết kế cũ).*

> ⚠️ **Kinh nghiệm thực chiến về chiều dài Côn thu (`QUETPK` vs `HTS_RVOG`)**:
> - `QUETPK` yêu cầu 2 đầu ống khác cỡ **chạm đầu nhau (`gap ≈ 0`)** mới nhận diện sinh côn thu, và sinh côn mặc định chiều dài **`L = 500 mm`**.
> - Nếu bản vẽ thiết kế xuất từ Revit có côn thu ngắn hơn (ví dụ **`L = 204 mm`**, `L = 202 mm`) hoặc dài đặc thù (`L = 650 mm`) cần đè khít 100% hai mặt bích và đường vát thiết kế: sử dụng `ui_feature_run` `id: "hvac-revit-convert"` (`HTS_RVOG`) để sinh đúng block `*-CON-(Can|Trai|Phai)-{W1}x{H1}-{W2}x{H2}-L{L}` khớp `0.00 mm` thiết kế, đổi tên block sang tiền tố `HTS-CON-...`, kiểm tra bảo toàn 100% số lượng thực thể layer nền thiết kế gốc và giữ `DRAWORDER` lớp `M-MVAC-*` nằm trên nền gốc!

### 4.2. Kỹ thuật chuẩn tạo Chân rẽ Gót giày (`HTS-TAP-*`) trên sườn ống chính
Khi bản vẽ thiết kế có các cổ trích / gót giày vươn `150–200 mm` từ sườn ống chính:
1. Tại vị trí tâm cổ trích và điểm bám sườn ống chính, vẽ 1 đoạn ống thẳng mồi `draw_rectangular_duct` cùng cỡ cổ (ví dụ `W = 600, H = 300`) bắt từ sườn ống chính vươn vuông góc ra ngoài khoảng `300–400 mm` (`>= 250 mm` để `QUETPK` nhận diện nhánh rẽ).
2. Đặt `OSMODE = 0`, chạy `ui_feature_run` `"hvac-fitting-scan"` (`QUETPK`) quét qua vùng nhánh: HTS tự động cắt lùi đoạn ống mồi và chèn Block gót giày `HTS-TAP-(Trai|Phai)-600x300-L150-D150` bám khít sườn ống chính!
   - **Kiểm tra chiều vát `45°` của gót giày**: Vát `45°` luôn phải hướng về **phía thượng lưu chiều gió** (đối với hệ hút khói `SEAD`, vát `45°` hướng về phía quạt hút; kiểm tra `get_bounding_box` của `HTS-TAP-*` so với gót giày thiết kế gốc!).
3. Dùng `batch_erase_entities` xóa các đốt ống thẳng mồi dư nằm ngoài cổ `HTS-TAP-*`.
4. **Dừng tại cổ `HTS-TAP-*`** (tuyệt đối KHÔNG tự ý đặt block cửa gió/miệng gió nếu người dùng không yêu cầu!).

---

## 5. Chạc Quần Y (`duct_breeches_insert`), Cút Đặc Biệt (`place_duct_elbow`) & Bịt Đầu (`hvac-cap`)

### 5.1. Chạc quần chia đôi (`duct_breeches_insert`)
Luôn gọi bước 1 với `"xemTruoc": true` để lấy tọa độ chính xác của 3 miệng nối (`vao`, `trai`, `phai`), sau đó gọi `"xemTruoc": false` để chèn:
```json
{
  "vao": { "w": 2200, "h": 600 },
  "trai": { "w": 1700, "h": 600 },
  "phai": { "w": 1700, "h": 600 },
  "a": 150,
  "l": 1820,
  "lc": 910,
  "c": 100,
  "diem": { "x": 37579.39, "y": 2175.33 },
  "gocDo": 0,
  "day": 2450,
  "xemTruoc": false
}
```
*(Sau khi chèn, kiểm tra `layer` và dùng `set_entity_properties` chuyển về đúng `M-MVAC-<HỆ>` nếu cần).*

### 5.2. Cút vuông 90° / Cút cánh hướng / Cút tròn lên–xuống (`place_duct_elbow`)
```json
{
  "items": [
    { "point": { "x": 18500, "y": 25000 }, "type": "vaned", "l1": 300, "down": true }
  ]
}
```
*(`type`: `"square"` | `"vaned"` | `"riser_up"` | `"riser_down"`).*

### 5.3. Nắp bịt đầu ống gió (`hvac-cap` — `HTS-CAP-*`, Kỷ luật xóa đốt `< 100 mm` cuối tuyến)
1. **Kỷ luật gia công cuối tuyến**: **TUYỆT ĐỐI KHÔNG vẽ thêm đốt mỏng `< 100 mm`** (`L25`, `L50`, `L5`...) ở cuối tuyến ống gió! Nếu cuối tuyến có đốt lẻ `< 100 mm` phải xóa bỏ hoàn toàn; đốt ống gió thật còn lại (`L ≥ 100 mm`, VD `L610`, `L1110`, `L581`...) chính là đốt chuyển thành ống bịt đầu `HTS-CAP-{W}x{H}-L{len}`!
2. **Kiểm tra chiều `rotation` trước khi bịt đầu**: Chức năng `hvac-cap` (`_HG2M8Q7X`) đóng kín mặt phẳng bịt tại đầu `X = len` (theo chiều `rotation` của đốt ống). Nếu đốt cuối có `rotation` hướng ngược vào trong tuyến, vẽ lại đốt đó theo chiều hướng ra đầu cụt trước khi chuyển bịt đầu.
3. **Cú pháp gọi `hvac-cap` chính xác 100% bằng `(handent)` (không phụ thuộc Zoom/Pick chuột)**:
   ```json
   {
     "id": "hvac-cap",
     "inputs": ["(handent \"1D5A7\")"]
   }
   ```
4. Xác nhận block mới đã chuyển thành `HTS-CAP-{W}x{H}-L{len}` trên đúng layer `M-MVAC-<HỆ>` (`ByLayer`), **gán lại XData `HTS_OG_DAY`** bằng `duct_set_elevation` cho handle mới và chạy `purge_unused_blocks`.

---

## 6. Chèn Block Động Thư Viện Phụ Kiện HVAC (`Library\HVAC\Phụ kiện\`)

> ⚠️ **CẢNH BÁO KỶ LUẬT PHẠM VI**: Các block **Van gió (`VCD/FD/MFD/MD/NRD`)** và **Cửa gió / Miệng gió (`HTS_Mieng gio *`)** dưới đây **CHỈ ĐƯỢC PHÉP CHÈN KHI NGƯỜI DÙNG YÊU CẦU RÕ RÀNG!** Khi người dùng chỉ yêu cầu vẽ ống gió & phụ kiện ống gió, bắt buộc dừng tại cổ chân rẽ/gót giày `HTS-TAP-*` và tại 2 mặt bích van gốc trên nền thiết kế, tuyệt đối không tự ý đặt van gió hay cửa gió đè vào bản vẽ!

Thư mục gốc trên máy cài HTS:
`C:\Users\Nguye\AppData\Roaming\Autodesk\ApplicationPlugins\Htools.bundle\Contents\Windows\Library\HVAC\Phụ kiện\`

| Nhóm | Tên tệp / Tên Block chuẩn | Đơn vị gốc `.dwg` | Tham số động chính (`set_dynamic_block_property`) | Tag Attribute (`set_all_block_attributes`) |
| :--- | :--- | :-: | :--- | :--- |
| Van gió | `HTS_Van gio vuong VCD` | `mm` | `Width1` (= `W`), `L` (= `150`) | `NAME_FITTING`, `Duct` |
| Van gió | `HTS_Van gio tron VCD` | ⚠️ `Inches` | `Width1` (= `D`) | `NAME_FITTING`, `Duct` |
| Van chặn lửa | `HTS_Van chan lua FD` | `mm` | `Width1` (= `W`), `L` | `NAME_FITTING`, `Duct` |
| Van MFD | `HTS_Van chan lua dieu khien bang motor MFD` | `mm` | `Width1` (= `W`), `L` (= `150`) | `NAME_FITTING`, `Duct` |
| Van MD vuông | `HTS_Van gio vuong dieu chinh gio bang motor MD` | ⚠️ `Inches` | `Width1` (= `W`) | `NAME_FITTING`, `Duct` |
| Van MD tròn | `HTS_Van gio tron dieu chinh gio bang motor MD` | `mm` | `Width1` (= `D`), `L` | `NAME_FITTING`, `Duct` |
| Van 1 chiều | `HTS_Van gio mot chieu RND` | ⚠️ `Inches` | `Width1` (= `W`) | `NAME_FITTING`, `Duct` |
| Khớp mềm | `HTS_Khop noi mem vuong` | `mm` | `Width1` (= `W`) | *(Không có)* |
| Khớp mềm | `HTS_Khop noi mem tron` | `mm` | `Width1` (= `D`) | *(Không có)* |
| Miệng gió | `HTS_Mieng gio khuyech tan 4 huong` | `mm` | `Width1` (mặt phủ bì) | `Duct` |
| Miệng gió | `HTS_Mieng gio khuyech tan tron` | `mm` | `Diameter` | `Duct` |
| Miệng gió | `HTS_Mieng gio louver` | `mm` | `Width1` (rộng cổ), `Distance1` (dày), `Flip state1` | `Duct` |
| Miệng gió | `HTS_Mieng gio nan don` | `mm` | `Width1`, `Width2` | `Duct` |
| Miệng gió | `HTS_Mieng gio sot trung` | `mm` | `Width1`, `Width2` | `Duct` |

### Quy tắc vàng khi chèn Block động HVAC:
1. Lần đầu nạp vào bản vẽ: truyền đường dẫn đầy đủ `.dwg` vào `blockName` của `insert_block` trên `layer: "M-MVAC-Equipment"`; từ lần thứ 2 chỉ truyền tên Block ngắn.
2. **Đơn vị góc xoay**: `insert_block` / `batch_insert_blocks` nhận `rotation` theo **RADIAN** (`0`, `Math.PI/2 = 1.5707963268`, `Math.PI = 3.1415926536`, `3*Math.PI/2 = 4.7123889804`); còn `rotate_entity` nhận `angleDeg` theo **ĐỘ**.
3. **Kiểm soát 3 file gốc `Inches`**: Ngay sau khi chèn `HTS_Van gio tron VCD`, `HTS_Van gio vuong dieu chinh gio bang motor MD`, hoặc `HTS_Van gio mot chieu RND`, bắt buộc gọi `get_bounding_box`. Nếu kích thước bị nhân `25.4` lần (~`7620 mm` thay vì `300 mm`), phải đặt `scaleX = scaleY = 1/25.4` (`0.0393700787`) trước khi gán `Width1`!
4. **Thiết bị chưa có trong thư viện HTS** (như Quạt hướng trục khối riêng, Bộ tiêu âm khối `Silencer`...): **TUYỆT ĐỐI KHÔNG vẽ giả bằng Line/Rectangle**! Theo Quy tắc cứng số 3, nếu vùng đó đồng thời thiếu thông số kích thước/cao độ thì khoanh mây `REVCLOUD` và bỏ trống để hỏi người dùng.

---

## 7. Gán Cao Độ Đáy (`duct_set_elevation`), Khoanh Mây `REVCLOUD` & Các Tool QA Chỉ-Đọc

### 7.1. Gán cao độ đáy phục vụ dựng `OG3D` / `COMBINE 3D`
```json
// Tool: duct_set_elevation
{
  "nhom": [
    { "handles": ["11876", "11877"], "day": 2500 },
    { "handles": ["11890", "11891"], "day": 2545 }
  ]
}
```
Kiểm chứng bằng `get_xdata` với `{"handle": "11876", "appName": "HTS_OG_DAY"}` $\rightarrow$ trả về `code: 1040` chứa giá trị cao độ đáy!

### 7.2. Lệnh `_.REVCLOUD` chuẩn trên AutoCAD 2021–2027 (Không bao giờ treo lệnh)
Trong AutoCAD 2021–2027, tùy chọn `_A` (`Arc length`) chỉ hỏi **1 số duy nhất** (không hỏi Min/Max 2 lần như bản cũ):
```json
// Bước 1: set_layer {"layerName": "CLOUND", "color": 240}
// Bước 2: send_command
{
  "command": "_.REVCLOUD\n_A\n450\n_R\n39800,36950\n45850,40950\n"
}
```
*(Hoặc vẽ `draw_polyline` đa giác kín bao quanh vùng chưa hiểu rồi gọi `"_.REVCLOUD\n_A\n450\n_O\n_L\n_N\n"`).*

### 7.3. Lưu ý tham số chính xác của các Tool QA Chỉ-Đọc
- `select_by_layer`: tham số bắt buộc là **`{"layer": "M-MVAC-SEAD"}`** *(chú ý tên key là `layer`, KHÔNG phải `layerName`!)*.
- `get_layer_info`: tham số là **`{"layerName": "M-MVAC-SEAD"}`**.
- `get_entities_in_area`: `{"minX": ..., "minY": ..., "maxX": ..., "maxY": ...}` — dùng để quét từng khung mây `CLOUND` kiểm tra chắc chắn `0` thực thể `M-MVAC-*` lọt vào trong mây!
- `compute_duct_surface_area`: `{"lengthScaleToMeter": 0.001}` — kiểm tổng diện tích tôn `m²` của toàn bộ đốt ống chữ nhật `HTS-OG-*`.
- `export_plan_image`: xuất ảnh PNG tổng thể và ảnh Zoom từng cụm nối / đám mây kèm `grid: true`, sau đó dùng `read_file` mở ảnh PNG kiểm tra trực quan bằng mắt.

---

## 8. Danh Sách ĐEN Các Lệnh CẤM Gọi Tự Động (Chống Treo AutoCAD)

**TUYỆT ĐỐI KHÔNG BAO GIỜ GỌI** các công cụ/lệnh mở hộp thoại Modal hoặc chờ người dùng click chuột dưới đây:
- ❌ `pick_points`, `select_and_export`, `open_query_tools`
- ❌ `ui_feature_run` với `id`: `"hvac-duct"`, `"hvac-round"`, `"hvac-breeches"`, `"hvac-insert-block"`, `"hvac-acoustic"`, `"hvac-insulation"` *(mở bảng giao diện UI)*
- ❌ `ui_feature_run` với `id`: `"hvac-resize"` (`HTSDOIKTOG`), `"hvac-edit"` (`HTS_DCTOG`), `"hvac-tag"` (`HTS_TAGOG`)

---

## 9. Kinh Nghiệm Thực Chiến Bổ Sung (Đúc Kết Từ Triển Khai Bản Vẽ Xuất Revit)

1. **Chuẩn hóa `INSUNITS = 4` trước khi vẽ trên DWG xuất từ Revit**: Nhiều bản vẽ xuất từ Revit có tọa độ thực tế hệ `mm` nhưng cờ `INSUNITS = 1` (`Inches`). Luôn chạy `_.INSUNITS\n4\n` và `_.MEASUREMENT\n1\n` ngay Bước 1, rồi kiểm tra `get_bounding_box` đốt ống đầu tiên để tránh lỗi phóng `25.4x`.
2. **Bảo toàn 100% nền gốc khi chạy `HTS_RVOG` (`Xoagoc = KHÔNG`)**: Trong lệnh `HTS_RVOG` (`hvac-revit-convert`), tùy chọn `Xoagoc` mặc định là `CÓ` (có thể xóa thực thể trên cả layer đang khóa). Gửi tùy chọn `Xoagoc` → `KHÔNG` để sinh côn thu khớp đúng chiều dài thiết kế (`L202`/`L204`) mà vẫn giữ nguyên `100%` nền thiết kế gốc, sau đó chuyển về `M-MVAC-*` và đổi tiền tố block thành `HTS-CON-*`.
3. **Cút bán kính hẹp `0.75W` & Giao cắt 2D khác cao độ**:
   - Với cút bo bán kính trong hẹp `0.75W`, truyền tường minh `"R": 0.25 * W` (ví dụ `R: 225` cho `W = 900`) trong `draw_rectangular_duct`.
   - Khi 2 hệ ống gió giao cắt trên mặt bằng 2D ở cao độ khác nhau (VD `SEAD` đi dưới `PAD`), bắt buộc khóa tạm layer hệ còn lại (`M-MVAC-PAD`) và dùng cửa sổ quét cục bộ khi chạy `QUETPK`.
4. **Kiểm chứng & sửa hướng vát `45°` của toàn bộ `HTS-TAP-*`**: `QUETPK` sinh chiều vát mặc định không phụ thuộc chiều gió thực tế. Sau khi sinh `HTS-TAP-*`, luôn đối chiếu `get_bounding_box` với chiều gió thượng lưu / thiết kế gốc và dùng `mirror_entity` (`eraseSource: true`) qua trục cổ trích nếu bị ngược chiều vát.
5. **Bù độ phồng cung tròn của `_.REVCLOUD` (`~0.34 × arcLen`)**: Lệnh `_.REVCLOUD _A <arcLen> _R` phồng cung tròn ra ngoài khung chữ nhật đầu vào khoảng `0.34 × arcLen`. Tại các mép áp sát ống `M-MVAC-*`, thu lùi khung nhập vào `0.35 × arcLen + 15 mm` rồi kiểm chứng giao cắt Bounding Box chặt `= 0` để giữ tuyệt đối Quy tắc số 4.
6. **Chủ động đấu nối góc thiếu phụ kiện giữa 2 tuyến ống cùng hệ (Quy trình chuẩn đúc kết từ tình huống `RC-03`)**:
   - **Nhận diện**: Khi 2 tuyến ống thuộc cùng hệ thống (VD cùng `SEAD`) chạy hội tụ nhau (vuông góc `90°` hoặc góc nghiêng $\theta$ bất kỳ) mà thiết kế gốc để hở khoảng trống ở góc giao (thiếu nét cút nối, không có ký hiệu thiết bị hay đầu bịt) $\Rightarrow$ dựa vào nhãn Text trước & sau xác định người thiết kế vẽ sót phụ kiện; **KHÔNG khoanh mây `REVCLOUD`**, chủ động đấu nối hoàn chỉnh bằng 100% HTS Tool!
   - **Quy trình thực thi**:
     1. Tính chính xác giao điểm 2 đường tim $(X_{\text{giao}}, Y_{\text{giao}})$ và góc đổi hướng $\theta$ giữa 2 vector tim trục.
     2. **Hai tuyến cùng kích thước (`W1×H1 = W2×H2`)**: Vẽ liền 1 `run` đa điểm bằng `draw_rectangular_duct` từ mặt bích đốt trước $\rightarrow (X_{\text{giao}}, Y_{\text{giao}}) \rightarrow$ mặt bích đốt sau với bán kính cổ trong chuẩn **`"R": W / 2`** (HTS tự sinh cút `HTS-CO-V47-{W}x{H}-R{W/2}-A{goc}` đúng góc $\theta$ + đốt thẳng bù khít `0 mm`, không hở/không chồng).
     3. **Hai tuyến khác kích thước (`W1×H1 ≠ W2×H2`)**: Đấu nối bằng cút bo/chếch đúng góc $\theta$ với **`R = W / 2`** kết hợp thêm **côn thu (`HTS-CON-*`)** chuyển bậc bích-chạm-bích.
     4. Xóa đốt cụt tạm (nếu có), `purge_unused_blocks` block `0` instance, gán đủ `duct_set_elevation` (`HTS_OG_DAY = BOD`), đảm bảo `DRAWORDER` nằm trên nền gốc và sai số tim `< 1 mm`.
7. **Điều khiển chính xác chiều dài Côn thu & Chuyển Vuông–Tròn khi chạy `QUETPK` (Đúc kết từ `RC-01`)**:
   - **Ép chiều dài côn thu vuông `L < 500 mm` chuẩn gốc HTS**: Khi 2 ống khác cỡ chạm đầu nhau (`gap ≈ 0`), `QUETPK` tính chiều dài côn theo đoạn ống mồi ngắn hơn theo công thức $L_{\text{côn}} = \min\big(500,\; \lfloor L_{\text{mồi}} / 2 / 50 \rfloor \times 50\big)$. Ví dụ muốn sinh đúng block gốc **`HTS-CON-...-L200`** (thay vì `L500`), chỉ cần đặt đốt mồi dài `L_mồi = 410 mm` để `QUETPK` cắt ra đúng `L = 200 mm` khớp `0.00 mm` mặt bích thiết kế mà không cần `HTS_RVOG`!
   - **Côn chuyển Vuông–Tròn (`HTS-VT-*` / `HTS-TV-*`) dài hơn `500 mm`**: `QUETPK` giới hạn cứng chiều dài côn chuyển vuông–tròn tại `L = 500 mm` (yêu cầu `gap ≈ 0`). Nếu côn Revit gốc dài `L700` kèm cổ bích `32 mm` (không có cặp `LINE` thẳng để chạy `HTS_RVOG`), ghép chuỗi chuẩn HTS gồm đốt tròn `HTS-OG-D{D} L200` + `HTS-VT/TV-...-L500` + cổ vuông `HTS-OG-{W}x{H} L32` (tổng `732 mm` khớp khít `0.00 mm`, nằm gọn trong bao thiết kế, đủ XData `HTS_OG_DAY`).
   - **Kiểm tra mở khóa đủ 100% Layer (kể cả `CLOUND`)**: Sau mọi thao tác sửa cục bộ, kiểm chứng `get_layer_info` trên **tất cả các layer kể cả `CLOUND`** phải `is_locked = false` trước khi lưu bàn giao.
8. **Triển khai Vị trí Chuyển Cao Độ Đứng `ΔZ > 200 mm` (2 Chếch `45°` + 1 Đốt Bù + Trích Chi Tiết Mặt Đứng — Chuẩn Sếp Hồ & Spec v3)**:
   - **Điều kiện nhận diện**: Cùng 1 tuyến ống (`W × H`) có 2 cao độ đáy khác nhau $\Delta Z = |BOD_{\max} - BOD_{\min}| > 200\text{ mm}$ (VD `1000x350` từ `BOD +3150` xuống `+2500` $\Rightarrow \Delta Z = 650\text{ mm}$).
   - **Trên mặt bằng (2D Plan)**: Xóa đốt ống thẳng bắc cầu (nếu có); dừng 2 tuyến ống thẳng khít 2 mặt bích ngoài; vẽ `draw_rectangle` (`RECTANG`) bao đúng khung chuyển cao độ + `draw_polyline` 4 đỉnh dạng vát chéo chữ Z ở giữa (cùng layer `M-MVAC-<HỆ>`, `ByLayer`).
   - **Mẹo Hình Vuông `ΔZ × ΔZ` dựng Hình chiếu đứng bằng 100% `draw_rectangular_duct`**:
     - Đảo ngược tiết diện: **`W_đứng = H`**, **`H_đứng = W`**, bán kính trong **`R = H / 2`**.
     - Tính đoạn tiếp tuyến cút `45°`: $t = H(\sqrt{2} - 1) \approx 0.41421\,H$; chiều dài đốt bù nghiêng `45°`:
       $$L_{\text{bù}} = \Delta Z\sqrt{2} - 2t = \Delta Z\sqrt{2} - 2H(\sqrt{2} - 1)$$
       *(VD `1000x350, ΔZ=650`: $t = 144.97\text{ mm}$, $L_{\text{bù}} = 629.29 \approx 630\text{ mm}$).*
     - Gọi `draw_rectangular_duct` với **4 điểm tim trục** nối 2 góc đối diện của hình vuông `ΔZ × ΔZ` (không cần vẽ/xóa nét mồi thủ công!):
       - Bước **XUỐNG** (trái → phải): `(x_sq - t, y_sq + ΔZ) → (x_sq, y_sq + ΔZ) → (x_sq + ΔZ, y_sq) → (x_sq + ΔZ + t, y_sq)`.
       - Bước **LÊN** (trái → phải): `(x_sq - t, y_sq) → (x_sq, y_sq) → (x_sq + ΔZ, y_sq + ΔZ) → (x_sq + ΔZ + t, y_sq + ΔZ)`.
       - HTS tự sinh chính xác **2 cút `HTS-CO-V47-{H}x{W}-R{H/2}-A45` + 1 đốt bù `HTS-OG-{H}x{W} L{L_bù}`** (0 đốt thừa!). Gán `HTS_OG_DAY = min(BOD₁, BOD₂)` cho cả 3 block.
   - **Dim chi tiết + Khoanh mây trích + Mũi tên chỉ dẫn (Spec v3 — KỶ LUẬT CHỐNG LỆCH DIM & MŨI TÊN)**:
     - **TUYỆT ĐỐI KHÔNG lấy tọa độ bắt điểm Dim từ `get_bounding_box` của block cút xoay `45°`/`315°`** *(vì hộp bao block xoay + tai bích TDC phình dư `140–225 mm` khiến đường Dim bị tụt lệch khỏi mép ống!)*. **BẮT BUỘC** tính điểm bắt Dim chính xác `0.000 mm` trực tiếp từ tọa độ điểm chèn 2 cút `HTS-CO-V47-*` `(xL_vtx, yL_vtx)` và `(xR_vtx, yR_vtx)`:
       - Mặt bích đứng trái: `xLeft = xL_vtx - t`, `y ∈ [yL_vtx - H/2, yL_vtx + H/2]`; mặt bích đứng phải: `xRight = xR_vtx + t`, `y ∈ [yR_vtx - H/2, yR_vtx + H/2]`.
       - 2 góc ngoài của đốt bù nghiêng `45°` (`dOff = t/√2`, `wOff = H/(2√2)`):
         - Bước XUỐNG: `(xL_vtx + dOff + wOff, yL_vtx - dOff + wOff)` → `(xR_vtx - dOff + wOff, yR_vtx + dOff + wOff)` (`offset: 200`).
         - Bước LÊN: `(xR_vtx - dOff + wOff, yR_vtx - dOff - wOff)` → `(xL_vtx + dOff + wOff, yL_vtx + dOff - wOff)` (`offset: 340` để chữ không đè cút dưới).
     - Đặt `_.-DIMSTYLE\n_R\nHỒ-DIM 1-70\n` trước khi vẽ 3 Dim trên Layer `M-MVAC-DIM`.
     - Khoanh mây `_.REVCLOUD\n_A\n200\n_R\n...` trên Layer `CLOUND` với `pad = 150 mm` bao gọn cả 3 block + 3 Dim.
     - **Mũi tên chỉ dẫn (`LEADER`) chuẩn 100% Spec bằng mẹo `MATCHPROP`**: `draw_leader` mặc định tạo đầu mũi tên siêu nhỏ không khớp Spec. Sau khi vẽ toàn bộ `draw_leader` dài `~1260 mm` từ cạnh mây chỉ vào trung điểm cạnh khung chữ nhật, **BẮT BUỘC** dùng mũi tên chuẩn từ Spec (copy tạm ra góc làm mồi nếu bản vẽ chưa có, xong xóa mồi) rồi chạy **`_.MATCHPROP\n(handent "<src>")\n(handent "<dst1>")\n...\n\n`** để đồng bộ tuyệt đối `DimStyle = DIM 1-1` + `XDATA DSTYLE (DIMASZ = 300.0)` + Layer `M-MVAC-DIM` và xác nhận bằng DXF `(entget (handent h) '("*"))`!
