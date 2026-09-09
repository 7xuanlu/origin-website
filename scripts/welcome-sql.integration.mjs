import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Test-only PostgreSQL runtime, installed outside the site; not a production dependency.
if(!process.env.PGLITE_MODULE)throw Error('Set PGLITE_MODULE to the test-only PGlite module path');
const {PGlite}=await import(process.env.PGLITE_MODULE);
const db=new PGlite();
try {
  await db.exec('create role anon; create role authenticated; create role service_role;');
  const sql=await readFile(new URL('../supabase/migrations/20260909000000_welcome_delivery.sql',import.meta.url),'utf8');
  await db.exec(sql);await db.exec(sql); // Additive migration is repeatable.
  const audience='22222222-2222-4222-8222-222222222222',contact='11111111-1111-4111-8111-111111111111',attempt='33333333-3333-4333-8333-333333333333';
  await db.exec('set role anon');
  await assert.rejects(db.query('select public.claim_welcome_v1($1,$2,$3)',[audience,contact,attempt]),/permission denied/);
  await assert.rejects(db.query('select * from subscription_private.welcome_delivery'),/permission denied/);
  await db.exec('reset role; set role service_role');
  await assert.rejects(db.query('select * from subscription_private.welcome_delivery'),/permission denied/);
  const outcomes=await Promise.all(Array.from({length:20},()=>db.query('select public.claim_welcome_v1($1,$2,$3) as result',[audience,contact,attempt])));
  assert.equal(outcomes.filter(r=>r.rows[0].result==='claimed').length,1);
  assert.equal(outcomes.filter(r=>r.rows[0].result==='duplicate').length,19);
  assert.equal((await db.query("select public.finish_welcome_v1($1,$2,$3,'sent',$4) as result",[audience,contact,audience,attempt])).rows[0].result,false);
  await db.query('select public.suppress_welcome_v1($1,$2)',[audience,contact]);
  assert.equal((await db.query('select public.welcome_allowed_v1($1,$2,$3) as result',[audience,contact,attempt])).rows[0].result,false);
  assert.equal((await db.query("select public.finish_welcome_v1($1,$2,$3,'sent',$4) as result",[audience,contact,attempt,attempt])).rows[0].result,true);
  await db.exec('reset role');
  const receipt=(await db.query('select state, suppressed, provider_id from subscription_private.welcome_delivery where audience_id=$1 and contact_id=$2',[audience,contact])).rows[0];
  assert.deepEqual(receipt,{state:'sent',suppressed:true,provider_id:attempt});
  await db.exec('set role service_role');
  for(let i=2;i<=11;i++){
    const id=`11111111-1111-4111-8111-${String(i).padStart(12,'0')}`;
    const result=(await db.query('select public.claim_welcome_v1($1,$2,$3) as result',[audience,id,attempt])).rows[0].result;
    assert.equal(result,i<=10?'claimed':'capped');
  }
  await db.exec("reset role; update subscription_private.welcome_delivery set created_at=now()-interval '2 minutes'; update subscription_private.welcome_budget set attempts=50; set role service_role;");
  assert.equal((await db.query('select public.claim_welcome_v1($1,$2,$3) as result',[audience,'44444444-4444-4444-8444-444444444444',attempt])).rows[0].result,'capped');
  const status=(await db.query('select public.welcome_status_v1() as result')).rows[0].result;
  assert.equal(status.schemaVersion,1);assert.equal(status.suppressed,1);assert.equal(status.sent,1);assert.equal(status.claimed,9);
  console.log(JSON.stringify({migration:'PASS',repeatable:true,permissions:'PASS',duplicateClaims:'1 accepted / 19 duplicate',suppression:'PASS',minuteAndDayCaps:'PASS',status},null,2));
}finally {await db.close();}
