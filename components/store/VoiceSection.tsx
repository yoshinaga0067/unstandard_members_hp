"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { VOICES } from "@/lib/voices";
import { rainbowAt } from "@/lib/theme";

function parse(label: string, text: string) {
  const m = label.match(/【(.+?)】(.*)/);
  const who = m ? m[1] : label;
  const product = m ? m[2].trim() : "";
  const body = text.replace(/^[^|｜]*[|｜]\s*/, "");
  return { who, product, body };
}

export default function VoiceSection() {
  const N = VOICES.length;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [modal, setModal] = useState<number | null>(null);

  useEffect(() => {
    if (N <= 1 || hovering || modal !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % N), 4000);
    return () => clearInterval(t);
  }, [N, hovering, modal]);

  useEffect(() => {
    if (modal === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal]);

  if (N === 0) return null;
  const next = () => setActive((a) => (a + 1) % N);
  const prev = () => setActive((a) => (a - 1 + N) % N);

  return (
    <section id="voice" className="scroll-mt-28 bg-neutral-900 py-16 text-white md:py-24">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* heading */}
          <div>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-none tracking-tight md:text-7xl">
              VOICE
            </h2>
            <p className="mt-3 text-sm font-bold text-white/60">お客様の声</p>
            <p className="mt-6 font-mono text-sm tracking-widest text-unstandard">
              [ {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} ]
            </p>
            <p className="mt-6 hidden max-w-sm text-sm leading-relaxed text-white/60 md:block">
              UNSTANDARDで家を建てたお客様の声を集めました。カードをめくって、それぞれの「好き」が詰まった暮らしをのぞいてみてください。
            </p>
          </div>

          {/* card deck */}
          <div
            className="flex items-center justify-center gap-2 md:gap-4"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="前へ"
              className="relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-neutral-200 md:h-14 md:w-14"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            <div className="relative h-[430px] w-full max-w-[320px]">
              {VOICES.map((v, i) => {
                const pos = (i - active + N) % N;
                const { who, product, body } = parse(v.label, v.text);
                return (
                  <article
                    key={i}
                    onClick={() => pos === 0 && setModal(i)}
                    role={pos === 0 ? "button" : undefined}
                    tabIndex={pos === 0 ? 0 : -1}
                    onKeyDown={(e) => {
                      if (pos === 0 && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        setModal(i);
                      }
                    }}
                    className={`absolute inset-0 flex flex-col rounded-3xl border-2 border-black p-4 text-black shadow-xl ${
                      pos === 0 ? "cursor-pointer" : ""
                    }`}
                    style={{
                      backgroundColor: rainbowAt(i),
                      zIndex: N - pos,
                      opacity: pos < 4 ? 1 : 0,
                      transform: `translate(${-pos * 16}px, ${-pos * 12}px) scale(${
                        1 - pos * 0.05
                      }) rotate(${-pos * 2.5}deg)`,
                      transitionProperty: "transform, opacity",
                      transitionDuration: "500ms",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold">
                        {product || "VOICE"}
                      </span>
                      <span className="pt-1 text-[10px] font-bold tracking-widest">
                        お客様の声
                      </span>
                    </div>
                    <div className="my-3 flex-1 overflow-hidden rounded-2xl border-2 border-black bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.image}
                        alt={who}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="rounded-xl bg-white p-2.5">
                      <p className="text-sm font-extrabold">{who}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-black/70">
                        {body}
                      </p>
                      <span className="mt-1 inline-block text-[11px] font-bold underline">
                        詳しく見る →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="次へ"
              className="relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-neutral-200 md:h-14 md:w-14"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {modal !== null &&
        (() => {
          const v = VOICES[modal];
          const { who, product, body } = parse(v.label, v.text);
          return (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                aria-label="閉じる"
                onClick={() => setModal(null)}
                className="absolute inset-0 cursor-default bg-black/70"
              />
              <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white text-black shadow-2xl">
                <button
                  type="button"
                  aria-label="閉じる"
                  onClick={() => setModal(null)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/80"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
                <div className="aspect-[4/3] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.image}
                    alt={who}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <span className="inline-block rounded-full bg-unstandard px-3 py-1 text-xs font-extrabold">
                    {product || "VOICE"}
                  </span>
                  <p className="mt-4 text-lg font-extrabold">{who}</p>
                  <p className="mt-3 leading-loose text-black/80">{body}</p>
                </div>
              </div>
            </div>
          );
        })()}
    </section>
  );
}
