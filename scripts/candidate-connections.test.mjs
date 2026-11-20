import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import registry from '../docs/candidate-ui/connection-actions.json' with { type: 'json' };
import { actionReadiness, actionFailure, connectionFeedback, runConnectedAction } from '../src/candidate/connections.ts';

test('every pending action explains its gap without dispatching or changing saved state', async () => {
  const ids = new Set();
  for (const action of registry.actions) {
    assert.equal(ids.has(action.id), false, `duplicate ${action.id}`); ids.add(action.id);
    if (action.connection_state === 'verified') continue;
    let saved = 'unchanged'; let calls = 0; let message = '';
    const result = await runConnectedAction(action.id, true, async () => { calls++; saved = 'saved'; }, text => { message = text; });
    assert.equal(result.executed, false); assert.equal(calls, 0); assert.equal(saved, 'unchanged');
    for (const gap of action.gap_ids) assert.ok(message.includes(gap));
    if (action.connection_state === 'not_connected') assert.match(message, /No changes were saved/);
    else { assert.match(message, /connection not verified/); assert.doesNotMatch(message, /No changes were saved/); }
  }
});

test('production wording never enables an unverified operation', async () => {
  let calls = 0; let message = '';
  await runConnectedAction('discover.search', false, async () => calls++, text => { message = text; });
  assert.equal(calls, 0); assert.match(message, /not available/); assert.doesNotMatch(message, /CUI-/);
});

test('unknown action fails closed', async () => {
  let calls = 0;
  await assert.rejects(runConnectedAction('unknown.action', true, async () => calls++, () => {}), /Unregistered/);
  assert.equal(calls, 0);
});

test('verification requires evidence and operation; a verified handler executes exactly once', async () => {
  const action = registry.actions.find(a => a.id === 'discover.search');
  const original = structuredClone(action);
  try {
    action.connection_state = 'verified'; action.verification_evidence = [];
    assert.equal(actionReadiness(action.id).connection_state, 'unverified');
    action.verification_evidence = ['test-only acceptance record'];
    assert.equal(connectionFeedback(actionReadiness(action.id), true), null);
    let calls = 0;
    const result = await runConnectedAction(action.id, true, async () => { calls++; return 'real response'; }, () => assert.fail('verified operation must not show a pending message'));
    assert.deepEqual(result, { executed: true, value: 'real response' }); assert.equal(calls, 1);
  } finally { Object.assign(action, original); }
});

test('runtime failure and unknown outcome stay distinct from absent integration', () => {
  assert.match(actionFailure(new Error('HTTP 403: access denied')), /Could not complete.*403/);
  const uncertain = actionFailure(new TypeError('Failed to fetch'));
  assert.match(uncertain, /could not be confirmed.*latest record/);
  assert.doesNotMatch(uncertain, /No changes were saved|Backend not connected/);
});

test('candidate entry point cannot mount the legacy fixture provider', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.doesNotMatch(app, /JobProvider|demoData|JobContext/);
  const candidate = readFileSync('src/candidate/CandidateApp.tsx', 'utf8');
  const ids = [...candidate.matchAll(/(?:action|pending|unavailable)\('([^']+)'/g), ...candidate.matchAll(/<ConnectionAction id="([^"]+)"/g)].map(match => match[1]);
  for (const id of ids) assert.ok(registry.actions.some(action => action.id === id), `${id} is unregistered`);
  assert.doesNotMatch(candidate, /discovery\/missions|localStorage|demoData|central.pool|20 times/i);
});
