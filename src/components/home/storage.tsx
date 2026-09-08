"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import type { HomeContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";

type StorageCopy = HomeContent["redesign"]["storage"];

type StorageVisualCopy = {
  readonly illustrationLabel: string;
  readonly query: string;
  readonly methods: readonly [string, string, string];
  readonly matches: readonly [string, string, string];
  readonly stagingLine: string;
  readonly fusedResult: string;
  readonly fusionLabel: string;
  readonly stagingLabel: string;
  readonly stagingStatus: string;
  readonly readyStatus: string;
  readonly markdownPath: string;
  readonly markdownBody: readonly [string, string, string];
  readonly revision: string;
  readonly fileNote: string;
};

const storageVisualCopy: Record<Locale, StorageVisualCopy> = {
  en: {
    illustrationLabel: "Illustrative retrieval and file flow · not live product output",
    query: 'recall: “staging rollback”',
    methods: ["FTS5 · exact term", "vectors · paraphrase", "graph · entity link"],
    matches: ["rollback needs db lock", "deploy reverts hang", "project: checkout → deploy gotcha"],
    stagingLine: "migration step needs review",
    fusedResult: "all three return together, ranked",
    fusionLabel: "reciprocal rank fusion",
    stagingLabel: "staging",
    stagingStatus: "staging",
    readyStatus: "ready to distill",
    markdownPath: "~/.wenlan/pages/architecture-map.md",
    markdownBody: ["# Architecture map", "Writes go through the daemon. [^1]", "[^1]: /docs/architecture"],
    revision: "page: architecture-map refreshed (4 sources)",
    fileNote: "Obsidian-compatible · grep-able · yours to move",
  },
  "zh-TW": {
    illustrationLabel: "檢索與檔案流程示意，非即時產品輸出",
    query: 'recall：「staging rollback」',
    methods: ["FTS5 · 關鍵字", "向量 · 相近語意", "圖譜 · 關聯線索"],
    matches: ["回滾需要資料庫鎖", "部署回滾卡住", "結帳專案 → 部署限制"],
    stagingLine: "資料遷移步驟需要審核",
    fusedResult: "三種方式一起回傳並排序",
    fusionLabel: "RRF · 合併排序",
    stagingLabel: "待整理",
    stagingStatus: "待整理",
    readyStatus: "準備蒸餾",
    markdownPath: "~/.wenlan/pages/architecture-map.md",
    markdownBody: ["# 系統架構", "寫入統一經過背景服務。[^1]", "[^1]: /docs/architecture"],
    revision: "page: architecture-map 已更新（4 個來源）",
    fileNote: "相容 Obsidian · 可文字搜尋 · 檔案由你保管",
  },
  "zh-CN": {
    illustrationLabel: "检索与文件流程示意，非实时产品输出",
    query: 'recall：“staging rollback”',
    methods: ["FTS5 · 关键词", "向量 · 相近语义", "图谱 · 关联线索"],
    matches: ["回滚需要数据库锁", "部署回滚卡住", "结账项目 → 部署限制"],
    stagingLine: "数据迁移步骤需要审核",
    fusedResult: "三种方式一起返回并排序",
    fusionLabel: "RRF · 合并排序",
    stagingLabel: "待整理",
    stagingStatus: "待整理",
    readyStatus: "准备蒸馏",
    markdownPath: "~/.wenlan/pages/architecture-map.md",
    markdownBody: ["# 系统架构", "写入统一经过后台服务。[^1]", "[^1]: /docs/architecture"],
    revision: "page: architecture-map 已更新（4 个来源）",
    fileNote: "兼容 Obsidian · 可文本搜索 · 文件由你保管",
  },
};

/**
 * Storage: why index + files beats either alone. The index card plays the
 * hybrid retrieval argument: one query, three ways in (exact term,
 * paraphrase, linked entity), fused into one ranked answer. Below it,
 * staging captures wait for /distill to solidify them into Markdown pages,
 * the lasting record you read, diff, and keep. A three-way comparison strip
 * makes the hybrid case explicit. Same scroll-armed choreography contract as
 * pains.tsx: final state by default, intro only arms below the fold.
 * Labels and tradeoffs come from the dictionary; the recall rows, staging
 * queue, and Markdown card are illustrative tool output, with short labels
 * localized beside the component so the visual remains legible in each locale.
 */

type Stage = "final" | "pre" | "played";

const methodChip =
  "w-fit max-w-full shrink-0 rounded border px-2 py-1 text-center font-mono text-[10px] tracking-wide uppercase transition-colors duration-300 motion-reduce:transition-none sm:w-[9.5rem]";

export function StorageSection({ copy, locale = "en" }: { readonly copy: StorageCopy; readonly locale?: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<Stage>("final");
  const pre = stage === "pre";
  const played = stage === "played";
  const visual = storageVisualCopy[locale];

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
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const delay = (ms: number) => (played ? `${ms}ms` : "0ms");
  const land = pre ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100";
  const slide = pre ? "-translate-x-1.5 opacity-0" : "translate-x-0 opacity-100";

  return (
    <section ref={sectionRef} data-home-reveal="section" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-medium tracking-tight whitespace-pre-line sm:text-5xl">
          {copy.title}
        </h2>
        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-[var(--o-text-secondary)]">
          {copy.intro}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-[var(--o-text-muted)] uppercase">
          {visual.illustrationLabel}
        </p>
        <div className="mt-12 grid items-stretch gap-3 sm:mt-14 sm:grid-cols-[1fr_auto_1fr]">
          <div
            className={`home-panel rounded-lg group min-w-0 border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-6 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
            style={{ transitionDelay: delay(0) }}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">{copy.indexLabel}</p>
            <div
              className={`mt-4 inline-block rounded border border-[var(--o-border)] bg-[var(--o-surface)] px-2.5 py-1.5 font-mono text-[12px] text-[var(--o-text-secondary)] transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
              style={{ transitionDelay: delay(250) }}
            >
              <span className="text-[var(--o-warm)]">{visual.query}</span>
            </div>
            <div className="mt-3 ml-3 space-y-2 border-l border-[var(--o-border-subtle)] pl-3">
              <div
                className={`flex min-w-0 flex-col items-start gap-2.5 transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none sm:flex-row sm:items-center ${slide}`}
                style={{ transitionDelay: delay(550) }}
              >
                <span
                  className={`${methodChip} animate-route-flash motion-reduce:animate-none border-[color-mix(in_srgb,var(--o-warm)_45%,var(--o-border))] text-[var(--o-warm)]`}
                  style={{ "--route-accent": "var(--o-warm)" } as React.CSSProperties}
                >
                  {visual.methods[0]}
                </span>
                <span className="min-w-0 break-words font-mono text-[12px] text-[var(--o-text-secondary)]">
                  mem_0231 · <span className="rounded bg-[color-mix(in_srgb,var(--o-warm)_16%,transparent)] px-0.5 text-[var(--o-warm)]">{visual.matches[0]}</span>
                </span>
              </div>
              <div
                className={`flex min-w-0 flex-col items-start gap-2.5 transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none sm:flex-row sm:items-center ${slide}`}
                style={{ transitionDelay: delay(850) }}
              >
                <span
                  className={`${methodChip} animate-route-flash motion-reduce:animate-none border-[color-mix(in_srgb,var(--o-sage)_45%,var(--o-border))] text-[var(--o-sage)]`}
                  style={{ "--route-accent": "var(--o-sage)", animationDelay: "0.8s" } as React.CSSProperties}
                >
                  {visual.methods[1]}
                </span>
                <span className="min-w-0 break-words font-mono text-[12px] text-[var(--o-text-secondary)]">
                  mem_0142 · <span className="rounded bg-[color-mix(in_srgb,var(--o-sage)_16%,transparent)] px-0.5 text-[var(--o-sage)]">{visual.matches[1]}</span>
                </span>
              </div>
              <div
                className={`flex min-w-0 flex-col items-start gap-2.5 transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none sm:flex-row sm:items-center ${slide}`}
                style={{ transitionDelay: delay(1150) }}
              >
                <span
                  className={`${methodChip} animate-route-flash motion-reduce:animate-none border-[color-mix(in_srgb,var(--o-indigo)_45%,var(--o-border))] text-[var(--o-indigo)]`}
                  style={{ "--route-accent": "var(--o-indigo)", animationDelay: "1.6s" } as React.CSSProperties}
                >
                  {visual.methods[2]}
                </span>
                <span className="min-w-0 break-words font-mono text-[12px] text-[var(--o-text-secondary)]">
                  mem_0087 · <span className="rounded bg-[color-mix(in_srgb,var(--o-indigo)_16%,transparent)] px-0.5 text-[var(--o-indigo)]">{visual.matches[2]}</span>
                </span>
              </div>
            </div>
            <div
              className={`animate-fuse-pulse motion-reduce:animate-none mt-3 flex flex-wrap items-start gap-2 rounded border border-[var(--o-warm)]/40 bg-[var(--o-glow-warm-bg)] px-3 py-2 transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
              style={{ transitionDelay: delay(1500) }}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-[var(--o-warm)]" />
              <span className="min-w-0 flex-1 break-words font-mono text-[12px] text-[var(--o-text)]">{visual.fusedResult}</span>
              <span className="ml-auto max-w-full break-words rounded border border-[var(--o-border)] px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-[var(--o-text-muted)] uppercase sm:shrink-0">
                {visual.fusionLabel}
              </span>
            </div>
            <p
              className={`mt-3 text-[13px] leading-relaxed text-[var(--o-text-muted)] transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
              style={{ transitionDelay: delay(1650) }}
            >
              {copy.fusionNote}
            </p>
            <div
              className={`mt-4 border-t border-[var(--o-border-subtle)] pt-3 transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
              style={{ transitionDelay: delay(1800) }}
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">{visual.stagingLabel}</p>
              <div className="mt-2.5 space-y-2 font-mono text-[12px] text-[var(--o-text-secondary)]">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="min-w-0 break-words">mem_0231 · {visual.matches[0]}</span>
                  <span className="shrink-0 rounded border border-[var(--o-border)] px-1.5 py-0.5 text-[9px] tracking-wide text-[var(--o-text-muted)] uppercase">{visual.stagingStatus}</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="min-w-0 break-words">mem_0198 · {visual.stagingLine}</span>
                  <span className="shrink-0 rounded border border-[var(--o-warm)]/40 px-1.5 py-0.5 text-[9px] tracking-wide text-[var(--o-warm)] uppercase">{visual.readyStatus}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-row items-center justify-center gap-6 py-1 transition-opacity duration-400 motion-reduce:transition-none sm:flex-col sm:gap-7 sm:px-1 ${pre ? "opacity-0" : "opacity-100"}`}
            style={{ transitionDelay: delay(1900) }}
            aria-hidden="true"
          >
            <div className="flex flex-row items-center gap-2 sm:flex-col">
              <p className="font-mono text-[11px] text-[var(--o-warm)]">/distill</p>
              <span className="animate-arrow-nudge flex rotate-90 text-[var(--o-text-muted)] motion-reduce:animate-none sm:rotate-0">
                <ArrowRightIcon className="size-4" />
              </span>
              <p className="max-w-24 text-balance font-mono text-[11px] leading-relaxed text-[var(--o-text-muted)] sm:text-center">
                {copy.distillCaption}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2 sm:flex-col">
              <p className="font-mono text-[11px] text-[var(--o-sage)]">ingest</p>
              <span className="animate-arrow-nudge flex -rotate-90 text-[var(--o-text-muted)] motion-reduce:animate-none sm:rotate-180" style={{ animationDelay: "1.2s" }}>
                <ArrowRightIcon className="size-4" />
              </span>
              <p className="max-w-24 text-balance font-mono text-[11px] leading-relaxed text-[var(--o-text-muted)] sm:text-center">
                {copy.ingestCaption}
              </p>
            </div>
          </div>
          <div
            className={`home-panel rounded-lg min-w-0 border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-6 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
            style={{ transitionDelay: delay(200) }}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--o-text-muted)] uppercase">{copy.filesLabel}</p>
            <div className="mt-4 rounded-md border border-[var(--o-border-subtle)] bg-[var(--o-surface)] p-4">
              <p className="break-all font-mono text-[11px] text-[var(--o-text-muted)]">{visual.markdownPath}</p>
              <div className="mt-3 space-y-1.5 font-mono text-[13px] text-[var(--o-text-secondary)]">
                <p className="text-[var(--o-text)]">{visual.markdownBody[0]}</p>
                <p className="break-words">{visual.markdownBody[1]}</p>
                <p className="break-words pt-1 text-[var(--o-text-muted)]">{visual.markdownBody[2]}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 font-mono text-[12px] text-[var(--o-text-muted)]">
              <p className="break-words"><span className="text-[var(--o-warm)]">a1b2c3d</span> {visual.revision}</p>
              <p className="break-words">{visual.fileNote}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {copy.tradeoffs.map((option, index) => {
            const winner = option.id === "index-files";
            return (
              <div
                key={option.id}
                className={`home-panel rounded-lg border p-4 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land} ${
                  winner
                    ? "border-[color-mix(in_srgb,var(--o-warm)_35%,var(--o-border))] bg-[var(--o-bg-alt)]"
                    : "border-[var(--o-border)] bg-[var(--o-bg-alt)]"
                }`}
                style={{ transitionDelay: delay(2000 + index * 130) }}
              >
                <p className="flex items-center gap-2 text-sm font-medium">
                  {option.title}
                </p>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${winner ? "text-[var(--o-text-secondary)]" : "text-[var(--o-text-muted)]"}`}>
                  {option.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
