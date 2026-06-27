import { useEffect } from 'react';

export default function Modal({ open, onClose, title, subtitle, icon, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-[slideUp_0.2s_ease]">
        <div className="flex items-start gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
          <span className="text-2xl leading-none mt-0.5">{icon}</span>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#1a3d2b]">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs flex items-center justify-center transition cursor-pointer">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
