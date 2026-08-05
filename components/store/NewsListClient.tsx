"use client";

import NewsRow from "./NewsRow";
import { NEWS } from "@/lib/news";
import { usePublicItems } from "@/lib/usePublicItems";

// News list that reflects the demo CMS data (published items) for this browser.
export default function NewsListClient({ slug }: { slug: string }) {
  const items = usePublicItems("news", slug, NEWS);
  if (items.length === 0)
    return <p className="text-black/50">お知らせはまだありません。</p>;
  return (
    <ul className="border-t border-black/10">
      {items.map((n, i) => (
        <li key={n._id ?? i}>
          <NewsRow item={n} slug={slug} />
        </li>
      ))}
    </ul>
  );
}
