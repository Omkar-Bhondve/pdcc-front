import api from './api';

// Centralized authentication service
export const authService = {
  // Login with proper error handling
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Logout with cleanup
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout API fails, clear local tokens
      console.error('Logout API failed:', error);
    }
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await api.post('/auth/admin/change-password', passwords);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  // Get current user permissions
  getMyPermissions: async () => {
    const response = await api.get('/admin/permissions/my-permissions');
    return response.data.data;
  }
};

export default authService;
