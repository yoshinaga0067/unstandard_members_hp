import Link from "next/link";
import Container from "@/components/Container";
import type { Tenant, TenantSocial } from "@/types";

const SOCIAL: { key: keyof TenantSocial; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "X" },
];

export default function StoreFooter({ tenant }: { tenant: Tenant }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-white">
      <div className="rainbow-bar h-1.5 w-full" aria-hidden />
      <Container className="grid gap-8 py-12 md:grid-cols-2">
        <div>
          <p className="text-lg font-extrabold">{tenant.name}</p>
          <p className="mt-3 text-sm text-white/70">
            〒{tenant.postalCode} {tenant.prefecture}
            {tenant.city}
            {tenant.street}
          </p>
          <p className="mt-1 text-sm text-white/70">
            TEL {tenant.tel}
            {tenant.fax ? ` ／ FAX ${tenant.fax}` : ""}
          </p>
          {tenant.social && (
            <div className="mt-4 flex flex-wrap gap-2">
              {SOCIAL.map(({ key, label }) => {
                const url = tenant.social?.[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold transition hover:border-white"
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div className="md:text-right">
          <p className="text-xs tracking-widest text-white/50">
            住宅フランチャイズ
          </p>
          <Link href="/" className="font-display text-3xl font-extrabold">
            UNSTANDARD
          </Link>
          <p className="mt-6 text-xs text-white/40">
            © {year} UNSTANDARD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </Container>
    </footer>
  );
}
