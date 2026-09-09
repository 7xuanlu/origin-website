import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { validateSnapshot, createBundle, canonical, digest, restoreInMemory } from './measurement-backup.mjs';
const snapshot = () => ({schema_version:1,scope:'wenlan-site-owned-tables-v1',captured_at:'2026-09-09T00:00:00Z',tables:{site_event_daily:[],welcome_delivery:[],welcome_budget:[]}});
test('backup rejects missing tables, extra personal fields, unsupported versions and malformed rows', () => {
  assert.equal(validateSnapshot(snapshot()).schema_version,1);
  for (const mutate of [s=>delete s.tables.welcome_delivery,s=>s.email='private@example.com',s=>s.schema_version=2,s=>s.tables.welcome_budget.push({day:'2026-09-09'})]) {
    const s=snapshot(); mutate(s); assert.throws(()=>validateSnapshot(s));
  }
});
test('v2 requires all four owned tables without changing historical v1 backups', async (t) => {
  const s = snapshot();
  s.schema_version = 2;
  s.scope = 'wenlan-site-owned-tables-v2';
  assert.throws(() => validateSnapshot(s));
  s.tables.app_event_daily = [];
  assert.equal(validateSnapshot(s).schema_version, 2);
  const bundle = await createBundle(s);
  assert.equal(bundle.migrations.length, 3);
  const module = process.env.PGLITE_QA_MODULE || '/private/tmp/wenlan-mail-sql-qa/node_modules/@electric-sql/pglite/dist/index.js';
  try { await access(module); } catch { t.diagnostic('PGlite unavailable: structure verified, isolated restore unchecked'); return; }
  const { PGlite } = await import(pathToFileURL(module).href);
  const receipt = await restoreInMemory(bundle, PGlite);
  assert.deepEqual(receipt.row_counts, {site_event_daily:0,welcome_delivery:0,welcome_budget:0,app_event_daily:0});
  assert.equal(receipt.rls_restored, true);
  assert.equal(receipt.production_written, false);
});
test('backup binds complete schema and data and rejects tampering before opening a database', async () => {
  const b=await createBundle(snapshot());
  assert.equal(b.snapshot_sha256,digest(canonical(snapshot())));
  assert.equal(b.migrations.length,2);
  let opened=false;
  class UnusedDb { constructor(){opened=true; throw Error('must not open');} }
  const damaged=structuredClone(b); damaged.snapshot.captured_at='2026-09-08T00:00:00Z';
  await assert.rejects(restoreInMemory(damaged,UnusedDb),/integrity/);
  const injected=structuredClone(b); injected.migrations[0].sql='select 1;'; injected.migrations[0].sha256=digest('select 1;');
  await assert.rejects(restoreInMemory(injected,UnusedDb),/integrity/);
  assert.equal(opened,false);
});
