// Scrolling "LIFE IS COLORFUL" bar — pure CSS, no JS.
const PHRASE = "LIFE IS COLORFUL";

export default function Marquee() {
  const items = Array.from({ length: 10 });
  return (
    <div className="overflow-hidden bg-black py-1.5 text-white">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
            {items.map((_, i) => (
              <span
                key={i}
                className="mx-5 text-[11px] font-bold tracking-[0.3em]"
              >
                {PHRASE}
                <span className="mx-3 text-unstandard">✳</span>
                毎日もっとカラフルに
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
