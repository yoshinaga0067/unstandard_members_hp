import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import ContentBlocks from "@/components/store/ContentBlocks";
import WorkDetailFallback from "@/components/store/WorkDetailFallback";
import { TENANTS, getTenant } from "@/lib/tenants";
import { worksForTenant, getWork } from "@/lib/works";

// Allow on-demand rendering for items created in the demo CMS (not pre-built).
export const dynamicParams = true;

// One static page per store × work shown in that store's list.
export function generateStaticParams() {
  return TENANTS.flatMap((t) =>
    worksForTenant(t.slug).map((w) => ({ slug: t.slug, work: String(w.id) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; work: string }>;
}): Promise<Metadata> {
  const { slug, work } = await params;
  const tenant = getTenant(slug);
  const item = getWork(Number(work));
  if (!tenant || !item) return { title: "施工事例" };
  return {
    title: `${item.title}｜${tenant.shortName}`,
    description: item.body?.[0]?.slice(0, 120),
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string; work: string }>;
}) {
  const { slug, work } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();
  const item = getWork(Number(work));
  // not in the static data → it was created in the demo CMS; resolve client-side
  if (!item)
    return (
      <StoreShell tenant={tenant}>
        <WorkDetailFallback tenant={tenant} id={work} />
      </StoreShell>
    );

  // prev / next within this store's works list
  const list = worksForTenant(slug);
  const idx = list.findIndex((w) => w.id === item.id);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;

  // spec rows (only those that are set)
  const specs = [
    item.area ? { label: "エリア", value: item.area } : null,
    item.floorArea ? { label: "延床面積", value: item.floorArea } : null,
    item.madori ? { label: "間取り", value: item.madori } : null,
    item.priceRange ? { label: "価格帯", value: item.priceRange } : null,
    item.tags.length ? { label: "タグ", value: item.tags.join("・") } : null,
  ].filter((r): r is { label: string; value: string } => r !== null);

  // fall back to a friendly default when no body has been written yet
  const body = item.body?.length
    ? item.body
    : [
        "この施工事例の詳細をご紹介します。間取りやデザイン、素材選びのこだわりなど、家づくりのヒントが詰まったお住まいです。",
        "同じように「好き」を大切にした家づくりにご興味のある方は、お気軽にお問い合わせください。実際の住み心地やプランのご相談も承っています。",
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
              href={`/stores/${tenant.slug}/works`}
              className="hover:text-black"
            >
              施工事例
            </Link>
          </nav>

          {/* header: tags, title */}
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-unstandard px-3 py-1 text-[11px] font-bold"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold leading-relaxed tracking-tight md:text-3xl">
              {item.title}
            </h1>
          </div>

          {/* featured image */}
          {item.image && (
            <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          )}

          {/* floor plan (contain so the drawing is never cropped) */}
          {item.floorPlan && (
            <div className="mx-auto mt-8 max-w-2xl">
              <h2 className="mb-2 text-sm font-bold text-black/60">間取り図</h2>
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.floorPlan}
                  alt={`${item.title} の間取り図`}
                  className="max-h-[520px] w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* spec table */}
          {specs.length > 0 && (
            <dl className="mx-auto mt-8 max-w-2xl divide-y divide-black/10 border-y border-black/10">
              {specs.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6"
                >
                  <dt className="shrink-0 text-sm font-bold sm:w-28">
                    {row.label}
                  </dt>
                  <dd className="text-sm text-black/80">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* body — note-style content blocks, or the legacy fallback */}
          {item.content && item.content.length > 0 ? (
            <ContentBlocks blocks={item.content} />
          ) : (
            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-[2] text-black/80 md:text-base">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {/* owner's voice */}
          {item.ownerVoice && (
            <div className="mx-auto mt-10 max-w-2xl border-l-4 border-unstandard bg-neutral-50 px-5 py-4">
              <h2 className="text-sm font-bold text-black/60">施主の声</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-[2] text-black/80">
                {item.ownerVoice}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mx-auto mt-10 flex max-w-2xl justify-center">
            <PillLink href={`/stores/${tenant.slug}#contact`}>
              この事例について相談する
            </PillLink>
          </div>

          {/* prev / next */}
          {(prev || next) && (
            <div className="mx-auto mt-14 max-w-2xl border-t border-black/10 pt-6">
              <ul className="flex flex-col divide-y divide-black/10">
                {prev && (
                  <li>
                    <Link
                      href={`/stores/${tenant.slug}/works/${prev.id}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="font-display text-xs font-bold tracking-wide text-black/40">
                        前の事例
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
                      href={`/stores/${tenant.slug}/works/${next.id}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="font-display text-xs font-bold tracking-wide text-black/40">
                        次の事例
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
            <PillLink href={`/stores/${tenant.slug}/works`} back>
              施工事例一覧へ
            </PillLink>
          </div>
        </Container>
      </article>
    </StoreShell>
  );
}
