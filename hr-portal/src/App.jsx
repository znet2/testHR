import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import LeavePage from './pages/LeavePage';
import CalendarPage from './pages/CalendarPage';
import ExpensePage from './pages/ExpensePage';
import { useHistory } from './hooks/useHistory';

export default function App() {
  const { page, navigate } = useHistory('home');
  const [toast, setToast]  = useState({ msg: '', type: '' });

  const showToast = useCallback((msg, type = '') => setToast({ msg, type }), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar page={page} onHome={() => navigate('home')} />
      <main>
        {page === 'home'     && <HomePage onNavigate={navigate} />}
        {page === 'leave'    && <LeavePage onShowCalendar={() => navigate('calendar')} onBack={() => navigate('home')} onToast={showToast} />}
        {page === 'calendar' && <CalendarPage onBack={() => navigate('leave')} />}
        {page === 'expense'  && <ExpensePage onBack={() => navigate('home')} />}
      </main>
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />
    </div>
  );
}
