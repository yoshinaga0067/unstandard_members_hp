import type { EventItem } from "@/types";

export default function EventCard({
  event,
  slug,
}: {
  event: EventItem;
  slug: string;
}) {
  return (
    <a
      href={`https://unstandard-members.com/${slug}/event/${event.id}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block transition duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-black bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-black/55">
        {event.title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {event.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            className="rounded-full border border-black bg-white px-2.5 py-0.5 text-[10px] font-bold text-black"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}
