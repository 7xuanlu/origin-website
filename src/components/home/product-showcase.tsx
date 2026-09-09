"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { Locale } from "@/i18n/locales";
import { trackAnalyticsEvent } from "@/components/tracked-link";

const labels = {
  en: { title: "See the pages. Follow the connections.", tabs: ["Knowledge graph", "Wiki page", "Review changes"], descriptions: ["Knowledge around Wenlan: connected records, entities and wiki pages.", "Hovering a Wiki citation reveals the source memory.", "Compare proposed edits and earlier versions before choosing whether to approve."], notes: ["Real-data screenshot provided by Wenlan's creator, September 6, 2026. A view of the graph, not a live connection.", "Recorded in the app with demo data.", "Recorded in the app with demo data."], expand: "View full size", close: "Close image" },
  "zh-TW": { title: "讀懂知識，也看見它的關聯。", tabs: ["知識圖譜", "Wiki 頁面", "審核變更"], descriptions: ["圍繞 Wenlan 累積的知識：記錄、實體與 Wiki 頁面彼此相連。", "指向 Wiki 引用，即可查看來源記憶。", "對照建議修改與先前版本，再決定是否採用。"], notes: ["文瀾作者提供的實際資料截圖，2026-09-06。圖譜的局部視角，非即時連線。", "實機錄影，使用示範資料。", "實機錄影，使用示範資料。"], expand: "放大查看", close: "關閉圖片" },
  "zh-CN": { title: "读懂知识，也看见它的关联。", tabs: ["知识图谱", "Wiki 页面", "审核变更"], descriptions: ["围绕 Wenlan 积累的知识：记录、实体与 Wiki 页面相互连接。", "指向 Wiki 引用，即可查看来源记忆。", "对照建议修改与先前版本，再决定是否采用。"], notes: ["文澜作者提供的实际数据截图，2026-09-06。图谱的局部视角，非实时连接。", "实机录屏，使用演示数据。", "实机录屏，使用演示数据。"], expand: "放大查看", close: "关闭图片" },
} as const;

const images = [
  { src: "/images/product-evidence/wenlan-live-knowledge-graph-20260906.webp", width: 3456, height: 1950 },
  { src: "/images/product-evidence/wenlan-recorded-wiki-source-hover.webp", width: 2880, height: 1800 },
  { src: "/images/product-evidence/wenlan-recorded-page-review.webp", width: 2880, height: 1800 },
] as const;

const viewerLabels = {
  en: { fit: "Fit", detail: "Zoom in", original: "Open original", hint: "Scroll or swipe to explore the enlarged image." },
  "zh-TW": { fit: "全圖", detail: "放大細節", original: "開啟原圖", hint: "滑動圖片，查看放大後的細節。" },
  "zh-CN": { fit: "全图", detail: "放大细节", original: "打开原图", hint: "滑动图片，查看放大后的细节。" },
} as const;

// Start the enlarged view at the subject, not at the app sidebar.
const detailFocus = [{ x: 0.66, y: 0.61 }, { x: 0.56, y: 0.69 }, { x: 0.6, y: 0.5 }];

export function ProductShowcase({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const viewer = viewerLabels[locale];
  const [active, setActive] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const imageViewport = useRef<HTMLDivElement>(null);
  const changeZoom = (zoom: boolean) => {
    setEnlarged(zoom);
    requestAnimationFrame(() => {
      const viewport = imageViewport.current;
      if (!viewport || !dialog.current?.open) return;
      const focus = detailFocus[active];
      viewport.scrollTo({
        left: zoom ? 1600 * focus.x - viewport.clientWidth / 2 : 0,
        top: zoom ? 1600 * images[active].height / images[active].width * focus.y - viewport.clientHeight / 2 : 0,
      });
    });
  };
  const openImage = () => {
    dialog.current?.showModal();
    changeZoom(true);
    trackAnalyticsEvent({ eventName: "product_image_open", placement: "home-product-views", locale, context: "home", detail: ["graph", "wiki", "review"][active] });
  };
  const select = (next: number, focus = true) => {
    if (next !== active) trackAnalyticsEvent({ eventName: "product_view_select", placement: "home-product-views", locale, context: "home", detail: ["graph", "wiki", "review"][next] });
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };
  return (
    <section id="product-views" data-home-reveal className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl font-serif text-3xl font-medium tracking-tight text-balance sm:text-5xl">
          {locale === "en" ? copy.title : copy.title.split(/(?<=，)/).map((phrase) => <span key={phrase} className="inline-block">{phrase}</span>)}
        </h2>
        <div role="tablist" aria-label={copy.title} className="mt-8 flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-[var(--o-border)] bg-[var(--o-surface)] p-1">
          {copy.tabs.map((label, i) => <button key={label} ref={(el) => { tabs.current[i] = el; }} id={`${id}-tab-${i}`} role="tab" type="button" aria-selected={active === i} aria-controls={`${id}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => select(i, false)} onKeyDown={(event) => {
            if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              select(event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + images.length) % images.length);
            }
          }} className={`min-h-11 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none sm:px-5 focus-visible:outline-2 focus-visible:outline-[var(--o-warm)] ${active === i ? "bg-[var(--o-text)] text-[var(--o-bg)]" : "text-[var(--o-text-secondary)] hover:text-[var(--o-text)]"}`}>{label}</button>)}
        </div>
        <div className="relative mt-6">
          {images.map((image, i) => <figure key={image.src} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} aria-hidden={active !== i} inert={active !== i} className={active === i ? "relative" : "invisible absolute inset-x-0 top-0"}>
            <button type="button" onClick={openImage} aria-label={`${copy.expand}: ${copy.tabs[i]}`} className="home-product-frame group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--o-border)] bg-[var(--o-bg-alt)] text-left shadow-[var(--o-shadow-media)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)]">
              <Image {...image} alt={copy.descriptions[i]} sizes="(max-width: 768px) calc(100vw - 48px), 1152px" className="h-auto w-full" />
            </button>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-xs leading-relaxed text-[var(--o-text-secondary)]"><p className="max-w-[85ch]">{copy.descriptions[i]} <span className="inline-block text-[var(--o-text-muted)]">{copy.notes[i].split(/(?<=[。，])/).map((phrase) => <span key={phrase} className="inline-block">{phrase}</span>)}</span></p><button type="button" className="min-h-11 shrink-0 whitespace-nowrap text-[var(--o-warm)] underline underline-offset-4" onClick={openImage}>{copy.expand}</button></figcaption>
          </figure>)}
        </div>
      </div>
      <dialog ref={dialog} className="home-image-dialog fixed m-auto max-h-[94dvh] w-[min(96vw,1600px)] max-w-none flex-col gap-3 overflow-hidden rounded-xl border border-[var(--o-border)] bg-[var(--o-bg)] p-3 text-[var(--o-text)] open:flex sm:p-5" aria-label={copy.tabs[active]} onClose={() => setEnlarged(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-[var(--o-border)] p-1">
            {[false, true].map((zoom) => <button key={String(zoom)} type="button" aria-pressed={enlarged === zoom} onClick={() => changeZoom(zoom)} className={`min-h-11 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--o-warm)] ${enlarged === zoom ? "bg-[var(--o-text)] text-[var(--o-bg)]" : "text-[var(--o-text-secondary)]"}`}>{zoom ? viewer.detail : viewer.fit}</button>)}
          </div>
          <form method="dialog"><button autoFocus className="min-h-11 whitespace-nowrap rounded-lg border border-[var(--o-border)] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--o-warm)]">{copy.close}</button></form>
        </div>
        <div ref={imageViewport} role="region" aria-label={`${copy.tabs[active]}: ${viewer.detail}`} aria-describedby={`${id}-image-hint`} tabIndex={0} className="min-h-0 max-h-[72dvh] overflow-auto overscroll-contain rounded-lg border border-[var(--o-border)] focus-visible:outline-2 focus-visible:outline-[var(--o-warm)]">
          <Image {...images[active]} unoptimized alt={copy.descriptions[active]} className="mx-auto h-auto" style={{ width: enlarged ? 1600 : "auto", maxWidth: enlarged ? "none" : "100%", maxHeight: enlarged ? "none" : "68dvh" }} />
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-[var(--o-text-secondary)]">
          <p id={`${id}-image-hint`}>{viewer.hint}</p>
          <a href={images[active].src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center whitespace-nowrap text-[var(--o-warm)] underline underline-offset-4">{viewer.original}</a>
        </div>
      </dialog>
    </section>
  );
}
