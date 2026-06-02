# WordPress移行 Step0 ― 既存構造の確定と対応表

`07_WordPress移行詳細設計.md` の最初の実務工程「**Step0：構造確定**」の成果物。
既存2サイトの WordPress 構造を **公開REST API（`/wp-json`）から読み取って確定**し、以降の Extract→Transform→Load の前提となる対応表をまとめる。

- 取得日：2026-06-02
- 取得方法：公開REST（`/wp-json/wp/v2/types`・`/taxonomies`・各コレクション）、件数は `X-WP-Total` ヘッダー
- 対象：本部 `unstandard.jp` ／ 加盟店 `unstandard-members.com`
- 注意：公開RESTで取れるのは **公開（published）分** と **REST露出フィールドのみ**。価格などのACFや下書きは **WXRエクスポートで確定**（§8）。

---

## 0. サマリー（Step0で確定した重要事実）

1. **両サイトとも単一WordPress**（WP Multisite ではない）。店舗別パス `members.com/<slug>/` は単一サイト内のテーマ描画ページで、独立サブサイトではない（`/kaitaku/wp-json` は404）。
2. **商品（`lineup`）は加盟店サイト側**にある（本部サイトではない）。
3. **加盟店マスターは本部サイトの `stores` CPT（全66店）**。7エリアに区分。うち **18店が `members.com/<slug>/` の店舗ページを保有**、48店は未保有（外部サイト運用 or 未整備）。
4. **「本部事例」は `tag_works_headquarters` タクソノミー**（施工事例18件中15件が本部事例＝共有）。
5. 価格・本文・日時などの詳細フィールド（ACF）は **`lineup`/`event`/`voice`/`works` で公開REST非露出** → WXR必須。

---

## 1. サイト構成

| 項目 | unstandard.jp（本部） | unstandard-members.com（加盟店） |
|---|---|---|
| WP構成 | 単一WordPress | 単一WordPress（本体は `/wp-members` に設置） |
| マルチサイト | なし | なし |
| 店舗別ページ | `stores` CPT（ディレクトリ的一覧） | `/<store-slug>/`（テーマ描画ページ・18店） |
| 役割 | ブランド・メディア・加盟店一覧 | 商品・施工事例・イベント・お客様の声 |

> テナント割り当ては「URLパス＝サブサイト」ではなく、コンテンツ側の **ACF/タクソノミーでの紐付け** で行われている。その紐付けフィールドは公開REST非露出のため、確定にはWXRが必要（§8）。

---

## 2. 構造インベントリ（投稿タイプ・件数・タクソノミー・ACF）

### 2.1 unstandard.jp（本部）
| WP種別(slug) | 名称 | 公開件数 | 移行先（新基盤） |
|---|---|---:|---|
| `page` | 固定ページ | 35 | `pages`（本部） |
| `post` | 投稿 | 0 | （未使用） |
| `news` | NEWS | 11 | `posts`(news)（本部共有） |
| `media` | MEDIA記事 | 要確認※ | `posts`(media)（本部共有メディア） |
| `stores` | 全国の加盟店・相談窓口 | 66 | `tenants` マスター |
| `contact_prefectures` | お問い合わせ用都道府県 | 47 | フォーム用マスタ（select） |
| `attachment` | メディア（画像） | 2688 | `media`（S3/R2へ再ホスト） |

※ `media`(MEDIA記事) CPT は `rest_base=media` で attachment とREST衝突。公開RESTで件数を正確取得できず（2688はattachment数）。**WXRで確定**。

- **タクソノミー**：`category`／`post_tag`（post用）、`stores_area`（加盟店エリア・7区分）
- **stores_area 内訳**：北海道東北 4／北陸信越 4／関東 11／東海 12／関西 9／四国中国 12／九州沖縄 14（計66）
- **ACF（公開REST露出分）**：
  - `stores` → `unst_store_text`, `unst_store_url`（店舗ページ/外部サイトへのリンク）
  - `news` → `dsp_title, img_main, description, img_information(_sp), information(_link), add_information, article_box, staff_name, staff_link, img_information_foot(_sp/_link), display_none`

### 2.2 unstandard-members.com（加盟店）
| WP種別(slug) | 名称 | 公開件数 | 移行先 |
|---|---|---:|---|
| `lineup` | LINEUP（商品） | 19 | `products`（本部共有） |
| `event` | イベント情報 | 65 | `posts`(events) or 予約モジュール |
| `works` | 施工事例 | 18 | `posts`(works) |
| `voice` | お客様の声 | 5 | `posts`(works)のフィールド or `testimonials` |
| `slider` | トップスライダー | 29 | サイト設定 / Heroブロック |
| `page` | 固定ページ | 7 | `pages` |
| `post` | 投稿 | 1 | （ほぼ未使用） |

- **タクソノミー（実値）**：
  - `tag_works`（施工事例タグ）：NONDESIGN SERIES(6)／WOODBOX SERIES(9)／COLLABORATION(3)／二階建て(13)／平屋(5)／狭小エリア向き(1)／モデルハウス(0)
  - `tag_works_headquarters`（本部専用）：**本部事例(15)** ← 「本部事例」フラグの正体
  - `tag_event`（イベントタグ）：全国共通(7)／常駐見学会(4)／完成見学会(4)／モデルハウス見学会(3)／相談会(38)／セミナー(6)／キャンペーン(15)／資料請求(1)
- **ACF**：`lineup`/`event`/`voice`/`works` はいずれも公開REST非露出 → フィールド名・値はWXRで確定（§8）。
- **URL構造（実物）**：`/works/<id>/`・`/lineup/<id>/`・`/event/<id>/`・`/voice/<id>/`（すべて数値ID）。店舗ページは `/<store-slug>/`。

---

## 3. テナント対応表（全66店）

> **【スコープ確定 2026-06-02】新システムへ移行するのは、本部 `stores` 一覧で「UNSTANDARD専用サイト」リンクを持つ18店のみ**（＝下表で「members.comページ」がある店）。残り48店は外部サイト運用/未整備で移行対象外。確定18店リストは `07c §9`。

`unstandard.jp` の `stores` CPT 全66件を、新基盤の `tenants` へ写像する対応表。
- **members.comページ**：そのslugで `members.com/<slug>/` の店舗ページが実在（18店）。「—」は未保有。
- **新tenant-slug案**：members.comのslugがあればそれを採用。無い店は仮のローマ字案 `(案)`。最終slugは要確認（§8）。

> 現 `stores` 詳細URLは `unstandard.jp/stores/<日本語slug>/`（URLエンコード）。リダイレクトは安定したWP store-idを鍵にWXRから生成する（§6）。

### 北海道東北（4）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| Woodhouse株式会社 | 3415 | — | woodhouse (案) |
| ハウジング福島センター | 3412 | housingfukushimacenter | housingfukushimacenter |
| 株式会社Us Style | 3416 | — | us-style (案) |
| 株式会社丸高 | 2379 | — | marutaka (案) |

### 北陸信越（4）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| フラッシュ株式会社 | 5167 | flash | flash |
| 有限会社アーバンクラフト | 5800 | — | urban-craft (案) |
| 株式会社平岡建設 | 4645 | hiraokakensetu | hiraokakensetu |
| 辻家株式会社 | 5146 | tsujiya_archt | tsujiya-archt |

### 関東（11）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| On Fleek Home | 4993 | onfleekhome | onfleekhome |
| WOODBOX海老名 株式会社 建築のひら木 | 418 | hilaki | hilaki |
| WOODBOX茨城中央 家づくりナイスホームズ株式会社 | 389 | — | nice-homes (案) |
| スマトチ スヴァーリエヒュース株式会社 | 420 | woodbox-yamanashi | woodbox-yamanashi |
| 株式会社アートクラフト | 5829 | — | art-craft (案) |
| 株式会社ウッドプラン ENJOY HOUSE | 4754 | woodplan | woodplan |
| 株式会社ネクスト | 4770 | — | next (案) |
| 株式会社不動産動画制作 | 454 | — | fudosan-douga (案) |
| 株式会社建青社 | 5804 | — | kenseisha (案) |
| 株式会社板倉商事 | 4639 | itakura | itakura |
| 株式会社空創工房 | 4374 | kuusou-koubou | kuusou-koubou |

### 東海（12）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| MUK HOUSE 無垢ハウス 株式会社伊藤建設 | 514 | — | muk-house (案) |
| WOODBOX住宅事業部 株式会社前島製材所 | 463 | — | maejima (案) |
| しあわせハートフルホーム 青山製材所 | 4835 | — | aoyama (案) |
| オールグリーンハウス 株式会社グランドワークス | 516 | — | grandworks (案) |
| 大宝工業株式会社 | 521 | — | slove-mouth (案) |
| 愛岐木材住建株式会社 | 3414 | — | aigi (案) |
| 株式会社HARMONY | 517 | harmony | harmony |
| 株式会社LIFEQUARTET | 5486 | — | lifequartet (案) |
| 株式会社TRUNK HOME | 4450 | — | trunk-home (案) |
| 株式会社パートナーズホーム | 506 | — | partners-home (案) |
| 株式会社名和建築 | 2257 | nawa-kenchiku | nawa-kenchiku |
| 株式会社幸栄住建 | 5290 | — | koei (案) |

### 関西（9）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| WOODBOX OSAKA（株式会社市兵衛） | 366 | woodbox-osaka | woodbox-osaka |
| まるお不動産株式会社 | 370 | — | maruo (案) |
| アトリエSumika-住処- 株式会社創美建築企画 | 1894 | soubi-kenchiku-kikaku | soubi-kenchiku-kikaku |
| 株式会社イースマイル | 4372 | — | e-smile (案) |
| 株式会社エム・ジェイホーム | 351 | — | mj-home (案) |
| 株式会社パームスプランニング（西和工務店） | 3884 | — | palms (案) |
| 株式会社マエダホーム | 364 | — | maeda-home (案) |
| 株式会社匠工房 | 5292 | — | takumi-koubou (案) |
| 株式会社龍野実業建築家 | 5802 | — | tatsuno (案) |

### 四国中国（12）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| REST HOME 株式会社RASTA | 387 | — | rasta (案) |
| WOODBOX愛媛松山 アースハウジング株式会社 | 384 | — | earth-housing (案) |
| WOODBOX高知 株式会社KO-HOusE（和幸ハートホームズ） | 394 | — | ko-house (案) |
| plus sumika株式会社 | 4365 | — | plus-sumika (案) |
| アイラックホーム株式会社 | 382 | — | ilac-home (案) |
| カインドワーク株式会社 | 5325 | kindwork | kindwork |
| ジョイホーム株式会社 | 4815 | — | joy-home (案) |
| 有限会社開拓 | 5611 | kaitaku | kaitaku |
| 株式会社カサセイホームズ | 5168 | — | kasasei (案) |
| 株式会社ジール | 4177 | — | zeal (案) |
| 株式会社デザインライフ | 2591 | — | design-life (案) |
| 株式会社マエダハウジング | 2923 | — | maeda-housing (案) |

### 九州沖縄（14）
| 加盟店名 | WP id | members.comページ | 新tenant-slug案 |
|---|---|---|---|
| WOODBOX福岡西店 でんホーム株式会社 | 406 | — | den-home (案) |
| アール・エコ株式会社 | 5147 | — | r-eco (案) |
| 大分不動産情報サービス株式会社 | 422 | — | oita-fudosan (案) |
| 有限会社イメージデザイン社 | 2927 | — | image-design (案) |
| 有限会社田建築工房 | 434 | den-kenchiku | den-kenchiku |
| 株式会社ARCATH HOME | 4646 | arcathhome | arcathhome |
| 株式会社HARE | 4792 | — | hare (案) |
| 株式会社NO-SCALE | 3413 | — | no-scale (案) |
| 株式会社イトウ | 5825 | — | ito (案) |
| 株式会社ウィズカーペンター | 411 | — | with-carpenter (案) |
| 株式会社オーエス企画 | 4990 | — | os-kikaku (案) |
| 株式会社トーワ | 4833 | — | towa (案) |
| 株式会社辻組工務店 | 5612 | — | tsujigumi (案) |
| 株式会社駅前工務店 | 4991 | — | ekimae (案) |

> **slug方針**：members.comページを持つ18店は既存のclean slugをそのまま `tenants.slug` に採用。残り48店の `(案)` は仮で、最終決定は加盟店・本部の確認が必要。予約語（`admin` `api` `_next` `signup` 等）と重複しないこと（02設計図 §3）。

---

## 4. 投稿タイプ → 新コレクション 対応表（実構造で確定）

| 旧（WP・実在） | サイト | 新コレクション | テナント区分 | 主なフィールド対応 |
|---|---|---|---|---|
| `media`(MEDIA記事) | 本部 | `posts`(media) | 本部共有(shared) | title, slug, content→richText(lexical), eyecatch→coverImage, category |
| `news` | 本部 | `posts`(news) | 本部共有(shared) | title, ACF(dsp_title/img_main/description 等)→各フィールド |
| `page` | 本部 | `pages` | 本部 | title, slug, 本文→ブロック |
| `stores` | 本部 | `tenants` | — | name, area(stores_area)→region, unst_store_url, unst_store_text |
| `contact_prefectures` | 本部 | フォーム用select | 本部共通 | 都道府県マスタ |
| `lineup` | 加盟店 | `products` | 本部共有(shared) | name, series(tag), 説明→richText, 価格→ACF(WXR要), 画像→media |
| `works` | 加盟店 | `posts`(works) | 本部事例=shared / その他=テナント | title, series/構造→tag, 本部事例→`tag_works_headquarters`, ギャラリー→media(ACF要) |
| `voice` | 加盟店 | `testimonials` or works内 | テナント or 共有 | 顧客名・商品名・本文→ACF(WXR要) |
| `event` | 加盟店 | `posts`(events) or 予約 | テナント or 共有 | 開催日時・場所・種別(tag_event)→ACF(WXR要) |
| `slider` | 加盟店 | サイト設定/Hero | 本部 or テナント | 画像・リンク→ACF(WXR要) |
| `attachment` | 両 | `media` | スコープ別 | ファイル→S3/R2再アップ, alt, 本文内URL書換 |

---

## 5. タクソノミー → タグ/選択肢 対応表（実値で確定）

| 旧タクソノミー | サイト | 用語（件数） | 新基盤での扱い |
|---|---|---|---|
| `tag_works`（シリーズ） | 加盟店 | NONDESIGN SERIES(6)/WOODBOX SERIES(9)/COLLABORATION(3) | `products.series`＋`works.series`（select） |
| `tag_works`（構造） | 加盟店 | 二階建て(13)/平屋(5)/狭小エリア向き(1)/モデルハウス(0) | `works.tags`（multi select） |
| `tag_works_headquarters` | 加盟店 | 本部事例(15) | `works.shared = true`（本部共有フラグ） |
| `tag_event` | 加盟店 | 全国共通/常駐見学会/完成見学会/モデルハウス見学会/相談会(38)/セミナー/キャンペーン/資料請求 | `events.type`（select）。「全国共通」→shared判定の手掛り |
| `stores_area` | 本部 | 7エリア（§2.1） | `tenants.region`（select） |
| `category`/`post_tag` | 本部 | （post未使用） | media記事のカテゴリは§8で確認 |

> 表記ゆれ正規化辞書はWXR取得後に確定（例：「SERIES」表記の有無、構造タグの粒度）。

---

## 6. リダイレクト方針（実URLに基づく）

旧URLはすべて **数値IDベース**。原則 **301**。id→新slug の対応表をWXRから生成して個別発行する。

| 旧URL（実パターン） | サイト | 新URL（案） | 備考 |
|---|---|---|---|
| `/`（トップ） | 本部 | `/` | |
| `/media/<id>/` | 本部 | `/media/<slug>` | id→slug対応表が必要 |
| `/news/<jp-slug>/` | 本部 | `/news/<slug>` | 現slugは日本語。要正規化 |
| `/stores/<jp-slug>/` | 本部 | `/stores/<tenant>` or `/<tenant>` | store-id→tenant対応（§3） |
| `/works/<id>/` | 加盟店 | `/<tenant>/works/<slug>` or `/works/<slug>` | 本部事例は共有先 |
| `/lineup/<id>/` | 加盟店 | `/products/<slug>` | |
| `/event/<id>/` | 加盟店 | `/events/<slug>` or `/<tenant>/events/<slug>` | |
| `/voice/<id>/` | 加盟店 | works/testimonials へ統合 | 紐付け先はWXRで確定 |
| `/<store-slug>/`（店舗ページ・18店） | 加盟店 | `/<tenant>` | §3のslug採用 |

---

## 7. 07設計書（推定）との相違点

| # | 07の推定 | Step0で判明した実際 |
|---|---|---|
| 1 | `lineup`（商品）は `unstandard.jp` 側 | **members.com 側**（19件） |
| 2 | members.com は各加盟店のサブサイト（`/<store>/works/`） | **単一WP・フラット**（`/works/<id>/`）。サブサイトではない |
| 3 | 店舗スラッグ＝URLパス | 店舗マスタは本部の `stores` CPT（66件）。現slugは日本語URLエンコード |
| 4 | 「本部事例」フラグ | `tag_works_headquarters/headquarters` タクソノミー（15/18件が本部事例） |
| 5 | 商品価格等のACF | `lineup`/`event`/`voice`/`works` のACFは公開REST非露出 → WXR必須 |
| 6 | 加盟店ごとの事例が多数 | members.com works は計18件・うち15件が本部事例。各店独自事例は外部サイト(`unst_store_url`)で別管理の可能性 |

---

## 8. WXRで確定する残課題 ＋ エクスポート手順

> **【更新 2026-06-02・フェーズB】加盟店サイトの WXR を解析済み → `07c_フェーズB_加盟店WXR解析_ACF確定.md`。**
> 加盟店側のACFフィールド名・型・店舗紐付け（`display_user`／店舗＝WPユーザー）・本部事例フラグ（`tag_works_headquarters`）は**確定**。商品(lineup)に価格フィールドは**無い**ことも判明。
> 一方、`lineup`/`event`/`works`/`voice`/`slider` の**本体レコードは「すべてのコンテンツ」エクスポートに含まれない**（テーマCPTが `can_export=false` 想定）。データ移行には別方式での再取得が必要（07c §7）。
> **本部サイト（unstandard.jp）の WXR は未受領** → 下記の本部側残課題（`news`/`media`/`stores`/`contact_prefectures`）は未確定のまま。

公開RESTでは取れない以下を、WordPressエクスポート（WXR）で確定する。

**残課題：**
- `lineup`/`event`/`voice`/`works`/`news` のACFフィールド名と値（商品価格、お客様の声本文、イベント開催日時・場所、施工事例ギャラリー等）。
- `media`(MEDIA記事) CPT の正確な件数（attachmentとREST衝突のため）。
- 各 `works`/`event`/`voice` がどの加盟店に属するかの **紐付けフィールド**（テナント割り当ての鍵）。
- 「本部事例(headquarters)」の個別id一覧（term count=15は判明済み、個別特定が必要）。
- 下書き/非公開を含む全件数。
- `media`記事の `category`（メディアカテゴリ：ART&MUSIC 等）の実際の用語。

**エクスポート手順（スタッフ向け）：**
両サイトの管理画面で **「ツール」→「エクスポート」→「すべてのコンテンツ」→ エクスポートファイルをダウンロード**。
得られたXMLを `project_plan/_source/` に置く（`.gitignore` 済み・コミットされない）：
- `unstandard-jp.xml`
- `unstandard-members.xml`

（任意・より正確：ACFの設定画面 →「ツール」→ フィールドグループを **JSONエクスポート** できれば、フィールド定義を直接取得できる。）

> WXR受領後、Claudeが解析して本書 §2〜§6 とリダイレクト対応表を確定値で更新する（フェーズB）。

---

## 付録：検証
- 件数は `X-WP-Total`（公開・published分）由来。WXR取得後に下書き含む総数と突合する。
- テナント表：66件＝`stores` 総数。エリア内訳合計（4+4+11+12+9+12+14）＝66で一致。
- 相違点1〜6・タクソノミー実値・件数は、実エンドポイントのレスポンスで裏取り済み。
