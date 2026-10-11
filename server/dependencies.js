// Finish-to-start dependencies, inclusive calendar-day task durations.
import { addDays, indiaDay, phases, taskPhase } from './calendar.js';

export function taskPlan(t) {
  const durationDays = t.durationDays ?? 1;
  return { startDate: t.startDate || (t.due ? addDays(t.due, 1 - durationDays) : null), durationDays };
}
export function validateDependencies(tasks) {
  const byId = new Map(tasks.map(t => [t.id, t])), visiting = new Set(), visited = new Set();
  const visit = t => {
    if (visiting.has(t.id)) throw Error('Circular task dependencies are not allowed.');
    if (visited.has(t.id)) return;
    visiting.add(t.id);
    for (const id of t.dependencies || []) {
      const predecessor = byId.get(id);
      if (!predecessor) throw Error('Every dependency must belong to this project.');
      if (id === t.id) throw Error('A task cannot depend on itself.');
      if (phases.indexOf(taskPhase(predecessor)) > phases.indexOf(taskPhase(t))) throw Error('A task cannot depend on work in a later scheduling phase.');
      visit(predecessor);
    }
    visiting.delete(t.id); visited.add(t.id);
  };
  tasks.forEach(visit);
}
const difference = (a,b) => Math.round((Date.parse(a)-Date.parse(b))/86400000);
export function calculateTaskSchedules(project, tasks, now, anchors = {}) {
  validateDependencies(tasks);
  const byId = new Map(tasks.map(t=>[t.id,t])), schedules = {}, today=indiaDay(now);
  const visit = t => {
    if(schedules[t.id]) return schedules[t.id];
    const plan=taskPlan(t), previous=(t.dependencies||[]).map(id=>visit(byId.get(id)));
    const predecessorFinish=previous.map(s=>s.finishDate).filter(Boolean).sort().at(-1);
    const release=predecessorFinish ? addDays(predecessorFinish,1) : null;
    const actual=t.status==='Completed' && !!t.verifiedAt;
    const start=[plan.startDate, taskPhase(t)==='prePdi' ? project.start : null, anchors[taskPhase(t)], release, t.status==='Not started' ? today : null].filter(Boolean).sort().at(-1)||null;
    const ownFinish=t.lastUpdate ? t.forecast||t.due : t.due;
    const missing=previous.some(s=>!s.finishDate);
    const finishDate=actual ? indiaDay(t.verifiedAt) : missing || !plan.startDate || !ownFinish ? null : [addDays(start,plan.durationDays-1),ownFinish,today].sort().at(-1);
    const dependenciesReady=previous.every(s=>s.completionValid);
    return schedules[t.id]={ startDate:actual ? t.startedAt ? indiaDay(t.startedAt) : plan.startDate : start, finishDate, plannedStart:plan.startDate, durationDays:plan.durationDays, startDelayDays:start&&plan.startDate ? Math.max(0,difference(start,plan.startDate)) : null, finishDelayDays:finishDate&&t.due ? Math.max(0,difference(finishDate,t.due)) : null, dependenciesReady, waitingCount:previous.filter(s=>!s.completionValid).length, completionValid:actual&&dependenciesReady, dependencyDriven:!!release&&release>plan.startDate, actualFinishDate:actual ? finishDate : null };
  };
  tasks.forEach(visit); return schedules;
}
