import { useState, useCallback } from 'react';
import { SHEET_CONFIG } from '../config';
import { parseSheetDate } from '../utils';

async function fetchSheet(sheetId, sheet) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet.sheetName)}&gid=${sheet.gid}`;
  const res  = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.replace(/^[^{]*({.*})[^}]*$/s, '$1'));
  const c    = sheet.cols;

  return (json.table?.rows || [])
    .map(r => ({
      name:      r.c?.[c.name]?.v      ?? '',
      empId:     c.empId >= 0 ? (r.c?.[c.empId]?.v ?? '') : '',
      startDate: parseSheetDate(r.c?.[c.startDate]?.v),
      endDate:   parseSheetDate(r.c?.[c.endDate]?.v),
      leaveType: r.c?.[c.leaveType]?.v ?? '',
    }))
    .filter(d => d.name && d.startDate && d.endDate);
}

export function useLeaveData() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const load = useCallback(async (year, month) => {
    setLoading(true);
    setError(null);
    try {
      const { sheetId, sheets } = SHEET_CONFIG;
      // ดึงทั้ง 2 sheets พร้อมกัน
      const results = await Promise.all(sheets.map(s => fetchSheet(sheetId, s)));
      const combined = results.flat();
      setData(combined.length > 0 ? combined : []);
    } catch (e) {
      console.error(e);
      setError('ไม่สามารถโหลดข้อมูลได้');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, load };
}
