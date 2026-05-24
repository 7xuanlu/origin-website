import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const popularDestinations = [
  {
    href: "/docs/get-started",
    label: "Get started",
    description: "Install Origin and verify the first local memory loop.",
  },
  {
    href: "/docs/daily-workflow",
    label: "Daily workflow",
    description: "Capture, handoff, distill across AI sessions.",
  },
  {
    href: "/learn/ai-work-memory",
    label: "AI work memory",
    description: "What changes when AI sessions carry context across days.",
  },
  {
    href: "/learn/mcp-memory-server",
    label: "MCP memory server",
    description: "How Origin exposes memory through MCP.",
  },
  {
    href: "/learn/origin-vs-basic-memory",
    label: "Origin vs Basic Memory",
    description: "Markdown knowledge base vs AI work-session memory layer.",
  },
  {
    href: "/about",
    label: "About",
    description: "Project background, principles, and the person behind Origin.",
  },
];

export default function NotFound() {
  return (
    <main className="grain min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
          404
        </p>
        <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-[var(--o-text)] sm:text-5xl">
          This page does not exist.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--o-text-secondary)]">
          If you followed a link, it may be outdated. If you typed the URL, check
          for a typo. Below are common starting points.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
          >
            Back to home
          </Link>
          <Link
            href="/learn"
            className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
          >
            Browse articles
          </Link>
        </div>

        <section className="mt-16">
          <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
            Popular destinations
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {popularDestinations.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="card-origin group block rounded-xl p-5 transition-transform duration-150 hover:-translate-y-1"
              >
                <p className="font-serif text-lg font-medium tracking-tight text-[var(--o-text)]">
                  {d.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--o-text-muted)]">
                  {d.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
