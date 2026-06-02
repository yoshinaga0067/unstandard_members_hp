import type { Metadata } from "next";
import Container from "@/components/Container";
import TenantCard from "@/components/TenantCard";
import BrandShell from "@/components/BrandShell";
import { AREAS, TENANTS, tenantsByArea } from "@/lib/tenants";

export const metadata: Metadata = {
  title: "加盟店を探す",
  description:
    "全国のUNSTANDARD加盟店一覧。エリアから、あなたの近くの加盟店を見つけてください。",
};

export default function StoresPage() {
  return (
    <BrandShell>
      <Container className="py-12 md:py-16">
      <p className="text-sm font-bold tracking-widest text-black/50">STORES</p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">加盟店を探す</h1>
      <p className="mt-3 max-w-2xl text-black/70">
        全国{TENANTS.length}店のUNSTANDARD加盟店。エリアごとにご紹介します。
      </p>

      {/* area quick nav */}
      <div className="mt-8 flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <a
            key={a.key}
            href={`#${a.key}`}
            className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-bold transition hover:bg-black/5"
          >
            {a.name}
          </a>
        ))}
      </div>

      <div className="mt-12 space-y-14">
        {AREAS.map((area) => {
          const stores = tenantsByArea(area.key);
          if (stores.length === 0) return null;
          return (
            <section key={area.key} id={area.key} className="scroll-mt-28">
              <div className="flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: area.color }}
                  aria-hidden
                />
                <h2 className="text-xl font-extrabold md:text-2xl">
                  {area.name}
                </h2>
                <span className="text-sm text-black/40">{stores.length}店</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {stores.map((t) => (
                  <TenantCard key={t.slug} tenant={t} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      </Container>
    </BrandShell>
  );
}
