# WordPressエクスポート置き場（フェーズB用）

Step0の残作業（ACF・正確な件数・店舗紐付けの確定）に使う、WordPressのエクスポートファイルをここに置きます。
このフォルダの中身は **Gitにコミットされません**（`.gitignore` 済み）。

## 取得手順（各サイトの管理画面で）

1. WordPress管理画面にログイン
2. 左メニュー **「ツール」→「エクスポート」**
3. **「すべてのコンテンツ」** を選択 → **「エクスポートファイルをダウンロード」**
4. ダウンロードしたXMLを、次の名前でこのフォルダに置く：
   - `unstandard-jp.xml` … `unstandard.jp`（本部）
   - `unstandard-members.xml` … `unstandard-members.com`（加盟店）

## 任意（あるとより正確）

- ACFの設定があれば：**「ACF」→「ツール」→ フィールドグループをエクスポート（JSON）** → `acf-jp.json` / `acf-members.json` として置く。

## 置いたあと

ファイルを置いたら Claude に「WXRを置いた」と伝えてください。
中身を解析して `07b_Step0_構造確定_対応表.md` と `07_WordPress移行詳細設計.md` の
ACF・件数・店舗紐付け・id→slug対応表を確定値で更新します。
