"use client";

import EventCard from "./EventCard";
import { eventsForTenant } from "@/lib/events";
import { usePublicItems, publicId } from "@/lib/usePublicItems";

// Event grid that reflects the demo CMS data (published items) for this browser.
export default function EventsGridClient({ slug }: { slug: string }) {
  const events = usePublicItems("events", slug, eventsForTenant(slug));
  if (events.length === 0)
    return (
      <p className="text-black/50">現在、開催予定のイベントはありません。</p>
    );
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {events.map((ev) => (
        <EventCard
          key={publicId(ev)}
          event={ev}
          slug={slug}
          href={`/stores/${slug}/events/${publicId(ev)}`}
        />
      ))}
    </div>
  );
}
