"use client";

import WorkCard from "@/components/WorkCard";
import { worksForTenant } from "@/lib/works";
import { usePublicItems, publicId } from "@/lib/usePublicItems";

// Works grid that reflects the demo CMS data (published items) for this browser.
export default function WorksGridClient({ slug }: { slug: string }) {
  const works = usePublicItems("works", slug, worksForTenant(slug));
  if (works.length === 0)
    return <p className="text-black/50">施工事例はまだありません。</p>;
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {works.map((work) => (
        <WorkCard
          key={publicId(work)}
          work={work}
          href={`/stores/${slug}/works/${publicId(work)}`}
        />
      ))}
    </div>
  );
}
