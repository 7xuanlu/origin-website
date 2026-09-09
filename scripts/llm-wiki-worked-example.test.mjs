import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";

test("downloaded exercise retains sources, reference, conflicts, provenance and standalone links", async () => {
  const { GET } = await import("../src/app/learn-example/[locale]/route.ts");
  for (const locale of ["en", "zh-TW", "zh-CN"]) {
    const response = await GET(new Request(`https://wenlan.app/learn-example/${locale}`), { params: Promise.resolve({ locale }) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-Robots-Tag"), "noindex");
    assert.match(response.headers.get("Content-Type"), /text\/markdown; charset=utf-8/);
    assert.equal(response.headers.get("Content-Disposition"), `attachment; filename="wenlan-worked-example-${locale}.md"`);
    const content = await response.text();
    for (const expected of ["api-v1.md", "decision-07.md", "runbook-v1.md", "api-v2.md", "3 retries", "1 retry", "Timeout: not specified", "Preserve and flag this conflict", "https://wenlan.app/docs/review-and-trust"]) assert.ok(content.includes(expected), `${locale}: ${expected}`);
    assert.match(content, /fictional/);
    assert.doesNotMatch(content, /\]\(\/docs\//);
  }
  const response = await GET(new Request("https://wenlan.app/learn-example/invalid"), { params: Promise.resolve({ locale: "invalid" }) });
  assert.equal(response.status, 404);
});

test("explicit example anchors do not renumber existing Mandarin fragments", async () => {
  const { buildSectionIds } = await import("../src/app/[locale]/learn/[slug]/section-ids.ts");
  assert.deepEqual(buildSectionIds(["第一段", "完整範例", "第二段"], [undefined, "worked-example", undefined]), ["section-1", "worked-example", "section-2"]);
});

test("all three LLM-wiki owners provide an explicitly authored complete example", async () => {
  const { workedExampleSections } = await import("../src/lib/llm-wiki-worked-example.ts");
  for (const locale of ["en", "zh-TW", "zh-CN"]) {
    const sections = workedExampleSections(locale);
    assert.equal(sections[0].id, "worked-example");
    const code = sections.map((section) => section.code?.code ?? "").join("\n");
    assert.match(code, /api-v1\.md/);
    assert.match(code, /decision-07\.md/);
    assert.match(code, /runbook-v1\.md/);
    assert.match(code, /POST/);
    assert.match(code, /3/);
    assert.match(code, /at most 1 retry/);
    assert.doesNotMatch(code, /<[^>]+>/);
    assert.ok(sections.every((section) => section.body.length > 0));
  }
  const en = readFileSync(new URL("../src/app/(en)/learn/articles.ts", import.meta.url), "utf8");
  const translated = readFileSync(new URL("../src/i18n/learn-articles.ts", import.meta.url), "utf8");
  assert.match(en, /\.\.\.workedExampleSections\("en"\)/);
  assert.match(translated, /\.\.\.workedExampleSections\("zh-TW"\)/);
  assert.match(translated, /\.\.\.workedExampleSections\("zh-CN"\)/);
});

test("scenario downloads preserve complete cited packets and the actual changed source", async () => {
  const { scenarioPackets } = await import("../src/lib/scenario-examples.ts");
  const { GET, generateStaticParams } = await import("../src/app/scenario-example/[id]/[locale]/route.ts");
  assert.equal(scenarioPackets.length, 7);
  assert.equal(new Set(scenarioPackets.map(p => p.slug)).size, 7);
  assert.equal(generateStaticParams().length, 21);
  for (const packet of scenarioPackets) {
    const files = new Set(packet.sources.map(s => s.filename));
    assert.equal(files.size, 3);
    const citations = [...packet.referenceMarkdown.matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1]);
    assert.ok(citations.length >= 3);
    assert.ok(citations.every(file => files.has(file)));
    assert.ok(citations.includes(packet.change.filename), "changed source must actually support the reference");
    assert.notEqual(packet.change.content, packet.sources.find(s => s.filename === packet.change.filename).content);
    for (const locale of ["en", "zh-TW", "zh-CN"]) {
      const r = await GET(new Request("https://wenlan.app"), {params: Promise.resolve({id:packet.id,locale})});
      assert.equal(r.status, 200);
      assert.equal(r.headers.get("x-robots-tag"), "noindex");
      assert.match(r.headers.get("content-disposition"), /^attachment; filename="wenlan-scenario-[a-z0-9-]+-(en|zh-TW|zh-CN)\.md"$/);
      const text = await r.text();
      for (const source of packet.sources) assert.ok(text.includes(source.content));
      for (const value of [packet.referenceMarkdown,packet.change.content,packet.change.expected,packet.locales[locale].task,packet.locales[locale].expected,packet.locales[locale].review]) assert.ok(text.includes(value));
      assert.ok(text.includes(`https://wenlan.app${locale === "en" ? "" : `/${locale}`}/learn/${packet.slug}`));
    }
  }
  for (const params of [{id:"unknown",locale:"en"},{id:scenarioPackets[0].id,locale:"fr"},{id:"../support",locale:"en"}]) {
    assert.equal((await GET(new Request("https://wenlan.app"),{params:Promise.resolve(params)})).status,404);
  }
});


test("each scenario retains its own captured product views and evidence provenance", async () => {
  const { scenarioPackets } = await import("../src/lib/scenario-examples.ts");
  const proof = JSON.parse(readFileSync(new URL("../docs/scenario-media-provenance.json", import.meta.url), "utf8"));
  assert.equal(proof.productVersion, "v0.18.3");
  assert.equal(proof.assets.length, 14);
  const packetHashes = new Map(readdirSync(new URL("../public/examples/scenarios/", import.meta.url)).filter(file => file.endsWith(".json")).map(file => {
    const bytes = readFileSync(new URL(`../public/examples/scenarios/${file}`, import.meta.url));
    return [JSON.parse(bytes.toString()).id, createHash("sha256").update(bytes).digest("hex")];
  }));
  for (const packet of scenarioPackets) {
    for (const view of ["app", "source"]) {
      const asset = proof.assets.find(a => a.scenario === packet.id && a.view === view);
      assert.ok(asset, `${packet.id}: ${view}`);
      assert.equal(asset.packetSha256, packetHashes.get(packet.id), "captured evidence must match the current teaching packet");
      assert.equal(asset.path, `public/images/product-evidence/wenlan-${packet.id}-${view}.png`);
      const bytes = readFileSync(new URL(`../${asset.path}`, import.meta.url));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
      assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], asset.dimensions);
    }
  }
});
