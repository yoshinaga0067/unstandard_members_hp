import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import ContentBlocks from "@/components/store/ContentBlocks";
import EventDetailFallback from "@/components/store/EventDetailFallback";
import { TENANTS, getTenant } from "@/lib/tenants";
import { eventsForTenant, getEvent } from "@/lib/events";

// Allow on-demand rendering for items created in the demo CMS (not pre-built).
export const dynamicParams = true;

// One static page per store × event.
export function generateStaticParams() {
  return TENANTS.flatMap((t) =>
    eventsForTenant(t.slug).map((e) => ({ slug: t.slug, event: String(e.id) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; event: string }>;
}): Promise<Metadata> {
  const { slug, event } = await params;
  const tenant = getTenant(slug);
  const ev = getEvent(slug, Number(event));
  if (!tenant || !ev) return { title: "イベント情報" };
  return {
    title: `${ev.title}｜${tenant.shortName}`,
    description: ev.body?.[0]?.slice(0, 120),
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string; event: string }>;
}) {
  const { slug, event } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();
  const ev = getEvent(slug, Number(event));
  // not in the static data → it was created in the demo CMS; resolve client-side
  if (!ev)
    return (
      <StoreShell tenant={tenant}>
        <EventDetailFallback tenant={tenant} id={event} />
      </StoreShell>
    );

  // prev / next within this store's event list
  const list = eventsForTenant(slug);
  const idx = list.findIndex((e) => e.id === ev.id);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;

  // fall back to a friendly default when no body has been written yet
  const body = ev.body?.length
    ? ev.body
    : [
        "このイベントの詳細をご案内します。家づくりのご相談や、暮らしのイメージづくりに、ぜひお役立てください。",
        "ご予約優先での開催となります。お問い合わせフォーム、またはお電話にてお気軽にお申し込みください。スタッフ一同、皆さまのご来場を心よりお待ちしております。",
      ];

  return (
    <StoreShell tenant={tenant}>
      <article className="py-12 md:py-16">
        <Container>
          {/* breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-bold text-black/40">
            <Link href={`/stores/${tenant.slug}`} className="hover:text-black">
              トップ
            </Link>
            <span>/</span>
            <Link
              href={`/stores/${tenant.slug}/events`}
              className="hover:text-black"
            >
              イベント情報
            </Link>
          </nav>

          {/* header: date / time / place, tags, title */}
          <div className="mx-auto max-w-2xl">
            {(ev.date || ev.time || ev.place || ev.address || ev.parking) && (
              <div className="space-y-1 text-sm font-bold text-black/50">
                {(ev.date || ev.time) && (
                  <div className="flex flex-wrap items-center gap-x-3">
                    {ev.date && (
                      <time className="font-display tracking-wide">{ev.date}</time>
                    )}
                    {ev.time && <span>{ev.time}</span>}
                  </div>
                )}
                {ev.place && <p>会場：{ev.place}</p>}
                {ev.address && (
                  <p className="font-medium text-black/45">住所：{ev.address}</p>
                )}
                {ev.parking && (
                  <p className="font-medium text-black/45">駐車場：{ev.parking}</p>
                )}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ev.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-unstandard px-3 py-1 text-[11px] font-bold"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold leading-relaxed tracking-tight md:text-3xl">
              {ev.title}
            </h1>
          </div>

          {/* featured image */}
          {ev.image && (
            <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ev.image}
                alt={ev.title}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          )}

          {/* body — note-style content blocks, or the legacy fallback */}
          {ev.content && ev.content.length > 0 ? (
            <ContentBlocks blocks={ev.content} />
          ) : (
            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-[2] text-black/80 md:text-base">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {/* visitor benefit */}
          {ev.benefit && (
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-black/10 bg-unstandard/20 px-5 py-4">
              <h2 className="text-sm font-extrabold">来場特典</h2>
              <p className="mt-1.5 whitespace-pre-line text-[15px] leading-[1.9] text-black/80">
                {ev.benefit}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mx-auto mt-10 flex max-w-2xl justify-center">
            <PillLink href={`/stores/${tenant.slug}#contact`}>
              このイベントを予約する
            </PillLink>
          </div>

          {/* prev / next */}
          {(prev || next) && (
            <div className="mx-auto mt-14 max-w-2xl border-t border-black/10 pt-6">
              <ul className="flex flex-col divide-y divide-black/10">
                {prev && (
                  <li>
                    <Link
                      href={`/stores/${tenant.slug}/events/${prev.id}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="font-display text-xs font-bold tracking-wide text-black/40">
                        前のイベント
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-black/80 transition-colors group-hover:text-black">
                        {prev.title}
                      </span>
                    </Link>
                  </li>
                )}
                {next && (
                  <li>
                    <Link
                      href={`/stores/${tenant.slug}/events/${next.id}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="font-display text-xs font-bold tracking-wide text-black/40">
                        次のイベント
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-black/80 transition-colors group-hover:text-black">
                        {next.title}
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* back to list */}
          <div className="mt-12 flex justify-center">
            <PillLink href={`/stores/${tenant.slug}/events`} back>
              イベント一覧へ
            </PillLink>
          </div>
        </Container>
      </article>
    </StoreShell>
  );
}
