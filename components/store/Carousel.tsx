"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import Container from "@/components/Container";

// Horizontal carousel with heading + pager + side arrows.
// When there are enough items it loops seamlessly (renders 3 copies and
// silently re-centers after the scroll settles).
export default function Carousel({
  en,
  ja,
  total,
  panel = false,
  moreHref,
  children,
}: {
  en: string;
  ja: string;
  total: number;
  panel?: boolean;
  moreHref?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const [page, setPage] = useState(1);
  const [inView, setInView] = useState(false);

  // reveal the cards (staggered, left → right) when the section scrolls into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealCloned = (
    el: ReactNode,
    key: string | number,
    idx: number,
  ): ReactNode => {
    if (!isValidElement(el)) return el;
    const p = el.props as { className?: string; style?: CSSProperties };
    return cloneElement(
      el as ReactElement<{ className?: string; style?: CSSProperties }>,
      {
        key,
        className: `${p.className ?? ""} transition-all duration-500 ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-100 ${
          inView ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
        }`,
        style: {
          ...(p.style ?? {}),
          transitionDelay: `${Math.min(idx, 12) * 60}ms`,
        },
      },
    );
  };

  const items = Children.toArray(children);
  const loop = items.length >= 6;
  const rendered = loop
    ? [0, 1, 2].flatMap((copy) =>
        items.map((el, i) => revealCloned(el, `${copy}-${i}`, i)),
      )
    : items.map((el, i) => revealCloned(el, i, i));

  // start centered on the middle copy so it can scroll both ways
  useEffect(() => {
    if (!loop) return;
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth / 3;
  }, [loop]);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    if (loop) {
      const third = el.scrollWidth / 3;
      const rel = ((el.scrollLeft % third) + third) % third;
      const idx = Math.round(rel / (third / total));
      setPage(((idx % total) + total) % total + 1);
      if (wrapTimer.current) clearTimeout(wrapTimer.current);
      wrapTimer.current = setTimeout(() => {
        const e = ref.current;
        if (!e) return;
        const t = e.scrollWidth / 3;
        if (e.scrollLeft < t * 0.5) e.scrollLeft += t;
        else if (e.scrollLeft >= t * 1.5) e.scrollLeft -= t;
      }, 120);
    } else {
      const max = el.scrollWidth - el.clientWidth;
      const ratio = max > 0 ? el.scrollLeft / max : 0;
      setPage(Math.min(total, Math.max(1, Math.round(ratio * (total - 1)) + 1)));
    }
  };

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const sizeCls = panel
    ? "h-12 w-12 md:h-14 md:w-14"
    : "h-10 w-10 md:h-12 md:w-12";
  const btnBase = `z-10 flex items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-black/80 ${sizeCls}`;

  const ArrowBtn = ({ dir, pos }: { dir: number; pos: string }) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={dir < 0 ? "前へ" : "次へ"}
      className={`absolute ${pos} ${btnBase}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={panel ? "h-6 w-6" : "h-5 w-5"}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );

  const heading = (
    <div
      className={`mb-8 flex items-end justify-between ${
        panel ? "border-b border-black/10 pb-5" : ""
      }`}
    >
      <div className="flex items-end gap-3">
        <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
          {en}
        </h2>
        <span className="pb-0.5 text-sm font-bold text-black/50">{ja}</span>
      </div>
      <span className="text-sm tabular-nums text-black/50">
        {page}/{total}
      </span>
    </div>
  );

  const scrollRow = (
    <div
      ref={ref}
      onScroll={update}
      className="flex snap-x gap-6 overflow-x-auto px-1 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {rendered}
    </div>
  );

  const more = moreHref ? (
    <div className="mt-8 flex justify-center">
      <Link
        href={moreHref}
        className="inline-flex items-center gap-2 rounded-full border border-black px-7 py-3 text-sm font-bold transition hover:bg-black hover:text-white"
      >
        一覧を見る<span aria-hidden>→</span>
      </Link>
    </div>
  ) : null;

  if (panel) {
    return (
      <section ref={rootRef} className="bg-neutral-100 py-10 md:py-14">
        <Container>
          <div className="relative rounded-3xl border border-black bg-white p-5 md:p-10">
            {heading}
            {scrollRow}
            <ArrowBtn
              dir={-1}
              pos="left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <ArrowBtn
              dir={1}
              pos="right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
            />
          </div>
          {more}
        </Container>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="py-12 md:py-16">
      <Container>
        {heading}
        <div className="relative">
          <ArrowBtn
            dir={-1}
            pos="left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          {scrollRow}
          <ArrowBtn
            dir={1}
            pos="right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {more}
      </Container>
    </section>
  );
}
