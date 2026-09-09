#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_INPUT_DIR = "/tmp/wenlan-seo";
const SAMPLE_INPUT_DIR = resolve(REPO_ROOT, "scripts/fixtures/seo-weekly");
const EXPECTED_SITE_URL = "sc-domain:wenlan.app";
const ALLOWED_GSC_SOURCES = new Set([
  "Search Console API",
  "authenticated GSC UI export",
  "authenticated GSC CSV export",
]);
const DAY_MS = 24 * 60 * 60 * 1000;

function parseBooleanArg(args, key) {
  const value = args[key];
  if (value && !["true", "false"].includes(value)) {
    throw new Error(`--${key} must be true or false`);
  }
  return value === "true";
}

function parseIsoDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
    throw new Error(`${label} must be a valid YYYY-MM-DD date`);
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} must be a valid YYYY-MM-DD date`);
  }
  return value;
}

function expectedEvidenceRange(date) {
  parseIsoDate(date, "--date");
  const reportDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(reportDate.valueOf() - DAY_MS);
  const startDate = new Date(endDate.valueOf() - 27 * DAY_MS);
  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
}

function assertPropertyTotals(propertyTotals, { required = false } = {}) {
  if (!propertyTotals) {
    if (required) throw new Error("GSC API metadata must include propertyTotals");
    return;
  }
  if (propertyTotals.aggregationType !== "byProperty") {
    throw new Error("GSC metadata propertyTotals aggregationType must be byProperty");
  }
  for (const field of ["clicks", "impressions"]) {
    if (!Number.isSafeInteger(propertyTotals[field]) || propertyTotals[field] < 0) {
      throw new Error(`GSC metadata propertyTotals.${field} must be a non-negative integer`);
    }
  }
  if (propertyTotals.impressions === 0) {
    if (propertyTotals.clicks !== 0) {
      throw new Error("GSC metadata propertyTotals clicks require impressions");
    }
    if (propertyTotals.ctr !== null || propertyTotals.position !== null) {
      throw new Error("GSC metadata empty propertyTotals must use null CTR and position");
    }
    return;
  }
  if (!Number.isFinite(propertyTotals.ctr) || propertyTotals.ctr < 0) {
    throw new Error("GSC metadata propertyTotals.ctr must be a non-negative number");
  }
  if (!Number.isFinite(propertyTotals.position) || propertyTotals.position <= 0) {
    throw new Error("GSC metadata propertyTotals.position must be a positive number");
  }
  if (propertyTotals.clicks > propertyTotals.impressions) {
    throw new Error("GSC metadata propertyTotals clicks cannot exceed impressions");
  }
  const expectedCtr = propertyTotals.clicks / propertyTotals.impressions;
  if (Math.abs(propertyTotals.ctr - expectedCtr) > 1e-12) {
    throw new Error("GSC metadata propertyTotals CTR must equal clicks divided by impressions");
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    i += 1;
  }

  if (!args.date) throw new Error("Missing required --date");

  return {
    date: args.date,
    allowFixtureInput: parseBooleanArg(args, "allow-fixture-input"),
    allowManualDateRange: parseBooleanArg(args, "allow-manual-date-range"),
    inputDir: resolve(
      process.cwd(),
      args["input-dir"] || process.env.SEO_WEEKLY_INPUT_DIR || DEFAULT_INPUT_DIR,
    ),
    outputPath: args.output ? resolve(process.cwd(), args.output) : null,
  };
}

async function assertGscMetadata(path, args) {
  const metadata = JSON.parse(await readFile(path, "utf8"));
  if (metadata.siteUrl !== EXPECTED_SITE_URL) {
    throw new Error(`GSC property must be ${EXPECTED_SITE_URL}; received ${metadata.siteUrl ?? "missing"}`);
  }
  if (!ALLOWED_GSC_SOURCES.has(metadata.source)) {
    throw new Error(`GSC metadata source must be one of: ${[...ALLOWED_GSC_SOURCES].join(", ")}`);
  }
  assertPropertyTotals(metadata.propertyTotals, {
    required: metadata.source === "Search Console API",
  });
  for (const field of ["queryRows", "pageRows"]) {
    if (
      Object.hasOwn(metadata, field) &&
      (!Number.isInteger(metadata[field]) || metadata[field] < 0)
    ) {
      throw new Error(`GSC metadata ${field} must be a non-negative integer`);
    }
  }
  const startDate = parseIsoDate(metadata.startDate, "GSC metadata startDate");
  const endDate = parseIsoDate(metadata.endDate, "GSC metadata endDate");
  if (startDate > endDate) {
    throw new Error("GSC metadata startDate must not be after endDate");
  }

  const expected = expectedEvidenceRange(args.date);
  if (
    !args.allowManualDateRange &&
    (startDate !== expected.startDate || endDate !== expected.endDate)
  ) {
    throw new Error(
      `GSC evidence range must be ${expected.startDate} to ${expected.endDate}; received ${startDate} to ${endDate}`,
    );
  }
}

async function assertReadable(path, label) {
  try {
    await access(path, constants.R_OK);
  } catch {
    throw new Error(
      `Missing ${label}: ${path}. Export the GSC ${label} CSV there or pass --input-dir.`,
    );
  }
}

async function isReadable(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function runNode(args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        reject(new Error(`seo weekly generator exited with code ${code}`));
      }
    });
  });
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (
    args.allowFixtureInput &&
    (process.env.npm_lifecycle_event !== "seo:weekly:sample" || args.inputDir !== SAMPLE_INPUT_DIR)
  ) {
    throw new Error("fixture input is reserved for pnpm seo:weekly:sample");
  }
  const queriesPath = join(args.inputDir, "gsc-queries.csv");
  const pagesPath = join(args.inputDir, "gsc-pages.csv");
  const metadataPath = join(args.inputDir, "gsc-metadata.json");
  const queryPagesPath = join(args.inputDir, "gsc-query-pages.json");

  await assertReadable(queriesPath, "queries");
  await assertReadable(pagesPath, "pages");
  const hasMetadata = !args.allowFixtureInput || await isReadable(metadataPath);
  if (!args.allowFixtureInput) {
    await assertReadable(metadataPath, "GSC metadata");
    await assertGscMetadata(metadataPath, args);
  }

  const generatorArgs = [
    resolve(__dirname, "seo-weekly.mjs"),
    "--queries",
    queriesPath,
    "--pages",
    pagesPath,
    "--date",
    args.date,
  ];

  if (hasMetadata) {
    generatorArgs.push("--gsc-metadata", metadataPath);
  }
  if (await isReadable(queryPagesPath)) {
    generatorArgs.push("--query-pages", queryPagesPath);
  }

  if (args.outputPath) {
    generatorArgs.push("--output", args.outputPath);
  }

  for (const [filename, flag] of [
    ["vercel-pages.csv", "--vercel-pages"],
    ["vercel-referrers.csv", "--vercel-referrers"],
    ["vercel-source-pages.csv", "--vercel-source-pages"],
    ["vercel-metadata.json", "--vercel-metadata"],
    ["github-metadata.json", "--github-metadata"],
    ["resend-metadata.json", "--resend-metadata"],
    ["site-events-metadata.json", "--site-events-metadata"],
    ["umami-pages.csv", "--umami-pages"],
    ["umami-referrers.csv", "--umami-referrers"],
    ["umami-events.csv", "--umami-events"],
  ]) {
    const path = join(args.inputDir, filename);
    if (await isReadable(path)) {
      generatorArgs.push(flag, path);
    }
  }

  await runNode(generatorArgs);
}

run().catch((err) => {
  console.error(`[seo-weekly-pipeline] ${err.message}`);
  process.exit(1);
});
