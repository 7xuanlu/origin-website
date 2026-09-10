import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WENLAN_RELEASE } from '../src/lib/releases.ts';
import { DownloadPage } from '../src/app/_pages/download.tsx';
import { GetStartedPage } from '../src/app/_pages/get-started.tsx';
import { DownloadSection } from '../src/components/home/download.tsx';
import { softwareApplicationSchema } from '../src/app/structured-data.ts';
import { getCoreContent } from '../src/i18n/content/index.ts';

test('all locales render the supplied release rather than their build-time snapshot', () => {
  const release = {...WENLAN_RELEASE, version:'0.99.1', tag:'v0.99.1',
    releaseUrl: WENLAN_RELEASE.releaseUrl.replace(WENLAN_RELEASE.version,'0.99.1'),
    setupGuideUrl: WENLAN_RELEASE.setupGuideUrl.replace(WENLAN_RELEASE.version,'0.99.1'),
    assets: WENLAN_RELEASE.assets.map(a=>({...a, href:a.href.replaceAll(WENLAN_RELEASE.version,'0.99.1'),
      ...('guideHref' in a ? {guideHref:a.guideHref.replaceAll(WENLAN_RELEASE.version,'0.99.1')} : {}), size:'123.4 MiB'}))};
  for(const locale of ['en','zh-TW','zh-CN']) {
    const html=renderToStaticMarkup(React.createElement(DownloadPage,{locale,release}));
    for(const asset of release.assets) assert.ok(html.includes(asset.href), `${locale}:${asset.id}`);
    assert.ok(html.includes('v0.99.1'));
    assert.ok(html.includes('123.4 MiB'));
    assert.ok(!html.includes(`/releases/download/${WENLAN_RELEASE.tag}/`));
    assert.equal(softwareApplicationSchema(locale,release).softwareVersion,release.version);
    assert.equal(softwareApplicationSchema(locale,release).downloadUrl,release.releaseUrl);
    const section=DownloadSection({locale,copy:getCoreContent(locale).home.content.download,release});
    const homeHtml=renderToStaticMarkup(section);
    assert.ok(homeHtml.includes(release.tag));
    assert.ok(!homeHtml.includes(WENLAN_RELEASE.tag));
    const setupHtml=renderToStaticMarkup(React.createElement(GetStartedPage,{locale,release}));
    assert.ok(setupHtml.includes(release.releaseUrl));
    assert.ok(!setupHtml.includes(`/releases/download/${WENLAN_RELEASE.tag}/`));
    assert.ok(!setupHtml.includes(WENLAN_RELEASE.tag), 'visible install copy and HowTo schema must agree');
    assert.ok(setupHtml.includes(`All ${release.tag} downloads`) || setupHtml.includes(`全部 ${release.tag}`));
    const recommendation=section.props.children.props.children[1];
    assert.deepEqual(recommendation.props.platforms.map(a=>a.href),release.assets.map(a=>a.href));
  }
});

test('production route wrappers and root schema inject the same server resolver',async()=>{
  for(const file of ['(en)/page.tsx','[locale]/page.tsx','(en)/download/page.tsx','[locale]/download/page.tsx','(en)/docs/get-started/page.tsx','[locale]/docs/get-started/page.tsx','root-document.tsx']) {
    const source=await readFile(new URL(`../src/app/${file}`,import.meta.url),'utf8');
    assert.match(source,/await getLatestRelease\(\)/,file);
  }
  for(const file of ['(en)/layout.tsx','[locale]/layout.tsx']) {
    assert.match(await readFile(new URL(`../src/app/${file}`,import.meta.url),'utf8'),/export const revalidate = 300/);
  }
});
