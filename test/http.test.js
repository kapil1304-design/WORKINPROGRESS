import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server/main.js';
import { Store } from '../server/store.js';
import { Auth } from '../server/auth.js';

test('HTTP login, authenticated mutation, CSRF rejection, private runtime and logout', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'wip-http-')), deliveries = [];
  const app = createApp({ dataDir: dir, ownerEmail: 'owner@example.test', jobs: false, mailer: { config: { mode: 'test' }, send: async (address, code) => deliveries.push({ address, code }) } });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${app.server.address().port}`;
  const post = (path, input, cookie = '') => fetch(origin + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WIP-Request': '1', Cookie: cookie }, body: JSON.stringify(input) });
  try {
    assert.equal((await fetch(origin + '/api/state')).status, 401);
    assert.equal((await fetch(origin + '/runtime/wip.sqlite')).status, 404);
    assert.equal((await fetch(origin + '/')).status, 200);
    assert.equal((await post('/api/auth/request', { email: 'owner@example.test' })).status, 200);
    const login = await post('/api/auth/verify', { email: 'owner@example.test', code: deliveries[0].code }); assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0]; assert.match(login.headers.get('set-cookie'), /HttpOnly/);
    assert.equal((await post('/api/auth/verify', { email: 'owner@example.test', code: deliveries[0].code })).status, 401);
    const state = await fetch(origin + '/api/state', { headers: { Cookie: cookie } }); assert.equal(state.status, 200);
    assert.equal((await fetch(origin + '/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: '{}' })).status, 403);
    const created = await post('/api/projects', { name: 'HTTP pilot', customer: 'Customer', delivery: '2026-12-01' }, cookie); assert.equal(created.status, 200);
    const p = await created.json(); assert.ok(p.id);
    const added = await post(`/api/projects/${p.id}/members`, { name: 'Staff typo', email: 'staff@example.test', organization: 'Company', role: 'staff', departments: ['Assembly', 'Testing'] }, cookie);
    assert.equal(added.status, 200); const member = await added.json();
    const edited = await post(`/api/projects/${p.id}/members/${member.id}`, { name: 'Corrected staff', email: 'corrected@example.test', organization: 'Company', role: 'staff', departments: ['Design'], version: 1, userVersion: 1 }, cookie);
    assert.equal(edited.status, 200);
    const afterEdit = await (await fetch(origin + '/api/state', { headers: { Cookie: cookie } })).json();
    assert.deepEqual(afterEdit.members.find(m => m.id === member.id).departments, ['Design']);
    assert.equal(afterEdit.users.find(u => u.id === member.user).email, 'corrected@example.test');
    await post('/api/auth/logout', {}, cookie); assert.equal((await fetch(origin + '/api/state', { headers: { Cookie: cookie } })).status, 401);
  } finally { await new Promise(resolve => app.server.close(resolve)); rmSync(dir, { recursive: true, force: true }); }
});
test('OTP attempts persist, lock at five failures, and expire', async () => {
  const store = new Store(); let time = 1000, code;
  store.put('users', { id: 'user', email: 'member@example.test', active: true });
  const auth = new Auth(store, { send: async (_, value) => { code = value; } }, () => time);
  try {
    await auth.request('member@example.test', 'ip');
    const wrong = code === '000000' ? '999999' : '000000';
    for (let i = 0; i < 5; i++) assert.throws(() => auth.verify('member@example.test', wrong, 'ip'), /Invalid/);
    assert.throws(() => auth.verify('member@example.test', code, 'ip'), /Invalid/);
    assert.equal(store.get('otps', 'member@example.test').attempts, 5);
    time += 61000; await auth.request('member@example.test', 'ip'); time += 600001;
    assert.throws(() => auth.verify('member@example.test', code, 'ip'), /Invalid/);
  } finally { store.close(); }
});
test('Email delivery failures do not leave a usable OTP', async () => {
  const store = new Store(); store.put('users', { id: 'user', email: 'member@example.test', active: true });
  const auth = new Auth(store, { send: async () => { throw Error('Unavailable'); } });
  try { await assert.rejects(auth.request('member@example.test', 'ip'), /could not be sent/); assert.equal(store.get('otps', 'member@example.test'), null); } finally { store.close(); }
});
