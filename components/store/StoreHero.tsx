import { HERO_BANNERS } from "@/lib/hero";

// Swipeable hero (scroll-snap), no JS. Banners are shared promo key visuals.
export default function StoreHero() {
  return (
    <section className="bg-black/5">
      <div className="flex snap-x snap-mandatory overflow-x-auto">
        {HERO_BANNERS.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[1024/541] w-full shrink-0 snap-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
