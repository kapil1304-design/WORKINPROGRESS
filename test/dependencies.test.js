import test from 'node:test';
import assert from 'node:assert/strict';
import { milestoneForecast } from '../server/schedule.js';
import { Store } from '../server/store.js';
import { Service } from '../server/service.js';

const now='2026-10-11T04:30:00Z';
const plan={start:'2026-10-01',delivery:'2026-12-24',dispatchTarget:'2026-12-21',pdiDispatchDays:7,planningComplete:true};
const task=(id,startDate,durationDays,dependencies=[],extra={})=>({id,startDate,durationDays,due:new Date(Date.parse(startDate)+(durationDays-1)*86400000).toISOString().slice(0,10),dependencies,phase:'prePdi',status:'Not started',...extra});
const branch=()=>[task('2','2026-12-01',10),task('4','2026-12-01',10),task('5','2026-12-11',3,['2','4']),task('parallel','2026-12-01',5)];

test('Two prerequisites run in parallel; successor waits for the latest finish',()=>{
  const tasks=branch();tasks[1].lastUpdate=now;tasks[1].forecast='2026-12-13';
  const m=milestoneForecast(plan,tasks,now);
  assert.equal(m.taskSchedules['2'].startDate,'2026-12-01');assert.equal(m.taskSchedules.parallel.finishDate,'2026-12-05');
  assert.equal(m.taskSchedules['5'].startDate,'2026-12-14');assert.equal(m.taskSchedules['5'].finishDate,'2026-12-16');
  assert.equal(m.pdiFinish,'2026-12-17');assert.equal(m.dispatch,'2026-12-24');assert.equal(m.delivery,'2026-12-27');
  assert.equal(tasks[2].due,'2026-12-13');assert.equal(plan.dispatchTarget,'2026-12-21');assert.equal(m.taskSchedules['5'].waitingCount,2);
});
test('Delay propagates through multiple following tasks with durations preserved',()=>{
  const tasks=branch();tasks.push(task('6','2026-12-14',2,['5']));tasks[1].lastUpdate=now;tasks[1].forecast='2026-12-13';
  const m=milestoneForecast(plan,tasks,now);assert.equal(m.taskSchedules['6'].startDate,'2026-12-17');assert.equal(m.taskSchedules['6'].finishDate,'2026-12-18');assert.equal(m.delivery,'2026-12-29');
});
test('Slack absorbs a prerequisite delay before the planned successor start',()=>{
  const tasks=branch();tasks[2]=task('5','2026-12-20',3,['2','4']);tasks[1].lastUpdate=now;tasks[1].forecast='2026-12-13';
  const m=milestoneForecast(plan,tasks,now);assert.equal(m.taskSchedules['5'].startDate,'2026-12-20');assert.equal(m.taskSchedules['5'].finishDelayDays,0);
});
test('Late noncritical parallel work does not move the main milestones',()=>{
  const tasks=branch();const baseline=milestoneForecast(plan,tasks,now);tasks[3].lastUpdate=now;tasks[3].forecast='2026-12-09';assert.equal(milestoneForecast(plan,tasks,now).delivery,baseline.delivery);
});
test('Calendar durations and dependency releases cross leap days and years',()=>{
  const m=milestoneForecast({...plan,start:'2028-02-01'},[task('a','2028-02-28',2),task('b','2028-03-01',2,['a'])],now);assert.equal(m.taskSchedules.a.finishDate,'2028-02-29');assert.equal(m.taskSchedules.b.finishDate,'2028-03-02');
});
test('Overdue unstarted work retains its full duration from today',()=>{
  const m=milestoneForecast(plan,[task('a','2026-10-01',3),task('b','2026-10-04',2,['a'])],now);assert.equal(m.taskSchedules.a.finishDate,'2026-10-13');assert.equal(m.taskSchedules.b.startDate,'2026-10-14');assert.equal(m.taskSchedules.b.finishDate,'2026-10-15');
});
test('Packing and installation depend on milestone dates without delaying PDI',()=>{
  const tasks=[task('a','2026-12-10',1),task('pack','2026-12-01',10,['a'],{phase:'postPdi'}),task('install','2026-12-01',3,['pack'],{phase:'postDelivery'})];
  const m=milestoneForecast(plan,tasks,now);assert.equal(m.pdiFinish,'2026-12-11');assert.equal(m.taskSchedules.pack.startDate,'2026-12-12');assert.equal(m.dispatch,'2026-12-21');assert.equal(m.delivery,'2026-12-24');assert.equal(m.taskSchedules.install.startDate,'2026-12-25');assert.equal(m.taskSchedules.install.finishDate,'2026-12-27');
});
test('Invalid persisted graphs fail safely instead of recursing forever',()=>{
  for(const tasks of [[task('a','2026-12-01',1,['b']),task('b','2026-12-01',1,['a'])],[task('a','2026-12-01',1,['missing'])]]){
    const m=milestoneForecast(plan,tasks,now);assert.equal(m.state,'Plan incomplete');assert.equal(m.delivery,null);assert.equal(m.pdiReady,false);assert.ok(m.warnings.length);
  }
});
function setup(){
  const store=new Store();let clock=now;const svc=new Service(store,()=>clock),owner=svc.bootstrap('owner@example.test');
  const p=svc.createProject(owner,{name:'Dependency QA',customer:'Customer',start:'2026-10-01',dispatchTarget:'2026-12-21'}),people={owner};
  for(const role of ['pm','purchase','staff','vendor','service','customer']){const m=svc.addMember(owner,p.id,{name:role,email:role+'@example.test',role});people[role]=store.get('users',m.user);}
  const create=(title,extra={})=>svc.createTask(owner,p.id,{title,department:'Assembly',type:'Internal',assignee:people.staff.id,startDate:'2026-12-01',durationDays:2,...extra});
  const edit=(t,input,actor=owner)=>svc.taskSchedule(actor,t.id,{version:store.get('tasks',t.id).version,reason:'QA dependency plan',...input});
  const submit=t=>svc.update(people.staff,p.id,{task:t.id,version:store.get('tasks',t.id).version,status:'Submitted for verification',completed:'Done',pending:'Verify',nextAction:'Inspect'});
  const finish=t=>{submit(t);svc.verify(people.pm,t.id,{version:store.get('tasks',t.id).version,physicallyChecked:true});};
  return {store,svc,owner,p,people,create,edit,submit,finish,time:t=>{clock=t}};
}
const run=(name,fn)=>test(name,()=>{const f=setup();try{fn(f)}finally{f.store.close()}});
run('Creation stores start and duration and derives inclusive target finish',({create})=>{const t=create('New task');assert.equal(t.startDate,'2026-12-01');assert.equal(t.due,'2026-12-02');assert.equal(t.originalStartDate,t.startDate);assert.equal(t.durationDays,2);});
run('Dependency creation rejects malformed, duplicate and cross-project lists',({create,svc,owner})=>{
  const a=create('A');for(const dependencies of ['bad',[a.id,a.id],['missing']])assert.throws(()=>create('Bad',{dependencies}));
  const p=svc.createProject(owner,{name:'Other',customer:'Other',delivery:'2026-12-31'});const m=svc.addMember(owner,p.id,{name:'Other staff',email:'other@example.test',role:'staff'});const t=svc.createTask(owner,p.id,{title:'Other task',department:'Assembly',type:'Internal',assignee:m.user,due:'2026-12-01'});assert.throws(()=>create('Cross',{dependencies:[t.id]}),/this project/);
});
run('Planning rejects self links, cycles and reversed phase links atomically',({create,edit,store})=>{
  const a=create('A'),b=create('B',{dependencies:[a.id]});assert.throws(()=>edit(a,{dependencies:[a.id]}),/itself/);assert.throws(()=>edit(a,{dependencies:[b.id]}),/Circular/);assert.throws(()=>edit(a,{phase:'postDelivery'}),/later scheduling phase/);assert.deepEqual(store.get('tasks',a.id).dependencies,[]);
});
run('Planning edits require a manager, current version, valid duration and an open project',({create,edit,people,svc,p,owner})=>{
  const a=create('A');assert.throws(()=>edit(a,{durationDays:3},people.staff),/not permitted/);assert.throws(()=>edit(a,{durationDays:0}),/duration/);assert.throws(()=>edit(a,{durationDays:1.5}),/duration/);edit(a,{durationDays:3});assert.throws(()=>svc.taskSchedule(owner,a.id,{version:1,reason:'Stale'}),/record changed/);svc.transition(owner,p.id,'close');assert.throws(()=>edit(a,{durationDays:4}),/closed/);
});
run('Planning edits recalculate forecasts without replacing approved targets',({create,edit,svc,p,store})=>{
  const a=create('A');edit(a,{durationDays:5});const saved=store.get('tasks',a.id);assert.equal(saved.due,a.due);assert.equal(saved.baseline,a.baseline);assert.equal(svc.schedule(p.id).taskSchedules[a.id].finishDate,'2026-12-05');assert.equal(store.get('projects',p.id).dispatchTarget,'2026-12-21');assert.ok(store.all('audit').some(e=>e.action==='task.planning'));
});
run('Completion waits for verified prerequisites; progress reports remain available',({create,submit,finish,svc,people,p,store})=>{
  const a=create('A'),b=create('B',{dependencies:[a.id]});assert.throws(()=>submit(b),/Dependencies/);
  svc.update(people.staff,p.id,{task:b.id,version:b.version,status:'In progress',completed:'Preparation',pending:'A',nextAction:'Await A'});finish(a);finish(b);assert.equal(store.get('tasks',b.id).status,'Completed');
});
run('Verifier rechecks prerequisites if an upstream task is reopened after submission',({create,finish,submit,svc,people,store})=>{
  const a=create('A'),b=create('B',{dependencies:[a.id]});finish(a);submit(b);svc.verify(people.pm,a.id,{version:store.get('tasks',a.id).version,action:'reopen'});assert.throws(()=>svc.verify(people.pm,b.id,{version:store.get('tasks',b.id).version,physicallyChecked:true}),/Dependencies/);
});
run('Reopening a prerequisite invalidates downstream readiness and PDI',({create,finish,svc,people,p,store,owner})=>{
  const a=create('A'),b=create('B',{dependencies:[a.id]});finish(a);finish(b);svc.milestoneSettings(owner,p.id,{version:store.get('projects',p.id).version,pdiDispatchDays:7,planningComplete:true});assert.equal(svc.schedule(p.id).pdiReady,true);svc.verify(people.pm,a.id,{version:store.get('tasks',a.id).version,action:'reopen'});const m=svc.schedule(p.id);assert.equal(m.pdiReady,false);assert.equal(m.taskSchedules[b.id].completionValid,false);assert.equal(store.get('tasks',b.id).status,'Completed');
});
run('Task assignee reminds every unfinished prerequisite and reports to internal team',({create,svc,people,p,store})=>{
  const a=create('Confidential vendor A',{assignee:people.vendor.id}),b=create('Internal B'),c=create('Following C',{dependencies:[a.id,b.id]});const r=svc.requestDependencies(people.staff,c.id,{reason:'Need a revised completion forecast'});
  assert.deepEqual(r.prerequisites,[a.id,b.id]);assert.equal(store.all('statusRequests').filter(r=>r.dependencyRequest).length,2);
  for(const role of ['owner','pm','purchase','staff'])assert.ok(svc.snapshot(people[role]).notifications.some(n=>n.message.includes('Dependency delay reported')));
  const vendor=svc.snapshot(people.vendor);assert.ok(vendor.notifications.some(n=>n.message.includes('assigned work')));assert.ok(vendor.notifications.every(n=>!n.message.includes('Following C')&&!n.message.includes('Internal B')));assert.ok(svc.snapshot(people.customer).notifications.every(n=>!n.message.includes('Confidential vendor')));
});
run('Reminder excludes verified prerequisites and rejects unrelated members',({create,finish,svc,people})=>{
  const a=create('A'),b=create('B'),c=create('C',{dependencies:[a.id,b.id]});finish(a);const r=svc.requestDependencies(people.staff,c.id,{reason:'Need B'});assert.deepEqual(r.prerequisites,[b.id]);assert.throws(()=>svc.requestDependencies(people.customer,c.id,{reason:'Denied'}),/responsible member/);assert.throws(()=>svc.requestDependencies(people.vendor,c.id,{reason:'Denied'}),/not found/);finish(b);assert.throws(()=>svc.requestDependencies(people.staff,c.id,{reason:'Done'}),/no unfinished/);
});
run('Vendor receives own computed dates without hidden task IDs, names or people',({create,svc,people,p})=>{
  const a=create('Secret internal task'),b=create('Own vendor task',{assignee:people.vendor.id,dependencies:[a.id]});const snap=svc.snapshot(people.vendor),t=snap.tasks.find(t=>t.id===b.id);assert.deepEqual(t.dependencies,[]);assert.equal(t.hiddenDependencyCount,1);assert.equal(t.schedule.waitingCount,1);assert.equal(snap.projects.find(x=>x.id===p.id).milestones,undefined);assert.ok(!JSON.stringify(t).includes(a.id));const customer=svc.snapshot(people.customer);assert.equal(customer.tasks.find(t=>t.id===a.id).title,'Assembly activity');assert.equal(customer.tasks.find(t=>t.id===b.id).assignee,undefined);
});
run('Closed dependent task forecasts freeze until owner reopens',({create,svc,owner,p,time})=>{
  const a=create('A'),b=create('B',{dependencies:[a.id]});svc.transition(owner,p.id,'close');const before=svc.snapshot(owner).tasks.find(t=>t.id===b.id).schedule.finishDate;time('2027-01-10T04:30:00Z');assert.equal(svc.snapshot(owner).tasks.find(t=>t.id===b.id).schedule.finishDate,before);svc.transition(owner,p.id,'reopen');assert.notEqual(svc.snapshot(owner).tasks.find(t=>t.id===b.id).schedule.finishDate,before);
});
run('External assignee reminder response hides unrelated prerequisite identifiers',({create,svc,people})=>{
  const a=create('Private internal work'),b=create('Vendor following',{assignee:people.vendor.id,dependencies:[a.id]});const reply=svc.requestDependencies(people.vendor,b.id,{reason:'Need an update'});assert.equal(reply.prerequisiteCount,1);assert.equal(reply.prerequisites,undefined);assert.ok(!JSON.stringify(reply).includes(a.id));
});
run('Legacy closed milestone snapshots gain frozen task dates without changing milestone commitments',({create,svc,owner,p,time,store})=>{
  const a=create('A');svc.transition(owner,p.id,'close');const saved=store.get('projects',p.id),dispatch=saved.closedMilestones.dispatch;delete saved.closedMilestones.taskSchedules;store.put('projects',saved);time('2027-01-10T04:30:00Z');const m=svc.schedule(p.id);assert.equal(m.dispatch,dispatch);assert.equal(m.taskSchedules[a.id].finishDate,a.due);
});
run('Editing installation planning leaves the confirmed pre-PDI work list intact',({create,edit,svc,owner,p,store})=>{
  create('Required work');const install=create('Installation',{phase:'postDelivery'});svc.milestoneSettings(owner,p.id,{version:store.get('projects',p.id).version,pdiDispatchDays:7,planningComplete:true});const before=svc.schedule(p.id).delivery;edit(install,{durationDays:20});assert.equal(store.get('projects',p.id).planningComplete,true);assert.equal(svc.schedule(p.id).delivery,before);
});
