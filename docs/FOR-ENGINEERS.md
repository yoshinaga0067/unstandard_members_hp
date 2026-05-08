# For Engineers — Template Setup Guide

This document is for **engineers**, not staff. It explains the three-phase project lifecycle and what you do in each phase.

## Project lifecycle

```
Phase 1: Staff build a demo from this template (no engineer)
    ↓
Phase 2: YOU review, polish, fix vulnerabilities, set up Vercel, activate Phase 3 lock
    ↓
Phase 3: Staff continue adding features on the hardened codebase
```

## What this template gives you

A baseline `.claude/` directory with:
- `settings.json` — permissions (loose by default) + hooks (strict, blocking)
- `hooks/` — three POSIX shell scripts that block dangerous Write/Edit/Bash actions
- `commands/` — four Japanese-friendly slash commands staff use instead of typing instructions
- `agents/security-pre-publish.md` — last-mile read-only security agent invoked by `/publish`

Plus docs (`CLAUDE.md`, `README.md`, `docs/WORKFLOW.md`, `docs/TECH-STACK.md`, `docs/GLOSSARY-QUICK.md`).

There is intentionally **no application code** in this template. Staff scaffold everything themselves in Phase 1.

## Phase 1: What staff do (without you)

Staff clone this template and build freely — UI, database, auth, middleware, whatever their idea needs. Claude Code guides them with good patterns (env vars for secrets, TypeScript, Tailwind, Supabase for data) but places **no restrictions** on what files they can create or modify.

The only universal guardrails that apply in Phase 1:
- No pushing to `main` directly
- No hardcoding secrets in source files

Everything else is open.

## Your role: Phase 2 review

When staff say "the demo is done," you take over. Your job is **not** to rebuild from scratch — it's to review, harden, and prepare for production.

1. **Pull the demo and review** — understand what they built, read through the code
2. **Fix security issues** — look for: hardcoded secrets, missing input validation, CORS wildcards, insecure auth patterns, missing RLS on Supabase tables. Run `/security-review` if it helps.
3. **Polish the code** — clean up quick-and-dirty logic, add proper error handling, improve TypeScript types
4. **Set up Vercel environments:**
   - Add real values to Vercel env vars (dev + prod)
   - Verify `.env.example` has all the right placeholder names
5. **Branch setup (if not already done):**
   - Push to `main`
   - Create `develop` branch
   - Set branch protection on `main` (require PR review)
6. **Activate Phase 3 protection** — this is the key step:

```sh
touch .claude/phase3.lock
git add .claude/phase3.lock
git commit -m "フェーズ3移行：基盤保護を有効化"
git push origin main
```

   Once `phase3.lock` exists, the `protect-foundation.sh` hook activates and blocks staff from modifying foundation files.

7. **Hand off back to staff:**
   - Tell them: "準備完了です。最新のコードを pull して `/start` してください。"

## How the guardrails work

### Permissions (`.claude/settings.json`)
- **allow** — auto-approved: safe reads, builds, git on develop, lint/typecheck, gh PR commands
- **ask** — staff sees a prompt: installs, network calls (`curl`, `wget`, WebFetch, WebSearch), `npx <something>`
- **deny** — hard refusal at the harness level: `rm -rf`, `sudo`, force pushes, `git push origin main`, `git reset --hard`, `curl ... | sh`, reads/writes of `.env*`

The deny list is the second line of defense. The hooks below are the first.

### Hooks (`.claude/hooks/*.sh`)
All three are **PreToolUse, blocking** (exit 2 stops the tool call). They read tool input from stdin as JSON.

- **`block-main-push.sh`** — refuses any `git push` targeting main/master, including `--force` variants. Applies always (Phase 1 and Phase 3).
- **`scan-secrets.sh`** — regex-scans Write/Edit content for Stripe/Slack/GitHub/AWS keys, JWTs, RSA private keys, and `(API_KEY|SECRET|PASSWORD|TOKEN)=<long-value>`. Skips `.env.example` and `.md` files. Applies always.
- **`protect-foundation.sh`** — refuses Write/Edit on `.env*` (except `.env.example`), `middleware.*`, `next.config.*`, `tsconfig.json`, `package.json`, `app/api/auth/*`, `lib/supabase/*`, `supabase/*`. **Only activates when `.claude/phase3.lock` exists.** In Phase 1, this hook exits immediately without blocking anything.

Every hook honors `CLAUDE_ENGINEER_OVERRIDE=1`. To run a one-off engineer session that bypasses the guardrails:

```sh
CLAUDE_ENGINEER_OVERRIDE=1 claude
```

You'll see `[hook] <name>: engineer override active` in stderr when it triggers.

### Slash commands (`.claude/commands/*.md`)
Read them — they're short. They're the only thing staff should be typing besides "make X look like Y" requests.

### Security agent (`.claude/agents/security-pre-publish.md`)
Invoked by `/publish` before pushing. Read-only. Checks for: hardcoded secrets, `localStorage` of session/token, CORS `*`, unvalidated forms, `process.env` in client components without `NEXT_PUBLIC_`. Reports pass/fail in Japanese.

## Adjusting per project

The shared `.claude/settings.json` is committed and applies to everyone. For per-engineer overrides (e.g. allow a tool you trust on your machine only), use `.claude/settings.local.json` — it's gitignored.

To **relax** a hook for a specific project (rare), edit the project's `.claude/settings.json` and remove that hook entry. Don't edit the shell scripts in place — that affects every future project.

To **add a hook** that should apply to every project going forward, add it to the template repo, not individual projects.

## What NOT to change in this template

- The hook scripts themselves — they need to be portable POSIX `/bin/sh` for macOS staff
- The slash command names — staff have memorized them, and CLAUDE.md references them
- The `CLAUDE_ENGINEER_OVERRIDE` env var name — documented for engineers across projects
- The `.claude/phase3.lock` filename — CLAUDE.md and the hook both reference it by this exact name
