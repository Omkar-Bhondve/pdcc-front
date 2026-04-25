// Centralized Role-Based Access Control utilities

// Permission checking with multiple permission support
export const hasPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (!requiredPermissions) return false;
  
  // Support string or array input
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  // Check if user has ANY of the required permissions (OR logic)
  return required.some(permission => userPermissions.includes(permission));
};

// Check if user has ALL required permissions (AND logic)
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (!requiredPermissions) return false;
  
  const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  // Check if user has ALL required permissions
  return required.every(permission => userPermissions.includes(permission));
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  // User management
  USER_MANAGEMENT: ['users.view', 'users.create', 'users.edit', 'users.delete'],
  USER_VIEW: ['users.view'],
  
  // Role management
  ROLE_MANAGEMENT: ['roles.view', 'roles.manage'],
  ROLE_VIEW: ['roles.view'],
  
  // Master data
  MASTER_MANAGEMENT: ['masters.districts.manage', 'masters.departments.manage'],
  MASTER_VIEW: ['masters.districts.view', 'masters.departments.view'],
  
  // Dashboard
  DASHBOARD: ['dashboard.view'],
  
  // All permissions (for super admin)
  ALL: '*' // This will be handled specially
};

// Check permission by group
export const hasPermissionGroup = (userPermissions, group) => {
  if (group === '*') return true; // Super admin check
  
  const permissions = PERMISSION_GROUPS[group];
  if (!permissions) return false;
  
  return hasAllPermissions(userPermissions, permissions);
};

// Get user's highest role level
export const getUserRoleLevel = (user) => {
  if (!user || !user.role) return 0;
  
  const roleLevels = {
    'SUPER_ADMIN': 4,
    'ADMIN': 3,
    'MANAGER': 2,
    'USER': 1
  };
  
  return roleLevels[user.role] || 0;
};

// Check if user can access resource based on role hierarchy
export const canAccessResource = (user, resourceRoleLevel = 1) => {
  return getUserRoleLevel(user) >= resourceRoleLevel;
};

// Centralized permission checker for components
export const createPermissionChecker = (user) => ({
  hasPermission: (permission) => hasPermission(user.permissions, permission),
  hasAllPermissions: (permissions) => hasAllPermissions(user.permissions, permissions),
  hasPermissionGroup: (group) => hasPermissionGroup(user.permissions, group),
  canAccess: (resourceRoleLevel) => canAccessResource(user, resourceRoleLevel),
  isSuperAdmin: () => user.role === 'SUPER_ADMIN',
  isAdmin: () => ['SUPER_ADMIN', 'ADMIN'].includes(user.role),
  isManagerOrAbove: () => getUserRoleLevel(user) >= 2
});

export default {
  hasPermission,
  hasAllPermissions,
  hasPermissionGroup,
  getUserRoleLevel,
  canAccessResource,
  createPermissionChecker,
  PERMISSION_GROUPS
};
