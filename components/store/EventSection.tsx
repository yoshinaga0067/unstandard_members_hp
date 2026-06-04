import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "./SectionHeading";
import EventCard from "./EventCard";
import { eventsForTenant } from "@/lib/events";
import type { Tenant } from "@/types";

export default function EventSection({ tenant }: { tenant: Tenant }) {
  const events = eventsForTenant(tenant.slug).slice(0, 4);
  if (events.length === 0) return null;

  return (
    <section id="events" className="scroll-mt-28 py-12 md:py-16">
      <Container>
        <SectionHeading en="EVENT" ja="イベント情報" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} slug={tenant.slug} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href={`/stores/${tenant.slug}/events`}
            className="inline-flex items-center gap-2 rounded-full border border-black px-7 py-3 text-sm font-bold transition hover:bg-black hover:text-white"
          >
            イベント一覧を見る<span aria-hidden>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
