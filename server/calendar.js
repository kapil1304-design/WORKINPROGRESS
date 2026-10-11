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
