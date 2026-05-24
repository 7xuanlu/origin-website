import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--o-border-subtle)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Site footer" className="grid gap-8 sm:grid-cols-4">
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
              Origin
            </p>
            <p className="text-sm leading-relaxed text-[var(--o-text-muted)]">
              Local-first memory for AI work.
            </p>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
              Product
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/get-started"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  Get started
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/daily-workflow"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  Daily workflow
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  Learn
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
              Compare
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/learn/origin-vs-basic-memory"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  vs Basic Memory
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/origin-vs-claude-mem"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  vs claude-mem
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/origin-vs-superlocal-memory"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  vs Superlocal Memory
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
              Project
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/7xuanlu/origin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="/feed.xml"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  RSS feed
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/7xuanlu/origin/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer license"
                  className="text-[var(--o-text-secondary)] transition-colors hover:text-[var(--o-warm)]"
                >
                  Apache-2.0
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--o-border-subtle)] pt-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="font-serif text-sm font-medium text-[var(--o-text-secondary)]">
              Origin
            </span>
            <span className="text-xs text-[var(--o-text-dim)]">&middot;</span>
            <span className="text-xs text-[var(--o-text-muted)]">
              Where AI work compounds
            </span>
          </div>
          <p className="font-mono text-[10px] text-[var(--o-text-muted)]">
            Built by{" "}
            <a
              href="https://github.com/7xuanlu"
              target="_blank"
              rel="noopener noreferrer author"
              className="underline decoration-[var(--o-warm)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--o-warm)]"
            >
              Qi-Xuan Lu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
