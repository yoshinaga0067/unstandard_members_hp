import Container from "@/components/Container";
import SectionHeading from "./SectionHeading";
import type { Tenant } from "@/types";

export default function ContactSection({ tenant }: { tenant: Tenant }) {
  return (
    <section id="contact" className="py-14 md:py-20">
      <Container>
        <SectionHeading en="CONTACT" ja="お問い合わせ・来店予約" />
        <div className="rounded-3xl bg-unstandard p-8 text-center md:p-14">
          <p className="text-xl font-extrabold">気になることは、お気軽にどうぞ。</p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-black/70">
            資料請求・来店予約・オンライン相談を承っています。あなたのペースで大丈夫です。
          </p>
          <a
            href={`tel:${tenant.tel.replace(/-/g, "")}`}
            className="mt-6 inline-block font-display text-4xl font-extrabold tracking-wide md:text-5xl"
          >
            {tenant.tel}
          </a>
          <p className="mt-3 text-xs text-black/60">
            ※ お問い合わせフォームは現在準備中です
          </p>
        </div>
      </Container>
    </section>
  );
}
