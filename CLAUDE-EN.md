# CLAUDE.md — Project Rules for Claude Code

## About this project

This project belongs to a housing and architectural home design company. Non-technical staff use Claude Code to build apps and demos. Projects go through three phases:

- **Phase 1 — Demo**: Staff build a prototype from this template with no engineer involved. Full creative freedom — database, auth, middleware, anything the idea needs. Claude handles the technical setup and guides staff step by step.
- **Phase 2 — Engineer review**: The engineer reviews what staff built, polishes the code, fixes security vulnerabilities, sets up Vercel environments, and creates `.claude/phase3.lock` to activate foundation protection before handing back.
- **Phase 3 — Features**: Staff continue adding features on top of the engineer-reviewed foundation.

**Detect which phase you are in** by checking for `.claude/phase3.lock` in the project root:
- If it does not exist → Phase 1. Full creative freedom. No restrictions apply.
- If it exists → Phase 3. Foundation files are engineer-owned — do not modify them.

Staff do not know programming — be helpful, explain your changes in simple Japanese, and keep things clean.

## Language rule (CRITICAL)

**Always respond, ask questions, and explain in Japanese.** File names, commands, and code may remain in English.

The only exception: if the user says "explain in english during this session" or「英語で説明して」, switch to English for that session only. Return to Japanese at the start of the next session.

## Slash commands

Staff use four short Japanese-friendly commands instead of typing the long instructions themselves:

- `/start` — Switch to `develop`, pull the latest, and summarize the project state in Japanese. Use this at the start of every session.
- `/save` — Stage and commit current changes on `develop` with an auto-generated Japanese commit message. Refuses if the branch is `main`.
- `/check` — Read-only sanity scan: hardcoded secrets, type errors, uncommitted changes, current branch.
- `/publish` — Run the security pre-publish agent, update `PROJECT-OVERVIEW.md`, push `develop`, and open a pull request. Reminds staff that engineering review is required before the change is live.

Treat the following Japanese phrases as their equivalent slash commands:

| Phrase examples | Command |
|---|---|
| 「始めて」「スタート」「開始して」 / "start" | `/start` |
| 「保存して」「セーブして」「コミットして」 / "save" | `/save` |
| 「確認して」「チェックして」 / "check" | `/check` |
| 「公開して」「デプロイして」「アップして」 / "publish" | `/publish` |

## How to interact with the user

The user is NOT a programmer. They do not understand code. Follow these rules:

- For regular changes (UI, design, layout, text, adding components, styling): just DO IT. Do not ask permission to edit files. Do not show code diffs. Do not ask "can I modify this file?" — just make the change and describe what you did in simple Japanese.
- ONLY ask for confirmation when the change involves something critical: database structure, authentication, API routes, environment variables, or deleting existing features.
- Never ask technical questions like "should I use useState or useReducer?" — just make the best decision yourself.
- When explaining what you did, describe the RESULT ("ヘッダーの色を青に変えました"), not the CODE ("useState を追加しました").

## IMPORTANT: Do not modify the foundation (Phase 3 only)

This rule applies **only when `.claude/phase3.lock` exists** — meaning the engineer has reviewed and signed off the project. Foundation files are protected by hooks that will block edits automatically.

Do NOT modify these files unless the engineer explicitly approved:

- Database schema or Supabase configuration
- Authentication setup
- API route structure or backend proxy logic
- Environment variable configuration (`.env*` files)
- Middleware or security settings

If the user asks to change any of these in Phase 3, respond:

"この部分はエンジニアが設計した基盤部分です。変更が必要な場合は、エンジニアに相談してください。"

(This is part of the foundation set up by engineering. If changes are needed, please consult the engineer.)

In **Phase 1** (no `.claude/phase3.lock`), these restrictions do not apply — build freely.

## Framework

**Default to Next.js (App Router) for new projects.** Customer-facing apps, anything with auth, and anything that connects to a backend should use Next.js — SSR for SEO, API routes as a backend proxy, and built-in support for Vercel deployment.

**Use Vite + React only for simple internal tools** (no auth, no backend, no SEO requirements). When in doubt, choose Next.js.

If the engineer has already set up the framework for this project, do not switch frameworks or make major architectural changes. Build features within the existing structure.

**Do not install MCP servers, browser extensions, or third-party Claude Code plugins on these projects without engineering approval.** They can introduce supply-chain risk.

## Git rules (CRITICAL)

- **NEVER push directly to the main branch**
- Always work on the `develop` branch
- At the start of a project, create the `develop` branch from main and do ALL work there
- Write commit messages in Japanese, keeping them short and clear
- Example commit messages:
  - "ログイン画面を追加"
  - "お客様データのバリデーションを実装"
  - "API接続のエラーハンドリングを改善"
- When the user says they are done or want to publish, push the `develop` branch and create a pull request to main
- Remind the user: "プルリクエストを作成しました。エンジニアのレビューを待ってから公開されます。" (PR created. It will be published after engineering review.)

## Git workflow for the user

EVERY TIME the user starts a new session or begins working, BEFORE doing anything else:
1. git checkout develop
2. git pull origin develop

Then proceed with normal work:
1. Do all work on develop
2. Commit frequently with Japanese messages
3. When ready to publish: push develop and create a PR to main

If the user asks to "publish" or "deploy" or "公開して":
- **Phase 1** (no `.claude/phase3.lock`): run the `/publish` command, which deploys a Vercel preview to the staff member's own Vercel account. No engineer review required — it's a demo preview.
- **Phase 3** (`.claude/phase3.lock` exists): push develop and create a pull request to main. Do NOT deploy directly. Remind them that engineering review is needed before going live.

## Security rules (CRITICAL)

### Environment variables
- NEVER hardcode API keys, passwords, tokens, or secrets in the code
- Always use environment variables for sensitive values
- Use .env.local for local development (this file is gitignored)
- Reference env vars using process.env.VARIABLE_NAME (Next.js) or import.meta.env.VITE_VARIABLE_NAME (Vite)
- When you need a new secret, add it to .env.example with a placeholder and tell the user to ask engineering to set the real value in Vercel

### User input
- ALWAYS validate and sanitize user input on both client and server side
- Use zod or similar for schema validation
- Never trust client-side data — validate again on the server
- Escape HTML output to prevent XSS attacks

### Authentication
- Use established auth libraries (NextAuth.js, Auth.js) — never build auth from scratch
- Store session tokens securely (httpOnly cookies, not localStorage)
- Always check authentication on API routes, not just on the frontend

### API connections
- Use HTTPS for all external API calls
- Do not expose backend API URLs or internal endpoints to the browser
- Use Next.js API routes or server actions as a proxy to backend services
- Set proper CORS headers — never use Access-Control-Allow-Origin: *

### Supabase (if this project uses a database)

**Phase 1 (no `.claude/phase3.lock`) — full freedom:**
Set up Supabase yourself whenever the demo needs data or auth:
1. Ask the user: "Supabaseのアカウントはお持ちですか？なければ supabase.com で無料登録してください。登録後、新しいプロジェクトを作成して、Settings → API にある URL と anon key を教えてください。"
2. Install: `npm install @supabase/supabase-js`
3. Create `lib/supabase/client.ts` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Write the keys into `.env.local` (gitignored — safe), add placeholders to `.env.example`
5. Set up tables, auth, storage, middleware — anything the demo needs
6. Always enable RLS on every table — guide the user to turn it on in the dashboard

**Phase 3 (`.claude/phase3.lock` exists) — engineer-owned:**
- Use the existing Supabase setup the engineer prepared — do not replace or reconfigure it
- NEVER hardcode keys — always use environment variables
- Do NOT modify the database schema, RLS policies, or auth config — tell the user to ask the engineer if changes are needed

### Data handling
- Only send the minimum required data to the client/browser
- Do not log sensitive data (passwords, tokens, personal info)
- Handle errors gracefully — never expose stack traces or internal errors to users

## Coding standards

- Use clean, readable code with clear structure
- Add comments in English for important sections — the engineer reads the code, so comments must be in English
- Use TypeScript for type safety
- Use Tailwind CSS for styling (install if not present)
- Use responsive design — mobile-first approach
- Keep dependencies minimal — do not install unnecessary packages
- Use semantic HTML elements
- Implement proper error handling and loading states
- Add proper form validation with user-friendly Japanese error messages

## Design guidelines

- Use modern, clean design appropriate for a professional housing company
- Default fonts: "Noto Sans JP" for Japanese, system sans-serif for English
- Ensure proper Japanese typography (line-height: 1.8 for body text)
- All text should be in Japanese unless the user specifies otherwise
- Responsive breakpoints: mobile (375px), tablet (768px), desktop (1024px+)
- Show loading indicators for async operations
- Display friendly error messages in Japanese

## Project structure (Next.js)

If using Next.js, follow this structure:
- /app — Pages and layouts (App Router)
- /app/api — API routes (server-side only)
- /components — Reusable UI components
- /lib — Utility functions, API clients, validators
- /types — TypeScript type definitions
- /public — Static assets

## Project structure (Vite)

If using Vite + React, follow this structure:
- /src/pages — Page components
- /src/components — Reusable UI components
- /src/lib — Utility functions, API clients, validators
- /src/types — TypeScript type definitions
- /public — Static assets

## PROJECT-OVERVIEW.md maintenance (CRITICAL)

There is a file called PROJECT-OVERVIEW.md in the root of this project. You MUST keep it updated. This file is written in English and serves as a living document for the engineer to understand the project at a glance.

### When to update PROJECT-OVERVIEW.md
- When the user says "公開して", "publish", "deploy", or "デプロイして"
- When creating a pull request
- Update it BEFORE pushing or creating the PR — include it in the same commit

### How to update PROJECT-OVERVIEW.md
- **Summary**: Write 2-3 sentences describing what the project is and who it's for. Update if the project scope changes.
- **Features**: List every feature that has been built. Add new features as they are completed. Use short, clear descriptions. Example: "User login with email/password via Supabase Auth", "Property search with area and price filters"
- **Pages**: List every page/route with a one-line description. Example: "/ — Homepage with property search", "/property/[id] — Property detail page with gallery and inquiry form", "/dashboard — User dashboard showing saved properties"
- **Tech Stack**: List every major technology used with the reason it was chosen. Example: "Next.js | Framework | SSR for SEO + API routes for backend proxy", "Supabase | Database + Auth | Auto-generated API, built-in auth, dashboard for data viewing"
- **External Connections**: List every external service the project connects to, what it's used for, and how it authenticates. Example: "Supabase | Database and auth | Anon key (public) + service role key (server only)", "Company PHP API | Property data | API token via env var"
- **Environment Variables**: List every environment variable the project uses, its purpose, and where it's configured. Example: "NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Vercel", "API_KEY | Company backend API key | Vercel (server only)"
- **Changelog**: Add a new row at the TOP of the changelog table with today's date and a brief summary of what changed since the last entry. Keep entries concise. Example: "2025-01-15 | Added user login flow, property search with filters, fixed form validation"

### Rules
- Always write in English
- Keep it concise — this is a quick reference, not documentation
- Do not remove previous changelog entries — only add new ones at the top
- Do not include code snippets — just describe features and changes in plain language
- Always list environment variables — this helps the engineer set them up in Vercel

## What NOT to do

- Do NOT hardcode any API keys, passwords, or secrets
- Do NOT disable TypeScript strict mode
- Do NOT use any, use proper types instead
- Do NOT skip input validation
- Do NOT store sensitive data in localStorage or sessionStorage
- Do NOT expose internal API endpoints to the browser
- Do NOT use English placeholder text — use Japanese placeholder text
- Do NOT send more data to the browser than necessary
