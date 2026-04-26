import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

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
          for a typo.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-[var(--o-text)] px-5 py-3 text-center text-sm font-semibold text-[var(--o-bg)] transition-all hover:shadow-[0_0_28px_var(--o-glow-warm)]"
          >
            Back to home
          </Link>
          <Link
            href="/guides"
            className="rounded-xl border border-[var(--o-border)] px-5 py-3 text-center text-sm font-medium text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-text)]"
          >
            Browse guides
          </Link>
        </div>
      </div>
    </main>
  );
}

