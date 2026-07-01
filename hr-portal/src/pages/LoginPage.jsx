import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function isInAppBrowser() {
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger|TikTok|Snapchat|Messenger/.test(ua);
}

export default function LoginPage({ onSuccess }) {
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
        ) : (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                const decoded = jwtDecode(credentialResponse.credential);
                onSuccess(decoded);
              }}
              onError={() => console.error('Login failed')}
              useOneTap={false}
              locale="th"
            />
          </div>
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
