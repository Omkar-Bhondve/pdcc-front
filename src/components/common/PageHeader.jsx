import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './Button';
import { PermissionGuard } from '../auth/PermissionGuard';

export const PageHeader = ({
    title,
    description,
    actionLabel,
    onAction,
    permission,
    extraActions
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {extraActions}
                {actionLabel && onAction && (
                    <PermissionGuard permissions={permission} fallback={null}>
                        <Button
                            onClick={onAction}
                            leftIcon={<Plus className="h-4 w-4 stroke-[2.5]" />}
                            className="shadow-md shadow-slate-900/20 bg-slate-900 hover:bg-slate-700 text-white border-slate-800 active:scale-[0.97] transition-all duration-150 rounded-xl px-4 py-2.5 text-sm font-semibold"
                        >
                            {actionLabel}
                        </Button>
                    </PermissionGuard>
                )}
            </div>
        </div>
    );
};