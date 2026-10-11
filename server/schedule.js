import { createHash } from 'node:crypto';

export const phases = ['prePdi', 'postPdi', 'postDelivery'];
export function addDays(day, days) {
  const d = new Date(`${day}T00:00:00Z`);
  if (!Number.isFinite(d.getTime())) throw Error('Invalid scheduling date.');
  d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10);
}
export function indiaDay(instant) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(instant));
}
export function taskPhase(t) { return t.phase || (t.department === 'Installation' ? 'postDelivery' : 'prePdi'); }
export function inspectionSignature(tasks) {
  return createHash('sha256').update(JSON.stringify(tasks.map(t => [t.id, t.status, t.verifiedAt || null]).sort((a, b) => a[0].localeCompare(b[0])))).digest('hex');
}
export function milestoneForecast(project, tasks, now) {
  const today = indiaDay(now), gap = project.pdiDispatchDays ?? 7;
  const before = tasks.filter(t => taskPhase(t) === 'prePdi');
  const after = tasks.filter(t => taskPhase(t) === 'postPdi');
  const relevant = [...before, ...after];
  const missingDates = relevant.some(t => !/^\d{4}-\d{2}-\d{2}$/.test(t.lastUpdate ? t.forecast || t.due || '' : t.due || ''));
  const ready = before.length > 0 && !!project.planningComplete && before.every(t => t.status === 'Completed' && t.verifiedAt);
  const pdiValid = ready && !!project.pdiActualDate && project.pdiCompletedAgainst === inspectionSignature(before);
  const dispatchReady = pdiValid && after.every(t => t.status === 'Completed' && t.verifiedAt);
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
