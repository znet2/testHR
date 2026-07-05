export default function HomePage({ onNavigate, role, user }) {
  const menus = [
    {
      id: 'leave',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
        </svg>
      ),
      title: 'ระบบลา',
      sub: role === 'hr' ? 'ลากิจ · ลาป่วย · ปฏิทิน' : 'ลากิจ · ลาป่วย',
      gradient: 'from-emerald-500 to-teal-500',
      show: true,
    },
    {
      id: 'expense',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <path d="M2 10h20M6 15h4M14 15h4"/>
        </svg>
      ),
      title: 'ระบบเบิก',
      sub: 'เบิกค่าใช้จ่าย · ดูประวัติ',
      gradient: 'from-blue-500 to-indigo-500',
      show: true,
    },
  ].filter(m => m.show);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0a1f14] via-[#1a3d2b] to-[#0f3320] px-6 pt-8 pb-14">
        <div className="max-w-2xl mx-auto">
          <p className="text-emerald-400/70 text-xs font-medium tracking-widest uppercase mb-2">Carbon Edge Portal</p>
          <h1 className="text-2xl font-bold text-white leading-tight">
            สวัสดีคุณ <span className="text-emerald-300">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">เลือกระบบที่ต้องการใช้งาน</p>
        </div>
      </div>

      {/* Cards — float up over banner */}
      <div className="max-w-2xl mx-auto px-6 -mt-8">
        {/* Info strip */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email} · {role === 'hr' ? 'Human Resources' : 'พนักงาน'}</p>
          </div>
          <div className="ml-auto shrink-0">
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {menus.map(m => (
            <button key={m.id} onClick={() => onNavigate(m.id)}
              className="group bg-white rounded-2xl p-5 text-left shadow-md border border-gray-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden relative">
              {/* gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${m.gradient}`}/>
              {/* icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white mb-4 shadow-sm`}>
                {m.icon}
              </div>
              <h2 className="text-sm font-bold text-gray-800 mb-0.5">{m.title}</h2>
              <p className="text-[11px] text-gray-400 mb-4">{m.sub}</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                เข้าใช้งาน
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
