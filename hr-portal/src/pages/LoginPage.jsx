export default function LoginPage({ onLogin, loading }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2d1f] via-[#1a3d2b] to-[#2d6a4f] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#52b788]/10 rounded-full blur-3xl"/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#52b788]/10 rounded-full blur-3xl"/>
      </div>
      <div className="relative w-full max-w-sm">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1a3d2b] rounded-2xl flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1a3d2b] tracking-tight">Carbon Edge</h1>
            <p className="text-gray-400 text-sm mt-1">Employee Portal</p>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100"/>
            <span className="text-xs text-gray-300">เข้าสู่ระบบด้วยบัญชีองค์กร</span>
            <div className="flex-1 h-px bg-gray-100"/>
          </div>
          <button onClick={onLogin} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1a3d2b] text-white text-sm font-semibold rounded-xl hover:bg-[#2d6a4f] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#1a3d2b]/30">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                กำลังโหลด...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                เข้าสู่ระบบ
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-gray-300 mt-6">สำหรับพนักงาน Carbon Edge เท่านั้น</p>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">© 2026 Carbon Edge · Powered by Keycloak</p>
      </div>
    </div>
  );
}
