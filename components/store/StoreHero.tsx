import { worksForTenant } from "@/lib/works";
import { HERO_BANNERS } from "@/lib/hero";
import type { Tenant } from "@/types";

// Full-bleed key visual: a photo collage with an overlaid catchphrase + store name.
export default function StoreHero({ tenant }: { tenant: Tenant }) {
  const photos = worksForTenant(tenant.slug)
    .map((w) => w.image)
    .filter(Boolean);
  const pool = photos.length > 0 ? photos : HERO_BANNERS;
  const main = pool[0];
  const subs = [pool[1], pool[2]].filter(Boolean);

  return (
    <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-neutral-200 md:h-[72vh]">
      <div className="flex h-full w-full gap-1.5">
        <div className="relative h-full flex-[2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={`${tenant.shortName}の施工事例`}
            className="h-full w-full object-cover"
          />
        </div>
        {subs.length > 0 && (
          <div className="hidden h-full flex-1 flex-col gap-1.5 md:flex">
            {subs.map((src, i) => (
              <div key={i} className="relative flex-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* gradient for legibility */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
        aria-hidden
      />

      {/* catchphrase */}
      <div className="absolute bottom-8 left-5 right-5 text-white md:bottom-12 md:left-10">
        <p className="mb-2 font-display text-xs font-bold tracking-[0.25em] text-white/80">
          UNSTANDARD 加盟店
        </p>
        <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight drop-shadow-md md:text-7xl">
          Life is
          <br />
          colorful.
        </h1>
        <p className="mt-3 text-sm font-bold drop-shadow md:text-lg">
          あなたの「好き」を、暮らしのかたちに。
        </p>
        <p className="mt-1 text-sm text-white/80">{tenant.shortName}</p>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 right-6 hidden items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-white/80 md:flex md:[writing-mode:vertical-rl]">
        SCROLL
        <span className="h-8 w-px bg-white/60" aria-hidden />
      </div>
    </section>
  );
}
