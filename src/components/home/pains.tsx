import { Fragment, type ReactNode } from "react";
import type { HomeContent } from "@/i18n/content";
import { ArrowRightIcon } from "@/components/icons";
import type { Locale } from "@/i18n/locales";
import { LocalizedLink } from "@/i18n/navigation";
import { WorkflowHelp } from "./workflow-help";

type PainsCopy = HomeContent["redesign"]["pains"];

function Answer({ label, detail }: { readonly label: string; readonly detail: string }) {
  return <div className="workflow-answer"><strong>{label}</strong><p>{detail}</p></div>;
}

// All alternatives share an intrinsic-size grid cell. Inactive copy reserves
// space without being visible, focusable, or exposed to assistive technology.
function Alternatives({ rows, children }: {
  readonly rows: PainsCopy["generations"];
  readonly children: (row: PainsCopy["generations"][number]) => ReactNode;
}) {
  return <div className="workflow-stack">{rows.map((row) => (
    <div key={row.id} className="workflow-alternative" data-alternative={row.id}>{children(row)}</div>
  ))}</div>;
}

function ComparisonPanel({ rows, copy, locale }: {
  readonly rows: PainsCopy["generations"];
  readonly copy: PainsCopy;
  readonly locale: Locale;
}) {
  return (
    <>
      <div className="workflow-pair-summary">
        <Alternatives rows={rows}>{(row) => <p>{row.summary}</p>}</Alternatives>
      </div>
      <table className="workflow-comparison">
        <caption className="sr-only">{copy.title}</caption>
        <colgroup><col className="workflow-questionColumn" /><col /><col /></colgroup>
        <thead>
          <tr>
            <td className="workflow-spacer" />
            <th scope="col" data-wenlan-featured className="workflow-wenlan">
              <div><div className="workflow-product-name"><span className="font-serif">{copy.current.name}</span></div><p className="workflow-product-kind">{copy.current.tagline}</p></div>
            </th>
            <th scope="col"><Alternatives rows={rows}>{(row) => <>
              <div className="workflow-product-name font-serif"><WorkflowHelp name={row.name} label={`${row.name} · ${copy.helpLabel}`}>{row.body}</WorkflowHelp></div>
              <p className="workflow-product-kind">{row.eyebrow}</p>
            </>}</Alternatives></th>
          </tr>
        </thead>
        <tbody>
          {copy.dimensions.map((dimension, index) => (
            <tr key={dimension}>
              <th scope="row">{dimension}</th>
              <td className="workflow-wenlan">
                <Alternatives rows={rows}>{(row) => (
                  <Answer label={row.wenlan.labels[index]} detail={row.wenlan.profile[index]} />
                )}</Alternatives>
              </td>
              <td><Alternatives rows={rows}>{(row) => <Answer label={row.profileLabels[index]} detail={row.profile[index]} />}</Alternatives></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <p className="max-w-2xl pt-2 text-sm leading-7 text-[var(--o-text-tertiary)]">{copy.scopeNote}</p>
        <Alternatives rows={rows}>{(row) => (
          <LocalizedLink
            href={`/learn/choose-ai-knowledge-base-tool#workflow-${row.id}`}
            locale={locale}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--o-text-secondary)] hover:text-[var(--o-warm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--o-warm)]"
          >
            {copy.detailsLabel}: {row.name}
            <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </LocalizedLink>
        )}</Alternatives>
      </div>
    </>
  );
}

export function PainsSection({ copy, locale }: { readonly copy: PainsCopy; readonly locale: Locale }) {
  const rows = copy.generations;

  return (
    <section id="knowledge-workflows" data-home-reveal className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-balance sm:text-5xl">
            {copy.title.split(/(知識工作流程|知识工作流)/).map((part, index) =>
              /^(知識工作流程|知识工作流)$/.test(part)
                ? <span key={index} className="inline-block">{part}</span>
                : part,
            )}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--o-text-secondary)]">{copy.intro}</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--o-text-secondary)]">{copy.accessNote}</p>
        </div>

        <fieldset data-workflow-comparison className="mt-10 min-w-0 sm:mt-12">
          <legend className="mb-3 text-base font-medium text-[var(--o-text)]">{copy.selectorLabel}</legend>
          <div className="workflow-chooser">
            <div className="workflow-controls">
            {rows.map((row, index) => {
              const choiceId = `workflow-choice-${row.id}`;
              return (
                <Fragment key={row.id}>
                  <input className="workflow-choice sr-only" type="radio" name="knowledge-workflow" id={choiceId} aria-controls="workflow-comparison-panel" defaultChecked={index === 0} />
                  <label htmlFor={choiceId} className="workflow-option">{row.tabLabel ?? row.name}</label>
                </Fragment>
              );
            })}
            </div>
            <div id="workflow-comparison-panel" className="workflow-panel">
              <ComparisonPanel rows={rows} copy={copy} locale={locale} />
            </div>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
