"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tenant } from "@/types";

const NAV = [
  { href: "#lineup", label: "商品ラインナップ" },
  { href: "#works", label: "施工事例" },
  { href: "#events", label: "イベント" },
  { href: "#voice", label: "お客様の声" },
  { href: "#media", label: "メディア" },
  { href: "#news", label: "お知らせ" },
];

export default function StoreHeader({ tenant }: { tenant: Tenant }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="relative flex h-20 items-center justify-between gap-4 px-5 md:px-8">
        {/* left: logo + store name + update badge */}
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <Link
            href={`/stores/${tenant.slug}`}
            className="flex min-w-0 items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/unstandard-logo.svg"
              alt="UNSTANDARD"
              className="h-6 w-auto shrink-0 md:h-7"
            />
            <span className="truncate text-sm font-bold md:text-base">
              {tenant.shortName}
            </span>
          </Link>
        </div>

        {/* center: playful catchphrase + emoji + speech bubble */}
        <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 xl:flex">
          <span className="font-display text-2xl font-extrabold uppercase italic tracking-tight">
            Life is colorful!
          </span>
          <span className="text-2xl" aria-hidden>
            ✌️
          </span>
          <span className="rounded-2xl border-2 border-black px-4 py-1.5 text-xs font-bold leading-tight">
            あなたの「好き」を
            <br />
            暮らしのかたちに
          </span>
        </div>

        {/* right: phone + contact pill + menu */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`tel:${tenant.tel.replace(/-/g, "")}`}
            className="hidden flex-col items-end leading-none lg:flex"
          >
            <span className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-wide xl:text-3xl">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 xl:h-7 xl:w-7"
                fill="currentColor"
                aria-hidden
              >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.2 2.2z" />
              </svg>
              {tenant.tel}
            </span>
            <span className="mt-0.5 text-[11px] font-bold text-black/50">
              営業時間 9:00〜17:00
            </span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rainbow-red md:text-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0"
              fill="currentColor"
              aria-hidden
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 7L4.5 6.5h15L12 11zm0 2.3L4 8.3V18h16V8.3l-8 5z" />
            </svg>
            <span className="hidden sm:inline">お問い合わせ・来店予約</span>
            <span className="sm:hidden">お問い合わせ</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="メニュー"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black transition hover:bg-black hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {open && (
          <>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="absolute right-5 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl md:right-8">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 text-sm font-bold transition hover:bg-black/5"
                >
                  {n.label}
                </a>
              ))}
              <a
                href={`tel:${tenant.tel.replace(/-/g, "")}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-t border-black/10 px-5 py-3 font-display text-base font-extrabold tracking-wide"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.2 2.2z" />
                </svg>
                {tenant.tel}
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
