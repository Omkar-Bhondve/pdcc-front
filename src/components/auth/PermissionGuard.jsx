import React from 'react';
import { useAppSelector } from '../../redux/store';
import { hasPermission, hasAllPermissions, hasPermissionGroup } from '../../utils/rbac';
import { PERMISSIONS, PERMISSION_GROUPS } from '../../config/permissions';

/**
 * Centralized Permission Guard Component with RBAC Integration
 */

export const PermissionGuard = ({
    permissions,
    permissionGroup,
    children,
    fallback = null,
    requireAll = false, // if true, user must have ALL permissions
    requireGroup = false // if true, user must have ALL permissions in group
}) => {
    const { user } = useAppSelector((state) => state.auth);
    
    if (!user) return <>{fallback}</>;

    const userPermissions = user.permissions || [];
    let hasRequiredPermission = false;

    // Check by permission group first (highest priority)
    if (permissionGroup && requireGroup) {
        hasRequiredPermission = hasPermissionGroup(userPermissions, permissionGroup);
    } else if (permissionGroup) {
        // For groups, we typically require all permissions in the group
        hasRequiredPermission = hasPermissionGroup(userPermissions, permissionGroup);
    }
    // Check by specific permissions
    else if (permissions) {
        const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
        
        if (requireAll) {
            // User must have ALL required permissions (AND logic)
            hasRequiredPermission = hasAllPermissions(userPermissions, requiredPermissions);
        } else {
            // User must have at least ONE required permission (OR logic)
            hasRequiredPermission = hasPermission(userPermissions, requiredPermissions);
        }
    }

    if (hasRequiredPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

// Higher-order component for route protection
export const withPermissionGuard = (WrappedComponent, permissionConfig) => {
    return (props) => (
        <PermissionGuard {...permissionConfig}>
            <WrappedComponent {...props} />
        </PermissionGuard>
    );
};


export default PermissionGuard;
