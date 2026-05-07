#!/bin/sh
# block-main-push.sh
# Refuses any `git push` that targets main/master.
# Engineers can bypass with CLAUDE_ENGINEER_OVERRIDE=1.

set -eu

if [ "${CLAUDE_ENGINEER_OVERRIDE:-0}" = "1" ]; then
  echo "[hook] block-main-push: engineer override active" >&2
  exit 0
fi

INPUT="$(cat)"
CMD="$(printf '%s' "$INPUT" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

if [ -z "$CMD" ]; then
  exit 0
fi

case "$CMD" in
  *"git push"*)
    case "$CMD" in
      *" main"*|*":main"*|*" master"*|*":master"*|*"--force"*|*" -f "*|*" -f"|*"-f "*)
        cat >&2 <<'EOF'
🚫 mainブランチへの直接プッシュは禁止されています。

✅ 正しい手順：
   1. developブランチで作業を続ける
   2. 「公開して」または /publish と指示する
   3. プルリクエストが作成され、エンジニアがレビューします

エンジニアの方：どうしてもmainへ直接プッシュが必要な場合は
CLAUDE_ENGINEER_OVERRIDE=1 claude で起動してください。
EOF
        exit 2
        ;;
    esac
    ;;
esac

exit 0
