import Link from "next/link";
import type { NewsItem } from "@/types";

// Shared news list row used on both the store top page and the news list page:
// date + category + title + arrow, with a left-to-right underline wipe on hover.
export default function NewsRow({
  item,
  slug,
}: {
  item: NewsItem;
  slug: string;
}) {
  return (
    <Link
      href={item.href ?? `/stores/${slug}/news/${item.slug}`}
      className="group relative flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/10 py-5 after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-black after:transition-transform after:duration-700 after:[transition-timing-function:cubic-bezier(.19,1,.22,1)] hover:after:origin-left hover:after:scale-x-100 md:py-6"
    >
      {/* date */}
      <time className="order-1 shrink-0 font-display text-xs font-bold tracking-wide text-black/45">
        {item.date}
      </time>
      {/* category */}
      <span className="order-2 shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold tracking-wide text-black/70">
        {item.tag}
      </span>
      {/* title */}
      <span className="order-4 w-full text-sm font-medium leading-relaxed text-black/80 transition-colors group-hover:text-black md:order-3 md:w-auto md:flex-1 md:text-base">
        {item.title}
      </span>
      {/* arrow circle — fills black on hover */}
      <span className="order-3 ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/25 text-black transition duration-300 group-hover:translate-x-0.5 group-hover:border-black group-hover:bg-black group-hover:text-white md:order-4">
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
    </Link>
  );
}
