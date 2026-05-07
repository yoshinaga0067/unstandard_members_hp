#!/bin/sh
# scan-secrets.sh
# Refuses Write/Edit that contains likely secrets.
# Engineers can bypass with CLAUDE_ENGINEER_OVERRIDE=1.

set -eu

if [ "${CLAUDE_ENGINEER_OVERRIDE:-0}" = "1" ]; then
  echo "[hook] scan-secrets: engineer override active" >&2
  exit 0
fi

INPUT="$(cat)"

# Extract content fields from the tool input. Write uses "content"; Edit uses
# "new_string". We grep both — quick and dirty but good enough for staff guardrails.
CONTENT="$(printf '%s' "$INPUT" | tr -d '\n' | sed -n 's/.*"content"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p')"
NEW_STRING="$(printf '%s' "$INPUT" | tr -d '\n' | sed -n 's/.*"new_string"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p')"
FILE_PATH="$(printf '%s' "$INPUT" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

# Skip the example file — it's supposed to contain placeholder-shaped secret names.
case "$FILE_PATH" in
  *.env.example|*.env.sample|*/README*|*.md) exit 0 ;;
esac

PAYLOAD="$CONTENT$NEW_STRING"

if [ -z "$PAYLOAD" ]; then
  exit 0
fi

MATCH=""

# Stripe live/test keys
if printf '%s' "$PAYLOAD" | grep -qE 'sk_(live|test)_[A-Za-z0-9]{16,}'; then
  MATCH="Stripe APIキー"
fi

# Slack tokens
if [ -z "$MATCH" ] && printf '%s' "$PAYLOAD" | grep -qE 'xox[baprs]-[A-Za-z0-9-]{10,}'; then
  MATCH="Slackトークン"
fi

# GitHub personal access tokens
if [ -z "$MATCH" ] && printf '%s' "$PAYLOAD" | grep -qE 'gh[poasu]_[A-Za-z0-9]{30,}'; then
  MATCH="GitHubトークン"
fi

# AWS access key ID
if [ -z "$MATCH" ] && printf '%s' "$PAYLOAD" | grep -qE 'AKIA[0-9A-Z]{16}'; then
  MATCH="AWSアクセスキー"
fi

# Private keys
if [ -z "$MATCH" ] && printf '%s' "$PAYLOAD" | grep -qE -- '-----BEGIN [A-Z ]*PRIVATE KEY-----'; then
  MATCH="秘密鍵 (PRIVATE KEY)"
fi

# JWT-shaped tokens
if [ -z "$MATCH" ] && printf '%s' "$PAYLOAD" | grep -qE 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}'; then
  MATCH="JWTトークン"
fi

# Hardcoded API_KEY/SECRET/PASSWORD/TOKEN with a long value
if [ -z "$MATCH" ] && printf '%s' "$PAYLOAD" | grep -qE '(API_KEY|SECRET|PASSWORD|TOKEN)[[:space:]]*=[[:space:]]*["'"'"']?[A-Za-z0-9_-]{20,}'; then
  MATCH="ハードコードされたAPIキー/パスワード"
fi

if [ -n "$MATCH" ]; then
  cat >&2 <<EOF
🚫 秘密情報がコードに含まれているようです：$MATCH

✅ 正しい手順：
   1. 値を .env.local に書く（.env.local はGitに保存されません）
   2. .env.example にプレースホルダーだけ追加する
   3. コードからは process.env.変数名 で参照する
   4. 本番用の値はエンジニアにVercelに設定してもらう

エンジニアの方：意図的なテンプレート編集の場合は
CLAUDE_ENGINEER_OVERRIDE=1 claude で起動してください。
EOF
  exit 2
fi

exit 0
