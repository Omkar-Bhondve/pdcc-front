/**
 * Frontend Permission Registry
 * Matches backend permissions for consistent UI control
 */

export const PERMISSIONS = {
  // Master permissions
  DISTRICTS_VIEW: 'masters.districts.view',
  DISTRICTS_MANAGE: 'masters.districts.manage',
  DISTRICTS_CREATE: 'masters.districts.create',
  DISTRICTS_EDIT: 'masters.districts.edit',
  DISTRICTS_DELETE: 'masters.districts.delete',
  
  DEPARTMENTS_VIEW: 'masters.departments.view',
  DEPARTMENTS_MANAGE: 'masters.departments.manage',
  DEPARTMENTS_CREATE: 'masters.departments.create',
  DEPARTMENTS_EDIT: 'masters.departments.edit',
  DEPARTMENTS_DELETE: 'masters.departments.delete',
  
  // User management
  USERS_VIEW: 'users.view',
  USERS_MANAGE: 'users.manage',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_TOGGLE_STATUS: 'users.toggle_status',
  
  // Role management
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  
  // System permissions
  SYSTEM_SETTINGS: 'system.settings',
  SYSTEM_LOGS: 'system.logs',
  SYSTEM_BACKUP: 'system.backup',
  
  // Authentication
  CHANGE_PASSWORD: 'auth.change_password',
  RESET_PASSWORD: 'auth.reset_password',
  
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_ANALYTICS: 'dashboard.analytics',
};

/**
 * Permission groups for easier management
 */
export const PERMISSION_GROUPS = {
  DISTRICTS: [
    PERMISSIONS.DISTRICTS_VIEW,
    PERMISSIONS.DISTRICTS_MANAGE,
    PERMISSIONS.DISTRICTS_CREATE,
    PERMISSIONS.DISTRICTS_EDIT,
    PERMISSIONS.DISTRICTS_DELETE,
  ],
  
  DEPARTMENTS: [
    PERMISSIONS.DEPARTMENTS_VIEW,
    PERMISSIONS.DEPARTMENTS_MANAGE,
    PERMISSIONS.DEPARTMENTS_CREATE,
    PERMISSIONS.DEPARTMENTS_EDIT,
    PERMISSIONS.DEPARTMENTS_DELETE,
  ],
  
  USERS: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_TOGGLE_STATUS,
  ],
  
  ROLES: [
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_EDIT,
    PERMISSIONS.ROLES_DELETE,
  ],
  
  SYSTEM: [
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.SYSTEM_BACKUP,
  ],
};

/**
 * Permission descriptions for UI
 */
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.DISTRICTS_VIEW]: 'View districts list',
  [PERMISSIONS.DISTRICTS_MANAGE]: 'Manage districts (full access)',
  [PERMISSIONS.DISTRICTS_CREATE]: 'Create new districts',
  [PERMISSIONS.DISTRICTS_EDIT]: 'Edit district information',
  [PERMISSIONS.DISTRICTS_DELETE]: 'Delete districts',
  
  [PERMISSIONS.DEPARTMENTS_VIEW]: 'View departments list',
  [PERMISSIONS.DEPARTMENTS_MANAGE]: 'Manage departments (full access)',
  [PERMISSIONS.DEPARTMENTS_CREATE]: 'Create new departments',
  [PERMISSIONS.DEPARTMENTS_EDIT]: 'Edit department information',
  [PERMISSIONS.DEPARTMENTS_DELETE]: 'Delete departments',
  
  [PERMISSIONS.USERS_VIEW]: 'View users list',
  [PERMISSIONS.USERS_MANAGE]: 'Manage users (full access)',
  [PERMISSIONS.USERS_CREATE]: 'Create new users',
  [PERMISSIONS.USERS_EDIT]: 'Edit user information',
  [PERMISSIONS.USERS_DELETE]: 'Delete users',
  [PERMISSIONS.USERS_TOGGLE_STATUS]: 'Activate/deactivate users',
  
  [PERMISSIONS.ROLES_VIEW]: 'View roles list',
  [PERMISSIONS.ROLES_MANAGE]: 'Manage roles (full access)',
  [PERMISSIONS.ROLES_CREATE]: 'Create new roles',
  [PERMISSIONS.ROLES_EDIT]: 'Edit role information',
  [PERMISSIONS.ROLES_DELETE]: 'Delete roles',
  
  [PERMISSIONS.SYSTEM_SETTINGS]: 'Access system settings',
  [PERMISSIONS.SYSTEM_LOGS]: 'View system logs',
  [PERMISSIONS.SYSTEM_BACKUP]: 'Create system backups',
  
  [PERMISSIONS.CHANGE_PASSWORD]: 'Change own password',
  [PERMISSIONS.RESET_PASSWORD]: 'Reset user passwords',
  
  [PERMISSIONS.DASHBOARD_VIEW]: 'View dashboard',
  [PERMISSIONS.DASHBOARD_ANALYTICS]: 'Access dashboard analytics',
};

/**
 * Helper function to check if permission exists
 */
export const isValidPermission = (permission) => {
  return Object.values(PERMISSIONS).includes(permission);
};

/**
 * Get all permissions in an array
 */
export const getAllPermissions = () => {
  return Object.values(PERMISSIONS);
};

/**
 * Get permissions by group
 */
export const getPermissionsByGroup = (group) => {
  return PERMISSION_GROUPS[group] || [];
};
