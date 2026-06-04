// Marquee strip under the header — phrases separated by colorful rainbow dots.
const SEGMENTS = [
  "あなたの「好き」から始める家づくりを、一緒に。",
  "毎日をもっとカラフルに。LIFE IS COLORFUL",
];

// rainbow palette (matches tailwind theme tokens)
const DOTS = ["#ed1c24", "#f6dc30", "#91c2e1", "#8cc63f", "#ea5c52", "#a4d2de"];

export default function Marquee() {
  const seq = Array.from({ length: 6 }).flatMap(() => SEGMENTS);
  return (
    <div className="overflow-hidden border-b border-black/10 bg-white py-2.5 text-black">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
            {seq.map((s, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                <span
                  className="mx-6 inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: DOTS[i % DOTS.length] }}
                  aria-hidden
                />
                <span className="text-xs font-bold tracking-wide md:text-sm">
                  {s}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
