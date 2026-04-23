"use client";

import { useScrollProgress } from "@/app/use-scroll-reveal";

const pains = [
  { num: "01", title: "More AI, more drowning", description: "AI was supposed to reduce work. Instead: more to manage, more to keep up with." },
  { num: "02", title: "Bad memory is worse than no memory", description: "Stale facts, contradicted decisions, wrong inferences. You can't tell what's right." },
  { num: "03", title: "Nothing carries forward", description: "Every conversation starts from scratch. What you figured out yesterday doesn't exist today." },
];

const pillars = [
  { title: "Distills what matters", description: "Less to track, less to worry about. Origin reduces the noise to what you actually need." },
  { title: "Visible and yours", description: "Every memory editable, traceable to its source. You control what your AI knows." },
  { title: "Gets sharper over time", description: "Links, deduplicates, detects contradictions. March's insight is sharper in April." },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/** Map a value from one range to another */
function remap(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

export function ProblemSection() {
  const { ref, progress } = useScrollProgress<HTMLElement>();

  // Cards fade IN (progress 0.2 → 0.5)
  const fadeIn = remap(progress, 0.2, 0.5, 0, 1);
  const slideUp = remap(progress, 0.2, 0.5, 24, 0);

  // Hold fully visible, mute only as section leaves viewport (0.8 → 1.0)
  const fadeOut = remap(progress, 0.8, 1.0, 1, 0.4);
  const blur = remap(progress, 0.8, 1.0, 0, 1.5);
  const drift = remap(progress, 0.8, 1.0, 0, -4);

  // Combined: fade in, hold, then fade out
  const cardOpacity = Math.min(fadeIn, fadeOut);
  const cardTranslate = fadeIn < 1 ? slideUp : drift;

  return (
    <section ref={ref} className="border-t border-[var(--o-border-subtle)] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
            The problem
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            Your AI remembers you{" "}
            <span className="text-[var(--o-text-muted)] line-through decoration-[var(--o-text-dim)]">badly</span>
            {" "}&mdash; and won&apos;t let you see.
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 text-left sm:grid-cols-[1fr_1fr_1fr] sm:gap-10">
          {pains.map((pain, i) => (
            <div
              key={pain.title}
              className="flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:text-[var(--o-text-secondary)]"
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardTranslate}px)`,
                filter: `blur(${blur}px)`,
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <p className="mb-3 font-mono text-xs text-[var(--o-warm)]/60">{pain.num}</p>
              <p className="font-serif text-lg font-medium leading-snug text-[var(--o-text)]">{pain.title}</p>
              <p className="mt-auto pt-3 text-[13px] leading-relaxed text-[var(--o-text-muted)]">{pain.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionSection() {
  const { ref, progress } = useScrollProgress<HTMLElement>();

  // Solution emerges as it enters viewport (progress 0.1 → 0.5)
  const headingOpacity = remap(progress, 0.05, 0.35, 0, 1);
  const headingSlide = remap(progress, 0.05, 0.35, 28, 0);

  return (
    <section ref={ref} className="border-t border-[var(--o-border-subtle)] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div
          className="mx-auto max-w-3xl text-center"
          style={{
            opacity: headingOpacity,
            transform: `translateY(${headingSlide}px)`,
          }}
        >
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">What Origin brings</p>
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Memory that actually works.</h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 text-left sm:grid-cols-3 sm:gap-5">
          {pillars.map((pillar, i) => {
            const delay = i * 0.08;
            const cardOpacity = remap(progress, 0.15 + delay, 0.55 + delay, 0, 1);
            const cardScale = remap(progress, 0.15 + delay, 0.55 + delay, 0.8, 1);
            const cardSlide = remap(progress, 0.15 + delay, 0.55 + delay, 50, 0);
            const glowIntensity = remap(progress, 0.3 + delay, 0.5 + delay, 0, 0.6);
            const glowFade = remap(progress, 0.6 + delay, 0.8 + delay, 0.6, 0);
            const glow = Math.min(glowIntensity, glowFade === 0.6 ? glowIntensity : glowFade);

            return (
              <div
                key={pillar.title}
                className="rounded-xl bg-[var(--o-surface)]/40 px-5 py-5 transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--o-card-hover)] hover:border-[var(--o-glow-indigo)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale}) translateY(${cardSlide}px)`,
                }}
              >
                <p
                  className="mb-2 font-mono text-xs text-[var(--o-warm)]"
                  style={{
                    textShadow: `0 0 ${glow * 20}px rgba(212, 136, 74, ${glow})`,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-serif text-base font-medium leading-snug text-[var(--o-text)]">{pillar.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--o-text-muted)]">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
