"use client";

import dynamic from "next/dynamic";
import Container from "@/components/Container";

// BlockNote is client-only; load without SSR.
const TaskTool = dynamic(() => import("@/components/TaskTool"), { ssr: false });

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-black/10 bg-white">
        <Container className="flex h-16 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unstandard-logo.svg" alt="UNSTANDARD" className="h-6 w-auto" />
          <span className="text-sm font-bold text-black/60">社内ツール（デモ）</span>
        </Container>
      </header>

      <Container className="py-10 md:py-14">
        <p className="font-display text-sm font-bold tracking-widest text-black/40">
          TASKS
        </p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
          タスク・指示の作成
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/60">
          フェーズ2でチームがタスクを作成・指示する画面のイメージです。Notionのようにブロックを組み合わせて指示を書けます。
          <br />
          ※ これはデモです。保存はこのブラウザ内のみ。ログイン・共有・本格的な保存はフェーズ2でエンジニアが対応します。
        </p>

        <div className="mt-10">
          <TaskTool />
        </div>
      </Container>
    </div>
  );
}
