"use client";

import Container from "@/components/Container";
import SectionHeading from "./SectionHeading";
import PillLink from "./PillLink";
import EventCard from "./EventCard";
import { eventsForTenant } from "@/lib/events";
import { usePublicItems, publicId } from "@/lib/usePublicItems";
import type { Tenant } from "@/types";

export default function EventSection({ tenant }: { tenant: Tenant }) {
  const events = usePublicItems(
    "events",
    tenant.slug,
    eventsForTenant(tenant.slug)
  ).slice(0, 4);
  if (events.length === 0) return null;

  return (
    <section id="events" className="scroll-mt-28 py-12 md:py-16">
      <Container>
        <SectionHeading en="EVENT" ja="イベント情報" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {events.map((ev) => (
            <EventCard
              key={publicId(ev)}
              event={ev}
              slug={tenant.slug}
              href={`/stores/${tenant.slug}/events/${publicId(ev)}`}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <PillLink href={`/stores/${tenant.slug}/events`}>
            イベント一覧を見る
          </PillLink>
        </div>
      </Container>
    </section>
  );
}
