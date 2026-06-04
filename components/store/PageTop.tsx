"use client";

import { useEffect, useState } from "react";

// Floating "PAGE TOP" button: circular rotating text + up arrow.
// Slides in from the right once the user scrolls past the first screen.
export default function PageTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="ページの先頭へ戻る"
      className={`fixed bottom-6 right-6 z-50 h-24 w-24 mix-blend-difference transition-all duration-500 md:bottom-8 md:right-8 ${
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-6 opacity-0"
      }`}
    >
      {/* rotating circular text */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full animate-[spin_12s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path
            id="pagetop-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          />
        </defs>
        <text className="fill-white font-display text-[12px] font-extrabold uppercase">
          {/* textLength = circle circumference (2·π·38) so glyphs spread evenly */}
          <textPath
            href="#pagetop-circle"
            startOffset="0"
            textLength="238.76"
            lengthAdjust="spacing"
          >
            PAGETOP・PAGETOP・PAGETOP・
          </textPath>
        </text>
      </svg>

      {/* center up arrow */}
      <svg
        viewBox="0 0 24 24"
        className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
