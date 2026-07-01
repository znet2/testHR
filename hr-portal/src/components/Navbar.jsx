export default function Navbar({ page, onHome, user, role, onLogout }) {
  const labels = {
    home:     null,
    leave:    'ลา',
    expense:  'เบิก',
    calendar: 'ปฏิทินการลา',
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1a3d2b] shadow-lg">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
        {/* Logo */}
        <button onClick={onHome} className="flex items-center gap-2 text-white font-bold text-sm tracking-wide cursor-pointer hover:opacity-80 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          Carbon Edge
        </button>

        {/* Breadcrumb */}
        {labels[page] && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.35" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-white/70 text-sm font-medium">{labels[page]}</span>
          </>
        )}

        {/* User info */}
        {user && (
          <div className="ml-auto flex items-center gap-3">
            {role === 'hr' && (
              <span className="text-[11px] font-semibold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">HR</span>
            )}
            {user.picture && (
              <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full border border-white/20" />
            )}
            <span className="text-white/80 text-xs hidden sm:block">{user.name}</span>
            <button onClick={onLogout}
              className="text-white/50 hover:text-white text-xs transition cursor-pointer ml-1">
              ออก
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
