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

export default function ApprovalPage({ onBack, onToast }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('รอดำเนินการ');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchRequests(); }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res  = await fetch(`${APPS_SCRIPT_URL}?action=getLeaveRequests`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch { onToast('โหลดข้อมูลไม่ได้', 'error'); }
    finally { setLoading(false); }
  }

  async function updateStatus(req, newStatus) {
    const key = `${req.sheet}-${req.row}`;
    setUpdating(key);
    try {
      await fetch(`${APPS_SCRIPT_URL}?action=updateLeaveStatus&sheet=${encodeURIComponent(req.sheet)}&row=${req.row}&status=${encodeURIComponent(newStatus)}`);
      onToast(newStatus === 'อนุมัติ' ? '✅ อนุมัติเรียบร้อย' : '❌ ปฏิเสธเรียบร้อย', 'success');
      fetchRequests();
    } catch { onToast('เกิดข้อผิดพลาด', 'error'); }
    finally { setUpdating(null); }
  }

  const filtered = requests.filter(r => filter === 'ทั้งหมด' || r.status === filter);
  const pending  = requests.filter(r => r.status === 'รอดำเนินการ').length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3d2b] tracking-tight">อนุมัติการลา</h1>
          <p className="text-gray-400 text-sm mt-1">
            รอดำเนินการ <span className="font-semibold text-yellow-600">{pending}</span> รายการ
          </p>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          ย้อนกลับ
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['รอดำเนินการ', 'อนุมัติ', 'ไม่อนุมัติ', 'ทั้งหมด'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${filter === f ? 'bg-[#1a3d2b] text-white border-[#1a3d2b]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-[#2d6a4f] rounded-full animate-spin"/>
          กำลังโหลด...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">ไม่มีรายการ</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req, i) => {
            const key     = `${req.sheet}-${req.row}`;
            const isSick  = req.leaveType === 'ลาป่วย';
            const isPending = req.status === 'รอดำเนินการ';
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {req.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{req.name}</p>
                      <p className="text-[11px] text-gray-400">{formatDate(req.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${isSick ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {req.leaveType}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[req.status] || STATUS_STYLE['รอดำเนินการ']}`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div><span className="text-gray-400">วันที่:</span> {formatDate(req.startDate)} – {formatDate(req.endDate)}</div>
                  {req.reason && <div className="col-span-2"><span className="text-gray-400">เหตุผล:</span> {req.reason}</div>}
                </div>

                {isPending && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => updateStatus(req, 'อนุมัติ')} disabled={updating === key}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50">
                      {updating === key ? '...' : '✓ อนุมัติ'}
                    </button>
                    <button onClick={() => updateStatus(req, 'ไม่อนุมัติ')} disabled={updating === key}
                      className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl border border-red-200 transition cursor-pointer disabled:opacity-50">
                      {updating === key ? '...' : '✗ ไม่อนุมัติ'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
