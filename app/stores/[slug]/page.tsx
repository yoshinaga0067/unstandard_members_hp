import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TENANTS, getTenant } from "@/lib/tenants";
import StoreShell from "@/components/store/StoreShell";
import StoreHero from "@/components/store/StoreHero";
import NewsSection from "@/components/store/NewsSection";
import LineupSection from "@/components/store/LineupSection";
import EventSection from "@/components/store/EventSection";
import WorksSection from "@/components/store/WorksSection";
import VoiceSection from "@/components/store/VoiceSection";
import MediaSection from "@/components/store/MediaSection";
import AboutSection from "@/components/store/AboutSection";
import ContactSection from "@/components/store/ContactSection";

export function generateStaticParams() {
  return TENANTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) return { title: "加盟店が見つかりません" };
  return {
    title: tenant.name,
    description: `${tenant.name}｜${tenant.prefecture}${tenant.city}の工務店。商品ラインナップ・施工事例・イベント・お客様の声をご紹介します。`,
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();

  return (
    <StoreShell tenant={tenant}>
      <StoreHero tenant={tenant} />
      <AboutSection tenant={tenant} />
      <LineupSection slug={tenant.slug} />
      <EventSection tenant={tenant} />
      <WorksSection tenant={tenant} />
      <VoiceSection />
      <MediaSection />
      <NewsSection slug={tenant.slug} />
      <ContactSection tenant={tenant} />
    </StoreShell>
  );
}
