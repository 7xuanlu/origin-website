import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";
import { ThemeToggle } from "./theme-toggle";

// Toggle: set to false to show download buttons after launch
const SHOW_WAITLIST = true;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function OriginMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-7">
      <defs>
        <linearGradient id="nav-ring" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: "var(--o-logo-start)" }} />
          <stop offset="50%" style={{ stopColor: "var(--o-logo-mid)" }} />
          <stop offset="100%" style={{ stopColor: "var(--o-logo-end)" }} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="10" stroke="url(#nav-ring)" strokeWidth="5" />
      <circle cx="22.5" cy="7.5" r="3" fill="var(--o-logo-orb)" opacity="0.9" />
    </svg>
  );
}

function OriginRingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 800 800"
        fill="none"
        className="animate-float absolute top-[55%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 sm:h-[1000px] sm:w-[1000px]"
        style={{
          opacity: "var(--o-ring-opacity)",
          filter: "var(--o-ring-filter)",
        }}
      >
        <defs>
          <linearGradient id="ring-grad" x1="100" y1="400" x2="700" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style={{ stopColor: "var(--o-ring-grad-start)" }} />
            <stop offset="35%" style={{ stopColor: "var(--o-ring-grad-mid)" }} />
            <stop offset="65%" style={{ stopColor: "var(--o-ring-grad-mid2)" }} />
            <stop offset="100%" style={{ stopColor: "var(--o-ring-grad-end)" }} />
          </linearGradient>
          <radialGradient id="inner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "var(--o-ring-glow)" }} stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" style={{ stopColor: "var(--o-ring-orb-glow)" }} stopOpacity="0.8" />
            <stop offset="100%" style={{ stopColor: "var(--o-ring-orb-edge)" }} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="400" cy="400" r="280" fill="url(#inner-glow)" />
        <circle cx="400" cy="400" r="240" stroke="url(#ring-grad)" strokeWidth="72" strokeLinecap="round" fill="none" />
        <circle cx="540" cy="195" r="32" fill="url(#orb-glow)" />
        <circle cx="540" cy="195" r="14" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

const features = [
  { title: "Hybrid Memory Engine", description: "Vector search, full-text search, and knowledge graph — unified in one local database with Reciprocal Rank Fusion.", tag: "libSQL", accent: "warm" as const },
  { title: "Knowledge Graph", description: "Entities, relations, and observations form a structured web of your personal knowledge that grows over time.", tag: "Graph", accent: "indigo" as const },
  { title: "MCP-Native", description: "Any MCP-compatible agent reads and writes your memory. Claude, Cursor, ChatGPT — all connected through one protocol.", tag: "Protocol", accent: "sage" as const },
  { title: "On-Device Intelligence", description: "Qwen3-4B runs on Apple Silicon Metal GPU. Your data never leaves your machine for processing.", tag: "Local AI", accent: "warm" as const },
  { title: "Memory Import", description: "Bring your existing AI memories home. Import from ChatGPT and Claude — no cold start, instant value.", tag: "Day Zero", accent: "amber" as const },
  { title: "Privacy by Architecture", description: "PII redaction, local-first storage, AGPL source code. Privacy you can verify, not just trust.", tag: "Privacy", accent: "sage" as const },
];

const steps = [
  { number: "01", title: "Install", description: "Download Origin for macOS. One app, everything included." },
  { number: "02", title: "Import", description: "Bring your ChatGPT and Claude memories. Instant personal context." },
  { number: "03", title: "Connect", description: "Link your AI agents via MCP. Claude Code, Cursor, Claude Desktop — one click." },
  { number: "04", title: "Remember", description: "Every AI you use now knows you. Your memory grows, compounds, persists." },
];

const stack = [
  { layer: "Consumer App", tech: "Tauri 2 + React 19", purpose: "Search, browse, curate, visualize" },
  { layer: "Agent Interface", tech: "MCP Server (HTTP + Unix)", purpose: "Any MCP agent reads / writes memory" },
  { layer: "Intelligence", tech: "Qwen3-4B on-device + cloud", purpose: "Summarize, categorize, connect" },
  { layer: "Memory Engine", tech: "libSQL — vectors + FTS5 + graph", purpose: "Store, search, connect memories" },
  { layer: "Privacy", tech: "PII redaction, local-first, AGPL", purpose: "Verifiable privacy — read the code" },
];

const accentColors = {
  warm: {
    border: "accent-left-warm",
    tag: "border-[var(--o-warm)]/20 text-[var(--o-warm)] bg-[var(--o-warm)]/5",
    hover: "group-hover:border-[var(--o-warm)]/30 group-hover:text-[var(--o-warm)]",
  },
  indigo: {
    border: "accent-left-indigo",
    tag: "border-[var(--o-indigo)]/20 text-[var(--o-indigo)] bg-[var(--o-indigo)]/5",
    hover: "group-hover:border-[var(--o-indigo)]/30 group-hover:text-[var(--o-indigo)]",
  },
  sage: {
    border: "accent-left-sage",
    tag: "border-[var(--o-sage)]/20 text-[var(--o-sage)] bg-[var(--o-sage)]/5",
    hover: "group-hover:border-[var(--o-sage)]/30 group-hover:text-[var(--o-sage)]",
  },
  amber: {
    border: "accent-left-amber",
    tag: "border-[var(--o-amber)]/20 text-[var(--o-amber)] bg-[var(--o-amber)]/5",
    hover: "group-hover:border-[var(--o-amber)]/30 group-hover:text-[var(--o-amber)]",
  },
};

export default function LandingPage() {
  return (
    <div className="grain relative min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 z-40 w-full border-b border-[var(--o-border-subtle)] bg-[var(--o-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <OriginMark />
            <span className="font-serif text-lg font-medium tracking-tight">
              Origin
            </span>
            <span className="rounded-full border border-[var(--o-warm)]/20 bg-[var(--o-warm)]/5 px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--o-warm)]">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/7xuanlu/origin"
              className="flex items-center gap-2 text-sm text-[var(--o-text-secondary)] transition-colors duration-150 hover:text-[var(--o-text)]"
            >
              <GitHubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-14">
        <OriginRingBackground />

        <div className="relative z-10 max-w-3xl text-center">
          <p className="animate-fade-up mb-6 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">
            Personal Agent Memory Layer
          </p>
          <h1 className="animate-fade-up delay-100 warm-glow font-serif text-5xl leading-[1.1] font-medium tracking-tight sm:text-7xl">
            One memory,
            <br />
            every agent.
          </h1>
          <p className="animate-fade-up delay-200 mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
            Open-source memory layer that makes every AI tool you use smarter.
            Local-first, privacy-first, MCP-native.{" "}
            <span className="text-[var(--o-text)]">You own the data. Always.</span>
          </p>
          <div id="waitlist" className="animate-fade-up delay-300 mt-10 flex flex-col items-center gap-4">
            {SHOW_WAITLIST ? (
              <>
                <WaitlistForm />
                <div className="flex items-center gap-4">
                  <Link href="https://github.com/7xuanlu/origin" className="flex items-center gap-2 text-sm text-[var(--o-text-secondary)] transition-colors duration-150 hover:text-[var(--o-text)]">
                    View on GitHub
                    <ArrowIcon />
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="https://github.com/7xuanlu/origin/releases" className="flex items-center gap-2 rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:shadow-[0_0_28px_var(--o-glow-warm)]">
                  <DownloadIcon />
                  Download for macOS
                </Link>
                <Link href="https://github.com/7xuanlu/origin" className="flex items-center gap-2 rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]">
                  View on GitHub
                  <ArrowIcon />
                </Link>
              </div>
            )}
          </div>
          <p className="animate-fade-up delay-400 mt-6 font-mono text-[11px] text-[var(--o-text-muted)]">
            {SHOW_WAITLIST
              ? "macOS (Apple Silicon) \u00b7 Coming soon \u00b7 Open Source (AGPL-3.0)"
              : "macOS (Apple Silicon) \u00b7 Free \u00b7 Open Source (AGPL-3.0)"}
          </p>
        </div>

        <div className="animate-fade-up delay-700 absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-[var(--o-border)] p-1">
            <div className="h-1.5 w-1 rounded-full bg-[var(--o-text-muted)]" style={{ animation: "shimmer 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
            The problem
          </p>
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Every AI tool{" "}
            <span className="text-[var(--o-text-muted)] line-through decoration-[var(--o-text-dim)]">forgets</span>{" "}
            you.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
            ChatGPT doesn&apos;t know what you told Claude. Claude doesn&apos;t
            know what you built in Cursor. Each tool is an isolated amnesiac.
            The more AI tools you use, the worse it gets.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {["ChatGPT", "Claude", "Cursor"].map((tool) => (
              <div key={tool} className="rounded-lg border border-[var(--o-border)] bg-[var(--o-bg-alt)]/50 px-6 py-5">
                <p className="font-mono text-sm text-[var(--o-text-muted)]">{tool}</p>
                <p className="mt-1 text-xs text-[var(--o-text-dim)]">Knows nothing about you</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-[var(--o-text-muted)]">
            Platforms will never fix this. OpenAI won&apos;t share your memory with Anthropic.
            <br />
            They&apos;re structurally incentivized to keep you locked in.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="relative border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2" style={{ width: "600px", height: "400px", background: "radial-gradient(ellipse at center, var(--o-glow-warm) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">
            The solution
          </p>
          <h2 className="warm-glow font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Origin remembers.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--o-text-secondary)]">
            The neutral memory layer that sits between you and all your AI
            agents. It runs on your device, captures and organizes your personal
            knowledge, and makes it available to any MCP-compatible agent.
          </p>
          <div className="card-origin accent-left-warm mx-auto mt-12 max-w-lg rounded-lg p-8 text-left">
            <p className="font-mono text-xs text-[var(--o-warm)]/70">$ origin setup</p>
            <div className="mt-4 space-y-2.5 font-mono text-sm">
              <p className="text-[var(--o-text-secondary)]"><span className="text-[var(--o-sage)]">✓</span> Import ChatGPT memories</p>
              <p className="text-[var(--o-text-secondary)]"><span className="text-[var(--o-sage)]">✓</span> Import Claude memories</p>
              <p className="text-[var(--o-text-secondary)]"><span className="text-[var(--o-sage)]">✓</span> Connect agents via MCP</p>
              <p className="text-[var(--o-text)]"><span className="text-[var(--o-warm)]">→</span> Every AI you use now knows you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">How it works</p>
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Four steps. Forever memory.</h2>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-[var(--o-border)] bg-[var(--o-border)] sm:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="group bg-[var(--o-bg-alt)]/80 p-8 transition-colors duration-150 hover:bg-[var(--o-surface)]">
                <span className="font-mono text-3xl font-bold text-[var(--o-border)] transition-colors duration-150 group-hover:text-[var(--o-warm)]/30">
                  {step.number}
                </span>
                <h3 className="mt-4 font-serif text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--o-text-muted)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">Features</p>
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Built for the agentic era.</h2>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const colors = accentColors[feature.accent];
              return (
                <div key={feature.title} className={`card-origin group rounded-lg border-l-3 p-7 ${colors.border}`}>
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium transition-colors duration-150 ${colors.tag} ${colors.hover}`}>
                    {feature.tag}
                  </span>
                  <h3 className="mt-4 font-serif text-base font-medium">{feature.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--o-text-muted)]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">Architecture</p>
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Everything on your machine.</h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--o-text-muted)]">Five layers, one binary. No cloud required.</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-lg border border-[var(--o-border)]">
            {stack.map((row, i) => (
              <div key={row.layer} className={`grid grid-cols-[140px_1fr_1fr] gap-4 px-6 py-4 text-sm transition-colors duration-150 hover:bg-[var(--o-card-bg)] ${i !== stack.length - 1 ? "border-b border-[var(--o-border-subtle)]" : ""} ${i === 0 ? "bg-[var(--o-surface)]/40" : ""}`}>
                <span className="font-medium text-[var(--o-text)]">{row.layer}</span>
                <span className="font-mono text-xs text-[var(--o-text-muted)]">{row.tech}</span>
                <span className="text-[var(--o-text-muted)]">{row.purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">Why now</p>
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">The window is open.</h2>
          <div className="mt-12 space-y-3 text-left">
            {([
              { signal: "Limitless acquired by Meta, Bee by Amazon — both killed.", meaning: "No independent privacy-first personal memory product exists.", accent: "warm" },
              { signal: "MCP became the interoperability standard.", meaning: "Cross-agent memory is now architecturally possible.", accent: "indigo" },
              { signal: "On-device AI crossed the performance threshold.", meaning: "Real intelligence runs locally on Apple Silicon.", accent: "sage" },
              { signal: "Trust is broken.", meaning: "Post-acquisition, users demand verifiable privacy, not promises.", accent: "amber" },
            ] as const).map((item) => {
              const cls = `accent-left-${item.accent}`;
              return (
                <div key={item.signal} className={`card-origin rounded-lg border-l-3 px-6 py-5 ${cls}`}>
                  <p className="font-medium text-[var(--o-text)]">{item.signal}</p>
                  <p className="mt-1 text-sm text-[var(--o-text-muted)]">{item.meaning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <section className="border-t border-[var(--o-border-subtle)] px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-[var(--o-warm)]/70 uppercase">Open source</p>
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Read every line.</h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-[var(--o-text-secondary)]">
            Origin is AGPL-3.0. The complete desktop experience — memory engine,
            unlimited agents, all capture methods, on-device LLM, knowledge
            graph. Nothing held back.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="https://github.com/7xuanlu/origin" className="flex items-center gap-2 rounded-xl bg-[var(--o-text)] px-6 py-3 text-sm font-semibold text-[var(--o-bg)] transition-all duration-150 hover:opacity-90">
              <GitHubIcon />
              Star on GitHub
            </Link>
            {SHOW_WAITLIST ? (
              <a href="#waitlist" className="flex items-center gap-2 rounded-xl border border-[var(--o-warm)]/20 px-6 py-3 text-sm font-medium text-[var(--o-warm)] transition-all duration-150 hover:border-[var(--o-warm)]/40 hover:text-[var(--o-warm-hover)]">
                Join Waitlist
                <ArrowIcon />
              </a>
            ) : (
              <Link href="https://github.com/7xuanlu/origin/releases" className="flex items-center gap-2 rounded-xl border border-[var(--o-border)] px-6 py-3 text-sm font-medium text-[var(--o-text-secondary)] transition-all duration-150 hover:border-[var(--o-text-dim)] hover:text-[var(--o-text)]">
                <DownloadIcon />
                Download
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--o-border-subtle)] px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="font-serif text-sm font-medium text-[var(--o-text-secondary)]">Origin</span>
            <span className="text-xs text-[var(--o-text-dim)]">&middot;</span>
            <span className="text-xs text-[var(--o-text-muted)]">The open-source memory layer for the agentic era</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://github.com/7xuanlu/origin" className="text-xs text-[var(--o-text-muted)] transition-colors duration-150 hover:text-[var(--o-text-secondary)]">GitHub</Link>
            <Link href="https://github.com/7xuanlu/origin/blob/main/LICENSE" className="text-xs text-[var(--o-text-muted)] transition-colors duration-150 hover:text-[var(--o-text-secondary)]">AGPL-3.0</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
