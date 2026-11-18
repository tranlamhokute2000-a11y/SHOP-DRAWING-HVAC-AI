HTS Software · Hướng dẫn cho người dùng

# Thư viện, Block 3D & Spec

Thư viện block HTS được sắp xếp thế nào, các trạng thái (state) của block và điểm cổng nối để HTS dựng 3D, cách soạn block của riêng bạn, cùng ý nghĩa các tệp Spec và mẫu Excel của VCS.

**\~1.800 block**thư viện HTS: cấp thoát nước, PCCC, điện, HVAC

**\~1.360 block có 3D**state "3D" + điểm cổng, dùng khi dựng mô hình

**6 tệp Spec**giá đỡ, cao độ, layer, ghi chú… sửa trong SETUP SPEC

[Thư mục cài đặt](#thu-muc)[Thư viện HTS](#thu-vien)[Thư viện của bạn](#thu-vien-rieng) [State của block](#state)[Điểm cổng (POINT)](#diem-cong)[Soạn block 3D](#soan-block) [Mẫu VCS](#vcs)[Tệp Spec](#spec)[Sao lưu & bảo mật](#sao-luu)

## Thư mục cài đặt

Mọi thư viện, Spec và mẫu nằm trong thư mục cài đặt HTS. Tuỳ bộ cài, đó là một trong hai đường dẫn dưới; dán vào thanh địa chỉ của File Explorer để mở.

Bộ cài AutoCAD 2017–2024

```
C:\ProgramData\Autodesk\ApplicationPlugins\Htools.bundle\Contents\Windows
```

Bộ cài chung 2017–2027 / 2025–2027

```
%APPDATA%\Autodesk\ApplicationPlugins\Htools.bundle\Contents\Windows
```

| Thư mục / tệp | Chứa gì | Bạn được làm gì |
| --- | --- | --- |
| `Library` | Thư viện block chuẩn của HTS, chia theo hệ | Chỉ dùng chèn bằng nút Insert block, không sửa tệp |
| `UserLibrary` | Thư viện riêng của bạn (tab THƯ VIỆN) | Tự do thêm, sửa, xoá |
| `Spec` | 6 tệp cấu hình tiêu chuẩn (.json) | Qua SETUP SPEC |
| `PipeConfig.json` | Cỡ nhánh mặc định của tê đầu phun PCCC | Sửa cẩn thận |
| `Template` | Danh mục tên chuẩn hoá và cấu hình bóc khối lượng của VCS (Excel) | Qua SETUP / SETUP BOQ của VCS |
| `Projects` | Dự án bóc khối lượng VCS đã lưu | Sao lưu |
| `Control` | Tiện ích LISP / VLX đi kèm | Chỉ dùng |
| `Tools`, `Update` | HCAD (xem 3D), dọn rác block, trình cập nhật | Chỉ dùng mở từ HTS |
| Tệp `.dll` / `.exe` và các thư mục còn lại | Chương trình HTS / VCS | Không đụng không sửa, không sao chép, không gửi đi |

Máy chỉ nên có **một** thư mục cài đặt. Nếu có cả hai, AutoCAD 2017–2024 nạp HTS hai lần, lệnh và tuỳ chọn chạy lẫn lộn. SETUP SPEC sẽ cảnh báo trường hợp này; hãy gỡ bản không dùng.

**Bảo mật bản quyền.** Thư mục cài đặt chứa chương trình có bản quyền. Không chép cả thư mục hoặc tệp chương trình sang máy khác, không gửi cho người khác. Mỗi máy cài bằng bộ cài chính thức và đăng nhập tài khoản riêng. Block, Spec và mẫu Excel do bạn tạo thì chép, chia sẻ bình thường.

## Thư viện block HTS

Mỗi block là một tệp `.dwg`, tên tệp chính là tên block. HTS nhận diện phụ kiện theo tên này để rải phụ kiện, bóc khối lượng và dựng 3D, nên tên tệp, tên block và tên state trong thư viện phải giữ nguyên.

| Thư mục | Nội dung | Tệp | Có 3D |
| --- | --- | --- | --- |
| CTN · Cấp thoát nước |  |  |  |
| `uPVC\Phụ kiện` | Cút, chếch, tê, Y, côn, tê cong, nút bịt, măng sông, mặt bích, van uPVC | 342 | 325 |
| `PPR\Phụ kiện`, `PPR\Van vòi` | Phụ kiện PPR, cút / măng sông ren, van, vòi, đồng hồ nước | 190 | 177 |
| `HDPE\Phụ kiện` | Cút, tê, Y, côn, đai khởi thuỷ, đầu nối ren, nắp bịt HDPE | 150 | 134 |
| `Combo` | Cụm phụ kiện chèn một lần (2 chếch, Y + chếch, chếch + thông tắc…), tự tách thành phụ kiện con | 98 | 6 |
| `Quangtreo` | Quang treo, giá đỡ, U-bolt | 37 | 36 |
| `Thiết bị vệ sinh` | Lavabo, xí, tiểu, phễu thu sàn, bình nóng lạnh… | 14 | 14 |
| PCCC |  |  |  |
| `Phụ kiện ống thép` | Phụ kiện ren (SCREW), hàn (WELD), nối rãnh (COUPLING / Grooved), mặt bích, măng sông | 645 | 390 |
| `Thiết bị` | Van các loại, Y lọc, khớp nối mềm, đồng hồ, cảm biến, bình tích áp, bơm… | 262 | 259 |
| ELEC · Điện |  |  |  |
| `BOX ĐIỆN` | Tủ điện, hộp chia ngả | 29 | 18 |
| `Thang máng` | Phụ kiện thang / máng cáp, giá đỡ | 26 | — |
| HVAC |  |  |  |
| `Phụ kiện`, `Thiết bị` | Van gió (VCD, MD, FD, MFD, RND), miệng gió, khớp nối mềm | 20 | — |

Số liệu theo bản cài hiện hành, bản của bạn có thể chênh vài tệp. Thang máng cáp, ống gió và phụ kiện ống gió không cần state 3D vì HTS tự dựng 3D theo kích thước khi chạy lệnh 3D.

### Quy ước đặt tên

| Mẫu tên | Ý nghĩa |
| --- | --- |
| `HTS-TEE-D110x90` | Phụ kiện uPVC: **D** + đường kính ngoài (mm); phụ kiện 2 cỡ ghi `chính x nhánh` |
| `HTS-ELB90-D25 PPR`, `HTS-Y-D110x110 HDPE` | Hậu tố vật liệu PPR / HDPE sau dấu cách |
| `HTS-SCREW-ELB90-DN50`, `HTS-WELD-TEE-DN100x25` | Thép PCCC: **DN** + đường kính danh nghĩa; SCREW = nối ren, WELD = hàn |
| `HTS-TEE-DN100x50 COUPLING` | Thép nối rãnh (coupling) |
| `HTS-VanGiamAp-DN50`, `HTS-YLoc-DN80` | Thiết bị theo tên tiếng Việt không dấu + cỡ |
| `HTS-TBVS-…`, `HTS-Tudien-…`, `HTS_Van gio…` | Thiết bị vệ sinh, tủ điện, phụ kiện HVAC |

Họ phụ kiện thường gặp: `ELB90` cút 90°, `ELB45` chếch 45°, `TEE` tê, `Y` tê xiên, `RED` côn thu, `TECONG` tê cong, `MCONG` ký hiệu mặt cắt ống, `Nutbit` / `NapBit` nút bịt, `Mangsong` măng sông, `THONGTAC` thông tắc, `QUANGTREO` quang treo, `GIADO` giá đỡ.

### Dùng thư viện

- Chèn bằng nút **Insert block** của từng hệ (Cấp thoát nước, PCCC, HVAC, Điện). Bảng chọn tự lấy đúng tệp, đúng cỡ, đúng state và tỉ lệ theo SETUP.
- Không sửa trực tiếp tệp trong `Library`: lần cập nhật HTS sau có thể ghi đè. Muốn biến thể riêng, chép tệp sang `UserLibrary` và **đặt tên khác** để không trùng block thư viện.
- Bản vẽ cũ còn định nghĩa block đời trước (chưa có state 3D, hình cũ): mở **SETUP SPEC → QUẢN LÝ BLOCK → UPDATE BLOCK**. HTS so từng block HTS trong bản vẽ với tệp thư viện và định nghĩa lại block nào khác.
- Tab **DỌN DẸP BLOCK** quét thư mục cài đặt: tệp thư viện trùng tên mà đã có bản mang state 3D thì đề xuất xoá các bản thiếu 3D, cùng các thư mục sao lưu `.BAK` cũ.

## Thư viện của bạn (UserLibrary)

Thư mục `UserLibrary` là nơi để block riêng của công ty bạn. Sẵn có các nhóm `Cấp thoát nước`, `HVAC`, `PCCC`, `Điện`; bạn tạo thêm thư mục con tuỳ ý.

- Trên palette HTS, tab **THƯ VIỆN** hiện cây thư mục `UserLibrary`; kéo thả tệp vào bản vẽ để chèn. Nút chọn thư mục mở tạm một thư mục thư viện khác, ví dụ ổ mạng chung của công ty. Lần mở AutoCAD sau, cây quay về `UserLibrary`.
- Mỗi tệp `.dwg` là một block; đặt tên tệp rõ ràng vì đó sẽ là tên block trong bản vẽ.
- Block riêng muốn HTS dựng 3D và nối ống tự động thì soạn theo quy ước ở mục [State](#state) và [Điểm cổng](#diem-cong). Tên block **không cần** bắt đầu bằng `HTS-`.
- Sao lưu `UserLibrary` trước khi cài lại HTS.

## State của block (Visibility)

Block động trong thư viện có nhiều trạng thái hiển thị (Visibility state): cùng một phụ kiện nhưng vẽ theo hướng khác nhau. Khi vẽ ống, HTS tự chọn state theo hướng ống, ví dụ đổi cao độ tại góc thì dùng cút UP90 / DN90. Bạn chỉ chọn tay (grip Visibility) khi muốn đổi ký hiệu.

| Tên state | Dùng khi |
| --- | --- |
| `SIDE` / `Side` | Mặt bằng, phụ kiện nằm trong mặt phẳng ngang. Là state mặc định khi chèn. |
| `UP90` · `DN90` (hoặc `UP` · `DOWN`) | Nhánh rẽ vuông góc đi lên / đi xuống. Trên mặt bằng thấy ký hiệu ống đứng. |
| `UP45` · `DN45` | Nhánh chếch 45° đi lên / đi xuống. |
| `TOP` · `TOP90` · `TOP45` · `BOTTOM…` | Hình nhìn từ trên / từ dưới, thường gặp khi phụ kiện nằm trên ống đứng. |
| `TOPx45` · `BOTTOMx45` · `UPx45` · `DNx45` | Các tổ hợp nhánh 45° (Y, chếch) theo hướng nhìn. |
| `SIDE45` · `SIDE-45` | Mặt bằng, nhánh lệch 45° trong mặt phẳng ngang. |
| `MB` · `MD` · `MBen` | Thiết bị: mặt bằng · mặt đứng · mặt bên. |
| `Section` | Hình mặt cắt. |
| `3D` | Khối 3D đặc + điểm cổng. Luôn là state **cuối cùng**. HTS dùng khi QUÉT 3D, COMBINE 3D và gửi sang HCAD; bạn không cần bật tay. |

### Quy ước state "3D"

- 3D nằm **ngay trong** block động, ở state tên đúng `3D` đặt cuối danh sách. Không tạo block 3D riêng.
- State 3D gồm: nét của state mặt bằng (bỏ Wipeout), các POINT cổng dùng chung với state mặt bằng, và khối 3D đặc (Solid) đúng kích thước thật.
- Ở mọi state khác, khối 3D phải ẩn. Nếu không, bản chèn mới sẽ vẽ chồng khối 3D lên ký hiệu 2D.
- Không xoá, không đổi tên state của block thư viện. HTS chọn state theo đúng tên.

## Điểm cổng nối (POINT)

Mỗi miệng nối ống của block có một đối tượng **POINT** đặt đúng tâm miệng, nằm trên trục ống. HTS đọc các POINT này để biết ống cắm vào đâu: nối ống, kế thừa cao độ, dựng ống đứng và đặt khối 3D. Block không có POINT vẫn chèn và bóc khối lượng được, chỉ không tự nối khi dựng 3D.

### Quy tắc đặt POINT

1. **Một miệng nối = một POINT**, đặt ở tâm mặt cắt miệng ống, không đặt ở mép. Không thêm POINT trang trí: HTS coi mọi POINT đang hiện là một cổng.
2. **POINT hiện ở state mặt bằng (SIDE / MB) và ở state 3D.** Dùng chung cùng một POINT cho hai state, không vẽ hai lần.
3. **Phụ kiện, van trên ống:** điểm chèn ở tâm phụ kiện, trục ống trùng trục X của block, hai POINT ở hai đầu trên trục X.
4. **Cao độ (Z) của POINT** là độ cao miệng nối so với điểm chèn. Phụ kiện nằm ngang để Z = 0. Thiết bị đặt sàn (bơm, bình) đặt POINT đúng chiều cao miệng hút / miệng đẩy.
5. **Đáy khối 3D của thiết bị ở Z = 0** của block. Cao độ bạn gán cho thiết bị là cao độ đáy.

### HTS hiểu block theo số cổng

| Cách đặt POINT | HTS coi là | Khi dựng 3D |
| --- | --- | --- |
| 2 POINT trên cùng trục X | Thiết bị trên ống: van, Y lọc, đồng hồ nước, khớp nối mềm | Đặt khối trên tuyến, ống đi xuyên qua |
| 2 POINT trở lên, không thẳng hàng | Phụ kiện nút: cút, tê, Y | Các đầu ống nối vào đúng cổng |
| 1 POINT | Thiết bị một cổng: đồng hồ áp, cảm biến, van xả khí | Gắn vào ống gần nhất, hướng cổng theo hình vẽ |
| POINT cao hơn đáy (Z > 0) | Thiết bị đặt sàn: bơm, bình tích áp | Ống tự đi đứng tới đúng miệng |
| Có state 3D, không có POINT | Thiết bị không nối ống: FCU, dàn lạnh | Hiện khối 3D tại cao độ đã gán |

Trong bản vẽ, POINT thường quá nhỏ để thấy. Gõ `PDMODE` = `3` và `PDSIZE` = `-2` để POINT hiện thành dấu chéo, kiểm xong đặt lại `PDMODE` = `0`.

## Soạn block 3D của riêng bạn

Làm trong Block Editor (`BEDIT`) của AutoCAD, theo thứ tự:

1. ### Vẽ ký hiệu mặt bằng

   Vẽ ở Z = 0. Đặt điểm gốc block (Base point) đúng tâm phụ kiện, hoặc tâm đáy với thiết bị.
2. ### Tạo các state

   Thêm Visibility Parameter nếu block chưa có. Tạo các state cần dùng, đặt tên theo bảng ở mục [State](#state), rồi thêm state `3D` ở **cuối** danh sách.
3. ### Dựng khối 3D trong state 3D

   Ở state `3D`: giữ nét hình chiếu (ẩn Wipeout), dựng khối đặc đúng kích thước thật bằng BOX / EXTRUDE / REVOLVE / SWEEP.
4. ### Đặt POINT cổng

   Lệnh `POINT` tại tâm từng miệng nối. Cho POINT hiện ở state mặt bằng và state 3D.
5. ### Ẩn khối 3D ở state khác

   Chuyển qua từng state còn lại, chọn khối 3D và ẩn (`BVHIDE`).
6. ### Trả về state mặc định rồi lưu

   Chọn lại state mặt bằng trước khi `BSAVE`, để bản chèn mới không vẽ chồng khối 3D. Lưu tệp vào `UserLibrary`.
7. ### Kiểm tra

   Chèn block, đổi lần lượt từng state xem hình có đúng. Vẽ thử một đoạn ống nối vào, chạy QUÉT 3D hoặc COMBINE 3D, rồi xem trong HCAD.

## Mẫu Excel của VCS

VCS đọc các tệp Excel trong thư mục `Template` và `Projects`. Sửa qua cửa sổ **SETUP** / **SETUP BOQ** của VCS là an toàn nhất; Windows có thể hỏi quyền Administrator vì thư mục cài đặt được bảo vệ. Nếu sửa bằng Excel, đóng AutoCAD trước, giữ nguyên tên sheet và thứ tự cột.

| Tệp | Nội dung | Cấu trúc |
| --- | --- | --- |
| `Template\DanhMuc-CTN.xlsx` `DanhMuc-PCCC.xlsx` `DanhMuc-HVAC.xlsx` `DanhMuc-ELEC.xlsx` | Danh mục tên chuẩn hoá tiếng Việt của block, theo hệ | Sheet `Block`: `STT` · `TênBlock` · `Chuẩn hóa tiếng việt` · `Ghi chú` |
| `Template\Setup-HVAC.xlsx` | Độ dày tôn ống gió theo cạnh lớn nhất | Cột 1: kích thước tối đa W / H (mm) · Cột 2: độ dày tôn (mm) |
| `Template\Setup-DIEN.xlsx` | Chiều dài một đốt máng cáp khi bóc khối lượng | `Thông số` · `Giá trị` · `Đơn vị` · `Ghi chú` |
| `Projects\VCS_<Tên dự án>.xlsx` | Một dự án bóc khối lượng đã lưu | Sheet `Thông tin dự án` + các sheet dữ liệu bạn lưu từ bảng tổng hợp |

### Tên chuẩn hoá được tra theo thứ tự

1. **Danh mục Excel** `DanhMuc-<hệ>.xlsx`: luôn được ưu tiên, so tên không phân biệt hoa thường.
2. **Suy theo họ**: block cùng họ, chỉ khác cỡ, mượn văn phong tên đã có. Ví dụ đã có tên cho DN100 thì DN250 cùng họ tự ra tên tương ứng.
3. **Block HTS sinh theo kích thước** (ống gió, thang máng cáp): tên ghép từ loại và cỡ.
4. **Quy tắc HTS** cho các họ thư viện chưa có mẫu (miệng gió, van gió, mặt bích…).

Không khớp bước nào thì ô tên để trống và dòng được bôi vàng. Không có tên bịa ra. Tên do AI gợi ý mang dấu 🤖 và chỉ thành tên chính thức khi bạn duyệt. Tên đã duyệt được ghi thêm vào danh mục Excel của hệ đó.

### Độ dày tôn mặc định (Setup-HVAC)

| Cạnh lớn nhất W / H đến (mm) | Độ dày tôn (mm) |
| --- | --- |
| 400 | 0,58 |
| 1.000 | 0,75 |
| 2.500 | 0,95 |
| lớn hơn | 1,15 |

## Tệp Spec của HTS

Spec là các thông số tiêu chuẩn dự án: khoảng cách giá đỡ, cao độ lắp đặt, quy tắc layer, ghi chú. Spec áp dụng cho mọi bản vẽ trên máy. Mở cửa sổ **SETUP SPEC** bằng nút **⚙ SETUP SPEC** trên palette HTS, hoặc nút **SETUP SPEC** trên thanh tiêu đề HTS.V2 (mở đúng tab của hệ đang xem). Cửa sổ có các tab: Quản lý layer, Cấp thoát nước, Điện, HVAC, PCCC, Quản lý block, Lệnh tắt.

| Tệp (thư mục `Spec`) | Dùng cho | Tab SETUP SPEC |
| --- | --- | --- |
| `SpecCTN.json` | Khoảng cách giá đỡ / quang treo ống cấp, ống thoát | Cấp thoát nước |
| `SpecPCCC.json` | Quang treo, giá đỡ, măng sông / coupling ống thép; vẽ nhanh nhánh đầu phun | PCCC |
| `SpecHVAC.json` | Kiểu cút, chân rẽ, nẹp ống gió; khoảng cách giá đỡ ống gió | HVAC |
| `SpecDIEN.json` | Cao độ thiết bị điện; giá đỡ, chia đốt, kiểu lỗ máng / thang cáp | Điện |
| `SpecLayer.json` | Bảng đặt tên layer theo công ty / hạng mục / hệ | Quản lý layer |
| `SmartTag.json` | Cỡ chữ và tên loại ống của ghi chú thông minh, theo hệ | — |

### SpecCTN.json

| Khoá | Ý nghĩa | Mặc định |
| --- | --- | --- |
| `CapNuoc.GiaDo` · `ThoatNuoc.GiaDo` | Bộ quy tắc giá đỡ cho ống cấp / ống thoát |  |
| `KhoangCachToiDaPhuKien` | Khoảng cách tối đa từ phụ kiện tới giá đỡ gần nhất (mm) | 300 |
| `QuyTac[]` · `DuongKinhMin` / `DuongKinhMax` | Dải đường kính ống (mm), hiểu là Min \< D ≤ Max | 0–25 · 25–90 · 90–99999 |
| `KhoangCach` | Khoảng cách giữa hai giá đỡ (mm) | 900 · 1200 · 2000 |
| `LoaiGiaDo` | Tên thép giá đỡ ghi vào block / bảng khối lượng | U40x20x2 … |

### SpecPCCC.json

| Khoá | Ý nghĩa | Mặc định |
| --- | --- | --- |
| `AutoInsertMangSong` | Tự chèn măng sông (ren, ≤ DN50) / khớp nối coupling (≥ DN65) khi vẽ ống | false |
| `MangSongCoupling.QuyTac[]` | Khoảng cách tối đa giữa hai mối nối theo cỡ ống | 6000 mm |
| `QuangTreo` · `GiaDo` | Khoảng cách rải quang treo / giá đỡ theo cỡ ống, kèm `KhoangCachToiDaPhuKien` | 600 mm tới phụ kiện |
| `MLineScaleMin` / `MLineScaleMax` · `DN` | Dải tỉ lệ Mline (đường kính ngoài ống thép, mm) ứng với một DN | DN25 = 34 · DN50 = 60 · DN100 = 110… |
| `Spacing` · `LoaiGiaDo` | Khoảng cách (mm) và tên thép giá đỡ |  |
| `VenhanhPline.PipeMappings[]` | Bậc cỡ ống khi vẽ nhanh nhánh đầu phun, theo thứ tự `Index` tăng dần, từ cuối nhánh vào ống chính | DN25 → DN100 |
| `VenhanhPline.TextHeight` · `LabelOffset` | Cỡ chữ ghi cỡ ống và khoảng cách chữ tới đường ống (mm). Sửa trên palette PCCC thì lưu riêng cho máy bạn. | 150 · 50 |

### SpecHVAC.json

| Khoá | Ý nghĩa | Giá trị |
| --- | --- | --- |
| `KieuCutOngGio` | Kiểu cút ống gió | `Thuong` (thường) · `EI` (chống cháy) |
| `DoLoeChanRe` | Độ loe chân rẽ nhánh | `Auto` · `Nhap` (tự nhập) |
| `NepTuDong` | Tự ghi chi tiết ghép nối (nẹp) theo cỡ ống | `Auto` · `Khong` |
| `BangNep[]` · `Tu` / `Den` / `Nep` | Cạnh ống từ… đến… (mm) dùng nẹp gì; `Den` = 0 nghĩa là trở lên | NẸP C · NẸP TDC · THÉP GÓC V30X3 |
| `OngGio.GiaDo.QuyTac[]` · `Width` / `Spacing` | Khoảng cách giá đỡ theo chiều rộng ống gió (mm) | 400 → 2500 · 1000 → 1500 |

### SpecDIEN.json

| Khoá | Ý nghĩa | Mặc định |
| --- | --- | --- |
| `CaoDo.ThietBi[]` · `Key` / `Z` | Cao độ lắp đặt mặc định (mm). Công tắc, ổ cắm tính tới tâm; tủ điện, đèn tính tới đỉnh. `PIPE` là cao độ ống điện chính, cũng dùng làm cao độ trần thô khi chưa bo trần. | PIPE 3000 · SW 1200 · DB 1500 · LIGHT 2800 · ổ cắm 400 |
| `MangCap.GiaDo` · `ThangCap.GiaDo` | Khoảng cách giá đỡ theo bề rộng (`MinWidth` / `MaxWidth` → `Spacing`) | ≤ 599: 1500 · ≥ 600: 1200 |
| `GiaDoChung.KhoangHoToiDa` | Khe hở tối đa giữa hai máng / thang để dùng chung một thanh giá đỡ dài (mm) | 500 |
| `ChiaDot` | Chiều dài một đốt máng / thang / trunking (mm); `BatKhiVe` = cắt đốt ngay khi vẽ | 3000 · false |
| `LoaiMangCap` | Kiểu lỗ máng: `1` ô van so le, `2` lỗ thẳng hàng; bước lỗ dọc / ngang, kích thước lỗ | 1 |

### SpecLayer.json · SmartTag.json · PipeConfig.json

- `SpecLayer.json`: mỗi dòng `layers[]` là một layer, có các cột `Tên công ty` · `Hạng mục` · `Hệ thống` · `SubSystem` · `Thiết bị / Đường ống` · `Thông số người dùng tự thêm` · `TÊN LAYER` · `Color` · `Mô tả`. Tên layer ghép từ các cột, ví dụ `HTS-MEPF-CTN-CW`. Sửa ở tab Quản lý layer.
- `SmartTag.json`: theo từng hệ (CTN, Điện, HVAC, PCCC) có `TextHeight` (cỡ chữ), `MlineCategory` và `PlineCategory` (tên loại ống ghi cho ống vẽ bằng Mline / Polyline).
- `PipeConfig.json` (cạnh thư mục Spec): `TeeBranchSize` là cỡ nhánh mặc định (DN) của tê nối đầu phun khi chuyển Polyline sang ống PCCC. Mặc định 25.

### Nếu sửa tay tệp .json

- Ưu tiên sửa trong SETUP SPEC. Sửa tay chỉ khi cần chép cấu hình giữa các máy.
- Đóng AutoCAD và sao lưu tệp trước khi sửa. Lưu lại bằng mã UTF-8.
- Giữ nguyên tên khoá. Số viết không có dấu ngoặc kép, dấu thập phân là dấu chấm.
- Các dải Min–Max phải nối liền nhau, không hở, không chồng.
- Kiểm cú pháp bằng trình soạn có báo lỗi JSON (VS Code, Notepad++ có plugin). Tệp sai cú pháp có thể làm HTS đọc thiếu thông số hoặc quay về giá trị mặc định.

## Sao lưu & bảo mật

- Trước khi cài lại hoặc cập nhật HTS, sao lưu 4 thư mục của bạn: `Spec`, `Template`, `Projects`, `UserLibrary`.
- Muốn nhiều máy dùng chung tiêu chuẩn: chép `Spec` và `Template` từ một máy chuẩn sang các máy khác (cùng phiên bản HTS). Thư viện chung của công ty có thể đặt ở ổ mạng và mở bằng nút chọn thư mục của tab THƯ VIỆN.
- Chỉ chia sẻ dữ liệu của bạn (block, Spec, mẫu Excel, bản vẽ). Không chia sẻ tệp chương trình, bộ cài hay thông tin đăng nhập; mỗi tài khoản chỉ dùng cho người được cấp.

HTS Software · Thư viện, Block 3D & Spec · cập nhật 15/11/2026. Xem thêm: [Kết nối AI với HTS & VCS](https://claude.ai/artifact/Q5qeTeJRg99nDDwqqDTPPn).