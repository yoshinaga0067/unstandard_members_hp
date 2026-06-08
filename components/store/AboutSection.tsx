import Container from "@/components/Container";
import PillLink from "./PillLink";
import type { Tenant } from "@/types";

// Company intro teaser on the store top page — left: copy with a hand-drawn loop
// on 「好き」; right: a model-house photo with a line-art family illustration.
export default function AboutSection({ tenant }: { tenant: Tenant }) {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 bg-white py-16 md:py-24"
    >
      <Container>
        <div className="grid items-center gap-6 md:grid-cols-[26rem_1fr] md:gap-8">
          {/* left: copy */}
          <div>
            <p className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-neutral-300 md:text-4xl">
              ABOUT
            </p>

            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              <span className="block">あなたの</span>
              <span className="mt-2 block -ml-[0.5em] md:mt-3">
                「
                <span className="relative inline-block">
                  <span className="relative z-10">好き</span>
                  {/* hand-drawn marker loop around 好き (brand mustard) */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 240 130"
                    fill="none"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[180%] w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] text-unstandard-light"
                  >
                    <path
                      d="M120 16C70 10 24 30 18 62C12 96 58 116 116 114C178 112 224 86 222 54C220 24 168 10 110 16C96 17 82 20 70 26"
                      stroke="currentColor"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                」<span className="-ml-[0.5em]">から、</span>
              </span>
              <span className="mt-2 block md:mt-3">家づくりを。</span>
            </h2>

            <div className="mt-8 max-w-md space-y-5 text-[15px] font-medium leading-[2] text-black/80">
              <p>
                {tenant.shortName}は、決めすぎないデザインで、
                <br />
                あなたらしい住まいを一緒に考えるパートナーです。
              </p>
              <p>
                暮らす人の「好き」や価値観をていねいに伺い、
                <br />
                世界にひとつの住まいへと、かたちにしていきます。
              </p>
            </div>

            {/* Vision pill button */}
            <PillLink href={`/stores/${tenant.slug}/about`} className="mt-10">
              私たちについて
            </PillLink>
          </div>

          {/* right: model-house photo + family illustration */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about-house.png"
              alt={`${tenant.shortName}のモデルハウス`}
              className="w-full"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about-family.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[6%] right-[4%] w-[22%] max-w-[150px]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
