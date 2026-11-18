# SHOP-DRAWING-HVAC-AI

Dự án triển khai **Shop Drawing hệ thống Ống gió Điều hòa Thông gió (HVAC)** trên AutoCAD tự động hóa bằng AI kết hợp **100% HTS Tool (`hts-autocad` MCP Server)**, bao gồm toàn bộ bản vẽ thực chiến, bộ tiêu chuẩn Spec Layer, dữ liệu phân tích kỹ thuật, ảnh nghiệm thu QA/QC, script hỗ trợ và hệ thống tri thức **Skills & Rules** cho Antigravity.

---

## 1. Cấu Trúc Thư Mục Dự Án

```text
SHOP-DRAWING-HVAC-AI/
├── .agents/
│   ├── rules/
│   │   └── hvac-shopdrawing-rules.md       # Kỷ luật triển khai Shop Drawing HVAC của dự án
│   └── skills/
│       ├── shopdrawing-ong-gio/            # Skill chuẩn triển khai Shop Drawing Ống gió bằng 100% HTS Tool (Turbo v2)
│       │   ├── SKILL.md
│       │   ├── references/
│       │   │   ├── spec-layer-ong-gio.md           # Spec v3: 16 Layer, 2 DimStyle (M-DIM 1-400 / HỒ-DIM 1-70) & 14 Block ký hiệu
│       │   │   └── hts-hvac-tools-cheatsheet.md    # Cẩm nang MCP HTS & 8 kinh nghiệm thực chiến (Z-offset, hvac-cap, MATCHPROP...)
│       │   └── scripts/                            # Bộ 6 Script Turbo Node.js (0 dependency, rút thời gian vẽ gấp 4-5 lần)
│       │       ├── hts_mcp.mjs
│       │       ├── survey_hvac.mjs                 # Khảo sát + baseline.json (< 1s)
│       │       ├── init_spec_layers.mjs            # Chuẩn hóa mm + 13 Layer Spec (< 0.2s)
│       │       ├── draw_z_offsets.mjs              # Trích chi tiết chuyển cao độ ΔZ>200mm + 3 Dim 0.000mm + MATCHPROP (< 3s)
│       │       ├── apply_endcaps.mjs               # Xóa đốt <100mm & bịt đầu hvac-cap qua (handent) (< 2s)
│       │       └── qa_audit_hvac.mjs               # Nghiệm thu độc lập 5/5 tiêu chí QA/QC (< 0.3s)
│       ├── hts-cad/                        # Skill kết nối & điều khiển AutoCAD qua HTS MCP (:5088) / VCS (:5077)
│       └── dim-ong-gio/                    # Skill & AutoLISP tự động Dim kích thước ống gió HVAC (DOG/DAO/UDOG)
├── shop drawwing onng gio.dwg              # Bản vẽ Shop Drawing hệ Hút khói (SEAD) đã triển khai đè khít 100% HTS Tool
├── Spec-layer ký hiệu ống gió.dwg          # Bản vẽ tiêu chuẩn quy tắc Layer & ký hiệu ống gió (M-MVAC-*, CLOUND)
├── bản vẽ  mẫu/                            # Bản vẽ mẫu tham khảo
├── MCP-HTS/                                # Tài liệu kết nối AI với HTS & VCS + bộ cài cầu nối MCP
├── work_hvac/                              # Hồ sơ phân tích kỹ thuật, script phân tích, ảnh nghiệm thu QA/QC & bản sao lưu gốc
└── Huong_Dan_Su_Dung_Antigravity_2_0.pdf   # Tài liệu hướng dẫn Antigravity
```

---

## 2. Nguyên Tắc Cốt Lõi (Kỷ Luật Thép)

1. **Yêu cầu gì làm đúng 100% như thế & Bảo vệ thành quả trước**: Không tự ý đặt cửa gió, van gió, giá đỡ hay hạng mục ngoài yêu cầu; sửa vị trí nào chỉ thao tác cục bộ đúng vị trí đó.
2. **Bắt buộc 100% HTS Tool**: Mọi ống gió thẳng (chia đốt `1110 mm`), cút bo `V47`, côn thu khớp đúng chiều dài thiết kế (`L204/L202/L650`), gót giày `HTS-TAP-*`, chạc quần Y, nắp bịt đầu `HTS-CAP-*` đều dựng bằng công cụ chuẩn HTS (`hts-autocad`, cổng `5088`).
3. **Vẽ đè trực tiếp 100% tại chỗ (`In-Place Overlay`)**: Khớp từng milimét lên nét thiết kế cũ, bảo toàn nguyên vẹn 100% nền thiết kế gốc.
4. **Nội suy kích thước dọc tuyến**: Khi tuyến ống chuyển hướng mà thiếu Text thông số thì nội suy theo Text trên tuyến đó; kích thước chỉ thay đổi khi đi qua phụ kiện **côn thu** sang tuyến tiếp theo.
5. **Loại trừ 100% giữa Vẽ Shop và Khoanh mây `REVCLOUD`**: Vùng hiểu chắc chắn đúng thì vẽ và không khoanh mây; vùng thực sự thiếu thông số không thể nội suy thì khoanh mây trên Layer `CLOUND` và bỏ trống hoàn toàn bên trong để trình hỏi lại kỹ sư.
6. **Xác nhận Spec Layer đầu mỗi dự án mới**: Luôn đối chiếu và hỏi xác nhận bảng Layer `M-MVAC-*` trước khi bắt đầu triển khai dự án mới.
