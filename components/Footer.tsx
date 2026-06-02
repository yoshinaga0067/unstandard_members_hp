import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-black/10">
      <div className="rainbow-bar h-1.5 w-full" aria-hidden />
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold">UNSTANDARD</p>
          <p className="mt-3 max-w-sm text-sm text-black/60">
            あなたの「好き」から始める家づくり。全国の加盟店が、あなたの暮らしに合わせた住まいをご提案します。
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>
          <Link href="/stores" className="hover:underline">
            加盟店を探す
          </Link>
          <Link href="/#contact" className="hover:underline">
            お問い合わせ
          </Link>
        </nav>
      </Container>
      <Container className="border-t border-black/5 py-6">
        <p className="text-xs text-black/50">
          © {year} UNSTANDARD. ALL RIGHTS RESERVED.
        </p>
      </Container>
    </footer>
  );
}
