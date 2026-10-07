import assert from 'node:assert/strict';
import test from 'node:test';
import { parseWorkspace } from '../src/session.ts';
import { apiBase, endpointError, initialThreads, models } from '../src/data.ts';
const workspace = () => ({ threads: structuredClone(initialThreads), items: structuredClone(models), activeId: 'new', loaded: 'qwen', endpoint: 'http://127.0.0.1:8000', dark: false });

test('tab workspace round-trip retains separate history, drafts and parameters', () => {
  const data = workspace();
  data.threads[0].draft = 'Keep this unsent draft';
  data.threads[0].temperature = 0;
  const result = parseWorkspace(JSON.stringify(data));
  assert.equal(result.threads[0].draft, 'Keep this unsent draft');
  assert.equal(result.threads[0].temperature, 0);
  assert.equal(result.threads[1].messages.length, 2);
  assert.equal(result.threads[1].messages[1].modelId, 'qwen');
});

test('invalid storage does not create a broken workspace', () => {
  assert.equal(parseWorkspace('broken JSON'), null);
  for (const change of [
    data => { data.threads = []; },
    data => { data.activeId = 'missing'; },
    data => { data.loaded = 'missing'; },
    data => { data.threads[0].temperature = -1; },
    data => { data.threads[1].messages[0].role = 'unknown'; },
    data => { data.threads[0].modelId = 'missing'; },
    data => { data.items.push(data.items[0]); },
  ]) {
    const data = workspace();change(data);
    assert.equal(parseWorkspace(JSON.stringify(data)), null);
  }
});

test('service URL validation and code examples agree on v1', () => {
  assert.equal(endpointError('http://127.0.0.1:8000'), undefined);
  assert.ok(endpointError('not-a-url'));
  assert.ok(endpointError('javascript:alert(1)'));
  assert.ok(endpointError('https://name:secret@example.test'));
  assert.equal(apiBase('http://127.0.0.1:8000/'), 'http://127.0.0.1:8000/v1');
  assert.equal(apiBase('http://127.0.0.1:8000/v1/'), 'http://127.0.0.1:8000/v1');
});

test('the app opens the engine console; chat is an explicit secondary route', async () => {
  const { routeFromHash } = await import('../src/data.ts');
  const previous = globalThis.location;
  try {
    globalThis.location = { hash: '' };
    assert.equal(routeFromHash().page, 'overview');
    globalThis.location = { hash: '#/requests' };
    assert.equal(routeFromHash().page, 'requests');
    globalThis.location = { hash: '#/chat/new' };
    assert.deepEqual(routeFromHash(), { page: 'chat', threadId: 'new' });
  } finally {
    if (previous === undefined) delete globalThis.location;
    else globalThis.location = previous;
  }
});
