# Báo Cáo Triển Khai Tuyến Ống Gió HTS — `duct-author`

- **Tệp bản vẽ**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\bai 3.dwg`
- **Dữ liệu chi tiết**: `work_hvac\bai3\duct_author_result.json`
- **Số lượng Block HTS đã tạo**: **385 block** (351 đốt thẳng `HTS-OG-* L1110/đốt lẻ` + 34 cút góc `HTS-OG-CO-V47-*`)
- **Phân bổ Layer**:
  - `M-MVAC-EAD` (ACI 80): **77 block**
  - `M-MVAC-SEAD` (ACI 190): **308 block**
- **XData Cao Độ Đáy (`HTS_OG_DAY`)**: **385/385 block (100%)** đã được gán giá trị `BOD` tương ứng theo từng phân đoạn.
- **Bảo toàn thực thể gốc**: **608/608 thực thể (100% nguyên vẹn)**:
  - `MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED`: 396
  - `MEPG-AC-M-Hút gió thải-Exhaust Air-EAD`: 104
  - `MEPG-AC-TEXT`: 94
  - `MEPG-M-EQUIP`: 6
  - `MEPG-XREF-ARC`: 8
- **Kỷ luật phạm vi**: 0 cửa gió, 0 van gió, 0 giá đỡ tự ý đặt thêm (100% tuân thủ Quy tắc cứng số 0).

---

## 4 Vị Trí Khoảng Trống Z-Offset Bàn Giao Cho `@detailer`

| ID | Tuyến ống & Tiết diện | Cao độ BOD | Độ chênh ΔZ | Phạm vi tọa độ khoảng trống đã chừa | Gợi ý hướng chiếu trích mặt đứng |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **Z-01** | SED Trục Tây Bắc<br>`1200x450` $\rightarrow$ `1000x400` | $2400 \rightarrow 2650$ | **250 mm** | $X \approx -74282.6$<br>$Y: 74505.5 .. 77451.8$ | Hướng `UP` hoặc `LEFT` |
| **Z-02** | SED Trục Chính Nam (Đoạn 1)<br>`1850x450` | $3050 \rightarrow 2300$ | **750 mm** | Góc cua:<br>$(-50982.3, 31491.4) \rightarrow (-52834.3, 33343.4)$ | Hướng `LEFT` |
| **Z-03** | SED Trục Chính Nam (Đoạn 2)<br>`1500x450` | $2300 \rightarrow 2720$ | **420 mm** | Đoạn ngang $Y = 33518.3$:<br>$X: -73767.5 .. -74562.9$ | Hướng `UP` |
| **Z-04** | SED Trục Đông Nam (Trục X=-51000)<br>`1000x350` | $3150 \rightarrow 2500$ | **650 mm** | Đoạn đứng $X \approx -50838.7$:<br>$Y: 7041.7 .. 7985.6$ | Hướng `RIGHT` |
