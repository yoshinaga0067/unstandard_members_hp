import Link from "next/link";
import Container from "./Container";

const NAV = [
  { href: "/", label: "ホーム" },
  { href: "/stores", label: "加盟店を探す" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-extrabold tracking-tight">
            UNSTANDARD
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-unstandard" aria-hidden />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium transition hover:text-rainbow-red"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#contact"
          className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-rainbow-red"
        >
          話を聞いてみる
        </Link>
      </Container>

      {/* mobile nav */}
      <nav className="flex gap-5 overflow-x-auto border-t border-black/5 px-5 py-2 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="whitespace-nowrap text-sm font-medium"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
