"use client";

import { useRef, useState, type ReactNode } from "react";
import Container from "@/components/Container";

// Carousel section with a per-block background color for visual rhythm.
export default function Carousel({
  en,
  ja,
  total,
  bg = "",
  children,
}: {
  en: string;
  ja: string;
  total: number;
  /** セクション背景色（ブロックごとに変える） */
  bg?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setPage(Math.min(total, Math.max(1, Math.round(ratio * (total - 1)) + 1)));
  };

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg shadow-md ring-1 ring-black/10 transition hover:bg-black hover:text-white md:flex";

  return (
    <section className={`py-16 md:py-24 ${bg}`}>
      <Container>
        <div className="mb-9 flex items-end justify-between">
          <div className="flex items-end gap-3">
            <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
              {en}
            </h2>
            <span className="pb-1 text-sm font-bold text-black/50">{ja}</span>
          </div>
          <span className="text-sm tabular-nums text-black/40">
            {page} / {total}
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="前へ"
            className={`${arrow} -left-3`}
          >
            ‹
          </button>
          <div
            ref={ref}
            onScroll={update}
            className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {children}
          </div>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="次へ"
            className={`${arrow} -right-3`}
          >
            ›
          </button>
        </div>
      </Container>
    </section>
  );
}
