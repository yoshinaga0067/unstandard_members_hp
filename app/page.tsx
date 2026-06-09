import { redirect } from "next/navigation";
import { TENANTS } from "@/lib/tenants";

// The brand homepage has been removed — this is a per-store site, so each
// store lives at /stores/[slug]. If anyone hits the base URL, send them to a
// store page instead of showing a 404.
export default function HomePage() {
  redirect(`/stores/${TENANTS[0].slug}`);
}
