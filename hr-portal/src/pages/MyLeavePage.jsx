import { useState, useEffect } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzvSPJfJFRZcD6GuV-h43m_HP5RG5m6lXiqNBmkn23hyDxrzAFgVvXSi0n94rENEbmOA/exec';

function formatDate(val) {
  if (!val) return '-';
  const d = new Date(val);
  return isNaN(d) ? String(val) : d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS_STYLE = {
  'รอดำเนินการ': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'อนุมัติ':     'bg-emerald-50 text-emerald-700 border-emerald-200',
  'ไม่อนุมัติ':  'bg-red-50 text-red-600 border-red-200',
};

export default function MyLeavePage({ onBack, onToast, user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user?.name) return;
    fetch(`${APPS_SCRIPT_URL}?action=getMyLeaveStatus&name=${encodeURIComponent(user.name)}`)
      .then(r => r.json())
      .then(data => setRequests(data.requests || []))
      .catch(() => onToast('โหลดข้อมูลไม่ได้', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3d2b] tracking-tight">สถานะการลา</h1>
          <p className="text-gray-400 text-sm mt-1">ประวัติการขอลาของคุณ</p>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          ย้อนกลับ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-[#2d6a4f] rounded-full animate-spin"/>
          กำลังโหลด...
        </div>
      ) : requests.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">ยังไม่มีประวัติการลา</div>
      ) : (
        <div className="space-y-3">
          {requests.map((req, i) => {
            const isSick = req.leaveType === 'ลาป่วย';
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${isSick ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {req.leaveType}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[req.status] || STATUS_STYLE['รอดำเนินการ']}`}>
                    {req.status || 'รอดำเนินการ'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div><span className="text-gray-400">วันที่:</span> {formatDate(req.startDate)} – {formatDate(req.endDate)}</div>
                  {req.reason && <div><span className="text-gray-400">เหตุผล:</span> {req.reason}</div>}
                  <div className="text-gray-300 text-[10px]">ยื่นเมื่อ {formatDate(req.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
