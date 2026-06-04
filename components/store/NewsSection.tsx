import Container from "@/components/Container";
import PillLink from "./PillLink";
import { NEWS } from "@/lib/news";

// Two-column announcement block: heading + list button on the left, white
// news cards on the right. Text sizes follow the rest of the site.
export default function NewsSection({ slug }: { slug: string }) {
  if (NEWS.length === 0) return null;

  return (
    <section id="news" className="scroll-mt-28 py-14 md:py-20">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-20">
          {/* left: heading + japanese label + list button */}
          <div className="flex shrink-0 flex-col gap-8 md:w-56 lg:w-64">
            <div className="flex flex-col">
              <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
                News
              </h2>
              <span className="mt-2 text-sm font-bold text-black/50">
                お知らせ
              </span>
            </div>

            {/* dark pill button with a white arrow circle */}
            <PillLink href={`/stores/${slug}/news`}>お知らせ一覧</PillLink>
          </div>

          {/* right: white news cards */}
          <ul className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5">
            {NEWS.slice(0, 3).map((n, i) => {
              const inner = (
                <>
                  <div className="flex min-w-0 flex-col gap-2">
                    <time className="font-display text-xs font-bold tracking-wide text-black/50">
                      {n.date}
                    </time>
                    <span className="text-sm font-medium text-black/80 md:text-base">
                      {n.title}
                    </span>
                  </div>
                  {/* outlined arrow circle */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/25 text-black transition group-hover:bg-black group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </>
              );
              const cardClass =
                "group flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:p-8";
              return (
                <li key={i}>
                  {n.href ? (
                    <a
                      href={n.href}
                      className={`${cardClass} transition hover:shadow-md`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cardClass}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
