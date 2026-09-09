"use client";

import type { Locale } from "@/i18n/locales";
import { trackAnalyticsEvent } from "@/components/tracked-link";

const details: Record<string, string> = {
  "wiki-graveyard": "files", "llm-wiki-workflow": "llm-wiki", "llm-wiki-1": "obsidian",
  "vault-agents": "notion", notebooklm: "notebooklm",
};

export function WorkflowChoice({ id, selected, locale }: { id: string; selected: boolean; locale: Locale }) {
  return <input className="workflow-choice sr-only" type="radio" name="knowledge-workflow"
    id={`workflow-choice-${id}`} aria-controls="workflow-comparison-panel" defaultChecked={selected}
    onChange={(event) => {
      if (event.currentTarget.checked && Object.hasOwn(details, id)) {
        trackAnalyticsEvent({ eventName: "comparison_select", placement: "home-comparison", locale, context: "comparisons", detail: details[id] });
      }
    }} />;
}
