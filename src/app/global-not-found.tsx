import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 | Wenlan",
  description: "This page does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

const popularDestinations = [
  {
    href: "/docs/get-started",
    label: "Get started",
    description: "Install Wenlan and verify the first local memory loop.",
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
    description: "How Wenlan exposes memory through MCP.",
  },
  {
    href: "/learn/wenlan-vs-basic-memory",
    label: "Wenlan vs Basic Memory",
    description: "Markdown knowledge base vs AI work-session memory layer.",
  },
  {
    href: "/about",
    label: "About",
    description: "Project background, principles, and the person behind Wenlan.",
  },
];

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("wenlan-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);else if(window.matchMedia("(prefers-color-scheme:light)").matches)document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <main className="grain min-h-screen px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.3em] text-[var(--o-text-muted)] uppercase">
              404
            </p>
            <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-[var(--o-text)] sm:text-5xl">
              This page does not exist.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--o-text-secondary)]">
              If you followed a link, it may be outdated. If you typed the URL,
              check for a typo. Below are common starting points.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="btn-wenlan btn-wenlan-primary"
              >
                Back to home
              </a>
              <a
                href="/learn"
                className="btn-wenlan btn-wenlan-secondary"
              >
                Browse articles
              </a>
            </div>

            <section className="mt-16">
              <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-warm)]/80 uppercase">
                Popular destinations
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {popularDestinations.map((destination) => (
                  <a
                    key={destination.href}
                    href={destination.href}
                    className="card-wenlan group block p-5"
                  >
                    <p className="font-serif text-lg font-medium tracking-tight text-[var(--o-text)]">
                      {destination.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--o-text-muted)]">
                      {destination.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
