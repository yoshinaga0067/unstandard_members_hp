import Link from "next/link";
import Container from "@/components/Container";
import TenantCard from "@/components/TenantCard";
import BrandShell from "@/components/BrandShell";
import { AREAS, TENANTS, tenantsByArea } from "@/lib/tenants";

export default function HomePage() {
  const pickup = TENANTS.slice(0, 8);

  return (
    <BrandShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* decorative dots (desktop only) */}
        <span
          className="pointer-events-none absolute -right-6 top-10 hidden h-24 w-24 rounded-full bg-rainbow-lime/70 md:block"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-32 top-40 hidden h-12 w-12 rounded-full bg-rainbow-coral/70 md:block"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-10 bottom-8 hidden h-16 w-16 rounded-full bg-rainbow-sky/70 md:block"
          aria-hidden
        />
        <Container className="relative py-16 md:py-28">
          <p className="mb-4 font-display text-sm font-bold tracking-widest text-black/50">
            LIFE IS COLORFUL
          </p>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            あなたの「好き」から、
            <br />
            家づくりを始めよう。
          </h1>
          <div className="rainbow-bar mt-6 h-2 w-40 rounded-full" aria-hidden />
          <p className="mt-6 max-w-xl text-base text-black/70 md:text-lg">
            決めすぎないデザイン。全国のUNSTANDARD加盟店が、あなたの暮らしに合わせた住まいを一緒に考えます。気になることは、お気軽にどうぞ。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/stores"
              className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-rainbow-red"
            >
              加盟店を探す
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-black px-6 py-3 text-sm font-bold transition hover:bg-unstandard"
            >
              話を聞いてみる
            </Link>
          </div>
        </Container>
      </section>

      {/* エリアから探す */}
      <section className="bg-black/[0.02] py-16">
        <Container>
          <h2 className="text-2xl font-extrabold md:text-3xl">エリアから探す</h2>
          <p className="mt-2 text-sm text-black/60">
            お住まいの地域の加盟店を見つけてください。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {AREAS.map((a) => (
              <Link
                key={a.key}
                href={`/stores#${a.key}`}
                className="rounded-full px-5 py-2 text-sm font-bold text-black transition hover:opacity-80"
                style={{ backgroundColor: a.color }}
              >
                {a.name}（{tenantsByArea(a.key).length}）
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 加盟店ピックアップ */}
      <section className="py-16">
        <Container>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold md:text-3xl">
                加盟店ピックアップ
              </h2>
              <p className="mt-2 text-sm text-black/60">
                全国{TENANTS.length}店の加盟店があなたを待っています。
              </p>
            </div>
            <Link
              href="/stores"
              className="hidden text-sm font-bold transition hover:text-black/55 md:inline"
            >
              すべて見る →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {pickup.map((t) => (
              <TenantCard key={t.slug} tenant={t} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/stores" className="text-sm font-bold">
              すべて見る →
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section id="contact" className="bg-unstandard py-16">
        <Container className="text-center">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            まずは、話を聞いてみませんか？
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-black/70">
            資料請求・来店予約・オンライン相談。あなたのペースで大丈夫です。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/stores"
              className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
            >
              加盟店を探す
            </Link>
          </div>
          <p className="mt-4 text-xs text-black/50">
            ※ お問い合わせ機能は現在準備中です。
          </p>
        </Container>
      </section>
    </BrandShell>
  );
}
