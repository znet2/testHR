import { useEffect } from 'react';

const CLIENT_ID = '261090946062-3n4dfb32qbek1ivsgo9bfstrd3pb155b.apps.googleusercontent.com';

export default function LoginPage({ onLogin, loading }) {

  // render Google Sign-In button โดยตรง — รองรับมือถือทุก browser
  useEffect(() => {
    function tryRender() {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: onLogin,
        ux_mode: 'popup',
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('g_signin_btn'),
        { theme: 'outline', size: 'large', width: 280, text: 'signin_with', locale: 'th' }
      );
    }

    if (window.google) {
      tryRender();
    } else {
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); tryRender(); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [onLogin]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-[#1a3d2b] rounded-xl flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#1a3d2b] mb-1">Carbon Edge Portal</h1>
        <p className="text-gray-400 text-sm mb-8">เข้าสู่ระบบด้วย Google Account</p>

        {/* Google Sign-In button — render โดย GSI library */}
        <div className="flex justify-center">
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#2d6a4f] rounded-full animate-spin"/>
          ) : (
            <div id="g_signin_btn" />
          )}
        </div>

        <p className="text-[11px] text-gray-300 mt-6">สำหรับพนักงาน Carbon Edge เท่านั้น</p>
      </div>
    </div>
  );
}
