import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        customVerificationModal: 'max-w-7xl',
        customAllotmentModal: 'max-w-4xl',
        generalLargeModal : 'max-w-5xl',
        full: 'max-w-full m-4',
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-in fade-in bg-black/60 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

            <div
                className={cn(
                    'relative flex flex-col w-full bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95 rounded-xl md:rounded-2xl max-h-[90vh] md:max-h-[85vh]',
                    sizes[size],
                    // On mobile, if size is large, maybe go full screen or nearly so
                    size === 'full' ? 'h-full m-0 rounded-none' : ''
                )}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-slate-100 p-4 md:p-6 flex-shrink-0">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-6">{title}</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto overscroll-contain flex-1">
                    {children}
                </div>

                {footer && (
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-4 md:p-6 rounded-b-xl md:rounded-b-2xl flex-shrink-0 pb-safe">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
