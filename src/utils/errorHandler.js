import toast from 'react-hot-toast';

// Centralized error handling utility
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    let message = defaultMessage;
    
    // Handle different error types
    if (error.response) {
        // Server responded with error
        message = error.response.data?.message || error.response.statusText || 'Server error';
        
        // Handle specific status codes
        switch (error.response.status) {
            case 401:
                message = 'Session expired. Please login again.';
                break;
            case 403:
                message = 'You do not have permission to perform this action.';
                break;
            case 404:
                message = 'Resource not found.';
                break;
            case 422:
                message = error.response.data?.message || 'Invalid data provided.';
                break;
            case 429:
                message = 'Too many requests. Please try again later.';
                break;
            case 500:
                message = 'Server error. Please try again later.';
                break;
        }
    } else if (error.request) {
        // Request was made but no response received
        message = 'Network error. Please check your connection.';
    } else if (error.message) {
        // Other errors
        message = error.message;
    }
    
    // Show toast notification
    toast.error(message);
    
    return message;
};

// Success handler
export const handleSuccess = (message, options = {}) => {
    toast.success(message, options);
};

// Loading handler
export const handleLoading = (message, options = {}) => {
    return toast.loading(message, options);
};

// Promise wrapper with automatic error handling
export const withErrorHandling = async (promise, options = {}) => {
    const { 
        successMessage, 
        errorMessage, 
        showSuccessToast = true, 
        showErrorToast = true 
    } = options;
    
    try {
        const result = await promise;
        
        if (successMessage && showSuccessToast) {
            handleSuccess(successMessage);
        }
        
        return result;
    } catch (error) {
        if (showErrorToast) {
            handleApiError(error, errorMessage);
        }
        throw error; // Re-throw for further handling if needed
    }
};

// Form validation error handler
export const handleFormErrors = (error) => {
    if (error.response?.status === 422 && error.response.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        
        errorMessages.forEach(message => {
            toast.error(message);
        });
        
        return errors;
    }
    
    handleApiError(error);
    return null;
};

export default {
    handleApiError,
    handleSuccess,
    handleLoading,
    withErrorHandling,
    handleFormErrors
};
