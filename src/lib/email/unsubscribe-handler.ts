import { randomBytes } from 'node:crypto';
import { type Locale } from '@/i18n/locales';
import { verifyUnsubscribeToken, unsubscribeContact } from './subscription';

const COPY = {
  en: { title:'Email preferences', intro:'Stop receiving Wenlan release updates?', confirm:'Unsubscribe', done:'You’re unsubscribed.', detail:'You won’t receive future release-update emails from Wenlan. An email already being sent may still arrive.', invalid:'This unsubscribe link is invalid.', retry:'We couldn’t finish updating your preference. Please try again.', home:'Back to Wenlan' },
  'zh-TW': { title:'郵件訂閱設定', intro:'取消文瀾的郵件訂閱？', confirm:'確認退訂', done:'已取消訂閱。', detail:'你將不再收到文瀾的版本更新郵件。已在寄送中的郵件仍可能送達。', invalid:'這個退訂連結無效。', retry:'目前無法完成更新，請再試一次。', home:'返回文瀾' },
  'zh-CN': { title:'邮件订阅设置', intro:'取消文澜的邮件订阅？', confirm:'确认退订', done:'已取消订阅。', detail:'你将不再收到文澜的版本更新邮件。已在发送中的邮件仍可能送达。', invalid:'这个退订链接无效。', retry:'目前无法完成更新，请再试一次。', home:'返回文澜' },
} as const;

function page(locale: Locale, state: 'confirm'|'done'|'invalid'|'retry', token = '', status = 200): Response {
  const c=COPY[locale], nonce=randomBytes(16).toString('base64');
  const message=state==='confirm'?c.intro:state==='done'?c.done:state==='invalid'?c.invalid:c.retry;
  // token has already passed the strict signed-token grammar; it contains no HTML delimiters.
  const form=(state==='confirm'||state==='retry') && token ? `<form method="post" action="/email/unsubscribe"><input type="hidden" name="token" value="${token}"><button type="submit" name="confirm" value="yes">${c.confirm}</button></form>`:'';
  const home=locale==='en'?'/':`/${locale}`;
  return new Response(`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${c.title} · Wenlan</title><style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;background:#FCFCFB;color:#1A1A2E;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",sans-serif;line-height:1.7}main{max-width:540px;margin:12vh auto;padding:36px 28px}header{font-size:18px;font-weight:700;color:#514BB5;margin-bottom:36px}h1{font-size:clamp(25px,6vw,34px);line-height:1.35;letter-spacing:-.02em}p{color:#586174;font-size:16px}button{background:#5E58C8;border:0;border-radius:8px;color:white;font:inherit;font-weight:600;padding:12px 22px;margin:16px 0 28px;cursor:pointer}button:focus-visible,a:focus-visible{outline:3px solid #8FB3EA;outline-offset:4px}a{color:#514BB5}footer{margin-top:32px}</style></head><body><main><header>Wenlan 文瀾</header><h1>${message}</h1>${state==='done'?`<p>${c.detail}</p>`:''}${form}<footer><a href="${home}">${c.home}</a></footer></main></body></html>`, { status, headers: {
    'content-type':'text/html; charset=utf-8', 'cache-control':'no-store', 'referrer-policy':'no-referrer',
    'x-robots-tag':'noindex, nofollow', 'x-content-type-options':'nosniff',
    'content-security-policy':`default-src 'none'; style-src 'nonce-${nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
  }});
}

export async function handleUnsubscribe(request: Request, options: { env?: NodeJS.ProcessEnv; unsubscribe?: (id:string)=>Promise<boolean> } = {}): Promise<Response> {
  const env=options.env??process.env;
  const url=new URL(request.url);
  if (!['GET','POST'].includes(request.method)) return new Response(null,{status:405,headers:{Allow:'GET, POST'}});
  let token=url.searchParams.get('token')??'';
  let oneClick=false;
  if (request.method==='POST') {
    const origin=request.headers.get('origin');
    if (origin && origin!==url.origin) return page('en','invalid','',403);
    if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return page('en','invalid','',415);
    if (Number(request.headers.get('content-length'))>2048) return page('en','invalid','',413);
    try {
      const reader=request.body?.getReader(); let size=0; const chunks:Uint8Array[]=[];
      if (!reader) return page('en','invalid','',400);
      while (true) {const {done,value}=await reader.read(); if(done)break;size+=value.length;if(size>2048){await reader.cancel();return page('en','invalid','',413);}chunks.push(value);}
      const form=new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
      oneClick=form.get('List-Unsubscribe')==='One-Click';
      if (!oneClick && form.get('confirm')!=='yes') return page('en','invalid','',400);
      if (!oneClick) token=form.get('token')??'';
    } catch { return page('en','invalid','',400); }
  }
  const decoded=verifyUnsubscribeToken(token,env);
  if(!decoded) return page('en','invalid','',400);
  if(request.method==='GET') return page(decoded.locale,'confirm',token);
  const ok=await (options.unsubscribe??((id)=>unsubscribeContact(id,{env})))(decoded.contact);
  if(oneClick) return new Response(null,{status:ok?200:503,headers:{'cache-control':'no-store','x-robots-tag':'noindex'}});
  return page(decoded.locale,ok?'done':'retry',token,ok?200:503);
}
