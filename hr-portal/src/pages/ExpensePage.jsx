export default function ExpensePage({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3d2b] tracking-tight">ระบบเบิกค่าใช้จ่าย</h1>
          <p className="text-gray-400 text-sm mt-1">ยังไม่เปิดใช้งาน — กำลังพัฒนา</p>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#52b788] hover:text-[#1a3d2b] transition cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          ย้อนกลับ
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-20">
        <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <h2 className="text-base font-semibold text-gray-400">Coming Soon</h2>
        <p className="text-gray-300 text-sm mt-1">ระบบเบิกค่าใช้จ่ายกำลังอยู่ในระหว่างการพัฒนา</p>
      </div>
    </div>
  );
}
