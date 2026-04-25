import { useState, useCallback } from 'react';
import { parseApiError, formatErrorMessage, getFieldErrors, isErrorType } from '../utils/errorUtils';
import toast from 'react-hot-toast';

/**
 * Custom hook for consistent error handling in React components
 * Provides utilities for displaying errors, field validation, and error type checking
 */
export const useErrorHandler = () => {
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    /**
     * Handle API error and update state
     * @param {Object} error - Axios error object
     * @param {Object} options - Error handling options
     */
    const handleError = useCallback((error, options = {}) => {
        const {
            showToast = true,
            setFormErrors = true,
            logError = true
        } = options;

        const parsedError = parseApiError(error);
        
        // Update error state
        setError(parsedError);
        
        // Update field errors for forms
        if (setFormErrors && parsedError.hasFieldErrors) {
            setFieldErrors(getFieldErrors(parsedError));
        }
        
        // Show toast notification
        if (showToast) {
            const message = formatErrorMessage(parsedError);
            toast.error(message);
        }
        
        // Log error in development
        if (logError && import.meta.env.DEV) {
            console.error('API Error:', parsedError);
        }
        
        return parsedError;
    }, []);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
        setFieldErrors({});
    }, []);

    /**
     * Check if error is of specific type
     * @param {Object} error - Axios error object
     * @param {string} type - Error type
     * @returns {boolean}
     */
    const checkErrorType = useCallback((error, type) => {
        return isErrorType(error, type);
    }, []);

    /**
     * Get error message for display
     * @param {Object} error - Axios error object (optional, uses current error if not provided)
     * @returns {string}
     */
    const getErrorMessage = useCallback((errorObj = null) => {
        const targetError = errorObj || error;
        if (!targetError) return '';
        return formatErrorMessage(targetError);
    }, [error]);

    /**
     * Get field error message
     * @param {string} fieldName - Field name
     * @returns {string}
     */
    const getFieldError = useCallback((fieldName) => {
        return fieldErrors[fieldName] || '';
    }, [fieldErrors]);

    return {
        // State
        error,
        fieldErrors,
        hasError: !!error,
        hasFieldErrors: Object.keys(fieldErrors).length > 0,
        
        // Methods
        handleError,
        clearError,
        checkErrorType,
        getErrorMessage,
        getFieldError
    };
};

export default useErrorHandler;
