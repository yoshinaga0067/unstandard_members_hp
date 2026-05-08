---
description: アプリを公開する。フェーズ1はVercelプレビューURL、フェーズ3はプルリクエストを作成します。
---

このコマンドは **公開フロー** を実行します。

## フェーズの確認

最初に `.claude/phase3.lock` が存在するか確認する：
- 存在しない → **フェーズ1フロー**（Vercelプレビューデプロイ）
- 存在する → **フェーズ3フロー**（プルリクエスト・エンジニアレビュー）

---

## フェーズ1フロー（Vercelプレビューデプロイ）

### 手順

1. **ブランチ確認**：`git branch --show-current` が `develop` であることを確認。違う場合は中止し、ユーザーに `/start` するよう日本語で伝える。

2. **未コミットの変更を保存**：`git status --short` で未コミットがあれば、`/save` と同じロジックでコミット。

3. **セキュリティ事前レビュー**：`security-pre-publish` サブエージェントを `Agent` ツールで起動。プロンプト：
   > このリポジトリのdevelopブランチで、公開直前のセキュリティチェックを行ってください。秘密情報の混入、localStorage への session/token 保存、CORS の `*`、未バリデーションのフォーム入力、クライアントコンポーネントでの `process.env` 露出を確認してください。問題があれば日本語で具体的に報告してください。

   サブエージェントが **NG** を返したら停止。ユーザーに日本語で問題を伝え、修正後にもう一度 `/publish` するよう案内する。

4. **PROJECT-OVERVIEW.md を更新**：
   - 「Features」「Pages」セクションを最新の状態に
   - 「Changelog」の一番上に新しい行を追加
   - 「Tech Stack」「External Connections」「Environment Variables」も実態に合わせて更新

5. **ビルド確認**：
   - `package.json` に `build` スクリプトがあれば `npm run build` を実行
   - 失敗したら停止し、エラーをユーザーに日本語で伝える

6. **Vercel設定ファイルの確認**（Viteプロジェクトのみ）：
   - `next.config.js` / `next.config.ts` / `next.config.mjs` のいずれかが存在する → Next.js、スキップ
   - いずれも存在しない → Viteプロジェクトとみなし、`vercel.json` がなければ作成する：
     ```json
     {
       "buildCommand": "npm run build",
       "outputDirectory": "dist",
       "framework": "vite"
     }
     ```
     作成したら `git add vercel.json` でステージング。

7. **コミット & プッシュ**：
   - PROJECT-OVERVIEW.md（とvercel.jsonがあれば）の更新を `git commit -m "公開前にPROJECT-OVERVIEW.mdを更新"` でコミット
   - `git push -u origin develop`

8. **Vercelプレビューデプロイ**：
   - `npx vercel --yes` を実行（`--prod` は絶対に使わない）
   - **認証エラーが出た場合**：ユーザーに日本語で伝える：
     「Vercelへのログインが必要です。ターミナルで `npx vercel login` を実行して、ブラウザでログインしてください。完了したら『ログインしました』と教えてください。」
     → ユーザーからの確認後、再度 `npx vercel --yes` を実行
   - **プロジェクトのリンクを求められた場合**：`npx vercel link --yes` を実行してからデプロイを再試行

9. **ユーザーへの最終メッセージ**（日本語、フレンドリーに）：
   ```
   ✅ あなたのVercelアカウントにデプロイしました！
   プレビューURL: <vercel_preview_url>

   このURLを上長・チーム・クライアントに共有してフィードバックをもらいましょう。
   ※ これはあなた個人のVercelアカウントのプレビュー版です。
   ※ 本番公開はエンジニアが確認・整備してから行います。
   ```

---

## フェーズ3フロー（プルリクエスト・エンジニアレビュー）

### 手順

1. **ブランチ確認**：`git branch --show-current` が `develop` であることを確認。違う場合は中止し、ユーザーに `/start` するよう日本語で伝える。

2. **未コミットの変更を保存**：`git status --short` で未コミットがあれば、`/save` と同じロジックでコミット。

3. **セキュリティ事前レビュー**：`security-pre-publish` サブエージェントを `Agent` ツールで起動（フェーズ1と同じプロンプト）。NGなら停止。

4. **PROJECT-OVERVIEW.md を更新**：Features、Pages、Changelog を最新の状態に。

5. **ビルド確認**：`npm run build` を実行。失敗したら停止。

6. **コミット & プッシュ**：
   - `git commit -m "公開前にPROJECT-OVERVIEW.mdを更新"`
   - `git push -u origin develop`

7. **プルリクエスト作成**：`gh pr create --base main --head develop --title "<日本語のタイトル>" --body "<本文>"`
   - 本文は最後の数件のコミットを箇条書きで日本語要約
   - PR URL を取得して保存

8. **ユーザーへの最終メッセージ**（日本語、フレンドリーに）：
   ```
   ✅ プルリクエストを作成しました。
   URL: <pr_url>

   エンジニアのレビューを待ってから本番に公開されます。
   Vercelが自動でプレビューURLも生成しますので、PRページで確認できます。
   レビューでコメントが付いたら、修正してまた /publish してください。
   ```

## 大切なこと

- mainブランチには **絶対に直接プッシュしない**（フックでもブロックされます）
- フェーズ1でも `npx vercel --prod` は使わない（プレビューのみ）
- PROJECT-OVERVIEW.md の更新は **同じコミットに含める**
- ビルドエラーやセキュリティチェック失敗があれば、必ず停止する
- ユーザーには技術的な詳細を見せず、結果だけ伝える
