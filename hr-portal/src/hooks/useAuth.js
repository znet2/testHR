import { useState, useEffect, useCallback } from 'react';

const CLIENT_ID = '261090946062-3n4dfb32qbek1ivsgo9bfstrd3pb155b.apps.googleusercontent.com';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEqaUJ50YiHyXU4x-3JF4GfAjMpi3D79_8fHOObx9JosGQYyIFaLMkEXeQmt5RxEllcg/exec';

async function checkRole(email) {
  try {
    const res  = await fetch(`${APPS_SCRIPT_URL}?action=getRole&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.role || 'employee';
  } catch {
    return 'employee';
  }
}

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser]               = useState(null);
  const [role, setRole]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function handleCredentialResponse(response) {
    const payload = parseJwt(response.credential);
    if (!payload) return;
    const userObj  = { name: payload.name, email: payload.email, picture: payload.picture };
    const userRole = await checkRole(payload.email);
    setUser(userObj);
    setRole(userRole);
    localStorage.setItem('hr_user', JSON.stringify({ user: userObj, role: userRole }));
  }

  useEffect(() => {
    // restore session
    const saved = localStorage.getItem('hr_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setRole(parsed.role);
        setAuthLoading(false);
        return;
      } catch { localStorage.removeItem('hr_user'); }
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setAuthLoading(false);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const logout = useCallback(() => {
    if (window.google) window.google.accounts.id.disableAutoSelect();
    setUser(null);
    setRole(null);
    localStorage.removeItem('hr_user');
  }, []);

  return { user, role, authLoading, logout, handleCredentialResponse };
}
