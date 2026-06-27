import { useState, useEffect, useCallback } from 'react';

// sync page state กับ browser history
export function useHistory(initial = 'home') {
  const [page, setPageState] = useState(() => {
    // อ่านจาก history state ถ้ามี (กรณี refresh)
    return window.history.state?.page || initial;
  });

  // push page ใหม่เข้า history
  const navigate = useCallback((newPage) => {
    window.history.pushState({ page: newPage }, '', `#${newPage}`);
    setPageState(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ฟัง popstate (กด back/forward ของ browser)
  useEffect(() => {
    function onPop(e) {
      const p = e.state?.page || initial;
      setPageState(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.addEventListener('popstate', onPop);

    // set initial state ถ้ายังไม่มี
    if (!window.history.state?.page) {
      window.history.replaceState({ page: initial }, '', `#${initial}`);
    }

    return () => window.removeEventListener('popstate', onPop);
  }, [initial]);

  return { page, navigate };
}
