import { NEWS } from "@/lib/news";
import { EVENTS_BY_TENANT } from "@/lib/events";
import { worksForTenant } from "@/lib/works";
import { PRODUCTS } from "@/lib/products";
import { VOICES } from "@/lib/voices";
import { ABOUT_CONCEPT, ABOUT_TEAM_IMAGE, STRENGTHS } from "@/lib/company";
import { getTenant } from "@/lib/tenants";

// One demo record. Heterogeneous across resources, so values are unknown and
// narrowed at the field layer.
export type AdminItem = Record<string, unknown> & { _id?: string };

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "date"
  | "select"
  | "chips"
  | "image"
  | "images"
  | "blocks"
  | "paragraphs"
  | "toggle";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** preset choices for select / chips */
  options?: string[];
  /** max number of images for the "images" field type (default 8) */
  maxImages?: number;
}

export interface ResourceConfig {
  key: string;
  /** menu / list label */
  label: string;
  /** singular noun used in buttons ("新しい〇〇") */
  singular: string;
  /** shared across all stores (本部配信) vs per-store */
  shared: boolean;
  /** hidden from the main nav/dashboard (edited inside another section) */
  hidden?: boolean;
  fields: Field[];
  seed: (slug: string) => AdminItem[];
  newItem: () => AdminItem;
  getTitle: (item: AdminItem) => string;
  getSubtitle: (item: AdminItem) => string;
  getThumb: (item: AdminItem) => string | undefined;
}

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

// publish toggle shared by every public resource (shown first in the editor)
const PUBLISHED_FIELD: Field = {
  key: "published",
  label: "公開する",
  type: "toggle",
  help: "オフにすると店舗ページに表示されません（下書き）",
};

export const RESOURCES: ResourceConfig[] = [
  {
    key: "news",
    label: "お知らせ",
    singular: "お知らせ",
    shared: false,
    fields: [
      PUBLISHED_FIELD,
      { key: "date", label: "日付", type: "date", required: true },
      {
        key: "tag",
        label: "カテゴリ",
        type: "select",
        required: true,
        options: ["お知らせ", "イベント", "施工事例", "キャンペーン"],
      },
      {
        key: "title",
        label: "タイトル",
        type: "text",
        required: true,
        placeholder: "例）完成見学会を6月14日(土)に開催します",
      },
      { key: "image", label: "一覧に出る画像（サムネイル）", type: "image" },
      {
        key: "body",
        label: "本文",
        type: "paragraphs",
        help: "Enterを2回押す（1行あける）と段落が分かれます",
      },
    ],
    seed: () => NEWS.map((n) => ({ ...n, published: true })),
    newItem: () => ({
      published: true,
      date: today(),
      tag: "お知らせ",
      title: "",
      image: "",
      body: [],
    }),
    getTitle: (i) => str(i.title) || "（無題）",
    getSubtitle: (i) => `${str(i.date)}　${str(i.tag)}`,
    getThumb: (i) => str(i.image) || undefined,
  },
  {
    key: "events",
    label: "イベント",
    singular: "イベント",
    shared: false,
    fields: [
      PUBLISHED_FIELD,
      { key: "date", label: "開催日", type: "date", required: true },
      { key: "time", label: "開催時間", type: "text", placeholder: "例）10:00〜17:00" },
      {
        key: "title",
        label: "タイトル",
        type: "text",
        required: true,
        placeholder: "例）ご予算から考える家づくり無料相談会",
      },
      { key: "place", label: "会場", type: "text", placeholder: "例）〇〇店 モデルハウス" },
      { key: "address", label: "会場住所", type: "text", placeholder: "例）福島県郡山市〇〇1-2-3" },
      { key: "parking", label: "駐車場", type: "text", placeholder: "例）あり（10台）" },
      { key: "image", label: "画像", type: "image" },
      {
        key: "tags",
        label: "タグ",
        type: "chips",
        options: ["相談会", "見学会", "オープンハウス", "キャンペーン", "セミナー"],
      },
      {
        key: "content",
        label: "詳細ページの本文（見どころ）",
        type: "blocks",
        help: "見出し・文章・画像を積んで、記事のように組み立てられます",
      },
      {
        key: "benefit",
        label: "来場特典",
        type: "textarea",
        placeholder: "例）ご来場の方にQUOカード500円分プレゼント",
      },
    ],
    seed: (slug) =>
      (EVENTS_BY_TENANT[slug] ?? []).map((e) => ({ ...e, published: true })),
    newItem: () => ({
      published: true,
      date: today(),
      time: "",
      title: "",
      place: "",
      address: "",
      parking: "",
      image: "",
      tags: [],
      content: [],
      benefit: "",
    }),
    getTitle: (i) => str(i.title) || "（無題）",
    getSubtitle: (i) =>
      [str(i.date), arr(i.tags).join("・")].filter(Boolean).join("　"),
    getThumb: (i) => str(i.image) || undefined,
  },
  {
    key: "works",
    label: "施工事例",
    singular: "施工事例",
    shared: false,
    fields: [
      PUBLISHED_FIELD,
      {
        key: "title",
        label: "タイトル",
        type: "text",
        required: true,
        placeholder: "例）光あふれる平屋の家",
      },
      { key: "image", label: "メイン写真（一覧のサムネイル）", type: "image" },
      { key: "floorPlan", label: "間取り図", type: "image" },
      {
        key: "tags",
        label: "タグ",
        type: "chips",
        options: ["平屋", "2階建て", "ガレージハウス", "ナチュラル", "インダストリアル"],
      },
      { key: "area", label: "エリア・地域", type: "text", placeholder: "例）福島県郡山市" },
      { key: "floorArea", label: "延床面積", type: "text", placeholder: "例）32坪（105.98㎡）" },
      { key: "madori", label: "間取り", type: "text", placeholder: "例）3LDK" },
      {
        key: "priceRange",
        label: "価格帯",
        type: "select",
        options: [
          "〜1,000万円台",
          "1,500万円台",
          "2,000万円台",
          "2,500万円台",
          "3,000万円以上",
          "非公開",
        ],
      },
      {
        key: "content",
        label: "詳細ページの本文（こだわり・写真）",
        type: "blocks",
        help: "見出し・文章・写真を積んで、記事のように組み立てられます",
      },
      {
        key: "ownerVoice",
        label: "施主の声",
        type: "textarea",
        placeholder: "実際にお住まいの方の感想・コメント",
      },
      {
        key: "shared",
        label: "本部事例（全店に共有表示）",
        type: "toggle",
        help: "オンにすると、全店舗の施工事例ページにも表示されます",
      },
    ],
    seed: (slug) => worksForTenant(slug).map((w) => ({ ...w, published: true })),
    newItem: () => ({
      published: true,
      title: "",
      image: "",
      floorPlan: "",
      tags: [],
      area: "",
      floorArea: "",
      madori: "",
      priceRange: "",
      content: [],
      ownerVoice: "",
      shared: false,
    }),
    getTitle: (i) => str(i.title) || "（無題）",
    getSubtitle: (i) => arr(i.tags).join("・"),
    getThumb: (i) => str(i.image) || undefined,
  },
  {
    key: "products",
    label: "商品",
    singular: "商品",
    shared: true,
    fields: [
      PUBLISHED_FIELD,
      {
        key: "title",
        label: "商品名",
        type: "text",
        required: true,
        placeholder: "例）NONDESIGN GARAGE",
      },
      { key: "desc", label: "紹介文", type: "textarea" },
      { key: "houseImage", label: "外観画像", type: "image" },
      { key: "image", label: "背景・暮らしの画像", type: "image" },
      { key: "link", label: "詳細ページURL", type: "url", placeholder: "https://..." },
    ],
    seed: () => PRODUCTS.map((p) => ({ ...p, published: true })),
    newItem: () => ({
      published: true,
      title: "",
      desc: "",
      houseImage: "",
      image: "",
      link: "",
    }),
    getTitle: (i) => str(i.title) || "（無題）",
    getSubtitle: (i) => str(i.desc),
    getThumb: (i) => str(i.houseImage) || str(i.image) || undefined,
  },
  {
    key: "voices",
    label: "お客様の声",
    singular: "お客様の声",
    shared: true,
    fields: [
      PUBLISHED_FIELD,
      {
        key: "label",
        label: "お名前・地域・商品",
        type: "text",
        required: true,
        placeholder: "例）【福島県：山田様】NONDESIGN",
        help: "【地域：お名前様】商品名 の形式で入力してください",
      },
      { key: "text", label: "コメント", type: "textarea", required: true },
      { key: "image", label: "写真", type: "image" },
    ],
    seed: () => VOICES.map((v) => ({ ...v, published: true })),
    newItem: () => ({ published: true, label: "", text: "", image: "" }),
    getTitle: (i) => str(i.label) || "（無題）",
    getSubtitle: (i) => str(i.text),
    getThumb: (i) => str(i.image) || undefined,
  },
  {
    // edited inside the「私たちについて」section, not its own nav item
    key: "strengths",
    label: "強み",
    singular: "強み",
    shared: false,
    hidden: true,
    fields: [
      {
        key: "title",
        label: "タイトル",
        type: "text",
        required: true,
        placeholder: "例）好きを見抜くヒアリング力",
      },
      { key: "text", label: "説明", type: "textarea", required: true },
      { key: "image", label: "画像", type: "image" },
    ],
    seed: () => STRENGTHS.map((s) => ({ title: s.title, text: s.text, image: s.image })),
    newItem: () => ({ title: "", text: "", image: "" }),
    getTitle: (i) => str(i.title) || "（無題）",
    getSubtitle: (i) => str(i.text),
    getThumb: (i) => str(i.image) || undefined,
  },
];

// 「私たちについて」（トップの紹介ブロック＋下層ページ）の単一レコード設定
export const ABOUT_FIELDS: Field[] = [
  {
    key: "teaserHeadline",
    label: "トップの見出し",
    type: "textarea",
    help: "トップページ「私たちについて」の大見出し",
  },
  { key: "teaserBody", label: "トップの紹介文", type: "paragraphs" },
  { key: "teaserImage", label: "トップの画像（家）", type: "image" },
  { key: "teamImage", label: "スタッフ写真（下層ページ上部）", type: "image" },
  {
    key: "conceptHeading",
    label: "コンセプト見出し",
    type: "paragraphs",
    help: "1行あけると改行されます",
  },
  { key: "conceptBody", label: "コンセプト本文", type: "paragraphs" },
];

// 会社概要（店舗情報セクションにまとめて表示する）
export const TENANT_PROFILE_FIELDS: Field[] = [
  { key: "representative", label: "代表者", type: "text" },
  { key: "business", label: "事業内容", type: "text" },
  { key: "founded", label: "創業", type: "text" },
  { key: "capital", label: "資本金", type: "text" },
  { key: "employees", label: "従業員数", type: "text" },
  { key: "license", label: "建設業許可番号", type: "text" },
];

// Default company-profile values (demo) merged into the tenant record.
export function tenantSeed(slug: string): Record<string, unknown> {
  return {
    ...getTenant(slug),
    representative: "代表 太郎（デモ）",
    business: "注文住宅の設計・施工、リフォーム、不動産",
    founded: "2005年4月（デモ）",
    capital: "2,000万円（デモ）",
    employees: "34名（デモ）",
    license: "国土交通大臣許可（般-X）第00000号（デモ）",
  };
}

export function aboutSeed(slug: string): Record<string, unknown> {
  const name = getTenant(slug)?.shortName ?? "当社";
  return {
    teaserHeadline: "あなたの「好き」から、家づくりを。",
    teaserBody: [
      `${name}は、決めすぎないデザインで、あなたらしい住まいを一緒に考えるパートナーです。`,
      "暮らす人の「好き」や価値観をていねいに伺い、世界にひとつの住まいへと、かたちにしていきます。",
    ],
    teaserImage: "/about-house.png",
    teamImage: ABOUT_TEAM_IMAGE,
    conceptHeading: [...ABOUT_CONCEPT.heading],
    conceptBody: [...ABOUT_CONCEPT.body],
  };
}

// 店舗情報（1店舗 = 1レコードの設定フォーム。social.* はドット記法で扱う）
export const TENANT_FIELDS: Field[] = [
  { key: "name", label: "正式店舗名", type: "text", required: true },
  { key: "shortName", label: "表示名（短縮）", type: "text", required: true },
  { key: "postalCode", label: "郵便番号", type: "text", placeholder: "000-0000" },
  { key: "prefecture", label: "都道府県", type: "text" },
  { key: "city", label: "市区町村", type: "text" },
  { key: "street", label: "番地・建物", type: "text" },
  { key: "tel", label: "電話番号", type: "text", required: true },
  { key: "fax", label: "FAX番号", type: "text" },
  { key: "description", label: "紹介文", type: "textarea" },
  { key: "social.instagram", label: "Instagram URL", type: "url", placeholder: "https://..." },
  { key: "social.facebook", label: "Facebook URL", type: "url", placeholder: "https://..." },
  { key: "social.youtube", label: "YouTube URL", type: "url", placeholder: "https://..." },
  { key: "social.tiktok", label: "TikTok URL", type: "url", placeholder: "https://..." },
  { key: "social.twitter", label: "X (Twitter) URL", type: "url", placeholder: "https://..." },
];

export function resourceByKey(key: string): ResourceConfig | undefined {
  return RESOURCES.find((r) => r.key === key);
}
