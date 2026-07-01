import { useState, useEffect, useCallback } from 'react';

const CLIENT_ID = '261090946062-3n4dfb32qbek1ivsgo9bfstrd3pb155b.apps.googleusercontent.com';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEqaUJ50YiHyXU4x-3JF4GfAjMpi3D79_8fHOObx9JosGQYyIFaLMkEXeQmt5RxEllcg/exec';
const REDIRECT_URI = window.location.origin;

async function checkRole(email) {
  try {
    const res  = await fetch(`${APPS_SCRIPT_URL}?action=getRole&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.role || 'employee';
  } catch {
    return 'employee';
  }
}

// สร้าง random state สำหรับ CSRF protection
function randomState() {
  return Math.random().toString(36).substring(2);
}

export function useAuth() {
  const [user, setUser]               = useState(null);
  const [role, setRole]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // 1. เช็ค hash fragment จาก OAuth redirect (#access_token=...)
      const hash = window.location.hash;
      if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const token  = params.get('access_token');
        const state  = params.get('state');
        // เคลียร์ hash ออกจาก URL
        window.history.replaceState(null, '', window.location.pathname);

        if (token && state === sessionStorage.getItem('oauth_state')) {
          sessionStorage.removeItem('oauth_state');
          try {
            const res  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const info = await res.json();
            const userObj  = { name: info.name, email: info.email, picture: info.picture };
            const userRole = await checkRole(info.email);
            setUser(userObj);
            setRole(userRole);
            localStorage.setItem('hr_user', JSON.stringify({ user: userObj, role: userRole }));
          } catch { /* ignore */ }
        }
        setAuthLoading(false);
        return;
      }

      // 2. restore session
      const saved = localStorage.getItem('hr_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed.user);
          setRole(parsed.role);
        } catch { localStorage.removeItem('hr_user'); }
      }
      setAuthLoading(false);
    }

    init();
  }, []);

  // login ด้วย OAuth implicit flow → redirect ใน browser tab ปกติ (รองรับมือถือ)
  const login = useCallback(() => {
    const state = randomState();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id:     CLIENT_ID,
      redirect_uri:  REDIRECT_URI,
      response_type: 'token',
      scope:         'openid email profile',
      state,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('hr_user');
  }, []);

  return { user, role, authLoading, login, logout };
}
