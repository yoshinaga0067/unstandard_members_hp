"use client";

import { useRef, useState } from "react";
import type { Field } from "./resources";
import type { ContentBlock } from "@/types";

// ---- nested-key helpers (for tenant social.* fields) ----
export function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined),
      obj
    );
}

export function setPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".");
  const next: Record<string, unknown> = { ...obj };
  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = { ...((cur[k] as Record<string, unknown>) ?? {}) };
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return next;
}

// Read a file straight to a data URL (no canvas re-encode).
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

// Import a picked image as a data URL that persists in localStorage.
// Accepts any image format:
//  - SVG / GIF are kept as-is (canvas would rasterise / drop animation)
//  - PNG / WebP keep transparency (logos), opaque ones compress to JPEG
//  - everything else is downscaled + compressed to JPEG
function fileToDataUrl(file: File, max = 1280): Promise<string> {
  const type = file.type;
  if (type === "image/svg+xml" || type === "image/gif") {
    return readAsDataUrl(file);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode error"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        // keep transparency for PNG/WebP; compress opaque images as JPEG
        let transparent = false;
        if (type === "image/png" || type === "image/webp") {
          try {
            const d = ctx.getImageData(0, 0, w, h).data;
            for (let i = 3; i < d.length; i += 4) {
              if (d[i] < 255) {
                transparent = true;
                break;
              }
            }
          } catch {
            transparent = true; // if we can't inspect it, keep the format
          }
        }
        resolve(
          transparent
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.85)
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const inputBase =
  "w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/15";

const chip = (active: boolean) =>
  `min-h-[40px] rounded-full border px-3.5 py-1.5 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
    active
      ? "border-black bg-black text-white"
      : "border-black/15 text-black/70 hover:border-black"
  }`;

// note-style block editor: a stack of heading / text / image blocks
function BlocksEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (b: ContentBlock[]) => void;
}) {
  const [busyIdx, setBusyIdx] = useState<number | null>(null);

  const patch = (
    i: number,
    p: { text?: string; src?: string; caption?: string }
  ) =>
    onChange(
      blocks.map((b, idx) => {
        if (idx !== i) return b;
        if (b.type === "image")
          return {
            type: "image",
            src: p.src ?? b.src,
            caption: p.caption ?? b.caption,
          };
        return { type: b.type, text: p.text ?? b.text };
      })
    );
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) =>
    onChange(blocks.filter((_, idx) => idx !== i));
  const add = (type: ContentBlock["type"]) =>
    onChange([
      ...blocks,
      type === "image"
        ? { type: "image", src: "", caption: "" }
        : { type, text: "" },
    ]);

  const typeLabel: Record<ContentBlock["type"], string> = {
    heading: "見出し",
    text: "文章",
    image: "画像",
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <p className="rounded-xl border border-dashed border-black/15 px-4 py-5 text-center text-xs text-black/45">
          下のボタンから「見出し」「文章」「画像」を足して、記事のように組み立てられます。
        </p>
      )}

      {blocks.map((b, i) => (
        <div
          key={i}
          className="rounded-2xl border border-black/10 bg-neutral-50 p-3"
        >
          {/* block toolbar */}
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-bold text-black/60">
              {typeLabel[b.type]}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="上へ移動"
                className="flex h-7 w-7 items-center justify-center rounded-full text-black/50 transition hover:bg-black/5 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
                aria-label="下へ移動"
                className="flex h-7 w-7 items-center justify-center rounded-full text-black/50 transition hover:bg-black/5 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="このブロックを削除"
                className="flex h-7 w-7 items-center justify-center rounded-full text-black/40 transition hover:bg-rainbow-red/10 hover:text-rainbow-red"
              >
                ✕
              </button>
            </div>
          </div>

          {/* block body */}
          {b.type === "heading" && (
            <input
              type="text"
              value={b.text}
              onChange={(e) => patch(i, { text: e.target.value })}
              placeholder="見出し（例：視線の抜けを設計する）"
              className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-base font-bold transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/15"
            />
          )}
          {b.type === "text" && (
            <textarea
              value={b.text}
              onChange={(e) => patch(i, { text: e.target.value })}
              rows={4}
              placeholder="文章を入力"
              className="w-full resize-y rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/15"
            />
          )}
          {b.type === "image" && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-neutral-100 text-[11px] text-black/40">
                  {b.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "なし"
                  )}
                  {busyIdx === i && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <svg className="h-6 w-6 animate-spin text-black/60" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </div>
                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-black px-4 py-2 text-xs font-bold transition hover:bg-black hover:text-white">
                  {busyIdx === i ? "読み込み中…" : b.src ? "画像を変更" : "画像を選ぶ"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busyIdx === i}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setBusyIdx(i);
                      try {
                        patch(i, { src: await fileToDataUrl(file) });
                      } catch {
                        window.alert(
                          "この画像は読み込めませんでした。別のファイルをお試しください。"
                        );
                      } finally {
                        setBusyIdx(null);
                      }
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={b.caption ?? ""}
                onChange={(e) => patch(i, { caption: e.target.value })}
                placeholder="キャプション（任意）"
                className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-xs transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/15"
              />
            </div>
          )}
        </div>
      ))}

      {/* add-block buttons */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["heading", "＋ 見出し"],
            ["text", "＋ 文章"],
            ["image", "＋ 画像"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => add(t)}
            className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold transition hover:border-black"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
}) {
  const [imgBusy, setImgBusy] = useState(false);
  const id = `f-${field.key.replace(/\./g, "-")}`;

  // local buffer for paragraph text so typing doesn't reset the caret
  const joined = Array.isArray(value) ? (value as string[]).join("\n\n") : "";
  const [para, setPara] = useState(joined);
  const lastExt = useRef(joined);
  if (field.type === "paragraphs" && joined !== lastExt.current) {
    lastExt.current = joined;
    setPara(joined);
  }
  const commitPara = (text: string) =>
    onChange(
      text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    );

  const control = () => {
    switch (field.type) {
      case "text":
      case "url":
        return (
          <input
            id={id}
            type={field.type === "url" ? "url" : "text"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputBase}
          />
        );

      case "textarea":
        return (
          <textarea
            id={id}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={5}
            className={`${inputBase} resize-y`}
          />
        );

      case "paragraphs":
        return (
          <textarea
            id={id}
            value={para}
            onChange={(e) => setPara(e.target.value)}
            onBlur={() => commitPara(para)}
            placeholder={field.placeholder}
            rows={7}
            className={`${inputBase} resize-y`}
          />
        );

      case "date": {
        const v = typeof value === "string" ? value.replace(/\./g, "-") : "";
        return (
          <input
            id={id}
            type="date"
            value={v}
            onChange={(e) => onChange(e.target.value.replace(/-/g, "."))}
            className={`${inputBase} w-auto`}
          />
        );
      }

      case "select":
        return (
          <div role="radiogroup" aria-label={field.label} className="flex flex-wrap gap-2">
            {(field.options ?? []).map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={value === opt}
                onClick={() => onChange(opt)}
                className={chip(value === opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "chips": {
        const list = Array.isArray(value) ? (value as string[]) : [];
        const toggle = (opt: string) =>
          onChange(
            list.includes(opt) ? list.filter((t) => t !== opt) : [...list, opt]
          );
        return (
          <div role="group" aria-label={field.label} className="flex flex-wrap gap-2">
            {(field.options ?? []).map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={list.includes(opt)}
                onClick={() => toggle(opt)}
                className={chip(list.includes(opt))}
              >
                {opt}
              </button>
            ))}
            {list
              .filter((t) => !(field.options ?? []).includes(t))
              .map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed
                  onClick={() => toggle(t)}
                  className={chip(true)}
                >
                  {t} ✕
                </button>
              ))}
          </div>
        );
      }

      case "toggle":
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={value === true}
              aria-label={field.label}
              onClick={() => onChange(value !== true)}
              className={`relative h-7 w-12 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                value === true ? "bg-black" : "bg-black/20"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  value === true ? "left-6" : "left-1"
                }`}
              />
            </button>
            <span className="text-xs font-bold text-black/55">
              {value === true ? "オン" : "オフ"}
            </span>
          </div>
        );

      case "image": {
        const src = typeof value === "string" ? value : "";
        return (
          <div className="flex items-center gap-3">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-neutral-100 text-[11px] text-black/40">
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="h-full w-full object-cover" />
              ) : (
                "なし"
              )}
              {imgBusy && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <svg className="h-6 w-6 animate-spin text-black/60" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-black px-4 py-2 text-xs font-bold transition hover:bg-black hover:text-white">
                {imgBusy ? "読み込み中…" : "画像を選ぶ"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={imgBusy}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImgBusy(true);
                    try {
                      onChange(await fileToDataUrl(file));
                    } catch {
                      window.alert(
                        "この画像は読み込めませんでした。JPG・PNG・WebP・SVG などでお試しください（iPhoneのHEICは取り込めない場合があります）。"
                      );
                    } finally {
                      setImgBusy(false);
                    }
                  }}
                />
              </label>
              {src && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="w-fit text-xs font-bold text-rainbow-red"
                >
                  画像を削除
                </button>
              )}
            </div>
          </div>
        );
      }

      case "images": {
        const list = Array.isArray(value) ? (value as string[]) : [];
        const max = field.maxImages ?? 8;
        const move = (i: number, dir: -1 | 1) => {
          const j = i + dir;
          if (j < 0 || j >= list.length) return;
          const next = [...list];
          [next[i], next[j]] = [next[j], next[i]];
          onChange(next);
        };
        const removeAt = (i: number) =>
          onChange(list.filter((_, idx) => idx !== i));
        return (
          <div role="group" aria-label={field.label} className="space-y-3">
            {list.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {list.map((src, i) => (
                  <li
                    key={i}
                    className="relative h-20 w-20 overflow-hidden rounded-xl border border-black/10 bg-neutral-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      aria-label="この画像を削除"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white"
                    >
                      ✕
                    </button>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/45 text-sm">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="前へ移動"
                        className="px-2 py-0.5 text-white disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === list.length - 1}
                        aria-label="後ろへ移動"
                        className="px-2 py-0.5 text-white disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-black px-4 py-2 text-xs font-bold transition hover:bg-black hover:text-white">
              {imgBusy ? "読み込み中…" : `画像を追加（${list.length}/${max}）`}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={imgBusy}
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  if (!files.length) return;
                  const room = max - list.length;
                  if (room <= 0) {
                    window.alert(`画像は最大${max}枚までです。`);
                    return;
                  }
                  setImgBusy(true);
                  try {
                    const added: string[] = [];
                    for (const file of files.slice(0, room)) {
                      added.push(await fileToDataUrl(file, 1080));
                    }
                    onChange([...list, ...added]);
                    if (files.length > room)
                      window.alert(
                        `画像は最大${max}枚までです。${room}枚だけ追加しました。`
                      );
                  } catch {
                    window.alert(
                      "読み込めない画像がありました。JPG・PNG・WebP・SVG などでお試しください（iPhoneのHEICは取り込めない場合があります）。"
                    );
                  } finally {
                    setImgBusy(false);
                  }
                }}
              />
            </label>
          </div>
        );
      }

      case "blocks": {
        const blocks = Array.isArray(value) ? (value as ContentBlock[]) : [];
        return <BlocksEditor blocks={blocks} onChange={(b) => onChange(b)} />;
      }

      default:
        return null;
    }
  };

  // group controls describe themselves via aria-label, so only bind label→input
  // for the single-control field types
  const labelFor = ["text", "url", "textarea", "paragraphs", "date"].includes(
    field.type
  )
    ? id
    : undefined;

  return (
    <div id={`field-${field.key.replace(/\./g, "-")}`} className="scroll-mt-20">
      <label
        htmlFor={labelFor}
        className="mb-1.5 flex items-center gap-1 text-sm font-bold"
      >
        {field.label}
        {field.required && <span className="text-rainbow-red">*</span>}
      </label>
      {field.help && <p className="mb-2 text-xs text-black/45">{field.help}</p>}
      {control()}
      {error && (
        <p className="mt-1 text-xs font-bold text-rainbow-red">{error}</p>
      )}
    </div>
  );
}
