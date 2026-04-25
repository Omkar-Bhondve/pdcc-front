/**
 * Standardized Error Handling Utilities
 * Provides consistent error parsing and display across the frontend
 */

/**
 * Standardized error response structure from backend
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {string} error - Main error message
 * @property {string} correlationId - Request correlation ID
 * @property {Array<Object>} [errors] - Field-specific validation errors
 * @property {string} [stack] - Error stack (development only)
 */

/**
 * Parse and format error response from backend
 * @param {Object} error - Axios error object
 * @returns {Object} Parsed error information
 */
export const parseApiError = (error) => {
    const response = error.response?.data;
    
    // Handle backend standardized error format
    if (response?.success === false) {
        // Check for permission errors
        const isPermissionError = response.error?.includes('Permission denied');
        const permissionName = isPermissionError ? response.error.split(':')[1]?.trim() : null;
        
        return {
            message: response.error || 'An error occurred',
            correlationId: response.correlationId,
            fieldErrors: response.errors || [],
            hasFieldErrors: response.errors && response.errors.length > 0,
            status: error.response?.status,
            isValidationError: response.errors && response.errors.length > 0,
            isPermissionError,
            permissionName,
            retryAfter: response.retryAfter || null
        };
    }
    
    // Handle legacy message format
    if (response?.message) {
        return {
            message: response.message,
            correlationId: response.correlationId,
            fieldErrors: [],
            hasFieldErrors: false,
            status: error.response?.status,
            isValidationError: false
        };
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
        return {
            message: 'Request timeout. Please try again.',
            correlationId: null,
            fieldErrors: [],
            hasFieldErrors: false,
            status: null,
            isValidationError: false
        };
    }
    
    if (error.code === 'NETWORK_ERROR') {
        return {
            message: 'Network error. Please check your connection.',
            correlationId: null,
            fieldErrors: [],
            hasFieldErrors: false,
            status: null,
            isValidationError: false
        };
    }
    
    // Default fallback
    return {
        message: 'An unexpected error occurred. Please try again.',
        correlationId: null,
        fieldErrors: [],
        hasFieldErrors: false,
        status: null,
        isValidationError: false
    };
};

/**
 * Format retry time in user-friendly format
 * @param {number} seconds - Retry time in seconds
 * @returns {string} Formatted time string
 */
export const formatRetryTime = (seconds) => {
    if (!seconds || seconds <= 0) return '';
    
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
};

/**
 * Format error message for display
 * @param {Object} parsedError - Parsed error from parseApiError
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (parsedError) => {
    let message = parsedError.message;
    
    // Add retry information if available
    if (parsedError.retryAfter) {
        const retryTime = formatRetryTime(parsedError.retryAfter);
        message += ` (Retry in ${retryTime})`;
    }
    
    if (parsedError.hasFieldErrors) {
        const fieldErrors = parsedError.fieldErrors.map(err => err.message).join(', ');
        message += `: ${fieldErrors}`;
    }
    
    return message;
};

/**
 * Get field-specific errors for form validation
 * @param {Object} parsedError - Parsed error from parseApiError
 * @returns {Object} Field errors object (field -> message)
 */
export const getFieldErrors = (parsedError) => {
    const fieldErrors = {};
    
    if (parsedError.hasFieldErrors) {
        parsedError.fieldErrors.forEach(err => {
            if (err.field) {
                fieldErrors[err.field] = err.message;
            }
        });
    }
    
    return fieldErrors;
};

/**
 * Check if error is a specific type
 * @param {Object} error - Axios error object
 * @param {string} type - Error type to check
 * @returns {boolean}
 */
export const isErrorType = (error, type) => {
    const parsedError = parseApiError(error);
    
    switch (type) {
        case 'validation':
            return parsedError.isValidationError;
        case 'network':
            return !error.response && (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR');
        case 'auth':
            return parsedError.status === 401 || parsedError.status === 403;
        case 'notFound':
            return parsedError.status === 404;
        case 'server':
            return (parsedError.status || 0) >= 500;
        default:
            return false;
    }
};

/**
 * Generate user-friendly error message with correlation ID
 * @param {Object} error - Axios error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyError = (error) => {
    const parsedError = parseApiError(error);
    let message = formatErrorMessage(parsedError);
    
    // Add correlation ID for debugging (only in development or for specific errors)
    if (parsedError.correlationId && (import.meta.env.DEV || parsedError.status >= 500)) {
        message += ` (ID: ${parsedError.correlationId})`;
    }
    
    return message;
};
