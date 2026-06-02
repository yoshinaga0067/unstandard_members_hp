export default function SectionHeading({
  en,
  ja,
  count,
}: {
  en: string;
  ja: string;
  count?: number;
}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div className="flex items-end gap-3">
        <h2 className="text-2xl font-extrabold tracking-wide md:text-3xl">{en}</h2>
        <span className="pb-0.5 text-sm font-bold text-black/50">{ja}</span>
      </div>
      {typeof count === "number" && (
        <span className="text-sm text-black/40">{count}件</span>
      )}
    </div>
  );
}
