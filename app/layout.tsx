import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UNSTANDARD｜あなたの「好き」から、家づくり",
    template: "%s｜UNSTANDARD",
  },
  description:
    "決めすぎないデザイン。全国のUNSTANDARD加盟店が、あなたの暮らしに合わせた住まいを一緒に考えます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={noto.variable}>
      <body className="overflow-x-clip font-sans">{children}</body>
    </html>
  );
}
