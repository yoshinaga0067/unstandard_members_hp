import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

// Chrome for the brand-level pages (home, store directory).
export default function BrandShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
