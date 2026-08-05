"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminItem, ResourceConfig } from "./resources";

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export interface Collection {
  items: AdminItem[];
  add: (item: AdminItem) => void;
  update: (item: AdminItem) => void;
  /** removes by id and returns the removed item + its index for undo */
  remove: (id: string) => { item: AdminItem; index: number } | undefined;
  restore: (item: AdminItem, index: number) => void;
  reset: () => void;
}

// localStorage-backed demo collection. Per-store resources key on the store
// slug; shared (本部) resources use a single global key. Seeds from the static
// site data on first use. A ref mirrors the latest items so every mutation
// works from current state (no stale closures — important for undo).
export function useResource(config: ResourceConfig, slug: string): Collection {
  const key = config.shared
    ? `unstandard-admin:${config.key}`
    : `unstandard-admin:${config.key}:${slug}`;
  const [items, setItems] = useState<AdminItem[]>([]);
  const ref = useRef<AdminItem[]>([]);

  // keep the ref in sync with rendered state
  useEffect(() => {
    ref.current = items;
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let loaded: AdminItem[] | null = null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) loaded = JSON.parse(raw) as AdminItem[];
    } catch {
      loaded = null;
    }
    if (!loaded) {
      loaded = config.seed(slug).map((it) => ({ ...it, _id: uid() }));
      try {
        window.localStorage.setItem(key, JSON.stringify(loaded));
      } catch {
        /* ignore seed write errors */
      }
    }
    // items saved before publish status existed default to 公開
    loaded = loaded.map((it) =>
      it.published === undefined ? { ...it, published: true } : it
    );
    ref.current = loaded;
    setItems(loaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // write to storage (may throw on quota), then update state + ref
  const commit = useCallback(
    (next: AdminItem[]) => {
      window.localStorage.setItem(key, JSON.stringify(next));
      ref.current = next;
      setItems(next);
    },
    [key]
  );

  const add = useCallback(
    (item: AdminItem) => commit([{ ...item, _id: uid() }, ...ref.current]),
    [commit]
  );

  const update = useCallback(
    (item: AdminItem) =>
      commit(ref.current.map((it) => (it._id === item._id ? item : it))),
    [commit]
  );

  const remove = useCallback(
    (id: string) => {
      const cur = ref.current;
      const index = cur.findIndex((it) => it._id === id);
      if (index < 0) return undefined;
      const item = cur[index];
      commit(cur.filter((it) => it._id !== id));
      return { item, index };
    },
    [commit]
  );

  const restore = useCallback(
    (item: AdminItem, index: number) => {
      const next = [...ref.current];
      next.splice(index, 0, item);
      commit(next);
    },
    [commit]
  );

  const reset = useCallback(() => {
    commit(config.seed(slug).map((it) => ({ ...it, _id: uid() })));
  }, [config, slug, commit]);

  return { items, add, update, remove, restore, reset };
}
