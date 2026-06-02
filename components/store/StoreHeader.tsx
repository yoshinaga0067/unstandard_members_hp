import Link from "next/link";
import Container from "@/components/Container";
import type { Tenant } from "@/types";

export default function StoreHeader({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link href={`/${tenant.slug}`} className="min-w-0">
          <p className="truncate text-base font-extrabold md:text-lg">
            {tenant.shortName}
          </p>
          <p className="text-[10px] tracking-[0.2em] text-black/50">
            UNSTANDARD 加盟店
          </p>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${tenant.tel.replace(/-/g, "")}`}
            className="hidden text-lg font-extrabold tracking-wide sm:block"
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
      </Container>
    </header>
  );
}
