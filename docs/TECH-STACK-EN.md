# Tech Stack

Technologies used across projects in this template.
The default is **Next.js**. For simple internal tools only, Vite may be used — Claude Code decides.

## Framework

| Option | When to use |
|--------|-------------|
| **Next.js (App Router)** | Default. Customer-facing apps, anything with auth, API connections, or SEO requirements |
| React + Vite | Simple internal tools only — no auth, no backend, no SEO. Claude Code decides. |

## Common Libraries

| Library | Purpose |
|---------|---------|
| Tailwind CSS | Styling and layout |
| TypeScript | Type safety — catches mistakes before they ship |
| Noto Sans JP | Japanese font |
| zod | Input validation — ensures data is the right shape before processing |

## Authentication (when needed)

| Library | Purpose |
|---------|---------|
| NextAuth.js / Auth.js | Login and session management |
| Supabase Auth | When the backend is Supabase |

## Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Hosting and automatic deployment |
| GitHub | Source code management and version history |

## Environment Variables

All secrets (API keys, passwords, etc.) are stored as environment variables — never written directly in code.
`.env.example` lists what variables the project needs, with placeholder values.
The engineer sets the real values in Vercel.

## MCP Servers, Extensions, and Third-Party Plugins

- **Do not add them.** MCP servers, browser extensions, and third-party Claude Code plugins are a supply-chain attack surface.
- If something seems necessary, ask the engineer first.
- The rule is: only use what's already included in the project.

## Notes

- Let Claude Code choose the right technology — you don't need to decide.
- Security-related libraries (zod, NextAuth, etc.) are always used.
- Unnecessary packages are not installed.
- If an unfamiliar technology name appears, check the glossary.
