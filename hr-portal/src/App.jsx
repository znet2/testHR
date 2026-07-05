import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import LeavePage from './pages/LeavePage';
import CalendarPage from './pages/CalendarPage';
import ExpensePage from './pages/ExpensePage';
import LoginPage from './pages/LoginPage';
import ApprovalPage from './pages/ApprovalPage';
import MyLeavePage from './pages/MyLeavePage';
import { useHistory } from './hooks/useHistory';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { page, navigate } = useHistory('home');
  const [toast, setToast]  = useState({ msg: '', type: '' });
  const { user, role, authLoading, login, logout } = useAuth();

  const showToast = useCallback((msg, type = '') => setToast({ msg, type }), []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2d6a4f] rounded-full animate-spin"/>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={login} loading={false} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page={page} onHome={() => navigate('home')} user={user} role={role} onLogout={logout} />
      <main>
        {page === 'home'     && <HomePage onNavigate={navigate} role={role} user={user} />}
        {page === 'leave'    && (
          <LeavePage
            onShowCalendar={role === 'hr' ? () => navigate('calendar') : undefined}
            onBack={() => navigate('home')}
            onToast={showToast}
            role={role}
            user={user}
            onNavigate={navigate}
          />
        )}
        {page === 'calendar'  && role === 'hr' && <CalendarPage onBack={() => navigate('leave')} />}
        {page === 'calendar'  && role !== 'hr' && navigate('home')}
        {page === 'expense'   && <ExpensePage onBack={() => navigate('home')} />}
        {page === 'approval'  && role === 'hr' && <ApprovalPage onBack={() => navigate('home')} onToast={showToast} />}
        {page === 'approval'  && role !== 'hr' && navigate('home')}
        {page === 'myleave'   && <MyLeavePage onBack={() => navigate('home')} onToast={showToast} user={user} />}
      </main>
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
    </div>
  );
}
