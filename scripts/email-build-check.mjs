import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
// Home Server Actions must ship the original attachment, not an image-loader URL.
for (const route of ['(en)/page','[locale]/page','email/unsubscribe/route']) {
  const manifest=resolve(`.next/server/app/${route}.js.nft.json`);
  const files=JSON.parse(readFileSync(manifest,'utf8')).files;
  const logo=files.find(file=>file.endsWith('/src/lib/email/wenlan-logo.png'));
  assert.ok(logo,`${route}: missing server attachment trace`);
  assert.ok(existsSync(resolve(dirname(manifest),logo)),`${route}: missing traced file`);
}
console.log('[email-build-check] server attachment present in English, locale and unsubscribe functions');
