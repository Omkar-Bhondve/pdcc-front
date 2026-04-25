import api from './api';

// Dashboard service with proper error handling and response formatting
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/admin/dashboard/activity', {
      params: { limit }
    });
    return response.data;
  }
};
