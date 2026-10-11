import { createHash } from 'node:crypto';
import { calculateTaskSchedules } from './dependencies.js';
import { addDays, indiaDay, taskPhase } from './calendar.js';
export { addDays, indiaDay, phases, taskPhase } from './calendar.js';
export function inspectionSignature(tasks) {
  return createHash('sha256').update(JSON.stringify(tasks.map(t => [t.id, t.status, t.verifiedAt || null]).sort((a, b) => a[0].localeCompare(b[0])))).digest('hex');
}
export function milestoneForecast(project, tasks, now) {
  let taskSchedules;
  try {
    taskSchedules = calculateTaskSchedules(project,tasks,now);
    const projected = () => tasks.map(t=>({ ...t, due:taskSchedules[t.id].finishDate||'', forecast:taskSchedules[t.id].finishDate||'', dependencyCompletionValid:taskSchedules[t.id].completionValid }));
    let milestones=baseMilestones(project,projected(),now);
    taskSchedules=calculateTaskSchedules(project,tasks,now,{postPdi:milestones.pdiFinish ? addDays(milestones.pdiFinish,1) : null});
    milestones=baseMilestones(project,projected(),now);
    taskSchedules=calculateTaskSchedules(project,tasks,now,{postPdi:milestones.pdiFinish ? addDays(milestones.pdiFinish,1) : null, postDelivery:milestones.delivery ? addDays(milestones.delivery,1) : null});
    if(tasks.some(t=>taskSchedules[t.id].dependencyDriven&&taskSchedules[t.id].finishDelayDays>0)) milestones.warnings.push('Dependency delays have moved following tasks. Approved target dates remain unchanged.');
    if(tasks.some(t=>t.status==='Completed'&&!taskSchedules[t.id].completionValid)) milestones.warnings.push('Verified work has an unfinished prerequisite; review completion and inspection readiness.');
    if(tasks.some(t=>t.status!=='Completed'&&(t.lastUpdate?t.forecast||t.due:t.due)<indiaDay(now))) milestones.warnings.push('Unfinished work has dates in the past; update its forecast.');
    if(milestones.warnings.length&&milestones.state==='Calculated forecast') milestones.state='Forecast needs review';
    return {...milestones,taskSchedules};
  } catch(error) {
    const m=baseMilestones(project,[],now);return {...m,pdiReady:false,pdiValid:false,dispatchReady:false,warnings:[error.message],taskSchedules:{}};
  }
}
function baseMilestones(project, tasks, now) {
  const today = indiaDay(now), gap = project.pdiDispatchDays ?? 7;
  const before = tasks.filter(t => taskPhase(t) === 'prePdi');
  const after = tasks.filter(t => taskPhase(t) === 'postPdi');
  const relevant = [...before, ...after];
  const missingDates = relevant.some(t => !/^\d{4}-\d{2}-\d{2}$/.test(t.lastUpdate ? t.forecast || t.due || '' : t.due || ''));
  const ready = before.length > 0 && !!project.planningComplete && before.every(t => t.status === 'Completed' && t.verifiedAt && t.dependencyCompletionValid !== false);
  const pdiValid = ready && !!project.pdiActualDate && project.pdiCompletedAgainst === inspectionSignature(before);
  const dispatchReady = pdiValid && after.every(t => t.status === 'Completed' && t.verifiedAt && t.dependencyCompletionValid !== false);
  const dispatchTarget = project.dispatchTarget || (project.delivery ? addDays(project.delivery, -3) : null);
  const base = { dispatchTarget, deliveryTarget: project.delivery, pdiDispatchDays: gap, pdiDurationDays: 1, transitDays: 3, planningComplete: !!project.planningComplete, pdiReady: ready, pdiValid, dispatchReady, requiredTasks: before.length, verifiedTasks: before.filter(t => t.status === 'Completed' && t.verifiedAt).length, postPdiTasks: after.length, excludedTasks: tasks.filter(t => taskPhase(t) === 'postDelivery').length, pdiActualDate: project.pdiActualDate || null, warnings: [], calculatedAt: now };
  if (!before.length || missingDates) return { ...base, state: 'Plan incomplete', workReady: null, pdiStart: null, pdiFinish: null, dispatch: null, delivery: null, dispatchVarianceDays: null, deliveryVarianceDays: null };
  const finish = t => t.status === 'Completed' && t.verifiedAt ? indiaDay(t.verifiedAt) : (t.lastUpdate ? t.forecast || t.due : t.due);
  const effectiveFinish = t => t.status === 'Completed' && t.verifiedAt ? finish(t) : [finish(t), today].sort().at(-1);
  const workReady = [project.start || today, ...before.map(effectiveFinish)].sort().at(-1);
  const pdiStart = pdiValid ? project.pdiActualDate : addDays(workReady, 1);
  // PDI occupies one calendar date. The gap is measured from its completion.
  const pdiFinish = pdiStart;
  const dispatch = [addDays(pdiFinish, gap), ...after.map(effectiveFinish)].sort().at(-1);
  const delivery = addDays(dispatch, 3);
  const variance = (forecast, target) => target ? Math.round((Date.parse(forecast) - Date.parse(target)) / 86400000) : null;
  if (relevant.some(t => t.status !== 'Completed' && finish(t) < today)) base.warnings.push('Unfinished work has dates in the past; update its forecast.');
  if (after.some(t => finish(t) < pdiFinish)) base.warnings.push('Some post-PDI work is dated before inspection; review its dates.');
  if (project.pdiActualDate && !pdiValid) base.warnings.push('Recorded PDI no longer covers the current verified work; inspection confirmation is required again.');
  if (relevant.some(t => t.status === 'Blocked')) base.warnings.push('Work is blocked; review the milestone forecasts and recovery plan.');
  return { ...base, state: project.planningComplete ? base.warnings.length ? 'Forecast needs review' : 'Calculated forecast' : 'Provisional — confirm work list', workReady, pdiStart, pdiFinish, dispatch, delivery, dispatchVarianceDays: variance(dispatch, dispatchTarget), deliveryVarianceDays: variance(delivery, project.delivery) };
}
