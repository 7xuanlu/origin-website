import type { ReactNode } from "react";
import type { ProductEvidence } from "@/app/(en)/learn/articles";
import { EvidenceImage } from "@/components/learn/evidence-image";
import type { Locale } from "@/i18n/locales";

type ProductEvidencePanelProps = {
  evidence: ProductEvidence;
  locale?: Locale;
  renderText?: (text: string) => ReactNode;
};

export function ProductEvidencePanel({
  evidence,
  locale,
  renderText = (text) => text,
}: ProductEvidencePanelProps) {
  return (
    <section
      id="product-evidence"
      aria-labelledby="product-evidence-heading"
      className="scroll-mt-24 px-6 pb-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <h2
            id="product-evidence-heading"
            className="font-serif text-3xl font-medium tracking-tight text-[var(--o-text)] sm:text-4xl"
          >
            {renderText(evidence.heading)}
          </h2>
          <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-[var(--o-text-secondary)]">
            {renderText(evidence.summary)}
          </p>
        </div>

        <figure className="mt-8 overflow-hidden rounded-2xl border border-[var(--o-border)] bg-[var(--o-card-bg)] shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
          <EvidenceImage
            image={{
              src: evidence.image.src,
              alt: evidence.image.alt,
              width: evidence.image.width,
              height: evidence.image.height,
            }}
            locale={locale}
          />
          <figcaption className="border-t border-[var(--o-border-subtle)] px-5 py-4 text-sm leading-relaxed text-[var(--o-text-muted)] sm:px-6">
            {renderText(evidence.image.caption)}
          </figcaption>
        </figure>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <ol className="space-y-6">
              {evidence.workflow.map((step, index) => (
                <li
                  key={step.label}
                  className="grid grid-cols-[36px_minmax(0,1fr)] gap-4"
                >
                  <span className="pt-1 font-mono text-[11px] text-[var(--o-warm)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--o-text)]">
                      {renderText(step.label)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--o-text-muted)]">
                      {renderText(step.detail)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[var(--o-border)] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <h3 className="font-serif text-2xl font-medium tracking-tight text-[var(--o-text)]">
              {renderText(evidence.artifactHeading)}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--o-text-muted)]">
              {renderText(evidence.artifactNote)}
            </p>
            <dl className="mt-6 space-y-5">
              {evidence.artifactRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-2 border-b border-[var(--o-border-subtle)] pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[128px_minmax(0,1fr)]"
                >
                  <dt className="font-mono text-[11px] tracking-[0.08em] text-[var(--o-warm)] uppercase">
                    {renderText(row.label)}
                  </dt>
                  <dd className="text-sm leading-relaxed text-[var(--o-text-secondary)]">
                    {renderText(row.detail)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
