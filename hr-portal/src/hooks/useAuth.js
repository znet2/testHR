import { useState, useCallback } from 'react';

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

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_user');
      return saved ? JSON.parse(saved).user : null;
    } catch { return null; }
  });
  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_user');
      return saved ? JSON.parse(saved).role : null;
    } catch { return null; }
  });

  const onGoogleSuccess = useCallback(async (decoded) => {
    try {
      const userObj  = { name: decoded.name, email: decoded.email, picture: decoded.picture };
      const userRole = await checkRole(decoded.email);
      setUser(userObj);
      setRole(userRole);
      localStorage.setItem('hr_user', JSON.stringify({ user: userObj, role: userRole }));
    } catch (e) {
      console.error('Login error', e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('hr_user');
  }, []);

  return { user, role, authLoading: false, onGoogleSuccess, logout };
}
