import { MONTHS_TH } from './config';

export function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function formatDateTH(d) {
  if (!d) return '';
  return `${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${d.getFullYear()+543}`;
}

export function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function parseSheetDate(val) {
  if (!val) return null;
  if (typeof val === 'string' && val.startsWith('Date(')) {
    const [y, m, d] = val.replace('Date(','').replace(')','').split(',').map(Number);
    return new Date(y, m, d);
  }
  const d = new Date(val);
  return isNaN(d) ? null : d;
}

export function buildEventMap(leaveData) {
  const map = {};
  leaveData.forEach(ev => {
    if (!ev.startDate || !ev.endDate) return;
    const cur = new Date(ev.startDate);
    while (cur <= ev.endDate) {
      const key = dateKey(cur);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
      cur.setDate(cur.getDate() + 1);
    }
  });
  return map;
}
