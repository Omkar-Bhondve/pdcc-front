import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
            
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2.5">
                        {variant === 'danger' && (
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                        )}
                        {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5 md:p-6">
                    <p className="text-slate-600 leading-relaxed text-base">{message}</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-4 md:p-5 bg-slate-50 border-t border-slate-100">
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className="w-full sm:w-auto shadow-sm"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};
