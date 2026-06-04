import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import ProductCard from "@/components/store/ProductCard";
import { TENANTS, getTenant } from "@/lib/tenants";
import { PRODUCTS } from "@/lib/products";

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
  if (!tenant) return { title: "商品ラインナップ" };
  return { title: `商品ラインナップ｜${tenant.shortName}` };
}

export default async function ProductsPage({
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
              LINE UP
            </h1>
            <span className="pb-1 text-sm font-bold text-black/50">
              商品ラインナップ
            </span>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
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
