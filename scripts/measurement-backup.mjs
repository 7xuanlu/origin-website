// Package an authorized SQL-console export and prove restoration in memory.
// No production connection, no remote request, no email send, no destructive restore.
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const migrations = [
  'supabase/migrations/20260908000000_site_events.sql',
  'supabase/migrations/20260909000000_welcome_delivery.sql',
];
const tables = {
  site_event_daily: { schema: 'measurement_private', order: 'day', fields: ['day','counts','total_count','minute_window_start','minute_count','saturated_minute','saturated_day'] },
  welcome_delivery: { schema: 'subscription_private', order: 'audience_id,contact_id', fields: ['audience_id','contact_id','attempt_id','state','suppressed','created_at','updated_at','provider_id'] },
  welcome_budget: { schema: 'subscription_private', order: 'day', fields: ['day','attempts'] },
};
const appMigration = 'supabase/migrations/20260909010000_app_events.sql';
const appTable = { schema: 'app_measurement_private', order: 'day', fields: ['day','version_buckets','batch_count','operation_count','minute_window_start','minute_batch_count','saturated_minute','saturated_batch_day','saturated_operation_day','saturated_version_day'] };
const snapshotTables = snapshot => snapshot.schema_version === 2 ? {...tables, app_event_daily: appTable} : tables;
const snapshotMigrations = snapshot => snapshot.schema_version === 2 ? [...migrations, appMigration] : migrations;
export const canonical = value => JSON.stringify(value, function (_key, item) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    return Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]));
  }
  return item;
});
export const digest = value => createHash('sha256').update(value).digest('hex');
function exactKeys(value, keys) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).sort().join('|') === [...keys].sort().join('|');
}
export function validateSnapshot(snapshot) {
  if (!exactKeys(snapshot, ['schema_version','scope','captured_at','tables'])
    || ![1,2].includes(snapshot.schema_version) || snapshot.scope !== `wenlan-site-owned-tables-v${snapshot.schema_version}`
    || typeof snapshot.captured_at !== 'string' || !Number.isFinite(Date.parse(snapshot.captured_at))
    || !exactKeys(snapshot.tables, Object.keys(snapshotTables(snapshot)))) throw Error('invalid snapshot');
  for (const [name, contract] of Object.entries(snapshotTables(snapshot))) {
    const rows = snapshot.tables[name];
    if (!Array.isArray(rows) || rows.length > 100000 || rows.some(row => !exactKeys(row, contract.fields))) throw Error('invalid table shape');
  }
  return snapshot;
}
export async function createBundle(snapshot) {
  validateSnapshot(snapshot);
  const schema = await Promise.all(snapshotMigrations(snapshot).map(async path => {
    const sql = await readFile(resolve(root, path), 'utf8');
    return { path, sql, sha256: digest(sql) };
  }));
  return { format: 'wenlan-owned-backup-v1', snapshot, snapshot_sha256: digest(canonical(snapshot)), migrations: schema };
}
export async function restoreInMemory(bundle, PGlite) {
  validateSnapshot(bundle.snapshot);
  const migrations = snapshotMigrations(bundle.snapshot);
  if (bundle.format !== 'wenlan-owned-backup-v1' || bundle.snapshot_sha256 !== digest(canonical(bundle.snapshot))
    || !Array.isArray(bundle.migrations) || bundle.migrations.length !== migrations.length) throw Error('backup integrity failed');
  // Never execute untrusted SQL supplied only by a backup. Require the exact
  // trusted repository migration bytes as well as their content hashes.
  for (const [i, part] of bundle.migrations.entries()) {
    const trusted = await readFile(resolve(root, migrations[i]), 'utf8');
    if (part.path !== migrations[i] || part.sql !== trusted || part.sha256 !== digest(trusted)) throw Error('schema integrity failed');
  }
  const db = new PGlite(); // no path/connection URL: isolated memory database only
  try {
    await db.exec('create role anon; create role authenticated; create role service_role;');
    for (const part of bundle.migrations) await db.exec(part.sql);
    const rows = {};
    for (const [name, contract] of Object.entries(snapshotTables(bundle.snapshot))) {
      const qualified = `${contract.schema}.${name}`;
      const data = JSON.stringify(bundle.snapshot.tables[name]);
      const expected = await db.query(`select to_jsonb(r) as row from jsonb_populate_recordset(null::${qualified}, $1::jsonb) r order by ${contract.order}`, [data]);
      await db.query(`insert into ${qualified} select * from jsonb_populate_recordset(null::${qualified}, $1::jsonb)`, [data]);
      const actual = await db.query(`select to_jsonb(r) as row from ${qualified} r order by ${contract.order}`);
      if (canonical(expected.rows) !== canonical(actual.rows)) throw Error('restore data mismatch');
      const permission = await db.query('select relrowsecurity as rls from pg_class where oid=$1::regclass', [qualified]);
      if (permission.rows[0]?.rls !== true) throw Error('RLS not restored');
      const access = await db.query("select has_table_privilege('anon',$1,'SELECT') as anon, has_table_privilege('authenticated',$1,'SELECT') as authenticated", [qualified]);
      if (access.rows[0].anon || access.rows[0].authenticated) throw Error('private table exposed');
      rows[name] = actual.rows.length;
    }
    return { verified_at: new Date().toISOString(), snapshot_sha256: bundle.snapshot_sha256,
      target: 'isolated_in_memory_postgres', row_counts: rows, rows_equal: true, rls_restored: true,
      public_table_access: false, production_written: false,
      limitations: ['Application-owned tables only; excludes Resend contacts, environment secrets, provider settings and Storage objects.',
        'A local export is off-provider but not proof of a second-device backup.',
        'Never restore an old welcome ledger into production and enable mail without reconciling later sends and opt-outs.'] };
  } finally { await db.close(); }
}
async function main() {
  const args = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const key = process.argv[i];
    if (!['--input','--output-dir','--pglite-module'].includes(key) || args[key] || !process.argv[i + 1]) throw Error('invalid args');
    args[key] = process.argv[i + 1];
  }
  if (!args['--input'] || !args['--output-dir'] || !args['--pglite-module']) throw Error('missing args');
  const output = resolve(args['--output-dir']);
  const rel = relative(root, output);
  if (!rel || (!rel.startsWith('..') && !isAbsolute(rel))) throw Error('output must be outside repository');
  const raw = await readFile(resolve(args['--input']), 'utf8');
  if (Buffer.byteLength(raw) > 16 * 1024 * 1024) throw Error('export too large');
  let snapshot = JSON.parse(raw);
  if (Array.isArray(snapshot) && snapshot.length === 1 && exactKeys(snapshot[0], ['backup'])) snapshot = snapshot[0].backup;
  const bundle = await createBundle(snapshot);
  const { PGlite } = await import(pathToFileURL(resolve(args['--pglite-module'])).href);
  const receipt = await restoreInMemory(bundle, PGlite);
  await mkdir(output, { recursive: true, mode: 0o700 });
  const id = `${snapshot.captured_at.replace(/[^0-9TZ]/g, '')}-${bundle.snapshot_sha256.slice(0, 12)}`;
  const backupPath = resolve(output, `${id}.backup.json`);
  await writeFile(backupPath, `${JSON.stringify(bundle, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  await writeFile(resolve(output, `${id}.restore.json`), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  console.log(JSON.stringify({ backup: backupPath, ...receipt }));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => {
  console.error('Backup or isolated restore failed; no production changes made. Check arguments, schema version and input privately.');
  process.exitCode = 1;
});
