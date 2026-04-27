import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/auth.utils';
import { DEV_BACKEND_ORIGIN, API_BASE_PATH } from '../config/appConfig';
import { getUserFriendlyError } from '../utils/errorUtils';
import toast from 'react-hot-toast';

// Helper function to get CSRF token from cookies
const getCSRFCookie = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrf-token') {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Base URL configuration
const API_BASE_URL = import.meta.env.DEV 
    ? '/api'  // Use proxy in development
    : (API_BASE_PATH || '/api');

// Centralized axios instance with proper configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15 seconds timeout for production reliability
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies
});

// Elegant refresh token management with queue
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Add auth token and CSRF token
api.interceptors.request.use(
    (config) => {
        // Add auth token
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing requests
        const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
        if (stateChangingMethods.includes(config.method?.toUpperCase())) {
            const csrfToken = getCSRFCookie();
            if (csrfToken) {
                config.headers['x-csrf-token'] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh elegantly
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Log error for debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        });
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints - let the app handle auth errors naturally
            if (originalRequest.url?.includes('/auth/')) {
                return Promise.reject(error);
            }
            
            originalRequest._retry = true;
            
            if (isRefreshing) {
                // Queue the request if refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            
            isRefreshing = true;
            
            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                
                // Refresh token using base axios to avoid infinite loop
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken,
                }, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                });
                
                // Extract tokens from ApiResponse structure
                const tokens = response.data.data?.tokens;
                if (!tokens) {
                    throw new Error('No tokens received in expected format');
                }
                
                const { access_token, refresh_token: newRefreshToken } = tokens;
                
                if (!access_token) {
                    throw new Error('No access token received');
                }
                
                setTokens(access_token, newRefreshToken);
                
                // Show toast notification for token refresh
                toast.success('Session refreshed');
                
                // Process queued requests
                processQueue(null, access_token);
                
                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect
                processQueue(refreshError, null);
                clearTokens();
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Handle other errors with standardized error handling
        // Don't override error message for auth endpoints - preserve original error
        if (!originalRequest.url?.includes('/auth/')) {
            error.message = getUserFriendlyError(error);
        }
        return Promise.reject(error);
    }
);

export default api;
