export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_DATA_KEY = 'user_data';

// Helper to safely parse JSON
const safeJsonParse = (value) => {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch (e) {
        return null;
    }
};

export const setTokens = (accessToken, refreshToken) => {
    // Store tokens in localStorage - let backend control expiration via JWT validation
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
};

export const getRefreshToken = () => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    return token;
};

export const setUser = (user) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return safeJsonParse(userData);
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
};

export const isAuthenticated = () => {
    return !!getAccessToken();
};

export const logout = () => {
    clearTokens();
};