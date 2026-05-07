# For Engineers — Template Setup Guide

This document is for **engineers**, not staff. It explains the three-phase project lifecycle and what you do in each phase.

## Project lifecycle

```
Phase 1: Staff build a demo from this template (no engineer)
    ↓
Phase 2: YOU take the demo, add proper backend, set up environments
    ↓
Phase 3: Staff pull your new repo and add features on top
```

## What this template gives you

A baseline `.claude/` directory with:
- `settings.json` — permissions (loose by default) + hooks (strict, blocking)
- `hooks/` — three POSIX shell scripts that block dangerous Write/Edit/Bash actions
- `commands/` — four Japanese-friendly slash commands staff use instead of typing instructions
- `agents/security-pre-publish.md` — last-mile read-only security agent invoked by `/publish`

Plus docs (`CLAUDE.md`, `README.md`, `docs/WORKFLOW.md`, `docs/TECH-STACK.md`, `docs/GLOSSARY-QUICK.md`).

There is intentionally **no application code** in this template. Staff scaffold the framework themselves in Phase 1.

## Your role: Phase 2 handoff

When staff say "the demo is done," you take over:

1. **Review the demo** — understand what they built and what needs to become production-grade
2. **Create a new repo** from this template (or fork/copy the demo repo)
3. **Initialize the framework properly** if it isn't already:
   - `npm create next-app@latest .` (TypeScript on, Tailwind on, App Router on)
   - Or keep what staff scaffolded if it's clean enough
4. **Merge in the demo UI** — bring over the pages/components staff built; discard any quick-and-dirty logic
5. **Set up the production foundation:**
   - `lib/supabase/` — Supabase client (the protect-foundation hook will guard this)
   - `middleware.ts` — auth middleware (also protected)
   - `app/api/auth/*` — auth routes (also protected)
   - `supabase/migrations/` — schema + RLS policies (**enable RLS on every table**)
6. **Configure environments:**
   - Add real values to Vercel env vars (dev + prod)
   - Update `.env.example` with placeholder names only — never commit real values
7. **Branch setup:**
   - Push initial code to `main`
   - Create `develop` branch
   - Set branch protection on `main` (require PR review)
8. **Hand off back to staff:**
   - Tell them: "準備完了です。このリポジトリをClone して `/start` してください。"

## How the guardrails work

### Permissions (`.claude/settings.json`)
- **allow** — auto-approved: safe reads, builds, git on develop, lint/typecheck, gh PR commands
- **ask** — staff sees a prompt: installs, network calls (`curl`, `wget`, WebFetch, WebSearch), `npx <something>`
- **deny** — hard refusal at the harness level: `rm -rf`, `sudo`, force pushes, `git push origin main`, `git reset --hard`, `curl ... | sh`, reads/writes of `.env*`

The deny list is the second line of defense. The hooks below are the first.

### Hooks (`.claude/hooks/*.sh`)
All three are **PreToolUse, blocking** (exit 2 stops the tool call). They read tool input from stdin as JSON.

- **`block-main-push.sh`** — refuses any `git push` targeting main/master, including `--force` variants
- **`scan-secrets.sh`** — regex-scans Write/Edit content for Stripe/Slack/GitHub/AWS keys, JWTs, RSA private keys, and `(API_KEY|SECRET|PASSWORD|TOKEN)=<long-value>`. Skips `.env.example` and `.md` files.
- **`protect-foundation.sh`** — refuses Write/Edit on `.env*` (except `.env.example`), `middleware.*`, `next.config.*`, `tsconfig.json`, `package.json`, `app/api/auth/*`, `lib/supabase/*`, `supabase/*`

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

## Tier note

The "Tier 1 / Tier 2" classification has been deprecated. **Every project gets the same baseline guardrails.** Relax per project if a specific case warrants it, but the safe default is to leave them on.
