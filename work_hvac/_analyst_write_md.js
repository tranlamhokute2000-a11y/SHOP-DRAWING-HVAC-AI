const fs = require("fs");

const NET_PATH = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_duct_network.json";
const OUT_MD = "C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_hvac_design_analysis.md";

const net = JSON.parse(fs.readFileSync(NET_PATH, "utf8"));

const lines = [];
lines.push(`# HỒ SƠ PHÂN TÍCH KỸ THUẬT BẢN VẼ THIẾT KẾ ỐNG GIÓ HVAC`);
lines.push(`**Tệp bản vẽ khảo sát**: \`C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\shop drawwing onng gio.dwg\``);
lines.push(`**Chuyên gia thực hiện**: \`plan-analyst\` (Chế độ 100% Read-Only qua HTS MCP + \`accoreconsole.exe\` AutoLISP + Phân tích hình học)`);
lines.push(`**Dữ liệu cấu trúc đi kèm**: \`C:\\Users\\Nguye\\Desktop\\SHOP DRAWING-AI\\work_hvac\\02_duct_network.json\` & \`02_raw_entities.json\``);
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## 1. Tổng Quan Bản Vẽ & Kiểm Tra Đồng Bộ Phiên AutoCAD Đang Mở vs. Tệp Trên Đĩa`);
lines.push(``);
lines.push(`- **Đơn vị bản vẽ (\`INSUNITS\`)**: \`Millimeters\` (mm)`);
lines.push(`- **Phạm vi hình học (\`Extents\`)**: \`min = (4390.11, -4344.41)\` → \`max = (45848.62, 63989.85)\` (Kích thước vùng bản vẽ ~ \`41.46 m × 68.33 m\`)`);
lines.push(`- **Tổng số Layer**: \`8\` layers (\`0\`, \`MEPG-XREF-ARC\`, \`MEPG-M-EQUIP\`, \`MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED\`, \`MEPG-AC-M-Cấp gió tạo áp-Pressurization Air-PAD\`, \`MEPG-AC-M-Cấp gió tươi không khí-Fresh Air-FAD\`, \`MEPG-AC\`, \`MEPG-AC-TEXT\`) — trong đó chỉ có **4 layer chứa đối tượng**.`);
lines.push(`- **Đối chiếu số lượng thực thể giữa Phiên AutoCAD đang mở (cổng 5088) và File lưu trên đĩa**:`);
lines.push(`  - File trên đĩa (\`temp_design_copy.dwg\`): **228 thực thể** (\`99 LINE\` + \`34 MTEXT\` + \`95 INSERT\`).`);
lines.push(`  - Phiên AutoCAD đang mở trực tiếp: **229 thực thể** (\`99 LINE\` + \`34 MTEXT\` + \`95 INSERT\` + **\`01 LWPOLYLINE\` chưa lưu**).`);
lines.push(`  - **Phát hiện 02 thay đổi chưa nhấn Save (\`Ctrl+S\`) trên phiên AutoCAD đang mở** (đã được đồng bộ 100% vào dữ liệu phân tích):`);
lines.push(`    1. Toàn bộ **17 nhãn kích thước \`MTEXT\`** trên layer \`MEPG-AC-TEXT\` đã được đổi tiền tố từ \`"SED-..."\` (trên đĩa) thành **\`"SEAD-..."\`** (trên AutoCAD đang mở) để khớp với ký hiệu chuẩn \`SEAD\` của file Spec.`);
lines.push(`    2. Có thêm **01 thực thể \`LWPOLYLINE\` dạng đám mây \`REVCLOUD\`** (\`Handle = 10E5A\`, Layer \`"0"\`, \`bbox = [5412.24, -4344.41 .. 10793.01, -1590.79]\`) nằm ở khoảng trắng góc dưới bên trái (không bao quanh đối tượng nào — khả năng là nét test \`REVCLOUD\` mẫu của Sếp Hồ với bước cung ~\`450–550 mm\`). **Lưu ý cho \`@cad-drafter\`**: Giữ nguyên \`10E5A\` không xóa, và dùng bước cung ~\`500 mm\` tương tự khi vẽ các \`REVCLOUD\` hỏi Sếp.`);
lines.push(`- **Lưu ý góc xoay trục cực nhỏ từ Revit**: Các tuyến ống dài xuất từ mô hình Revit có độ nghiêng lưới cực nhỏ \`~0.00485°\` (\`dx ≈ -1.34 mm\` trên chiều dài \`15,844 mm\`). Tọa độ tim dưới đây giữ nguyên chính xác đến \`0.01 mm\` theo đúng hình học thực tế để vẽ đè khít 100% lên bản thiết kế.`);
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## 2. Nhận Diện Hệ Thống HVAC & Bảng Quy Đổi Layer Sang Chuẩn Spec`);
lines.push(``);
lines.push(`- **Chủng loại hệ thống**: Bản vẽ thể hiện **01 hệ thống duy nhất** là **Hệ thống Ống gió Hút khói Sự cố Tầng hầm B1 (\`Smoke Exhaust Air Duct - SEAD\`)**, tiêu chuẩn chống cháy **\`EI60\`**, kết nối bích nẹp **\`TDC Flange\`** (xuất từ View Revit \`MB HỆ THỐNG ĐHKK HẦM B1\`).`);
lines.push(`- **Nguyên lý làm việc & Chiều dòng không khí**:`);
lines.push(`  - Khi có sự cố cháy tại tầng hầm B1, khói được hút qua **24 miệng gió hút khói kèm van điều chỉnh lưu lượng (\`EAG_OBD 600x300mm\`)** gắn trên 24 chân rẽ gót giày dọc hai nhánh chính:`);
lines.push(`    1. **Nhánh Trái (\`LEFT_BRANCH\`, gồm 09 miệng gió)**: bắt đầu từ đầu bịt \`550x350\` tại \`(16001.87, 52835.08)\` thu gom khói đi về phía Nam tăng dần tiết diện \`550x350 → 800x400 → 1100x400 → 1450x400\`, rẽ cút 90° sang phía Đông \`1450x400 → 1600x450\`, qua van \`VCD\` (\`10B17\`) và côn mở \`1600x450 → 2200x600\` vào ống góp chính.`);
lines.push(`    2. **Nhánh Phải & Tuyến Trên (\`RIGHT_TOP_BRANCH\`, gồm 15 miệng gió)**: bắt đầu từ đầu bịt \`550x350\` góc Tây-Bắc tại \`(4415.11, 59204.66)\`, qua 2 cút bậc thang lên tuyến ngang phía Bắc đi sang Đông \`550x350 → 800x400 → 950x450\`, rẽ cút 90° đi về phía Nam dọc biên Đông qua 2 cụm chuyển hướng tránh kết cấu (Jog #2 và Jog #1) tăng dần tiết diện \`950x450 → 1150x500 → 1400x500 → 1700x500\`, qua van \`VCD\` (\`10BAE\`) và đấu vào sườn Bắc của ống góp chính \`2200x600\` qua chân rẽ gót giày \`1700x500\` (\`10D51\`).`);
lines.push(`  - Từ **Ống góp chính \`SEAD-2200x600\` (\`BOD=FFL+2450\`)**, luồng khói chia đôi qua **Chạc quần (\`Trouser Piece 10CBD\`)** vào **02 cụm Quạt hướng trục hút khói song song (\`Kruger Axial Fan TDC 1250\`, \`10CA7\` & \`10CA5\`)**, mỗi cụm gồm: \`Van chặn lửa động cơ MFD-EI60 → Côn tăng chiều cao 1700x600/1000 → Tiêu âm hút W1700xH1000xL900 → Côn Vuông-Tròn Ø1250 → Khớp mềm tròn Ø1250 → Quạt trục TDC 1250 → Khớp mềm tròn Ø1250 → Côn Tròn-Vuông 1250x1400 → Tiêu âm đẩy W1250xH1400xL900 → Van một chiều NRD → Van MFD-EI60 → Đầu ống thải ra trục/louver tại X = 45603.42\`.`);
lines.push(``);
lines.push(`| Hạng mục | Layer trên bản vẽ thiết kế | Layer chuẩn (\`Spec-layer ký hiệu ống gió.dwg\`) | Màu chuẩn (ACI) | Ghi chú |`);
lines.push(`| --- | --- | --- | :---: | --- |`);
lines.push(`| Ống gió & Phụ kiện hút khói (\`SEAD\`) | \`MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED\` | **\`M-MVAC-SEAD\`** | **190** | Bắt buộc vẽ bằng 100% HTS Tool |`);
lines.push(`| Thiết bị cơ (\`Quạt hút khói\`) | \`MEPG-M-EQUIP\` | **\`M-MVAC-Equipment\`** | **47** | 02 Quạt hướng trục Kruger TDC 1250 |`);
lines.push(`| Chữ ghi chú kích thước & cao độ | \`MEPG-AC-TEXT\` | **\`M-MVAC-TEXT\`** | **2** | 34 MTEXT (\`SEAD-WxH\` + \`BOD=FFL+...\`) |`);
lines.push(`| Đường kích thước (\`Dim\`) | *(Chưa có)* | **\`M-MVAC-DIM\`** | **97** | Dùng khi Dim kích thước Shop Drawing |`);
lines.push(`| Đám mây khoanh vùng hỏi Sếp (\`REVCLOUD\`) | \`0\` (1 mây test \`10E5A\`) | **\`CLOUND\`** | **240** | Khoanh mây \`RC-01\` .. \`RC-08\` |`);
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## 3. Quy Luật Cao Độ (\`BOD\` / \`TOD\`) & Bảng Tuyến Chạy Liên Tục Cho HTS Tool (\`16 Runs\`)`);
lines.push(``);
lines.push(`### 3.1. Giải mã quy luật cao độ 3D của thiết kế`);
lines.push(`1. **Ống góp chính (\`SEG-M01\`, \`2200x600\`)**: \`BOD = FFL+2450\` → Tim ống \`Z = +2750\`, Đỉnh ống \`TOD = +3050\`.`);
lines.push(`2. **Toàn bộ Nhánh Trái (\`1600x450 → 1450x400 → 1100x400 → 800x400 → 550x350\`)**: Đi **PHẲNG ĐÁY (\`Flat Bottom\`, \`BOD = FFL+2500\`)** xuyên suốt toàn tuyến!`);
lines.push(`3. **Nhánh Phải phần dưới (\`1700x500 → 1400x500\`, từ \`Y = 3427\` đến \`Y = 37128\`)**: Đi **PHẲNG ĐÁY (\`BOD = FFL+2500\`, \`H = 500\`, \`TOD = +3000\`, Tim \`Z = +2750\` — đồng tâm cao độ với ống góp \`2200x600\`)**.`);
lines.push(`4. **Bước nhảy cao độ \`+45 mm\` tại Jog #2 (\`Y = 37332 .. 40735\`)**: Trong mô hình Revit 3D gốc, đoạn ống ngang Jog #2 (\`W=1150, H=500\`) bị nghiêng dốc ~\`1.09°\` làm xuất hiện **nét đôi lệch \`9.49 mm\`** trên mặt bằng và nâng đáy ống từ \`BOD = FFL+2500\` lên **\`BOD = FFL+2545\`** (đã đánh dấu khoanh mây **\`RC-03\`**).`);
lines.push(`5. **Nhánh Phải phần trên & Tuyến Ngang Phía Bắc (\`1150x500 → 950x450 → 800x400 → 550x350\`, từ \`Y = 40735\` đến hết tuyến)**: Đi **PHẲNG ĐỈNH (\`Flat Top\`, \`TOD = FFL+3045\`)**! Cụ thể khi \`H\` giảm \`50 mm\` qua mỗi côn thu (\`500 → 450 → 400 → 350\`), \`BOD\` tăng tương ứng \`+50 mm\` (\`+2545 → +2595 → +2645 → +2695\`).`);
lines.push(``);
lines.push(`### 3.2. Bảng 16 Tuyến Ống Chữ Nhật Chạy Liên Tục (\`hts_continuous_runs\`)`);
lines.push(`> Dành trực tiếp cho \`@cad-drafter\` gọi \`draw_rectangular_duct\` (các tuyến cùng tiết diện \`WxH\` đi qua đỉnh góc sẽ tự động sinh cút vuông 90° đúng vị trí):`);
lines.push(``);
lines.push(`| Mã Run | Kích thước \`W×H\` (mm) | \`BOD\` (FFL+) | Cút 90° tự động | Chuỗi tọa độ tim \`(X, Y)\` chính xác | Các phân đoạn cấu thành |`);
lines.push(`| --- | :---: | :---: | :---: | --- | --- |`);
for (const r of net.hts_continuous_runs) {
  const ptsStr = r.points
    ? r.points.map((p) => `(${p[0]}, ${p[1]})`).join(" → ")
    : r.sub_runs.map((sr) => `${sr.seg}[${sr.W}x${sr.H}]: (${sr.p1[0]},${sr.p1[1]})→(${sr.p2[0]},${sr.p2[1]})`).join("<br>");
  lines.push(`| **\`${r.run_id}\`** | \`${r.W}×${r.H}\` | \`+${r.bod_ffl}\` | ${r.auto_elbows} | ${ptsStr} | \`${r.segment_ids.join(", ")}\` |`);
}
lines.push(``);
lines.push(`### 3.3. Bảng Chi Tiết Toàn Bộ 34 Phân Đoạn Ống Thẳng & Ghép Nhãn \`MTEXT\` (100%)`);
lines.push(``);
lines.push(`| Mã Đoạn | Nhánh | \`W×H\` (mm) | \`BOD\` | Điểm đầu tim \`(x1, y1)\` | Điểm cuối tim \`(x2, y2)\` | Dài \`L\` (mm) | Nhãn Size (\`Handle\`) | Nhãn BOD (\`Handle\`) | Nguồn xác định |`);
lines.push(`| --- | --- | :---: | :---: | --- | --- | ---: | --- | --- | --- |`);
for (const s of net.duct_segments) {
  const szLbl = s.labels.size_mtext_handle ? `\`${s.labels.size_text_live}\` (\`${s.labels.size_mtext_handle}\`)` : `*(Trống)*`;
  const bodLbl = s.labels.bod_mtext_handle ? `\`${s.labels.bod_text}\` (\`${s.labels.bod_mtext_handle}\`)` : `*(Trống)*`;
  lines.push(
    `| \`${s.id}\` | \`${s.branch}\` | **\`${s.width_W}×${s.height_H}\`** | \`${s.bod_ffl !== null ? "+" + s.bod_ffl : "N/A"}\` | \`(${s.centerline.x1}, ${s.centerline.y1})\` | \`(${s.centerline.x2}, ${s.centerline.y2})\` | \`${s.length_mm}\` | ${szLbl} | ${bodLbl} | \`${s.size_source}\` |`
  );
}
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## 4. Giải Mã 100% Phụ Kiện, Thiết Bị, Van Gió & Miệng Gió (\`95 Block + 01 Côn Vẽ Tay\`)`);
lines.push(``);
lines.push(`### 4.1. Cút Vuông 90° (\`10 Cút - Bán kính cổ trong R_in = 0.5×W, R_tim = 1.0×W\`)`);
lines.push(``);
lines.push(`| Mã | Handle | Kích thước \`W×H\` | Bán kính trong \`R_in\` | Giao điểm 2 tim \`(cx, cy)\` | Cổng 1 \`(x, y)\` | Cổng 2 \`(x, y)\` | Hướng rẽ |`);
lines.push(`| --- | :---: | :---: | :---: | --- | --- | --- | --- |`);
for (const e of net.fittings_and_accessories.elbows) {
  lines.push(
    `| \`${e.id}\` | \`${e.handle}\` | \`${e.W}×${e.H}\` | \`${e.throat_radius_mm}\` | \`(${e.corner_centerline[0]}, ${e.corner_centerline[1]})\` | \`(${e.port1[0]}, ${e.port1[1]})\` | \`(${e.port2[0]}, ${e.port2[1]})\` | ${e.turn} |`
  );
}
lines.push(``);
lines.push(`### 4.2. Côn Thu Vuông & Côn Chuyển Vuông-Tròn (\`16 Phụ kiện chuyển tiết diện\`)`);
lines.push(``);
lines.push(`| Mã | Handle | Loại phụ kiện | Kiểu đồng tâm / lệch tâm (Mặt bằng) | Tiết diện 1 → Tiết diện 2 | Dài \`L\` (mm) | Cổng 1 \`(x, y)\` | Cổng 2 \`(x, y)\` |`);
lines.push(`| --- | :---: | --- | --- | :---: | ---: | --- | --- |`);
for (const r of net.fittings_and_accessories.reducers_transitions) {
  const hStr = r.handle ? `\`${r.handle}\`` : `\`${r.handles.join(",")}\``;
  const szStr =
    r.kind === "SQUARE_TO_ROUND"
      ? `\`${r.W1}×${r.H1}\` → \`Ø${r.D2}\``
      : r.kind === "ROUND_TO_SQUARE"
      ? `\`Ø${r.D1}\` → \`${r.W2}×${r.H2}\``
      : `\`${r.W1}×${r.H1}\` → \`${r.W2}×${r.H2}\``;
  lines.push(
    `| \`${r.id}\` | ${hStr} | \`${r.kind}\` | \`${r.plan_alignment || "concentric"}\` | ${szStr} | \`${r.length_mm}\` | \`(${r.port1[0]}, ${r.port1[1]})\` | \`(${r.port2[0]}, ${r.port2[1]})\` |`
  );
}
lines.push(``);
lines.push(`### 4.3. Phụ Kiện Chia Nhánh Chính (\`01 Chạc Quần Trouser Piece + 01 Gót Giày Nhánh Chính 1700×500\`)`);
lines.push(`- **\`BR-01-TROUSER\` (\`Handle: 10CBD\`)**: Chạc quần chia đôi đối xứng (\`Trouser Piece / Breeches\`), dài \`L = 1820 mm\`, đầu chung bên trái \`(37579.39, 2175.33)\` cỡ \`2200×600\` chia thành 2 đầu nhánh bên phải cỡ \`1700×600\` tại \`(39399.39, 1250.33)\` và \`(39399.39, 3100.33)\` (khoảng cách mép trong giữa 2 nhánh = \`150 mm\`).`);
lines.push(`- **\`BR-02-MAIN-TAP\` (\`Handle: 10D51\`)**: Chân rẽ gót giày lớn cỡ cổ \`1700×500\` (đáy rộng \`1850 mm\`, vát 45° bên phải \`150 mm\`, cao \`152 mm\`), trích từ thành Bắc ống góp \`2200×600\` tại \`(36459.09, 3275.33)\` ra cổ nhánh tại \`(36459.09, 3427.34)\`.`);
lines.push(``);
lines.push(`### 4.4. Thiết Bị Chính, Tiêu Âm, Van Gió, Khớp Nối Mềm & Nắp Bịt Đầu Ống`);
lines.push(``);
lines.push(`| Nhóm | Mã | Handle | Chủng loại / Quy cách | Kích thước | Dài \`L\` | Tâm / Vị trí lắp đặt \`(X, Y)\` |`);
lines.push(`| --- | --- | :---: | --- | :---: | ---: | --- |`);
for (const eq of net.fittings_and_accessories.equipment) {
  const sz = eq.diameter_D ? `Ø${eq.diameter_D}` : `${eq.W}×${eq.H}`;
  const pos = eq.center ? `(${eq.center[0]}, ${eq.center[1]})` : `(${eq.port1[0]}, ${eq.port1[1]})→(${eq.port2[0]}, ${eq.port2[1]})`;
  lines.push(`| Thiết bị | \`${eq.id}\` | \`${eq.handle}\` | ${eq.model} | \`${sz}\` | \`${eq.length_mm}\` | \`${pos}\` |`);
}
for (const d of net.fittings_and_accessories.dampers) {
  lines.push(`| Van gió | \`${d.id}\` | \`${d.handle}\` | \`${d.kind}\` (${d.orientation}) | \`${d.W}×${d.H}\` | \`${d.length_mm}\` | \`(${d.center[0]}, ${d.center[1]})\` |`);
}
for (const f of net.fittings_and_accessories.flexible_connectors) {
  lines.push(`| Khớp mềm | \`${f.id}\` | \`${f.handle}\` | Khớp nối mềm tròn chống rung | \`Ø${f.diameter_D}\` | \`${f.length_mm}\` | \`(${f.port1[0]}, ${f.port1[1]})→(${f.port2[0]}, ${f.port2[1]})\` |`);
}
for (const c of net.fittings_and_accessories.end_caps) {
  lines.push(`| Bịt đầu | \`${c.id}\` | \`${c.handle}\` | Nắp bịt đầu ống gió EI60 (${c.direction}) | \`${c.W}×${c.H}\` | \`${c.thickness_mm}\` | \`(${c.attach_point[0]}, ${c.attach_point[1]})\` |`);
}
lines.push(``);
lines.push(`### 4.5. Bảng Toàn Bộ 24 Cụm Chân Rẽ Gót Giày + Miệng Gió Hút Khói \`EAG_OBD 600×300mm\``);
lines.push(`> Cả 24 bộ có cùng cấu tạo tiêu chuẩn: Gót giày đế \`750 mm\` thu vát 1 bên về cổ \`600×300 mm\`, vươn ra \`150 mm\` từ mép sườn ống chính, gắn trực tiếp miệng gió hút khói kèm van OBD \`EAG_OBD 600×300mm\` (phủ bì mặt \`630 mm\`).`);
lines.push(``);
lines.push(`| Mã Bộ | Đoạn ống chủ | Hướng thổi/hút | Handle Gót giày | Handle Miệng gió | Điểm bám thành ống \`(X, Y)\` | Tâm cổ miệng gió \`(X, Y)\` | Tâm mặt miệng gió \`(X, Y)\` |`);
lines.push(`| --- | :---: | :---: | :---: | :---: | --- | --- | --- |`);
for (const gt of net.fittings_and_accessories.grille_tap_assemblies) {
  lines.push(
    `| \`${gt.id}\` | \`${gt.host_segment_id}\` | \`${gt.direction}\` | \`${gt.tap_handle}\` | \`${gt.grille_handle}\` | \`(${gt.duct_wall_attach_point[0]}, ${gt.duct_wall_attach_point[1]})\` | \`(${gt.neck_center_point[0]}, ${gt.neck_center_point[1]})\` | \`(${gt.grille_face_center[0]}, ${gt.grille_face_center[1]})\` |`
  );
}
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## 5. Danh Sách Khung Bao \`REVCLOUD\` (\`RC-01\` .. \`RC-08\`) Giao \`@cad-drafter\` Khoanh Mây Hỏi Sếp Hồ`);
lines.push(``);
lines.push(`> **Quy cách vẽ đề xuất cho \`@cad-drafter\`**: Vẽ trên Layer **\`CLOUND\`** (Màu **ACI 240**, Lineweight \`0.20 mm\` theo đúng \`Spec-layer ký hiệu ống gió.dwg\`), bước cung mây \`Arc Length ≈ 450–550 mm\` (đồng bộ với mây mẫu \`10E5A\` của Sếp Hồ).`);
lines.push(``);
lines.push(`| Mã Mây | Mức độ | Tọa độ khung bao \`(minX, minY, maxX, maxY)\` | Handle liên quan | Vấn đề kỹ thuật / Câu hỏi cần trình Sếp Hồ xác nhận |`);
lines.push(`| --- | :---: | --- | --- | --- |`);
for (const rc of net.revcloud_regions) {
  const b = rc.bbox;
  lines.push(
    `| **\`${rc.id}\`** | \`${rc.severity}\` | \`(${b.minX}, ${b.minY}, ${b.maxX}, ${b.maxY})\` | \`${rc.affected_handles.slice(0, 6).join(", ")}${rc.affected_handles.length > 6 ? "..." : ""}\` | **${rc.title}**: ${rc.question_for_sep_ho} |`
  );
}
lines.push(``);

fs.writeFileSync(OUT_MD, lines.join("\n"), "utf8");
console.log("Successfully generated 02_hvac_design_analysis.md! Lines:", lines.length);
