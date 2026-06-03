import Carousel from "./Carousel";
import EventCard from "./EventCard";
import { eventsForTenant } from "@/lib/events";
import type { Tenant } from "@/types";

export default function EventSection({ tenant }: { tenant: Tenant }) {
  const events = eventsForTenant(tenant.slug);
  if (events.length === 0) return null;

  return (
    <Carousel
      en="EVENT"
      ja="イベント情報"
      total={events.length}
      moreHref={`/stores/${tenant.slug}/events`}
    >
      {events.map((ev) => (
        <div key={ev.id} className="w-56 shrink-0 snap-start sm:w-60">
          <EventCard event={ev} slug={tenant.slug} />
        </div>
      ))}
    </Carousel>
  );
}
