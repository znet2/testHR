export default function Navbar({ page, onHome }) {
  // breadcrumb label
  const labels = {
    home:     null,
    leave:    'ลา',
    expense:  'เบิก',
    calendar: 'ปฏิทินการลา',
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1a3d2b] shadow-lg">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
        {/* Logo — always clickable back to home */}
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
      </div>
    </nav>
  );
}
