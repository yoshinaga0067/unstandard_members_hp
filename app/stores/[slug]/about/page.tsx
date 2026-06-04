import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import { TENANTS, getTenant } from "@/lib/tenants";
import {
  ABOUT_TEAM_IMAGE,
  ABOUT_CONCEPT,
  STRENGTHS,
  companyProfile,
} from "@/lib/company";

export function generateStaticParams() {
  return TENANTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) return { title: "私たちについて" };
  return { title: `私たちについて｜${tenant.shortName}` };
}

// Small parenthesised eyebrow label, e.g. ( ABOUT US )
function Eyebrow({ children, light }: { children: string; light?: boolean }) {
  return (
    <span
      className={`flex items-center gap-2 font-display text-xs font-bold tracking-[0.25em] ${
        light ? "text-white" : "text-rainbow-red"
      }`}
    >
      <span aria-hidden>(</span>
      {children}
      <span aria-hidden>)</span>
    </span>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();
  const profile = companyProfile(tenant);

  return (
    <StoreShell tenant={tenant}>
      {/* page header */}
      <section className="pt-12 md:pt-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>ABOUT US</Eyebrow>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                私たちについて
              </h1>
            </div>
            <p className="hidden text-xs font-bold text-black/40 md:block">
              TOP　—　私たちについて
            </p>
          </div>
        </Container>
      </section>

      {/* full-width team photo */}
      <section className="mt-8 md:mt-10">
        <Container>
          <div className="overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ABOUT_TEAM_IMAGE}
              alt={`${tenant.shortName}のスタッフ`}
              className="h-[42vw] max-h-[460px] w-full object-cover"
            />
          </div>
        </Container>
      </section>

      {/* concept message — bold red band */}
      <section className="mt-12 bg-rainbow-red py-14 text-white md:mt-16 md:py-20">
        <Container>
          <div className="mb-6 flex justify-center md:justify-start">
            <Eyebrow light>CONCEPT MESSAGE</Eyebrow>
          </div>
          <h2 className="font-display text-2xl font-extrabold leading-snug md:text-4xl">
            {ABOUT_CONCEPT.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="mt-8 max-w-3xl space-y-2 text-sm leading-loose text-white/90 md:text-base">
            {ABOUT_CONCEPT.body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* strong points */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="mb-10">
            <Eyebrow>STRONG POINTS</Eyebrow>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-4xl">
              {tenant.shortName}の3つの強み
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STRENGTHS.map((s) => (
              <div key={s.no} className="text-center md:text-left">
                <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full md:mx-0 md:w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-rainbow-red font-display text-sm font-extrabold text-white">
                    {s.no}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* profile / 会社概要 */}
      <section className="bg-neutral-50 py-14 md:py-20">
        <Container>
          <div className="mb-8 flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-unstandard" aria-hidden />
            <h2 className="font-display text-xl font-extrabold tracking-wide md:text-2xl">
              PROFILE
            </h2>
            <span className="text-sm font-bold text-black/50">会社概要</span>
          </div>
          <dl className="mx-auto max-w-3xl divide-y divide-black/10 border-y border-black/10">
            {profile.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6"
              >
                <dt className="shrink-0 text-sm font-bold sm:w-44">
                  {row.label}
                </dt>
                <dd className="text-sm text-black/80">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex justify-center">
            <PillLink href={`/stores/${tenant.slug}`} back>
              トップへ
            </PillLink>
          </div>
        </Container>
      </section>
    </StoreShell>
  );
}
