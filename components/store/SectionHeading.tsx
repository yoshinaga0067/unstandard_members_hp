export default function SectionHeading({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="mb-9 flex items-end gap-3">
      <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
        {en}
      </h2>
      <span className="pb-1 text-sm font-bold text-black/50">{ja}</span>
    </div>
  );
}
