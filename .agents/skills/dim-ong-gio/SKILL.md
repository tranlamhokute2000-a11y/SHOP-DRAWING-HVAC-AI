---
name: dim-ong-gio
description: >-
  Tự động Dim kích thước ống gió HVAC trong AutoCAD bằng AutoLISP (AutoDimOngGio.lsp - Lệnh DOG, DAO, UDOG).
  Chỉ nhận diện các Block ống gió HTS-OG*, HTS-COG*, HTS-CAP*, phân biệt từng tuyến ống liền nhau,
  ưu tiên Pick tuyến ống gần vùng màn hình Zoom nhất, tự động chọn DIMLINEAR cho ống thẳng và DIMALIGNED
  cho ống chéo, hỗ trợ đảo chiều Dim (DAO) và cập nhật khoảng cách Dim trực tiếp cho đến khi bấm OK.
---

# Skill: Tự Động Dim Ống Gió HVAC AutoCAD (`dim-ong-gio`)

## 1. Quy tắc Đồng bộ Bắt buộc (Auto-Sync Rule)

> **QUAN TRỌNG:** Mỗi khi người dùng yêu cầu chỉnh sửa, nâng cấp hoặc vá lỗi cho Lisp Dim Ống Gió (`AutoDimOngGio.lsp`), Assistant **BẮT BUỘC** phải cập nhật đồng bộ ở cả 3 nơi:
> 1. File làm việc chính: `C:\Users\Nguye\Desktop\VIẾT LIPS CAD\AutoDimOngGio.lsp`
> 2. File mã nguồn đóng gói trong Skill: `C:\Users\Nguye\.gemini\config\skills\dim-ong-gio\scripts\AutoDimOngGio.lsp`
> 3. Nội dung hướng dẫn & quy tắc trong file Skill này: `C:\Users\Nguye\.gemini\config\skills\dim-ong-gio\SKILL.md`

---

## 2. Tổng quan & Danh sách Lệnh Tắt

File AutoLISP độc lập hoàn toàn (`AutoDimOngGio.lsp`), chạy được trên mọi máy tính và mọi phiên bản AutoCAD (2007–2026) mà không cần cài thêm file `.dcl` hay `.dll` rời:

| Lệnh tắt | Chức năng chính |
| :--- | :--- |
| **`DOG`** *(hoặc `DGO`, `DIMOG`)* | Quét chọn vùng bản vẽ $\rightarrow$ Lọc Block ống gió $\rightarrow$ Tự động Dim từng tuyến ống gần màn hình Zoom nhất $\rightarrow$ Mở bảng Điều chỉnh chiều & khoảng cách Dim. |
| **`DAO`** *(hoặc `UDOG`)* | Đảo chiều Dim sang phía đối diện của ống gió (hoặc mở bảng Điều chỉnh chiều & khoảng cách Dim cho bất kỳ tuyến ống nào vừa Dim). |

---

## 3. Các Quy tắc Kỹ thuật Cốt lõi của Lisp Dim Ống Gió

### 3.1. Bộ lọc nhận diện đối tượng ống gió (`DGO:IsDuctBlock`)
- **Chỉ nhận diện** các Block (`INSERT`, bao gồm cả Dynamic Block qua `EffectiveName`) có tên bắt đầu bằng:
  - **`HTS-OG*`** (ví dụ: `HTS-OG-900x350 L1110`)
  - **`HTS-COG*`**
  - **`HTS-CAP*`** (ví dụ: `HTS-CAP-900x350-L1700` - côn thu/chuyển cấp)
- **Loại bỏ hoàn toàn** tất cả các Block/đối tượng khác trong vùng quét (miệng gió, van, tê, cút, cột kiến trúc, khung tên...).
- Hộp thoại DCL tự sinh (`DGO:ShowBlockDialog`) sử dụng vòng lặp `foreach` chuẩn AutoLISP (không dùng `prog1` hay `apply 'strcat`) để chịu tải hàng nghìn đối tượng mà không lỗi.

### 3.2. Phân biệt tuyến ống liền mạch (`DGO:AreSameDuctRun`)
- Tính chính xác **khoảng hở thực tế giữa 2 mép đầu ống (`gapDist`)**:
  $$\text{gapDist} = \left|\text{paraDist} - (\text{halfLen}_1 + \text{halfLen}_2)\right|$$
- **Cùng 1 tuyến ống:** Chỉ khi các đốt ống `HTS-OG*` / `HTS-CAP*` có cùng phương trục, thẳng hàng theo tâm ống (cho phép độ lệch tâm của côn thu lệch `HTS-CAP`) và **2 đầu ống chạm sát nhau** ($\text{gapDist} \le 25\text{ mm}$).
- **Tách thành tuyến ống khác:** Khi 2 đoạn ống cách nhau một khoảng hở hoặc ngăn cách bởi bất kỳ phụ kiện nào khác (Tê, Chữ thập, Cút, Van FD/VCD, Khớp mềm... không phải `HTS-OG*` / `HTS-CAP*`).

### 3.3. Quy tắc ưu tiên Pick hướng theo màn hình Zoom (`DGO:PopNearestRun`)
- Sau khi quét chọn và nhập khoảng cách Dim, Lisp lấy tâm vùng màn hình đang Zoom (`VIEWCTR`) làm mốc:
  - **Tuyến đầu tiên (`[1/n]`):** Ưu tiên làm sáng tuyến ống nằm **gần tâm màn hình Zoom nhất**. Dây dẫn chọn hướng (`basePt`) luôn neo vào đốt ống gần tâm màn hình nhất (`DGO:ClosestBlockInRun`).
  - **Các tuyến tiếp theo (`[2/n]` $\rightarrow$ `[n/n]`):** Tự động tìm **tuyến ống chưa Dim nằm gần vị trí con trỏ chuột vừa Pick nhất** (hoặc gần tâm vùng Zoom mới nếu người dùng bỏ qua/Zoom sang chỗ khác) cho đến khi hết toàn bộ tuyến ống.

### 3.4. Tự động chọn `DIMLINEAR` và `DIMALIGNED` (`DGO:CreateDim`)
- Sử dụng 100% **DimStyle hiện hành (`DIMSTYLE`)** và **Layer hiện hành** của bản vẽ.
  - **Chuẩn Spec dự án (`Spec-layer ký hiệu ống gió.dwg` v3)**: Đặt Layer hiện hành là **`M-MVAC-DIM`** (`ACI 97`, nét `0.05 mm`); chọn DimStyle **`M-DIM 1-400`** khi Dim mặt bằng tổng thể, hoặc **`HỒ-DIM 1-70`** khi Dim chi tiết đốt ống / phòng máy / khung trích chi tiết!
- **Tuyến ống thẳng Ngang ($0^\circ / 180^\circ$):** Dùng lệnh `_.DIMLINEAR` (chế độ `_H` - Horizontal).
- **Tuyến ống thẳng Dọc ($90^\circ / 270^\circ$):** Dùng lệnh `_.DIMLINEAR` (chế độ `_V` - Vertical).
- **Tuyến ống xoay Chéo (góc xiên bất kỳ):** Dùng lệnh `_.DIMALIGNED`.

### 3.5. Đảo chiều Dim (`DAO`) & Cập nhật lại khoảng cách Dim (`DGO:RebuildRunDims` & `DGO:ShowAdjustDialog`)
- Mỗi đốt ống khi Dim đều lưu lại tọa độ của **cả 2 cạnh bên đối diện nhau** (`pt1, pt2, ptMid, normVec` và `opp_p1, opp_p2, opp_mid, opp_norm`).
- **Trong lúc đang Pick các tuyến ống (`[1/n]` $\rightarrow$ `[n/n]`):**
  - Có tùy chọn `[Dao chieu tuyen vua roi (DAO)]` ngay tại dòng nhắc. Gõ **`DAO`** là tuyến vừa Pick lập tức lật sang mép ống phía đối diện.
- **Sau khi Pick xong (hoặc khi gõ lệnh `DAO` / `UDOG`):**
  - Hiển thị bảng điều khiển **`ĐIỀU CHỈNH CHIỀU & KHOẢNG CÁCH DIM`** gồm:
    - Nút **`<-> ĐẢO CHIỀU DIM (Đổi sang phía đối diện)`**: Lật toàn bộ chuỗi Dim (chân gióng + đường Dim) sang mép ống đối diện ngay trên bản vẽ.
    - Ô nhập **`Khoảng cách Dim`** + nút **`Cập nhật khoảng cách`**: Thay đổi khoảng cách từ đường Dim đến mép ống gió và cập nhật trực tiếp trên màn hình.
    - Nút **`Pick chọn tuyến ống khác trên bản vẽ...`**: Chọn bất kỳ tuyến ống nào khác để đảo chiều hoặc sửa khoảng cách.
    - Nút **`OK (Hoàn tất)`**: Khi người dùng kiểm tra trên màn hình đã ưng ý và bấm **OK** thì mới kết thúc lệnh.

---

## 4. Đường dẫn File Mã nguồn Chuẩn
- Bản đóng gói trong Skill: [AutoDimOngGio.lsp](file:///C:/Users/Nguye/.gemini/config/skills/dim-ong-gio/scripts/AutoDimOngGio.lsp)
- Bản trong Workspace: [AutoDimOngGio.lsp](file:///C:/Users/Nguye/Desktop/VI%E1%BA%BET%20LIPS%20CAD/AutoDimOngGio.lsp)
