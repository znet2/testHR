import logo from '../assets/Logo_split.png';

export default function Navbar({ page, onHome, user, role, onLogout }) {
  const labels = {
    home:     null,
    leave:    'ระบบลา',
    expense:  'ระบบเบิก',
    calendar: 'ปฏิทินการลา',
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <button onClick={onHome} className="flex items-center cursor-pointer hover:opacity-80 transition shrink-0">
          <img src={logo} alt="Carbon Edge" className="h-9 object-contain" />
        </button>

        {/* Divider + subtitle ลบออก */}

        {/* Breadcrumb */}
        {labels[page] && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-gray-300">›</span>
            <span className="text-sm font-medium text-gray-500">{labels[page]}</span>
          </div>
        )}

        {/* User */}
        {user && (
          <div className="ml-auto flex items-center gap-3">
            {role === 'hr' && (
              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full tracking-wide">HR</span>
            )}
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {user.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-medium text-gray-600 hidden sm:block max-w-[100px] truncate">{user.name}</span>
            </div>
            <button onClick={onLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition cursor-pointer px-2 py-1.5 rounded-lg hover:bg-red-50 font-medium">
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
