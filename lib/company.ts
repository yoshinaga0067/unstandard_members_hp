import type { Tenant } from "@/types";

// Demo imagery (reused from existing UNSTANDARD assets — replace with real photos later).
export const ABOUT_TEAM_IMAGE =
  "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/06_FLAT_PC-1024x589.jpg";

// CONCEPT MESSAGE block copy.
export const ABOUT_CONCEPT = {
  heading: ["無二の「好き」を見つけ、", "暮らしのかたちにする。", "それが、私たちの家づくりです。"],
  body: [
    "私たちの家づくりは、「あなたらしさ」から始まります。",
    "暮らす人の好きや価値観をていねいに伺い、世界にひとつの住まいへとかたちにしていきます。",
    "決めすぎないデザインだからこそ、自由で、長く愛せる家になる。",
    "お客様の「こんな暮らしがしたい」を、確かなかたちへ。一緒に育てていきます。",
  ],
};

// STRONG POINTS — three strengths shown with circular photos.
export const STRENGTHS = [
  {
    no: "01",
    title: "好きを見抜くヒアリング力",
    text: "家づくりの始まりは、ていねいな対話から。暮らし方や憧れをじっくり伺い、まだ言葉になっていない「好き」や可能性を引き出します。",
    image:
      "https://unstandard-members.com/wp-members/wp-content/uploads/2025/08/f5dfebd59cf335ce4a3fd08b8fb54d3a-1024x759.jpg",
  },
  {
    no: "02",
    title: "自由設計と自然素材",
    text: "決めすぎないデザインと自然素材で、あなたらしい住まいを設計します。間取りも素材も、暮らしに合わせて自由に組み立てられます。",
    image:
      "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/67b047e4cf189585e7de56463b225a4b-1024x703.jpg",
  },
  {
    no: "03",
    title: "建てたあとも、ずっと安心",
    text: "完成はゴールではなくスタート。引き渡し後も定期点検とアフターサポートで、長く快適に暮らせる住まいを支えます。",
    image:
      "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/a40b3b92ec22552ea2a03bdd5b7793dd-768x1024.jpg",
  },
];

// PROFILE — 会社概要 rows. Uses tenant data where available; demo values otherwise.
export function companyProfile(tenant: Tenant): { label: string; value: string }[] {
  return [
    { label: "会社名", value: tenant.name },
    { label: "代表者", value: "代表 太郎（デモ）" },
    {
      label: "所在地",
      value: `〒${tenant.postalCode} ${tenant.prefecture}${tenant.city}${tenant.street}`,
    },
    {
      label: "連絡先",
      value: `TEL ${tenant.tel}${tenant.fax ? `　FAX ${tenant.fax}` : ""}`,
    },
    { label: "事業内容", value: "注文住宅の設計・施工、リフォーム、不動産" },
    { label: "創業", value: "2005年4月（デモ）" },
    { label: "資本金", value: "2,000万円（デモ）" },
    { label: "従業員数", value: "34名（デモ）" },
    { label: "建設業許可番号", value: "国土交通大臣許可（般-X）第00000号（デモ）" },
  ];
}
