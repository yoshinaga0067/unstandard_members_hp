"use client";

import Container from "@/components/Container";
import PillLink from "./PillLink";
import NewsRow from "./NewsRow";
import { NEWS } from "@/lib/news";
import { usePublicItems } from "@/lib/usePublicItems";

// Announcement list (no boxes). Each row shows category + title + date over a
// faint divider; on hover a solid underline wipes in from the left.
// Reflects the demo CMS data (published items) saved in this browser.
export default function NewsSection({ slug }: { slug: string }) {
  const items = usePublicItems("news", slug, NEWS);
  if (items.length === 0) return null;

  return (
    <section id="news" className="scroll-mt-28 py-14 md:py-20">
      <Container>
        <div className="flex flex-col">
          <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
            News
          </h2>
          <span className="mt-2 text-sm font-bold text-black/50">お知らせ</span>
        </div>

        {/* list */}
        <ul className="mt-8 border-t border-black/10">
          {items.map((n, i) => (
            <li key={n._id ?? i}>
              <NewsRow item={n} slug={slug} />
            </li>
          ))}
        </ul>

        {/* list button — bottom right, like the reference */}
        <div className="mt-9 flex justify-end">
          <PillLink href={`/stores/${slug}/news`}>お知らせ一覧</PillLink>
        </div>
      </Container>
    </section>
  );
}
