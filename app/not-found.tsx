import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-bold tracking-widest text-black/40">404</p>
      <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
        ページが見つかりませんでした
      </h1>
      <p className="mt-3 text-sm text-black/60">
        お探しのページは移動または削除された可能性があります。
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-rainbow-red"
      >
        ホームへ戻る
      </Link>
    </Container>
  );
}
