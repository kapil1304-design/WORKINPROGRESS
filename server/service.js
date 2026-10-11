import { randomUUID } from 'node:crypto';

export class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const fail = (message, status) => { throw new AppError(message, status); };
export const departments = ['Mechanical', 'Design', 'Assembly', 'Procurement', 'Electrical Wiring', 'PLC Programming', 'Software Development', 'Installation', 'Stores and Material Control', 'Testing'];
export const stages = ['Planning', 'Design', 'Procurement', 'Assembly', 'Factory testing', 'Dispatch', 'Installation', 'Final acceptance'];
export const roles = ['pm', 'purchase', 'staff', 'vendor', 'service', 'customer'];
const states = ['Not started', 'In progress', 'Blocked', 'Submitted for verification', 'Completed'];
export function text(value, label, max = 4000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail(`${label} is required (maximum ${max} characters).`);
  return value.trim();
}
export function date(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '') || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail(`Invalid ${label}.`);
  return value;
}
export function email(value) {
  const result = text(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) fail('Invalid email.');
  return result;
}
function pick(value, list, label) { if (!list.includes(value)) fail(`Invalid ${label}.`); return value; }
function anniversary(iso) { const d = new Date(iso); d.setUTCFullYear(d.getUTCFullYear() + 1); return d.toISOString(); }
export function localClock(instant) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' }).formatToParts(new Date(instant)).map(p => [p.type, p.value]));
  return { day: `${parts.year}-${parts.month}-${parts.day}`, minute: Number(parts.hour) * 60 + Number(parts.minute), sunday: parts.weekday === 'Sun' };
}

export class Service {
  constructor(store, clock = () => new Date().toISOString()) { this.s = store; this.clock = clock; }
  now() { return this.clock(); }
  add(kind, data) { return this.s.put(kind, { id: randomUUID(), ...data }); }
  audit(actor, project, action, detail = {}) { this.add('audit', { actor: actor.id, project, action, detail, at: this.now() }); }
  bootstrap(ownerEmail, name = 'Business owner') {
    const existing = this.s.all('users').find(u => u.owner);
    if (existing) return existing;
    return this.add('users', { email: email(ownerEmail), name, owner: true, active: true, organization: 'Company', kind: 'internal' });
  }
  membership(actor, pid) { return this.s.all('members').find(m => m.project === pid && m.user === actor.id); }
  role(actor, pid) { return actor.owner ? 'owner' : this.membership(actor, pid)?.role; }
  isInternal(actor, pid) { return ['owner', 'pm', 'purchase', 'staff'].includes(this.role(actor, pid)); }
  access(actor, pid, open = false) {
    const p = this.s.get('projects', pid);
    if (!p || !actor.active || (!actor.owner && !this.membership(actor, pid))) fail('Project not found.', 404);
    if (open && p.closed) fail('Project is closed. Only the business owner can reopen it.', 409);
    return p;
  }
  allow(actor, pid, permitted) { if (!permitted.includes(this.role(actor, pid))) fail('This action is not permitted.', 403); }
  user(id) { const u = this.s.get('users', id); if (!u?.active) fail('Member not found.', 404); return u; }
  notify(pid, recipients, message, key = null) {
    for (const id of new Set(recipients)) {
      if (key && this.s.all('notifications').some(n => n.key === key && n.user === id)) continue;
      this.add('notifications', { project: pid, user: id, message, at: this.now(), read: false, resolved: false, key });
    }
  }
  recipients(pid, permitted) {
    return [...this.s.all('users').filter(u => u.owner && permitted.includes('owner')).map(u => u.id),
      ...this.s.all('members').filter(m => m.project === pid && permitted.includes(m.role)).map(m => m.user)].filter(id => this.s.get('users', id)?.active);
  }
  publicUser(u) { return { id: u.id, name: u.name, email: u.email, organization: u.organization, kind: u.kind, owner: !!u.owner, version: u.version ?? 1 }; }
  taskVisible(actor, t) {
    const role = this.role(actor, t.project);
    return !!role && (!['vendor', 'service'].includes(role) || t.assignee === actor.id);
  }
  task(actor, id, open = false) {
    const t = this.s.get('tasks', id);
    if (!t) fail('Task not found.', 404);
    this.access(actor, t.project, open);
    if (!this.taskVisible(actor, t)) fail('Task not found.', 404);
    return t;
  }
  canApprove(actor, r) {
    if (actor.id === r.initiator) return false;
    const role = this.role(actor, r.project);
    if (r.type === 'delivery') return role === 'owner';
    if (r.type === 'scope') return role === (r.initiatorRole === 'owner' ? 'pm' : 'owner');
    return ['owner', 'pm', 'purchase'].includes(role);
  }
  snapshot(actor) {
    const projects = this.s.all('projects').filter(p => actor.owner || this.membership(actor, p.id));
    const ids = new Set(projects.map(p => p.id));
    const tasks = this.s.all('tasks').filter(t => ids.has(t.project) && this.taskVisible(actor, t));
    const taskIds = new Set(tasks.map(t => t.id));
    const updates = this.s.all('updates').filter(u => ids.has(u.project) && (!u.task || taskIds.has(u.task)) && (this.isInternal(actor, u.project) || this.role(actor, u.project) === 'customer' || u.user === actor.id));
    const filteredTasks = tasks.map(t => this.role(actor, t.project) === 'customer' ? { id: t.id, project: t.project, title: t.customerTitle || `${t.department} activity`, department: t.department, due: t.due, baseline: t.baseline, forecast: t.forecast, status: t.status, verifiedAt: t.verifiedAt, version: t.version } : t);
    const filteredUpdates = updates.map(u => this.role(actor, u.project) === 'customer' ? { id: u.id, project: u.project, task: u.task, department: u.department, at: u.at, status: u.status } : u);
    const members = this.s.all('members').filter(m => ids.has(m.project) && this.isInternal(actor, m.project));
    const userIds = new Set(members.map(m => m.user));
    const users = this.s.all('users').filter(u => u.id === actor.id || (actor.owner || userIds.has(u.id)) && u.active).map(u => this.publicUser(u));
    const comments = this.s.all('comments').filter(c => ids.has(c.project) && this.audienceAllowed(actor, c.project, c.audience));
    const changes = this.s.all('changes').filter(r => ids.has(r.project) && (this.isInternal(actor, r.project) || this.role(actor, r.project) === 'customer' && r.status !== 'Pending' && ['delivery', 'scope'].includes(r.type))).map(r => this.role(actor, r.project) === 'customer' ? { id: r.id, project: r.project, type: r.type, status: r.status, proposedDate: r.proposedDate, decidedAt: r.decidedAt, acceptance: r.acceptance ?? 'Pending' } : { ...r, canApprove: this.canApprove(actor, r) });
    const attachments = this.s.all('attachments').filter(a => ids.has(a.project) && this.audienceAllowed(actor, a.project, a.audience)).map(({ path, uploader, ...a }) => a);
    const contacts = projects.flatMap(p => this.recipients(p.id, ['owner', 'pm', 'purchase']).map(id => ({ id, project: p.id, name: this.s.get('users', id)?.name }))).filter(c => this.role(actor, c.project) !== 'customer');
    return { me: this.publicUser(actor), projects: projects.map(p => ({ ...p, customer: ['vendor', 'service'].includes(this.role(actor, p.id)) ? undefined : p.customer, poNumber: ['vendor', 'service'].includes(this.role(actor, p.id)) ? undefined : p.poNumber, role: this.role(actor, p.id) })), tasks: filteredTasks, updates: filteredUpdates, members, users, contacts, comments: comments.map(c => !this.isInternal(actor, c.project) ? { ...c, user: undefined } : c), changes, attachments, notifications: this.s.all('notifications').filter(n => n.user === actor.id && ids.has(n.project)), departments: this.s.all('departments').map(d => d.name).length ? this.s.all('departments').map(d => d.name) : departments, stages };
  }
  createProject(actor, input) {
    if (!actor.owner) fail('Only the business owner creates projects.', 403);
    const start = input.start ? date(input.start, 'start date') : this.now().slice(0, 10);
    const poNumber = input.poNumber === undefined || input.poNumber === '' ? null : text(input.poNumber, 'PO number', 100);
    const p = this.add('projects', { name: text(input.name, 'Project name', 150), customer: text(input.customer, 'Customer reference', 150), poNumber, delivery: date(input.delivery, 'delivery date'), originalDelivery: input.delivery, start, retentionDue: anniversary(`${start}T00:00:00Z`), stage: 'Planning', closed: false, createdAt: this.now(), activeSince: this.now(), version: 1 });
    this.audit(actor, p.id, 'project.created');
    return p;
  }
  addMember(actor, pid, input) {
    this.access(actor, pid, true); this.allow(actor, pid, ['owner']);
    const address = email(input.email), role = pick(input.role, roles, 'role');
    const memberDepartments = this.memberDepartments(input.departments, role);
    const itemName = this.memberItemName(input.itemName, role);
    let u = this.s.all('users').find(u => u.email === address);
    if (u?.owner) fail('Owner already has access.');
    const kind = ['vendor', 'service', 'customer'].includes(role) ? role : 'internal';
    if (u && u.kind !== kind) fail('Existing member type differs. Use an account of the correct participant type.');
    if (!u) u = this.add('users', { email: address, name: text(input.name, 'Name', 100), organization: text(input.organization || 'Company', 'Organization', 150), kind, active: true, owner: false });
    if (this.membership(u, pid)) fail('Member already belongs to this project.', 409);
    const m = this.add('members', { project: pid, user: u.id, role, departments: memberDepartments, itemName, version: 1, joinedAt: this.now() });
    this.audit(actor, pid, 'member.added', { member: u.id, role });
    this.notify(pid, [u.id], 'You were added to a project.'); return m;
  }
  memberDepartments(value, role) {
    if (value === undefined) value = [];
    if (!Array.isArray(value) || value.some(d => typeof d !== 'string')) fail('Departments must be a list.');
    if (['vendor', 'service', 'customer'].includes(role)) return [];
    const allowed = this.s.all('departments').length ? this.s.all('departments').map(d => d.name) : departments;
    return [...new Set(value.map(d => pick(d, allowed, 'department')))];
  }
  memberItemName(value, role) {
    if (role !== 'vendor' || value == null || value === '') return null;
    return text(value, 'Item name', 200);
  }
  editMember(actor, pid, id, input) {
    this.access(actor, pid, true); this.allow(actor, pid, ['owner']);
    const m = this.s.get('members', id);
    if (!m || m.project !== pid) fail('Membership not found.', 404);
    const u = this.user(m.user);
    if (input.version !== (m.version ?? 1) || input.userVersion !== (u.version ?? 1)) fail('Member details changed. Refresh and try again.', 409);
    const address = email(input.email), role = pick(input.role, roles, 'role');
    if (this.s.all('users').some(other => other.email === address && other.id !== u.id)) fail('This email already belongs to another member.', 409);
    const kind = ['vendor', 'service', 'customer'].includes(role) ? role : 'internal';
    if (kind !== u.kind && (this.s.all('members').some(other => other.user === u.id && other.id !== id) || this.s.all('tasks').some(t => t.assignee === u.id))) fail('Participant type cannot change while this member has other project memberships or assigned tasks.');
    const selectedDepartments = this.memberDepartments(input.departments, role);
    const itemName = this.memberItemName(input.itemName === undefined ? m.itemName : input.itemName, role);
    const before = { name: u.name, email: u.email, organization: u.organization, role: m.role, departments: m.departments ?? [], itemName: m.itemName ?? null };
    const oldEmail = u.email;
    u.name = text(input.name, 'Name', 100); u.email = address; u.organization = text(input.organization, 'Organization', 150); u.kind = kind; u.version = (u.version ?? 1) + 1;
    m.role = role; m.departments = selectedDepartments; m.itemName = itemName; m.version = (m.version ?? 1) + 1;
    this.s.put('users', u); this.s.put('members', m);
    if (oldEmail !== address) {
      this.s.remove('otps', oldEmail); this.s.remove('otps', address);
      for (const session of this.s.all('sessions').filter(s => s.user === u.id)) this.s.remove('sessions', session.id);
    }
    this.audit(actor, pid, 'member.edited', { member: u.id, before, after: { name: u.name, email: u.email, organization: u.organization, role: m.role, departments: m.departments, itemName: m.itemName } });
    return m;
  }
  removeMember(actor, pid, id) {
    this.access(actor, pid, true); this.allow(actor, pid, ['owner']);
    const m = this.s.get('members', id);
    if (!m || m.project !== pid) fail('Membership not found.', 404);
    this.s.remove('members', id);
    for (const n of this.s.all('notifications').filter(n => n.project === pid && n.user === m.user)) this.s.remove('notifications', n.id);
    this.audit(actor, pid, 'member.removed', { member: m.user });
  }
  transition(actor, pid, action, input = {}) {
    const p = this.access(actor, pid);
    if (action === 'reopen') { this.allow(actor, pid, ['owner']); if (!p.closed) fail('Project is already open.', 409); p.closed = false; p.activeSince = this.now(); p.reopenedAt = this.now(); }
    else { this.access(actor, pid, true); this.allow(actor, pid, ['owner', 'pm']); if (action === 'close') { p.closed = true; p.closedAt = this.now(); for (const n of this.s.all('notifications').filter(n => n.project === pid)) this.s.put('notifications', { ...n, resolved: true }); } else if (action === 'stage') p.stage = pick(input.stage, stages, 'stage'); else fail('Unknown transition.'); }
    p.version++; this.s.put('projects', p); this.audit(actor, pid, `project.${action}`); return p;
  }
  createTask(actor, pid, input) {
    this.access(actor, pid, true); this.allow(actor, pid, ['owner', 'pm', 'purchase']);
    const assignee = this.user(input.assignee);
    if ((!assignee.owner && !this.membership(assignee, pid)) || this.role(assignee, pid) === 'customer') fail('Assignee must be an execution member of this project.');
    const department = pick(input.department, this.snapshot(actor).departments, 'department');
    const dependencies = Array.isArray(input.dependencies) ? input.dependencies : [];
    for (const id of dependencies) { const t = this.task(actor, id); if (t.project !== pid) fail('Dependency must belong to this project.'); }
    const t = this.add('tasks', { project: pid, title: text(input.title, 'Task title', 200), customerTitle: input.customerTitle ? text(input.customerTitle, 'Customer label', 200) : null, department, assignee: assignee.id, type: pick(input.type, ['Internal', 'Purchase', 'Service'], 'work type'), scope: text(input.scope || input.title, 'Scope'), criteria: text(input.criteria || 'Physical verification by authorized verifier', 'Acceptance criteria'), due: date(input.due, 'target date'), baseline: input.due, forecast: input.due, status: 'Not started', dependencies, acknowledgement: 'Pending', createdAt: this.now(), version: 1, requiredQuantity: input.type === 'Purchase' ? this.quantity(input.requiredQuantity || 1) : null, dispatched: 0, received: 0, accepted: 0, rejected: 0 });
    this.audit(actor, pid, 'task.created', { task: t.id }); this.notify(pid, [assignee.id], 'A task has been assigned to you.'); return t;
  }
  version(item, input) { if (!Number.isInteger(input.version) || input.version !== item.version) fail('This record changed. Refresh and try again.', 409); }
  update(actor, pid, input, key) {
    this.access(actor, pid, true); this.allow(actor, pid, ['owner', 'pm', 'purchase', 'staff', 'vendor', 'service']);
    if (key && this.s.all('updates').some(u => u.project === pid && u.user === actor.id && u.key === key)) return this.s.all('updates').find(u => u.project === pid && u.user === actor.id && u.key === key);
    let t = null;
    if (input.task) { t = this.task(actor, input.task, true); if (t.project !== pid) fail('Task not found.', 404); if (t.assignee !== actor.id) fail('Only the assigned member submits task progress.', 403); this.version(t, input); if (t.status === 'Completed') fail('Verified task must be reopened by a verifier first.', 409); }
    const status = pick(input.status || 'In progress', states.filter(s => s !== 'Completed'), 'status');
    const completed = text(input.completed, 'Completed work'), pending = text(input.pending, 'Pending work'), nextAction = text(input.nextAction, 'Next action');
    const forecast = input.forecast ? date(input.forecast, 'forecast') : t?.forecast ?? null;
    if ((status === 'Blocked' || forecast && t && forecast > t.due || input.noProgress) && !input.reason?.trim()) fail('A blocker, no progress or late forecast requires a reason.');
    if (status === 'Blocked' && !input.resolver) fail('Blocked work needs a resolver.');
    if (input.resolver && !this.recipients(pid, ['owner', 'pm', 'purchase', 'staff']).includes(input.resolver)) fail('Resolver must be an internal project member.');
    if (t && status === 'Submitted for verification' && t.dependencies.some(id => this.s.get('tasks', id)?.status !== 'Completed')) fail('Dependencies must be verified before submission.');
    const u = this.add('updates', { project: pid, user: actor.id, task: t?.id ?? null, department: t?.department ?? 'Project', status, completed, pending, nextAction, forecast, reason: input.reason || '', resolver: input.resolver || null, at: this.now(), key: key || null });
    if (t) { t.status = status; t.forecast = forecast; t.version++; t.lastUpdate = u.at; this.s.put('tasks', t); }
    for (const n of this.s.all('notifications').filter(n => n.project === pid && n.subject === actor.id && n.category === 'missing-update')) this.s.put('notifications', { ...n, resolved: true });
    for (const r of this.s.all('statusRequests').filter(r => r.project === pid && r.target === actor.id && !r.resolved)) this.s.put('statusRequests', { ...r, resolved: true, response: u.id });
    this.audit(actor, pid, 'status.updated', { update: u.id }); return u;
  }
  verify(actor, id, input) {
    const t = this.task(actor, id, true); this.allow(actor, t.project, t.type === 'Purchase' ? ['purchase'] : ['owner', 'pm']); this.version(t, input);
    if (input.action === 'reopen') { if (t.status !== 'Completed') fail('Task is not completed.'); t.status = 'In progress'; }
    else { if (t.status !== 'Submitted for verification') fail('Task is not awaiting verification.', 409); if (input.action === 'return') { text(input.reason, 'Return reason'); t.status = 'In progress'; } else { if (input.physicallyChecked !== true) fail('Confirm physical verification.'); if (t.type === 'Purchase' && t.accepted < t.requiredQuantity) fail('Purchase completion requires the full accepted usable quantity.'); t.status = 'Completed'; t.verifiedBy = actor.id; t.verifiedAt = this.now(); } }
    t.version++; this.s.put('tasks', t); this.audit(actor, t.project, `task.${input.action || 'verified'}`, { task: id, reason: input.reason || null }); return t;
  }
  acknowledge(actor, id, input) {
    const t = this.task(actor, id, true); if (t.assignee !== actor.id) fail('Only the assignee acknowledges.', 403); this.version(t, input);
    t.acknowledgement = pick(input.decision, ['Accepted', 'Disputed'], 'acknowledgement'); if (input.decision === 'Disputed') text(input.reason, 'Dispute reason'); t.version++; this.s.put('tasks', t); this.audit(actor, t.project, 'task.acknowledged', { task: id, decision: input.decision, reason: input.reason || null }); return t;
  }
  change(actor, pid, input) {
    this.access(actor, pid, true); const type = pick(input.type, ['date', 'delivery', 'scope'], 'change type');
    this.allow(actor, pid, type === 'delivery' ? ['pm'] : type === 'scope' ? ['owner', 'pm'] : ['owner', 'pm', 'purchase']);
    const t = type === 'date' ? this.task(actor, input.task, true) : null;
    if (t && t.project !== pid) fail('Task not found.', 404);
    const proposedDate = type !== 'scope' ? date(input.proposedDate, 'proposed date') : null;
    const r = this.add('changes', { project: pid, type, task: t?.id ?? null, targetVersion: t?.version ?? this.s.get('projects', pid).version, proposedDate, reason: text(input.reason, 'Reason'), initiator: actor.id, initiatorRole: this.role(actor, pid), status: 'Pending', at: this.now(), deadline: type === 'scope' ? new Date(Date.parse(this.now()) + 7 * 86400000).toISOString() : null, assignedTasks: [], acceptance: 'Pending' });
    this.notify(pid, this.recipients(pid, ['owner', 'pm', 'purchase']).filter(id => id !== actor.id), 'A change needs an authorized decision.'); this.audit(actor, pid, 'change.requested', { change: r.id }); return r;
  }
  decide(actor, id, input) {
    const r = this.s.get('changes', id); if (!r) fail('Change not found.', 404);
    this.access(actor, r.project, true); if (!this.canApprove(actor, r)) fail('A different authorized person must approve this request.', 403);
    if (r.status !== 'Pending') fail('Change already decided.', 409);
    const decision = pick(input.decision, ['Approved', 'Rejected'], 'decision');
    if (decision === 'Approved') {
      if (r.type === 'date') { const t = this.task(actor, r.task, true); if (t.version !== r.targetVersion) fail('Task changed since this request. Submit a new request.', 409); t.due = r.proposedDate; t.version++; this.s.put('tasks', t); }
      if (r.type === 'delivery') { const p = this.access(actor, r.project, true); if (p.version !== r.targetVersion) fail('Project changed since this request. Submit a new request.', 409); p.delivery = r.proposedDate; p.version++; this.s.put('projects', p); }
      if (r.type === 'scope') { if (!Array.isArray(input.tasks) || input.tasks.length < 1) fail('Assign accepted additional scope to the team with at least one task.'); r.assignedTasks = input.tasks.map(t => this.createTask(actor, r.project, t).id); }
    }
    r.status = decision; r.decidedBy = actor.id; r.decidedAt = this.now(); r.decisionReason = input.reason || '';
    if (r.type !== 'date') { this.notify(r.project, this.recipients(r.project, ['customer']), `${r.type === 'delivery' ? 'Delivery date' : 'Additional scope'} change ${decision.toLowerCase()}.${r.proposedDate && decision === 'Approved' ? ` Revised date: ${r.proposedDate}.` : ''}`); r.notifiedAt = this.now(); }
    this.s.put('changes', r); this.audit(actor, r.project, 'change.decided', { change: id, decision }); return r;
  }
  accept(actor, id, input) {
    const r = this.s.get('changes', id); if (!r) fail('Change not found.', 404); this.access(actor, r.project, true); this.allow(actor, r.project, ['customer']);
    if (r.status !== 'Approved' || !['delivery', 'scope'].includes(r.type)) fail('No approved revision to respond to.');
    r.acceptance = pick(input.decision, ['Accepted', 'Rejected'], 'response'); r.customerRespondedAt = this.now(); r.customerRespondedBy = actor.id; this.s.put('changes', r);
    this.notify(r.project, this.recipients(r.project, ['owner', 'pm']), `Customer ${r.acceptance.toLowerCase()} a revision. Work remains active.`); this.audit(actor, r.project, 'customer.responded', { change: id }); return { acceptance: r.acceptance };
  }
  audienceAllowed(actor, pid, audience) {
    const role = this.role(actor, pid);
    if (this.isInternal(actor, pid)) return true;
    if (role === 'customer') return audience === 'customer';
    return ['vendor', 'service'].includes(role) && audience === `member:${actor.id}`;
  }
  validateAudience(actor, pid, audience) {
    if (audience !== 'internal' && audience !== 'customer' && !/^member:[a-zA-Z0-9-]+$/.test(audience || '')) fail('Invalid audience.');
    if (audience.startsWith('member:')) { const target = this.user(audience.slice(7)); if (!this.membership(target, pid) || !['vendor', 'service'].includes(this.role(target, pid))) fail('Invalid external audience.'); }
    if (!this.audienceAllowed(actor, pid, audience)) fail('Audience not permitted.', 403);
    return audience;
  }
  comment(actor, pid, input) {
    this.access(actor, pid, true); const audience = this.validateAudience(actor, pid, input.audience);
    const c = this.add('comments', { project: pid, user: actor.id, audience, text: text(input.text, 'Comment'), at: this.now() }); this.audit(actor, pid, 'comment.created', { comment: c.id }); return c;
  }
  requestStatus(actor, pid, input) {
    this.access(actor, pid, true); this.allow(actor, pid, ['owner', 'pm', 'purchase', 'staff', 'vendor', 'service']);
    const target = this.user(input.target); const role = this.role(target, pid);
    if (!role || role === 'customer') fail('Choose an execution member.');
    if (!this.isInternal(actor, pid) && target.id !== actor.id && !['owner', 'pm', 'purchase'].includes(role)) fail('Unrelated member is not accessible.', 403);
    const r = this.add('statusRequests', { project: pid, user: actor.id, target: target.id, reason: text(input.reason, 'Request'), at: this.now(), resolved: false });
    this.notify(pid, [target.id], 'A project member requested a fresh status update.'); this.audit(actor, pid, 'status.requested', { request: r.id }); return r;
  }
  quantity(value) { const n = Number(value); if (!Number.isFinite(n) || n <= 0 || n > 1e9) fail('Quantity must be positive.'); return n; }
  supply(actor, id, input) {
    const t = this.task(actor, id, true); if (t.type !== 'Purchase') fail('Not a purchase task.'); this.version(t, input);
    const action = pick(input.action, ['dispatch', 'receipt', 'inspect'], 'supply event');
    if (action === 'dispatch') { if (t.assignee !== actor.id && !['owner', 'purchase'].includes(this.role(actor, t.project))) fail('Dispatch not permitted.', 403); t.dispatched += this.quantity(input.quantity); if (t.dispatched > t.requiredQuantity) fail('Dispatch exceeds required quantity.'); }
    else { this.allow(actor, t.project, ['owner', 'purchase']); if (action === 'receipt') { t.received += this.quantity(input.quantity); if (t.received > t.dispatched) fail('Receipt exceeds dispatched quantity.'); } else { const quantity = this.quantity(input.quantity); if (input.result === 'accepted') t.accepted += quantity; else if (input.result === 'rejected') t.rejected += quantity; else fail('Choose accepted or rejected.'); if (t.accepted + t.rejected > t.received) fail('Inspection allocation exceeds received quantity.'); } }
    t.version++; this.s.put('tasks', t); this.audit(actor, t.project, `supply.${action}`, { task: id, quantity: input.quantity, result: input.result }); return t;
  }
  addDepartment(actor, input) { if (!actor.owner) fail('Owner only.', 403); const name = text(input.name, 'Department', 100); if (this.snapshot(actor).departments.includes(name)) fail('Department exists.', 409); if (!this.s.all('departments').length) departments.forEach(name => this.add('departments', { name })); return this.add('departments', { name }); }
  reminders(at = this.now()) {
    const local = localClock(at); if (local.sunday || local.minute < 540 || local.minute > 1170) return;
    // The previous working day's evening window ends after notification hours.
    // Carry unresolved obligations forward without delivering overnight/Sunday.
    let previous = new Date(`${local.day}T00:00:00Z`); previous.setUTCDate(previous.getUTCDate() - 1);
    if (previous.getUTCDay() === 0) previous.setUTCDate(previous.getUTCDate() - 1);
    const previousDay = previous.toISOString().slice(0, 10);
    for (const p of this.s.all('projects').filter(p => !p.closed)) {
      const members = this.s.all('members').filter(m => m.project === p.id && m.role !== 'customer');
      const owner = this.s.all('users').find(u => u.owner && u.active); if (owner) members.push({ user: owner.id, joinedAt: p.createdAt });
      for (const m of members) {
        if (!this.s.get('users', m.user)?.active) continue;
        for (const [day, start, end] of [...[[540, 660], [780, 900], [1080, 1200]].map(([a, b]) => [local.day, a, b]), ...[[540, 660], [780, 900], [1080, 1200]].map(([a, b]) => [previousDay, a, b])]) {
          if (day === local.day && local.minute <= end) continue;
          const since = localClock(m.joinedAt > p.activeSince ? m.joinedAt : p.activeSince);
          if (since.day === day && since.minute > start || since.day > day) continue;
          if (this.s.all('updates').some(u => u.project === p.id && u.user === m.user && (localClock(u.at).day === day && localClock(u.at).minute >= start || localClock(u.at).day > day))) continue;
          const bucket = Math.floor((local.minute - (day === local.day ? end : 540)) / 120); const key = `missing:${p.id}:${m.user}:${day}:${start}:${local.day}:${bucket}`;
          this.notify(p.id, [m.user, ...this.recipients(p.id, ['owner', 'pm'])], 'A scheduled status update is missing. Work remains available.', key);
          for (const n of this.s.all('notifications').filter(n => n.key === key)) this.s.put('notifications', { ...n, category: 'missing-update', subject: m.user, scheduledDay: day });
        }
      }
      for (const r of this.s.all('changes').filter(r => r.project === p.id && r.type === 'scope' && r.status === 'Pending' && r.deadline < at)) this.notify(p.id, this.recipients(p.id, ['owner', 'pm']), 'Additional scope is past its seven-calendar-day handling deadline.', `scope-overdue:${r.id}:${local.day}`);
    }
  }
}
