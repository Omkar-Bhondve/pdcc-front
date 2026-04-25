import api from './api';

// Centralized role and permission service for RBAC
export const roleService = {
  // ==================== ROLES ====================
  
  // Get all roles with pagination and filtering
  getRoles: async (params = {}) => {
    const response = await api.get('/admin/roles', { params });
    return response.data.data || response.data; // Handle both paginated and non-paginated responses
  },

  // Get role by ID with permissions
  getRoleById: async (id) => {
    const response = await api.get(`/admin/roles/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (roleData) => {
    const response = await api.post('/admin/roles', roleData);
    return response.data;
  },

  // Update role
  updateRole: async (id, roleData) => {
    const response = await api.put(`/admin/roles/${id}`, roleData);
    return response.data;
  },

  // Delete role (soft delete)
  deleteRole: async (id) => {
    const response = await api.delete(`/admin/roles/${id}`);
    return response.data;
  },

  // Assign permissions to role
  assignPermissions: async (roleId, permissionIds) => {
    const response = await api.post(`/admin/roles/${roleId}/permissions`, {
      permission_ids: permissionIds
    });
    return response.data;
  },

  // ==================== PERMISSIONS ====================
  
  // Get all permissions with optional module filter
  getPermissions: async (module) => {
    const params = module ? { module } : {};
    const response = await api.get('/admin/permissions', { params });
    return response.data;
  },

  // Sync permissions from registry
  syncPermissions: async () => {
    const response = await api.post('/admin/permissions/sync');
    return response.data;
  },

  // Get current user's permissions
  getMyPermissions: async () => {
    const response = await api.get('/admin/permissions/my-permissions');
    return response.data;
  },

  // Check if user has specific permission
  hasPermission: async (permissionCode) => {
    const permissions = await roleService.getMyPermissions();
    return permissions.includes(permissionCode);
  },

  // Get permissions by module
  getPermissionsByModule: async (module) => {
    const response = await api.get('/admin/permissions', { params: { module } });
    return response.data;
  }
};

export default roleService;
