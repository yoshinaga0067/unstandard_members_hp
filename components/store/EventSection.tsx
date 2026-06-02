import Carousel from "./Carousel";
import { eventsForTenant } from "@/lib/events";
import type { Tenant } from "@/types";

export default function EventSection({ tenant }: { tenant: Tenant }) {
  const events = eventsForTenant(tenant.slug);
  if (events.length === 0) return null;

  return (
    <Carousel en="EVENT" ja="イベント情報" total={events.length} bg="bg-[#f5f4f1]">
      {events.map((ev) => (
        <a
          key={ev.id}
          href={`https://unstandard-members.com/${tenant.slug}/event/${ev.id}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-56 shrink-0 snap-start sm:w-60"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ev.image}
              alt={ev.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 line-clamp-2 text-sm font-bold leading-snug">
            {ev.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {ev.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-black bg-white px-2.5 py-0.5 text-[10px] font-bold text-black"
              >
                {t}
              </span>
            ))}
          </div>
        </a>
      ))}
    </Carousel>
  );
}
