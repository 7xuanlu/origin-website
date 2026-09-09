import assert from 'node:assert/strict';
import test from 'node:test';
import { createUnsubscribeToken, verifyUnsubscribeToken, sendNewSubscriberWelcome, unsubscribeContact, subscriptionRpc } from '../src/lib/email/subscription.ts';
import { handleUnsubscribe } from '../src/lib/email/unsubscribe-handler.ts';

const id='11111111-1111-4111-8111-111111111111', audience='22222222-2222-4222-8222-222222222222';
const env={WELCOME_EMAIL_ENABLED:'1',WELCOME_EMAIL_STARTED_AT:'2026-09-09T00:00:00Z',WELCOME_EMAIL_REPLY_TO:'owner@example.com',SUBSCRIPTION_SIGNING_SECRET:'a'.repeat(64),RESEND_AUDIENCE_ID:audience,RESEND_API_KEY:'re_test'};
function fixture(overrides={}) {
  const calls=[], rows=new Map();
  const contact={id,email:'test@example.com',unsubscribed:false,created_at:'2026-09-10T00:00:00Z',...overrides};
  const resend={contacts:{get:async()=>({data:contact}),update:async(data)=>{calls.push(['update',data]);return {data:{id}};}},emails:{send:async(data,options)=>{calls.push(['send',data,options]);return {data:{id:'33333333-3333-4333-8333-333333333333'}};}}};
  const rpc=async(name,body)=>{calls.push([name,body]); if(name==='claim_welcome_v1'){if(rows.has(id))return 'duplicate';rows.set(id,'claimed');return 'claimed';}if(name==='welcome_allowed_v1')return rows.get(id)==='claimed';if(name==='finish_welcome_v1'){rows.set(id,body.p_state);return true;}if(name==='suppress_welcome_v1'){rows.set(id,'suppressed');return true;}throw Error('unexpected rpc');};
  return {calls,rows,resend,rpc,env};
}

test('unsubscribe capabilities bind contact, audience and locale, reject tampering and malformed data',()=>{
  const token=createUnsubscribeToken(id,'zh-TW',env);
  assert.deepEqual(verifyUnsubscribeToken(token,env),{contact:id,locale:'zh-TW'});
  for(const value of [token+'x',token.replace(id,audience),token.replace('zh-TW','en'),'', 'x'.repeat(1000)])assert.equal(verifyUnsubscribeToken(value,env),null);
  assert.equal(verifyUnsubscribeToken(token,{...env,RESEND_AUDIENCE_ID:id}),null);
  assert.equal(verifyUnsubscribeToken(token,{...env,SUBSCRIPTION_SIGNING_SECRET:'short'}),null);
  assert.doesNotMatch(token,/@|test@example/);
});
test('disabled mode, pre-launch contacts, unsubscribed and missing creation dates do not send',async()=>{
  for(const changes of [{unsubscribed:true},{created_at:'2026-09-08T00:00:00Z'},{created_at:'bad'}]){const f=fixture(changes);assert.equal(await sendNewSubscriberWelcome(id,'en',f),'skipped');assert.equal(f.calls.length,0);}
  const f=fixture();assert.equal(await sendNewSubscriberWelcome(id,'en',{...f,env:{...env,WELCOME_EMAIL_ENABLED:'0'}}),'disabled');assert.equal(f.calls.length,0);
});
test('durable claim deduplicates concurrent and later submissions, sends CID and unsubscribe headers',async()=>{
  const f=fixture();const results=await Promise.all(Array.from({length:12},()=>sendNewSubscriberWelcome(id,'zh-TW',f)));
  assert.equal(results.filter(x=>x==='sent').length,1);assert.equal(f.calls.filter(x=>x[0]==='send').length,1);
  assert.equal(await sendNewSubscriberWelcome(id,'en',f),'duplicate');
  const [,mail,options]=f.calls.find(x=>x[0]==='send');assert.match(mail.html,/cid:wenlan-welcome-logo/);assert.equal(mail.attachments[0].contentId,'wenlan-welcome-logo');
  assert.match(mail.headers['List-Unsubscribe'],/^<https:\/\/wenlan.app\/email\/unsubscribe\?token=/);assert.equal(mail.headers['List-Unsubscribe-Post'],'List-Unsubscribe=One-Click');assert.match(options.idempotencyKey,new RegExp(id));assert.equal(mail.from,'Wenlan 文瀾 <hello@mail.wenlan.app>');
});
test('unknown send outcome stays terminal and provider errors do not leak addresses',async(t)=>{
  const old=console.error,logs=[];console.error=(...v)=>logs.push(v);t.after(()=>console.error=old);
  const f=fixture();f.resend.emails.send=async()=>{throw Error('test@example.com private error');};
  assert.equal(await sendNewSubscriberWelcome(id,'en',f),'failed');assert.equal(f.rows.get(id),'failed');
  assert.equal(await sendNewSubscriberWelcome(id,'en',f),'duplicate');assert.doesNotMatch(JSON.stringify(logs),/test@example|private error/);
});
test('capped and malformed storage results fail closed',async()=>{
  for(const response of ['capped',{},null]) {const f=fixture(); f.rpc=async()=>response;assert.equal(await sendNewSubscriberWelcome(id,'en',f),response==='capped'?'capped':'failed');assert.equal(f.calls.length,0);}
});
test('unsubscribe persists suppression before provider opt-out; failures are retryable without resubscribe',async()=>{
  const f=fixture();assert.equal(await unsubscribeContact(id,f),true);assert.equal(f.calls[0][0],'suppress_welcome_v1');assert.deepEqual(f.calls[1],['update',{id,unsubscribed:true}]);
  f.resend.contacts.update=async()=>({error:{statusCode:503}});assert.equal(await unsubscribeContact(id,f),false);assert.equal(f.rows.get(id),'suppressed');
});
test('GET cannot unsubscribe; confirmation POST and RFC8058 POST update exactly one signed contact',async()=>{
  const token=createUnsubscribeToken(id,'zh-TW',env),url=`https://wenlan.app/email/unsubscribe?token=${token}`;let n=0;
  const options={env,unsubscribe:async(contact)=>{assert.equal(contact,id);n++;return true;}};
  const get=await handleUnsubscribe(new Request(url),options);assert.equal(get.status,200);assert.equal(n,0);assert.match(await get.text(),/確認退訂/);assert.equal(get.headers.get('referrer-policy'),'no-referrer');assert.match(get.headers.get('content-security-policy'),/default-src 'none'/);
  for(const body of [new URLSearchParams({token,confirm:'yes'}),new URLSearchParams({'List-Unsubscribe':'One-Click'})]){const r=await handleUnsubscribe(new Request(url,{method:'POST',body}),options);assert.equal(r.status,200);}assert.equal(n,2);
});
test('no-referrer browser form POST accepts opaque origin only with a valid signed capability',async()=>{
  const token=createUnsubscribeToken(id,'zh-TW',env),url='https://wenlan.app/email/unsubscribe';let calls=0;
  const options={env,unsubscribe:async(contact)=>{assert.equal(contact,id);calls++;return true;}};
  for(const origin of ['null','https://wenlan.app']){
    const r=await handleUnsubscribe(new Request(url,{method:'POST',headers:{origin},body:new URLSearchParams({token,confirm:'yes'})}),options);
    assert.equal(r.status,200);assert.match(await r.text(),/已取消訂閱/);
  }
  assert.equal(calls,2);
  for(const invalid of ['',token.slice(0,-1)+'z']){
    const r=await handleUnsubscribe(new Request(url,{method:'POST',headers:{origin:'null'},body:new URLSearchParams({token:invalid,confirm:'yes'})}),options);
    assert.equal(r.status,400);
  }
  assert.equal(calls,2);
});
test('unsubscribe rejects invalid token, foreign origin, unsupported body and oversized stream',async()=>{
  const token=createUnsubscribeToken(id,'en',env),url=`https://wenlan.app/email/unsubscribe?token=${token}`;
  const options={env,unsubscribe:async()=>assert.fail('Must not mutate')};
  assert.equal((await handleUnsubscribe(new Request('https://wenlan.app/email/unsubscribe?token=bad'),options)).status,400);
  assert.equal((await handleUnsubscribe(new Request(url,{method:'POST',headers:{origin:'https://attacker.example'},body:new URLSearchParams({token,confirm:'yes'})}),options)).status,403);
  assert.equal((await handleUnsubscribe(new Request(url,{method:'POST',body:'{}'}),options)).status,415);
  assert.equal((await handleUnsubscribe(new Request(url,{method:'POST',body:new URLSearchParams({token,confirm:'yes',padding:'a'.repeat(3000)})}),options)).status,413);
});
test('failed unsubscribe gives retryable 503; no analytics or email data on confirmation page',async()=>{
  const token=createUnsubscribeToken(id,'zh-CN',env);
  const r=await handleUnsubscribe(new Request('https://wenlan.app/email/unsubscribe',{method:'POST',body:new URLSearchParams({token,confirm:'yes'})}),{env,unsubscribe:async()=>false});
  assert.equal(r.status,503);const html=await r.text();assert.match(html,/请再试一次/);assert.doesNotMatch(html,/<script|umami|vercel|test@example/);
});
test('Supabase transport validates server credentials and never follows redirects',async()=>{
  const storeEnv={SUPABASE_URL:'https://example.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test'};
  await subscriptionRpc('welcome_status_v1',{},storeEnv,async(url,options)=>{assert.equal(options.redirect,'error');assert.equal(options.headers.apikey,'sb_secret_test');assert.equal(options.headers.authorization,undefined);return Response.json({schemaVersion:1});});
  await assert.rejects(subscriptionRpc('welcome_status_v1',{}, {...storeEnv,SUPABASE_URL:'https://example.supabase.co@evil.example'},()=>assert.fail('Must not fetch')));
});
