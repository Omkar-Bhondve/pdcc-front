import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { setTokens, setUser, clearTokens, getAccessToken, USER_DATA_KEY } from '../../utils/auth.utils';

const initialState = {
    user: null,
    isAuthenticated: !!getAccessToken(),
    loading: false,
    error: null,
    permissions: [],
};

// Centralized login with proper error handling and RBAC integration
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            // Production: Remove debug log
            const response = await authService.login(credentials);
            
            // Handle the actual response structure
            const data = response.data || response;
            // Production: Remove debug log
            
            if (data.tokens) {
                // Production: Remove debug log
                setTokens(data.tokens.access_token, data.tokens.refresh_token);
                setUser(data.user);
                // Production: Remove debug log
            }
            
            return data;
        } catch (error) {
            console.error('❌ loginUser failed:', error);
            // Use the standardized error format from the API
            // For auth endpoints, the error.response.data.error should be preserved
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            // Production: Remove debug log
            return rejectWithValue(errorMessage);
        }
    }
);

// Centralized logout with cleanup
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            // Always clear local tokens regardless of API success
            clearTokens();
            dispatch(logout());
        }
    }
);

// Restore user from localStorage on app start
export const restoreUser = createAsyncThunk(
    'auth/restoreUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = getAccessToken();
            
            if (!token) {
                throw new Error('No token found');
            }
            
            // Return user data from localStorage
            const userStr = localStorage.getItem(USER_DATA_KEY);
            
            if (!userStr) {
                throw new Error('No user data found');
            }
            
            const user = JSON.parse(userStr);
            
            return {
                ...user,
                permissions: user.permissions || []
            };
        } catch (error) {
            // Clear invalid tokens
            clearTokens();
            return rejectWithValue('Session expired. Please login again.');
        }
    }
);

// Change password
export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwords, { rejectWithValue }) => {
        try {
            const response = await authService.changePassword(passwords);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password change failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Manual logout action
        logout: (state) => {
            clearTokens();
            state.user = null;
            state.permissions = [];
            state.isAuthenticated = false;
            state.error = null;
        },
        
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
        
        // Set user permissions manually
        setPermissions: (state, action) => {
            state.permissions = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.permissions = action.payload.user.permissions || [];
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.permissions = [];
            })
            
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.permissions = [];
                state.isAuthenticated = false;
            })
            
            // Restore user
            .addCase(restoreUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.permissions = action.payload.permissions || [];
            })
            .addCase(restoreUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
                state.user = null;
                state.permissions = [];
            })
            
            // Change password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, setPermissions } = authSlice.actions;

// Selectors for easy access
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectPermissions = (state) => state.auth.permissions;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
