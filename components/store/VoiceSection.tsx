import Container from "@/components/Container";
import { VOICES } from "@/lib/voices";

export default function VoiceSection() {
  if (VOICES.length === 0) return null;
  return (
    <section className="bg-neutral-900 py-16 text-white md:py-24">
      <Container>
        <div className="mb-9 flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-unstandard" aria-hidden />
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-extrabold tracking-wide md:text-4xl">
              VOICE
            </h2>
            <span className="pb-1 text-sm font-bold text-white/50">
              お客様の声
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {VOICES.map((v, i) => (
            <article
              key={i}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image}
                  alt={v.label}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-unstandard">{v.label}</p>
                <p className="mt-1 line-clamp-5 text-sm leading-relaxed text-white/80">
                  {v.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
