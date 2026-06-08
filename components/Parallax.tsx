"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-driven parallax wrapper. Translates its children vertically based on
 * the element's position in the viewport, so it drifts at a different speed
 * than the page scroll. Performance-friendly: updates are gated by an
 * IntersectionObserver (only while on screen) and batched with rAF.
 * Disabled automatically when the user prefers reduced motion.
 */
export default function Parallax({
  distance = 80,
  className = "",
  children,
}: {
  // Total vertical drift (px) across the whole time the element is on screen.
  // Bigger = more obvious. ~60 (gentle) … ~160 (bold).
  distance?: number;
  className?: string;
  children: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = wrap.current;
    const target = inner.current;
    if (!outer || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = false;

    const apply = () => {
      raf = 0;
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // progress: 0 when the element is just entering at the bottom,
      // 1 when it has just left at the top. Stable regardless of size.
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      // drift from +distance/2 (entering) to -distance/2 (leaving)
      const offset = (0.5 - clamped) * distance;
      target.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(apply);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(apply);
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(outer);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    apply();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [distance]);

  return (
    <div ref={wrap} className={className}>
      <div ref={inner} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
