import { useEffect, useState } from 'react';
import { useLeaveData } from '../hooks/useLeaveData';
import { MONTHS_TH, DAYS_TH } from '../config';
import { dateKey, formatDateTH, buildEventMap } from '../utils';

export default function CalendarPage({ onBack }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const { data, loading, load } = useLeaveData();

  useEffect(() => { load(year, month); }, [year, month, load]);

  function changeMonth(delta) {
    let m = month + delta, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setMonth(m); setYear(y); setSelected(null);
  }

  const eventMap = buildEventMap(data);
  const firstDow   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++)
    cells.push({ date: new Date(year, month - 1, prevMonthDays - firstDow + 1 + i), current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true });
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false });

  const selectedEvents = selected ? (eventMap[dateKey(selected)] || []) : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a3d2b] tracking-tight">ปฏิทินการลา</h1>
          <p className="text-gray-400 text-xs mt-0.5">ข้อมูลการลาของพนักงานทั้งหมด</p>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          ย้อนกลับ
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-3">
        <NavBtn onClick={() => changeMonth(-1)} dir="left" />
        <span className="font-bold text-[#1a3d2b] text-base min-w-[160px] text-center">
          {MONTHS_TH[month]} {year + 543}
        </span>
        <NavBtn onClick={() => changeMonth(1)} dir="right" />
        <button onClick={() => load(year, month)} title="รีเฟรช"
          className="ml-auto w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"/>ลากิจ</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"/>ลาป่วย</span>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7">
          {DAYS_TH.map((d, i) => (
            <div key={d} className={`py-2.5 text-center text-xs font-bold tracking-wide bg-gray-50 border-b border-gray-100
              ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Loading overlay */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-[#2d6a4f] rounded-full animate-spin"/>
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {cells.map(({ date, current }, idx) => {
              const key    = dateKey(date);
              const events = eventMap[key] || [];
              const isToday = current && date.toDateString() === today.toDateString();
              const isSel   = selected && date.toDateString() === selected.toDateString();
              const dow     = date.getDay();

              return (
                <div key={idx}
                  onClick={() => events.length > 0 && setSelected(isSel ? null : date)}
                  className={`min-h-[88px] p-1.5 border-r border-b border-gray-100 last:border-r-0 transition-colors
                    ${!current ? 'bg-gray-50/60' : ''}
                    ${events.length > 0 ? 'cursor-pointer hover:bg-emerald-50/40' : ''}
                    ${isSel ? 'bg-emerald-50' : ''}`}>
                  <div className={`w-6 h-6 flex items-center justify-center text-xs font-semibold mb-1 rounded-full
                    ${isToday ? 'bg-[#1a3d2b] text-white' : !current ? 'text-gray-200' : dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </div>
                  {events.slice(0, 2).map((ev, i) => (
                    <div key={i} className={`text-[10px] font-medium px-1.5 py-0.5 rounded mb-0.5 truncate leading-tight
                      ${ev.leaveType === 'ลาป่วย' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {ev.name}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-[10px] text-gray-400 px-1">+{events.length - 2} คน</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Day detail panel */}
      {selected && selectedEvents.length > 0 && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-[#1a3d2b] mb-3">
            การลาวันที่ {formatDateTH(selected)} ({selectedEvents.length} คน)
          </h3>
          <div className="space-y-2">
            {selectedEvents.map((ev, i) => {
              const isSick = ev.leaveType === 'ลาป่วย';
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSick ? 'bg-amber-600' : 'bg-emerald-600'}`}/>
                  <span className="text-sm font-semibold text-gray-800 flex-1">
                    {ev.name} <span className="text-gray-400 font-normal text-xs">({ev.empId})</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDateTH(ev.startDate)}{ev.startDate?.toDateString() !== ev.endDate?.toDateString() ? ` – ${formatDateTH(ev.endDate)}` : ''}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isSick ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {ev.leaveType}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({ onClick, dir }) {
  return (
    <button onClick={onClick}
      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'left' ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
      </svg>
    </button>
  );
}
