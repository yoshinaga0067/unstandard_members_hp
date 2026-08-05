import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import NewsDetailFallback from "@/components/store/NewsDetailFallback";
import { TENANTS, getTenant } from "@/lib/tenants";
import { NEWS, getNews } from "@/lib/news";

// Allow on-demand rendering for items created in the demo CMS (not pre-built).
export const dynamicParams = true;

// One static page per store × news article.
export function generateStaticParams() {
  return TENANTS.flatMap((t) =>
    NEWS.map((n) => ({ slug: t.slug, article: n.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}): Promise<Metadata> {
  const { slug, article } = await params;
  const tenant = getTenant(slug);
  const news = getNews(article);
  if (!tenant || !news) return { title: "お知らせ" };
  return {
    title: `${news.title}｜${tenant.shortName}`,
    description: news.body?.[0]?.slice(0, 120),
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}) {
  const { slug, article } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();
  const news = getNews(article);
  // not in the static data → it was created in the demo CMS; resolve client-side
  if (!news)
    return (
      <StoreShell tenant={tenant}>
        <NewsDetailFallback tenant={tenant} articleSlug={article} />
      </StoreShell>
    );

  // prev / next within the shared news list
  const idx = NEWS.findIndex((n) => n.slug === news.slug);
  const prev = idx > 0 ? NEWS[idx - 1] : null;
  const next = idx < NEWS.length - 1 ? NEWS[idx + 1] : null;

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
              href={`/stores/${tenant.slug}/news`}
              className="hover:text-black"
            >
              お知らせ
            </Link>
          </nav>

          {/* header: date + tag, then title */}
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <time className="font-display text-sm font-bold tracking-wide text-black/50">
                {news.date}
              </time>
              <span className="rounded-full bg-unstandard px-3 py-1 text-[11px] font-bold">
                {news.tag}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold leading-relaxed tracking-tight md:text-3xl">
              {news.title}
            </h1>
          </div>

          {/* featured image */}
          {news.image && (
            <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={news.image}
                alt={news.title}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          )}

          {/* body */}
          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-[2] text-black/80 md:text-base">
            {(news.body ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* prev / next */}
          {(prev || next) && (
            <div className="mx-auto mt-14 max-w-2xl border-t border-black/10 pt-6">
              <ul className="flex flex-col divide-y divide-black/10">
                {prev && (
                  <li>
                    <Link
                      href={`/stores/${tenant.slug}/news/${prev.slug}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="font-display text-xs font-bold tracking-wide text-black/40">
                        前の記事
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
                      href={`/stores/${tenant.slug}/news/${next.slug}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="font-display text-xs font-bold tracking-wide text-black/40">
                        次の記事
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
            <PillLink href={`/stores/${tenant.slug}/news`} back>
              お知らせ一覧へ
            </PillLink>
          </div>
        </Container>
      </article>
    </StoreShell>
  );
}
