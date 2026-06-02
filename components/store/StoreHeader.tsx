import Link from "next/link";
import type { Tenant } from "@/types";

export default function StoreHeader({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="flex h-16 items-center justify-between gap-3 px-5 md:px-10">
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
        <div className="flex shrink-0 items-center gap-4">
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
        </div>
      </div>
    </header>
  );
}
