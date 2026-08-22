import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-onam-cream border border-onam-gold/30 rounded-2xl shadow-xl w-full max-w-lg z-10 overflow-hidden transform scale-100 transition-all duration-300 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-onam-gold/20 flex items-center justify-between bg-onam-cream-dark/50">
          <h3 className="font-serif font-bold text-lg text-onam-green">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-onam-charcoal/60 hover:text-onam-green hover:bg-black/5 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
};
export default Modal;
