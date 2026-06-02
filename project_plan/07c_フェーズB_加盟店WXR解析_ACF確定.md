# WordPress移行 フェーズB ― 加盟店サイト WXR 解析（ACF・テナント紐付け確定）

`07b_Step0_構造確定_対応表.md` の §8「WXRで確定する残課題」のうち、**加盟店サイト（unstandard-members.com）** 分を、提供された WXR で確定した成果物。

- 解析対象：`project_plan/_source/unstandard-members.xml`（WordPress 7.0 が 2026-06-02 05:19 に生成）
- 解析方法：WXR を直接パースし、ACFフィールド定義（`acf-field-group` / `acf-field`）・投稿タイプ別件数・ユーザー（投稿者）・固定ページ・問い合わせフォーム・添付を集計
- 対象範囲：**加盟店サイトのみ**。本部サイト（unstandard.jp）の WXR（`unstandard-jp.xml`）は未受領のため §8 の本部側残課題（`news`/`media`/`stores`/`contact_prefectures` 等）は未確定のまま。

---

## 0. サマリー（フェーズBで確定した重要事実）

1. **【最重要・要対応】商品・施工事例・イベント・お客様の声・スライダーの「本体データ」が、このエクスポートに含まれていない。** 「すべてのコンテンツ」エクスポートに `lineup`/`event`/`works`/`voice`/`slider` の投稿が **0件**。テーマ登録のCPTが `can_export=false` で出力対象外になっているのが原因とほぼ断定（§1）。**データ移行には別方式での再取得が必要**（§7）。
2. **ただし ACF の「設計図」は完全取得できた。** フィールドグループ12・フィールド68を取得し、各CPT/ユーザーの **フィールド名・型・選択肢・付与先・店舗紐付け** をすべて確定（§3）。→ 新基盤のデータモデルは、このスキーマで**今すぐ設計・構築に着手できる**。
3. **テナント（加盟店）紐付けの正体が確定。** コンテンツは **WordPressの「ユーザー」＝店舗** に紐付く。鍵は ACFユーザーフィールド群＋投稿の `display_user`（type=user・複数可・空欄＝全店表示＝本部共有）（§4）。
4. **店舗＝ユーザーは実在を確認（14アカウント）。** admin・ダミー1件・実店舗12件。`07b §3` の「members.comページ保有18店」と突き合わせると整合・差分が判明（§5）。
5. **LINEUP（商品）に「価格」フィールドは存在しない。** 07b の推定「価格→ACF」は誤り。商品ACFは画像・外観画像・紹介テキスト・外部リンクのみ（§3.4）。価格は新基盤の `05_価格管理モジュール` で**新規に設計**する領域。
6. **無効化済みだが「MEDIA記事」リッチ記事レイアウト（repeater）の定義を取得。** 本部 `news` のACF（07b §2.1）と同一構造で、記事ビルダー（中見出し/小見出し/テキスト/画像）の仕様が判明（§3.7）。
7. **【スコープ確定】新システムへの移行対象は「UNSTANDARD専用サイト」を持つ18店のみ。** `https://unstandard.jp/stores/`（2026-06-02取得）で「UNSTANDARD専用サイト」リンク（`unstandard-members.com/<slug>/`）を持つ加盟店がちょうど18店。残り48店は外部サイト運用/未整備で**移行対象外**（本部ディレクトリ掲載のまま）（§9）。

---

## 1. このエクスポートに実際に含まれていたもの（件数確定）

| 投稿タイプ | 件数 | 内訳 | 備考 |
|---|---:|---|---|
| `attachment` | 639 | inherit:639 | 画像。全て `unstandard-members.com` ホスト（jpg515/png88/webp27/jpeg9）→ S3/R2再ホスト対象 |
| `acf-field` | 68 | publish:68 | ACFフィールド定義（§3で全件展開） |
| `acf-field-group` | 12 | publish:11, disabled:1 | ACFフィールドグループ |
| `page` | 8 | publish:7, draft:1 | フォーム系・システムページ（§6） |
| `wpcf7_contact_form` | 5 | publish:5 | 問い合わせフォーム（§6） |
| `post` | 1 | publish:1 | 「Hello world」相当・未使用 |
| `wp_navigation` | 1 | publish:1 | ブロックテーマのメニュー |
| `wp_global_styles` | 1 | publish:1 | テーマ`member-store`のグローバルスタイル |
| **`lineup`/`event`/`works`/`voice`/`slider`** | **0** | — | **含まれず（§7で再取得）** |
| `news`/`media`/`stores` | 0 | — | 本部サイト側のため当然含まれず（別エクスポート） |

> 投稿者（WPユーザー）は WXR 上に14件（§5）。WXRの著者リストは「出力された投稿の著者」のみを含むため、CPTが出力されなかった本エクスポートでは**店舗ユーザーの完全な名簿にはならない**点に注意。

---

## 2. 確定したテナント・データモデル（全体像）

```
WordPressユーザー  = 店舗（テナント）          ← ACFユーザーフィールドに住所/電話/SNS/ロゴ/SEO地域
   ▲
   │ 紐付け
   │  (1) 投稿の「投稿者」が店舗ユーザー        … 一次的な所有者
   │  (2) もしくは ACF `display_user` で管理者が指定（複数可）
   │      空欄 = 全店表示 = 本部共有(shared)
   │
コンテンツ投稿（lineup / event / works / voice / slider）
```

- **新基盤 `tenants` の源泉は2系統**：本部 `stores` CPT（66件・ディレクトリ）と、加盟店 `WPユーザー`（コンテンツ所有者）。**この2つを突き合わせて1つの `tenants` に統合する**のが移行の要（§5）。
- **本部共有(shared)の判定**：`display_user` 空欄 ＝ 全店表示。works はさらに `tag_works_headquarters`（本部事例）で共有フラグ。

---

## 3. 確定 ACFスキーマ（フィールド名・型・付与先）

> 表記：`機械名` [型] ラベル。機械名はそのまま postmeta のキー（移行時のマッピング元）。

### 3.1 ユーザー（＝店舗プロフィール）  付与先：`user_form`（全ユーザー）
| 機械名 | 型 | ラベル | 新基盤 `tenants` フィールド案 |
|---|---|---|---|
| `area` | text | 地域（SEO対策用） | `seoArea` |
| `tel` | text | 電話番号 | `tel` |
| `fax` | text | FAX番号 | `fax` |
| `address` | text | 住所（表示用） | `addressText` |
| `postalCode` | text | 郵便番号（構造化用） | `postalCode` |
| `addressRegion` | text | 都道府県（構造化用） | `region`（schema.org対応） |
| `addressLocality` | text | 市区町村（構造化用） | `locality` |
| `streetAddress` | text | 丁目番号・建物（構造化用） | `street` |
| `add_email` | text | 送信先追加アドレス | `notifyEmails` |
| `youtube`/`facebook`/`instagram`/`twitter`/`pinterest`/`line`/`tiktok` | text×7 | 各SNS | `social.*` |
| `no_link` | true_false | 本部へのリンクなし | `hideHqLink` |
| `company_logo` | image | 会社ロゴ | `logo`（media） |

### 3.2 event（イベント）  付与先：`post_type==event`
| 機械名 | 型 | ラベル |
|---|---|---|
| `tag_event` | taxonomy | タグ（tax=`tag_event`） |
| `img_main` | image | メイン画像 |
| `close_date` | date_picker | 終了日付 |
| `event_date` | text | 開催日 |
| `event_time` | text | 開催時間 |
| `event_place` | text | 開催場所 |
| `capacity` | text | 定員 |
| `deadline` | text | 募集締切 |
| `remarks` | textarea | 備考 |
| `latitude` / `longitude` | text | 緯度 / 経度（地図） |
| `request_form` | true_false | 資料請求フォームへ遷移 |
| `dsp_new` | radio | NEW表示（14:14日間 / 99:常時 / 0:非表示） |
| `pickup` | true_false | PICKUP（管理者・編集者のみ） |
| `display_user` | user(複数) | 表示店舗の指定（テナント紐付け） |

### 3.3 works（施工事例）  付与先：`post_type==works`
| 機械名 | 型 | ラベル |
|---|---|---|
| `tag_works` | taxonomy | タグ（tax=`tag_works`／シリーズ・構造） |
| `place` | text | 所在地 |
| `description` | textarea | 紹介テキスト |
| `pickup` | true_false | PICKUP表示 |
| `tag_works_headquarters` | taxonomy | 本部設定タグ（tax=`tag_works_headquarters`＝**本部事例フラグ**・管理者編集者のみ） |
| `dsp_new` | radio | NEW表示（共通定義） |
| `display_user` | user(複数) | 表示店舗の指定（テナント紐付け） |

### 3.4 lineup（商品）  付与先：`post_type==lineup`
| 機械名 | 型 | ラベル |
|---|---|---|
| `img_main` | image | 画像 |
| `img_exterior` | image | 外観画像 |
| `description` | textarea | 紹介テキスト |
| `link` | text | 外部リンク |
| `display_user` | user(複数) | 表示店舗の指定 |

> **価格フィールドは無し。** 商品＝本部共有の基本情報のみ。加盟店別価格は新基盤で新設（`05_価格管理モジュール`）。

### 3.5 voice（お客様の声）  付与先：`post_type==voice`
| 機械名 | 型 | ラベル |
|---|---|---|
| `img_main` | image | 画像 |
| `description` | textarea | 紹介文 |
| `display_user` | user(複数) | 表示店舗の指定 |

> 顧客名・商品名の専用フィールドは無く、本文（紹介文）＋画像のみのシンプル構成。

### 3.6 slider（トップスライダー）  付与先：`post_type==slider`
| 機械名 | 型 | ラベル |
|---|---|---|
| `img_main` | image | 画像（PC） |
| `img_main_sp` | image | 画像（SP） |
| `display_user` | user(複数) | 表示店舗の指定 |

### 3.7 MEDIA記事（リッチ記事レイアウト）  付与先：`post_type==works OR event`【現在 無効化(acf-disabled)】
| 機械名 | 型 | ラベル |
|---|---|---|
| `dsp_title` | textarea | 記事タイトル |
| `img_main` | image | メイン画像 |
| `description` | textarea | 紹介記事 |
| `img_information` / `img_information_sp` | image | INFORMATION画像（PC/SP） |
| `information` | wysiwyg | INFORMATION（SP用テキスト） |
| `information_link` | text | INFORMATIONリンク |
| `add_information` | repeater | information（2件目以降）→ 子: `img_information`, `img_information_sp`, `information_link` |
| `article_box` | repeater | レイアウト → 子: `layout`(radio: 1中見出しH2/2小見出しH3/3テキスト/4画像1/5画像2/6区切り線), `article_heading`, `article_text`(wysiwyg), `article_img_1`, `article_img_2` |
| `staff_name` | wysiwyg | STAFF NAME |
| `staff_link` | text | STAFF LINK |
| `img_information_foot`(_sp) | image | INFORMATION FOOT（PC/SP） |
| `img_information_foot_link` | text | INFORMATION FOOTリンク |

> 本部 `news`（07b §2.1）のACFと同一構造。新基盤では Lexical/ブロックの「記事ビルダー」に集約する（中見出し・小見出し・テキスト・画像のブロック化）。現在は無効化されているため、移行対象データの有無は本部 `news` 側で確認。

---

## 4. 店舗紐付けフィールド `display_user`（確定詳細）

- ACFキー：`field_6481a36287caf` / 機械名 `display_user` / グループ「表示対象の指定（管理者・編集者のみ入力可能）」
- 型：**user**（WordPressユーザー参照）・`multiple=1`（複数指定可）・`return_format=id`・`allow_null=1`・対象ロール `author`
- 付与先：`event`/`works`/`voice`/`lineup`/`slider`（いずれも管理者・編集者のみ編集可）
- 仕様（管理画面の説明文より）：
  > 「表示したい店舗を指定してください。（全店舗に表示させる場合は、空白にしてください。）※データの投稿者が店舗の場合、指定は無効です。」
- **移行ルール**：
  - 投稿者が店舗ユーザー → そのテナントに所属。
  - 投稿者が本部(admin等)かつ `display_user` 指定あり → 指定ユーザー（複数可）のテナントに表示。
  - `display_user` 空欄 → **全店表示＝本部共有(shared)**。

---

## 5. 店舗ユーザー名簿（WXR著者・14件）と 07b §3 突合

| login | 表示名 | 07b §3との対応 |
|---|---|---|
| `admin` | admin | 本部管理（テナント外） |
| `member` | 株式会社〇〇 | ダミー/テスト用（テナント外） |
| `life-quartet` | 株式会社LIFE QUARTET | §3=「lifequartet(案)・ページ無し」だが**ユーザーは実在**（要slug確定） |
| `woodbox-yamanashi` | スマトチ スヴァーリエヒュース株式会社 | §3一致（id420） |
| `hilaki` | WOODBOX海老名 建築のひら木 | §3一致（id418） |
| `woodbox-osaka` | 株式会社市兵衛 | §3一致（id366） |
| `den-kenchiku` | 有限会社田建築工房 | §3一致（id434） |
| `soubi-kenchiku-kikaku` | 株式会社創美建築企画 | §3一致（id1894） |
| `nawa-kenchiku` | 株式会社名和建築 | §3一致（id2257） |
| `kuusou-koubou` | 株式会社空創工房 | §3一致（id4374） |
| `housingfukushimacenter` | ハウジング福島センター | §3一致（id3412） |
| `itakura` | 株式会社板倉商事 | §3一致（id4639） |
| `woodplan` | 株式会社ウッドプラン ENJOY HOUSE | §3一致（id4754） |
| `tsujiya_archt` | 辻家株式会社 | §3一致（id5146・slugは下線） |

- **判明**：実店舗ユーザー12件のうち11件は §3 の「members.comページ保有18店」と一致。残り1件 `life-quartet` は §3 では「ページ無し(案)」扱いだったが**ユーザーは実在**。
- **未解決**：§3の18店のうち、ユーザー著者リストに出てこない7店（`flash`/`hiraokakensetu`/`onfleekhome`/`harmony`/`kindwork`/`kaitaku`/`arcathhome`）は、CPTが未出力のため本WXRでは著者として現れていないだけの可能性が高い。**完全なユーザー名簿はCPT再取得（§7）後に確定**。
- **移行タスク**：`stores` CPT(66) と WPユーザー(店舗) を **メール/店名/slug で名寄せ**し、新 `tenants` に統合。slug は §3 の確定slugを優先。

---

## 6. 固定ページ・問い合わせフォーム（確定）

### 固定ページ（8）
| status | slug | タイトル | 新基盤での扱い |
|---|---|---|---|
| draft | `privacy-policy` | プライバシーポリシー | `pages`（公開要否を確認） |
| publish | `contact` | お問い合わせ・来店予約 | フォームページ |
| publish | `store` | 加盟店 | 加盟店一覧（`tenants`描画） |
| publish | `evententry` | イベント参加予約 | 予約フォーム |
| publish | `contact_thanks` | お問い合わせ完了 | サンクスページ |
| publish | `evententry_thanks` | イベント予約完了 | サンクスページ |
| publish | `request` | 資料請求 | フォームページ |
| publish | `request_thanks` | 資料請求完了 | サンクスページ |

> 商品・施工事例・イベント等の一覧/詳細は固定ページではなく**CPTのテンプレート描画**（07b §1）。

### 問い合わせフォーム（wpcf7・5）
| id | 名称 | 用途 |
|---|---|---|
| 76 | コンタクトフォーム 1 | 既定（未使用の可能性） |
| 112 | イベント参加予約 | イベント来場予約 |
| 113 | 資料請求 | 資料請求リード |
| 114 | お問い合わせ・来店予約 | 来店予約リード |
| 2052 | 【BACKUP-9171】資料請求 | バックアップ（移行不要） |

> フォーム項目例（id76）：氏名 `your-name`、メールアドレス。**`04_拡張設計_問い合わせ分析` のリード取得点**はこの4フォーム（112/113/114＋来店予約）。新基盤では送信を Next.js API/サーバーアクションで受けて分析基盤へ記録する。

---

## 7. 【要対応】CPT本体データの再取得（移行用）

「すべてのコンテンツ」エクスポートではテーマCPTが出力されない（`can_export=false`想定）。データ移行のために、以下いずれかで `lineup`/`event`/`works`/`voice`/`slider` を**ACF値ごと**再取得する必要がある。

| 方式 | 取得できるもの | 実施者 | 備考 |
|---|---|---|---|
| **A. WP All Export 等のプラグイン** | 全CPT＋ACF＋下書き | スタッフ（要プラグイン導入判断） | 非エンジニア向けに最も現実的。CSV/XML出力 |
| **B. WP-CLI `wp export --post_type=lineup,event,works,voice,slider`** | 全CPT＋ACF | エンジニア（サーバーアクセス） | `can_export`を無視して出力可。確実 |
| **C. ACF「Show in REST」を各グループでON → 公開RESTで取得** | 公開分のCPT＋ACF | スタッフ＋Claude | 下書きは取得不可。Claudeが取得・整形可能 |
| **D. DB(SQL)エクスポート** | 全データ | エンジニア | 最も完全だが要DBアクセス |

> **デモ（フェーズ1）の観点**：新基盤の構築自体は **本書のACFスキーマで今すぐ着手可能**。デモを実データで見せたい場合は、方式Cで公開分の実レコードを少量取り込めば十分。完全移行（全件・下書き含む）は方式A/B/Dでフェーズ2以降に実施。

---

## 8. 07b §8 残課題の更新（加盟店側）

| §8の残課題 | 状態 | 確定内容 |
|---|---|---|
| `lineup`/`event`/`voice`/`works` のACFフィールド名 | ✅ **確定** | §3 のとおり全フィールド名・型・選択肢を取得 |
| 商品価格のACF | ✅ **確定（存在しない）** | lineupに価格フィールド無し（§3.4） |
| お客様の声の本文 | ✅ **構造確定** | `description`＋`img_main`のみ（§3.5）。値はCPT再取得後 |
| イベント開催日時・場所 | ✅ **構造確定** | `event_date`/`event_time`/`event_place`/`close_date`等（§3.2）。値は再取得後 |
| 施工事例ギャラリー | △ 部分 | ACFは`img_main`＋本文。複数画像は本文内 or media。要CPT再取得で確認 |
| 各 works/event/voice の店舗紐付けフィールド | ✅ **確定** | `display_user`＋投稿者（§4） |
| 本部事例(headquarters)の個別id一覧 | △ 未 | フラグ＝`tag_works_headquarters`は確定。個別idはCPT再取得後 |
| 下書き/非公開含む全件数 | △ 未 | CPTが未出力のため再取得後（§7） |
| `media`記事の category 実値 | ⛔ 本部側 | `unstandard-jp.xml` 未受領 |

---

## 9. 【スコープ確定】新システムへ移行する加盟店（18店）

`https://unstandard.jp/stores/`（本部の全国加盟店一覧・2026-06-02取得）で「**UNSTANDARD専用サイト**」リンクを持つ加盟店＝新プラットフォームのテナント。リンク先は `unstandard-members.com/<slug>/`。**ちょうど18店**で、07b §3 の「members.comページ保有18店」と完全一致。

| # | エリア | 加盟店名 | tenant-slug | WXRユーザー有無 |
|---:|---|---|---|:---:|
| 1 | 北海道東北 | ハウジング福島センター | `housingfukushimacenter` | ✓ |
| 2 | 関東 | On Fleek Home | `onfleekhome` | — |
| 3 | 関東 | 株式会社ウッドプラン ENJOY HOUSE | `woodplan` | ✓ |
| 4 | 関東 | 株式会社板倉商事 | `itakura` | ✓ |
| 5 | 関東 | 株式会社空創工房 | `kuusou-koubou` | ✓ |
| 6 | 関東 | スマトチ スヴァーリエヒュース株式会社（WOODBOX山梨） | `woodbox-yamanashi` | ✓ |
| 7 | 関東 | WOODBOX海老名 株式会社 建築のひら木 | `hilaki` | ✓ |
| 8 | 北陸信越 | フラッシュ株式会社 | `flash` | — |
| 9 | 北陸信越 | 辻家株式会社 | `tsujiya_archt` | ✓ |
| 10 | 北陸信越 | 株式会社平岡建設 | `hiraokakensetu` | — |
| 11 | 東海 | 株式会社名和建築 | `nawa-kenchiku` | ✓ |
| 12 | 東海 | 株式会社HARMONY | `harmony` | — |
| 13 | 関西 | アトリエSumika-住処- 株式会社創美建築企画 | `soubi-kenchiku-kikaku` | ✓ |
| 14 | 関西 | WOODBOX OSAKA（株式会社市兵衛） | `woodbox-osaka` | ✓ |
| 15 | 四国中国 | 有限会社開拓 | `kaitaku` | — |
| 16 | 四国中国 | カインドワーク株式会社 | `kindwork` | — |
| 17 | 九州沖縄 | 株式会社ARCATH HOME | `arcathhome` | — |
| 18 | 九州沖縄 | 有限会社田建築工房 | `den-kenchiku` | ✓ |

> エリア内訳：北海道東北1／関東6／北陸信越3／東海2／関西2／四国中国2／九州沖縄2 ＝ 18。

**WXRユーザーとの突合（§5）：**
- 18店中 **11店** は加盟店WXRに投稿者（WPユーザー）として実在。
- 残り **7店**（onfleekhome / flash / hiraokakensetu / harmony / kaitaku / kindwork / arcathhome）は、CPTが未出力（07c §1）のため著者リストに現れていないだけ。ユーザー自体は存在する見込み。**CPT再取得（§7）で確定**。
- **対象外で確定（2026-06-02 本部判断）**：`life-quartet`（株式会社LIFE QUARTET）はWXRにユーザーが存在するが「UNSTANDARD専用サイト」リンクが無く、**新システムへの移行対象に含めない**。よってテナントは **18店で確定**。移行時はこのアカウント／その投稿を取り込まないこと。

**スコープの含意：**
- 新プラットフォームの `tenants` ＝ **この18店**（全66店ではない）。
- 残り48店は本部 `stores` ディレクトリの掲載エントリ（外部サイトへのリンク or 未整備）として**現状維持**。新基盤には取り込まない。
- 各店の住所・電話は本部 `stores` 一覧と加盟店WXRのユーザーACF（§3.1）の両方にあり、移行時に名寄せ。

---

## 付録：検証
- 件数は WXR の `<item>` を投稿タイプ別に集計（下書き含む実数）。
- ACFスキーマは `acf-field-group`（location）＋`acf-field`（`excerpt`=機械名 / `content`=型・選択肢のPHPシリアライズ）を直接デシリアライズして取得。
- 店舗ユーザーは `<wp:author>` 14件。`display_user` 定義（type=user/multiple/return=id）と整合。
