import Link from "next/link";
import type { Tenant } from "@/types";
import { getArea } from "@/lib/tenants";
import { worksForTenant } from "@/lib/works";

export default function TenantCard({ tenant }: { tenant: Tenant }) {
  const area = getArea(tenant.area);
  // pick a representative photo; vary by slug so cards don't all repeat
  const works = worksForTenant(tenant.slug);
  const idx = works.length
    ? [...tenant.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % works.length
    : 0;
  const photo = works[idx]?.image;

  return (
    <Link
      href={`/stores/${tenant.slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/10 transition duration-200 hover:-translate-y-1"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden bg-black/5"
        style={photo ? undefined : { backgroundColor: area.color }}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={tenant.shortName}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold">
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
      </div>
    </Link>
  );
}
