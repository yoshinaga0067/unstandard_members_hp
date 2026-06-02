import Carousel from "./Carousel";
import WorkCard from "@/components/WorkCard";
import { worksForTenant } from "@/lib/works";
import type { Tenant } from "@/types";

export default function WorksSection({ tenant }: { tenant: Tenant }) {
  const works = worksForTenant(tenant.slug);
  if (works.length === 0) return null;

  return (
    <Carousel en="WORKS" ja="施工事例" total={works.length}>
      {works.map((work) => (
        <div key={work.id} className="w-52 shrink-0 snap-start sm:w-56">
          <WorkCard work={work} />
        </div>
      ))}
    </Carousel>
  );
}
