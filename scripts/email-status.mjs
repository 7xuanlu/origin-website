import { subscriptionRpc } from '../src/lib/email/subscription.ts';

// Explicit operator invocation; no network in build, signup analytics or weekly pipeline.
if (process.argv.slice(2).filter(arg => arg !== '--').join(' ') !== '--live') {
  console.error('Usage: pnpm email:status --live (server credentials required)');
  process.exitCode=1;
} else {
  try {
    const result=await subscriptionRpc('welcome_status_v1',{});
    const keys=['schemaVersion','claimed','sent','failed','suppressed'];
    if(!result || typeof result!=='object' || Object.keys(result).length!==keys.length || result.schemaVersion!==1 || !keys.slice(1).every(key=>Number.isSafeInteger(result[key])&&result[key]>=0))throw Error();
    console.log(JSON.stringify({capturedAt:new Date().toISOString(),source:'Supabase welcome-delivery ledger',...result},null,2));
  } catch {console.error('Welcome status unavailable; check server configuration and migration.');process.exitCode=1;}
}
