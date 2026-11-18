import fs from "fs";
import path from "path";

const DIR = "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2";
const blocks = JSON.parse(fs.readFileSync(path.join(DIR, "classified_blocks.json"), "utf8"));

// Helper: build complete List A runs with exact 0.01 mm coordinates
// Note: Every Z-offset is modeled as its own dedicated straight run between Flange_1 and Flange_2
// so upstream has exact BOD1, downstream has exact BOD2, and Z-offset block matches exact outer flanges.

const runs = [
  // ======================== SEAD MAIN HEADER ========================
  {
    id: "SEAD-M01",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 2200, H: 550, R: null, BOD: 2950,
    note: "Main exhaust header: Endcap 1CDBE (X=49991.10) to Trouser Piece boundary RC-01 (X=57677.11)",
    points: [
      { x: 49991.10, y: 39311.12 },
      { x: 57677.11, y: 39311.77 }
    ]
  },

  // ======================== SEAD BRANCH 1: NORTH-WEST TRUNK (1850 -> 1500 -> 350 & 1300 -> 1200 -> 950 -> 750) ========================
  {
    id: "SEAD-NW01a",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1850, H: 450, R: null, BOD: 3050,
    note: "Branch tap 1CDCC stub from header edge Y=40411.40 (tap L=150) to VCD 1CDD9 bottom Y=41043.75. Extend to Y=40411.40 for QUETPK tap generation.",
    points: [
      { x: 50997.74, y: 40411.40 },
      { x: 50997.72, y: 41043.75 }
    ]
  },
  {
    id: "SEAD-NW01b",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1850, H: 450, R: null, BOD: 3050,
    note: "VCD 1CDD9 top Y=41193.78 to Z-offset Z-02 bottom flange Y=50339.25",
    points: [
      { x: 50997.71, y: 41193.78 },
      { x: 50997.71, y: 50339.25 }
    ]
  },
  {
    id: "SEAD-NW01z",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1850, H: 450, R: null, BOD: 2675,
    isZOffset: true,
    zInfo: "Z-02: Vertical 45-deg drop BOD +3050 -> +2300 (dZ=-750mm, 1CF1C+1CF1B, L=1126.79mm)",
    points: [
      { x: 50997.71, y: 50339.25 },
      { x: 50997.71, y: 51466.04 }
    ]
  },
  {
    id: "SEAD-NW02",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1850, H: 450, R: null, BOD: 2300,
    note: "Z-02 top flange Y=51466.04 -> 90-deg Elbow 1CF17 (50997.71, 54834.94) -> RED-01 east flange X=38278.07",
    points: [
      { x: 50997.71, y: 51466.04 },
      { x: 50997.71, y: 54834.94 },
      { x: 38278.07, y: 54834.94 }
    ]
  },
  {
    id: "SEAD-NW03",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1500, H: 450, R: null, BOD: 2300,
    note: "RED-01 west flange X=38074.05 (Flat TOP Y=55760.56, CL shifted +175mm to Y=55010.56) -> Z-03 east flange X=28212.53",
    points: [
      { x: 38074.05, y: 55010.56 },
      { x: 28212.53, y: 55009.71 }
    ]
  },
  {
    id: "SEAD-NW03z",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1500, H: 450, R: null, BOD: 2510,
    isZOffset: true,
    zInfo: "Z-03: Vertical 45-deg rise BOD +2300 -> +2720 (dZ=+420mm, 1CFD0+1CFD1, L=795.41mm)",
    points: [
      { x: 28212.53, y: 55009.71 },
      { x: 27417.12, y: 55009.86 }
    ]
  },
  {
    id: "SEAD-NW04",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1500, H: 450, R: null, BOD: 2720,
    note: "Z-03 west flange X=27417.12 -> Endcap 1CDD4 face X=22396.25",
    points: [
      { x: 27417.12, y: 55009.86 },
      { x: 22396.25, y: 55009.86 }
    ]
  },
  {
    id: "SEAD-NW05",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 350, H: 350, R: null, BOD: 2770,
    note: "Spur north from SEAD-1500x450 top edge Y=55759.86 (Tap 1CECE L=150) -> Endcap 1CDD3 face Y=60468.49",
    points: [
      { x: 23219.35, y: 55759.86 },
      { x: 23218.96, y: 60468.49 }
    ]
  },
  {
    id: "SEAD-W01a",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1300, H: 450, R: null, BOD: 2720,
    note: "West vertical trunk stub: SEAD-1500x450 bottom edge Y=54259.86 (Tap 1CECF L=150) -> VCD 1CED0 top Y=53843.81",
    points: [
      { x: 23219.47, y: 54259.86 },
      { x: 23219.49, y: 53843.81 }
    ]
  },
  {
    id: "SEAD-W01b",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1300, H: 450, R: null, BOD: 2720,
    note: "VCD 1CED0 bottom Y=53693.81 -> RED-02 top flange Y=45576.97",
    points: [
      { x: 23219.51, y: 53693.81 },
      { x: 23220.19, y: 45576.97 }
    ]
  },
  {
    id: "SEAD-W02",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1200, H: 400, R: null, BOD: 2770,
    note: "RED-02 bottom flange Y=45372.97 -> RED-03 top flange Y=38827.97 (Flat Top TOD=+3170)",
    points: [
      { x: 23220.27, y: 45372.97 },
      { x: 23220.82, y: 38827.97 }
    ]
  },
  {
    id: "SEAD-W03",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 400, R: null, BOD: 2770,
    note: "RED-03 bottom flange Y=38623.97 -> RED-04 top flange Y=31948.97",
    points: [
      { x: 23220.84, y: 38623.97 },
      { x: 23221.41, y: 31948.97 }
    ]
  },
  {
    id: "SEAD-W04",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 750, H: 350, R: null, BOD: 2820,
    note: "RED-04 bottom flange Y=31744.97 -> Endcap 1CDD5 face Y=20232.03",
    points: [
      { x: 23221.40, y: 31744.97 },
      { x: 23222.36, y: 20232.03 }
    ]
  },

  // ======================== SEAD BRANCH 2: NORTH-EAST TRUNK (950 -> 700 -> 550) ========================
  {
    id: "SEAD-NE01a",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 450, R: null, BOD: 3050,
    note: "Branch tap 1CDA8 stub from header edge Y=40411.61 (Tap L=150) -> VCD 1CDD6 bottom Y=40878.89",
    points: [
      { x: 55796.32, y: 40411.61 },
      { x: 55796.32, y: 40878.89 }
    ]
  },
  {
    id: "SEAD-NE01b",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 450, R: null, BOD: 3050,
    note: "VCD 1CDD6 top Y=41028.89 -> 90-deg Elbow 1CDA9 (55796.32, 47296.09) -> Z-01a west flange X=57649.13",
    points: [
      { x: 55796.32, y: 41028.89 },
      { x: 55796.32, y: 47296.09 },
      { x: 57649.13, y: 47296.25 }
    ]
  },
  {
    id: "SEAD-NE01z1",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 450, R: null, BOD: 2778,
    isZOffset: true,
    zInfo: "Z-01a: Vertical 45-deg drop BOD +3050 -> +2505 (dZ=-545mm, 1CDB2+1CDB3, L=921.78mm) passing under PAD-900x500",
    points: [
      { x: 57649.13, y: 47296.25 },
      { x: 58570.91, y: 47296.32 }
    ]
  },
  {
    id: "SEAD-NE01low",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 450, R: null, BOD: 2505,
    note: "Low straight section passing under PAD-900x500 (BOD=+2505, top=+2955 < PAD bottom +3000)",
    points: [
      { x: 58570.91, y: 47296.32 },
      { x: 59950.78, y: 47296.44 }
    ]
  },
  {
    id: "SEAD-NE01z2",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 450, R: null, BOD: 2778,
    isZOffset: true,
    zInfo: "Z-01b: Vertical 45-deg rise BOD +2505 -> +3050 (dZ=+545mm, 1CDB1+1CDB0, L=921.77mm)",
    points: [
      { x: 59950.78, y: 47296.44 },
      { x: 60872.55, y: 47296.52 }
    ]
  },
  {
    id: "SEAD-NE02",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 950, H: 450, R: null, BOD: 3050,
    note: "Z-01b east flange X=60872.55 -> 90-deg Elbow 1CDB4 (66268.04, 47296.50) -> RED-05 bottom flange Y=59911.36",
    points: [
      { x: 60872.55, y: 47296.52 },
      { x: 66268.04, y: 47296.50 },
      { x: 66266.98, y: 59911.36 }
    ]
  },
  {
    id: "SEAD-NE03",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 700, H: 400, R: null, BOD: 3100,
    note: "RED-05 top flange Y=60115.36 -> 39-deg Elbow 1CCD1 (66266.87, 61400.72) -> 39-deg Elbow 1CCD0 (69234.80, 65066.43) -> 90-deg Elbow 1CCE5 (69234.80, 72956.07) -> RED-06 east flange X=63914.98",
    points: [
      { x: 66266.96, y: 60115.36 },
      { x: 66266.87, y: 61400.72 },
      { x: 69234.80, y: 65066.43 },
      { x: 69234.80, y: 72956.07 },
      { x: 63914.98, y: 72955.62 }
    ]
  },
  {
    id: "SEAD-NE04",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 550, H: 350, R: null, BOD: 3150,
    note: "RED-06 west flange X=63710.98 -> Endcap 1CDB6 face X=50385.52",
    points: [
      { x: 63710.98, y: 72955.62 },
      { x: 50385.52, y: 72955.62 }
    ]
  },

  // ======================== SEAD BRANCH 3: SOUTH TRUNK (1200 -> 1000 & 750) ========================
  {
    id: "SEAD-S01a",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1200, H: 400, R: null, BOD: 3100,
    note: "Branch tap 1CDC9 from header bottom edge Y=38211.21 (Tap L=150) + 102.92mm stub to VCD 1CDC2 top Y=37956.19 (total 255mm; use temporary longer bait duct for QUETPK then trim to Y=37956.19!)",
    points: [
      { x: 51040.36, y: 38211.21 },
      { x: 51040.36, y: 37956.19 }
    ]
  },
  {
    id: "SEAD-S01b",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1200, H: 400, R: null, BOD: 3100,
    note: "VCD 1CDC2 bottom Y=37806.17 -> RED-07 top flange Y=34359.93",
    points: [
      { x: 51040.36, y: 37806.17 },
      { x: 51040.64, y: 34359.93 }
    ]
  },
  {
    id: "SEAD-S02a",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1000, H: 350, R: null, BOD: 3150,
    note: "RED-07 bottom flange Y=34155.94 (Flat RIGHT X=51640.66, CL shifted +100mm to X=51140.66) -> VCD 1CDC6 top Y=33934.24",
    points: [
      { x: 51140.66, y: 34155.94 },
      { x: 51140.68, y: 33934.24 }
    ]
  },
  {
    id: "SEAD-S02b",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1000, H: 350, R: null, BOD: 3150,
    note: "VCD 1CDC6 bottom Y=33784.24 -> Z-04 top flange Y=29477.18",
    points: [
      { x: 51140.69, y: 33784.24 },
      { x: 51141.04, y: 29477.18 }
    ]
  },
  {
    id: "SEAD-S02z",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1000, H: 350, R: null, BOD: 2825,
    isZOffset: true,
    zInfo: "Z-04: Vertical 45-deg drop BOD +3150 -> +2500 (dZ=-650mm, 1CFAD+1CFAF, L=943.95mm)",
    points: [
      { x: 51141.04, y: 29477.18 },
      { x: 51141.08, y: 28533.23 }
    ]
  },
  {
    id: "SEAD-S03",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1000, H: 350, R: null, BOD: 2500,
    note: "Z-04 bottom flange Y=28533.23 -> Open design end Y=12316.00 (stops cleanly before RC-03!)",
    points: [
      { x: 51141.08, y: 28533.23 },
      { x: 51142.40, y: 12316.00 }
    ]
  },
  {
    id: "SEAD-SW01",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 1000, H: 350, R: null, BOD: 2500,
    note: "Bottom-left horizontal run: stops square at X=48918.10 (before RC-03) -> RED-08 east flange X=35022.39",
    points: [
      { x: 48918.10, y: 11313.82 },
      { x: 35022.39, y: 11312.64 }
    ]
  },
  {
    id: "SEAD-SW02",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 550, H: 350, R: null, BOD: 2500,
    note: "RED-08 west flange X=34818.38 -> Endcap 1CDCB face X=21619.38",
    points: [
      { x: 34818.38, y: 11312.62 },
      { x: 21619.38, y: 11311.50 }
    ]
  },
  {
    id: "SEAD-SE01a",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 750, H: 350, R: null, BOD: 3150,
    note: "Branch tap 1CDCA from SEAD-1200x400 right edge X=51640.58 (Tap L=150) -> VCD 1CDBF left X=52348.10",
    points: [
      { x: 51640.58, y: 35105.87 },
      { x: 52348.10, y: 35105.87 }
    ]
  },
  {
    id: "SEAD-SE01b",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 750, H: 350, R: null, BOD: 3150,
    note: "VCD 1CDBF right X=52498.10 -> 90-deg Elbow 1CEF5 (65649.56, 35105.87) -> Z-05 top flange Y=29588.89",
    points: [
      { x: 52498.10, y: 35105.87 },
      { x: 65649.56, y: 35105.87 },
      { x: 65649.56, y: 29588.89 }
    ]
  },
  {
    id: "SEAD-SE01z",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 750, H: 350, R: null, BOD: 2875,
    isZOffset: true,
    zInfo: "Z-05: Vertical 45-deg drop BOD +3150 -> +2600 (dZ=-550mm, 1CF59+1CF58, L=843.95mm)",
    points: [
      { x: 65649.56, y: 29588.89 },
      { x: 65649.56, y: 28744.94 }
    ]
  },
  {
    id: "SEAD-SE02",
    system: "SEAD",
    layer: "M-MVAC-SEAD",
    W: 750, H: 350, R: null, BOD: 2600,
    note: "Z-05 bottom flange Y=28744.94 -> Endcap 1CF50 face Y=17035.36",
    points: [
      { x: 65649.56, y: 28744.94 },
      { x: 65649.56, y: 17035.36 }
    ]
  },

  // ======================== PAD PRESSURIZATION SYSTEM (900x500) ========================
  {
    id: "PAD-01a",
    system: "PAD",
    layer: "M-MVAC-PAD",
    W: 900, H: 500, R: null, BOD: 3000,
    note: "Between Sq-to-Rd reducer 1D00E west flange X=63205.73 (before RC-02) and MFD-EI120 1D00B east flange X=62284.12",
    points: [
      { x: 63205.73, y: 43441.80 },
      { x: 62284.12, y: 43441.79 }
    ]
  },
  {
    id: "PAD-01b",
    system: "PAD",
    layer: "M-MVAC-PAD",
    W: 900, H: 500, R: null, BOD: 3000,
    note: "MFD-EI120 1D00B west flange X=62134.12 -> 90-deg Elbow 1CEED (59376.28, 43441.86) -> 90-deg Elbow 1CEEC (59374.65, 62586.97) -> Z-06 east flange X=46564.18 (standard R_in=W/2=450)",
    points: [
      { x: 62134.12, y: 43441.89 },
      { x: 59376.28, y: 43441.86 },
      { x: 59374.65, y: 62586.97 },
      { x: 46564.18, y: 62585.92 }
    ]
  },
  {
    id: "PAD-01z",
    system: "PAD",
    layer: "M-MVAC-PAD",
    W: 900, H: 500, R: null, BOD: 3175,
    isZOffset: true,
    zInfo: "Z-06: Vertical 45-deg rise BOD +3000 -> +3350 (dZ=+350mm, 1CEEA+1CEEB, L=768.21mm)",
    points: [
      { x: 46564.18, y: 62585.92 },
      { x: 45795.97, y: 62585.86 }
    ]
  },
  {
    id: "PAD-02",
    system: "PAD",
    layer: "M-MVAC-PAD",
    W: 900, H: 500, R: 225, BOD: 3350,
    note: "Z-06 west flange X=45795.97 -> TIGHT 0.75W Elbow 1CEDE (44976.14, 62585.80, MUST PASS R:225!) -> Z-07 north flange Y=61441.60",
    points: [
      { x: 45795.97, y: 62585.86 },
      { x: 44976.14, y: 62585.80 },
      { x: 44976.29, y: 61441.60 }
    ]
  },
  {
    id: "PAD-02z",
    system: "PAD",
    layer: "M-MVAC-PAD",
    W: 900, H: 500, R: null, BOD: 3570,
    isZOffset: true,
    zInfo: "Z-07: Vertical 45-deg rise BOD +3350 -> +3790 (dZ=+440mm, 1CEE5+1CEE6, L=858.20mm)",
    points: [
      { x: 44976.29, y: 61441.60 },
      { x: 44976.36, y: 60583.40 }
    ]
  },
  {
    id: "PAD-03",
    system: "PAD",
    layer: "M-MVAC-PAD",
    W: 900, H: 500, R: 225, BOD: 3790,
    note: "Z-07 south flange Y=60583.40 -> TIGHT 0.75W Elbow 1CEE1 (44976.58, 57650.79, MUST PASS R:225!) -> Riser 1CCFA east flange X=43827.42 (stops before RC-04!)",
    points: [
      { x: 44976.36, y: 60583.40 },
      { x: 44976.58, y: 57650.79 },
      { x: 43827.42, y: 57650.69 }
    ]
  }
];

const clouds = [
  {
    id: "RC-01",
    minX: 57710, minY: 37300, maxX: 65900, maxY: 41320,
    arcLen: 450,
    title: "Cụm Phòng Quạt Hút Khói Đôi SEAD (Chạc quần + 2 Quạt TDA 1000 + 4 Tiêu âm + Đầu đẩy cụt)",
    reason: "Thiếu 100% Text kích thước (WxH / ØD) & cao độ BOD cho cả 2 nhánh quạt và đầu đẩy cụt tại X=65680; HTS không có block Quạt hướng trục & Tiêu âm khối; đầu đẩy kết thúc cụt chưa rõ đấu nối Shaft/Louver."
  },
  {
    id: "RC-02",
    minX: 63235, minY: 41350, maxX: 66950, maxY: 44100,
    arcLen: 400,
    title: "Cụm Quạt Tăng Áp PAD (TDA 900) & Mâu thuẫn Nhãn SEAD-900x350 / Đầu hút cụt",
    reason: "Quạt hướng trục TDA 900 chưa có block HTS & thiếu ØD/BOD đoạn tròn; mâu thuẫn nghiêm trọng ngay sau cút 1CCF9 nối từ PAD-900x500 (BOD=+3000) lại gắn nhãn leader SEAD-900x350 (BOD=+3075) dù không có côn thu hay chuyển cao độ; đầu ống tại Y=41521.5 kết thúc cụt."
  },
  {
    id: "RC-03",
    minX: 48955, minY: 10600, maxX: 51850, maxY: 12285,
    arcLen: 350,
    title: "Góc Đứt Gãy Thiếu Cút Nối SEAD-1000x350 Đáy Nam",
    reason: "Hai tuyến SEAD-1000x350 (BOD=+2500) bị cắt hở cụt không có cút nối hay bịt đầu (ống đứng dừng tại Y=12316; ống ngang hai mép lệch nhau 50.9mm tại X=48918.1 / 48969.0, cách tim ống đứng 2199mm). Cần xác nhận nối cút 90° hay có trục đứng/van bị thiếu."
  },
  {
    id: "RC-04",
    minX: 43020, minY: 57000, maxX: 43800, maxY: 58300,
    arcLen: 250,
    title: "Trục Đứng / Cút Đứng Cuối Tuyến PAD-900x500 (1CCFA + Hatch 1CBFF)",
    reason: "Cút đứng chuyển trục 900x500 ở cuối tuyến PAD (BOD=+3790) không có ghi chú hướng đi LÊN (UP) hay XUỐNG (DOWN), không rõ cao độ đích trục kỹ thuật và là loại cút cong đứng 0.75W EI120."
  },
  {
    id: "RC-05",
    minX: 35700, minY: 52850, maxX: 37300, maxY: 53650,
    arcLen: 250,
    title: "Nhãn Text Lạc 'PAD-1200x450 / BOD=FFL+3550' Không Có Tuyến Ống",
    reason: "Nhãn MTEXT PAD-1200x450 BOD=FFL+3550 nằm trơ trọi ở khoảng trống bên dưới ống SEAD-1500x450 mà không có nét ống gió tương ứng. Cần xác nhận là Text thừa từ thiết kế cũ hay bị thiếu tuyến ống PAD-1200x450."
  }
];

// AUTOMATED ZERO-OVERLAP CHECK: Expand every List A run by W/2 + 25mm (TDC flange allowance)
// and verify ZERO intersection with ANY cloud box!
let overlaps = 0;
for (const r of runs) {
  const half = r.W / 2 + 25;
  for (let i = 0; i < r.points.length - 1; i++) {
    const p1 = r.points[i], p2 = r.points[i + 1];
    // Segment bbox (axis-aligned approximation with flange allowance along perp only, exact endpoints along axis)
    const dx = Math.abs(p2.x - p1.x), dy = Math.abs(p2.y - p1.y);
    const isHoriz = dx > dy;
    const sMinX = Math.min(p1.x, p2.x) - (isHoriz ? 5 : half);
    const sMaxX = Math.max(p1.x, p2.x) + (isHoriz ? 5 : half);
    const sMinY = Math.min(p1.y, p2.y) - (isHoriz ? half : 5);
    const sMaxY = Math.max(p1.y, p2.y) + (isHoriz ? half : 5);
    for (const c of clouds) {
      const hitX = sMinX < c.maxX && sMaxX > c.minX;
      const hitY = sMinY < c.maxY && sMaxY > c.minY;
      if (hitX && hitY) {
        console.log(`OVERLAP DETECTED: run ${r.id} seg ${i} [${sMinX.toFixed(1)},${sMinY.toFixed(1)}..${sMaxX.toFixed(1)},${sMaxY.toFixed(1)}] vs ${c.id} [${c.minX},${c.minY}..${c.maxX},${c.maxY}]`);
        overlaps++;
      }
    }
  }
}
console.log("ZERO-OVERLAP CHECK:", overlaps === 0 ? "PASS (0 overlaps!)" : `FAIL (${overlaps} overlaps)`);

// Build complete grille taps table (28 taps)
const grilleTaps = [];
for (const t of blocks.taps) {
  const g = blocks.grilles.find(gr => {
    const dx = Math.max(t.minX - gr.maxX, 0, gr.minX - t.maxX);
    const dy = Math.max(t.minY - gr.maxY, 0, gr.minY - t.maxY);
    return Math.hypot(dx, dy) < 50;
  });
  const isGrilleTap = !!g || Math.abs(Math.max(t.dx, t.dy) - 780) < 2;
  if (!isGrilleTap) continue;
  const tcx = (t.minX + t.maxX) / 2;
  const tcy = (t.minY + t.maxY) / 2;
  let attach, dir, collarCenter, bevelDir, baitEnd;
  if (t.dx < t.dy) {
    // Protrudes horizontally (-X or +X)
    const left = g ? g.cx < tcx : (t.rotDeg < 90 || t.rotDeg > 270);
    dir = left ? "-X" : "+X";
    const ax = left ? t.maxX : t.minX;
    const cy = g ? g.cy : (tcy - 60);
    bevelDir = tcy > cy ? "+Y" : "-Y";
    attach = { x: +ax.toFixed(2), y: +cy.toFixed(2) };
    baitEnd = { x: +(ax + (left ? -400 : 400)).toFixed(2), y: +cy.toFixed(2) };
    collarCenter = { x: +(ax + (left ? -150 : 150)).toFixed(2), y: +cy.toFixed(2) };
  } else {
    // Protrudes vertically (-Y or +Y)
    const down = g ? g.cy < tcy : (Math.abs(t.rotDeg - 270) < 10);
    dir = down ? "-Y" : "+Y";
    const ay = down ? t.maxY : t.minY;
    const cx = g ? g.cx : (t.minX + 330.00); // 1CDE9 verified: minX=64258.81 -> cx=64588.81
    bevelDir = tcx > cx ? "+X" : "-X";
    attach = { x: +cx.toFixed(2), y: +ay.toFixed(2) };
    baitEnd = { x: +cx.toFixed(2), y: +(ay + (down ? -400 : 400)).toFixed(2) };
    collarCenter = { x: +cx.toFixed(2), y: +(ay + (down ? -150 : 150)).toFixed(2) };
  }
  grilleTaps.push({
    handle: t.handle,
    W: 600, H: 300, L: 150, D: 150,
    layer: "M-MVAC-SEAD",
    protrudes: dir,
    bevel45: bevelDir,
    attach,
    baitEnd,
    collarCenter,
    designBbox: [t.minX, t.minY, t.maxX, t.maxY]
  });
}

// Build branch taps (6)
const branchTaps = [
  { id: "BTAP-01", handle: "1CDCC", W: 1850, H: 450, parent: "SEAD-M01 (2200x550)", attach: { x: 50997.74, y: 40411.40 }, protrudes: "+Y", bevel45: "+X", BOD: 3050 },
  { id: "BTAP-02", handle: "1CDA8", W: 950, H: 450, parent: "SEAD-M01 (2200x550)", attach: { x: 55796.32, y: 40411.61 }, protrudes: "+Y", bevel45: "+X", BOD: 3050 },
  { id: "BTAP-03", handle: "1CDC9", W: 1200, H: 400, parent: "SEAD-M01 (2200x550)", attach: { x: 51040.36, y: 38211.21 }, protrudes: "-Y", bevel45: "+X", BOD: 3100, note: "Only 255mm to VCD 1CDC2! Use temporary bait duct to Y=37750 -> QUETPK -> trim to Y=37956.19" },
  { id: "BTAP-04", handle: "1CDCA", W: 750, H: 350, parent: "SEAD-S01b (1200x400)", attach: { x: 51640.58, y: 35105.87 }, protrudes: "+X", bevel45: "+Y", BOD: 3150 },
  { id: "BTAP-05", handle: "1CECE", W: 350, H: 350, parent: "SEAD-NW04 (1500x450)", attach: { x: 23219.35, y: 55759.86 }, protrudes: "+Y", bevel45: "+X", BOD: 2770 },
  { id: "BTAP-06", handle: "1CECF", W: 1300, H: 450, parent: "SEAD-NW04 (1500x450)", attach: { x: 23219.47, y: 54259.86 }, protrudes: "-Y", bevel45: "+X", BOD: 2720 },
];

// Build reducers (8 in List A)
const reducers = [
  { id: "RED-01", handle: "1CDD1", from: "1850x450", to: "1500x450", L: 204, type: "Eccentric (Flat TOP Y=55760.56)", f1: { x: 38278.07, y: 54834.94 }, f2: { x: 38074.05, y: 55010.56 }, BOD: 2300 },
  { id: "RED-02", handle: "1CCE7", from: "1300x450", to: "1200x400", L: 204, type: "Concentric (Can)", f1: { x: 23220.19, y: 45576.97 }, f2: { x: 23220.27, y: 45372.97 }, BOD: 2720 },
  { id: "RED-03", handle: "1CCE4", from: "1200x400", to: "950x400", L: 204, type: "Concentric (Can)", f1: { x: 23220.82, y: 38827.97 }, f2: { x: 23220.84, y: 38623.97 }, BOD: 2770 },
  { id: "RED-04", handle: "1CCE6", from: "950x400", to: "750x350", L: 204, type: "Concentric (Can)", f1: { x: 23221.41, y: 31948.97 }, f2: { x: 23221.40, y: 31744.97 }, BOD: 2770 },
  { id: "RED-05", handle: "1CDB5", from: "950x450", to: "700x400", L: 204, type: "Concentric (Can)", f1: { x: 66266.98, y: 59911.36 }, f2: { x: 66266.96, y: 60115.36 }, BOD: 3050 },
  { id: "RED-06", handle: "1CEDB", from: "700x400", to: "550x350", L: 204, type: "Concentric (Can)", f1: { x: 63914.98, y: 72955.62 }, f2: { x: 63710.98, y: 72955.62 }, BOD: 3100 },
  { id: "RED-07", handle: "1CF44", from: "1200x400", to: "1000x350", L: 204, type: "Eccentric (Flat RIGHT X=51640.66)", f1: { x: 51040.64, y: 34359.93 }, f2: { x: 51140.66, y: 34155.94 }, BOD: 3100 },
  { id: "RED-08", handle: "1CCE3", from: "1000x350", to: "550x350", L: 204, type: "Concentric (Can)", f1: { x: 35022.39, y: 11312.64 }, f2: { x: 34818.38, y: 11312.62 }, BOD: 2500 },
];

// Build endcaps (7)
const endcaps = [
  { id: "CAP-01", handle: "1CDBE", W: 2200, H: 550, BOD: 2950, face: { x: 49991.10, y: 39311.12 }, outer: { x: 49966.10, y: 39311.12 }, pickEdge: { x: 49978.60, y: 40411.12 }, dir: "-X" },
  { id: "CAP-02", handle: "1CDD4", W: 1500, H: 450, BOD: 2720, face: { x: 22396.25, y: 55009.86 }, outer: { x: 22371.25, y: 55009.86 }, pickEdge: { x: 22383.75, y: 55759.86 }, dir: "-X" },
  { id: "CAP-03", handle: "1CDD3", W: 350, H: 350, BOD: 2770, face: { x: 23218.96, y: 60468.49 }, outer: { x: 23218.96, y: 60493.49 }, pickEdge: { x: 23043.96, y: 60480.99 }, dir: "+Y" },
  { id: "CAP-04", handle: "1CDD5", W: 750, H: 350, BOD: 2820, face: { x: 23222.36, y: 20232.03 }, outer: { x: 23222.36, y: 20207.03 }, pickEdge: { x: 22847.36, y: 20219.53 }, dir: "-Y" },
  { id: "CAP-05", handle: "1CDB6", W: 550, H: 350, BOD: 3150, face: { x: 50385.52, y: 72955.62 }, outer: { x: 50360.52, y: 72955.62 }, pickEdge: { x: 50373.02, y: 73230.62 }, dir: "-X" },
  { id: "CAP-06", handle: "1CDCB", W: 550, H: 350, BOD: 2500, face: { x: 21619.38, y: 11311.50 }, outer: { x: 21594.38, y: 11311.50 }, pickEdge: { x: 21606.88, y: 11586.50 }, dir: "-X" },
  { id: "CAP-07", handle: "1CF50", W: 750, H: 350, BOD: 2600, face: { x: 65649.56, y: 17035.36 }, outer: { x: 65649.56, y: 17010.36 }, pickEdge: { x: 65274.56, y: 17022.86 }, dir: "-Y" },
];

const out = {
  drawing: "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\bai 2.dwg",
  backup: "C:\\Users\\Admin\\Desktop\\SHOPDRAWING-HVAC-AI\\work_hvac\\bai2\\bai 2_backup.dwg",
  baseline: {
    total_entities: 380,
    units_original: "Inches (INSUNITS=1 — MUST set INSUNITS=4 & MEASUREMENT=1!)",
    osmode_original: 4031,
    layers: {
      "MEPG-AC-M-Hút khói-Smoke Exhaust Air-SED": 309,
      "MEPG-AC-TEXT": 67,
      "MEPG-M-EQUIP": 3,
      "0": 1
    },
    extents: { minX: 21594.36, minY: 10782.64, maxX: 93916.47, maxY: 73336.01 }
  },
  counts_summary: {
    list_a_runs: runs.length,
    z_offset_bridges: runs.filter(r => r.isZOffset).length,
    planar_elbows_auto: 11,
    reducers_L204: reducers.length,
    branch_taps: branchTaps.length,
    grille_taps_600x300: grilleTaps.length,
    endcaps: endcaps.length,
    list_b_clouds: clouds.length,
    zero_overlap_verified: overlaps === 0
  },
  runs,
  reducers,
  branchTaps,
  grilleTaps,
  endcaps,
  clouds
};

fs.writeFileSync(path.join(DIR, "bai2_geometry.json"), JSON.stringify(out, null, 2), "utf8");
console.log("Wrote bai2_geometry.json! Summary:", JSON.stringify(out.counts_summary, null, 2));
