import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderActiveControl, validateActiveControl, fingerprintInputs, canReuseControl, CONTRACT_BLOCKS } from './seo-goal-control.mjs';
const root = new URL('../', import.meta.url);
const plan = await readFile(new URL('PLAN.md', root), 'utf8');
const active = await readFile(new URL('docs/seo-active-control.md', root), 'utf8');

test('active view retains every complete protected block and excludes historical narrative', () => {
  const view = renderActiveControl(plan);
  assert.equal(active, view);
  assert.ok(Buffer.byteLength(view) < 40000);
  for (const marker of CONTRACT_BLOCKS) {
    const block = plan.split(`<!-- ${marker}:START -->`)[1].split(`<!-- ${marker}:END -->`)[0];
    assert.ok(view.includes(block));
    assert.throws(() => renderActiveControl(plan.replace(`<!-- ${marker}:END -->`, 'removed')));
  }
  assert.ok(!view.includes('## Campaign publication: competitive intelligence'));
  assert.deepEqual(validateActiveControl(plan, active), []);
  assert.ok(validateActiveControl(plan, active.replace('10,000', '999')).length);
  assert.ok(validateActiveControl(plan, '').length);
  assert.throws(() => renderActiveControl(plan + '\n<!-- CONTENT-EXPANSION-CORRECTION:START -->'));
  assert.throws(() => renderActiveControl(plan.replace('### Current recovery work', 'x'.repeat(41000)+'\n### Current recovery work').replace('The user requested stepwise', 'x'.repeat(41000)+'\nThe user requested stepwise')));
  const altered = plan.replace('Technical SEO is a regression guardrail.', 'Technical SEO proves growth.');
  assert.ok(validateActiveControl(altered,renderActiveControl(altered)).some(e=>e.includes('Protected contract')));
  assert.ok(validateActiveControl(plan.replace('follow the native blocked audit', 'keep the Goal active until the deadline'), active).length);
  const nextCheckpoint = plan.replace('<!-- ACTIVE-CONTROL-STATE:START -->', '<!-- ACTIVE-CONTROL-STATE:START -->\nA new mutable checkpoint observation.');
  assert.notEqual(nextCheckpoint, plan, 'the checkpoint mutation must actually change the fixture');
  assert.deepEqual(validateActiveControl(nextCheckpoint, renderActiveControl(nextCheckpoint)), []);
  assert.ok(validateActiveControl(nextCheckpoint, active).length, 'mutable checkpoint invalidates a stale view without changing policy hashes');
});

test('reuse requires successful verification and a previously read matching fingerprint', () => {
  const a = fingerprintInputs([['PLAN.md',plan],['EXPERIMENTS.md','state A']]);
  const b = fingerprintInputs([['PLAN.md',plan],['EXPERIMENTS.md','state B']]);
  assert.equal(a, fingerprintInputs([['EXPERIMENTS.md','state A'],['PLAN.md',plan]]));
  assert.notEqual(a,b);
  assert.equal(canReuseControl(a,a,true),true);
  assert.equal(canReuseControl(undefined,a,true),false);
  assert.equal(canReuseControl(a,b,true),false);
  assert.equal(canReuseControl(a,a,false),false);
});
