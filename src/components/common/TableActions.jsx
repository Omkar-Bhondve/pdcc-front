import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from './Button';
import { PermissionGuard } from '../auth/PermissionGuard';

export const TableActions = ({
    onView,
    onEdit,
    onDelete,
    viewPermission,
    editPermission,
    deletePermission,
    customActions
}) => {
    return (
        <div className="flex items-center gap-3">
            {customActions}

            {onView && (
                <PermissionGuard permissions={viewPermission} fallback={null}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onView}
                        title="View"
                        className="w-8 h-8 p-0 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent active:scale-95 transition-all duration-150 shadow-sm"
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Button>
                </PermissionGuard>
            )}

            {onEdit && (
                <PermissionGuard permissions={editPermission} fallback={null}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        title="Edit"
                        className="w-8 h-8 p-0 rounded-lg bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 border border-transparent active:scale-95 transition-all duration-150 shadow-sm"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </PermissionGuard>
            )}

            {onDelete && (
                <PermissionGuard permissions={deletePermission} fallback={null}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        title="Delete"
                        className="w-8 h-8 p-0 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent active:scale-95 transition-all duration-150 shadow-sm"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </PermissionGuard>
            )}
        </div>
    );
};