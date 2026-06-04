"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/ariakit/style.css";
import { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";

type Task = {
  id: string;
  title: string;
  content: unknown[]; // BlockNote document (JSON)
  date: string;
};

const STORAGE_KEY = "unstandard-demo-tasks";

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Demo-side image optimization: cap the longest edge and re-encode (WebP/JPEG)
// so embedded images stay small. In phase 2 this is replaced by storage upload.
async function optimizeImage(file: File, maxSize = 1280, quality = 0.8) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return readAsDataURL(file); // skip non-image / animated GIF
  }
  const src = await readAsDataURL(file);
  const img = await loadImage(src);
  let { width, height } = img;
  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0, width, height);
  const webp = canvas.toDataURL("image/webp", quality);
  return webp.startsWith("data:image/webp")
    ? webp
    : canvas.toDataURL("image/jpeg", quality);
}

export default function TaskTool() {
  // Demo: embed uploaded images inline (data URL) since there's no storage yet.
  // In phase 2 this returns a real uploaded file URL instead.
  const editor = useCreateBlockNote({
    uploadFile: (file: File) => optimizeImage(file),
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // load from this browser
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setTitle("");
    setEditingId(null);
    editor.replaceBlocks(editor.document, [{ type: "paragraph" }]);
  };

  const handleSave = () => {
    const content = editor.document as unknown[];
    const now = new Date().toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (editingId) {
      persist(
        tasks.map((t) =>
          t.id === editingId
            ? { ...t, title: title || "無題のタスク", content, date: now }
            : t,
        ),
      );
    } else {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now());
      persist([
        { id, title: title || "無題のタスク", content, date: now },
        ...tasks,
      ]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    reset();
  };

  const loadTask = (t: Task) => {
    setTitle(t.title);
    setEditingId(t.id);
    editor.replaceBlocks(
      editor.document,
      (t.content as Parameters<typeof editor.replaceBlocks>[1]) ?? [],
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (id: string) => {
    persist(tasks.filter((t) => t.id !== id));
    if (editingId === id) reset();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* editor */}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクのタイトルを入力"
          className="w-full border-b border-black/15 pb-3 text-2xl font-extrabold outline-none placeholder:text-black/30"
        />
        <p className="mt-3 text-xs text-black/40">
          本文で「/」を入力するとブロック（見出し・箇条書き・チェックリスト・画像など）を追加できます。
        </p>
        <div className="mt-4 rounded-2xl border border-black/15 bg-white py-4">
          <BlockNoteView editor={editor} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition hover:bg-black/80"
          >
            {editingId ? "更新する" : "作成する"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-black px-6 py-2.5 text-sm font-bold transition hover:bg-black/5"
            >
              新規作成
            </button>
          )}
          {saved && (
            <span className="text-sm font-bold text-black/50">
              保存しました（このブラウザ内）
            </span>
          )}
        </div>
      </div>

      {/* task list */}
      <aside className="lg:border-l lg:border-black/10 lg:pl-8">
        <p className="text-sm font-bold text-black/40">作成したタスク</p>
        {tasks.length === 0 ? (
          <p className="mt-4 text-sm text-black/40">
            まだタスクがありません。左で作成してください。
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className={`rounded-xl border p-3 transition ${
                  editingId === t.id
                    ? "border-black bg-black/5"
                    : "border-black/10 hover:bg-black/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => loadTask(t)}
                  className="block w-full text-left"
                >
                  <p className="truncate text-sm font-bold">{t.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-black/40">
                    {t.date}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="mt-2 text-[11px] font-bold text-black/40 underline hover:text-black"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
