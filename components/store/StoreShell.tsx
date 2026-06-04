import type { ReactNode } from "react";
import Marquee from "./Marquee";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import type { Tenant } from "@/types";

export default function StoreShell({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader tenant={tenant} />
      <Marquee />
      <main className="flex-1 bg-white">{children}</main>
      <StoreFooter tenant={tenant} />
    </div>
  );
}
