"use client";

import Carousel from "./Carousel";
import WorkCard from "@/components/WorkCard";
import { worksForTenant } from "@/lib/works";
import { usePublicItems, publicId } from "@/lib/usePublicItems";
import type { Tenant } from "@/types";

export default function WorksSection({ tenant }: { tenant: Tenant }) {
  const works = usePublicItems(
    "works",
    tenant.slug,
    worksForTenant(tenant.slug)
  );
  if (works.length === 0) return null;

  return (
    <Carousel
      en="WORKS"
      ja="施工事例"
      total={works.length}
      speed={0.03}
      id="works"
      bg="bg-neutral-100"
      moreHref={`/stores/${tenant.slug}/works`}
    >
      {works.map((work) => (
        <div key={publicId(work)} className="w-52 shrink-0 sm:w-56">
          <WorkCard
            work={work}
            href={`/stores/${tenant.slug}/works/${publicId(work)}`}
          />
        </div>
      ))}
    </Carousel>
  );
}
