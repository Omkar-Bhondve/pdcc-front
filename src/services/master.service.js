import api from './api';

// Centralized master data service for districts and departments
export const masterService = {
  // ==================== DISTRICTS ====================
  
  // Get all districts with pagination and filtering
  getDistricts: async (params = {}) => {
    const response = await api.get('/admin/masters/districts', { params });
    return response.data.data || response.data; // Handle both paginated and non-paginated responses
  },

  // Get district by ID
  getDistrictById: async (id) => {
    const response = await api.get(`/admin/masters/districts/${id}`);
    return response.data.data;
  },

  // Create new district
  createDistrict: async (districtData) => {
    const response = await api.post('/admin/masters/districts', districtData);
    return response.data;
  },

  // Update district
  updateDistrict: async (id, districtData) => {
    const response = await api.put(`/admin/masters/districts/${id}`, districtData);
    return response.data;
  },

  // Delete district (soft delete)
  deleteDistrict: async (id) => {
    const response = await api.delete(`/admin/masters/districts/${id}`);
    return response.data;
  },

  // ==================== DEPARTMENTS ====================
  
  // Get all departments with pagination and filtering
  getDepartments: async (params = {}) => {
    const response = await api.get('/admin/masters/departments', { params });
    return response.data.data || response.data; // Handle both paginated and non-paginated responses
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    const response = await api.get(`/admin/masters/departments/${id}`);
    return response.data.data;
  },

  // Create new department
  createDepartment: async (departmentData) => {
    const response = await api.post('/admin/masters/departments', departmentData);
    return response.data;
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    const response = await api.put(`/admin/masters/departments/${id}`, departmentData);
    return response.data;
  },

  // Delete department (soft delete)
  deleteDepartment: async (id) => {
    const response = await api.delete(`/admin/masters/departments/${id}`);
    return response.data;
  }
};

export default masterService;
