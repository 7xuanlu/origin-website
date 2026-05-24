#!/usr/bin/env node
// Pings IndexNow with the full URL list after a Vercel production build.
// Engines reached: Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazon Bot.
// Google does not participate in IndexNow (sitemap ping deprecated 2023);
// Google re-crawls from sitemap.xml lastmod on its own schedule after one-time
// GSC verification.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HOST = "useorigin.app";
const ORIGIN = `https://${HOST}`;
const KEY = "09521e19ffdcca3d68daffa830e64611";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const STATIC_PATHS = [
  "/",
  "/about",
  "/learn",
  "/docs",
  "/docs/get-started",
  "/llms.txt",
  "/llms-full.txt",
];

async function extractSlugs(filePath) {
  const text = await readFile(filePath, "utf8");
  const slugs = [];
  const re = /\bslug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

async function buildUrlList() {
  const learnSlugs = await extractSlugs(
    resolve(REPO_ROOT, "src/app/learn/articles.ts"),
  );
  const docsSlugs = await extractSlugs(
    resolve(REPO_ROOT, "src/app/docs/docs.ts"),
  );

  const urls = new Set();
  for (const p of STATIC_PATHS) urls.add(`${ORIGIN}${p}`);
  for (const s of learnSlugs) urls.add(`${ORIGIN}/learn/${s}`);
  for (const s of docsSlugs) urls.add(`${ORIGIN}/docs/${s}`);

  return [...urls];
}

async function main() {
  const isProduction = process.env.VERCEL_ENV === "production";
  const force = process.env.INDEXNOW_FORCE === "1";

  if (!isProduction && !force) {
    console.log(
      `[indexnow] skip: VERCEL_ENV=${process.env.VERCEL_ENV ?? "<unset>"}, not production. Use INDEXNOW_FORCE=1 to override.`,
    );
    return;
  }

  const urlList = await buildUrlList();
  console.log(`[indexnow] submitting ${urlList.length} URLs to ${ENDPOINT}`);

  if (process.env.INDEXNOW_DRY_RUN === "1") {
    console.log(`[indexnow] DRY_RUN, URLs that would be submitted:`);
    for (const u of urlList) console.log(`  ${u}`);
    return;
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  console.log(`[indexnow] response ${res.status}: ${responseText.slice(0, 500)}`);

  // 200 and 202 are both success per IndexNow spec.
  // Treat other codes as warnings; do not fail the build.
  if (res.status !== 200 && res.status !== 202) {
    console.warn(`[indexnow] non-success status ${res.status}, continuing build`);
  }
}

main().catch((err) => {
  console.warn(`[indexnow] error: ${err.message}. Build continues.`);
});
