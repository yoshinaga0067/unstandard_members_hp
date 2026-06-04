import Container from "@/components/Container";
import PillLink from "./PillLink";
import { ABOUT_TEAM_IMAGE } from "@/lib/company";
import type { Tenant } from "@/types";

// Company intro teaser on the store top page — playful blobs + highlighted copy.
export default function AboutSection({ tenant }: { tenant: Tenant }) {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 overflow-hidden bg-[#eef4ea] py-16 md:py-24"
    >
      {/* decorative gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -top-10 right-1/3 h-40 w-72 rounded-full bg-gradient-to-br from-rainbow-lime to-rainbow-green opacity-40 blur-2xl" />
        <span className="absolute left-[8%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-gradient-to-br from-rainbow-pink to-rainbow-coral opacity-40 blur-2xl" />
        <span className="absolute bottom-4 left-[18%] h-64 w-52 rounded-full bg-gradient-to-br from-rainbow-blue to-rainbow-pink opacity-30 blur-2xl" />
        <span className="absolute right-[44%] top-1/4 h-72 w-12 rotate-12 rounded-full bg-gradient-to-b from-rainbow-cyan to-rainbow-sky opacity-50 blur-xl" />
      </div>

      <Container>
        <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* left: copy */}
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              あなたの「好き」から、
              <br />
              家づくりを。
            </h2>
            <p className="mt-7 text-base font-bold leading-loose md:text-lg">
              <span className="bg-unstandard/60 box-decoration-clone px-1 py-0.5 [box-decoration-break:clone]">
                {tenant.shortName}は、決めすぎないデザインで、あなたらしい住まいを一緒に考えるパートナーです。
              </span>
            </p>

            {/* Vision pill button */}
            <PillLink href={`/stores/${tenant.slug}/about`} className="mt-10">
              私たちについて
            </PillLink>
          </div>

          {/* right: team photo */}
          <div className="overflow-hidden rounded-[2rem] shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ABOUT_TEAM_IMAGE}
              alt={`${tenant.shortName}のスタッフ`}
              className="h-72 w-full object-cover md:h-[28rem]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
