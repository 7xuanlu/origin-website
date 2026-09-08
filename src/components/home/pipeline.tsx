"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import type { HomeContent } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { HomeReadableText } from "./readable-text";

type PipelineCopy = HomeContent["redesign"]["pipeline"];
type SolutionCopy = HomeContent["sections"]["solution"];

type PipelineVisualCopy = {
  readonly illustrationLabel: string;
  readonly captureLines: readonly string[];
  readonly actions: readonly string[];
  readonly pageTitle: string;
  readonly pageCitations: string;
};

const pipelineVisualCopy: Record<Locale, PipelineVisualCopy> = {
  en: {
    illustrationLabel: "Illustrative workflow · not live product output",
    captureLines: [
      "+ migration rollback needs db lock",
      "+ release runbook records recovery step",
      "+ staging claim needs review",
    ],
    actions: ["Dedup", "Link", "Supersede"],
    pageTitle: "Release runbook",
    pageCitations: "cites /runbooks/release, /docs/architecture",
  },
  "zh-TW": {
    illustrationLabel: "工作流程示意，非即時產品輸出",
    captureLines: [
      "+ 遷移回滾需要資料庫鎖",
      "+ 發布手冊記下復原步驟",
      "+ 待整理的主張需要審核",
    ],
    actions: ["去重", "連結", "取代"],
    pageTitle: "Release runbook",
    pageCitations: "引用 /runbooks/release、/docs/architecture",
  },
  "zh-CN": {
    illustrationLabel: "工作流程示意，非实时产品输出",
    captureLines: [
      "+ 迁移回滚需要数据库锁",
      "+ 发布手册记下恢复步骤",
      "+ 待整理的主张需要审核",
    ],
    actions: ["去重", "连接", "取代"],
    pageTitle: "Release runbook",
    pageCitations: "引用 /runbooks/release、/docs/architecture",
  },
};

/**
 * The handoff loop, choreographed. The three stages land in loop order,
 * capture lines arrive one at a time, distill verbs fire, the next-session
 * brief snaps in, then the /handoff arc draws back across the top to close
 * the loop. Renders the final state by default (no-JS, reduced motion,
 * section already visible) and only arms the intro after mount when the
 * section is still below the viewport (same contract as pains.tsx).
 * Section title and closer reuse the pinned sections.solution copy.
 *
 * The diagrams are illustrative workflow artifacts, not live product output.
 */

type Stage = "final" | "pre" | "played";

function PipelineStage({
  accent,
  body,
  className = "",
  step,
  style,
  title,
}: {
  accent: string;
  body: React.ReactNode;
  className?: string;
  step: string;
  style?: React.CSSProperties;
  title: string;
}) {
  return (
    <div
      className={`home-panel rounded-lg relative min-w-0 flex-1 border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-5 ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2">
        <span className="size-2 shrink-0 rounded-full" style={{ background: accent }} />
        <p className="font-mono text-[11px] tracking-[0.15em] text-[var(--o-text-muted)]">{step}</p>
      </div>
      <p className="mt-2 font-serif text-lg font-medium">{title}</p>
      <div className="mt-3">{body}</div>
    </div>
  );
}

const stageAccents = ["var(--o-sage)", "var(--o-amber)", "var(--o-warm)"];

export function PipelineSection({
  copy,
  locale = "en",
  solution,
}: {
  readonly copy: PipelineCopy;
  readonly locale?: Locale;
  readonly solution: SolutionCopy;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<Stage>("final");
  const pre = stage === "pre";
  const played = stage === "played";
  const visual = pipelineVisualCopy[locale];

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
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const delay = (ms: number) => (played ? `${ms}ms` : "0ms");
  const land = pre ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100";

  const stageBodies = [
    <ul key="capture" className="space-y-1.5 font-mono text-[12px] leading-relaxed text-[var(--o-text-secondary)]">
      {visual.captureLines.map((line, index) => (
        <li
          key={line}
          className={`break-words transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${pre ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
          style={{ transitionDelay: delay(550 + index * 150) }}
        >
          {line}
        </li>
      ))}
    </ul>,
    <div key="distill">
      <div className="flex flex-wrap gap-1.5">
        {visual.actions.map((label, index) => (
          <span
            key={label}
            className={`rounded border border-[var(--o-border)] bg-[var(--o-surface)] px-2 py-1 font-mono text-[10px] tracking-wide text-[var(--o-text-secondary)] uppercase transition-all duration-400 motion-reduce:transition-none motion-reduce:transform-none ${
              pre ? "scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{ transitionDelay: delay(1000 + index * 110) }}
          >
            {label}
          </span>
        ))}
      </div>
      <p
        className={`mt-3 text-[13px] leading-relaxed text-[var(--o-text-muted)] transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
          pre ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
        }`}
        style={{ transitionDelay: delay(1350) }}
      >
        <HomeReadableText>{copy.distillNote}</HomeReadableText>
      </p>
    </div>,
    <div
      key="brief"
      className={`min-w-0 rounded border border-[var(--o-border-subtle)] bg-[var(--o-surface)] p-2.5 transition-all duration-400 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        pre ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{ transitionDelay: delay(1550) }}
    >
      <p className="break-words text-[13px] font-medium">{visual.pageTitle}</p>
      <p className="mt-1 break-words font-mono text-[11px] text-[var(--o-text-muted)]">{visual.pageCitations}</p>
    </div>,
  ];

  return (
    <section ref={sectionRef} data-home-reveal="section" className="relative overflow-hidden px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-balance sm:text-5xl">
            {solution.title}
          </h2>
          <p className="mt-4 text-xl leading-relaxed text-pretty text-[var(--o-text-secondary)]">
            <HomeReadableText>{copy.intro}</HomeReadableText>
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-[var(--o-text-muted)] uppercase">
            {visual.illustrationLabel}
          </p>
        </div>
        <div className="relative mt-20 sm:mt-24">
          <div className="pointer-events-none absolute inset-x-10 -top-16 hidden h-14 sm:block" aria-hidden="true">
            {/* The return arc draws right-to-left after the brief lands: the loop closing is the payoff */}
            <svg
              viewBox="0 0 1000 56"
              fill="none"
              preserveAspectRatio="none"
              style={{ transitionDelay: delay(1750) }}
              className={`h-full w-full text-[var(--o-border)] transition-opacity duration-700 ease-out motion-reduce:transition-none ${pre ? "opacity-0" : "opacity-100"}`}
            >
              <path
                d="M992 52 C 800 -8, 200 -8, 16 46"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                vectorEffect="non-scaling-stroke"
                className="animate-arc-flow motion-reduce:animate-none"
              />
            </svg>
            <svg
              className={`absolute -bottom-0.5 left-0 size-2.5 text-[var(--o-text-muted)] transition-opacity duration-300 motion-reduce:transition-none ${pre ? "opacity-0" : "opacity-100"}`}
              style={{ transitionDelay: delay(2400) }}
              viewBox="0 0 10 10"
              fill="currentColor"
            >
              <path d="M8.5 1 L1 5.8 L9 9 Z" />
            </svg>
            <p
              className={`absolute inset-x-0 -top-4 text-center font-mono text-[10px] tracking-[0.2em] text-[var(--o-text-muted)] transition-opacity duration-400 motion-reduce:transition-none ${pre ? "opacity-0" : "opacity-100"}`}
              style={{ transitionDelay: delay(2400) }}
            >
              {copy.arcLabel}
            </p>
          </div>
          <ol
            aria-label={solution.title}
            className="flex flex-col items-stretch gap-3 sm:flex-row"
          >
            {copy.stages.map((stageCopy, index) => (
              <li key={stageCopy.id} className="contents">
                {index > 0 && (
                  <div
                  className={`hidden shrink-0 self-center text-[var(--o-text-muted)] transition-opacity duration-400 motion-reduce:transition-none sm:flex ${pre ? "opacity-0" : "opacity-100"}`}
                    style={{ transitionDelay: delay(70 + index * 180) }}
                    aria-hidden="true"
                  >
                    <span className="animate-arrow-nudge flex motion-reduce:animate-none" style={index === 2 ? { animationDelay: "1.2s" } : undefined}>
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </div>
                )}
                <PipelineStage
                  accent={stageAccents[index]}
                  step={stageCopy.step}
                  title={stageCopy.title}
                  className={`transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
                  style={{ transitionDelay: delay(index * 180) }}
                  body={stageBodies[index]}
                />
              </li>
            ))}
          </ol>
        </div>
        <p
          className={`mt-8 text-lg text-[var(--o-text-muted)] transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${land}`}
          style={{ transitionDelay: delay(2650) }}
        >
          <HomeReadableText>{solution.note}</HomeReadableText>
        </p>
      </div>
    </section>
  );
}
