import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp, ToastMessage } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-onam-gold shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-100';
      case 'error':
        return 'bg-rose-50 border-rose-200 text-rose-950 shadow-rose-100';
      case 'info':
        return 'bg-amber-50 border-amber-200 text-amber-950 shadow-amber-100';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-4 ${getStyles()}`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1 text-sm font-medium leading-5">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 hover:bg-black/5 p-1 rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
