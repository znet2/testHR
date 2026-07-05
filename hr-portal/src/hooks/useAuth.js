import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';

const kc = new Keycloak({
  url:      'http://localhost:8080',
  realm:    'hr-portal',
  clientId: 'hr-portal-app',
});

export function useAuth() {
  const [user, setUser]               = useState(null);
  const [role, setRole]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const initialized                   = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const hasCode = window.location.search.includes('code=') ||
                    window.location.search.includes('session_state=');

    kc.init({
      onLoad:           hasCode ? 'login-required' : undefined,
      checkLoginIframe: false,
      pkceMethod:       'S256',
      responseMode:     'query',
    }).then(authenticated => {
      if (authenticated) {
        const t = kc.tokenParsed;
        const roles = t?.realm_access?.roles || [];
        setUser({
          name:  t?.name || t?.preferred_username || '',
          email: t?.email || '',
        });
        setRole(roles.includes('hr') ? 'hr' : 'employee');
        window.history.replaceState({}, '', window.location.pathname);
      }
      setAuthLoading(false);
    }).catch(err => {
      console.error('Keycloak init error', err);
      setAuthLoading(false);
    });
  }, []);

  const login  = () => kc.login({ redirectUri: window.location.origin + '/' });
  const logout = () => kc.logout({ redirectUri: window.location.origin + '/' });

  return { user, role, authLoading, login, logout };
}
