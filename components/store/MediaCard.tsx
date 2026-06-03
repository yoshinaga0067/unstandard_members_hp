"use client";

import { useState } from "react";
import type { MediaItem } from "@/types";

export default function MediaCard({ m }: { m: MediaItem }) {
  const [hover, setHover] = useState(false);
  const [rot, setRot] = useState(0);

  const on = () => {
    setHover(true);
    setRot(Math.random() * 12 - 6); // random tilt -6°..+6°
  };
  const off = () => {
    setHover(false);
    setRot(0);
  };

  return (
    <a
      href={m.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={on}
      onMouseLeave={off}
      onFocus={on}
      onBlur={off}
    >
      <div
        className="relative aspect-square transition-transform duration-300 ease-out"
        style={{
          transform: `rotate(${rot}deg) translateY(${hover ? -8 : 0}px) scale(${
            hover ? 1.05 : 1
          })`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.image}
            alt={m.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300"
          style={{ opacity: hover ? 1 : 0 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="7"
            ry="7"
            fill="none"
            stroke="#fff"
            strokeWidth="0.4"
            strokeDasharray="4 3"
            className={hover ? "[animation:dash-march_1.6s_linear_infinite]" : ""}
          />
        </svg>
      </div>
      <p className="mt-3 font-mono text-[11px] text-black/50 md:text-xs">
        {m.date}
      </p>
      <p className="mt-1 line-clamp-2 text-xs font-bold leading-snug transition-colors group-hover:text-black/55 md:text-sm">
        {m.title}
      </p>
    </a>
  );
}
