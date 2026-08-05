"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TENANTS, getTenant } from "@/lib/tenants";
import {
  RESOURCES,
  TENANT_FIELDS,
  TENANT_PROFILE_FIELDS,
  ABOUT_FIELDS,
  aboutSeed,
  tenantSeed,
  resourceByKey,
  type AdminItem,
  type Field,
} from "./resources";
import { useResource, type Collection } from "./useResource";
import FieldInput, { getPath, setPath } from "./Field";
import PreviewModal from "./PreviewModal";

// ---- validation ----
function validate(fields: Field[], item: Record<string, unknown>) {
  const errs: Record<string, string> = {};
  for (const f of fields) {
    const v = getPath(item, f.key);
    const empty =
      v == null ||
      (typeof v === "string" && !v.trim()) ||
      (Array.isArray(v) && v.length === 0);
    if (f.required && empty) {
      errs[f.key] = `${f.label}を入力してください`;
      continue;
    }
    if (f.type === "url" && typeof v === "string" && v.trim()) {
      try {
        new URL(v);
      } catch {
        errs[f.key] = "正しいURLを入力してください（https://… の形式）";
      }
    }
  }
  return errs;
}

// ---- nav icons (simple line icons) ----
function NavIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 13h7v7H4z",
    news: "M4 5h16v14H4zM7 9h10M7 13h7",
    events: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
    works: "M4 5h16v14H4zM4 15l4-4 4 4 4-5 4 4",
    products: "M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4",
    voices: "M5 5h14v10H9l-4 4z",
    about: "M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z",
    tenant: "M4 9l8-5 8 5v11H4zM10 20v-6h4v6",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[name] ?? ""} />
    </svg>
  );
}

// per-section accent — muted but a touch brighter (calm, not pop)
const ACCENT: Record<string, string> = {
  dashboard: "#52525b", // charcoal
  news: "#6f93ad", // dusty blue
  events: "#c07d6c", // soft terracotta
  works: "#82a479", // sage green
  products: "#b89c63", // soft gold
  voices: "#b2849a", // dusty rose
  about: "#6fa39e", // soft teal
  tenant: "#7e90a8", // slate
  strengths: "#b89c63", // soft gold
};

// translucent version of a hex colour, for soft tinted backgrounds
function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// section icon on a soft tinted ground; the colour shows only in the line icon
function IconChip({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const box =
    size === "sm"
      ? "h-7 w-7 rounded-lg [&_svg]:h-4 [&_svg]:w-4"
      : "h-10 w-10 rounded-xl";
  const color = ACCENT[name] ?? "#6b7280";
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${box}`}
      style={{ backgroundColor: tint(color, 0.16), color }}
    >
      <NavIcon name={name} />
    </span>
  );
}

// trash-can icon for delete actions
function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13M10 11v6M14 11v6" />
    </svg>
  );
}

const NAV: { key: string; label: string }[] = [
  { key: "dashboard", label: "ダッシュボード" },
  ...RESOURCES.filter((r) => !r.hidden).map((r) => ({
    key: r.key,
    label: r.label,
  })),
  { key: "about", label: "私たちについて" },
  { key: "tenant", label: "店舗情報" },
];

export default function AdminApp() {
  const [storeSlug, setStoreSlug] = useState(TENANTS[0].slug);
  // demo session role. "hq" = 本部 (edits every store + shared content),
  // "store" = 加盟店 (edits only its own site). null = show the login gate.
  const [role, setRole] = useState<"hq" | "store" | null>(null);
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState("dashboard");
  const [editing, setEditing] = useState<{
    key: string;
    draft: AdminItem;
    isNew: boolean;
    original: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewing, setPreviewing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; undo?: () => void } | null>(
    null
  );

  // restore an existing demo session
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("unstandard-admin:session");
      if (raw) {
        const s = JSON.parse(raw) as { role?: string; slug?: string };
        if (s.role === "hq") {
          setRole("hq");
          if (s.slug && getTenant(s.slug)) setStoreSlug(s.slug);
        } else if (s.role === "store" && s.slug && getTenant(s.slug)) {
          setRole("store");
          setStoreSlug(s.slug);
        }
      }
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const persistSession = (r: "hq" | "store", slug: string) =>
    window.localStorage.setItem(
      "unstandard-admin:session",
      JSON.stringify({ role: r, slug })
    );
  const isEditingDirty = () =>
    !!editing && JSON.stringify(editing.draft) !== editing.original;
  const isHQ = role === "hq";

  const loginStore = (s: string) => {
    setRole("store");
    setStoreSlug(s);
    setSection("dashboard");
    persistSession("store", s);
  };
  const loginHQ = () => {
    setRole("hq");
    setSection("dashboard");
    persistSession("hq", storeSlug);
  };
  const logout = () => {
    if (
      isEditingDirty() &&
      !window.confirm("編集中の内容が保存されていません。破棄してログアウトしますか？")
    )
      return;
    setEditing(null);
    setErrors({});
    setSection("dashboard");
    setRole(null);
    window.localStorage.removeItem("unstandard-admin:session");
  };
  // HQ only: switch which store is being edited
  const changeStore = (s: string) => {
    if (
      isEditingDirty() &&
      !window.confirm("編集中の内容が保存されていません。破棄して店舗を切り替えますか？")
    )
      return;
    setEditing(null);
    setErrors({});
    setStoreSlug(s);
    persistSession("hq", s);
  };
  const goSection = (key: string) => {
    setSection(key);
    setErrors({});
  };

  // collections (stable order = RESOURCES)
  const cols: Record<string, Collection> = {
    news: useResource(RESOURCES[0], storeSlug),
    events: useResource(RESOURCES[1], storeSlug),
    works: useResource(RESOURCES[2], storeSlug),
    products: useResource(RESOURCES[3], storeSlug),
    voices: useResource(RESOURCES[4], storeSlug),
    strengths: useResource(RESOURCES[5], storeSlug),
  };

  // tenant settings (single record)
  const [tenantDraft, setTenantDraft] = useState<Record<string, unknown>>({});
  useEffect(() => {
    const key = `unstandard-admin:tenant:${storeSlug}`;
    let data: Record<string, unknown> | null = null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) data = JSON.parse(raw);
    } catch {
      data = null;
    }
    setTenantDraft(data ?? tenantSeed(storeSlug));
  }, [storeSlug]);

  // 私たちについて (single record)
  const [aboutDraft, setAboutDraft] = useState<Record<string, unknown>>({});
  useEffect(() => {
    const key = `unstandard-admin:about:${storeSlug}`;
    let data: Record<string, unknown> | null = null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) data = JSON.parse(raw);
    } catch {
      data = null;
    }
    setAboutDraft(data ?? aboutSeed(storeSlug));
  }, [storeSlug]);

  // toast auto-dismiss (longer when an undo action is offered)
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.undo ? 8000 : 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const tenant = getTenant(storeSlug);

  const scrollToError = (key: string) => {
    setTimeout(() => {
      document
        .getElementById(`field-${key.replace(/\./g, "-")}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  // ---- handlers ----
  const openCreate = (key: string) => {
    const cfg = resourceByKey(key);
    if (!cfg) return;
    if (cfg.shared && !isHQ) return; // 共通コンテンツは本部のみ編集できる
    setErrors({});
    const draft = cfg.newItem();
    setEditing({ key, draft, isNew: true, original: JSON.stringify(draft) });
  };
  const openEdit = (key: string, item: AdminItem) => {
    const cfg = resourceByKey(key);
    if (cfg?.shared && !isHQ) return; // 共通コンテンツは本部のみ編集できる
    setErrors({});
    const draft = { ...item };
    setEditing({ key, draft, isNew: false, original: JSON.stringify(draft) });
  };
  const closeDrawer = () => {
    if (
      isEditingDirty() &&
      !window.confirm("編集中の内容が保存されていません。閉じてよろしいですか？")
    )
      return;
    setEditing(null);
    setErrors({});
    setPreviewing(false);
  };
  const saveDraft = () => {
    if (!editing) return;
    const cfg = resourceByKey(editing.key);
    if (!cfg) return;
    const errs = validate(cfg.fields, editing.draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      scrollToError(Object.keys(errs)[0]);
      return;
    }
    const draft = { ...editing.draft };
    if (editing.key === "news" && !draft.slug)
      draft.slug = `news-${Date.now().toString(36)}`;
    try {
      if (editing.isNew) cols[editing.key].add(draft);
      else cols[editing.key].update(draft);
      setEditing(null);
      setToast({ msg: "保存しました" });
    } catch {
      setToast({
        msg: "保存できませんでした（画像が大きすぎる可能性があります）",
      });
    }
  };
  const togglePublish = (key: string, item: AdminItem) =>
    cols[key].update({ ...item, published: item.published === false });
  const deleteItem = (key: string, item: AdminItem) => {
    const removed = cols[key].remove(item._id as string);
    setEditing(null);
    if (removed)
      setToast({
        msg: "削除しました",
        undo: () => {
          cols[key].restore(removed.item, removed.index);
          setToast({ msg: "元に戻しました" });
        },
      });
  };
  const resetAll = () => {
    if (
      !window.confirm(
        "この店舗の全データを初期状態に戻します。よろしいですか？"
      )
    )
      return;
    Object.entries(cols).forEach(([k, c]) => {
      // stores must not reset 本部's shared content
      if (!isHQ && resourceByKey(k)?.shared) return;
      c.reset();
    });
    setTenantDraft(tenantSeed(storeSlug));
    setAboutDraft(aboutSeed(storeSlug));
    window.localStorage.removeItem(`unstandard-admin:tenant:${storeSlug}`);
    window.localStorage.removeItem(`unstandard-admin:about:${storeSlug}`);
    setToast({ msg: "初期状態に戻しました" });
  };
  const saveTenant = () => {
    const errs = validate(
      [...TENANT_FIELDS, ...TENANT_PROFILE_FIELDS],
      tenantDraft
    );
    if (Object.keys(errs).length) {
      setErrors(errs);
      scrollToError(Object.keys(errs)[0]);
      return;
    }
    window.localStorage.setItem(
      `unstandard-admin:tenant:${storeSlug}`,
      JSON.stringify(tenantDraft)
    );
    setErrors({});
    setToast({ msg: "店舗情報を保存しました" });
  };
  const saveAbout = () => {
    window.localStorage.setItem(
      `unstandard-admin:about:${storeSlug}`,
      JSON.stringify(aboutDraft)
    );
    setToast({ msg: "「私たちについて」を保存しました" });
  };

  const cfg = editing ? resourceByKey(editing.key) : null;

  // wait until we've read localStorage, then gate behind a login
  if (!ready) return null;
  if (!role)
    return <LoginGate onLoginStore={loginStore} onLoginHQ={loginHQ} />;

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white">
        <div className="flex items-center gap-3 px-4 py-3 md:px-6">
          <span className="font-display text-lg font-extrabold tracking-tight">
            管理画面
          </span>
          <span className="rounded-full border border-black/15 px-2 py-0.5 text-[10px] font-bold text-black/55">
            DEMO
          </span>
          <div className="ml-auto flex items-center gap-2.5">
            {isHQ ? (
              <>
                <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                  本部
                </span>
                <label className="hidden text-[11px] font-bold text-black/45 sm:block">
                  編集中の店舗
                </label>
                <select
                  value={storeSlug}
                  onChange={(e) => changeStore(e.target.value)}
                  className="max-w-[42vw] rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-bold focus:border-black focus:outline-none"
                >
                  {TENANTS.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.shortName}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2">
                <span className="hidden text-[11px] font-bold text-black/45 sm:inline">
                  店舗
                </span>
                <span className="max-w-[38vw] truncate text-sm font-bold">
                  {tenant?.shortName}
                </span>
              </div>
            )}
            <a
              href={`/stores/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-black px-3 py-2 text-xs font-bold transition hover:bg-black hover:text-white md:inline"
            >
              サイトを見る ↗
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-black/15 px-3 py-2 text-xs font-bold transition hover:border-black"
            >
              ログアウト
            </button>
          </div>
        </div>
        {/* demo notice */}
        <div className="flex items-center gap-3 border-b border-black/5 bg-neutral-100 px-4 py-1.5 text-[11px] font-bold text-black/60 md:px-6">
          <span>
            デモ環境：変更はこのブラウザに保存され、店舗ページにも反映されます（このブラウザ内のデモ）。本番公開にはエンジニアの連携が必要です。
            {isHQ && "（本部モード：店舗を切り替えて全店を編集できます）"}
          </span>
          <button
            type="button"
            onClick={resetAll}
            className="ml-auto shrink-0 underline hover:no-underline"
          >
            初期状態に戻す
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
        {/* nav */}
        <nav className="flex shrink-0 flex-wrap gap-1.5 md:w-52 md:flex-col md:flex-nowrap">
          {NAV.map((n) => {
            const active = section === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => goSection(n.key)}
                aria-current={active ? "page" : undefined}
                style={
                  active ? { backgroundColor: tint(ACCENT[n.key], 0.1) } : undefined
                }
                className={`relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl py-2 pl-2 pr-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                  active ? "text-black" : "text-black/65 hover:bg-black/5"
                }`}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                    style={{ backgroundColor: ACCENT[n.key] }}
                  />
                )}
                <IconChip name={n.key} size="sm" />
                {n.label}
              </button>
            );
          })}
        </nav>

        {/* main */}
        <main className="min-w-0 flex-1">
          {section === "dashboard" && (
            <Dashboard
              storeName={tenant?.shortName ?? ""}
              isHQ={isHQ}
              cols={cols}
              onOpen={goSection}
              onCreate={openCreate}
            />
          )}

          {RESOURCES.filter((r) => !r.hidden).map(
            (r) =>
              section === r.key && (
                <ListView
                  key={r.key}
                  cfg={r}
                  items={cols[r.key].items}
                  readOnly={r.shared && !isHQ}
                  onCreate={() => openCreate(r.key)}
                  onEdit={(it) => openEdit(r.key, it)}
                  onDelete={(it) => deleteItem(r.key, it)}
                  onTogglePublish={(it) => togglePublish(r.key, it)}
                />
              )
          )}

          {section === "about" && (
            <AboutView
              draft={aboutDraft}
              setDraft={setAboutDraft}
              errors={errors}
              onSave={saveAbout}
              strengths={cols.strengths.items}
              onCreate={() => openCreate("strengths")}
              onEdit={(it) => openEdit("strengths", it)}
              onDelete={(it) => deleteItem("strengths", it)}
            />
          )}

          {section === "tenant" && (
            <TenantForm
              draft={tenantDraft}
              setDraft={setTenantDraft}
              errors={errors}
              onSave={saveTenant}
            />
          )}
        </main>
      </div>

      {/* editor drawer */}
      {editing && cfg && (
        <Drawer
          title={`${cfg.singular}${editing.isNew ? "を作成" : "を編集"}`}
          onClose={closeDrawer}
          onSave={saveDraft}
          onPreview={cfg.hidden ? undefined : () => setPreviewing(true)}
          onDelete={
            editing.isNew
              ? undefined
              : () => {
                  if (window.confirm("この項目を削除します。よろしいですか？"))
                    deleteItem(editing.key, editing.draft);
                }
          }
        >
          {cfg.fields.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={getPath(editing.draft, f.key)}
              error={errors[f.key]}
              onChange={(v) =>
                setEditing((ed) =>
                  ed ? { ...ed, draft: setPath(ed.draft, f.key, v) } : ed
                )
              }
            />
          ))}
        </Drawer>
      )}

      {/* live preview of the item being edited */}
      {previewing && editing && cfg && tenant && (
        <PreviewModal
          resourceKey={editing.key}
          draft={editing.draft}
          tenant={tenant}
          onClose={() => setPreviewing(false)}
        />
      )}

      {/* toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl bg-black px-5 py-3.5 text-base font-bold text-white shadow-2xl"
        >
          {!toast.undo && (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-unstandard"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span>{toast.msg}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={toast.undo}
              className="ml-1 shrink-0 rounded-full bg-white px-4 py-1.5 text-sm text-black"
            >
              元に戻す
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---- login gate (demo: 加盟店 = own site only / 本部 = every store) ----
function LoginGate({
  onLoginStore,
  onLoginHQ,
}: {
  onLoginStore: (slug: string) => void;
  onLoginHQ: () => void;
}) {
  const [mode, setMode] = useState<"store" | "hq">("store");
  const [slug, setSlug] = useState(TENANTS[0].slug);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 text-black">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="p-7 md:p-9">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight">
            管理画面
          </span>
          <span className="rounded-full border border-black/15 px-2 py-0.5 text-[10px] font-bold text-black/55">
            DEMO
          </span>
        </div>

        <h1 className="mt-5 text-xl font-extrabold">ログイン</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-black/55">
          ログインの種類を選んでください。
        </p>

        {/* role toggle */}
        <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-2xl bg-black/5 p-1">
          {(
            [
              ["store", "加盟店"],
              ["hq", "本部（運営）"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                mode === m
                  ? "bg-black text-white"
                  : "text-black/55 hover:text-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "store" ? (
          <>
            <label
              htmlFor="login-store"
              className="mt-6 block text-sm font-bold"
            >
              店舗
            </label>
            <select
              id="login-store"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-sm font-bold transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/15"
            >
              {TENANTS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.shortName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onLoginStore(slug)}
              className="mt-6 w-full rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              この店舗でログイン
            </button>
            <p className="mt-5 rounded-xl bg-black/5 px-4 py-3 text-[11px] font-bold leading-relaxed text-black/55">
              ※ 加盟店は、自分の店舗の情報だけを編集できます。共通コンテンツ（商品・お客様の声）は本部が管理し、閲覧のみとなります。本番では各店舗のID・パスワードが必要です。
            </p>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm leading-relaxed text-black/55">
              本部（運営）は、全店に配信する共通コンテンツを管理し、すべての加盟店ページを編集できます。
            </p>
            <button
              type="button"
              onClick={onLoginHQ}
              className="mt-6 w-full rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              本部としてログイン
            </button>
            <p className="mt-5 rounded-xl bg-black/5 px-4 py-3 text-[11px] font-bold leading-relaxed text-black/55">
              ※ デモのため、ボタンだけでログインできます。本番では本部専用のID・パスワードが必要です。
            </p>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

// ---- dashboard ----
function Dashboard({
  storeName,
  isHQ,
  cols,
  onOpen,
  onCreate,
}: {
  storeName: string;
  isHQ: boolean;
  cols: Record<string, Collection>;
  onOpen: (key: string) => void;
  onCreate: (key: string) => void;
}) {
  return (
    <div>
      <h1 className="text-xl font-extrabold md:text-2xl">
        {storeName} の管理
      </h1>
      <p className="mt-1 text-sm text-black/55">
        カードをタップすると一覧へ。「＋ 追加」ですぐに新規作成できます。
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3">
        {RESOURCES.filter((r) => !r.hidden).map((r) => {
          const editable = isHQ || !r.shared;
          return (
            <div
              key={r.key}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(r.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(r.key);
                }
              }}
              className="group cursor-pointer rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-black/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            >
              <div className="flex items-center gap-2.5">
                <IconChip name={r.key} size="sm" />
                <p className="text-sm font-bold">{r.label}</p>
              </div>
              <p className="mt-3 text-2xl font-extrabold">
                {cols[r.key].items.length}
                <span className="ml-1 text-xs font-bold text-black/45">件</span>
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-black/45">
                  {editable ? "管理する →" : "閲覧する →"}
                </span>
                {editable ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreate(r.key);
                    }}
                    className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white transition hover:bg-neutral-800"
                  >
                    ＋ 追加
                  </button>
                ) : (
                  <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold text-black/45">
                    本部管理
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- list view ----
function ListView({
  cfg,
  items,
  readOnly = false,
  onCreate,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  cfg: (typeof RESOURCES)[number];
  items: AdminItem[];
  readOnly?: boolean;
  onCreate: () => void;
  onEdit: (item: AdminItem) => void;
  onDelete: (item: AdminItem) => void;
  onTogglePublish?: (item: AdminItem) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconChip name={cfg.key} size="md" />
          <h1 className="text-xl font-extrabold md:text-2xl">
            {cfg.label}
            <span className="ml-2 text-sm font-bold text-black/45">
              {items.length}件
            </span>
          </h1>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            ＋ 新しい{cfg.singular}
          </button>
        )}
      </div>

      {cfg.shared && (
        <p className="mt-3 rounded-xl bg-black/5 px-4 py-2.5 text-xs font-bold text-black/55">
          {readOnly
            ? "※ 本部が管理する全店共通のコンテンツです。閲覧のみ可能です。"
            : "※ 全店に配信される共通コンテンツです。編集すると全店舗のサイトに反映されます。"}
        </p>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white py-14 text-center">
          <p className="text-sm text-black/55">
            まだ{cfg.label}がありません。
          </p>
          {!readOnly && (
            <button
              type="button"
              onClick={onCreate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white"
            >
              最初の{cfg.singular}を作成
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {items.map((it) => {
            const thumb = cfg.getThumb(it);
            return (
              <li
                key={it._id}
                className={`flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-3 pr-4 transition hover:border-black/30 ${
                  it.published === false ? "opacity-60" : ""
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 text-[10px] text-black/30">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "画像なし"
                  )}
                </div>
                {readOnly ? (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {cfg.getTitle(it)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-black/45">
                      {cfg.getSubtitle(it)}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEdit(it)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-sm font-bold">
                      {cfg.getTitle(it)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-black/45">
                      {cfg.getSubtitle(it)}
                    </p>
                  </button>
                )}
                {readOnly ? (
                  <span className="shrink-0 rounded-full bg-black/5 px-3 py-1.5 text-[11px] font-bold text-black/40">
                    本部管理
                  </span>
                ) : confirmId === it._id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-xs font-bold text-black/60 sm:inline">
                      削除しますか？
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(it);
                        setConfirmId(null);
                      }}
                      className="rounded-full bg-rainbow-red px-3.5 py-1.5 text-xs font-bold text-white"
                    >
                      削除する
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="rounded-full border border-black/15 px-3.5 py-1.5 text-xs font-bold"
                    >
                      やめる
                    </button>
                  </div>
                ) : (
                  <>
                    {onTogglePublish && (
                      <button
                        type="button"
                        onClick={() => onTogglePublish(it)}
                        title={
                          it.published === false
                            ? "クリックで公開する"
                            : "クリックで非公開にする"
                        }
                        className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                          it.published === false
                            ? "bg-black/[0.06] text-black/45 hover:bg-black/10"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {it.published === false ? "非公開" : "公開中"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit(it)}
                      className="shrink-0 rounded-full border border-black/15 px-4 py-1.5 text-xs font-bold transition hover:border-black"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(it._id as string)}
                      aria-label="削除"
                      title="削除"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/35 transition hover:bg-rainbow-red/10 hover:text-rainbow-red"
                    >
                      <TrashIcon />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---- tenant settings form ----
function TenantForm({
  draft,
  setDraft,
  errors,
  onSave,
}: {
  draft: Record<string, unknown>;
  setDraft: (d: Record<string, unknown>) => void;
  errors: Record<string, string>;
  onSave: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <IconChip name="tenant" size="md" />
        <h1 className="text-xl font-extrabold md:text-2xl">店舗情報</h1>
      </div>
      <p className="mt-2 text-sm text-black/55">
        店名・住所・連絡先・SNSなどを編集できます。
      </p>
      <div className="mt-6 max-w-xl space-y-5 rounded-2xl border border-black/10 bg-white p-5 md:p-7">
        {TENANT_FIELDS.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={getPath(draft, f.key)}
            error={errors[f.key]}
            onChange={(v) => setDraft(setPath(draft, f.key, v))}
          />
        ))}

        <div className="border-t border-black/10 pt-5">
          <p className="text-sm font-extrabold">会社概要</p>
          <p className="mt-1 text-xs text-black/45">
            「私たちについて」ページの会社概要に表示されます。
          </p>
        </div>
        {TENANT_PROFILE_FIELDS.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={getPath(draft, f.key)}
            error={errors[f.key]}
            onChange={(v) => setDraft(setPath(draft, f.key, v))}
          />
        ))}

        <div className="pt-2">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- 私たちについて (settings + strengths list) ----
function AboutView({
  draft,
  setDraft,
  errors,
  onSave,
  strengths,
  onCreate,
  onEdit,
  onDelete,
}: {
  draft: Record<string, unknown>;
  setDraft: (d: Record<string, unknown>) => void;
  errors: Record<string, string>;
  onSave: () => void;
  strengths: AdminItem[];
  onCreate: () => void;
  onEdit: (item: AdminItem) => void;
  onDelete: (item: AdminItem) => void;
}) {
  const strengthsCfg = resourceByKey("strengths");
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <IconChip name="about" size="md" />
        <h1 className="text-xl font-extrabold md:text-2xl">私たちについて</h1>
      </div>
      <p className="mt-2 text-sm text-black/55">
        トップの紹介ブロックと「私たちについて」ページの内容を編集できます。
      </p>

      <div className="mt-6 max-w-xl space-y-5 rounded-2xl border border-black/10 bg-white p-5 md:p-7">
        {ABOUT_FIELDS.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={getPath(draft, f.key)}
            error={errors[f.key]}
            onChange={(v) => setDraft(setPath(draft, f.key, v))}
          />
        ))}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            保存する
          </button>
        </div>
      </div>

      {/* strong points cards (下層ページの「〇〇の強み」) */}
      {strengthsCfg && (
        <div className="mt-10">
          <ListView
            cfg={strengthsCfg}
            items={strengths}
            onCreate={onCreate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
}

// ---- editor drawer ----
function Drawer({
  title,
  onClose,
  onSave,
  onPreview,
  onDelete,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  onPreview?: () => void;
  onDelete?: () => void;
  children: ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    bodyRef.current
      ?.querySelector<HTMLElement>("input, textarea, select")
      ?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-stretch md:justify-end">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl md:h-full md:max-h-none md:rounded-none"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="text-base font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div
          ref={bodyRef}
          className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
        >
          {children}
        </div>

        <div className="flex items-center gap-3 border-t border-black/10 px-5 py-4">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            保存する
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-3 text-sm font-bold text-black/60 transition hover:text-black"
          >
            キャンセル
          </button>
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-3 text-sm font-bold transition hover:border-black"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              プレビュー
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="削除"
              className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-black/35 transition hover:bg-rainbow-red/10 hover:text-rainbow-red"
            >
              <TrashIcon />
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
