export default function HomePage({ onNavigate, role }) {
  const allMenus = [
    {
      id: 'leave',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
        </svg>
      ),
      title: 'ลา',
      desc: 'ยื่นคำขอลากิจ ลาป่วย และดูข้อมูลการลา',
      items: role === 'hr' ? ['ลากิจ', 'ลาป่วย', 'ปฏิทินการลา'] : ['ลากิจ', 'ลาป่วย'],
      color: 'hover:border-emerald-400',
      badge: 'bg-emerald-50 text-emerald-700',
      badgeLabel: 'ระบบการลา',
    },
    {
      id: 'expense',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <path d="M2 10h20"/>
          <path d="M6 15h4M14 15h4"/>
        </svg>
      ),
      title: 'เบิก',
      desc: 'เบิกค่าใช้จ่าย ค่าเดินทาง และค่าใช้จ่ายต่างๆ',
      items: ['เบิกค่าใช้จ่าย', 'ดูประวัติการเบิก'],
      color: 'hover:border-blue-400',
      badge: 'bg-blue-50 text-blue-700',
      badgeLabel: 'ระบบเบิก',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"/>
          Carbon Edge Employee Portal
        </div>
        <h1 className="text-3xl font-bold text-[#1a3d2b] tracking-tight mb-2">ยินดีต้อนรับ</h1>
        <p className="text-gray-400 text-sm">เลือกระบบที่ต้องการใช้งาน</p>
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {allMenus.map(m => (
          <button key={m.id} onClick={() => onNavigate(m.id)}
            className={`bg-white rounded-2xl p-8 text-left border-2 border-gray-100 shadow-sm
              ${m.color} hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer group`}>
            <div className="flex items-start justify-between mb-5">
              <div className="p-3 bg-emerald-50 rounded-xl">{m.icon}</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.badge}`}>{m.badgeLabel}</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a3d2b] mb-1.5">{m.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{m.desc}</p>
            <div className="flex flex-wrap gap-2">
              {m.items.map(item => (
                <span key={item} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">{item}</span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#2d6a4f] group-hover:gap-2 transition-all">
              เข้าใช้งาน
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
