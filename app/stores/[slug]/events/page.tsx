import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import EventCard from "@/components/store/EventCard";
import { TENANTS, getTenant } from "@/lib/tenants";
import { eventsForTenant } from "@/lib/events";

export function generateStaticParams() {
  return TENANTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) return { title: "イベント情報" };
  return { title: `イベント情報｜${tenant.shortName}` };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();
  const events = eventsForTenant(tenant.slug);

  return (
    <StoreShell tenant={tenant}>
      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-10 flex items-end gap-3">
            <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
              EVENT
            </h1>
            <span className="pb-1 text-sm font-bold text-black/50">
              イベント情報
            </span>
          </div>
          {events.length === 0 ? (
            <p className="text-black/50">現在、開催予定のイベントはありません。</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} slug={tenant.slug} />
              ))}
            </div>
          )}
          <div className="mt-14 flex justify-center">
            <PillLink href={`/stores/${tenant.slug}`} back>
              トップへ
            </PillLink>
          </div>
        </Container>
      </section>
    </StoreShell>
  );
}
