"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { HomeReadableText } from "./readable-text";

type BentoCellCopy = HomeContent["redesign"]["bento"]["cells"][number];

type BentoVisualCopy = {
  readonly illustrationLabel: string;
  readonly pageStack: readonly [
    { readonly title: string; readonly citations: string },
    { readonly title: string; readonly citations: string },
    { readonly title: string; readonly citations: string },
  ];
  readonly graph: {
    readonly memory: string;
    readonly person: string;
    readonly project: string;
    readonly page: string;
  };
  readonly citations: {
    readonly heading: string;
    readonly body: string;
    readonly source: string;
    readonly from: string;
  };
  readonly review: {
    readonly label: string;
    readonly confidence: string;
    readonly current: string;
    readonly previous: string;
    readonly supersede: string;
    readonly keepBoth: string;
  };
  readonly nurture: readonly [string, string, string];
  readonly spaces: readonly [string, string, string];
  readonly git: readonly [string, string, string];
  readonly mcp: {
    readonly clients: readonly string[];
    readonly sharedMemory: string;
    readonly localDaemon: string;
  };
};

const bentoVisualCopy: Record<Locale, BentoVisualCopy> = {
  en: {
    illustrationLabel: "Illustrative product artifacts · not live product output",
    pageStack: [
      { title: "Migration plan", citations: "6 sources cited" },
      { title: "Runbook", citations: "8 sources cited" },
      { title: "Architecture map", citations: "10 sources cited" },
    ],
    graph: { memory: "rollback fix", person: "person: Dana", project: "project: checkout", page: "page: usability" },
    citations: {
      heading: "# Architecture map",
      body: "Search writes go through the ingest daemon; the API crate only reads.",
      source: "[1] mem_0142 · decision",
      from: "from",
    },
    review: {
      label: "contradiction",
      confidence: "low confidence",
      current: "new: “staging deploys from main”",
      previous: "mem_0087: “staging deploys from release branches”",
      supersede: "supersede",
      keepBoth: "keep both",
    },
    nurture: ["linked Dana to checkout redesign", "refreshed page: architecture map", "faded 3 stale memories"],
    spaces: ["space: work", "space: personal", "space: client-arden"],
    git: ["distill: architecture map", "capture: rollback lesson", "handoff: session close"],
    mcp: { clients: ["Claude Code", "Cursor", "Codex", "Claude Desktop", "VS Code", "Antigravity"], sharedMemory: "one shared memory", localDaemon: "local daemon · plain files" },
  },
  "zh-TW": {
    illustrationLabel: "功能示意，非即時產品輸出",
    pageStack: [
      { title: "遷移計畫", citations: "6 個來源" },
      { title: "Runbook", citations: "8 個來源" },
      { title: "架構圖", citations: "10 個來源" },
    ],
    graph: { memory: "rollback 修正", person: "人物：Dana", project: "專案：checkout", page: "頁面：usability" },
    citations: {
      heading: "# 架構圖",
      body: "搜尋索引由背景服務統一寫入；查詢端只負責讀取。",
      source: "[1] mem_0142 · 決策",
      from: "來自",
    },
    review: {
      label: "矛盾",
      confidence: "低信心",
      current: "新內容：「staging 從 main 部署」",
      previous: "mem_0087：「staging 從 release branches 部署」",
      supersede: "取代",
      keepBoth: "兩者保留",
    },
    nurture: ["已將 Dana 連結到 checkout redesign", "已更新頁面：架構圖", "已標記 3 個過時 memory"],
    spaces: ["space: 工作", "space: 個人", "space: client-arden"],
    git: ["蒸餾：架構圖", "捕捉：rollback 教訓", "交接：結束 session"],
    mcp: { clients: ["Claude Code", "Cursor", "Codex", "Claude Desktop", "VS Code", "Antigravity"], sharedMemory: "共用一份知識", localDaemon: "本機服務 · 純文字檔案" },
  },
  "zh-CN": {
    illustrationLabel: "功能示意，非实时产品输出",
    pageStack: [
      { title: "迁移计划", citations: "6 个来源" },
      { title: "Runbook", citations: "8 个来源" },
      { title: "架构图", citations: "10 个来源" },
    ],
    graph: { memory: "rollback 修复", person: "人物：Dana", project: "项目：checkout", page: "页面：usability" },
    citations: {
      heading: "# 架构图",
      body: "搜索索引由后台服务统一写入；查询端只负责读取。",
      source: "[1] mem_0142 · 决策",
      from: "来自",
    },
    review: {
      label: "矛盾",
      confidence: "低信心",
      current: "新内容：“staging 从 main 部署”",
      previous: "mem_0087：“staging 从 release branches 部署”",
      supersede: "取代",
      keepBoth: "两者保留",
    },
    nurture: ["已将 Dana 连接到 checkout redesign", "已更新页面：架构图", "已标记 3 个过时 memory"],
    spaces: ["space: 工作", "space: 个人", "space: client-arden"],
    git: ["蒸馏：架构图", "捕捉：rollback 教训", "交接：结束 session"],
    mcp: { clients: ["Claude Code", "Cursor", "Codex", "Claude Desktop", "VS Code", "Antigravity"], sharedMemory: "共用一份知识", localDaemon: "本地服务 · 纯文本文件" },
  },
};

/**
 * Bento: what the pages give you. Each cell carries a bespoke visual that
 * demonstrates its claim: the page stack fans, the recall graph lights its
 * typed neighborhood (person, project, page), the citation traces back to
 * its source memory, the review queue surfaces a contradiction, spaces pull
 * apart, the git rail lights in commit order, and every MCP client converges
 * on one store. Cells land staggered on first scroll-in (final state by
 * default, same contract as pains.tsx). Cell titles and bodies come from the dictionary; the
 * artifact internals are illustrative tool output, with short narrative
 * labels localized beside the component.
 */

type Stage = "final" | "pre" | "played";

function BentoCell({
  accent,
  body,
  children,
  className = "",
  landDelay,
  pre,
  title,
}: {
  accent: string;
  body: string;
  children: React.ReactNode;
  className?: string;
  landDelay: string;
  pre: boolean;
  title: string;
}) {
  return (
    <div
      className={`transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${pre ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"} ${className}`}
      style={{ transitionDelay: landDelay }}
    >
      <div
        className="home-panel rounded-lg group relative flex h-full flex-col overflow-hidden border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-6 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--cell-accent)_30%,var(--o-border))]"
        style={{ "--cell-accent": accent } as React.CSSProperties}
      >
        <h3 className="relative font-serif text-xl font-medium tracking-tight">{title}</h3>
        <p className="relative mt-2 max-w-md text-base leading-relaxed text-pretty text-[var(--o-text-secondary)]"><HomeReadableText>{body}</HomeReadableText></p>
        <div className="relative mt-auto pt-6">{children}</div>
      </div>
    </div>
  );
}

const chipBase =
  "rounded border border-[var(--o-border)] bg-[var(--o-surface)] px-2 py-1 transition-colors duration-300 motion-reduce:transition-none";

/* The recall neighborhood: one memory, its typed context. Node shapes carry
   the type (circle = person, folder = project, document = page); hovering
   the cell walks the edges outward in order. */
function RecallGraph({ copy }: { readonly copy: BentoVisualCopy["graph"] }) {
  const edgeBase = "fill-none transition-[stroke] duration-300 motion-reduce:transition-none";
  const labelBase = "font-mono text-[10px] transition-[fill] duration-300 motion-reduce:transition-none";
  return (
    <svg viewBox="0 0 340 176" className="h-40 w-full" aria-hidden="true">
      <path
        d="M144 88 C 164 88, 170 30, 192 30"
        strokeWidth="1.2"
        className={`${edgeBase} stroke-[var(--o-border)] group-hover:stroke-[var(--o-indigo)]`}
      />
      <path
        d="M144 88 L 193 88"
        strokeWidth="1.2"
        className={`${edgeBase} stroke-[var(--o-border)] delay-[120ms] group-hover:stroke-[var(--o-warm)]`}
      />
      <path
        d="M144 88 C 164 88, 170 146, 192 146"
        strokeWidth="1.2"
        className={`${edgeBase} stroke-[var(--o-border)] delay-[240ms] group-hover:stroke-[var(--o-sage)]`}
      />

      {/* entities link to each other too: Dana works on checkout, checkout is documented by the page */}
      <path
        d="M213 42.5 C 221 54, 221 66, 213 78"
        strokeWidth="1.1"
        strokeDasharray="3 3"
        className={`${edgeBase} stroke-[var(--o-border)] delay-[360ms] group-hover:stroke-[color-mix(in_srgb,var(--o-indigo)_50%,var(--o-warm))]`}
      />
      <path
        d="M213 99 C 221 110, 221 121, 213 132"
        strokeWidth="1.1"
        strokeDasharray="3 3"
        className={`${edgeBase} stroke-[var(--o-border)] delay-[440ms] group-hover:stroke-[color-mix(in_srgb,var(--o-warm)_50%,var(--o-sage))]`}
      />

      {/* the memory that was recalled */}
      <rect x="16" y="72" width="128" height="32" rx="7" className="fill-[var(--o-surface)] stroke-[var(--o-border)]" />
      <circle cx="32" cy="88" r="3" className="fill-[var(--o-warm)]" />
      <text x="42" y="91.5" className="fill-[var(--o-text-secondary)] font-mono text-[11px]">
        {copy.memory}
      </text>

      {/* person: circle */}
      <circle
        cx="208"
        cy="30"
        r="13"
        className="fill-[var(--o-surface)] stroke-[color-mix(in_srgb,var(--o-indigo)_55%,var(--o-border))] transition-[stroke] duration-300 motion-reduce:transition-none group-hover:stroke-[var(--o-indigo)]"
        strokeWidth="1.2"
      />
      <circle cx="208" cy="26.5" r="3" className="fill-none stroke-[var(--o-indigo)]" strokeWidth="1.3" />
      <path d="M202 36.5 C 202 32, 214 32, 214 36.5" className="fill-none stroke-[var(--o-indigo)]" strokeWidth="1.3" strokeLinecap="round" />
      <text x="228" y="33.5" className={`${labelBase} fill-[var(--o-text-muted)] group-hover:fill-[var(--o-indigo)]`}>
        {copy.person}
      </text>

      {/* project: folder */}
      <rect
        x="196"
        y="80"
        width="24"
        height="17"
        rx="3"
        className="fill-[var(--o-surface)] stroke-[color-mix(in_srgb,var(--o-warm)_55%,var(--o-border))] transition-[stroke] duration-300 motion-reduce:transition-none delay-[120ms] group-hover:stroke-[var(--o-warm)]"
        strokeWidth="1.2"
      />
      <path d="M200 80 v-1.5 a2 2 0 0 1 2 -2 h5.5 l3 3.5" className="fill-none stroke-[var(--o-warm)]" strokeWidth="1.2" strokeLinecap="round" />
      <text x="228" y="91.5" className={`${labelBase} fill-[var(--o-text-muted)] delay-[120ms] group-hover:fill-[var(--o-warm)]`}>
        {copy.project}
      </text>

      {/* page: document with folded corner */}
      <path
        d="M198 134 h13 l7 7 v17 a2 2 0 0 1 -2 2 h-16 a2 2 0 0 1 -2 -2 v-22 a2 2 0 0 1 2 -2 z"
        className="fill-[var(--o-surface)] stroke-[color-mix(in_srgb,var(--o-sage)_55%,var(--o-border))] transition-[stroke] duration-300 motion-reduce:transition-none delay-[240ms] group-hover:stroke-[var(--o-sage)]"
        strokeWidth="1.2"
      />
      <path d="M211 134 v7 h7" className="fill-none stroke-[var(--o-sage)]" strokeWidth="1.1" />
      <path d="M202 149 h10 M202 154 h10" className="stroke-[var(--o-sage)] opacity-60" strokeWidth="1" />
      <text x="228" y="149.5" className={`${labelBase} fill-[var(--o-text-muted)] delay-[240ms] group-hover:fill-[var(--o-sage)]`}>
        {copy.page}
      </text>
    </svg>
  );
}

/* Per-cell layout, accent, land order, and artifact. Copy comes from the
   dictionary and joins by id. */
const cellChrome: Record<string, { accent: string; span: string; delayMs: number }> = {
  pages: { accent: "var(--o-warm)", span: "sm:col-span-2 lg:col-span-6", delayMs: 0 },
  graph: { accent: "var(--o-indigo)", span: "sm:col-span-2 lg:col-span-6", delayMs: 90 },
  citations: { accent: "var(--o-warm)", span: "sm:col-span-1 lg:col-span-4", delayMs: 180 },
  review: { accent: "var(--o-amber)", span: "sm:col-span-1 lg:col-span-4", delayMs: 270 },
  nurture: { accent: "var(--o-sage)", span: "sm:col-span-1 lg:col-span-4", delayMs: 360 },
  spaces: { accent: "var(--o-warm)", span: "sm:col-span-1 lg:col-span-4", delayMs: 430 },
  git: { accent: "var(--o-warm)", span: "sm:col-span-1 lg:col-span-4", delayMs: 500 },
  mcp: { accent: "var(--o-warm)", span: "sm:col-span-1 lg:col-span-4", delayMs: 570 },
};

const cellArtifacts = (visual: BentoVisualCopy): Record<string, React.ReactNode> => ({
  pages: (
    <div className="relative mx-auto h-40 w-full max-w-[19rem] sm:h-44">
      {visual.pageStack.map((page, index) => (
        <div
          key={page.title}
          className={`absolute ${index === 0 ? "top-0 left-0 opacity-60 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:-rotate-1" : index === 1 ? "top-7 left-2 opacity-80 sm:left-4 group-hover:-translate-y-0.5" : "top-14 left-4 sm:left-8 group-hover:translate-x-1.5 group-hover:translate-y-1 group-hover:rotate-1 group-hover:shadow-[0_10px_28px_rgba(26,26,46,0.10)]"} w-[calc(100%_-_1rem)] rounded-md border border-[var(--o-border)] bg-[var(--o-surface)] px-4 py-3 shadow-[0_4px_16px_rgba(26,26,46,0.06)] transition-all duration-300 ease-out motion-reduce:transition-none`}
        >
          <p className="text-[13px] font-medium">{page.title}</p>
          <p className="mt-0.5 font-mono text-[11px] tabular-nums text-[var(--o-text-muted)]">{page.citations}</p>
        </div>
      ))}
    </div>
  ),
  graph: <RecallGraph copy={visual.graph} />,
  citations: (
    <div>
      <div className="rounded-md border border-[var(--o-border-subtle)] bg-[var(--o-surface)] p-3.5">
        <p className="font-mono text-[13px] text-[var(--o-text)]">{visual.citations.heading}</p>
        <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-[var(--o-text-secondary)]">
          {visual.citations.body}
          <sup className="ml-0.5 font-medium text-[var(--o-warm)] transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100">[1]</sup>
        </p>
      </div>
      <div className="ml-6 h-5 w-px origin-top scale-y-50 bg-[var(--o-border)] transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none delay-[120ms] group-hover:scale-y-100 group-hover:bg-[var(--o-warm)]" />
      <div className="flex min-w-0 flex-col items-start gap-2 font-mono text-[12px]">
        <span className={`${chipBase} delay-[240ms] group-hover:border-[color-mix(in_srgb,var(--o-warm)_40%,var(--o-border))] group-hover:text-[var(--o-text)]`}>
          {visual.citations.source}
        </span>
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
        <span className="text-[var(--o-text-muted)]">{visual.citations.from}</span>
        <span className={`${chipBase} text-[var(--o-text-secondary)] delay-[360ms] group-hover:border-[color-mix(in_srgb,var(--o-warm)_40%,var(--o-border))] group-hover:text-[var(--o-text)]`}>
          <span className="min-w-0 max-w-full break-words">/docs/architecture</span>
        </span>
        </div>
      </div>
    </div>
  ),
  review: (
    <div className="rounded-md border border-[var(--o-border-subtle)] bg-[var(--o-surface)] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-[var(--o-text-muted)] uppercase">
          <span className="size-1.5 rounded-full bg-[var(--o-amber)]" />
          {visual.review.label}
        </p>
        <span className="rounded border border-[var(--o-border)] px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-[var(--o-text-muted)] uppercase">
          {visual.review.confidence}
        </span>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[12px]">
        <p className="text-[var(--o-text-secondary)] transition-colors duration-300 motion-reduce:transition-none group-hover:text-[var(--o-text)]">
          {visual.review.current}
        </p>
        <p className="text-[var(--o-text-muted)] transition-colors duration-300 motion-reduce:transition-none delay-[130ms] group-hover:text-[var(--o-text-secondary)]">
          {visual.review.previous}
        </p>
      </div>
      <div className="mt-3 flex gap-2 font-mono text-[11px]">
        <span className={`${chipBase} delay-[260ms] group-hover:border-[color-mix(in_srgb,var(--o-amber)_45%,var(--o-border))] group-hover:text-[var(--o-text)]`}>
          {visual.review.supersede}
        </span>
        <span className={`${chipBase} text-[var(--o-text-muted)] delay-[340ms] group-hover:border-[color-mix(in_srgb,var(--o-amber)_45%,var(--o-border))]`}>
          {visual.review.keepBoth}
        </span>
      </div>
    </div>
  ),
  nurture: (
    <div className="space-y-1.5 font-mono text-[12px] text-[var(--o-text-secondary)]">
      <p className="transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none delay-[0ms] group-hover:translate-x-1 group-hover:text-[var(--o-text)]">
        <span className="text-[var(--o-sage)]">+</span> {visual.nurture[0]}
      </p>
      <p className="transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none delay-[110ms] group-hover:translate-x-1 group-hover:text-[var(--o-text)]">
        <span className="text-[var(--o-warm)]">~</span> {visual.nurture[1]}
      </p>
      <p className="transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none delay-[220ms] group-hover:opacity-40">
        <span className="text-[var(--o-text-muted)]">−</span> {visual.nurture[2]}
      </p>
    </div>
  ),
  spaces: (
    <div className="space-y-1.5 font-mono text-[12px]">
      <p className={`${chipBase} flex items-center gap-2 transition-all motion-reduce:transition-none motion-reduce:transform-none group-hover:-translate-y-0.5 group-hover:border-[color-mix(in_srgb,var(--o-warm)_45%,var(--o-border))]`}>
        <span className="size-1.5 rounded-full bg-[var(--o-warm)]" />
        {visual.spaces[0]}
        <span className="ml-auto text-[var(--o-text-muted)]">128</span>
      </p>
      <p className={`${chipBase} flex items-center gap-2 transition-all motion-reduce:transition-none motion-reduce:transform-none delay-[100ms] group-hover:border-[color-mix(in_srgb,var(--o-sage)_45%,var(--o-border))]`}>
        <span className="size-1.5 rounded-full bg-[var(--o-sage)]" />
        {visual.spaces[1]}
        <span className="ml-auto text-[var(--o-text-muted)]">41</span>
      </p>
      <p className={`${chipBase} flex items-center gap-2 transition-all motion-reduce:transition-none motion-reduce:transform-none delay-[200ms] group-hover:translate-y-0.5 group-hover:border-[color-mix(in_srgb,var(--o-indigo)_45%,var(--o-border))]`}>
        <span className="size-1.5 rounded-full bg-[var(--o-indigo)]" />
        {visual.spaces[2]}
        <span className="ml-auto text-[var(--o-text-muted)]">67</span>
      </p>
    </div>
  ),
  git: (
    <div className="relative space-y-1.5 font-mono text-[12px] text-[var(--o-text-secondary)]">
      <div aria-hidden="true" className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-[var(--o-border)]" />
      <p className="flex items-center gap-2.5">
        <span className="relative size-[7px] shrink-0 rounded-full border border-[var(--o-border)] bg-[var(--o-bg-alt)] transition-colors duration-300 motion-reduce:transition-none group-hover:border-[var(--o-warm)] group-hover:bg-[var(--o-warm)]" />
        <span className="min-w-0 break-words transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-0.5"><span className="text-[var(--o-warm)]">a41f2c</span> {visual.git[0]}</span>
      </p>
      <p className="flex items-center gap-2.5">
        <span className="relative size-[7px] shrink-0 rounded-full border border-[var(--o-border)] bg-[var(--o-bg-alt)] transition-colors duration-300 motion-reduce:transition-none delay-[110ms] group-hover:border-[var(--o-warm)] group-hover:bg-[var(--o-warm)]" />
        <span className="min-w-0 break-words transition-transform duration-300 motion-reduce:transition-none delay-[110ms] group-hover:translate-x-0.5"><span className="text-[var(--o-warm)]">9d03b7</span> {visual.git[1]}</span>
      </p>
      <p className="flex items-center gap-2.5">
        <span className="relative size-[7px] shrink-0 rounded-full border border-[var(--o-border)] bg-[var(--o-bg-alt)] transition-colors duration-300 motion-reduce:transition-none delay-[220ms] group-hover:border-[var(--o-warm)] group-hover:bg-[var(--o-warm)]" />
        <span className="min-w-0 break-words transition-transform duration-300 motion-reduce:transition-none delay-[220ms] group-hover:translate-x-0.5"><span className="text-[var(--o-warm)]">3c88e1</span> {visual.git[2]}</span>
      </p>
    </div>
  ),
  mcp: (
    <div data-mcp-flow className="flex min-w-0 flex-col items-center gap-4">
      <div className="grid w-full min-w-0 max-w-sm grid-cols-2 gap-1.5 font-mono text-[12px]">
        {visual.mcp.clients.map((client, index) => (
          <span
            key={client}
            className={`${chipBase} break-words text-center text-[var(--o-text-secondary)] group-hover:border-[color-mix(in_srgb,var(--o-warm)_40%,var(--o-border))] group-hover:text-[var(--o-text)]`}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            {client}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 180 64" className="h-10 w-full max-w-[14rem] shrink-0" aria-hidden="true">
        {[18, 47, 76, 104, 133, 162].map((x, index) => (
          <path
            key={x}
            d={`M${x} 0 C ${x} 22, 90 28, 90 64`}
            strokeWidth="1"
            className="fill-none stroke-[var(--o-border)] transition-[stroke] duration-300 motion-reduce:transition-none group-hover:stroke-[color-mix(in_srgb,var(--o-warm)_55%,var(--o-border))]"
            style={{ transitionDelay: `${140 + index * 60}ms` }}
          />
        ))}
      </svg>
      <div className="min-w-0 text-center">
        <p className="font-mono text-[12px] text-[var(--o-text-muted)]">~/.wenlan</p>
        <span className="mt-1.5 inline-block rounded border border-[var(--o-warm)]/40 bg-[var(--o-glow-warm-bg)] px-2.5 py-1 font-mono text-[12px] text-[var(--o-warm)]">
          {visual.mcp.sharedMemory}
        </span>
        <p className="mt-1.5 font-mono text-[11px] text-[var(--o-text-muted)]">{visual.mcp.localDaemon}</p>
      </div>
    </div>
  ),
});

export function BentoSection({
  cells,
  locale = "en",
  title,
}: {
  readonly cells: readonly BentoCellCopy[];
  readonly locale?: Locale;
  readonly title: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<Stage>("final");
  const pre = stage === "pre";
  const played = stage === "played";
  const visual = bentoVisualCopy[locale];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (section.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    if (typeof IntersectionObserver === "undefined") return;
    setStage("pre");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStage("played");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const delay = (ms: number) => (played ? `${ms}ms` : "0ms");

  return (
    <section ref={sectionRef} data-home-reveal="section" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-xl font-serif text-3xl font-medium tracking-tight text-balance sm:text-5xl">
          <HomeReadableText>{title}</HomeReadableText>
        </h2>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-[var(--o-text-muted)] uppercase">
          {visual.illustrationLabel}
        </p>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {cells.map((cell) => {
            const chrome = cellChrome[cell.id];
            if (!chrome) return null;
            return (
              <BentoCell
                key={cell.id}
                accent={chrome.accent}
                className={chrome.span}
                landDelay={delay(chrome.delayMs)}
                pre={pre}
                title={cell.title}
                body={cell.body}
              >
                {cellArtifacts(visual)[cell.id]}
              </BentoCell>
            );
          })}
        </div>
      </div>
    </section>
  );
}
