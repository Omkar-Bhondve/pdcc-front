import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(
    ({ className, label, error, rows = 3, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    rows={rows}
                    className={cn(
                        'flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm resize-y',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';