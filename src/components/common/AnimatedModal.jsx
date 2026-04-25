import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AnimatedModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'max-w-4xl',
  showHeader = true,
  headerActions = null
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Trigger animation after a brief delay to ensure transition
      setTimeout(() => setIsAnimating(true), 10);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      // Wait for exit animation before hiding
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'unset';
      }, 300);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isAnimating 
          ? 'bg-black/60 backdrop-blur-sm opacity-100' 
          : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full ${sizeClasses[size] || size} bg-white rounded-xl md:rounded-2xl shadow-2xl transition-all duration-300 transform flex flex-col max-h-[90vh] md:max-h-[85vh] ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 truncate pr-4 leading-6">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              {headerActions}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative flex-1 overflow-hidden flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedModal;
