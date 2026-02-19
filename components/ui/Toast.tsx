import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border-l-4 animate-[slideUp_0.3s_ease]
      ${type === 'success' 
        ? 'bg-light-card dark:bg-ice-card border-ice-success text-light-text dark:text-white' 
        : 'bg-light-card dark:bg-ice-card border-ice-danger text-light-text dark:text-white'}
    `}>
      {type === 'success' ? <CheckCircle size={18} className="text-ice-success" /> : <XCircle size={18} className="text-ice-danger" />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};