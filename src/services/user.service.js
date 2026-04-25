import api from './api';

// Centralized user service with RBAC integration
export const userService = {
  // Get all users with pagination, search, and filtering
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user (soft delete)
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get users by role (for RBAC)
  getUsersByRole: async (roleId) => {
    const response = await api.get('/admin/users', { params: { role_id: roleId } });
    return response.data.data || response.data; // Handle both paginated and non-paginated responses
  },

  // Search users (centralized search)
  searchUsers: async (query, filters = {}) => {
    const params = { search: query, ...filters };
    const response = await api.get('/admin/users', { params });
    return response.data.data || response.data; // Handle both paginated and non-paginated responses
  }
};

export default userService;
