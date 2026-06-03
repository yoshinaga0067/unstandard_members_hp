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
];

export default function StoreHeader({ tenant }: { tenant: Tenant }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="relative flex h-16 items-center justify-between gap-3 px-5 md:px-10">
        <Link
          href={`/${tenant.slug}`}
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

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`tel:${tenant.tel.replace(/-/g, "")}`}
            className="hidden font-display text-lg font-extrabold tracking-wide md:block"
          >
            {tenant.tel}
          </a>
          <a
            href="#contact"
            className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-rainbow-red md:text-sm"
          >
            お問い合わせ・来店予約
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="メニュー"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
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
            <div className="absolute right-5 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl md:right-10">
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
            </div>
          </>
        )}
      </div>
    </header>
  );
}
