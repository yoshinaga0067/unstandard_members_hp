"use client";

import { useEffect, useState } from "react";

// Runtime shape of an item once the demo CMS has touched it.
export type Reflected<T> = T & { _id?: string; published?: boolean };

function storageKey(resourceKey: string, slug: string | null): string {
  return slug
    ? `unstandard-admin:${resourceKey}:${slug}`
    : `unstandard-admin:${resourceKey}`;
}

/**
 * Public-facing items for a resource, overlaying the demo CMS data saved in
 * this browser (localStorage) on top of the static fallback. SSR / first paint
 * shows the static fallback (good for SEO); after mount we swap in whatever the
 * admin saved and hide anything marked 非公開 (published === false).
 */
export function usePublicItems<T>(
  resourceKey: string,
  slug: string | null,
  fallback: T[]
): Reflected<T>[] {
  const [items, setItems] = useState<Reflected<T>[]>(
    fallback as Reflected<T>[]
  );
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(resourceKey, slug));
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(
          (parsed as Reflected<T>[]).filter((it) => it.published !== false)
        );
      }
    } catch {
      /* keep the static fallback */
    }
  }, [resourceKey, slug]);
  return items;
}

/** Reads a single resource's published items from localStorage (or null). */
export function readPublicItems<T>(
  resourceKey: string,
  slug: string | null
): Reflected<T>[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(resourceKey, slug));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return (parsed as Reflected<T>[]).filter((it) => it.published !== false);
  } catch {
    return null;
  }
}

/** Stable id for public detail URLs: domain id when present, else the demo _id. */
export function publicId(item: { id?: number | string; _id?: string }): string {
  return item.id != null ? String(item.id) : String(item._id ?? "");
}
