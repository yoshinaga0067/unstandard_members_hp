import Link from "next/link";
import type { Work } from "@/types";

export default function WorkCard({
  work,
  href,
  external = false,
}: {
  work: Work;
  href?: string;
  /** open in a new tab (legacy external links). internal routes use next/link. */
  external?: boolean;
}) {
  const cls =
    "group flex h-full flex-col overflow-hidden rounded-xl border border-black transition duration-200 hover:-translate-y-1";

  const inner = (
    <>
      <div className="relative aspect-square overflow-hidden bg-black/5">
        {/* Image is still hosted on the legacy WordPress site; re-host on migration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.image}
          alt={work.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 min-h-[2.75em] text-sm font-bold leading-snug transition-colors group-hover:text-black/55">
          {work.title}
        </p>
        <div className="mt-2 flex min-h-[1.5rem] flex-wrap gap-1">
          {work.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-black bg-white px-2.5 py-0.5 text-[10px] font-bold text-black"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
