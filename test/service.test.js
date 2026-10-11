import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store } from '../server/store.js';
import { Service, localClock } from '../server/service.js';
import { Files } from '../server/files.js';

function fixture() {
  const store = new Store(); let time = '2026-10-12T03:00:00Z';
  const svc = new Service(store, () => time), owner = svc.bootstrap('owner@example.test');
  const p = svc.createProject(owner, { name: 'Machine A', customer: 'Customer A', start: '2026-10-12', delivery: '2026-12-01' });
  const people = { owner };
  for (const role of ['pm', 'purchase', 'staff', 'vendor', 'service', 'customer']) {
    const m = svc.addMember(owner, p.id, { name: role, email: `${role}@example.test`, role, organization: `${role} organization` }); people[role] = store.get('users', m.user);
  }
  const task = (role = 'staff', type = 'Internal', extra = {}) => svc.createTask(owner, p.id, { title: 'Private supplier detail', department: 'Assembly', assignee: people[role].id, type, due: '2026-11-01', ...extra });
  return { store, svc, owner, p, people, task, time: value => { time = value; }, cleanup: () => store.close() };
}
function run(name, fn) { test(name, () => { const f = fixture(); try { fn(f); } finally { f.cleanup(); } }); }
const status = t => ({ task: t.id, version: t.version, status: 'In progress', completed: 'Prepared work', pending: 'Assembly', nextAction: 'Assemble', forecast: '2026-11-01' });

run('Only owner creates projects and adds members', ({ svc, people, p }) => {
  assert.throws(() => svc.createProject(people.pm, { name: 'Denied' }), /Only the business owner/);
  assert.throws(() => svc.addMember(people.pm, p.id, { name: 'Denied' }), /not permitted/);
});
run('Project role never grants access to a different project', ({ svc, owner, people }) => {
  const other = svc.createProject(owner, { name: 'Other', customer: 'Other customer', delivery: '2026-12-01' });
  assert.throws(() => svc.createTask(people.pm, other.id, {}), /not found/);
  assert.equal(svc.snapshot(people.pm).projects.length, 1);
});
run('Vendor cannot retrieve another vendor task or customer identity', ({ svc, task, people }) => {
  task(); const own = task('vendor'); const snapshot = svc.snapshot(people.vendor);
  assert.deepEqual(snapshot.tasks.map(t => t.id), [own.id]); assert.equal(snapshot.projects[0].customer, undefined);
  assert.equal(snapshot.users.length, 1); assert.equal(snapshot.members.length, 0);
});
run('Customer projections hide assignee identities, raw vendor titles and status text', ({ svc, task, people, p }) => {
  const t = task(); svc.update(people.staff, p.id, status(t)); const snap = svc.snapshot(people.customer);
  assert.equal(snap.tasks[0].title, 'Assembly activity'); assert.equal(snap.tasks[0].assignee, undefined);
  assert.equal(snap.updates[0].completed, undefined); assert.equal(snap.updates[0].user, undefined);
});
run('Customer cannot submit scheduled progress but can write multilingual comments', ({ svc, people, p }) => {
  assert.throws(() => svc.update(people.customer, p.id, {}), /not permitted/);
  svc.comment(people.customer, p.id, { audience: 'customer', text: 'कार्य पूरा हुआ' });
  assert.equal(svc.snapshot(people.customer).comments[0].text, 'कार्य पूरा हुआ');
});
run('Updates are assignee-only, versioned, and idempotent', ({ svc, task, people, p }) => {
  const t = task(); assert.throws(() => svc.update(people.pm, p.id, status(t)), /Only the assigned/);
  const first = svc.update(people.staff, p.id, status(t), 'retry-1');
  assert.equal(svc.update(people.staff, p.id, status(t), 'retry-1').id, first.id);
  assert.throws(() => svc.update(people.staff, p.id, status(t)), /record changed/);
});
run('Late forecasts need reasons and never change an approved due date', ({ svc, task, people, p, store }) => {
  const t = task(); assert.throws(() => svc.update(people.staff, p.id, { ...status(t), forecast: '2026-11-10' }), /requires a reason/);
  svc.update(people.staff, p.id, { ...status(t), forecast: '2026-11-10', reason: 'Input delayed' });
  assert.equal(store.get('tasks', t.id).due, '2026-11-01');
});
run('Reported completion needs physical confirmation by owner or manager', ({ svc, task, people, p, store }) => {
  const t = task(); svc.update(people.staff, p.id, { ...status(t), status: 'Submitted for verification' });
  const version = store.get('tasks', t.id).version;
  assert.throws(() => svc.verify(people.staff, t.id, { version, physicallyChecked: true }), /not permitted/);
  assert.throws(() => svc.verify(people.pm, t.id, { version }), /physical verification/);
  assert.equal(svc.verify(people.pm, t.id, { version, physicallyChecked: true }).status, 'Completed');
});
run('Task date changes reject self approval and preserve baseline', ({ svc, task, people, p, store, owner }) => {
  const t = task(), r = svc.change(owner, p.id, { type: 'date', task: t.id, proposedDate: '2026-11-15', reason: 'Delay' });
  assert.throws(() => svc.decide(owner, r.id, { decision: 'Approved' }), /different authorized/);
  svc.decide(people.purchase, r.id, { decision: 'Approved' });
  assert.equal(store.get('tasks', t.id).due, '2026-11-15'); assert.equal(store.get('tasks', t.id).baseline, '2026-11-01');
});
run('Stale date approval cannot overwrite newer task edits', ({ svc, task, people, p }) => {
  const t = task(), r = svc.change(people.pm, p.id, { type: 'date', task: t.id, proposedDate: '2026-11-15', reason: 'Delay' });
  svc.update(people.staff, p.id, status(t));
  assert.throws(() => svc.decide(people.owner, r.id, { decision: 'Approved' }), /changed since/);
});
run('Delivery changes require manager initiation and owner approval; customer acceptance is not a gate', ({ svc, people, p, store }) => {
  assert.throws(() => svc.change(people.purchase, p.id, { type: 'delivery' }), /not permitted/);
  const r = svc.change(people.pm, p.id, { type: 'delivery', proposedDate: '2026-12-10', reason: 'Recovery plan' });
  assert.throws(() => svc.decide(people.pm, r.id, { decision: 'Approved' }), /different authorized/);
  svc.decide(people.owner, r.id, { decision: 'Approved' });
  assert.equal(store.get('projects', p.id).delivery, '2026-12-10'); assert.equal(store.get('projects', p.id).closed, false);
  assert.equal(svc.snapshot(people.customer).changes[0].acceptance, 'Pending');
  svc.accept(people.customer, r.id, { decision: 'Rejected' }); assert.equal(store.get('projects', p.id).closed, false);
});
run('Scope decision assigns accepted work and notifies customer atomically within a seven-day tracked deadline', ({ svc, people, p, store, task }) => {
  const r = svc.change(people.owner, p.id, { type: 'scope', reason: 'Additional tooling' });
  assert.equal(Date.parse(r.deadline) - Date.parse(r.at), 7 * 86400000);
  assert.throws(() => svc.decide(people.purchase, r.id, { decision: 'Approved' }), /different authorized/);
  assert.throws(() => svc.decide(people.pm, r.id, { decision: 'Approved' }), /Assign accepted/);
  store.tx(() => svc.decide(people.pm, r.id, { decision: 'Approved', tasks: [{ title: 'Added task', department: 'Assembly', type: 'Internal', assignee: people.staff.id, due: '2026-11-01' }] }));
  assert.equal(store.get('changes', r.id).assignedTasks.length, 1); assert.ok(store.get('changes', r.id).notifiedAt);
});
run('Failed scope allocation rolls back partially created tasks', ({ svc, people, p, store }) => {
  const r = svc.change(people.owner, p.id, { type: 'scope', reason: 'Additional work' });
  const valid = { title: 'New task', department: 'Assembly', type: 'Internal', assignee: people.staff.id, due: '2026-11-01' };
  assert.throws(() => store.tx(() => svc.decide(people.pm, r.id, { decision: 'Approved', tasks: [valid, {}] })));
  assert.equal(store.all('tasks').length, 0); assert.equal(store.get('changes', r.id).status, 'Pending');
});
run('Purchase dispatch and partial receipt cannot count as accepted readiness', ({ svc, task, people, p, store }) => {
  const t = task('vendor', 'Purchase', { requiredQuantity: 10 });
  const dispatch = svc.supply(people.vendor, t.id, { version: t.version, action: 'dispatch', quantity: 10 });
  const receipt = svc.supply(people.purchase, t.id, { version: dispatch.version, action: 'receipt', quantity: 5 });
  const inspected = svc.supply(people.purchase, t.id, { version: receipt.version, action: 'inspect', quantity: 5, result: 'accepted' });
  svc.update(people.vendor, p.id, { ...status(inspected), status: 'Submitted for verification' });
  assert.throws(() => svc.verify(people.purchase, t.id, { version: store.get('tasks', t.id).version, physicallyChecked: true }), /full accepted/);
  assert.throws(() => svc.supply(people.purchase, t.id, { version: store.get('tasks', t.id).version, action: 'inspect', quantity: 1, result: 'accepted' }), /exceeds received/);
});
run('Closed projects stop updates and reminders; only owner reopens at prior stage', ({ svc, people, p, task, time, store }) => {
  const t = task(); svc.transition(people.pm, p.id, 'stage', { stage: 'Assembly' }); svc.transition(people.pm, p.id, 'close');
  assert.throws(() => svc.update(people.staff, p.id, status(t)), /closed/);
  const count = store.all('notifications').length; time('2026-10-12T10:00:00Z'); svc.reminders(); assert.equal(store.all('notifications').length, count);
  assert.throws(() => svc.transition(people.pm, p.id, 'reopen'), /not permitted/);
  assert.equal(svc.transition(people.owner, p.id, 'reopen').stage, 'Assembly'); assert.equal(store.get('tasks', t.id).status, 'Not started');
});
run('Conversations isolate vendors and customers', ({ svc, people, p }) => {
  svc.comment(people.owner, p.id, { audience: 'internal', text: 'Internal note' });
  svc.comment(people.owner, p.id, { audience: `member:${people.vendor.id}`, text: 'Vendor private' });
  svc.comment(people.owner, p.id, { audience: 'customer', text: 'Customer-safe note' });
  assert.deepEqual(svc.snapshot(people.vendor).comments.map(c => c.text), ['Vendor private']);
  assert.deepEqual(svc.snapshot(people.customer).comments.map(c => c.text), ['Customer-safe note']);
  assert.throws(() => svc.comment(people.vendor, p.id, { audience: 'customer', text: 'Wrong audience' }), /not permitted/);
});
run('Private attachments require current membership and audience permission', ({ svc, people, p, store }) => {
  const dir = mkdtempSync(join(tmpdir(), 'wip-files-')); const files = new Files(svc, dir);
  try {
    const file = files.upload(people.owner, p.id, { name: 'evidence.pdf', audience: 'internal', base64: Buffer.from('%PDF-1.4\nTest').toString('base64') });
    assert.throws(() => files.download(people.customer, file.id), /not found/);
    assert.throws(() => files.upload(people.owner, p.id, { name: 'bad.jpg', audience: 'internal', base64: Buffer.from('<script>bad</script>').toString('base64') }), /Only PDF/);
    const shared = files.upload(people.owner, p.id, { name: 'shared.pdf', audience: 'customer', base64: Buffer.from('%PDF-1.4\nTest').toString('base64') });
    assert.ok(files.download(people.customer, shared.id).bytes.length);
    const m = svc.membership(people.customer, p.id); svc.removeMember(people.owner, p.id, m.id);
    assert.throws(() => files.download(people.customer, shared.id), /not found/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
run('Reminder jobs deduplicate, respect IST working hours, and exclude customers', ({ svc, people, time, store }) => {
  time('2026-10-12T05:31:00Z'); svc.reminders(); const reminders = store.all('notifications').filter(n => n.category === 'missing-update'); assert.ok(reminders.length);
  assert.equal(reminders.filter(n => n.user === people.customer.id).length, 0);
  const count = store.all('notifications').length; svc.reminders(); assert.equal(store.all('notifications').length, count);
  time('2026-10-12T14:01:00Z'); svc.reminders(); assert.equal(store.all('notifications').length, count);
  time('2026-10-18T05:31:00Z'); svc.reminders(); assert.equal(store.all('notifications').length, count);
});
run('Missed evening update carries to next working morning and resolves on a late update', ({ svc, people, time, store, p }) => {
  time('2026-10-13T03:31:00Z'); svc.reminders();
  assert.ok(store.all('notifications').some(n => n.category === 'missing-update' && n.scheduledDay === '2026-10-12' && n.key.includes(':1080:')));
  svc.update(people.staff, p.id, { completed: 'Late report', pending: 'Work pending', nextAction: 'Continue' });
  assert.equal(store.all('notifications').filter(n => n.subject === people.staff.id && !n.resolved).length, 0);
});
test('SQLite preserves records across process-store restarts', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wip-store-')); const path = join(dir, 'data.sqlite');
  let store = new Store(path); store.put('sample', { id: '1', value: 'durable' }); store.close();
  store = new Store(path); assert.equal(store.get('sample', '1').value, 'durable'); store.close(); rmSync(dir, { recursive: true, force: true });
});
test('Timezone conversion uses Asia/Kolkata independently of server locale', () => {
  assert.deepEqual(localClock('2026-10-12T04:30:00Z'), { day: '2026-10-12', minute: 600, sunday: false });
});
run('Member departments are project-specific and support multiple selections', ({ svc, owner, people, p, store }) => {
  const m = svc.membership(people.staff, p.id);
  svc.editMember(owner, p.id, m.id, { name: 'Corrected name', email: people.staff.email, organization: 'Company', role: 'staff', departments: ['Assembly', 'Testing'], version: 1, userVersion: 1 });
  assert.deepEqual(store.get('members', m.id).departments, ['Assembly', 'Testing']);
  const other = svc.createProject(owner, { name: 'Second', customer: 'Customer', delivery: '2026-12-01' });
  const second = svc.addMember(owner, other.id, { name: 'Ignored existing name', email: people.staff.email, organization: 'Company', role: 'staff', departments: ['Design'] });
  assert.deepEqual(store.get('members', second.id).departments, ['Design']);
  assert.deepEqual(store.get('members', m.id).departments, ['Assembly', 'Testing']);
});
run('Editing legacy members preserves task assignments and audits corrections', ({ svc, owner, people, p, store, task }) => {
  const t = task(), m = svc.membership(people.staff, p.id); delete m.version; delete m.departments; store.put('members', m);
  svc.editMember(owner, p.id, m.id, { name: 'Corrected staff', email: 'corrected@example.test', organization: 'Company', role: 'staff', departments: ['Mechanical'], version: 1, userVersion: 1 });
  assert.equal(store.get('tasks', t.id).assignee, people.staff.id);
  assert.equal(store.get('users', people.staff.id).email, 'corrected@example.test');
  assert.ok(store.all('audit').some(a => a.action === 'member.edited' && a.detail.before.email === people.staff.email));
});
run('Member edits require owner permission and current versions', ({ svc, owner, people, p }) => {
  const m = svc.membership(people.staff, p.id), input = { name: 'Staff', email: people.staff.email, organization: 'Company', role: 'staff', departments: ['Assembly'], version: 1, userVersion: 1 };
  assert.throws(() => svc.editMember(people.pm, p.id, m.id, input), /not permitted/);
  svc.editMember(owner, p.id, m.id, input);
  assert.throws(() => svc.editMember(owner, p.id, m.id, input), /changed/);
});
run('Member correction rejects duplicate emails and invalid departments', ({ svc, owner, people, p, store }) => {
  const m = svc.membership(people.staff, p.id), input = { name: 'Staff', email: people.staff.email, organization: 'Company', role: 'staff', departments: ['Assembly'], version: 1, userVersion: 1 };
  assert.throws(() => svc.editMember(owner, p.id, m.id, { ...input, email: people.pm.email }), /already belongs/);
  assert.throws(() => svc.editMember(owner, p.id, m.id, { ...input, departments: ['Unknown'] }), /Invalid department/);
  assert.equal(store.get('members', m.id).version, 1);
});
run('Correcting email revokes old sessions and OTPs', ({ svc, owner, people, p, store }) => {
  const m = svc.membership(people.staff, p.id);
  store.put('sessions', { id: 'old-session', user: people.staff.id }); store.put('otps', { id: people.staff.email });
  svc.editMember(owner, p.id, m.id, { name: 'Staff', email: 'new@example.test', organization: 'Company', role: 'staff', departments: [], version: 1, userVersion: 1 });
  assert.equal(store.get('sessions', 'old-session'), null); assert.equal(store.get('otps', people.staff.email), null);
});
run('Project PO numbers persist, are optional, and reject invalid values', ({ svc, owner, store }) => {
  const input = { name: 'PO project', customer: 'Customer', delivery: '2026-12-01' };
  const p = svc.createProject(owner, { ...input, poNumber: ' PO/2026-001 ' });
  assert.equal(store.get('projects', p.id).poNumber, 'PO/2026-001');
  assert.equal(svc.createProject(owner, input).poNumber, null);
  assert.throws(() => svc.createProject(owner, { ...input, poNumber: 123 }), /PO number/);
  assert.throws(() => svc.createProject(owner, { ...input, poNumber: 'x'.repeat(101) }), /PO number/);
});
run('Vendor item names persist per project and can be corrected', ({ svc, owner, p, store }) => {
  const m = svc.addMember(owner, p.id, { name: 'Supplier', email: 'supplier@example.test', organization: 'Supplier', role: 'vendor', itemName: ' Pneumatic cylinder ' });
  assert.equal(m.itemName, 'Pneumatic cylinder');
  svc.editMember(owner, p.id, m.id, { name: 'Supplier', email: 'supplier@example.test', organization: 'Supplier', role: 'vendor', itemName: 'Hydraulic cylinder', version: 1, userVersion: 1 });
  assert.equal(store.get('members', m.id).itemName, 'Hydraulic cylinder');
  const other = svc.createProject(owner, { name: 'Other project', customer: 'Customer', delivery: '2026-12-01' });
  const second = svc.addMember(owner, other.id, { name: 'Supplier', email: 'supplier@example.test', role: 'vendor', itemName: 'Motor' });
  assert.equal(second.itemName, 'Motor'); assert.equal(store.get('members', m.id).itemName, 'Hydraulic cylinder');
});
run('Vendor item validation rejects invalid values and ignores non-vendor fields', ({ svc, owner, p, people }) => {
  assert.throws(() => svc.addMember(owner, p.id, { name: 'Supplier', email: 'bad-item@example.test', role: 'vendor', itemName: 123 }), /Item name/);
  assert.throws(() => svc.memberItemName('x'.repeat(201), 'vendor'), /Item name/);
  assert.equal(svc.memberItemName('Item', 'staff'), null);
  const m = svc.membership(people.vendor, p.id);
  assert.equal(svc.editMember(owner, p.id, m.id, { name: 'Vendor', email: people.vendor.email, organization: 'Vendor', role: 'vendor', version: 1, userVersion: 1 }).itemName, null);
});
run('Task assignment requires an explicitly added execution member', ({ svc, owner, people, p }) => {
  const input = { title: 'Work', department: 'Assembly', type: 'Internal', due: '2026-11-01' };
  assert.throws(() => svc.createTask(owner, p.id, input), /Select a member/);
  assert.throws(() => svc.createTask(owner, p.id, { ...input, assignee: owner.id }), /added to this project/);
  assert.throws(() => svc.createTask(owner, p.id, { ...input, assignee: people.customer.id }), /execution member/);
  assert.equal(svc.createTask(owner, p.id, { ...input, assignee: people.staff.id }).assignee, people.staff.id);
});
