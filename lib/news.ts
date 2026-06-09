import type { NewsItem } from "@/types";

/**
 * News / announcements (お知らせ) shown on the store top page and list page.
 * Demo data — replace with real announcements per store later.
 */
export const NEWS: NewsItem[] = [
  {
    slug: "open-house-0614",
    date: "2026.05.28",
    tag: "イベント",
    title: "完成見学会を6月14日(土)・15日(日)に開催します",
    image:
      "https://unstandard-members.com/wp-members/wp-content/uploads/2025/08/f5dfebd59cf335ce4a3fd08b8fb54d3a-1024x759.jpg",
    body: [
      "6月14日(土)・15日(日)の2日間、完成したばかりのお住まいをご見学いただける「完成見学会」を開催します。実際に建てられたお家を見て、暮らしのイメージをふくらませてみませんか。",
      "今回ご紹介するのは、ご家族の「好き」を詰め込んだ、光と風が心地よく抜けるお住まいです。間取りの工夫や素材選び、収納のアイデアなど、家づくりのヒントがたくさん詰まっています。",
      "ご予約優先での開催となります。お問い合わせフォーム、またはお電話にてお気軽にお申し込みください。スタッフ一同、皆さまのご来場を心よりお待ちしております。",
    ],
  },
  {
    slug: "summer-holiday-2026",
    date: "2026.05.15",
    tag: "お知らせ",
    title: "夏季休業のお知らせ（8/13〜8/16）",
    image:
      "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/67b047e4cf189585e7de56463b225a4b-1024x703.jpg",
    body: [
      "誠に勝手ながら、8月13日(水)から8月16日(土)までを夏季休業とさせていただきます。期間中はご不便をおかけしますが、何卒ご理解のほどよろしくお願い申し上げます。",
      "休業期間中にいただいたお問い合わせ・資料請求につきましては、8月17日(日)以降、順次ご対応いたします。お急ぎの場合は、メールにてご連絡いただけますと幸いです。",
    ],
  },
  {
    slug: "works-hiraya-light",
    date: "2026.05.02",
    tag: "施工事例",
    title: "新しい施工事例「光あふれる平屋の家」を公開しました",
    image:
      "https://unstandard-members.com/wp-members/wp-content/uploads/2025/07/a40b3b92ec22552ea2a03bdd5b7793dd-768x1024.jpg",
    body: [
      "新しい施工事例「光あふれる平屋の家」を公開しました。大きな窓から自然光がたっぷり差し込む、開放感のあるワンフロアの住まいです。",
      "家族の気配を感じながら、それぞれが思い思いに過ごせる間取り。庭とつながるリビングや、回遊できる動線など、暮らしやすさにこだわりました。",
      "施工事例ページでは、さまざまなアングルの写真とともに、こだわりのポイントをご紹介しています。ぜひご覧ください。",
    ],
  },
];

/** Find a single news item by its slug. */
export function getNews(slug: string): NewsItem | undefined {
  return NEWS.find((n) => n.slug === slug);
}
