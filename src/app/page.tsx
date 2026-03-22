import Link from "next/link";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const features = [
  {
    title: "Hybrid Memory Engine",
    description:
      "Vector search, full-text search, and knowledge graph — unified in one local database with Reciprocal Rank Fusion.",
    tag: "libSQL",
  },
  {
    title: "Knowledge Graph",
    description:
      "Entities, relations, and observations form a structured web of your personal knowledge that grows over time.",
    tag: "Graph",
  },
  {
    title: "MCP-Native",
    description:
      "Any MCP-compatible agent reads and writes your memory. Claude, Cursor, ChatGPT — all connected through one protocol.",
    tag: "Protocol",
  },
  {
    title: "On-Device Intelligence",
    description:
      "Qwen3-4B runs on Apple Silicon Metal GPU. Your data never leaves your machine for processing.",
    tag: "Local AI",
  },
  {
    title: "Memory Import",
    description:
      "Bring your existing AI memories home. Import from ChatGPT and Claude — no cold start, instant value.",
    tag: "Day Zero",
  },
  {
    title: "Privacy by Architecture",
    description:
      "PII redaction, local-first storage, AGPL source code. Privacy you can verify, not just trust.",
    tag: "Privacy",
  },
];

const steps = [
  {
    number: "01",
    title: "Install",
    description: "Download Origin for macOS. One app, everything included.",
  },
  {
    number: "02",
    title: "Import",
    description:
      "Bring your ChatGPT and Claude memories. Instant personal context.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Link your AI agents via MCP. Claude Code, Cursor, Claude Desktop — one click.",
  },
  {
    number: "04",
    title: "Remember",
    description:
      "Every AI you use now knows you. Your memory grows, compounds, persists.",
  },
];

const stack = [
  {
    layer: "Consumer App",
    tech: "Tauri 2 + React 19",
    purpose: "Search, browse, curate, visualize",
  },
  {
    layer: "Agent Interface",
    tech: "MCP Server (HTTP + Unix socket)",
    purpose: "Any MCP agent reads / writes memory",
  },
  {
    layer: "Intelligence",
    tech: "Qwen3-4B on-device + cloud models",
    purpose: "Summarize, categorize, find connections",
  },
  {
    layer: "Memory Engine",
    tech: "libSQL — vectors + FTS5 + knowledge graph",
    purpose: "Store, search, connect memories",
  },
  {
    layer: "Privacy",
    tech: "PII redaction, local-first, AGPL",
    purpose: "Verifiable privacy — read the code",
  },
];

export default function LandingPage() {
  return (
    <div className="grain relative min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 z-40 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">
              Origin
            </span>
            <span className="rounded-full border border-amber-glow/20 bg-amber-glow/5 px-2 py-0.5 font-mono text-[10px] text-amber-glow">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/7xuanlu/origin"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <GitHubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <Link
              href="https://github.com/7xuanlu/origin/releases"
              className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              <DownloadIcon />
              Download
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-14">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, oklch(0.78 0.15 75 / 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl text-center">
          <p className="animate-fade-up mb-6 font-mono text-xs tracking-[0.3em] text-amber-glow/70 uppercase">
            Personal Agent Memory Layer
          </p>
          <h1 className="animate-fade-up delay-100 amber-glow text-5xl leading-[1.1] font-bold tracking-tight sm:text-7xl">
            One memory,
            <br />
            every agent.
          </h1>
          <p className="animate-fade-up delay-200 mx-auto mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            Open-source memory layer that makes every AI tool you use smarter.
            Local-first, privacy-first, MCP-native.{" "}
            <span className="text-zinc-200">You own the data. Always.</span>
          </p>
          <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="https://github.com/7xuanlu/origin/releases"
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-white hover:shadow-[0_0_24px_oklch(0.78_0.15_75/0.2)]"
            >
              <DownloadIcon />
              Download for macOS
            </Link>
            <Link
              href="https://github.com/7xuanlu/origin"
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-100"
            >
              View on GitHub
              <ArrowIcon />
            </Link>
          </div>
          <p className="animate-fade-up delay-400 mt-6 font-mono text-xs text-zinc-600">
            macOS (Apple Silicon) &middot; Free &middot; Open Source (AGPL-3.0)
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-up delay-700 absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-zinc-700 p-1">
            <div
              className="h-1.5 w-1 rounded-full bg-zinc-500"
              style={{
                animation: "fade-up 1.5s ease-in-out infinite alternate",
              }}
            />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative border-t border-zinc-800/50 px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-600 uppercase">
            The problem
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Every AI tool{" "}
            <span className="text-zinc-500 line-through decoration-zinc-700">
              forgets
            </span>{" "}
            you.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            ChatGPT doesn&apos;t know what you told Claude. Claude doesn&apos;t
            know what you built in Cursor. Each tool is an isolated amnesiac.
            The more AI tools you use, the worse it gets.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {["ChatGPT", "Claude", "Cursor"].map((tool) => (
              <div
                key={tool}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-5"
              >
                <p className="font-mono text-sm text-zinc-500">{tool}</p>
                <p className="mt-1 text-xs text-zinc-600">
                  Knows nothing about you
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-500">
            Platforms will never fix this. OpenAI won&apos;t share your memory
            with Anthropic.
            <br />
            They&apos;re structurally incentivized to keep you locked in.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="relative border-t border-zinc-800/50 px-6 py-32">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, oklch(0.78 0.15 75 / 0.04) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-amber-glow/70 uppercase">
            The solution
          </p>
          <h2 className="amber-glow text-3xl font-bold tracking-tight sm:text-4xl">
            Origin remembers.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            The neutral memory layer that sits between you and all your AI
            agents. It runs on your device, captures and organizes your personal
            knowledge, and makes it available to any MCP-compatible agent.
          </p>
          <div className="card-glow mx-auto mt-12 max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-left">
            <p className="font-mono text-xs text-amber-glow/60">
              $ origin setup
            </p>
            <div className="mt-4 space-y-2 font-mono text-sm">
              <p className="text-zinc-400">
                <span className="text-green-400">✓</span> Import ChatGPT
                memories
              </p>
              <p className="text-zinc-400">
                <span className="text-green-400">✓</span> Import Claude memories
              </p>
              <p className="text-zinc-400">
                <span className="text-green-400">✓</span> Connect agents via MCP
              </p>
              <p className="text-zinc-100">
                <span className="text-amber-glow">→</span> Every AI you use now
                knows you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-zinc-800/50 px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-600 uppercase">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Four steps. Forever memory.
            </h2>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group bg-zinc-900/80 p-8 transition-colors hover:bg-zinc-900"
              >
                <span className="font-mono text-3xl font-bold text-zinc-800 transition-colors group-hover:text-amber-glow/30">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800/50 px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-600 uppercase">
              Features
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the agentic era.
            </h2>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-glow group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 transition-all"
              >
                <span className="inline-block rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400 transition-colors group-hover:border-amber-glow/20 group-hover:text-amber-glow/70">
                  {feature.tag}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-t border-zinc-800/50 px-6 py-32">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-600 uppercase">
              Architecture
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything on your machine.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-zinc-500">
              Five layers, one binary. No cloud required.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-800">
            {stack.map((row, i) => (
              <div
                key={row.layer}
                className={`grid grid-cols-[140px_1fr_1fr] gap-4 px-6 py-4 text-sm ${
                  i !== stack.length - 1 ? "border-b border-zinc-800/50" : ""
                } ${i === 0 ? "bg-zinc-900/40" : ""}`}
              >
                <span className="font-medium text-zinc-200">{row.layer}</span>
                <span className="font-mono text-xs text-zinc-500">
                  {row.tech}
                </span>
                <span className="text-zinc-500">{row.purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="border-t border-zinc-800/50 px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-600 uppercase">
            Why now
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The window is open.
          </h2>
          <div className="mt-12 space-y-6 text-left">
            {[
              {
                signal: "Limitless acquired by Meta, Bee by Amazon — both killed.",
                meaning:
                  "No independent privacy-first personal memory product exists.",
              },
              {
                signal:
                  "MCP became the interoperability standard.",
                meaning:
                  "Cross-agent memory is now architecturally possible.",
              },
              {
                signal:
                  "On-device AI crossed the performance threshold.",
                meaning:
                  "Real intelligence runs locally on Apple Silicon.",
              },
              {
                signal: "Trust is broken.",
                meaning:
                  "Post-acquisition, users demand verifiable privacy, not promises.",
              },
            ].map((item) => (
              <div
                key={item.signal}
                className="flex gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-6 py-5"
              >
                <span className="mt-0.5 text-amber-glow/50">→</span>
                <div>
                  <p className="font-medium text-zinc-200">{item.signal}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <section className="border-t border-zinc-800/50 px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-amber-glow/70 uppercase">
            Open source
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Read every line.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400">
            Origin is AGPL-3.0. The complete desktop experience — memory engine,
            unlimited agents, all capture methods, on-device LLM, knowledge
            graph. Nothing held back.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="https://github.com/7xuanlu/origin"
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-white"
            >
              <GitHubIcon />
              Star on GitHub
            </Link>
            <Link
              href="https://github.com/7xuanlu/origin/releases"
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-100"
            >
              <DownloadIcon />
              Download
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-400">Origin</span>
            <span className="text-xs text-zinc-700">&middot;</span>
            <span className="text-xs text-zinc-600">
              The open-source memory layer for the agentic era
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/7xuanlu/origin"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              GitHub
            </Link>
            <Link
              href="https://github.com/7xuanlu/origin/blob/main/LICENSE"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              AGPL-3.0
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
