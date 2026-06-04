import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import { TENANTS, getTenant } from "@/lib/tenants";
import { NEWS } from "@/lib/news";

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
  if (!tenant) return { title: "お知らせ" };
  return { title: `お知らせ｜${tenant.shortName}` };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-10 flex items-end gap-3">
            <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
              NEWS
            </h1>
            <span className="pb-1 text-sm font-bold text-black/50">お知らせ</span>
          </div>

          <ul className="divide-y divide-black/10 border-y border-black/10">
            {NEWS.map((n, i) => {
              const row = (
                <div className="flex items-center gap-4 py-5">
                  {/* leading square thumbnail */}
                  {n.image && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {/* date / tag / caption — all share the same left edge */}
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <time className="font-display text-xs font-bold tracking-wide text-black/50">
                      {n.date}
                    </time>
                    <span className="w-fit rounded-full bg-unstandard px-2.5 py-0.5 text-[11px] font-bold">
                      {n.tag}
                    </span>
                    <span className="text-sm font-medium text-black/80 md:text-base">
                      {n.title}
                    </span>
                  </div>
                </div>
              );
              return (
                <li key={i}>
                  {n.href ? (
                    <a href={n.href} className="block transition hover:opacity-60">
                      {row}
                    </a>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>

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
