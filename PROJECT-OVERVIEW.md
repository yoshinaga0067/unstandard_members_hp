# Project Overview

> **This file is automatically maintained by Claude Code. Do not edit manually.**
> Updated every time the project is published or a pull request is created.

## Design Theme

UNSTANDARD (mustard accent `#e9d45a` + "LIFE IS COLORFUL" rainbow palette, Noto Sans JP). See `docs/DESIGN.md`.

## Summary

Multi-tenant brand platform for UNSTANDARD, a home-building franchise. This Phase 1
prototype is the public-facing site that showcases the affiliate stores (tenants) and
will eventually host each store's content (works, events, customer voices). Scope and
data model are derived from a migration analysis of the existing WordPress sites
(`project_plan/`). Migration target is fixed at the **18 stores** that run an
"UNSTANDARD専用サイト" (confirmed in `project_plan/07c`).

## Features

- Per-store full sites (18, statically generated) that faithfully reproduce the current site composition: marquee → store header (tel/contact) → hero → LINE UP → EVENT → WORKS → VOICE → contact → store footer. Built from discrete section components so optional modules can be toggled per store later.
- LINE UP / EVENT / WORKS use a reusable carousel (arrow buttons + pager) matching the current design
- Real store profiles (name, prefecture, city, address, postal code, phone, FAX, SNS links, intro) for all 18 tenants, scraped from each store's public page (structured data + footer)
- Content scraped from the live store pages: LINE UP products (18 shared), 施工事例/works (18; 15 shared 本部事例 + 3 store-specific), per-store EVENT, お客様の声/VOICE (5 shared)
- Brand layer: homepage (hero, region finder, store pickup) and store directory grouped by 7 regions
- "私たちについて" (About) page per store: concept message, strong points cards, company profile table with an embedded Google Map. The store top page also carries an About teaser, a News section, and a Media section.
- News (お知らせ) per store: a flat list on the store top page (date + category + title with a left-to-right underline wipe on hover, no boxes), a dedicated list page, and per-article detail pages (title, category, date, image, body, prev/next navigation)
- Dedicated list pages for LINE UP (products), EVENT, WORKS and NEWS, in addition to the carousels on the store top page. The EVENT / WORKS / NEWS / PRODUCTS lists are client components so admin-saved items appear alongside the static seed data.
- Detail pages for EVENT (`/events/[event]`) and WORKS (`/works/[work]`), SSG for seed items with a client-side fallback (`*DetailFallback.tsx`) that renders items created in the demo admin
- Rich body content rendered through a shared `ContentBlocks` renderer (heading / paragraph / image / image-pair blocks), used by news, event and works detail pages
- **Demo admin CMS (`/admin`, `noindex`)** — a front-end-only prototype of the future management screen. Two roles behind a demo login gate (加盟店 = edits only its own store; 本部 = every store + shared content). Resources: お知らせ / イベント / 施工事例 / 商品 / お客様の声 / 私たちについて / 店舗情報. Includes a BlockNote rich-text editor, image upload as data URLs, a 公開/非公開 toggle, and a preview modal. **All data is stored in the browser's localStorage — there is no database, no server, and no real authentication.**
- Contact form with zod validation (client-side), with four modes — 来店予約 / イベント予約 / 資料請求 / お問い合わせ. 資料請求 (document request) shows a brochure picker grouped by product series (NONDESIGN / WOODBOX) plus optional purchase-timing and budget fields; reservation modes include a participant-count field (adults / children)
- Scroll-driven parallax (reusable `components/Parallax.tsx`): the hero wordmark and the About house/family illustration drift at different speeds; respects `prefers-reduced-motion`
- UI polish: unified black pill buttons with hover-invert motion, a back-to-top button, and a favicon (black circle "U")
- UNSTANDARD-themed responsive UI (mobile-first), Japanese typography (line-height 1.8)
- Powered by static seed data scraped from the legacy site; images still hosted on the legacy domain pending re-host. Full DB-backed migration is a later phase.

## Pages

- `/` — Homepage (hero, region finder, store pickup, CTA band)
- `/stores` — Affiliate store directory grouped by region, with anchor quick-nav
- `/stores/[slug]` — Full per-store site (18 SSG pages): hero, About teaser, LINE UP, EVENT, WORKS, VOICE, Media, News, contact
- `/stores/[slug]/about` — About page (私たちについて): concept, strong points, company profile + Google Map
- `/stores/[slug]/products` — LINE UP product list
- `/stores/[slug]/events` — EVENT list
- `/stores/[slug]/works` — 施工事例 (works) list
- `/stores/[slug]/news` — お知らせ (news) list
- `/stores/[slug]/news/[article]` — お知らせ detail page (per article, SSG): title, category, date, image, body, prev/next links
- `/stores/[slug]/events/[event]` — EVENT detail page (SSG + client fallback): date/time, venue, parking, body blocks, visitor benefit, reservation CTA
- `/stores/[slug]/works/[work]` — 施工事例 detail page (SSG + client fallback): main photo, spec table (area / floor area / madori / price range), body blocks, floor plan, owner's voice
- `/admin` — Demo admin CMS (`noindex`, localStorage-backed, no real auth)
- `/tasks` — internal demo task tool (localStorage-backed)
- `404` — Custom not-found page

## Tech Stack

| Technology | Purpose | Why chosen |
|-----------|---------|------------|
| Next.js (App Router) | Framework | SSR/SSG for SEO; API routes as backend proxy when data/forms are added |
| TypeScript (strict) | Type safety | Catch errors early; clearer code for engineer review |
| Tailwind CSS | Styling | Fast, consistent UNSTANDARD theme via design tokens (`tailwind.config.ts`) |
| Noto Sans JP (next/font) | Japanese typography | Self-hosted, readable Japanese body/headings |
| zod | Input validation | Installed for upcoming contact/reservation forms (client + server) |
| BlockNote (`@blocknote/*`) | Rich-text editor | Block-based WYSIWYG for the demo admin's body fields; output is rendered by `components/store/ContentBlocks.tsx` |

## External Connections

| Service | Purpose | Auth method |
|---------|---------|-------------|
| (none yet) | Demo uses static seed data; WordPress migration + backend to be wired up later | — |

## Environment Variables

| Variable | Purpose | Where set |
|----------|---------|-----------|
| (none required yet) | All placeholders are commented in `.env.example`; no secrets needed for the static demo | — |

## Handover Notes (for the engineer)

This is still a **Phase 1 prototype**. Known gaps to address before any production use:

- **`/admin` has no real authentication.** The login gate is a demo: the 加盟店 role only needs a store slug and the 本部 role logs in with a single button — no password, no server check. The route is `noindex` but publicly reachable. Real auth + per-tenant authorization is required before this ships.
- **There is no database.** The demo CMS writes to `localStorage` under `unstandard-admin:*` keys, so edits live only in the browser that made them and are lost when storage is cleared. Public pages overlay that local data on top of the static seed via `lib/usePublicItems.ts`. This whole layer is intended to be replaced by a real backend (e.g. Supabase) + server-side fetching.
- **Uploaded images are stored as data URLs** inside `localStorage`, which will hit the ~5MB quota quickly. Needs object storage (e.g. Supabase Storage / Vercel Blob).
- **The contact form does not submit anywhere.** Validation is client-side zod only; there is no API route, no mail delivery, and no server-side re-validation.
- **Store content is static seed data** scraped from the legacy WordPress sites (`lib/*.ts`), and images are still hot-linked from the legacy domain — they need re-hosting.
- No automated tests and no CI yet.

## Changelog

| Date | Changes |
|------|---------|
| 2026-08-05 | Added a demo admin CMS at `/admin` (`noindex`): a two-role login gate (加盟店 / 本部), resource list + edit forms for お知らせ / イベント / 施工事例 / 商品 / お客様の声 / 私たちについて / 店舗情報, a BlockNote rich-text editor, image upload as data URLs, a 公開/非公開 toggle and a preview modal — all persisted to `localStorage` only (no DB, no real auth). Added EVENT and WORKS detail pages (`/stores/[slug]/events/[event]`, `/stores/[slug]/works/[work]`) with SSG for seed items plus a client-side fallback so admin-created items resolve too. Introduced a shared `ContentBlocks` renderer (heading / paragraph / image / image-pair) now used by news, event and works detail pages. Converted the EVENT / WORKS / NEWS / PRODUCTS lists and the store-top sections to client components that overlay admin-saved items on the static seed via the new `lib/usePublicItems.ts` hook, hiding anything marked 非公開. Extended the event and works data models (venue, parking, tags, body blocks, visitor benefit; floor plan, spec table, owner's voice). |
| 2026-06-09 | Added per-article News detail pages (`/stores/[slug]/news/[article]`, SSG) with title/category/date/image/body and prev-next navigation; the top-page and list rows now link to them (`lib/news.ts` gains a slug + body per item). Rebuilt the store-top News block as a flat, box-less list with a left-to-right underline wipe on hover, a leading date, a category pill, and a trailing arrow circle. Added scroll-driven parallax (`components/Parallax.tsx`) to the hero wordmark and the About house/family illustration (reduced-motion aware). Added a 資料請求 (document-request) mode to the contact form: a brochure picker grouped by NONDESIGN / WOODBOX series (thumbnails use the exterior render) plus optional purchase-timing and budget fields; address becomes required so materials can be mailed. Tightened the About section spacing and rebalanced the VOICE section (two-column from `lg`, centered group) to fix a tablet arrow overflow; FV catch copy switched to a white fill with a black outline and the store name/series labels under it were removed. |
| 2026-06-05 | Redesigned the store-top "私たちについて" (About) section: large headline with a hand-drawn marker loop on 「好き」, a model-house photo (`public/about-house.png`) with a line-art family illustration (`public/about-family.svg`), and refined body copy. Fixed the reservation form's participant-count labels (大人 / お子様) wrapping onto multiple lines. Earlier in this cycle: added News (お知らせ), contact/visit-reservation forms, About/EVENT/WORKS/NEWS list pages, a back-to-top button, unified black buttons with hover-invert, and a favicon. |
| 2026-06-02 | Pivoted store pages to faithfully reproduce the current per-store site composition: marquee, store header (tel/contact), hero, LINE UP, EVENT, WORKS, VOICE, contact, store footer. Sections are discrete components (modules) to support optional add-ons later. LINE UP/EVENT/WORKS use a reusable carousel (arrows + pager) matching the current design; LINE UP cards made smaller. Scraped shared LINE UP (18) and VOICE (5), per-store EVENT, and hero banners (`lib/products.ts`, `lib/voices.ts`, `lib/events.ts`, `lib/hero.ts`). Split layout into BrandShell (brand pages) and StoreShell (store sites). |
| 2026-06-02 | Enriched store profiles with FAX (11/18) and SNS links (14/18), scraped from store-page footers. Detail page contact card now shows TEL / FAX / SNS. |
| 2026-06-02 | Added 施工事例 (works) photo galleries to store detail pages. Scraped 18 unique works (15 shared 本部事例 + 3 store-specific) with images and tags from the public store pages (`lib/works.ts`). Images use `next/image` from the legacy host pending re-host. |
| 2026-06-02 | Imported real store profiles (address, phone, intro) for all 18 tenants from their public pages' structured data. Store detail pages now show a contact card with a Google Maps link. Mobile fixes (long URL/name wrapping, horizontal-overflow guard). |
| 2026-06-02 | Initial Next.js (App Router) + TypeScript + Tailwind scaffold. UNSTANDARD theme applied. Built homepage, affiliate store directory, and 18 store detail pages from the migration analysis. Migration scope fixed to the 18 "専用サイト" stores. |
