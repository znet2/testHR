import { useState } from 'react';
import Modal from '../components/Modal';
import LeaveForm from '../components/LeaveForm';

const cards = [
  {
    type: 'personal',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    title: 'ลากิจ',
    desc: 'สำหรับการลาที่วางแผนล่วงหน้า',
    badge: 'ต้องลาล่วงหน้า',
    badgeClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    type: 'sick',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'ลาป่วย',
    desc: 'สำหรับการลาเนื่องจากเจ็บป่วย',
    badge: 'ลาย้อนหลังได้',
    badgeClass: 'bg-amber-50 text-amber-700',
  },
  {
    type: 'calendar',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h8M8 18h5"/>
      </svg>
    ),
    title: 'ข้อมูลการลา',
    desc: 'ดูตารางการลาของพนักงานทั้งหมด',
    badge: 'ปฏิทินรายเดือน',
    badgeClass: 'bg-blue-50 text-blue-700',
  },
];

export default function LeavePage({ onShowCalendar, onBack, onToast }) {
  const [modal, setModal] = useState(null);

  function handleCard(type) {
    if (type === 'calendar') { onShowCalendar(); return; }
    setModal(type);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3d2b] tracking-tight">ระบบการลา</h1>
          <p className="text-gray-400 text-sm mt-1">เลือกประเภทการลาที่ต้องการ</p>
        </div>
        <BackBtn onClick={onBack} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(c => (
          <button key={c.type} onClick={() => handleCard(c.type)}
            className="bg-white rounded-2xl p-7 text-center border border-gray-200 shadow-sm hover:border-[#52b788] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex justify-center mb-3">{c.icon}</div>
            <h2 className="text-base font-bold text-[#1a3d2b] mb-1">{c.title}</h2>
            <p className="text-gray-400 text-xs mb-3 leading-relaxed">{c.desc}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${c.badgeClass}`}>{c.badge}</span>
          </button>
        ))}
      </div>

      <Modal open={modal === 'personal'} onClose={() => setModal(null)}
        icon="📋" title="ลากิจ" subtitle="กรุณากรอกข้อมูลการลากิจ (ต้องลาล่วงหน้าอย่างน้อย 1 วัน)">
        <LeaveForm type="personal" onClose={() => setModal(null)} onToast={onToast} />
      </Modal>

      <Modal open={modal === 'sick'} onClose={() => setModal(null)}
        icon="🤒" title="ลาป่วย" subtitle="กรุณากรอกข้อมูลการลาป่วย (สามารถลาย้อนหลังได้)">
        <LeaveForm type="sick" onClose={() => setModal(null)} onToast={onToast} />
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
