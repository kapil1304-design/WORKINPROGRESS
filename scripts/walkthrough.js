// Visible, deliberately paced local UI acceptance walkthrough. Synthetic data only.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

if (process.env.MAIL_MODE !== 'local' || process.env.NODE_ENV === 'production') throw Error('Walkthrough requires the local development mailbox.');
const origin = process.env.APP_ORIGIN || 'http://127.0.0.1:3000';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin)) throw Error('Walkthrough is limited to a local app.');
const output = resolve('runtime/walkthrough'); mkdirSync(output, { recursive: true });
const run = Date.now(), projectName = `WATCH TEST ${run}`, results = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const roles = ['pm', 'purchase', 'staff', 'vendor', 'service', 'customer'];
const people = Object.fromEntries(roles.map(role => [role, { email: `watch-${role}-${run}@example.test`, name: `Watch ${role}`, organization: role === 'vendor' ? 'Watch Supplier' : 'Watch Company' }]));
const ownerEmail = process.env.OWNER_EMAIL;
if (!ownerEmail) throw Error('OWNER_EMAIL must be configured.');
let browser;
try { await fetch('http://127.0.0.1:9340/json'); }
catch {
  browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--remote-debugging-port=9340', `--user-data-dir=${join(output, `profile-${run}`)}`, '--no-first-run', '--no-default-browser-check', '--start-maximized', '--new-window', origin], { windowsHide: false, stdio: 'ignore' });
  browser.on('error', e => console.error('Browser launch failed:', e.message));
}
let socket, serial = 0, pid;
const pending = new Map();
async function connect() {
  let target;
  for (let i = 0; i < 100; i++) {
    try { target = (await (await fetch('http://127.0.0.1:9340/json')).json()).find(t => t.type === 'page'); if (target) break; } catch {}
    await pause(200);
  }
  if (!target) throw Error('Visible browser did not start.');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => { const m = JSON.parse(event.data); if (pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); } };
}
function command(method, params = {}) { return new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); }); }
async function evaluate(expression) { const r = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.text); return r.result.value; }
async function wait(selector) {
  for (let i = 0; i < 100; i++) { if (await evaluate(`!!document.querySelector(${JSON.stringify(selector)})?.getClientRects().length`)) return; await pause(100); }
  throw Error(`Visible control not found: ${selector}`);
}
async function click(selector) {
  await wait(selector);
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'})`);
  await pause(500);
  await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.focus();e.click();})()`);
  await pause(1700);
}
async function fill(selector, value, slow = true) {
  await wait(selector); await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'});document.querySelector(${JSON.stringify(selector)}).focus()`);
  const type = await evaluate(`document.querySelector(${JSON.stringify(selector)}).type`);
  const set = value => evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.value=${JSON.stringify(String(value))};e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  if (slow && ['text', 'email', 'textarea'].includes(type)) { await set(''); for (let i = 1; i <= String(value).length; i++) { await set(String(value).slice(0, i)); await pause(65); } } else await set(value);
  await pause(700);
}
async function field(name, value) { return fill(`#modal-form [name="${name}"]`, value); }
async function check(name, value) { await click(`#modal-form [name="${name}"]${value ? `[value="${value}"]` : ''}`); }
async function save() {
  await click('#modal-save');
  const error = await evaluate('document.getElementById("modal-error").textContent'); if (error) throw Error(`Form rejected: ${error}`);
  if (await evaluate('document.getElementById("dialog").open')) throw Error('Form remained open after save.');
}
async function state() { return evaluate('fetch("/api/state").then(r=>r.json())'); }
async function assert(condition, label) { if (!condition) throw Error(label); }
async function step(label, action) { console.log(`WATCH: ${label}`); await pause(1300); await action(); results.push({ step: label, passed: true }); console.log(`PASS: ${label}`); }
async function login(role) {
  if (await evaluate('!document.getElementById("workspace").hidden')) await click('#logout');
  const address = role === 'owner' ? ownerEmail : people[role].email;
  await fill('#email', address); await click('#email-form button');
  const message = await evaluate('document.getElementById("login-message").textContent'); if (!message.includes('Local development')) throw Error('Expected local mailbox login.');
  const file = join(resolve(process.env.DATA_DIR || 'runtime'), 'mailbox', createHash('sha256').update(address).digest('hex').slice(0, 16) + '.txt');
  const code = /login code: (\d{6})/.exec(readFileSync(file, 'utf8'))?.[1]; if (!code) throw Error('Local code not found.');
  await fill('#code', code, false); await click('#code-form button'); await wait('#workspace');
  const s = await state(); await assert(s.me.email === address, 'Wrong signed-in member.');
}
async function openProject() { await click('[data-view="projects"]'); await click(`[data-project="${pid}"]`); }
async function taskInput(title, role, type = 'Internal', quantity = '1') {
  const s = await state(), person = s.users.find(u => u.email === people[role].email);
  await field('assignee', person.id);
  await assert((await evaluate('document.getElementById("assignee-summary").textContent')).includes(person.name), 'Selected assignee summary missing.');
  await field('title', title); await field('customerTitle', title); await field('department', type === 'Purchase' ? 'Procurement' : type === 'Service' ? 'Installation' : 'Assembly');
  await field('type', type); await field('due', '2026-12-15'); await field('scope', `Complete ${title.toLowerCase()} for the test machine.`); await field('criteria', 'Test evidence and physical confirmation by authorized verifier.'); await field('requiredQuantity', quantity);
}
async function taskByTitle(title) { return (await state()).tasks.find(t => t.project === pid && t.title === title); }
async function updateTask(title) {
  await openProject(); let t = await taskByTitle(title);
  if (t.acknowledgement !== 'Accepted') { await click(`[data-ack="${t.id}"]`); await field('decision', 'Accepted'); await field('reason', 'Commitment confirmed for the test.'); await save(); }
  t = await taskByTitle(title); await click(`[data-update="${t.id}"]`);
  await field('status', 'Submitted for verification'); await field('completed', 'Test work and checks completed.'); await field('pending', 'Authorized verification pending.'); await field('nextAction', 'Verifier to inspect and accept.'); await field('forecast', '2026-12-15'); await field('reason', 'No blockers. Synthetic walkthrough evidence.'); await field('resolver', ''); await save();
}
async function verifyTask(title) {
  await openProject(); const t = await taskByTitle(title); await click(`[data-verify="${t.id}"]`); await field('action', 'verify'); await check('physicallyChecked'); await field('reason', 'Simulated verification for synthetic test only.'); await save();
  await assert((await taskByTitle(title)).status === 'Completed', 'Task was not verified.');
}
async function supply(action, quantity = '2') {
  await openProject(); const t = await taskByTitle('Purchase motor'); await click(`[data-supply="${t.id}"]`); await field('action', action); await field('quantity', quantity); await field('result', 'accepted'); await save();
}
async function screenshot(name) { const r = await command('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(output, `${run}-${name}.png`), Buffer.from(r.data, 'base64')); }

try {
  await connect(); await command('Page.navigate', { url: origin }); await pause(2500);
  await step('Owner signs in with local email OTP', () => login('owner'));
  await step('Create project with all fields including PO number', async () => {
    await click('#new-project'); await field('name', projectName); await field('customer', 'Watch Customer / Machine order'); await field('poNumber', `WATCH-PO-${run}`); await field('start', '2026-10-11'); await field('dispatchTarget', '2026-12-28'); await save();
    pid = (await state()).projects.find(p => p.name === projectName).id; await openProject();
  });
  for (const role of roles) await step(`Add ${role} member and fill role-specific fields`, async () => {
    await click('#add-member'); await field('name', people[role].name); await field('email', people[role].email); await field('organization', people[role].organization); await field('role', role);
    if (['pm', 'purchase', 'staff'].includes(role)) await check('departments', role === 'purchase' ? 'Procurement' : role === 'staff' ? 'Assembly' : 'Mechanical');
    if (role === 'staff') await check('departments', 'Testing'); if (role === 'vendor') await field('itemName', 'Motor'); await save();
  });
  await step('Edit an added member and retain selected departments', async () => {
    const s = await state(), uid = s.users.find(u => u.email === people.staff.email).id, m = s.members.find(m => m.project === pid && m.user === uid);
    await evaluate(`document.querySelector('[data-remove="${m.id}"]').previousElementSibling.click()`); await pause(2000); await field('name', 'Watch Assembly Technician'); await save(); people.staff.name = 'Watch Assembly Technician';
  });
  for (const [title, role, type, qty] of [['Assemble machine', 'staff', 'Internal', '1'], ['Purchase motor', 'vendor', 'Purchase', '2'], ['Install machine', 'service', 'Service', '1']]) await step(`Assign ${title} explicitly to the added ${role} member`, async () => {
    await click('#new-task'); await assert(await evaluate('document.querySelector("#modal-form [name=assignee]").value === ""'), 'Assignee was selected automatically.');
    await taskInput(title, role, type, qty); await evaluate('document.getElementById("dialog").scrollTop=0'); await pause(1700); await screenshot(`assign-${role}`); await save();
    const t = await taskByTitle(title), s = await state(); await assert(t.assignee === s.users.find(u => u.email === people[role].email).id, 'Saved task recipient is incorrect.');
  });
  await step('Request status from the assigned technician', async () => { await click('#request-status'); const s = await state(); await field('target', s.users.find(u => u.email === people.staff.email).id); await field('reason', 'Please report assembly progress.'); await save(); });
  await step('Write a customer-shared multilingual comment', async () => { await click('#comment'); await field('audience', 'customer'); await field('text', 'Test project progress shared. काम जारी है।'); await save(); });
  await step('Request task date change as owner', async () => { const t = await taskByTitle('Assemble machine'); await click(`[data-date="${t.id}"]`); await field('proposedDate', '2026-12-16'); await field('reason', 'One extra day for synthetic test assembly.'); await save(); });
  await step('Purchase manager approves another person’s date request', async () => { await login('purchase'); await click('[data-view="approvals"]'); const r = (await state()).changes.find(r => r.project === pid && r.type === 'date' && r.status === 'Pending'); await click(`[data-decide="${r.id}"]`); await field('decision', 'Approved'); await field('reason', 'Test recovery plan accepted.'); await save(); });
  await step('Owner requests additional scope', async () => { await login('owner'); await openProject(); await click('#scope'); await field('reason', 'Add final machine test to the synthetic project.'); await save(); });
  await step('Project manager approves scope and allocates it to a selected member', async () => { await login('pm'); await click('[data-view="approvals"]'); const r = (await state()).changes.find(r => r.project === pid && r.type === 'scope' && r.status === 'Pending'); await click(`[data-decide="${r.id}"]`); await field('decision', 'Approved'); await field('reason', 'Allocate accepted test work.'); await taskInput('Final machine test', 'staff'); await save(); });
  await step('Project manager initiates a customer delivery revision', async () => { await openProject(); await click('#delivery'); await field('proposedDate', '2026-12-30'); await field('reason', 'Additional test scope affects the forecast delivery.'); await save(); });
  await step('Owner approves delivery revision and customer is notified', async () => { await login('owner'); await click('[data-view="approvals"]'); const r = (await state()).changes.find(r => r.project === pid && ['delivery', 'dispatch'].includes(r.type) && r.status === 'Pending'); await click(`[data-decide="${r.id}"]`); await field('decision', 'Approved'); await field('reason', 'Approved revised test delivery.'); await save(); });
  await step('Technician acknowledges and submits assembly completion', async () => { await login('staff'); await updateTask('Assemble machine'); });
  await step('Technician submits the additional final-test work', () => updateTask('Final machine test'));
  await step('Project manager verifies assembly and additional test work', async () => { await login('pm'); await verifyTask('Assemble machine'); await verifyTask('Final machine test'); });
  await step('Vendor sees only its assigned work and records dispatch', async () => { await login('vendor'); const s = await state(); await assert(s.tasks.filter(t => t.project === pid).every(t => t.assignee === s.me.id), 'Vendor sees unrelated tasks.'); await supply('dispatch'); });
  await step('Vendor submits purchase completion for verification', () => updateTask('Purchase motor'));
  await step('Purchase manager records receipt, accepted quantity, and verifies purchase', async () => { await login('purchase'); await supply('receipt'); await supply('inspect'); await verifyTask('Purchase motor'); });
  await step('Service provider submits installation work', async () => { await login('service'); await updateTask('Install machine'); });
  await step('Project manager verifies installation', async () => { await login('pm'); await verifyTask('Install machine'); });
  await step('Customer views progress and responds to scope and delivery revisions', async () => {
    await login('customer'); const s = await state(); await assert(s.tasks.filter(t => t.project === pid).every(t => !t.assignee), 'Customer identity filtering failed.');
    await click('[data-view="approvals"]'); for (const r of s.changes.filter(r => r.project === pid && r.status === 'Approved')) { await click(`[data-respond="${r.id}"]`); await field('decision', 'Accepted'); await save(); }
    await openProject(); await click('#comment'); await field('audience', 'customer'); await field('text', 'Test acceptance noted. धन्यवाद।'); await save();
  });
  await step('Customer attaches an optional PDF acceptance document', async () => {
    const file = join(output, `${run}-acceptance.pdf`);
    const content = 'BT /F1 12 Tf 50 750 Td (Synthetic walkthrough acceptance document) Tj ET';
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
    let pdf = '%PDF-1.4\n', offsets = [0];
    objects.forEach((object, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; });
    const xref = Buffer.byteLength(pdf); pdf += 'xref\n0 6\n0000000000 65535 f \n' + offsets.slice(1).map(n => String(n).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`; writeFileSync(file, pdf);
    await click('#upload'); await field('audience', 'customer'); const doc = await command('DOM.getDocument'); const input = await command('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '#modal-form input[type=file]' }); await command('DOM.setFileInputFiles', { nodeId: input.nodeId, files: [file] }); await pause(2500); await save();
  });
  await step('Owner advances stages through final acceptance', async () => {
    await login('owner'); await openProject(); await click('#milestone-settings'); await field('pdiDispatchDays', '7');
    if (!await evaluate('document.querySelector("[name=planningComplete]").checked')) await check('planningComplete');
    await save();
    for (const stage of (await state()).stages.slice(1)) {
      await click('#stage'); await field('stage', stage); await save();
      if (stage === 'Pre-dispatch inspection') { await click('#complete-pdi'); await field('date', new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })); await check('inspected'); await save(); }
    }
  });
  await step('Close the project and verify work controls stop', async () => { await click('#close'); await save(); await assert(!await evaluate('!!document.getElementById("new-task")'), 'Closed project still allows assignment.'); });
  await step('Only owner reopens at the last closing stage', async () => { await login('pm'); await openProject(); await assert(!await evaluate('!!document.getElementById("reopen")'), 'Manager can reopen.'); await login('owner'); await openProject(); await click('#reopen'); await save(); await assert((await state()).projects.find(p => p.id === pid).stage === 'Final acceptance', 'Reopening reset the stage.'); });
  await step('Finish with all test tasks verified and close the test project', async () => { const s = await state(); await assert(s.tasks.filter(t => t.project === pid).every(t => t.status === 'Completed'), 'Some tasks are not completed.'); await click('#close'); await save(); await screenshot('completed-project'); });
  console.log(`COMPLETE: ${results.length} visible workflow checks passed.`);
} catch (error) {
  console.error('WALKTHROUGH FAILED:', error.message);
  results.push({ passed: false, error: error.message });
  if (socket) try { await screenshot('failure'); } catch {}
  process.exitCode = 1;
} finally {
  writeFileSync(join(output, `${run}-results.json`), JSON.stringify({ projectName, projectId: pid, checks: results }, null, 2));
  socket?.close();
  // Deliberately leave the visible browser open for the user to inspect.
  browser?.unref();
}
