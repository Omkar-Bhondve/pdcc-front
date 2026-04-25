import React from 'react';
import { cn } from '../../utils/cn';

export const Card = React.forwardRef(
  ({ className, title, description, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md',
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="flex flex-col space-y-1.5 p-4 md:p-6 pb-2 md:pb-2">
            {title && (
              <h3 className="text-lg md:text-xl font-semibold leading-none tracking-tight text-slate-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
        )}
        <div className="p-4 md:p-6 pt-2 md:pt-2">{children}</div>
        {footer && (
          <div className="border-t border-slate-100 p-4 md:p-6 pt-4 bg-slate-50/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
