import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PillLink from "@/components/store/PillLink";
import SectionHeading from "@/components/store/SectionHeading";
import Container from "@/components/Container";
import StoreShell from "@/components/store/StoreShell";
import { TENANTS, getTenant } from "@/lib/tenants";
import {
  ABOUT_TEAM_IMAGE,
  ABOUT_CONCEPT,
  STRENGTHS,
  companyProfile,
} from "@/lib/company";

// tab colours for the strength cards (LIFE IS COLORFUL palette)
const STRENGTH_TAB_COLORS = ["#f6dc30", "#ea5c52", "#8cc63f"];

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
      <section className="pb-8 pt-12 md:pb-10 md:pt-16">
        <Container>
          {/* heading — centred, like the top page's CONTACT section */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
              ABOUT
            </h1>
            <span className="text-sm font-bold text-black/50">
              私たちについて
            </span>
          </div>
        </Container>
      </section>

      {/* team photo — sits above the red band and straddles it */}
      <section className="relative z-10">
        <Container>
          <div className="overflow-hidden rounded-3xl border-2 border-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ABOUT_TEAM_IMAGE}
              alt={`${tenant.shortName}のスタッフ`}
              className="h-64 w-full object-cover md:h-96 lg:h-[460px]"
            />
          </div>
        </Container>
      </section>

      {/* concept message — the red band is pulled up so the photo's bottom half
          overlaps it (the photo stays on top via z-index). The negative margin and
          the top padding both equal ~half the image height at each breakpoint. */}
      <section className="relative -mt-32 bg-rainbow-red pb-14 pt-40 text-center text-white md:-mt-48 md:pb-20 md:pt-60 lg:-mt-[230px] lg:pt-[280px]">
        <Container>
          <h2 className="font-display text-2xl font-extrabold leading-relaxed md:text-4xl">
            {ABOUT_CONCEPT.heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-2 text-sm leading-loose text-white/90 md:text-base">
            {ABOUT_CONCEPT.body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* strong points */}
      <section className="py-14 md:py-20">
        <Container>
          {/* japanese title is the large heading here, english sits small below */}
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
              {tenant.shortName}の強み
            </h2>
            <span className="font-display text-xs font-bold tracking-[0.25em] text-black/50">
              STRONG POINTS
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STRENGTHS.map((s, i) => {
              const tab = STRENGTH_TAB_COLORS[i % STRENGTH_TAB_COLORS.length];
              return (
                <div
                  key={s.no}
                  className="relative rounded-3xl border border-black bg-white px-5 pb-7 pt-16 text-center"
                >
                  {/* coloured tab hanging from the top-centre of the frame */}
                  <div
                    className="absolute left-1/2 top-0 flex -translate-x-1/2 items-baseline gap-1.5 rounded-b-2xl border-x border-b border-black px-6 py-2"
                    style={{ backgroundColor: tab }}
                  >
                    <span className="font-display text-[11px] font-bold tracking-widest text-black">
                      POINT
                    </span>
                    <span className="font-display text-xl font-extrabold leading-none text-black">
                      {s.no}
                    </span>
                  </div>

                  {/* image */}
                  <div className="overflow-hidden rounded-2xl border border-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </div>

                  {/* title */}
                  <h3 className="mt-6 text-xl font-extrabold">{s.title}</h3>

                  {/* text */}
                  <p className="mt-4 text-left text-sm leading-relaxed text-black/70">
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* profile / 会社概要 */}
      <section className="bg-neutral-50 py-14 md:py-20">
        <Container>
          <SectionHeading en="PROFILE" ja="会社概要" center />
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

          {/* google map of the company location (embed needs no API key) */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-black">
            <iframe
              title={`${tenant.shortName}の所在地`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `〒${tenant.postalCode} ${tenant.prefecture}${tenant.city}${tenant.street}`,
              )}&output=embed`}
              className="block h-72 w-full md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

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
