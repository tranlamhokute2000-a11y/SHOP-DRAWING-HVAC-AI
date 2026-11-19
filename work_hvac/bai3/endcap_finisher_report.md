# Báo Cáo Hoàn Thiện Đầu Cụt Nắp Bịt Ống Gió (`HTS-CAP-*`) — `endcap-finisher`

- **Tệp bản vẽ**: `C:\Users\Admin\Desktop\SHOPDRAWING-HVAC-AI\bai 3.dwg`
- **Tình trạng hoàn thành**: **100% Hoàn Tất** (9/9 vị trí đầu cụt kết thúc tuyến ống đã được chuyển thành Block `HTS-CAP-*`).
- **Kỷ luật đầu cụt**:
  - 100% các đốt ống lẻ cuối tuyến được rà soát: không có đốt lẻ thừa `< 100mm` ở đầu cụt.
  - 100% đốt ống thật cuối cùng ($L \ge 100\text{ mm}$, chiều `rotation` hướng ra đầu cụt) được chuyển thành Block nắp bịt đầu ống `HTS-CAP-*` chuẩn HTS qua `ui_feature_run` (`hvac-cap`, `inputs: (handent "<handle>")`).
  - 100% block `HTS-CAP-*` được gán đầy đủ thuộc tính `ByLayer`, màu và XData `HTS_OG_DAY` khớp đúng cao độ đáy thiết kế.
  - Đã thực hiện `purge_unused_blocks`: `0` block rác thừa (`instance_count = 0`).
  - Đã lưu bản vẽ (`QSAVE`).

---

## Danh Sách 9 Vị Trí Nắp Bịt `HTS-CAP-*` Đã Tạo

| STT | Mã Tuyến & Hệ | Handle Mới | Tên Block HTS | Layer | Cao Độ BOD | Chiều Dài L | Tọa Độ Gốc Chèn $(X, Y)$ | Đối Chiếu Revit Gốc |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | `EAD-N2` | `33CB8` | `HTS-CAP-700x300-L147` | `M-MVAC-EAD` | **3200** | $147\text{ mm}$ | $(-56922, 118269)$ | Khớp khít `2FEC2` $(-56775, 118269)$ |
| **2** | `EAD-W6` | `33CC0` | `HTS-CAP-1000x450-L605` | `M-MVAC-EAD` | **2575** | $605\text{ mm}$ | $(-86712, 69822)$ | Khớp khít `30640` $(-87317, 69822)$ |
| **3** | `SED-NW_End500` | `33CC8` | `HTS-CAP-500x350-L361` | `M-MVAC-SEAD` | **2675** | $361\text{ mm}$ | $(-86586, 42631)$ | Khớp khít `2FF4F` $(-86586, 42271)$ |
| **4** | `SED-NE_Trunk500` | `33CD0` | `HTS-CAP-500x350-L838` | `M-MVAC-SEAD` | **2800** | $838\text{ mm}$ | $(-60669, 49618)$ | Khớp khít `300AE` $(-60669, 48780)$ |
| **5** | `SED-S_Header` | `33CD8` | `HTS-CAP-2200x550-L1026` | `M-MVAC-SEAD` | **2950** | $1026\text{ mm}$ | $(-50963, 17820)$ | Khớp khít `300B8` $(-51989, 17820)$ |
| **6** | `SED-S_NE_Branch` | `33CE0` | `HTS-CAP-950x450-L231` | `M-MVAC-SEAD` | **3050** | $231\text{ mm}$ | $(-46184, 24622)$ | Khớp khít Line bít `31902` $(-46184, 24853)$ |
| **7** | `SED-S_NorthBranch350` | `33CE8` | `HTS-CAP-350x350-L117` | `M-MVAC-SEAD` | **2770** | $117\text{ mm}$ | $(-78761, 38860)$ | Khớp khít `300CD` $(-78761, 38977)$ |
| **8** | `SED-S_SouthTrunk750` | `33CF0` | `HTS-CAP-750x350-L413` | `M-MVAC-SEAD` | **2820** | $413\text{ mm}$ | $(-78759, -846)$ | Khớp khít `300CF` $(-78758, -1259)$ |
| **9** | `SED-SW_Branch800` | `33CF8` | `HTS-CAP-800x350-L1089` | `M-MVAC-SEAD` | **3200** | $1089\text{ mm}$ | $(-62947, 4998)$ | Khớp khít `300CC` $(-62947, 3909)$ |

---

## Kết Quả Kiểm Kê Nhanh (QA Pre-Check)

- **Tổng số block HTS trên các lớp `M-MVAC-*`**: **397 block** (bao gồm 9 Block `HTS-CAP-*`, 346 đốt thẳng `HTS-OG-*`, 42 cút bo `HTS-CO-V47-*`) + 8 thực thể ký hiệu mặt bằng Z-offset (`RECTANG` + `PL` chữ Z).
- **100% Block có XData `HTS_OG_DAY`**: 397/397.
- **Bảo toàn thực thể thiết kế gốc**: Khớp đúng 608/608 thực thể theo `baseline.json`.
- **0 Block rác thừa**: Đã purge sạch 0 unused block definitions.
