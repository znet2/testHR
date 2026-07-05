import { useState } from 'react';
import Modal from '../components/Modal';
import LeaveForm from '../components/LeaveForm';

export default function LeavePage({ onShowCalendar, onBack, onToast, role, user, onNavigate }) {
  const [modal, setModal] = useState(null);

  const cards = [
    {
      type: 'personal',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
        </svg>
      ),
      title: 'ลากิจ',
      sub: 'ต้องลาล่วงหน้า',
      gradient: 'from-emerald-500 to-teal-500',
      show: true,
    },
    {
      type: 'sick',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      title: 'ลาป่วย',
      sub: 'ลาย้อนหลังได้',
      gradient: 'from-amber-500 to-orange-400',
      show: true,
    },
    {
      type: 'myleave',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      ),
      title: 'สถานะการลา',
      sub: 'ติดตามคำขอของคุณ',
      gradient: 'from-violet-500 to-purple-500',
      show: true,
    },
    {
      type: 'calendar',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18M8 14h8M8 18h5"/>
        </svg>
      ),
      title: 'ปฏิทินการลา',
      sub: 'ดูตารางพนักงานทั้งหมด',
      gradient: 'from-blue-500 to-cyan-500',
      show: role === 'hr',
    },
    {
      type: 'approval',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      title: 'อนุมัติการลา',
      sub: 'ตรวจสอบคำขอทั้งหมด',
      gradient: 'from-rose-500 to-pink-500',
      show: role === 'hr',
    },
  ].filter(c => c.show);

  function handleCard(type) {
    if (type === 'calendar')  { if (onShowCalendar) onShowCalendar(); return; }
    if (type === 'myleave')   { onNavigate('myleave'); return; }
    if (type === 'approval')  { onNavigate('approval'); return; }
    setModal(type);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3d2b] tracking-tight">ระบบการลา</h1>
          <p className="text-gray-400 text-sm mt-1">เลือกประเภทที่ต้องการ</p>
        </div>
        <BackBtn onClick={onBack} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map(c => (
          <button key={c.type} onClick={() => handleCard(c.type)}
            className="group bg-white rounded-2xl p-5 text-left shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${c.gradient}`}/>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white mb-4 shadow-sm`}>
              {c.icon}
            </div>
            <h2 className="text-sm font-bold text-gray-800 mb-0.5">{c.title}</h2>
            <p className="text-[11px] text-gray-400 mb-4">{c.sub}</p>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              เข้าใช้งาน
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      <Modal open={modal === 'personal'} onClose={() => setModal(null)}
        icon="📋" title="ลากิจ" subtitle="กรุณากรอกข้อมูลการลากิจ (ต้องลาล่วงหน้าอย่างน้อย 1 วัน)">
        <LeaveForm type="personal" onClose={() => setModal(null)} onToast={onToast} userName={user?.name} />
      </Modal>

      <Modal open={modal === 'sick'} onClose={() => setModal(null)}
        icon="🤒" title="ลาป่วย" subtitle="กรุณากรอกข้อมูลการลาป่วย (สามารถลาย้อนหลังได้)">
        <LeaveForm type="sick" onClose={() => setModal(null)} onToast={onToast} userName={user?.name} />
      </Modal>
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      ย้อนกลับ
    </button>
  );
}
