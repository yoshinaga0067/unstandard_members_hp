import Container from "@/components/Container";
import SectionHeading from "./SectionHeading";
import MediaCard from "./MediaCard";
import { MEDIA } from "@/lib/media";

export default function MediaSection() {
  if (MEDIA.length === 0) return null;
  const items = MEDIA.slice(0, 4);

  return (
    <section id="media" className="scroll-mt-28 bg-neutral-100 py-14 md:py-20">
      <Container>
        <SectionHeading en="MEDIA" ja="メディア" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((m, i) => (
            <MediaCard key={i} m={m} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://unstandard.jp/media/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black px-7 py-3 text-sm font-bold transition hover:bg-black hover:text-white"
          >
            メディア一覧を見る<span aria-hidden>→</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
