import Link from "next/link";
import type { Tenant } from "@/types";
import { getArea } from "@/lib/tenants";

export default function TenantCard({ tenant }: { tenant: Tenant }) {
  const area = getArea(tenant.area);
  return (
    <Link
      href={`/stores/${tenant.slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/10 transition hover:-translate-y-1"
    >
      {/* Colored band stands in for the store photo until real images are migrated */}
      <div
        className="flex h-24 items-end p-3"
        style={{ backgroundColor: area.color }}
      >
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold">
          {area.name}
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-bold leading-snug transition-colors group-hover:text-black/55 md:text-base">
          {tenant.shortName}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-black/50">
          {tenant.prefecture}
          {tenant.city}
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-black/70 transition group-hover:translate-x-1 group-hover:text-black">
          もっと見る →
        </span>
      </div>
    </Link>
  );
}
