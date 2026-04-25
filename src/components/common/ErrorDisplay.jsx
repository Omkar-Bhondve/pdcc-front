import React from 'react';
import { AlertCircle, X, Clock, Shield } from 'lucide-react';
import { formatErrorMessage, formatRetryTime } from '../../utils/errorUtils';
import { PERMISSION_DESCRIPTIONS } from '../../config/permissions';

/**
 * Standardized error display component
 * Shows consistent error messages with correlation ID and field errors
 */
export const ErrorDisplay = ({ 
    error, 
    onClose, 
    showCorrelationId = false,
    variant = 'default' // 'default', 'compact', 'inline'
}) => {
    if (!error) return null;

    const message = formatErrorMessage(error);
    const hasFieldErrors = error.hasFieldErrors && error.fieldErrors?.length > 0;

    const variants = {
        default: 'p-4 bg-red-50 border border-red-200 rounded-lg',
        compact: 'p-2 bg-red-50 border border-red-200 rounded',
        inline: 'text-red-600 text-sm'
    };

    const iconVariants = {
        default: 'w-5 h-5 text-red-500',
        compact: 'w-4 h-4 text-red-500',
        inline: 'w-3 h-3 text-red-500'
    };

    const textVariants = {
        default: 'text-red-800 text-sm',
        compact: 'text-red-700 text-xs',
        inline: 'text-red-600 text-sm'
    };

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-1">
                <AlertCircle className={iconVariants[variant]} />
                <span className={textVariants[variant]}>{message}</span>
                {showCorrelationId && error.correlationId && (
                    <span className="text-red-500 text-xs ml-1">
                        (ID: {error.correlationId})
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={variants[variant] + ' relative'}>
            <div className="flex items-start gap-3">
                <AlertCircle className={iconVariants[variant] + ' flex-shrink-0 mt-0.5'} />
                <div className="flex-1 min-w-0">
                    <p className={textVariants[variant]}>{message}</p>
                    
                    {/* Field-specific errors */}
                    {hasFieldErrors && (
                        <ul className="mt-2 space-y-1">
                            {error.fieldErrors.map((fieldError, index) => (
                                <li key={index} className="text-red-600 text-xs flex items-start gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0 mt-1.5" />
                                    <span>
                                        <strong>{fieldError.field}:</strong> {fieldError.message}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    {/* Permission Error */}
                    {error.isPermissionError && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-amber-800 font-medium text-sm">Permission Required</p>
                                    {error.permissionName && (
                                        <p className="text-amber-700 text-xs mt-1">
                                            Required: <code className="bg-amber-100 px-1 py-0.5 rounded">{error.permissionName}</code>
                                        </p>
                                    )}
                                    {PERMISSION_DESCRIPTIONS[error.permissionName] && (
                                        <p className="text-amber-600 text-xs mt-1">
                                            {PERMISSION_DESCRIPTIONS[error.permissionName]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Retry Time */}
                    {error.retryAfter && (
                        <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Retry in {formatRetryTime(error.retryAfter)}</span>
                        </div>
                    )}
                    
                    {/* Correlation ID */}
                    {showCorrelationId && error.correlationId && (
                        <p className="mt-2 text-red-500 text-xs">
                            Error ID: {error.correlationId}
                        </p>
                    )}
                </div>
                
                {/* Close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-red-400 hover:text-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * Form field error display
 */
export const FieldError = ({ error, fieldName }) => {
    if (!error?.hasFieldErrors) return null;
    
    const fieldError = error.fieldErrors?.find(err => err.field === fieldName);
    if (!fieldError) return null;

    return (
        <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-red-600 text-xs">{fieldError.message}</span>
        </div>
    );
};

export default ErrorDisplay;
