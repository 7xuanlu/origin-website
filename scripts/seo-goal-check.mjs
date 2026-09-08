#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateActiveControl, ACTIVE_VIEW_PATH } from "./seo-goal-control.mjs";

import {
  renderScenarioBacklog,
  validateScenarioBacklog,
} from "./seo-scenario-check.mjs";

const repoRoot = resolve(import.meta.dirname, "..");
const FROZEN_START = "<!-- FROZEN-GOAL-CONTRACT:START -->";
const FROZEN_END = "<!-- FROZEN-GOAL-CONTRACT:END -->";
const AUTHORITY_FIRST_START = "<!-- AUTHORITY-FIRST-CORRECTION:START -->";
const AUTHORITY_FIRST_END = "<!-- AUTHORITY-FIRST-CORRECTION:END -->";
const SUCCESSOR_START = "<!-- SUCCESSOR-GOAL-CONTRACT:START -->";
const SUCCESSOR_END = "<!-- SUCCESSOR-GOAL-CONTRACT:END -->";
const SUCCESSOR_WAITING_START = "<!-- SUCCESSOR-WAITING-WORK:START -->";
const SUCCESSOR_WAITING_END = "<!-- SUCCESSOR-WAITING-WORK:END -->";
const CONTENT_EXPANSION_START = "<!-- CONTENT-EXPANSION-CORRECTION:START -->";
const CONTENT_EXPANSION_END = "<!-- CONTENT-EXPANSION-CORRECTION:END -->";
const EXPECTED_FROZEN_SHA256 =
  "9e027e774ef2eb62bd5e1da1c8cc22688387e80fd86647a8154e9111a4e86c95";
const EXPECTED_SUCCESSOR_SHA256 =
  "e5942b1f5a535103f01caa8c3388061057e567ea1fb8f2d824ae013ed494f0b4";
const EXPECTED_SUCCESSOR_WAITING_SHA256 =
  "a64c56a6d8d64ff3ceb4dc86ee24e7532619671d6eb007df0b9d7c108f38ba8d";
const EXPECTED_EXPERIMENTS_APPEND_ONLY_BASELINE_SHA256 =
  "637df82ff50bf214692d6bc9b3b391b625263148dd173f543a5579b68b252403";
const EXPERIMENTS_APPEND_ONLY_BASELINE_MARKER =
  `<!-- EXPERIMENTS-APPEND-ONLY-BASELINE-SHA256:${EXPECTED_EXPERIMENTS_APPEND_ONLY_BASELINE_SHA256} -->`;
const DAY_MS = 24 * 60 * 60 * 1000;
const CAMPAIGN_WINDOW_ANCHOR = new Date("2026-07-18T00:00:00.000Z");
const HISTORICAL_CAMPAIGN_DEADLINE = new Date("2026-08-18T00:00:00.000Z");
const SUCCESSOR_CAMPAIGN_DEADLINE = new Date("2026-09-21T00:00:00.000Z");

const requiredAgentsSeoIndexClauses = [
  "## SEO Campaign Control Plane",
  "Tier 0 — entrypoint",
  "Tier 1 — contract",
  "Tier 2 — structured state",
  "Tier 3 — evidence",
  "Before every SEO campaign action",
  "`pnpm seo:goal:control`",
  "`docs/seo-active-control.md`",
  "--known-fingerprint <sha256>",
  "three consecutive Goal turns",
  "`pnpm seo:goal:check`",
  "`EXPERIMENTS.md` is the append-only experiment and readout ledger",
  "`docs/seo-scenario-backlog.json` is the only editable scenario source",
  "`docs/seo-scenario-backlog.md` is generated",
  "`pnpm seo:scenario:check`",
  "`pnpm seo:scenario:update`",
  "`scripts/seo-intent-map.mjs`",
  "`pnpm seo:intent:check`",
  "Reuse the latest successfully completed weekly SEO report",
  "Product evidence quality floor",
  "`docs/seo-product-evidence-standard.md`",
];

const requiredProductEvidenceStandardClauses = [
  "# SEO Product Evidence Standard",
  "Demand decision before implementation",
  "Who is searching, and what triggers the search?",
  "What result must the reader leave with?",
  "Why would this answer be chosen over the current alternatives?",
  "Where will the first relevant readers come from?",
  "Why this action before the competing actions?",
  "What observation would change or stop this decision?",
  "one canonical URL",
  "real, current, sanitized product view",
  "A visible input to decision to output sequence",
  "Natural English, zh-TW, and zh-CN localization",
  "Do not use simulated div-based product chrome as proof",
  "at exactly 393px",
  "The product-research-to-PRD family is the reference implementation",
];

export function validateAgentsSeoIndex(agents) {
  const errors = [];
  const normalizedAgents = agents.replace(/\s+/g, " ");
  for (const clause of requiredAgentsSeoIndexClauses) {
    if (!normalizedAgents.includes(clause)) {
      errors.push(`AGENTS.md SEO campaign index is missing: ${clause}`);
    }
  }
  return errors;
}

export function validateProductEvidenceStandard(standard) {
  const errors = [];
  const normalizedStandard = standard.replace(/\s+/g, " ");
  for (const clause of requiredProductEvidenceStandardClauses) {
    if (!normalizedStandard.includes(clause)) {
      errors.push(`Product evidence standard is missing: ${clause}`);
    }
  }
  return errors;
}

const requiredFrozenClauses = [
  ["deadline 2026-08-18", "Deadline: 2026-08-18."],
  ["GitHub total stars >= 100", "GitHub total stars >= 100 at the deadline."],
  [
    "GSC property clicks >= 100",
    "GSC `sc-domain:wenlan.app` rolling-28-day property clicks >= 100.",
  ],
  [
    "GSC property impressions >= 10,000",
    "GSC `sc-domain:wenlan.app` rolling-28-day property impressions >= 10,000.",
  ],
  [
    "Vercel visitors >= 2,000",
    "Vercel Web Analytics rolling-28-day visitors >= 2,000 over the same range.",
  ],
  ["fixed GitHub baseline 47", "Fixed progress baseline: GitHub total stars 47."],
  ["fixed GSC click baseline 6", "Fixed progress baseline: GSC property clicks 6."],
  [
    "fixed GSC baseline 197",
    "Fixed progress baseline: GSC property impressions 197.",
  ],
  [
    "fixed Vercel baseline 323",
    "Fixed progress baseline: Vercel visitors 323.",
  ],
  [
    "fixed final window",
    "The final search and traffic window is the 28 complete days ending 2026-08-17.",
  ],
  [
    "GSC delay cannot move the final window",
    "If GSC reporting is delayed, delay the final read; do not move the window.",
  ],
  [
    "baseline provenance",
    "Verify the fixed progress baselines against the real source on the day the control plane starts and record provenance.",
  ],
  [
    "metric definitions are frozen",
    "Target values, deadline, metric definitions, and the final window must not be changed by the Goal controller.",
  ],
  [
    "Wenlan canonical destination",
    "Wenlan and `https://wenlan.app` are the destination product and canonical public site.",
  ],
  [
    "legacy bridge-host boundary",
    "`https://useorigin.app` and `https://www.useorigin.app` are redirect bridges into Wenlan, not destination brands.",
  ],
  [
    "pre-action PLAN read and verifier",
    "Before every campaign action, run `pnpm seo:goal:control` and follow the verified active-view reading rules.",
  ],
  [
    "verifier failure stop",
    "If the verifier fails, stop; do not continue from a summary or chat memory.",
  ],
  [
    "contract review before website experiment",
    "The Goal contract must be approved before such an experiment begins.",
  ],
  [
    "GSC property/query/gap quality split",
    "Every weekly report must show GSC property totals, visible-query totals, and the query visibility gap separately.",
  ],
  [
    "visible-query non-brand quality split",
    "Track visible-query non-brand impressions, valid problem clusters, and non-brand pages with impressions separately",
  ],
  [
    "Vercel traffic quality split",
    "Report Vercel raw visitors, direct traffic, qualified-source visitors, and acquisition-surface visitors separately.",
  ],
  [
    "no invented source-to-page sessions",
    "If a source-to-page join is not available, do not invent source-to-page sessions.",
  ],
  [
    "no composite score or causality",
    "Do not create a composite score and do not claim causality among them.",
  ],
  [
    "fixed CTA definition",
    "CTA is fixed as `github_outbound / eligible acquisition-surface sessions`.",
  ],
  [
    "CTA remains diagnostic without Umami",
    "Until a reliable Umami baseline exists, CTA is diagnostic only and has no invented 4% threshold.",
  ],
  [
    "setup starts lagging and non-gating",
    "Setup starts are a lagging metric: report them when reliable, but they do not gate completion of this Goal.",
  ],
  [
    "technical SEO regression floor",
    "Sitemap, canonical, robots, redirects, noindex and X-Robots headers, structured data, key direct-200 URLs, and indexing must not gain a new technical regression.",
  ],
  [
    "English and Mandarin locale checks",
    "Inspect English, zh-TW, and zh-CN acquisition surfaces separately.",
  ],
  [
    "prohibited content shortcuts",
    "Do not use a fixed article quota, programmatic SEO, source-free comparisons, invented keyword volume, or `FAQPage` JSON-LD for an ordinary software site.",
  ],
  [
    "GSC evidence authority",
    "GSC is the only authority for Google Search performance and indexing.",
  ],
  [
    "Vercel Umami GitHub evidence roles",
    "Vercel is the primary source for visitors and referrers. Umami may enrich UTM, outbound, and CTA evidence when available. GitHub public or REST data is the authority for stars.",
  ],
  [
    "Google Trends Reddit and OSS demand lane",
    "Google Trends, Reddit, GitHub issues and discussions, OSS documentation and directories, and SERP observations are demand-discovery inputs only.",
  ],
  [
    "demand lane cannot impersonate GSC",
    "They may nominate experiments, but they must never enter authenticated GSC input, impersonate GSC evidence, or be described as keyword volume.",
  ],
  [
    "Google Trends provenance",
    "Google Trends must preserve query, geography, period, captured-at, and the raw 0-100 index.",
  ],
  [
    "native source units",
    "Every source keeps its native unit. Do not convert or normalize numbers across GSC, Trends, Reddit, GitHub, Vercel, Umami, or other sources.",
  ],
  [
    "demand inputs stay physically separate",
    "`/tmp/wenlan-seo-demand`, physically separate from authenticated GSC inputs under `/tmp/wenlan-seo`.",
  ],
  [
    "co-primary trilingual AI knowledge-base and Karpathy or LLM-wiki acquisition center",
    "The acquisition center for new experiments is one co-primary, non-ranked cluster: AI knowledge bases, Karpathy or LLM wiki, source-backed wiki, and knowledge bases for AI agents across English, zh-TW, and zh-CN.",
  ],
  [
    "Codex ChatGPT and tool-workflow acquisition entries",
    "Codex, ChatGPT, Claude Code, Obsidian, and MCP are first-class tool or workflow entry points into that same cluster when the candidate gate passes.",
  ],
  [
    "Karpathy and AI knowledge-base parity",
    "Do not rank Karpathy or LLM-wiki demand below AI-knowledge-base demand by default; select the page or refresh from evidence and coverage gaps.",
  ],
  [
    "generic memory cannot nominate acquisition",
    "Generic memory demand does not nominate a new acquisition experiment.",
  ],
  [
    "memory cohorts remain measurement only",
    "Existing memory pages and cohorts remain measurable evidence and may be maintained for factual or technical correctness, but they do not control the next content decision.",
  ],
  [
    "memory route names cannot override acquisition focus",
    "Historical route slugs or article titles containing `memory` do not change this priority.",
  ],
  [
    "candidate provenance gate",
    "The source is inspectable, and its URL or query, capture date, language or geography, and native unit have provenance.",
  ],
  [
    "candidate corroboration gate",
    "The problem repeats, has independent corroboration, or has clear high intent.",
  ],
  [
    "candidate coverage gate",
    "Existing Wenlan coverage has a clean gap. If a page partly covers the intent, refresh the existing page before creating a new URL.",
  ],
  [
    "candidate proof gate",
    "Wenlan can prove the answer with a real command, workflow, test, release, or maintained first-party source.",
  ],
  [
    "candidate standalone utility gate",
    "The asset has standalone utility even without promoting Wenlan.",
  ],
  [
    "experiment priority order",
    "`technical blockers -> indexed page with impressions -> integration/workflow hub -> diagnostic/recipe -> net-new article`.",
  ],
  [
    "weekly windows do not block approved launches",
    "Weekly data windows are reporting boundaries, not launch blockers.",
  ],
  [
    "single production-in-flight guard",
    "Production concurrency is capped at one website change in `approved` or `active` preparation/verification state.",
  ],
  [
    "measurement cohorts do not block production",
    "`live`, `measuring`, and `extended` measurement cohorts do not consume the production slot and do not block another evidence-backed website change.",
  ],
  [
    "no fixed calendar article quota",
    "Do not impose a fixed calendar article quota.",
  ],
  [
    "net-new candidate and overlap gate",
    "A net-new search asset may launch after the full candidate gate passes, the preceding website change is production-verified, and the new asset does not overlap an existing intent.",
  ],
  [
    "predeclared exposure and readouts",
    "Every experiment predeclares its hypothesis, baseline, positive minimum exposure threshold and unit, success, failure, and stop criteria, and its 24h, 7d, W2, W4, and W8 readouts.",
  ],
  [
    "inconclusive below exposure floor",
    "If minimum exposure is not reached, the result is `inconclusive`; do not force a success or failure verdict.",
  ],
  [
    "month-one existing-page preference",
    "In month one, prefer an existing indexed page plus approved distribution.",
  ],
  [
    "wait without new evidence",
    "When there is no new evidence, wait. Do not continuously rewrite the same page.",
  ],
  [
    "weekly automation remains independent",
    "The existing `weekly-origin-seo-cleanup` automation remains independent.",
  ],
  [
    "no duplicate weekly cron",
    "Do not create a duplicate weekly cron or change its schedule or ID without explicit user approval.",
  ],
  [
    "Goal controller role",
    "This Goal is the campaign controller. The existing weekly automation remains the Searchfit, GSC, indexing, and technical-evidence lane.",
  ],
  [
    "weekly attribution conflict approval",
    "present the smallest prompt diff for user approval; do not silently allow both controllers to write.",
  ],
  [
    "same-task follow-up only",
    "If a calendar wake is needed, use a scheduled follow-up in this same main task.",
  ],
  [
    "approval boundary",
    "No deploy, Reddit or external article/message publication, OSS directory submission, paid acquisition, request indexing, GSC validation submission, push, or merge without explicit user approval.",
  ],
  [
    "GA4 outside Goal",
    "GA4 is outside this Goal. Keep the GSC + Vercel + existing Umami + GitHub evidence stack",
  ],
  [
    "stop if deadline unmet",
    "The deadline arrives and one or more fixed targets are unmet.",
  ],
  [
    "stop after two unreliable windows",
    "Two consecutive windows have no reliable data.",
  ],
  [
    "stop without reasonable experiment",
    "No reasonable experiment passes the candidate gate.",
  ],
  [
    "stop when approvals block necessary action",
    "Approval boundaries block a necessary action.",
  ],
  [
    "stop-delivery requirements",
    "deliver attempted paths, evidence by source, success/failure/inconclusive experiments, blockers, and the next decision that requires the user",
  ],
];

const requiredAuthorityFirstClauses = [
  [
    "qualified query ownership and durable external authority objective",
    "The execution objective is authenticated non-brand query ownership and durable external authority",
  ],
  [
    "output counts are not growth outcomes",
    "Article count, indexed-page count, technical checks, indexing requests, and raw Vercel visitors are not growth outcomes.",
  ],
  [
    "technical SEO remains a guardrail",
    "Technical SEO is a regression guardrail.",
  ],
  [
    "existing-page post-deploy crawl gate",
    "only after Google has confirmed a post-deploy crawl of its current version",
  ],
  [
    "existing-page 20-impression floor",
    "the same complete 28-day GSC range contains at least 20 target-page impressions",
  ],
  [
    "existing-page 3-impression joined-query floor",
    "the query-page join contains at least 3 qualified visible impressions for that owner",
  ],
  [
    "net-new authority path gate",
    "one predeclared authority or distribution path.",
  ],
  [
    "same-canonical post-crawl cooldown",
    "do not change the same canonical again until 28 complete days after a confirmed post-deploy crawl.",
  ],
  [
    "two-inconclusive-experiment on-page stop",
    "If two consecutive website experiments remain below their post-crawl exposure floor, stop the on-page lane.",
  ],
  [
    "open submissions do not count as authority",
    "An external submission or open pull request is attempted distribution, not authority.",
  ],
  [
    "Vercel raw visitors are not human acquisition",
    "never present them as human search acquisition without the separate traffic-quality split.",
  ],
  [
    "no on-page action is valid",
    "When neither passes its gate, the correct action is no on-page change.",
  ],
  [
    "pre-final candidate text cannot restart website work",
    "Pre-final candidate and readout text retained below is historical provenance.",
  ],
  [
    "no invented next campaign target",
    "A new numeric deadline or target is not invented by the controller",
  ],
];

const requiredSuccessorClauses = [
  ["successor deadline 2026-09-21", "Deadline: 2026-09-21."],
  ["successor stars target 100", "GitHub total stars >= 100 at the deadline."],
  [
    "successor GSC clicks target 100",
    "GSC `sc-domain:wenlan.app` rolling-28-day property clicks >= 100.",
  ],
  [
    "successor GSC impressions target 10,000",
    "GSC `sc-domain:wenlan.app` rolling-28-day property impressions >= 10,000.",
  ],
  [
    "successor Vercel target 2,000",
    "Vercel Web Analytics rolling-28-day visitors >= 2,000 over the same range.",
  ],
  ["successor fixed final range", "`2026-08-24..2026-09-20`"],
  ["successor GSC delay guard", "delay the final read; do not move this window."],
  ["successor stars baseline 48", "Fixed successor starting observation: GitHub total stars 48."],
  [
    "successor GSC baseline 8 and 985",
    "Fixed successor starting observation: GSC property clicks 8 and property impressions 985",
  ],
  ["successor Vercel baseline 248", "Fixed successor starting observation: Vercel visitors 248"],
  ["successor visible query split", "2 visible-query clicks and 212 visible-query impressions"],
  ["successor immutable definitions", "Target values, deadline, metric definitions, starting observations, and the final window must not be changed by the Goal controller."],
  ["successor inherited full contract", "The complete quality conditions, evidence roles, demand-discovery rules, candidate gate, experiment rules, weekly-SEO-controller relationship, and approval boundaries"],
  ["successor authority outcome", "Progress means qualified non-brand query ownership or an inspectable live or merged authority source."],
  ["successor existing-page evidence gate", "without a confirmed post-deploy Google crawl, at least 20 target-page impressions, and at least 3 joined qualified visible impressions"],
  ["successor cooldown and stop", "Keep the 28-complete-day post-crawl canonical cooldown and stop the on-page lane after two consecutive below-exposure website experiments."],
  ["successor net-new gate", "A net-new or translated search asset requires the complete candidate gate"],
  ["successor Awesome Selfhosted approval", "The user approved the exact one-file Awesome Selfhosted authority submission"],
  ["successor upstream green gate", "Publish it only when current upstream plus the exact candidate pass the upstream pull-request gate."],
  ["successor other actions excluded", "No other external publication, website deployment, request indexing, GSC validation, paid acquisition, synthetic analytics event, or metric change is approved"],
  ["successor weekly relationship", "The existing `weekly-origin-seo-cleanup` automation remains independent."],
  ["successor deadline stop", "The 2026-09-21 deadline arrives and one or more successor targets are unmet."],
  ["successor unreliable-data stop", "Two consecutive complete windows have no reliable authenticated data."],
  ["successor no-path stop", "No reasonable authority path or experiment passes its protected gate."],
  ["successor approval stop", "An approval boundary blocks a necessary action."],
];

const requiredSuccessorWaitingClauses = [
  ["waiting approval timestamp", "2026-08-22T20:55:14Z"],
  ["trilingual demand reconnaissance", "Run trilingual demand reconnaissance across English, zh-TW, and zh-CN"],
  ["co-primary demand families", "AI knowledge base, Karpathy or LLM Wiki, source-backed wiki, Codex or ChatGPT knowledge-base workflows"],
  ["demand provenance", "Preserve source URL or query, capture date, language or geography, and each source's native unit."],
  ["demand does not impersonate GSC", "physically and semantically separate from GSC"],
  ["GitHub conversion audit", "Audit the public GitHub conversion path from a first-time visitor to a star"],
  ["GitHub audit scope", "README first screen, concrete product proof, install and download entry points, current release assets, and localized README consistency."],
  ["authority PR maintenance", "awesome-selfhosted/awesome-selfhosted-data#2955"],
  ["second authority PR maintenance", "DhanushNehru/awesome-mcp-servers#52"],
  ["one additional authority candidate cap", "Research at most one additional non-duplicate, active, exact-fit high-authority path"],
  ["Aug 28 decision matrix", "Prepare the `2026-08-28` decision matrix"],
  ["protected page gate", "post-crawl gate: at least 20 target-page impressions and 3 joined qualified visible-query impressions"],
  ["waiting work no production slot", "These lanes are not website experiments and do not consume the production slot."],
  ["waiting work approval exclusions", "No deployment, external publication, new directory submission, maintainer message, request indexing, GSC validation, paid acquisition, synthetic event, analytics mutation, or metric-definition change is authorized here."],
];

const requiredContentExpansionClauses = [
  [
    "technical and owner counts are not content sufficiency",
    "Technical green, indexed-page count, sitemap size, and intent-owner count are quality floors. They do not prove that search scenarios are sufficiently covered and do not mean growth is complete.",
  ],
  [
    "weekly trilingual scenario family",
    "Every week must select one trilingual scenario family",
  ],
  [
    "natural locale search language",
    "represent the same user task in natural local search language; they are not keyword-by-keyword translations.",
  ],
  [
    "scenario audience trigger task outcome model",
    "Each scenario family must explicitly preserve its audience, trigger, user task, and desired outcome.",
  ],
  [
    "audience alone cannot split URL ownership",
    "A user group alone does not justify a separate URL; split only when the search task and observed SERP are materially different.",
  ],
  [
    "failed candidate reasons and next research",
    "record every failed candidate and its failed gate plus the next research direction.",
  ],
  ["bare wait prohibited", "A bare `wait` is not a valid weekly content decision"],
  [
    "existing-page gate scope",
    "apply only when rewriting an existing owner.",
  ],
  [
    "existing-page gate cannot block clean new intent",
    "must not block a clean net-new intent backed by external demand evidence",
  ],
  [
    "measuring page does not block next family",
    "A measuring page does not block preparation of the next non-overlapping trilingual scenario family.",
  ],
  [
    "scenario JSON source of truth",
    "`docs/seo-scenario-backlog.json` is the only editable scenario source.",
  ],
  [
    "scenario generated report",
    "`docs/seo-scenario-backlog.md` is deterministic generated output.",
  ],
  [
    "scenario verifier command",
    "synchronized through `pnpm seo:scenario:check`",
  ],
  [
    "goal verifier fails closed",
    "`pnpm seo:goal:check` must fail closed when this correction, the scenario files, or the four-week cadence is missing.",
  ],
  [
    "external demand lane remains separate",
    "It does not enter authenticated GSC input and is not keyword volume.",
  ],
  [
    "four weekly scenario windows",
    "`2026-08-24..2026-08-30`, `2026-08-31..2026-09-06`, `2026-09-07..2026-09-13`, and `2026-09-14..2026-09-20`.",
  ],
  [
    "publication approvals remain separate",
    "Local implementation and verification do not grant commit, push, PR, merge, Vercel deployment, request indexing, GSC validation, or external-publication approval.",
  ],
];

const allowedStatuses = new Set([
  "approved",
  "active",
  "live",
  "measuring",
  "extended",
  "decided",
  "inconclusive",
  "stopped",
]);
const activeStatuses = new Set(["approved", "active", "live", "measuring", "extended"]);
const productionInFlightStatuses = new Set(["approved", "active"]);
const allowedReadoutStatuses = new Set([
  "active",
  "live",
  "measuring",
  "extended",
  "decided",
  "inconclusive",
  "stopped",
]);
const allowedAssetClasses = new Set([
  "refresh",
  "integration-hub",
  "diagnostic-recipe",
  "net-new-search",
]);
const requiredExperimentFields = [
  "Record type",
  "Experiment ID",
  "Status",
  "Data window",
  "Asset class",
  "Launched",
  "Hypothesis",
  "Candidate evidence",
  "Baseline",
  "Change",
  "Publish date",
  "Index date",
  "Minimum exposure",
  "Success criteria",
  "Failure criteria",
  "Stop criteria",
  "24h readout",
  "7d readout",
  "W2 readout",
  "W4 readout",
  "W8 readout",
  "Result",
  "Decision",
  "Next step",
];
const requiredReadoutFields = [
  "Record type",
  "Experiment ID",
  "Observed at",
  "Readout",
  "Status",
  "Evidence",
  "Result",
  "Decision",
  "Next step",
];
const allowedReadouts = new Set(["24h", "7d", "W2", "W4", "W8", "correction"]);
const allowedResults = new Set(["pending", "success", "failure", "inconclusive"]);
const allowedDecisions = new Set([
  "wait",
  "scale",
  "refresh",
  "merge",
  "stop",
  "localize",
  "extend",
]);
const EXPERIMENT_DATE_SCHEMA_MARKER = "<!-- EXPERIMENT-DATE-SCHEMA-V1 -->";
const SUCCESSOR_EXPERIMENT_SCHEMA_MARKER =
  "<!-- SUCCESSOR-EXPERIMENT-SCHEMA-V1 -->";
const FIRST_DATE_SCHEMA_EXPERIMENT_ID =
  "EXP-2026-07-29-docs-github-acquisition";

function normalizeWhitespace(value) {
  return value.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

function frozenContract(plan, errors) {
  const start = plan.indexOf(FROZEN_START);
  const end = plan.indexOf(FROZEN_END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push("PLAN.md must contain one ordered frozen Goal contract marker pair.");
    return null;
  }
  if (
    plan.indexOf(FROZEN_START, start + FROZEN_START.length) !== -1 ||
    plan.indexOf(FROZEN_END, end + FROZEN_END.length) !== -1
  ) {
    errors.push("PLAN.md must contain exactly one frozen Goal contract marker pair.");
    return null;
  }

  return plan.slice(start + FROZEN_START.length, end).replace(/\r\n/g, "\n").trim();
}

function authorityFirstCorrection(plan, errors) {
  const start = plan.indexOf(AUTHORITY_FIRST_START);
  const end = plan.indexOf(AUTHORITY_FIRST_END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push(
      "PLAN.md must contain one ordered authority-first correction marker pair.",
    );
    return null;
  }
  if (
    plan.indexOf(AUTHORITY_FIRST_START, start + AUTHORITY_FIRST_START.length) !== -1 ||
    plan.indexOf(AUTHORITY_FIRST_END, end + AUTHORITY_FIRST_END.length) !== -1
  ) {
    errors.push(
      "PLAN.md must contain exactly one authority-first correction marker pair.",
    );
    return null;
  }

  return plan
    .slice(start + AUTHORITY_FIRST_START.length, end)
    .replace(/\r\n/g, "\n")
    .trim();
}

function successorGoalContract(plan, errors) {
  const start = plan.indexOf(SUCCESSOR_START);
  const end = plan.indexOf(SUCCESSOR_END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push("PLAN.md must contain one ordered successor Goal contract marker pair.");
    return null;
  }
  if (
    plan.indexOf(SUCCESSOR_START, start + SUCCESSOR_START.length) !== -1 ||
    plan.indexOf(SUCCESSOR_END, end + SUCCESSOR_END.length) !== -1
  ) {
    errors.push("PLAN.md must contain exactly one successor Goal contract marker pair.");
    return null;
  }

  return plan
    .slice(start + SUCCESSOR_START.length, end)
    .replace(/\r\n/g, "\n")
    .trim();
}

function successorWaitingWork(plan, errors) {
  const start = plan.indexOf(SUCCESSOR_WAITING_START);
  const end = plan.indexOf(SUCCESSOR_WAITING_END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push("PLAN.md must contain one ordered successor waiting-work marker pair.");
    return null;
  }
  if (
    plan.indexOf(SUCCESSOR_WAITING_START, start + SUCCESSOR_WAITING_START.length) !== -1 ||
    plan.indexOf(SUCCESSOR_WAITING_END, end + SUCCESSOR_WAITING_END.length) !== -1
  ) {
    errors.push("PLAN.md must contain exactly one successor waiting-work marker pair.");
    return null;
  }
  return plan
    .slice(start + SUCCESSOR_WAITING_START.length, end)
    .replace(/\r\n/g, "\n")
    .trim();
}

function contentExpansionCorrection(plan, errors) {
  const start = plan.indexOf(CONTENT_EXPANSION_START);
  const end = plan.indexOf(CONTENT_EXPANSION_END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push(
      "PLAN.md must contain one ordered content-expansion correction marker pair.",
    );
    return null;
  }
  if (
    plan.indexOf(CONTENT_EXPANSION_START, start + CONTENT_EXPANSION_START.length) !==
      -1 ||
    plan.indexOf(CONTENT_EXPANSION_END, end + CONTENT_EXPANSION_END.length) !== -1
  ) {
    errors.push(
      "PLAN.md must contain exactly one content-expansion correction marker pair.",
    );
    return null;
  }
  return plan
    .slice(start + CONTENT_EXPANSION_START.length, end)
    .replace(/\r\n/g, "\n")
    .trim();
}

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }
  return date;
}

function parseIsoUtcTimestamp(value) {
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value ?? "")
  ) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  const canonical = value.includes(".")
    ? date.toISOString()
    : date.toISOString().replace(".000Z", "Z");
  return canonical === value ? date : null;
}

function parseExperimentFields(block) {
  const fields = new Map();
  const duplicates = [];
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^- ([^:]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (fields.has(key)) duplicates.push(key);
    fields.set(key, value.trim());
  }
  return { fields, duplicates };
}

function markdownSection(document, heading) {
  const marker = `\n### ${heading}\n`;
  const start = document.indexOf(marker);
  if (start === -1) return null;
  const contentStart = start + marker.length;
  const nextHeading = document.indexOf("\n### ", contentStart);
  return document.slice(
    contentStart,
    nextHeading === -1 ? document.length : nextHeading,
  );
}

function inspectAcquisitionFocus(plan, errors) {
  const strategy = markdownSection(plan, "Current strategy");
  const nextDecision = markdownSection(plan, "Next decision");

  if (!strategy) {
    errors.push('PLAN.md must retain one "### Current strategy" section.');
    return;
  }
  if (!nextDecision) {
    errors.push('PLAN.md must retain one "### Next decision" section.');
    return;
  }

  const normalizedStrategy = normalizeWhitespace(strategy);
  const normalizedNextDecision = normalizeWhitespace(nextDecision);
  const priorityFamilies = [
    "AI knowledge base",
    "Karpathy LLM wiki",
    "LLM wiki",
    "source-backed wiki",
    "knowledge base for AI agents",
    "Codex",
    "ChatGPT",
    "Claude Code",
    "Obsidian",
    "MCP",
  ];

  if (
    !normalizedStrategy.includes(
      "The next candidate must be selected from fresh evidence for",
    ) ||
    !normalizedStrategy.includes("one co-primary, non-ranked cluster") ||
    priorityFamilies.some((family) => !normalizedStrategy.includes(family))
  ) {
    errors.push(
      "PLAN.md Current strategy must retain the co-primary trilingual AI knowledge-base, Karpathy or LLM-wiki, and tool-workflow demand families.",
    );
  }
  if (
    !normalizedStrategy.includes(
      "generic memory demand no longer nominates the next acquisition asset.",
    )
  ) {
    errors.push(
      "PLAN.md Current strategy must retain that generic memory cannot nominate the next acquisition asset.",
    );
  }
  if (
    !normalizedNextDecision.includes(
      "Memory is supporting infrastructure, not the acquisition center.",
    )
  ) {
    errors.push(
      "PLAN.md Next decision must keep memory as supporting infrastructure rather than the acquisition center.",
    );
  }
}

function inspectMutableCampaignState(plan, errors) {
  const mutableHeading = "\n## Mutable Campaign State\n";
  const mutableIndex = plan.indexOf(mutableHeading);
  if (mutableIndex === -1) {
    errors.push('PLAN.md must retain one "## Mutable Campaign State" section.');
    return { active: null, currentId: null, approvalTimestamp: null };
  }
  if (plan.indexOf(mutableHeading, mutableIndex + mutableHeading.length) !== -1) {
    errors.push('PLAN.md must contain exactly one "## Mutable Campaign State" section.');
  }

  const mutable = plan.slice(mutableIndex + mutableHeading.length);
  const activeMatches = [
    ...mutable.matchAll(/^- Active experiments:\s*(\d+)\.\s*$/gm),
  ];
  if (activeMatches.length !== 1) {
    errors.push("PLAN.md must state exactly one numeric Active experiments count.");
  }
  const active = activeMatches.length === 1 ? Number(activeMatches[0][1]) : null;

  const currentHeading = "\n### Current experiment\n";
  const currentIndex = mutable.indexOf(currentHeading);
  let currentId = null;
  if (currentIndex === -1) {
    errors.push('PLAN.md must retain one "### Current experiment" section.');
  } else {
    const currentStart = currentIndex + currentHeading.length;
    const nextHeading = mutable.indexOf("\n### ", currentStart);
    const current = mutable.slice(
      currentStart,
      nextHeading === -1 ? mutable.length : nextHeading,
    );
    const currentIds = [...current.matchAll(/`(EXP-[A-Za-z0-9][A-Za-z0-9-]*)`/g)].map(
      (match) => match[1],
    );
    if (currentIds.length > 1) {
      errors.push("PLAN.md Current experiment section must identify at most one experiment.");
    }
    currentId = currentIds[0] ?? null;
  }

  const websiteExperimentMatch = mutable.match(
    /^- Website-affecting experiment:\s*\n\s*`(EXP-[A-Za-z0-9][A-Za-z0-9-]*)`/m,
  );
  const websiteExperimentId = websiteExperimentMatch?.[1] ?? null;
  if (currentId && websiteExperimentId !== currentId) {
    errors.push(
      `PLAN.md Website-affecting experiment must match Current experiment "${currentId}".`,
    );
  }

  const approvalClaimed = /^- Contract approval:\s*approved\b/m.test(mutable);
  const approvalMatch = mutable.match(
    /^- Contract approval:\s*approved by the user in this Codex task on\s*\n\s*`(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)`\.\s*$/m,
  );
  if (approvalClaimed && !approvalMatch) {
    errors.push(
      "PLAN.md approved Contract approval must retain its ISO-8601 UTC approval timestamp.",
    );
  }

  return {
    active,
    currentId,
    approvalTimestamp: approvalMatch?.[1] ?? null,
  };
}

function campaignRecords(ledger) {
  const boundaries = [
    ...ledger.matchAll(/^(?:### |<!-- EXPERIMENT-RECORD:START -->)/gm),
  ];
  const records = [];
  boundaries.forEach((boundary, index) => {
    if (!boundary[0].startsWith("### ")) return;
    const end = boundaries[index + 1]?.index ?? ledger.length;
    const block = ledger.slice(boundary.index, end);
    const heading = block.slice(4, block.indexOf("\n"));
    records.push({ heading, fields: parseExperimentFields(block).fields });
  });
  return records;
}

export function validateExperimentsAppendOnlyBaseline(experiments) {
  const errors = [];
  const markerIndex = experiments.indexOf(EXPERIMENTS_APPEND_ONLY_BASELINE_MARKER);
  if (markerIndex === -1) {
    errors.push(
      "EXPERIMENTS.md must retain its immutable append-only baseline marker.",
    );
    return errors;
  }
  if (
    experiments.indexOf(
      EXPERIMENTS_APPEND_ONLY_BASELINE_MARKER,
      markerIndex + EXPERIMENTS_APPEND_ONLY_BASELINE_MARKER.length,
    ) !== -1
  ) {
    errors.push(
      "EXPERIMENTS.md must contain exactly one immutable append-only baseline marker.",
    );
  }

  const protectedPrefix = experiments.slice(0, markerIndex);
  const digest = createHash("sha256").update(protectedPrefix).digest("hex");
  if (digest !== EXPECTED_EXPERIMENTS_APPEND_ONLY_BASELINE_SHA256) {
    errors.push(
      `EXPERIMENTS.md append-only baseline changed: expected ${EXPECTED_EXPERIMENTS_APPEND_ONLY_BASELINE_SHA256}, received ${digest}. Restore the protected history and append a correction instead.`,
    );
  }
  return errors;
}

function inspectExperimentLedger(experiments, errors) {
  const ledgerHeading = "\n## Ledger\n";
  const ledgerIndex = experiments.indexOf(ledgerHeading);
  if (ledgerIndex === -1) {
    errors.push('EXPERIMENTS.md must retain one "## Ledger" section.');
    return {
      starts: 0,
      active: 0,
      startedIds: new Set(),
      activeIds: new Set(),
      productionInFlightIds: [],
      campaignRecords: [],
    };
  }
  if (experiments.indexOf(ledgerHeading, ledgerIndex + ledgerHeading.length) !== -1) {
    errors.push('EXPERIMENTS.md must contain exactly one "## Ledger" section.');
  }
  const beforeLedger = experiments
    .slice(0, ledgerIndex)
    .replace(/```[\s\S]*?```/g, "");
  if (
    /<!-- EXPERIMENT-RECORD:(?:START|END) -->|^## Experiment (?:start|readout):|^- Record type: experiment-(?:start|readout)\s*$|^- Experiment ID: EXP-/m.test(
      beforeLedger,
    )
  ) {
    errors.push("EXPERIMENTS.md contains experiment records before the Ledger section.");
  }
  const ledger = experiments.slice(ledgerIndex + ledgerHeading.length);
  const startMarkerCount =
    ledger.match(/<!-- EXPERIMENT-RECORD:START -->/g)?.length ?? 0;
  const endMarkerCount =
    ledger.match(/<!-- EXPERIMENT-RECORD:END -->/g)?.length ?? 0;
  if (startMarkerCount !== endMarkerCount) {
    errors.push(
      `EXPERIMENTS.md requires paired experiment record markers; found ${startMarkerCount} starts and ${endMarkerCount} ends.`,
    );
  }
  const ledgerOutsideRecords = ledger.replace(
    /<!-- EXPERIMENT-RECORD:START -->[\s\S]*?<!-- EXPERIMENT-RECORD:END -->/g,
    "",
  );
  if (
    /^## Experiment (?:start|readout):|^- Record type: experiment-(?:start|readout)\s*$|^- Experiment ID: EXP-/m.test(
      ledgerOutsideRecords,
    )
  ) {
    errors.push(
      "EXPERIMENTS.md contains experiment fields outside paired record markers.",
    );
  }
  const dateSchemaMarkers = [...ledger.matchAll(/<!-- EXPERIMENT-DATE-SCHEMA-V1 -->/g)];
  if (dateSchemaMarkers.length !== 1) {
    errors.push(
      "EXPERIMENTS.md must contain exactly one experiment date-schema cutover marker.",
    );
  }
  const dateSchemaMarkerIndex = dateSchemaMarkers[0]?.index ?? Number.POSITIVE_INFINITY;
  const expectedDateSchemaBoundary =
    `${EXPERIMENT_DATE_SCHEMA_MARKER}\n` +
    "<!-- EXPERIMENT-RECORD:START -->\n" +
    `## Experiment start: ${FIRST_DATE_SCHEMA_EXPERIMENT_ID}`;
  if (
    Number.isFinite(dateSchemaMarkerIndex) &&
    !ledger.slice(dateSchemaMarkerIndex).startsWith(expectedDateSchemaBoundary)
  ) {
    errors.push(
      `The experiment date-schema cutover marker must remain outside records and immediately precede ${FIRST_DATE_SCHEMA_EXPERIMENT_ID}.`,
    );
  }
  const successorSchemaMarkers = [
    ...ledger.matchAll(/<!-- SUCCESSOR-EXPERIMENT-SCHEMA-V1 -->/g),
  ];
  if (successorSchemaMarkers.length !== 1) {
    errors.push(
      "EXPERIMENTS.md must contain exactly one successor experiment-schema cutover marker.",
    );
  }
  const successorSchemaMarkerIndex =
    successorSchemaMarkers[0]?.index ?? Number.POSITIVE_INFINITY;
  if (
    Number.isFinite(successorSchemaMarkerIndex) &&
    successorSchemaMarkerIndex <= dateSchemaMarkerIndex
  ) {
    errors.push(
      "The successor experiment-schema cutover must follow the historical date-schema cutover.",
    );
  }
  const blocks = [
    ...ledger.matchAll(
      /<!-- EXPERIMENT-RECORD:START -->([\s\S]*?)<!-- EXPERIMENT-RECORD:END -->/g,
    ),
  ].map((match) => ({ body: match[1], index: match.index ?? -1 }));
  if (
    blocks.some(({ body }) => body.includes(SUCCESSOR_EXPERIMENT_SCHEMA_MARKER))
  ) {
    errors.push(
      "The successor experiment-schema cutover marker must remain outside experiment records.",
    );
  }
  const startedIds = new Set();
  const latestStatuses = new Map();
  const launchDatesById = new Map();
  const lastReadoutAtById = new Map();
  let productionOverlapReported = false;

  function recordLatestStatus(id, status, recordLabel) {
    latestStatuses.set(id, status);
    const productionInFlight = [...latestStatuses]
      .filter(([, latestStatus]) => productionInFlightStatuses.has(latestStatus))
      .map(([experimentId]) => experimentId);
    if (productionInFlight.length > 1 && !productionOverlapReported) {
      errors.push(
        `${recordLabel} violates the at most one production-in-flight change guard; found ${productionInFlight.join(", ")}.`,
      );
      productionOverlapReported = true;
    }
  }

  blocks.forEach(({ body: block, index: blockIndex }, index) => {
    const recordLabel = `experiment record ${index + 1}`;
    const { fields, duplicates } = parseExperimentFields(block);
    for (const duplicate of duplicates) {
      errors.push(`${recordLabel} repeats field "${duplicate}".`);
    }
    const recordType = fields.get("Record type");
    const id = fields.get("Experiment ID");
    if (id) {
      if (!/^EXP-[A-Za-z0-9][A-Za-z0-9-]*$/.test(id)) {
        errors.push(`${recordLabel} has invalid Experiment ID "${id}".`);
      }
    }

    const status = fields.get("Status");
    if (status && !allowedStatuses.has(status)) {
      errors.push(`${recordLabel} has invalid status "${status}".`);
    }
    const result = fields.get("Result");
    if (result && !allowedResults.has(result)) {
      errors.push(`${recordLabel} has invalid Result "${result}".`);
    }
    const decision = fields.get("Decision");
    if (decision && !allowedDecisions.has(decision)) {
      errors.push(`${recordLabel} has invalid Decision "${decision}".`);
    }

    if (recordType === "experiment-readout") {
      for (const field of requiredReadoutFields) {
        if (!fields.get(field)) {
          errors.push(`${recordLabel} is missing required field "${field}".`);
        }
      }
      if (id && !startedIds.has(id)) {
        errors.push(`${recordLabel} references "${id}" before its experiment-start record.`);
      }
      if (status && !allowedReadoutStatuses.has(status)) {
        errors.push(`${recordLabel} has invalid readout status "${status}".`);
      }
      const observedAtText = fields.get("Observed at") ?? "";
      const observedAt = parseIsoUtcTimestamp(observedAtText);
      let timestampIsOrdered = Boolean(observedAt);
      if (!observedAt) {
        errors.push(
          `${recordLabel} Observed at must be a valid calendar timestamp in ISO-8601 UTC.`,
        );
      } else if (id && startedIds.has(id)) {
        const launchDate = launchDatesById.get(id);
        if (launchDate && observedAt < launchDate) {
          errors.push(`${recordLabel} Observed at cannot precede its launch date.`);
          timestampIsOrdered = false;
        }
        const previousReadoutAt = lastReadoutAtById.get(id);
        if (previousReadoutAt && observedAt <= previousReadoutAt) {
          errors.push(`${recordLabel} readout timestamps must strictly increase.`);
          timestampIsOrdered = false;
        }
        if (timestampIsOrdered) lastReadoutAtById.set(id, observedAt);
      }
      const readout = fields.get("Readout");
      if (readout && !allowedReadouts.has(readout)) {
        errors.push(`${recordLabel} has invalid Readout "${readout}".`);
      }
      if (
        id &&
        startedIds.has(id) &&
        timestampIsOrdered &&
        status &&
        allowedReadoutStatuses.has(status)
      ) {
        recordLatestStatus(id, status, recordLabel);
      }
      return;
    }

    if (recordType !== "experiment-start") {
      errors.push(
        `${recordLabel} Record type must be "experiment-start" or "experiment-readout".`,
      );
      return;
    }
    for (const field of requiredExperimentFields) {
      if (!fields.get(field)) {
        errors.push(`${recordLabel} is missing required field "${field}".`);
      }
    }
    if (id) {
      if (startedIds.has(id)) {
        errors.push(`Experiment start ID "${id}" must be unique.`);
      }
      startedIds.add(id);
      if (status && allowedStatuses.has(status)) {
        recordLatestStatus(id, status, recordLabel);
      }
    }

    const assetClass = fields.get("Asset class");
    if (assetClass && !allowedAssetClasses.has(assetClass)) {
      errors.push(`${recordLabel} has invalid asset class "${assetClass}".`);
    }

    const window = fields.get("Data window");
    const windowMatch = window?.match(/^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/);
    const startDate = parseIsoDate(windowMatch?.[1]);
    const endDate = parseIsoDate(windowMatch?.[2]);
    if (!startDate || !endDate || (endDate.valueOf() - startDate.valueOf()) / DAY_MS !== 6) {
      errors.push(`${recordLabel} Data window must span seven complete dates inclusive.`);
    } else {
      const anchorOffsetDays =
        (startDate.valueOf() - CAMPAIGN_WINDOW_ANCHOR.valueOf()) / DAY_MS;
      if (anchorOffsetDays < 0 || anchorOffsetDays % 7 !== 0) {
        errors.push(
          `${recordLabel} Data window must follow the campaign cadence anchored on 2026-07-18.`,
        );
      }
    }

    const launchedText = fields.get("Launched");
    const launched = parseIsoDate(launchedText);
    if (!launched) {
      errors.push(`${recordLabel} Launched must be a valid YYYY-MM-DD date.`);
    } else {
      if (startDate && endDate && (launched < startDate || launched > endDate)) {
        errors.push(`${recordLabel} launch date must fall inside its Data window.`);
      }
      const isSuccessorExperiment = blockIndex > successorSchemaMarkerIndex;
      const deadline = isSuccessorExperiment
        ? SUCCESSOR_CAMPAIGN_DEADLINE
        : HISTORICAL_CAMPAIGN_DEADLINE;
      const deadlineText = isSuccessorExperiment ? "2026-09-21" : "2026-08-18";
      if (launched > deadline) {
        errors.push(`${recordLabel} cannot launch after ${deadlineText}.`);
      }
      if (id && startedIds.has(id)) launchDatesById.set(id, launched);
    }

    const minimumExposure = fields.get("Minimum exposure") ?? "";
    const exposureMatch = minimumExposure.match(/^(\d+(?:\.\d+)?)\s+(\S.*)$/);
    if (!exposureMatch || Number(exposureMatch[1]) <= 0) {
      errors.push(
        `${recordLabel} Minimum exposure must contain a positive threshold and native unit.`,
      );
    }

    if (blockIndex > dateSchemaMarkerIndex) {
      const publishDate = fields.get("Publish date") ?? "";
      if (publishDate !== "not-published" && !parseIsoDate(publishDate)) {
        errors.push(
          `${recordLabel} Publish date must be YYYY-MM-DD or not-published.`,
        );
      }
      const indexDate = fields.get("Index date") ?? "";
      if (indexDate !== "not-indexed" && !parseIsoDate(indexDate)) {
        errors.push(
          `${recordLabel} Index date must be YYYY-MM-DD or not-indexed.`,
        );
      }
    }
  });

  const active = [...latestStatuses]
    .filter(([, status]) => activeStatuses.has(status))
    .map(([id]) => id);
  const productionInFlightIds = [...latestStatuses]
    .filter(([, status]) => productionInFlightStatuses.has(status))
    .map(([id]) => id);

  return {
    starts: startedIds.size,
    active: active.length,
    startedIds,
    activeIds: new Set(active),
    productionInFlightIds,
    campaignRecords: campaignRecords(ledger),
  };
}

export function validateGoalControlPlane({
  plan,
  experiments,
  scenarioBacklog,
  scenarioReport,
  sitemapRows,
}) {
  const errors = [];
  const frozen = frozenContract(plan, errors);
  if (frozen) {
    const normalized = normalizeWhitespace(frozen);
    for (const [label, clause] of requiredFrozenClauses) {
      if (!normalized.includes(normalizeWhitespace(clause))) {
        errors.push(`Frozen Goal contract is missing or changed: ${label}.`);
      }
    }
    const digest = createHash("sha256").update(frozen).digest("hex");
    if (digest !== EXPECTED_FROZEN_SHA256) {
      errors.push(
        `Frozen Goal contract hash changed: expected ${EXPECTED_FROZEN_SHA256}, received ${digest}.`,
      );
    }
  }
  const correction = authorityFirstCorrection(plan, errors);
  if (correction) {
    const normalized = normalizeWhitespace(correction);
    for (const [label, clause] of requiredAuthorityFirstClauses) {
      if (!normalized.includes(normalizeWhitespace(clause))) {
        errors.push(`Authority-first correction is missing or changed: ${label}.`);
      }
    }
  }
  const successor = successorGoalContract(plan, errors);
  if (successor) {
    const normalized = normalizeWhitespace(successor);
    for (const [label, clause] of requiredSuccessorClauses) {
      if (!normalized.includes(normalizeWhitespace(clause))) {
        errors.push(`Successor Goal contract is missing or changed: ${label}.`);
      }
    }
    const digest = createHash("sha256").update(successor).digest("hex");
    if (digest !== EXPECTED_SUCCESSOR_SHA256) {
      errors.push(
        `Successor Goal contract hash changed: expected ${EXPECTED_SUCCESSOR_SHA256}, received ${digest}.`,
      );
    }
  }
  const successorWaiting = successorWaitingWork(plan, errors);
  if (successorWaiting) {
    const normalized = normalizeWhitespace(successorWaiting);
    for (const [label, clause] of requiredSuccessorWaitingClauses) {
      if (!normalized.includes(normalizeWhitespace(clause))) {
        errors.push(`Successor waiting work is missing or changed: ${label}.`);
      }
    }
    const digest = createHash("sha256").update(successorWaiting).digest("hex");
    if (digest !== EXPECTED_SUCCESSOR_WAITING_SHA256) {
      errors.push(
        `Successor waiting-work contract hash changed: expected ${EXPECTED_SUCCESSOR_WAITING_SHA256}, received ${digest}.`,
      );
    }
  }
  const contentExpansion = contentExpansionCorrection(plan, errors);
  if (contentExpansion) {
    const normalized = normalizeWhitespace(contentExpansion);
    for (const [label, clause] of requiredContentExpansionClauses) {
      if (!normalized.includes(normalizeWhitespace(clause))) {
        errors.push(`Content-expansion correction is missing or changed: ${label}.`);
      }
    }
  }

  if (!experiments.includes("This file is append-only.")) {
    errors.push("EXPERIMENTS.md must retain its append-only policy.");
  }
  if (!experiments.includes("24h readout") || !experiments.includes("W8 readout")) {
    errors.push("EXPERIMENTS.md must retain the 24h, 7d, W2, W4, and W8 readout schema.");
  }
  if (
    !experiments.includes(
      "## Campaign observation: fixed final window at 2026-08-21T04:28:22Z",
    )
  ) {
    errors.push("EXPERIMENTS.md must retain the fixed final-window observation.");
  }
  if (
    !experiments.includes(
      "## Campaign correction: authority-first execution at 2026-08-21T04:28:22Z",
    )
  ) {
    errors.push("EXPERIMENTS.md must retain the authority-first campaign correction.");
  }
  if (
    !experiments.includes(
      "## Campaign approval: successor authority-first campaign at 2026-08-21T08:24:29Z",
    )
  ) {
    errors.push("EXPERIMENTS.md must retain the approved successor campaign record.");
  }
  if (
    !experiments.includes(
      "## Campaign approval: successor waiting work at 2026-08-22T20:55:14Z",
    )
  ) {
    errors.push("EXPERIMENTS.md must retain the approved successor waiting-work record.");
  }
  if (
    !experiments.includes(
      "## Campaign control: trilingual scenario expansion approved at 2026-08-23T05:00:00Z",
    )
  ) {
    errors.push(
      "EXPERIMENTS.md must retain the approved trilingual scenario-expansion record.",
    );
  }
  if (!scenarioBacklog || typeof scenarioBacklog !== "object") {
    errors.push("docs/seo-scenario-backlog.json must be present and valid JSON.");
  } else if (typeof scenarioReport !== "string") {
    errors.push("docs/seo-scenario-backlog.md must be present.");
  } else if (!Array.isArray(sitemapRows) || sitemapRows.length === 0) {
    errors.push("The scenario verifier requires the current sitemap intent rows.");
  } else {
    const scenario = validateScenarioBacklog(scenarioBacklog, {
      sitemapRows,
      renderedReport: scenarioReport,
    });
    for (const error of scenario.errors) {
      errors.push(`Scenario backlog: ${error}`);
    }
    if (renderScenarioBacklog(scenarioBacklog) !== scenarioReport) {
      errors.push("Scenario backlog generated report must remain synchronized.");
    }
  }
  const mutable = inspectMutableCampaignState(plan, errors);
  inspectAcquisitionFocus(plan, errors);
  const ledger = inspectExperimentLedger(experiments, errors);
  if (mutable.active !== null && mutable.active !== ledger.active) {
    errors.push(
      `PLAN.md Active experiments is ${mutable.active} but EXPERIMENTS.md has ${ledger.active}.`,
    );
  }
  if (mutable.currentId && !ledger.activeIds.has(mutable.currentId)) {
    errors.push(
      `PLAN.md Current experiment "${mutable.currentId}" must exist as an active experiment in EXPERIMENTS.md.`,
    );
  }
  if (!mutable.currentId && ledger.active > 0) {
    errors.push(
      "PLAN.md Current experiment must identify an active experiment while the ledger has active experiments.",
    );
  }
  if (
    ledger.productionInFlightIds.length === 1 &&
    mutable.currentId !== ledger.productionInFlightIds[0]
  ) {
    errors.push(
      `PLAN.md Current experiment must match the unique production-in-flight experiment "${ledger.productionInFlightIds[0]}".`,
    );
  }
  if (mutable.approvalTimestamp) {
    const approvalRecord = ledger.campaignRecords.find(
      ({ heading, fields }) =>
        heading.startsWith(`${mutable.approvalTimestamp} —`) &&
        fields.get("Record type") === "campaign-approval" &&
        fields.get("Contract status") === "approved by the user in this Codex task",
    );
    if (!approvalRecord) {
      errors.push(
        `EXPERIMENTS.md must retain the campaign-approval record for ${mutable.approvalTimestamp} while PLAN.md claims approval.`,
      );
    }
  }
  return errors;
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") continue;
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`);
    }
    const key = argument.slice(2);
    if (
      ![
        "plan",
        "experiments",
        "scenario",
        "scenario-report",
        "agents",
        "product-evidence-standard",
      ].includes(key)
    ) {
      throw new Error(`Unknown option: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    values[key] = value;
    index += 1;
  }
  return {
    agentsPath: resolve(values.agents ?? resolve(repoRoot, "AGENTS.md")),
    productEvidenceStandardPath: resolve(
      values["product-evidence-standard"] ??
        resolve(repoRoot, "docs/seo-product-evidence-standard.md"),
    ),
    planPath: resolve(values.plan ?? resolve(repoRoot, "PLAN.md")),
    experimentsPath: resolve(values.experiments ?? resolve(repoRoot, "EXPERIMENTS.md")),
    scenarioPath: resolve(
      values.scenario ?? resolve(repoRoot, "docs/seo-scenario-backlog.json"),
    ),
    scenarioReportPath: resolve(
      values["scenario-report"] ??
        resolve(repoRoot, "docs/seo-scenario-backlog.md"),
    ),
  };
}

async function run() {
  const {
    agentsPath,
    productEvidenceStandardPath,
    planPath,
    experimentsPath,
    scenarioPath,
    scenarioReportPath,
  } = parseArgs(process.argv.slice(2));
  const [
    agents,
    productEvidenceStandard,
    plan,
    experiments,
    scenarioJson,
    scenarioReport,
  ] = await Promise.all([
    readFile(agentsPath, "utf8"),
    readFile(productEvidenceStandardPath, "utf8"),
    readFile(planPath, "utf8"),
    readFile(experimentsPath, "utf8"),
    readFile(scenarioPath, "utf8"),
    readFile(scenarioReportPath, "utf8"),
  ]);
  const scenarioBacklog = JSON.parse(scenarioJson);
  const activeControl = await readFile(resolve(repoRoot, ACTIVE_VIEW_PATH), "utf8");
  const { buildPageIntentRows } = await import("./seo-intent-map.mjs");
  const errors = [
    ...validateActiveControl(plan, activeControl),
    ...validateAgentsSeoIndex(agents),
    ...validateProductEvidenceStandard(productEvidenceStandard),
    ...validateExperimentsAppendOnlyBaseline(experiments),
    ...validateGoalControlPlane({
      plan,
      experiments,
      scenarioBacklog,
      scenarioReport,
      sitemapRows: buildPageIntentRows(),
    }),
  ];
  if (errors.length > 0) {
    console.error(`[seo-goal] FAIL (${errors.length} violations)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    "[seo-goal] PASS: AGENTS index, goal contracts, trilingual scenario backlog, acquisition focus, and production-concurrency guard verified.",
  );
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  run().catch((error) => {
    console.error(`[seo-goal] ${error.message}`);
    process.exitCode = 1;
  });
}
