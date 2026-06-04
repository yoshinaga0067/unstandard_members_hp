"use client";

import { useEffect, useState } from "react";
import { worksForTenant } from "@/lib/works";
import { HERO_BANNERS } from "@/lib/hero";
import type { Tenant } from "@/types";

// doda-style hero carousel: a large centered square slide with peeking
// neighbors, side arrows, a colour-shifting background, and a giant wordmark.
// Loops infinitely by rendering 3 copies and silently re-centering.
// Slide size is the smaller of 74vw / 58vh so the hero always fits the screen.
const SLIDE_SIZE = "min(74vw, 58vh)";
const GAP = "1rem";

// Background cycles through the LIFE IS COLORFUL palette as slides change.
const BG_COLORS = [
  "#ed1c24",
  "#8cc63f",
  "#91c2e1",
  "#ea5c52",
  "#f6dc30",
  "#a4d2de",
];

export default function StoreHero({ tenant }: { tenant: Tenant }) {
  const works = worksForTenant(tenant.slug).slice(0, 6);
  const slides =
    works.length > 0
      ? works.map((w) => ({ image: w.image, title: w.title, tags: w.tags }))
      : HERO_BANNERS.map((image) => ({
          image,
          title: `${tenant.shortName}の家づくり`,
          tags: ["施工事例"],
        }));

  const n = slides.length;
  const loop = [...slides, ...slides, ...slides]; // 3 copies for seamless loop

  // index starts in the middle copy so it can move both ways
  const [index, setIndex] = useState(n);
  const [anim, setAnim] = useState(true);
  const realIndex = ((index % n) + n) % n;

  const go = (dir: number) => {
    setAnim(true);
    setIndex((i) => i + dir);
  };

  // autoplay
  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      setAnim(true);
      setIndex((i) => i + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [n]);

  // silently re-center once we drift out of the middle copy
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (index >= 2 * n) {
      setAnim(false);
      setIndex(index - n);
    } else if (index < n) {
      setAnim(false);
      setIndex(index + n);
    }
  };

  return (
    <section
      className="relative overflow-hidden pt-6 transition-colors duration-700 ease-out md:pt-8"
      style={{ backgroundColor: BG_COLORS[realIndex % BG_COLORS.length] }}
    >
      {/* slide track */}
      <div className="relative">
        <div
          className={`flex ${anim ? "transition-transform duration-700 ease-out" : ""}`}
          style={{
            gap: GAP,
            transform: `translateX(calc(50% - (${SLIDE_SIZE} / 2) - (${index} * (${SLIDE_SIZE} + ${GAP}))))`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loop.map((s, i) => (
            <div key={i} className="shrink-0" style={{ width: SLIDE_SIZE }}>
              <div
                className={`relative aspect-square origin-center overflow-hidden rounded-xl border-2 border-black transition-all duration-500 ${
                  i === index
                    ? "scale-100 opacity-100"
                    : "scale-[0.8] opacity-60"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
                {/* caption — kept near the top so it never clashes with the wordmark */}
                <div className="absolute left-4 top-4 right-4 md:left-6 md:top-6">
                  <p className="inline bg-white/85 px-3 py-1.5 text-sm font-bold leading-relaxed text-black [box-decoration-break:clone] md:text-lg">
                    {s.title}
                  </p>
                  <p className="mt-2 text-xs font-bold text-white drop-shadow md:text-sm">
                    {tenant.shortName}
                  </p>
                  <p className="text-[11px] text-white/80 drop-shadow md:text-xs">
                    {s.tags.join("・")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="前へ"
          style={{ left: `calc(50% - (${SLIDE_SIZE} / 2))` }}
          className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-neutral-100 md:h-12 md:w-12"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="次へ"
          style={{ left: `calc(50% + (${SLIDE_SIZE} / 2))` }}
          className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-neutral-100 md:h-12 md:w-12"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* giant wordmark across the bottom — sits in front of the images */}
      <div
        className="pointer-events-none relative z-20 -mt-[3vw] w-full select-none whitespace-nowrap text-center font-display font-extrabold uppercase leading-none tracking-tighter text-black"
        style={{ fontSize: "9.2vw" }}
        aria-hidden
      >
        LIFE IS COLORFUL.
      </div>

      {/* dots */}
      <div className="mt-5 flex justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setAnim(true);
              setIndex(n + i);
            }}
            aria-label={`${i + 1}枚目へ`}
            className={`h-2.5 rounded-full border border-black transition-all ${
              i === realIndex ? "w-6 bg-neutral-600" : "w-2.5 bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
