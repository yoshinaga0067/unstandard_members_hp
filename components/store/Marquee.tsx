// Beige marquee bar — alternating phrases separated by a smiley, pure CSS.
const SEGMENTS = ["毎日をもっとカラフルに", "LIFE IS COLORFUL"];

export default function Marquee() {
  const seq = Array.from({ length: 6 }).flatMap(() => SEGMENTS);
  return (
    <div className="overflow-hidden bg-[#e8e2d2] py-2 text-black">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
            {seq.map((s, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                <span className="mx-5 text-base leading-none">☻</span>
                <span className="font-display text-xs font-bold tracking-wide md:text-sm">
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
