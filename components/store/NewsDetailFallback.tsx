"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import PillLink from "@/components/store/PillLink";
import { readPublicItems } from "@/lib/usePublicItems";
import type { Tenant, NewsItem } from "@/types";

// Client fallback for news articles that only exist in this browser's demo CMS.
export default function NewsDetailFallback({
  tenant,
  articleSlug,
  previewItem,
}: {
  tenant: Tenant;
  articleSlug: string;
  /** when set (admin preview), render this item directly instead of resolving */
  previewItem?: NewsItem;
}) {
  const [item, setItem] = useState<NewsItem | null | undefined>(
    previewItem ?? undefined
  );
  useEffect(() => {
    if (previewItem) {
      setItem(previewItem);
      return;
    }
    const list = readPublicItems<NewsItem>("news", tenant.slug) ?? [];
    setItem(list.find((n) => n.slug === articleSlug) ?? null);
  }, [previewItem, tenant.slug, articleSlug]);

  if (item === undefined) return null;

  if (!item) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-center text-black/55">
            このお知らせは見つかりませんでした。
          </p>
          <div className="mt-8 flex justify-center">
            <PillLink href={`/stores/${tenant.slug}/news`} back>
              お知らせ一覧へ
            </PillLink>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <article className="py-12 md:py-16">
      <Container>
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

        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <time className="font-display text-sm font-bold tracking-wide text-black/50">
              {item.date}
            </time>
            {item.tag && (
              <span className="rounded-full bg-unstandard px-3 py-1 text-[11px] font-bold">
                {item.tag}
              </span>
            )}
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
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-[2] text-black/80 md:text-base">
          {(item.body ?? []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <PillLink href={`/stores/${tenant.slug}/news`} back>
            お知らせ一覧へ
          </PillLink>
        </div>
      </Container>
    </article>
  );
}
