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
- UNSTANDARD-themed responsive UI (mobile-first), Japanese typography (line-height 1.8)
- Powered by static seed data scraped from the legacy site; images still hosted on the legacy domain pending re-host. Full DB-backed migration is a later phase.

## Pages

- `/` — Homepage (hero, region finder, store pickup, CTA band)
- `/stores` — Affiliate store directory grouped by region, with anchor quick-nav
- `/stores/[slug]` — Full per-store site (18 SSG pages): hero, LINE UP, EVENT, WORKS, VOICE, contact
- `404` — Custom not-found page

## Tech Stack

| Technology | Purpose | Why chosen |
|-----------|---------|------------|
| Next.js (App Router) | Framework | SSR/SSG for SEO; API routes as backend proxy when data/forms are added |
| TypeScript (strict) | Type safety | Catch errors early; clearer code for engineer review |
| Tailwind CSS | Styling | Fast, consistent UNSTANDARD theme via design tokens (`tailwind.config.ts`) |
| Noto Sans JP (next/font) | Japanese typography | Self-hosted, readable Japanese body/headings |
| zod | Input validation | Installed for upcoming contact/reservation forms (client + server) |

## External Connections

| Service | Purpose | Auth method |
|---------|---------|-------------|
| (none yet) | Demo uses static seed data; WordPress migration + backend to be wired up later | — |

## Environment Variables

| Variable | Purpose | Where set |
|----------|---------|-----------|
| (none required yet) | All placeholders are commented in `.env.example`; no secrets needed for the static demo | — |

## Changelog

| Date | Changes |
|------|---------|
| 2026-06-02 | Pivoted store pages to faithfully reproduce the current per-store site composition: marquee, store header (tel/contact), hero, LINE UP, EVENT, WORKS, VOICE, contact, store footer. Sections are discrete components (modules) to support optional add-ons later. LINE UP/EVENT/WORKS use a reusable carousel (arrows + pager) matching the current design; LINE UP cards made smaller. Scraped shared LINE UP (18) and VOICE (5), per-store EVENT, and hero banners (`lib/products.ts`, `lib/voices.ts`, `lib/events.ts`, `lib/hero.ts`). Split layout into BrandShell (brand pages) and StoreShell (store sites). |
| 2026-06-02 | Enriched store profiles with FAX (11/18) and SNS links (14/18), scraped from store-page footers. Detail page contact card now shows TEL / FAX / SNS. |
| 2026-06-02 | Added 施工事例 (works) photo galleries to store detail pages. Scraped 18 unique works (15 shared 本部事例 + 3 store-specific) with images and tags from the public store pages (`lib/works.ts`). Images use `next/image` from the legacy host pending re-host. |
| 2026-06-02 | Imported real store profiles (address, phone, intro) for all 18 tenants from their public pages' structured data. Store detail pages now show a contact card with a Google Maps link. Mobile fixes (long URL/name wrapping, horizontal-overflow guard). |
| 2026-06-02 | Initial Next.js (App Router) + TypeScript + Tailwind scaffold. UNSTANDARD theme applied. Built homepage, affiliate store directory, and 18 store detail pages from the migration analysis. Migration scope fixed to the 18 "専用サイト" stores. |
