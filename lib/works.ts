import type { Work } from "@/types";

/**
 * 施工事例（WORKS）。各加盟店の「UNSTANDARD専用サイト」公開ページから取得（2026-06-02時点）。
 * 全18件のうち15件が本部事例（shared=true・全店共有）、3件が加盟店の独自事例。
 * 画像は移行前の members.com ホスト。データ移行時に自社ストレージへ再ホストする。
 */
export const WORKS: Work[] = [
  {
    id: 1834,
    title: "感性で彩る、ギャラリーのような住まい",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/08/f5dfebd59cf335ce4a3fd08b8fb54d3a-1024x759.jpg",
    tags: ["NONDESIGN SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 1707,
    title: "シンプルで心地よい住まい",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/a40b3b92ec22552ea2a03bdd5b7793dd-768x1024.jpg",
    tags: ["NONDESIGN SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 1701,
    title: "自分スタイルを詰め込んだ家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/67b047e4cf189585e7de56463b225a4b-1024x703.jpg",
    tags: ["NONDESIGN SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 1622,
    title: "ライフスタイルに合わせて変化する家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/1f43e27fdfc4794fba3366461d1c622a-855x1024.jpg",
    tags: ["NONDESIGN SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 1603,
    title: "お家サウナを楽しむ“こころ”と“からだ”をととのえる家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/36560cc1ca43844c09ff17dcc6d05a13-1024x766.jpg",
    tags: ["NONDESIGN SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 1590,
    title: "お家キャンプを楽しむ庭のある平屋",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/99879f42e8f89caf274acbe0e2d315e2-1024x1004.jpg",
    tags: ["WOODBOX SERIES", "平屋"],
    shared: true,
  },
  {
    id: 1582,
    title: "“KARE”で彩る暮らしを楽しむ家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/KARE_2.jpg",
    tags: ["COLLABORATION", "二階建て"],
    shared: true,
  },
  {
    id: 1569,
    title: "⾃然と調和する、今も将来も暮らしたい平屋",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/7f8ca035529675b5fef7c4ad952118d1-1024x768.jpg",
    tags: ["WOODBOX SERIES", "平屋"],
    shared: true,
  },
  {
    id: 1524,
    title: "⼼地よさを共に育む、北欧を感じる家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/HYGGE-1024x749.jpg",
    tags: ["COLLABORATION", "二階建て"],
    shared: true,
  },
  {
    id: 229,
    title: "個性を詰め込んだ、黄色と北欧ナチュラルな家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2023/08/da3cb4df23c2aa6d4d6c9206fd834f48-1024x683.jpg",
    tags: ["NONDESIGN SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 390,
    title: "庭とつながるウッドデッキのある家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2023/08/1053_MG_8790-1024x683.jpg",
    tags: ["WOODBOX SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 400,
    title: "愛犬と過ごすこだわりがつまった平屋",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2023/08/cb2df24747c01195f46bcda3b6284688-1024x683.png",
    tags: ["WOODBOX SERIES", "平屋", "狭小エリア向き"],
    shared: true,
  },
  {
    id: 369,
    title: "空とつながる屋上リビングのある家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2023/08/1234_MG_2720-1024x683.jpg",
    tags: ["WOODBOX SERIES"],
    shared: true,
  },
  {
    id: 406,
    title: "大人も子どもも楽しめるお家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2023/08/4R4A0754-1024x683.jpg",
    tags: ["WOODBOX SERIES", "二階建て"],
    shared: true,
  },
  {
    id: 1561,
    title: "家具やインテリアが映える、オールドアメリカンな家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/78f2b0779bec4e166209c47b43c2b71f-1024x681.jpg",
    tags: ["COLLABORATION", "二階建て"],
    shared: true,
  },
  {
    id: 1088,
    title: "シルバーの外観が目を引くロフトハウス",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2024/09/25f579b3439aa74d2f77a62c5f31f4b2-1024x680.jpg",
    tags: ["WOODBOX SERIES", "二階建て"],
    shared: false,
  },
  {
    id: 1083,
    title: "ご夫婦のこだわりが詰まったBUNGALOW",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2024/09/DSC07566-1024x680.jpg",
    tags: ["WOODBOX SERIES", "平屋"],
    shared: false,
  },
  {
    id: 693,
    title: "アクセントクロスが可愛いナチュラルなお家",
    image: "https://unstandard-members.com/wp-members/wp-content/uploads/2023/12/s520-1024x683.jpg",
    tags: ["WOODBOX SERIES", "二階建て", "平屋"],
    shared: false,
  },
];

/** 加盟店slug → その店ページに表示される施工事例ID（表示順）。 */
export const WORKS_BY_TENANT: Record<string, number[]> = {
  "housingfukushimacenter": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1524, 229, 390, 400, 369, 406],
  "onfleekhome": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "woodplan": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "itakura": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "kuusou-koubou": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "woodbox-yamanashi": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "hilaki": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1524, 229, 390, 400, 369, 406],
  "flash": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "tsujiya_archt": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1524, 229, 390, 400, 369, 406],
  "hiraokakensetu": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "nawa-kenchiku": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "harmony": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "soubi-kenchiku-kikaku": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1524, 229, 390, 400, 369, 406],
  "woodbox-osaka": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1524, 229, 390, 400, 369, 406],
  "kaitaku": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1524, 229, 390, 400, 369, 406],
  "kindwork": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "arcathhome": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 229, 390, 400, 369, 406],
  "den-kenchiku": [1834, 1707, 1701, 1622, 1603, 1590, 1582, 1569, 1561, 1524, 1088, 1083, 693, 229, 390, 400, 369, 406],
};

const WORK_MAP = new Map(WORKS.map((w) => [w.id, w]));

/** 指定した加盟店の施工事例一覧を表示順で返す。 */
export function worksForTenant(slug: string): Work[] {
  const ids = WORKS_BY_TENANT[slug] ?? [];
  return ids.map((id) => WORK_MAP.get(id)).filter((w): w is Work => Boolean(w));
}
