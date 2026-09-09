"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { Locale } from "@/i18n/locales";

type EvidenceImageData = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Kept optional for existing callers; captions are rendered by their server parent. */
  caption?: string;
};

type EvidenceImageProps = {
  image: EvidenceImageData;
  locale?: Locale;
};

const labels = {
  en: {
    expand: "View full size",
    close: "Close image",
    fit: "Fit",
    detail: "Zoom in",
    original: "Open original",
    hint: "Scroll or swipe to explore the enlarged image.",
    dialog: "Product evidence image",
  },
  "zh-TW": {
    expand: "放大查看",
    close: "關閉圖片",
    fit: "全圖",
    detail: "放大細節",
    original: "開啟原圖",
    hint: "滑動圖片，查看放大後的細節。",
    dialog: "產品證據圖片",
  },
  "zh-CN": {
    expand: "放大查看",
    close: "关闭图片",
    fit: "全图",
    detail: "放大细节",
    original: "打开原图",
    hint: "滑动图片，查看放大后的细节。",
    dialog: "产品证据图片",
  },
} as const;

type ViewMode = "fit" | "detail";

export function EvidenceImage({ image, locale = "en" }: EvidenceImageProps) {
  const copy = labels[locale];
  const [mode, setMode] = useState<ViewMode>("fit");
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();
  const hintId = `${id}-hint`;

  const focusViewport = () => {
    requestAnimationFrame(() => {
      if (dialog.current?.open) viewport.current?.focus();
    });
  };

  const openImage = () => {
    dialog.current?.showModal();
    setMode("fit");
    requestAnimationFrame(() => {
      if (dialog.current?.open) closeButton.current?.focus();
    });
  };

  const changeMode = (nextMode: ViewMode) => {
    setMode(nextMode);
    requestAnimationFrame(() => {
      const imageViewport = viewport.current;
      if (!dialog.current?.open || !imageViewport) return;
      imageViewport.scrollTo({ top: 0, left: 0 });
      if (nextMode === "detail") focusViewport();
    });
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={openImage}
        aria-label={`${copy.expand}: ${image.alt}`}
        className="group block w-full cursor-zoom-in overflow-hidden bg-[var(--o-bg-alt)] text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--o-warm)]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) calc(100vw - 3rem), 1024px"
          loading="lazy"
          className="h-auto w-full"
        />
        <span className="flex min-h-11 items-center justify-end px-4 text-sm font-semibold text-[var(--o-warm)] underline underline-offset-4">{copy.expand}</span>
      </button>

      <dialog
        ref={dialog}
        aria-label={copy.dialog}
        className="fixed m-auto max-h-[94dvh] w-[min(96vw,1600px)] max-w-none flex-col gap-3 overflow-hidden rounded-xl border border-[var(--o-border)] bg-[var(--o-bg)] p-3 text-[var(--o-text)] open:flex sm:p-5"
        onClose={() => {
          setMode("fit");
          requestAnimationFrame(() => trigger.current?.focus());
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-[var(--o-border)] p-1">
            <button
              type="button"
              aria-pressed={mode === "fit"}
              onClick={() => changeMode("fit")}
              className={`min-h-11 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--o-warm)] ${mode === "fit" ? "bg-[var(--o-text)] text-[var(--o-bg)]" : "text-[var(--o-text-secondary)]"}`}
            >
              {copy.fit}
            </button>
            <button
              type="button"
              aria-pressed={mode === "detail"}
              onClick={() => changeMode("detail")}
              className={`min-h-11 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--o-warm)] ${mode === "detail" ? "bg-[var(--o-text)] text-[var(--o-bg)]" : "text-[var(--o-text-secondary)]"}`}
            >
              {copy.detail}
            </button>
          </div>
          <form method="dialog">
            <button
              ref={closeButton}
              type="submit"
              className="min-h-11 whitespace-nowrap rounded-lg border border-[var(--o-border)] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--o-warm)]"
            >
              {copy.close}
            </button>
          </form>
        </div>

        <div
          ref={viewport}
          role="region"
          aria-label={`${image.alt}: ${copy.detail}`}
          aria-describedby={hintId}
          tabIndex={0}
          className="min-h-0 max-h-[72dvh] overflow-auto overscroll-contain rounded-lg border border-[var(--o-border)] focus-visible:outline-2 focus-visible:outline-[var(--o-warm)]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            unoptimized
            className="mx-auto h-auto"
            style={{
              width: mode === "detail" ? 1600 : "auto",
              maxWidth: mode === "detail" ? "none" : "100%",
              maxHeight: mode === "detail" ? "none" : "68dvh",
            }}
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-[var(--o-text-secondary)]">
          <p id={hintId}>{copy.hint}</p>
          <a
            href={image.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center whitespace-nowrap text-[var(--o-warm)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--o-warm)]"
          >
            {copy.original}
          </a>
        </div>
      </dialog>
    </>
  );
}
