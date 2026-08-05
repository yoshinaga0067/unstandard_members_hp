import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import NewsListClient from "@/components/store/NewsListClient";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import { TENANTS, getTenant } from "@/lib/tenants";

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

          <NewsListClient slug={tenant.slug} />

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
