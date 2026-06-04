import Container from "@/components/Container";
import { NEWS } from "@/lib/news";

// Compact announcement band placed right under the hero — kept intentionally small.
export default function NewsSection({ slug }: { slug: string }) {
  if (NEWS.length === 0) return null;

  return (
    <section id="news" className="scroll-mt-28 py-6 md:py-8">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:gap-16 lg:gap-24">
          {/* label */}
          <div className="flex shrink-0 flex-col gap-2 md:gap-3">
            <div className="flex items-baseline gap-2 md:flex-col md:gap-0.5">
              <span className="font-display text-xl font-extrabold uppercase leading-none tracking-tight md:text-2xl">
                News
              </span>
              <span className="text-xs font-bold text-black/50">お知らせ</span>
            </div>
            {/* list link — chevron circle matching the carousel arrow buttons */}
            <a
              href={`/stores/${slug}/news`}
              className="group inline-flex items-center gap-2 self-start"
            >
              <span className="relative text-xs font-bold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                お知らせ一覧へ
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-md transition group-hover:bg-black/80">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </div>

          {/* items */}
          <div className="min-w-0 flex-1">
          <ul className="divide-y divide-black/5">
            {NEWS.slice(0, 2).map((n, i) => {
              const row = (
                <div className="flex items-center gap-4 py-3">
                  {/* leading square thumbnail */}
                  {n.image && (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {/* date / tag / caption — all share the same left edge */}
                  <div className="flex min-w-0 flex-col gap-1">
                    <time className="font-display text-xs font-bold tracking-wide text-black/50">
                      {n.date}
                    </time>
                    <span className="w-fit rounded-full bg-unstandard px-2.5 py-0.5 text-[11px] font-bold">
                      {n.tag}
                    </span>
                    <span className="truncate text-sm font-medium text-black/80">
                      {n.title}
                    </span>
                  </div>
                </div>
              );
              return (
                <li key={i}>
                  {n.href ? (
                    <a href={n.href} className="block transition hover:opacity-60">
                      {row}
                    </a>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
