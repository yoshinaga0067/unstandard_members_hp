"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import PillLink from "@/components/store/PillLink";
import ContentBlocks from "@/components/store/ContentBlocks";
import { readPublicItems, publicId } from "@/lib/usePublicItems";
import type { Tenant, Work } from "@/types";

// Client fallback for works that only exist in this browser's demo CMS
// (newly created in the admin, so not part of the statically built pages).
export default function WorkDetailFallback({
  tenant,
  id,
  previewItem,
}: {
  tenant: Tenant;
  id: string;
  /** when set (admin preview), render this item directly instead of resolving */
  previewItem?: Work;
}) {
  const [item, setItem] = useState<Work | null | undefined>(
    previewItem ?? undefined
  );
  useEffect(() => {
    if (previewItem) {
      setItem(previewItem);
      return;
    }
    const list = readPublicItems<Work>("works", tenant.slug) ?? [];
    setItem(list.find((w) => publicId(w) === id) ?? null);
  }, [previewItem, tenant.slug, id]);

  if (item === undefined) return null; // resolving from localStorage

  if (!item) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-center text-black/55">
            この施工事例は見つかりませんでした。
          </p>
          <div className="mt-8 flex justify-center">
            <PillLink href={`/stores/${tenant.slug}/works`} back>
              施工事例一覧へ
            </PillLink>
          </div>
        </Container>
      </section>
    );
  }

  const specs = [
    item.area ? { label: "エリア", value: item.area } : null,
    item.floorArea ? { label: "延床面積", value: item.floorArea } : null,
    item.madori ? { label: "間取り", value: item.madori } : null,
    item.priceRange ? { label: "価格帯", value: item.priceRange } : null,
    item.tags.length ? { label: "タグ", value: item.tags.join("・") } : null,
  ].filter((r): r is { label: string; value: string } => r !== null);

  return (
    <article className="py-12 md:py-16">
      <Container>
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

        {item.content && item.content.length > 0 ? (
          <ContentBlocks blocks={item.content} />
        ) : (
          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-[2] text-black/80 md:text-base">
            {(item.body ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {item.ownerVoice && (
          <div className="mx-auto mt-10 max-w-2xl border-l-4 border-unstandard bg-neutral-50 px-5 py-4">
            <h2 className="text-sm font-bold text-black/60">施主の声</h2>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-[2] text-black/80">
              {item.ownerVoice}
            </p>
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-2xl justify-center">
          <PillLink href={`/stores/${tenant.slug}#contact`}>
            この事例について相談する
          </PillLink>
        </div>

        <div className="mt-12 flex justify-center">
          <PillLink href={`/stores/${tenant.slug}/works`} back>
            施工事例一覧へ
          </PillLink>
        </div>
      </Container>
    </article>
  );
}
