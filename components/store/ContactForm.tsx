"use client";

import { useState } from "react";
import { z } from "zod";

// Inquiry types — drives which fields are shown.
const TYPES = ["来店予約", "イベント予約", "お問い合わせ"] as const;
type InquiryType = (typeof TYPES)[number];

// Store locations for the reservation.
const STORES = ["店舗A", "店舗B"];
// Visit time slots: 9:00–17:00, hourly.
const TIMES = Array.from({ length: 9 }, (_, i) => `${9 + i}:00`);

// Validation schema — fields are conditionally required based on the inquiry type.
const schema = z
  .object({
    type: z.string().min(1, "お問い合わせ種別を選択してください"),
    event: z.string().optional(),
    store: z.string().optional(),
    date1: z.string().optional(),
    time1: z.string().optional(),
    date2: z.string().optional(),
    time2: z.string().optional(),
    adults: z.string().optional(),
    children: z.string().optional(),
    name: z.string().trim().min(1, "お名前を入力してください"),
    kana: z.string().trim().min(1, "フリガナを入力してください"),
    postal: z.string().optional(),
    address: z.string().optional(),
    tel: z
      .string()
      .trim()
      .min(1, "電話番号を入力してください")
      .regex(/^[0-9-]{10,}$/, "電話番号の形式が正しくありません"),
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスを入力してください")
      .email("メールアドレスの形式が正しくありません"),
    familyAdults: z.string().optional(),
    familyChildren: z.string().optional(),
    message: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const reserve = v.type === "来店予約" || v.type === "イベント予約";
    const add = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (v.type === "イベント予約" && !v.event)
      add("event", "ご希望のイベントを選択してください");

    if (reserve) {
      if (!v.store) add("store", "来場店舗を選択してください");
      if (!v.date1) add("date1", "第一希望の来場日を入力してください");
      if (!v.time1) add("time1", "第一希望の時間を選択してください");
      if (!v.adults || Number(v.adults) < 1)
        add("adults", "参加人数（大人）を1名以上でご入力ください");
      if (!v.address) add("address", "ご住所を入力してください");
    }

    if (v.type === "お問い合わせ" && (v.message ?? "").trim().length < 10)
      add("message", "お問い合わせ内容を10文字以上で入力してください");
  });

type Fields = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

const inputBase =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm transition focus:border-black focus:outline-none";

function Req() {
  return <span className="ml-1 text-rainbow-red">*</span>;
}
function Opt() {
  return <span className="ml-1 text-xs text-black/40">（任意）</span>;
}

export default function ContactForm({
  events,
}: {
  events: { id: number; title: string }[];
}) {
  const [type, setType] = useState<InquiryType>("来店予約");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // postal-code lookup → auto-fills the address field
  const [postal, setPostal] = useState("");
  const [address, setAddress] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState("");

  const isReserve = type === "来店予約" || type === "イベント予約";

  const lookupZip = async () => {
    const code = postal.replace(/[^0-9]/g, "");
    if (code.length !== 7) {
      setZipError("郵便番号は7桁で入力してください");
      return;
    }
    setZipError("");
    setZipLoading(true);
    try {
      const res = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`
      );
      const json = await res.json();
      const r = json?.results?.[0];
      if (r) {
        setAddress(`${r.address1}${r.address2}${r.address3}`);
      } else {
        setZipError("住所が見つかりませんでした。郵便番号をご確認ください。");
      }
    } catch {
      setZipError("住所の取得に失敗しました。時間をおいてお試しください。");
    } finally {
      setZipLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const result = schema.safeParse(data);
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document
        .getElementById(first)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Demo: simulate sending. Real delivery needs an email service set up by an engineer.
    setErrors({});
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
    }, 800);
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-center md:p-12">
        <p className="text-lg font-extrabold">送信が完了しました</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-black/70">
          ご予約・お問い合わせありがとうございます。担当者より追ってご連絡いたします。
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-black px-6 py-2.5 text-sm font-bold transition hover:bg-black hover:text-white"
        >
          続けて入力する
        </button>
      </div>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p className="mt-1 text-xs font-bold text-rainbow-red">{errors[k]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 text-left">
      {/* お問い合わせ種別 */}
      <fieldset>
        <legend className="mb-2 block text-sm font-bold">
          お問い合わせ種別
          <Req />
        </legend>
        <div className="flex flex-wrap gap-3" id="type">
          {TYPES.map((t) => (
            <label
              key={t}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                type === t
                  ? "border-black bg-black text-white"
                  : "border-black/15 hover:border-black"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>

      {/* イベント選択（イベント予約のときのみ） */}
      {type === "イベント予約" && (
        <div>
          <label htmlFor="event" className="mb-1.5 block text-sm font-bold">
            ご希望のイベント
            <Req />
          </label>
          <select id="event" name="event" defaultValue="" className={inputBase}>
            <option value="" disabled>
              イベントを選択してください
            </option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.title}>
                {ev.title}
              </option>
            ))}
          </select>
          {err("event")}
        </div>
      )}

      {/* 予約系の項目（来店予約・イベント予約のときのみ） */}
      {isReserve && (
        <>
          {/* 来場店舗 */}
          <fieldset>
            <legend className="mb-2 block text-sm font-bold">
              来場店舗
              <Req />
            </legend>
            <div className="flex flex-wrap gap-3" id="store">
              {STORES.map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/15 px-4 py-2.5 text-sm transition hover:border-black"
                >
                  <input
                    type="radio"
                    name="store"
                    value={s}
                    className="accent-black"
                  />
                  {s}
                </label>
              ))}
            </div>
            {err("store")}
          </fieldset>

          {/* 来場予定日 第一希望 */}
          <div>
            <label htmlFor="date1" className="mb-1.5 block text-sm font-bold">
              来場予定日　第一希望
              <Req />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="date1"
                name="date1"
                type="date"
                className={inputBase}
              />
              <select name="time1" defaultValue="" className={inputBase}>
                <option value="" disabled>
                  時間を選択
                </option>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {err("date1")}
            {err("time1")}
          </div>

          {/* 来場予定日 第二希望 */}
          <div>
            <label htmlFor="date2" className="mb-1.5 block text-sm font-bold">
              来場予定日　第二希望
              <Opt />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="date2"
                name="date2"
                type="date"
                className={inputBase}
              />
              <select name="time2" defaultValue="" className={inputBase}>
                <option value="">時間を選択</option>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 参加希望人数 */}
          <div>
            <label htmlFor="adults" className="mb-1.5 block text-sm font-bold">
              参加希望人数
              <Req />
            </label>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">大人</span>
                <input
                  id="adults"
                  name="adults"
                  type="number"
                  min={0}
                  placeholder="0"
                  className={`${inputBase} w-24`}
                />
                <span className="text-sm">名</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">お子様</span>
                <input
                  name="children"
                  type="number"
                  min={0}
                  placeholder="0"
                  className={`${inputBase} w-24`}
                />
                <span className="text-sm">名</span>
              </div>
            </div>
            {err("adults")}
          </div>
        </>
      )}

      {/* お名前 / フリガナ */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-bold">
            お名前
            <Req />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="山田 太郎"
            className={inputBase}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="kana" className="mb-1.5 block text-sm font-bold">
            フリガナ
            <Req />
          </label>
          <input
            id="kana"
            name="kana"
            type="text"
            placeholder="ヤマダ タロウ"
            className={inputBase}
          />
          {err("kana")}
        </div>
      </div>

      {/* 郵便番号 → 住所自動入力 */}
      <div>
        <label htmlFor="postal" className="mb-1.5 block text-sm font-bold">
          郵便番号
          <Opt />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="postal"
            name="postal"
            type="text"
            inputMode="numeric"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            placeholder="123-4567"
            className={`${inputBase} max-w-[12rem]`}
          />
          <button
            type="button"
            onClick={lookupZip}
            disabled={zipLoading}
            className="rounded-full border border-black px-4 py-2.5 text-xs font-bold transition hover:bg-black hover:text-white disabled:opacity-60"
          >
            {zipLoading ? "検索中..." : "住所を自動入力"}
          </button>
        </div>
        {zipError && (
          <p className="mt-1 text-xs font-bold text-rainbow-red">{zipError}</p>
        )}
      </div>

      {/* ご住所 */}
      <div>
        <label htmlFor="address" className="mb-1.5 block text-sm font-bold">
          ご住所
          {isReserve ? <Req /> : <Opt />}
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="〇〇県〇〇市〇〇町1-2-3"
          className={inputBase}
        />
        {err("address")}
      </div>

      {/* 電話番号 / メールアドレス */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="tel" className="mb-1.5 block text-sm font-bold">
            電話番号
            <Req />
          </label>
          <input
            id="tel"
            name="tel"
            type="tel"
            placeholder="090-1234-5678"
            className={inputBase}
          />
          {err("tel")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold">
            メールアドレス
            <Req />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className={inputBase}
          />
          {err("email")}
        </div>
      </div>

      {/* 家族構成（予約系のみ） */}
      {isReserve && (
        <div>
          <label className="mb-1.5 block text-sm font-bold">
            家族構成
            <Opt />
          </label>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">大人</span>
              <input
                name="familyAdults"
                type="number"
                min={0}
                placeholder="0"
                className={`${inputBase} w-24`}
              />
              <span className="text-sm">名</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">お子様</span>
              <input
                name="familyChildren"
                type="number"
                min={0}
                placeholder="0"
                className={`${inputBase} w-24`}
              />
              <span className="text-sm">名</span>
            </div>
          </div>
        </div>
      )}

      {/* ご相談内容 */}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-bold">
          {type === "お問い合わせ" ? "お問い合わせ内容" : "ご相談内容"}
          {type === "お問い合わせ" ? <Req /> : <Opt />}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="ご相談・ご質問の内容をご記入ください。"
          className={`${inputBase} resize-y`}
        />
        {err("message")}
      </div>

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-10 py-3.5 text-sm font-bold text-white transition hover:bg-rainbow-red disabled:opacity-60"
        >
          {sending ? "送信中..." : "この内容で送信する"}
        </button>
      </div>
    </form>
  );
}
