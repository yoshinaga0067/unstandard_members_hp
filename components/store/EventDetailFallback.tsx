"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import PillLink from "@/components/store/PillLink";
import ContentBlocks from "@/components/store/ContentBlocks";
import { readPublicItems, publicId } from "@/lib/usePublicItems";
import type { Tenant, EventItem } from "@/types";

// Client fallback for events that only exist in this browser's demo CMS.
export default function EventDetailFallback({
  tenant,
  id,
  previewItem,
}: {
  tenant: Tenant;
  id: string;
  /** when set (admin preview), render this item directly instead of resolving */
  previewItem?: EventItem;
}) {
  const [item, setItem] = useState<EventItem | null | undefined>(
    previewItem ?? undefined
  );
  useEffect(() => {
    if (previewItem) {
      setItem(previewItem);
      return;
    }
    const list = readPublicItems<EventItem>("events", tenant.slug) ?? [];
    setItem(list.find((e) => publicId(e) === id) ?? null);
  }, [previewItem, tenant.slug, id]);

  if (item === undefined) return null;

  if (!item) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-center text-black/55">
            このイベントは見つかりませんでした。
          </p>
          <div className="mt-8 flex justify-center">
            <PillLink href={`/stores/${tenant.slug}/events`} back>
              イベント一覧へ
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
            href={`/stores/${tenant.slug}/events`}
            className="hover:text-black"
          >
            イベント情報
          </Link>
        </nav>

        <div className="mx-auto max-w-2xl">
          {(item.date || item.time || item.place || item.address || item.parking) && (
            <div className="space-y-1 text-sm font-bold text-black/50">
              {(item.date || item.time) && (
                <div className="flex flex-wrap items-center gap-x-3">
                  {item.date && (
                    <time className="font-display tracking-wide">{item.date}</time>
                  )}
                  {item.time && <span>{item.time}</span>}
                </div>
              )}
              {item.place && <p>会場：{item.place}</p>}
              {item.address && (
                <p className="font-medium text-black/45">住所：{item.address}</p>
              )}
              {item.parking && (
                <p className="font-medium text-black/45">駐車場：{item.parking}</p>
              )}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
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
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
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

        {item.benefit && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-black/10 bg-unstandard/20 px-5 py-4">
            <h2 className="text-sm font-extrabold">来場特典</h2>
            <p className="mt-1.5 whitespace-pre-line text-[15px] leading-[1.9] text-black/80">
              {item.benefit}
            </p>
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-2xl justify-center">
          <PillLink href={`/stores/${tenant.slug}#contact`}>
            このイベントを予約する
          </PillLink>
        </div>

        <div className="mt-12 flex justify-center">
          <PillLink href={`/stores/${tenant.slug}/events`} back>
            イベント一覧へ
          </PillLink>
        </div>
      </Container>
    </article>
  );
}
