import React from 'react';
import { PermissionGuard } from '../auth/PermissionGuard';
import { Button } from './Button';
import { Lock } from 'lucide-react';

/**
 * ActionButton with Permission Guard
 * Automatically disables/hides actions based on user permissions
 */
export const ActionButton = ({
    permission,
    permissions,
    permissionGroup,
    children,
    disabled = false,
    showDisabled = true, // show disabled button vs hide completely
    disabledMessage = 'You do not have permission to perform this action',
    ...buttonProps
}) => {
    const fallback = showDisabled ? (
        <Button
            {...buttonProps}
            disabled={true}
            className={`${buttonProps.className || ''} opacity-50 cursor-not-allowed`}
            title={disabledMessage}
        >
            <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {children}
            </div>
        </Button>
    ) : null;

    return (
        <PermissionGuard
            permissions={permissions || permission}
            permissionGroup={permissionGroup}
            fallback={fallback}
        >
            <Button {...buttonProps} disabled={disabled}>
                {children}
            </Button>
        </PermissionGuard>
    );
};

/**
 * DeleteButton with permission guard
 */
export const DeleteButton = ({ permission, ...props }) => (
    <ActionButton
        permission={permission}
        variant="danger"
        size="sm"
        {...props}
    />
);

/**
 * EditButton with permission guard
 */
export const EditButton = ({ permission, ...props }) => (
    <ActionButton
        permission={permission}
        variant="secondary"
        size="sm"
        {...props}
    />
);

/**
 * CreateButton with permission guard
 */
export const CreateButton = ({ permission, ...props }) => (
    <ActionButton
        permission={permission}
        variant="primary"
        {...props}
    />
);
