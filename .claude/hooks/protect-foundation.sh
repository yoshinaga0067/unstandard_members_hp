#!/bin/sh
# protect-foundation.sh
# Refuses Write/Edit on engineer-owned foundation files.
# Only activates when .claude/phase3.lock exists (engineer has signed off Phase 2).
# In Phase 1 (no lock file), all files are freely editable.
# Engineers can bypass with CLAUDE_ENGINEER_OVERRIDE=1.

set -eu

if [ "${CLAUDE_ENGINEER_OVERRIDE:-0}" = "1" ]; then
  echo "[hook] protect-foundation: engineer override active" >&2
  exit 0
fi

# Phase detection: engineer creates .claude/phase3.lock during Phase 2 handoff.
# Without it, we are in Phase 1 — full creative freedom, no file restrictions.
if [ ! -f "./.claude/phase3.lock" ]; then
  exit 0
fi

INPUT="$(cat)"
FILE_PATH="$(printf '%s' "$INPUT" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

BASENAME="$(basename "$FILE_PATH")"

is_protected=0
reason=""

# .env files (but NOT .env.example or .env.sample — those are templates)
case "$BASENAME" in
  .env|.env.local|.env.production|.env.development|.env.test)
    is_protected=1
    reason="環境変数ファイル ($BASENAME)"
    ;;
esac

# Foundation files by basename
case "$BASENAME" in
  middleware.ts|middleware.js|middleware.tsx|middleware.jsx)
    is_protected=1
    reason="Next.jsミドルウェア (認証・セキュリティ層)"
    ;;
  next.config.js|next.config.ts|next.config.mjs)
    is_protected=1
    reason="Next.js設定ファイル"
    ;;
  tsconfig.json)
    is_protected=1
    reason="TypeScript設定"
    ;;
  package.json)
    is_protected=1
    reason="package.json (依存関係)"
    ;;
esac

# Foundation files by path
case "$FILE_PATH" in
  */app/api/*|*/pages/api/*)
    is_protected=1
    reason="APIルート（バックエンド処理）"
    ;;
  */lib/supabase/*|*/lib/supabase.ts|*/lib/supabase.js)
    is_protected=1
    reason="Supabaseクライアント設定"
    ;;
  */supabase/config.toml|*/supabase/migrations/*|*/supabase/seed.sql)
    is_protected=1
    reason="Supabaseデータベース設定"
    ;;
esac

if [ "$is_protected" = "1" ]; then
  cat >&2 <<EOF
🚫 この部分はエンジニアが設計した基盤ファイルです：$reason
   対象ファイル：$BASENAME

✅ 正しい手順：
   このファイルの変更が必要な場合は、エンジニアに相談してください。
   Slack・メール・チャットで「$BASENAME を変更したい」と伝えてください。

エンジニアの方：意図的な編集の場合は
CLAUDE_ENGINEER_OVERRIDE=1 claude で起動してください。
EOF
  exit 2
fi

exit 0
