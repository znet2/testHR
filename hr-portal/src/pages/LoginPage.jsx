function isInAppBrowser() {
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger|TikTok|Snapchat|Messenger/.test(ua);
}

export default function LoginPage({ onLogin, loading }) {
  const inApp = isInAppBrowser();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-sm text-center">
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
        <p className="text-gray-400 text-sm mb-6">เข้าสู่ระบบด้วย Google Account</p>

        {inApp ? (
          <OpenInBrowserGuide />
        ) : loading ? (
          <div className="flex justify-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#2d6a4f] rounded-full animate-spin"/>
          </div>
        ) : (
          <button onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            เข้าสู่ระบบด้วย Google
          </button>
        )}

        <p className="text-[11px] text-gray-300 mt-6">สำหรับพนักงาน Carbon Edge เท่านั้น</p>
      </div>
    </div>
  );
}

function OpenInBrowserGuide() {
  const url = window.location.href;

  function copyUrl() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() =>
        alert('คัดลอก URL แล้ว!\n\nเปิด Safari หรือ Chrome แล้ววาง URL ในช่อง address bar')
      );
    } else {
      const el = document.createElement('textarea');
      el.value = url; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
      alert('คัดลอก URL แล้ว!\n\nเปิด Safari หรือ Chrome แล้ววาง URL ในช่อง address bar');
    }
  }

  return (
    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
      <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ กรุณาเปิดใน Safari หรือ Chrome</p>
      <p className="text-[11px] text-amber-700 mb-3">
        บราวเซอร์นี้ไม่รองรับ Google Login<br/>
        คัดลอก URL แล้วเปิดใน Safari หรือ Chrome
      </p>
      <div className="bg-white border border-amber-200 rounded-lg px-2 py-1.5 mb-2 break-all">
        <p className="text-[10px] text-gray-500 font-mono">{url}</p>
      </div>
      <button onClick={copyUrl}
        className="w-full py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg cursor-pointer">
        📋 คัดลอก URL
      </button>
    </div>
  );
}
