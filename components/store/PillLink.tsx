import Link from "next/link";
import type { ReactNode } from "react";

// Arrow circle with the crowdloan.jp-style hover motion: the circle fills black
// on hover while the arrow slides out one side and a duplicate slides in from
// the other. Two identical arrows ride a track inside an overflow-hidden
// circle; the track translates on hover. The colour change leads, the arrow
// slide follows (delay) — matching the reference site's timing.
function ArrowCircle({ back }: { back: boolean }) {
  const arrow = back ? (
    <>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </>
  ) : (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  );

  const svg = (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {arrow}
    </svg>
  );

  // Two stacked arrows slide on hover: the visible one exits one side while a
  // duplicate enters from the other. forward → out right / in left; back → mirror.
  const move = "transition-transform delay-200 duration-[440ms] ease-[cubic-bezier(.33,1,.68,1)]";
  const frontExit = back ? "group-hover:-translate-x-full" : "group-hover:translate-x-full";
  const backStart = back ? "translate-x-full" : "-translate-x-full";

  return (
    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white text-black transition-colors duration-200 group-hover:bg-black group-hover:text-white">
      {/* resting arrow (centred → slides out) */}
      <span
        className={`absolute inset-0 flex items-center justify-center translate-x-0 ${frontExit} ${move}`}
      >
        {svg}
      </span>
      {/* incoming arrow (off-screen → slides to centre) */}
      <span
        className={`absolute inset-0 flex items-center justify-center ${backStart} group-hover:translate-x-0 ${move}`}
      >
        {svg}
      </span>
    </span>
  );
}

// Shared primary button across the store sections: a black pill with the label
// and an arrow circle. Forward links put the circle on the right; `back` links
// put it on the left with a left-pointing arrow. Internal links use next/link;
// external links render a plain anchor that opens in a new tab.
export default function PillLink({
  href,
  children,
  external = false,
  back = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  back?: boolean;
  className?: string;
}) {
  const pad = back ? "pl-2 pr-7" : "pl-7 pr-2";
  const base = `group inline-flex w-fit items-center gap-4 rounded-full border border-black bg-black py-2 ${pad} text-sm font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black`;

  const inner = back ? (
    <>
      <ArrowCircle back />
      {children}
    </>
  ) : (
    <>
      {children}
      <ArrowCircle back={false} />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${className}`}>
      {inner}
    </Link>
  );
}
