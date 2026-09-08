"use client";

import { useEffect, useRef } from "react";
import {
  htmlLangByLocale,
  hreflangByLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/i18n/locales";
import { localizedHrefForLocale } from "@/i18n/navigation";

const localeLabels = {
  en: "English",
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
} as const satisfies Record<Locale, string>;

export function LanguageSwitcher({ locale, href }: { locale: Locale; href: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (details && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const details = detailsRef.current;
      if (event.key !== "Escape" || !details?.open) return;

      event.preventDefault();
      details.open = false;
      summaryRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        ref={summaryRef}
        className="inline-flex min-h-9 min-w-11 cursor-pointer list-none items-center justify-center gap-1 rounded-md border border-[var(--o-border-subtle)] px-2 text-xs text-[var(--o-text-secondary)] transition-colors hover:border-[var(--o-border)] hover:text-[var(--o-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--o-warm)] [@media(pointer:coarse)]:min-h-11 [&::-webkit-details-marker]:hidden"
      >
        <span lang={htmlLangByLocale[locale]}>{localeLabels[locale]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          fill="none"
          className="size-3 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
        >
          <path
            d="m3 4.5 3 3 3-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </summary>

      <div className="absolute right-0 top-[calc(100%+0.375rem)] z-50 w-36 rounded-md border border-[var(--o-border)] bg-[var(--o-bg-alt)] p-1 shadow-[var(--o-shadow-media)]">
        {SUPPORTED_LOCALES.map((targetLocale) => {
          const active = targetLocale === locale;

          return (
            <a
              key={targetLocale}
              href={localizedHrefForLocale(targetLocale, href)}
              lang={htmlLangByLocale[targetLocale]}
              hrefLang={hreflangByLocale[targetLocale]}
              aria-current={active ? "true" : undefined}
              className={`flex min-h-9 items-center rounded px-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--o-warm)] [@media(pointer:coarse)]:min-h-11 ${
                active
                  ? "bg-[var(--o-surface)] font-medium text-[var(--o-text)]"
                  : "text-[var(--o-text-secondary)] hover:bg-[var(--o-surface)] hover:text-[var(--o-text)]"
              }`}
            >
              {localeLabels[targetLocale]}
            </a>
          );
        })}
      </div>
    </details>
  );
}
