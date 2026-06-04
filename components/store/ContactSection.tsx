import Container from "@/components/Container";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";
import { eventsForTenant } from "@/lib/events";
import type { Tenant } from "@/types";

export default function ContactSection({ tenant }: { tenant: Tenant }) {
  const events = eventsForTenant(tenant.slug).map((e) => ({
    id: e.id,
    title: e.title,
  }));
  return (
    <section
      id="contact"
      className="scroll-mt-28 bg-unstandard py-14 md:py-20"
    >
      <Container>
        <SectionHeading en="CONTACT" ja="お問い合わせ・来店予約" />

        {/* one white card on the yellow section: intro + phone + form */}
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <div className="text-center">
            <p className="text-xl font-extrabold">気になることは、お気軽にどうぞ。</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-black/70">
              資料請求・来店予約・オンライン相談を承っています。あなたのペースで大丈夫です。
            </p>
            <a
              href={`tel:${tenant.tel.replace(/-/g, "")}`}
              className="mt-6 inline-flex items-center gap-3 font-display text-4xl font-extrabold tracking-wide md:text-5xl"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 shrink-0 md:h-10 md:w-10"
                fill="currentColor"
                aria-hidden
              >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.2 2.2z" />
              </svg>
              {tenant.tel}
            </a>
            <p className="mt-2 text-xs text-black/60">営業時間 9:00〜17:00</p>

            {/* divider + required-fields note */}
            <div className="mt-8 flex w-full items-center gap-4 text-xs font-bold text-black/50">
              <span className="h-px flex-1 bg-black/15" />
              <span className="text-rainbow-red">*は必ずご記入ください</span>
              <span className="h-px flex-1 bg-black/15" />
            </div>
          </div>

          {/* contact form (transparent — shares the white card) */}
          <div className="mt-6">
            <ContactForm events={events} />
          </div>
        </div>
      </Container>
    </section>
  );
}
