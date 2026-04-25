import { useSelector } from 'react-redux';
import { selectUser, selectPermissions, selectIsAuthenticated } from '../redux/slices/authSlice';
import { createPermissionChecker } from '../utils/rbac';

// Centralized authentication hook
export const useAuth = () => {
    const user = useSelector(selectUser);
    const permissions = useSelector(selectPermissions);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    // Create permission checker with current user data
    const permissionChecker = createPermissionChecker(user);
    
    // Enhanced permission checker with wildcard support
    const hasPermission = (permission) => {
        if (!user || !permissions) return false;

        const requiredPermissions = Array.isArray(permission) ? permission : [permission];
        const userPermissions = permissions || [];

        // Check if user has any of the required permissions
        return requiredPermissions.some((required) => {
            // Direct match
            if (userPermissions.includes(required)) {
                return true;
            }

            // Check wildcard permissions
            for (const userPerm of userPermissions) {
                // Full wildcard (superadmin)
                if (userPerm === '*') {
                    return true;
                }

                // Module wildcard (e.g., 'users.*' matches 'users.view')
                if (userPerm.endsWith('.*')) {
                    const prefix = userPerm.slice(0, -1); // Remove '*'
                    if (required.startsWith(prefix)) {
                        return true;
                    }
                }

                // Action wildcard (e.g., '*.view' matches 'users.view')
                if (userPerm.startsWith('*.')) {
                    const suffix = userPerm.slice(1); // Remove '*'
                    if (required.endsWith(suffix)) {
                        return true;
                    }
                }
            }

            return false;
        });
    };
    
    return {
        // User data
        user,
        isAuthenticated,
        permissions,
        
        // Permission methods (enhanced with wildcard support)
        hasPermission,
        hasAllPermissions: permissionChecker.hasAllPermissions,
        hasPermissionGroup: permissionChecker.hasPermissionGroup,
        canAccess: permissionChecker.canAccess,
        
        // Role checks
        isSuperAdmin: permissionChecker.isSuperAdmin,
        isAdmin: permissionChecker.isAdmin,
        isManagerOrAbove: permissionChecker.isManagerOrAbove,
        
        // User info
        userId: user?.user_id,
        userName: user?.full_name,
        userEmail: user?.email,
        userRole: user?.role,
        
        // Authentication status
        isLoading: !user && isAuthenticated
    };
};

// Permission-only hook for components that just need permission checking
export const usePermissions = () => {
    const permissions = useSelector(selectPermissions);
    
    return {
        permissions,
        hasPermission: (permission) => permissions.includes(permission),
        hasAllPermissions: (perms) => perms.every(p => permissions.includes(p)),
        hasAnyPermission: (perms) => perms.some(p => permissions.includes(p))
    };
};

// Role-based hook
export const useRole = () => {
    const user = useSelector(selectUser);
    
    return {
        role: user?.role,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isAdmin: ['SUPER_ADMIN', 'ADMIN'].includes(user?.role),
        isManager: user?.role === 'MANAGER',
        isUser: user?.role === 'USER',
        isManagerOrAbove: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user?.role)
    };
};

export default useAuth;
