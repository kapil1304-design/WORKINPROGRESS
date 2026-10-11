import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, milestoneForecast } from '../server/schedule.js';
import { Service } from '../server/service.js';
import { Store } from '../server/store.js';

const now = '2026-10-11T04:30:00Z';
const plan = { start: '2026-10-01', dispatchTarget: '2026-12-28', delivery: '2026-12-31', planningComplete: true, pdiDispatchDays: 7 };
const task = (id, due, phase = 'prePdi', extra = {}) => ({ id, due, forecast: due, phase, status: 'Not started', ...extra });
test('One-day PDI follows all required work, then seven and three calendar days', () => {
  const m = milestoneForecast(plan, [task('a', '2026-12-10'), task('b', '2026-12-20')], now);
  assert.equal(m.workReady, '2026-12-20'); assert.equal(m.pdiStart, '2026-12-21'); assert.equal(m.pdiFinish, '2026-12-21');
  assert.equal(m.dispatch, '2026-12-28'); assert.equal(m.delivery, '2026-12-31'); assert.equal(m.dispatchVarianceDays, 0);
  assert.equal(m.pdiReady, false);
});
test('Installation/handover work and legacy Installation department do not delay dispatch', () => {
  const m = milestoneForecast(plan, [task('a', '2026-12-20'), task('install', '2027-05-01', 'postDelivery'), { id: 'legacy-install', due: '2027-06-01', department: 'Installation', status: 'Not started' }], now);
  assert.equal(m.dispatch, '2026-12-28'); assert.equal(m.excludedTasks, 2);
});
test('Post-PDI corrections can delay dispatch beyond the default allowance', () => {
  const m = milestoneForecast(plan, [task('a', '2026-12-20'), task('correction', '2027-01-05', 'postPdi')], now);
  assert.equal(m.pdiFinish, '2026-12-21'); assert.equal(m.dispatch, '2027-01-05'); assert.equal(m.delivery, '2027-01-08'); assert.equal(m.dispatchVarianceDays, 8);
});
test('Editable allowance recalculates forecasts without mutating targets', () => {
  const copy = { ...plan, pdiDispatchDays: 2 }, m = milestoneForecast(copy, [task('a', '2026-12-20')], now);
  assert.equal(m.dispatch, '2026-12-23'); assert.equal(m.delivery, '2026-12-26'); assert.equal(copy.dispatchTarget, '2026-12-28'); assert.equal(copy.delivery, '2026-12-31');
});
test('Missing work or missing dates gives no confident milestone dates', () => {
  assert.equal(milestoneForecast(plan, [], now).state, 'Plan incomplete');
  assert.equal(milestoneForecast(plan, [task('a', '')], now).dispatch, null);
  assert.equal(milestoneForecast({ ...plan, planningComplete: false }, [task('a', '2026-12-20')], now).state, 'Provisional — confirm work list');
});
test('Overdue unfinished work does not produce a falsely past dispatch forecast', () => {
  const m = milestoneForecast(plan, [task('a', '2026-10-01')], now);
  assert.equal(m.pdiStart, '2026-10-12'); assert.equal(m.dispatch, '2026-10-19'); assert.ok(m.warnings.some(w => w.includes('past')));
});
test('Latest member forecast overrides task target, but unreported tasks follow revised approved dates', () => {
  const m = milestoneForecast(plan, [task('a', '2026-12-20', 'prePdi', { lastUpdate: now, forecast: '2026-12-25' })], now);
  assert.equal(m.pdiFinish, '2026-12-26');
  const unreported = milestoneForecast(plan, [task('a', '2026-12-22', 'prePdi', { forecast: '2026-12-20' })], now);
  assert.equal(unreported.pdiFinish, '2026-12-23');
});
test('Calendar arithmetic handles leap days and year boundaries', () => {
  assert.equal(addDays('2028-02-28', 1), '2028-02-29'); assert.equal(addDays('2026-12-31', 3), '2027-01-03');
});
test('Blocked work keeps forecasts tentative and inspection not ready', () => {
  const m = milestoneForecast(plan, [task('blocked', '2026-12-20', 'prePdi', { status: 'Blocked' })], now);
  assert.equal(m.state, 'Forecast needs review'); assert.equal(m.pdiReady, false); assert.ok(m.warnings.some(w => w.includes('blocked')));
});

function setup() {
  const store = new Store(), svc = new Service(store, () => now), owner = svc.bootstrap('owner@example.test');
  const p = svc.createProject(owner, { name: 'Milestone test', customer: 'Customer', start: '2026-10-01', dispatchTarget: '2026-12-28' });
  const people = { owner };
  for (const role of ['pm', 'purchase', 'staff', 'vendor', 'customer']) { const m = svc.addMember(owner, p.id, { name: role, email: `${role}@example.test`, role }); people[role] = store.get('users', m.user); }
  const t = svc.createTask(owner, p.id, { title: 'Assemble', department: 'Assembly', phase: 'prePdi', type: 'Internal', assignee: people.staff.id, due: '2026-12-20' });
  const settings = (input = {}) => svc.milestoneSettings(owner, p.id, { version: store.get('projects', p.id).version, pdiDispatchDays: 7, planningComplete: true, ...input });
  const finish = () => { const current = store.get('tasks', t.id); svc.update(people.staff, p.id, { task: t.id, version: current.version, status: 'Submitted for verification', completed: 'Done', pending: 'Verification', nextAction: 'Inspect' }); svc.verify(people.pm, t.id, { version: store.get('tasks', t.id).version, physicallyChecked: true }); };
  return { store, svc, p, t, people, settings, finish };
}
const run = (name, action) => test(name, () => { const f = setup(); try { action(f); } finally { f.store.close(); } });
run('New projects establish a dispatch target and delivery exactly three days later', ({ p }) => { assert.equal(p.dispatchTarget, '2026-12-28'); assert.equal(p.delivery, '2026-12-31'); assert.equal(p.originalDelivery, p.delivery); });
run('Inspection is gated by both complete work-list confirmation and physical verification', ({ svc, p, t, settings, finish, people, store }) => {
  assert.throws(() => svc.transition(people.pm, p.id, 'stage', { stage: 'Pre-dispatch inspection' }), /PDI requires/);
  settings(); assert.equal(svc.schedule(p.id).pdiReady, false); finish(); assert.equal(svc.schedule(p.id).pdiReady, true);
  svc.transition(people.pm, p.id, 'stage', { stage: 'Pre-dispatch inspection' });
  assert.throws(() => svc.transition(people.pm, p.id, 'stage', { stage: 'Dispatch' }), /current PDI/);
});
run('Confirmed actual PDI anchors dispatch; reopening verified work invalidates inspection readiness', ({ svc, p, t, settings, finish, people, store }) => {
  settings(); finish();
  const m = svc.completePdi(people.pm, p.id, { version: store.get('projects', p.id).version, inspected: true, date: '2026-10-11' });
  assert.equal(m.pdiValid, true); assert.equal(m.dispatch, '2026-10-18'); assert.equal(m.delivery, '2026-10-21');
  svc.transition(people.pm, p.id, 'stage', { stage: 'Dispatch' });
  svc.verify(people.pm, t.id, { version: store.get('tasks', t.id).version, action: 'reopen' });
  assert.equal(svc.schedule(p.id).pdiValid, false); assert.equal(svc.schedule(p.id).pdiReady, false);
});
run('Adding pre-PDI scope makes work list provisional and old inspection stale', ({ svc, p, settings, finish, people, store }) => {
  settings(); finish(); svc.completePdi(people.owner, p.id, { version: store.get('projects', p.id).version, inspected: true, date: '2026-10-11' });
  svc.createTask(people.owner, p.id, { title: 'Added scope', department: 'Testing', type: 'Internal', assignee: people.staff.id, due: '2026-12-25' });
  const m = svc.schedule(p.id); assert.equal(m.planningComplete, false); assert.equal(m.pdiValid, false); assert.equal(m.pdiReady, false);
});
run('Allowance edits reject unauthorized actors, stale versions and invalid intervals', ({ svc, p, store, people, settings }) => {
  const input = { version: store.get('projects', p.id).version, pdiDispatchDays: 7, planningComplete: true };
  assert.throws(() => svc.milestoneSettings(people.purchase, p.id, input), /not permitted/);
  assert.throws(() => settings({ pdiDispatchDays: -1 }), /0–365/); assert.throws(() => settings({ pdiDispatchDays: 1.5 }), /0–365/);
  settings({ pdiDispatchDays: 0 }); assert.equal(svc.schedule(p.id).pdiDispatchDays, 0);
  assert.throws(() => svc.milestoneSettings(people.owner, p.id, input), /record changed/);
  assert.equal(store.get('projects', p.id).delivery, '2026-12-31');
});
run('PDI cannot be backdated before verification or recorded in the future', ({ svc, p, settings, finish, people, store }) => {
  settings(); finish(); const input = { version: store.get('projects', p.id).version, inspected: true };
  assert.throws(() => svc.completePdi(people.pm, p.id, { ...input, date: '2026-10-10' }), /after work/);
  assert.throws(() => svc.completePdi(people.pm, p.id, { ...input, date: '2026-10-12' }), /future/);
});
run('Dispatch target revisions retain owner approval and derive the delivery target', ({ svc, p, people, store }) => {
  assert.throws(() => svc.change(people.owner, p.id, { type: 'dispatch', proposedDate: '2027-01-01', reason: 'Revision' }), /not permitted/);
  const r = svc.change(people.pm, p.id, { type: 'dispatch', proposedDate: '2027-01-01', reason: 'Revision' });
  assert.throws(() => svc.decide(people.pm, r.id, { decision: 'Approved' }), /different authorized/);
  svc.decide(people.owner, r.id, { decision: 'Approved' }); const changed = store.get('projects', p.id);
  assert.equal(changed.dispatchTarget, '2027-01-01'); assert.equal(changed.delivery, '2027-01-04'); assert.equal(changed.originalDispatchTarget, '2026-12-28');
  assert.ok(svc.snapshot(people.customer).changes.some(c => c.id === r.id)); svc.accept(people.customer, r.id, { decision: 'Accepted' });
});
run('Task phase corrections are scoped and audited without rewriting dates', ({ svc, p, t, settings, people, store }) => {
  settings(); const input = { version: t.version, phase: 'postDelivery', reason: 'Installation after delivery' };
  assert.throws(() => svc.taskSchedule(people.staff, t.id, input), /not permitted/);
  svc.taskSchedule(people.owner, t.id, input); const saved = store.get('tasks', t.id);
  assert.equal(saved.due, t.due); assert.equal(saved.phase, 'postDelivery'); assert.equal(svc.schedule(p.id).state, 'Plan incomplete');
});
run('Vendor views do not reveal milestones calculated from unrelated work', ({ svc, p, people }) => {
  assert.equal(svc.snapshot(people.vendor).projects[0].milestones, undefined);
  assert.ok(svc.snapshot(people.customer).projects[0].milestones);
});
test('Closed project forecasts freeze and recalculate only after owner reopening', () => {
  const store = new Store(); let at = now; const svc = new Service(store, () => at);
  try {
    const owner = svc.bootstrap('owner@example.test'), p = svc.createProject(owner, { name: 'Closed schedule', customer: 'Customer', start: '2026-10-01', dispatchTarget: '2026-12-28' });
    const m = svc.addMember(owner, p.id, { name: 'Staff', email: 'staff@example.test', role: 'staff' });
    svc.createTask(owner, p.id, { title: 'Late work', department: 'Assembly', type: 'Internal', assignee: m.user, due: '2026-10-01' });
    const before = svc.schedule(p.id).dispatch; svc.transition(owner, p.id, 'close'); at = '2026-10-25T04:30:00Z';
    assert.equal(svc.schedule(p.id).dispatch, before);
    svc.transition(owner, p.id, 'reopen'); assert.notEqual(svc.schedule(p.id).dispatch, before);
  } finally { store.close(); }
});
