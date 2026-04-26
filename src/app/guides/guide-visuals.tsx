export function GuideHalo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 720 720"
        fill="none"
        className="animate-float absolute -top-36 right-[-220px] h-[620px] w-[620px] sm:right-[-120px] sm:h-[760px] sm:w-[760px]"
        style={{
          opacity: "var(--o-ring-opacity)",
          filter: "var(--o-ring-filter)",
        }}
      >
        <defs>
          <linearGradient
            id="guide-ring"
            x1="96"
            y1="360"
            x2="624"
            y2="360"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" style={{ stopColor: "var(--o-ring-grad-start)" }} />
            <stop offset="40%" style={{ stopColor: "var(--o-ring-grad-mid)" }} />
            <stop offset="70%" style={{ stopColor: "var(--o-ring-grad-mid2)" }} />
            <stop offset="100%" style={{ stopColor: "var(--o-ring-grad-end)" }} />
          </linearGradient>
          <radialGradient id="guide-orb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop
              offset="45%"
              style={{ stopColor: "var(--o-ring-orb-glow)" }}
              stopOpacity="0.85"
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--o-ring-orb-edge)" }}
              stopOpacity="0"
            />
          </radialGradient>
        </defs>
        <circle
          cx="360"
          cy="360"
          r="218"
          stroke="url(#guide-ring)"
          strokeWidth="62"
          strokeLinecap="round"
        />
        <circle cx="488" cy="178" r="38" fill="url(#guide-orb)" />
        <circle cx="488" cy="178" r="15" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

export function MemoryIndex({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] backdrop-blur">
      <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--o-text-muted)] uppercase">
        {label}
      </p>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={item} className="grid grid-cols-[32px_1fr] gap-3">
            <span className="font-mono text-[11px] text-[var(--o-warm)]">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed text-[var(--o-text-secondary)]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
