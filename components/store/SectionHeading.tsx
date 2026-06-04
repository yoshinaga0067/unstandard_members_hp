export default function SectionHeading({
  en,
  ja,
  center = false,
}: {
  en: string;
  ja: string;
  // center: stack the heading in the middle with the JA label under the EN
  center?: boolean;
}) {
  if (center) {
    return (
      <div className="mb-9 flex flex-col items-center gap-1 text-center">
        <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
          {en}
        </h2>
        <span className="text-sm font-bold text-black/50">{ja}</span>
      </div>
    );
  }

  return (
    <div className="mb-9 flex items-end gap-3">
      <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
        {en}
      </h2>
      <span className="pb-1 text-sm font-bold text-black/50">{ja}</span>
    </div>
  );
}
