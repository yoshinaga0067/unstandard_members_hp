// Shared domain types for the UNSTANDARD platform.

export type AreaKey =
  | "hokkaido-tohoku"
  | "hokuriku-shinetsu"
  | "kanto"
  | "tokai"
  | "kansai"
  | "shikoku-chugoku"
  | "kyushu-okinawa";

export interface Area {
  key: AreaKey;
  /** 表示用エリア名（日本語） */
  name: string;
  /** アクセントカラー（レインボーパレット） */
  color: string;
}

/** 加盟店のSNSリンク（設定がある店のみ）。 */
export interface TenantSocial {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
}

/** 加盟店（テナント）。移行対象は「UNSTANDARD専用サイト」を持つ18店。 */
export interface Tenant {
  /** テナントslug（= 旧 members.com のパス） */
  slug: string;
  /** 正式名称 */
  name: string;
  /** 一覧などで使う短縮表示名 */
  shortName: string;
  /** 所属エリア */
  area: AreaKey;
  /** 都道府県 */
  prefecture: string;
  /** 市区町村（以降） */
  city: string;
  /** 番地・建物 */
  street: string;
  /** 郵便番号（XXX-XXXX） */
  postalCode: string;
  /** 電話番号 */
  tel: string;
  /** FAX番号（ある店のみ） */
  fax?: string;
  /** SNSリンク（ある店のみ） */
  social?: TenantSocial;
  /** 紹介文 */
  description: string;
  /** 既存の専用サイトURL（移行前の参考リンク） */
  legacyUrl: string;
}

/** 商品ラインナップ（LINE UP）。本部が配信する共有商品。 */
export interface Product {
  title: string;
  /** 紹介テキスト */
  desc: string;
  /** 背景イメージ */
  image: string;
  /** 外観（家）画像 */
  houseImage: string;
  /** 本部の商品ページへのリンク */
  link: string;
}

/** お客様の声（VOICE）。 */
export interface Voice {
  image: string;
  /** 【地域：お名前様】商品名 */
  label: string;
  text: string;
}

/** お知らせ（NEWS）。ヒーロー直下に小さく表示する更新情報。 */
export interface NewsItem {
  /** 詳細ページのURLに使う識別子（例：open-house-0614） */
  slug: string;
  /** 表示用の日付（例：2026.05.28） */
  date: string;
  /** 種別タグ（お知らせ・イベント・施工事例 等） */
  tag: string;
  /** 見出し */
  title: string;
  /** 先頭に表示する正方形サムネイル画像（任意） */
  image?: string;
  /** 詳細ページの本文（段落の配列・任意） */
  body?: string[];
  /** 外部リンク先（指定すると詳細ページではなくここへ遷移・任意） */
  href?: string;
}

/** イベント（EVENT）。 */
export interface EventItem {
  id: number;
  title: string;
  image: string;
  /** 種別タグ（相談会・キャンペーン 等） */
  tags: string[];
}

/** メディア記事（MEDIA）。本部 unstandard.jp の共有メディア。 */
export interface MediaItem {
  url: string;
  image: string;
  date: string;
  title: string;
}

/** 施工事例（WORKS）。本部事例は全加盟店で共有表示される。 */
export interface Work {
  /** 旧サイトの投稿ID */
  id: number;
  /** 事例タイトル */
  title: string;
  /** サムネイル画像URL（移行前：members.com ホスト） */
  image: string;
  /** シリーズ・構造などのタグ（「本部事例」フラグは shared に分離） */
  tags: string[];
  /** 本部事例（全店共有）かどうか */
  shared: boolean;
}
