"use client";

import { useEffect, type ReactNode } from "react";
import WorkDetailFallback from "@/components/store/WorkDetailFallback";
import EventDetailFallback from "@/components/store/EventDetailFallback";
import NewsDetailFallback from "@/components/store/NewsDetailFallback";
import ProductCard from "@/components/store/ProductCard";
import type {
  Tenant,
  Work,
  EventItem,
  NewsItem,
  Product,
  Voice,
} from "@/types";
import type { AdminItem } from "./resources";

// Live preview of the item currently being edited (unsaved + 非公開 included).
export default function PreviewModal({
  resourceKey,
  draft,
  tenant,
  onClose,
}: {
  resourceKey: string;
  draft: AdminItem;
  tenant: Tenant;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const published = draft.published !== false;

  let body: ReactNode;
  if (resourceKey === "works") {
    body = (
      <WorkDetailFallback
        tenant={tenant}
        id=""
        previewItem={draft as unknown as Work}
      />
    );
  } else if (resourceKey === "events") {
    body = (
      <EventDetailFallback
        tenant={tenant}
        id=""
        previewItem={draft as unknown as EventItem}
      />
    );
  } else if (resourceKey === "news") {
    body = (
      <NewsDetailFallback
        tenant={tenant}
        articleSlug=""
        previewItem={draft as unknown as NewsItem}
      />
    );
  } else if (resourceKey === "products") {
    body = (
      <div className="mx-auto max-w-md px-4 py-10">
        <ProductCard product={draft as unknown as Product} />
      </div>
    );
  } else if (resourceKey === "voices") {
    const v = draft as unknown as Voice;
    const m = (v.label ?? "").match(/【(.+?)】(.*)/);
    const who = m ? m[1] : v.label ?? "";
    const product = m ? m[2].trim() : "";
    const text = (v.text ?? "").replace(/^[^|｜]*[|｜]\s*/, "");
    body = (
      <div className="mx-auto max-w-sm px-4 py-10">
        <div className="flex flex-col rounded-3xl border-2 border-black bg-unstandard p-4 text-black">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold">
              {product || "VOICE"}
            </span>
            <span className="pt-1 text-[10px] font-bold tracking-widest">
              お客様の声
            </span>
          </div>
          <div className="my-3 overflow-hidden rounded-2xl border-2 border-black bg-white">
            {v.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={v.image}
                alt={who}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/3] w-full bg-neutral-100" />
            )}
          </div>
          <div className="rounded-xl bg-white p-3">
            <p className="text-sm font-extrabold">{who || "（お名前）"}</p>
            <p className="mt-1 text-xs leading-relaxed text-black/70">{text}</p>
          </div>
        </div>
      </div>
    );
  } else {
    body = (
      <p className="py-16 text-center text-black/50">
        この項目はプレビューに対応していません。
      </p>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/50">
      {/* preview toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-extrabold">プレビュー</span>
          <span className="hidden text-xs font-bold text-black/45 sm:inline">
            公開後のイメージ（{tenant.shortName}）
          </span>
          {!published && (
            <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-bold text-black/50">
              非公開（下書き）
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-black/15 px-4 py-1.5 text-xs font-bold transition hover:border-black"
        >
          閉じる
        </button>
      </div>

      {/* framed page — links are inert so previewing never leaves the editor */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div
          className="mx-auto max-w-3xl"
          onClickCapture={(e) => {
            const a = (e.target as HTMLElement).closest("a");
            if (a) e.preventDefault();
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}
