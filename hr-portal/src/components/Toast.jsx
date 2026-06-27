import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  const bg = type === 'success' ? 'bg-[#2d6a4f]' : type === 'error' ? 'bg-red-800' : 'bg-[#1a3d2b]';

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] ${bg} text-white text-sm font-medium px-6 py-3 rounded-lg shadow-xl animate-fade-up`}>
      {message}
    </div>
  );
}
