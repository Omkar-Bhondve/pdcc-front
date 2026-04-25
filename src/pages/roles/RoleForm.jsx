import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../services';

const roleSchema = z.object({
    role_name: z.string().min(2, 'Role Name must be at least 2 characters'),
    description: z.string().optional(),
    permission_ids: z.array(z.number()),
});

export const RoleForm = ({
    initialData,
    onSubmit,
    isLoading,
    title
}) => {
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [permsLoading, setPermsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            role_name: '',
            description: '',
            ...initialData,
            permission_ids: initialData?.permissions?.map(p => p.permission_id) || []
        },
    });

    const selectedPermIds = watch('permission_ids');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const permsResponse = await api.get('/admin/permissions');
                const permsData = permsResponse.data.data || [];
                setPermissions(permsData);
                setWildcardPatterns([]); // No wildcard patterns anymore
            } catch (e) {
                console.error("Failed to fetch permissions", e);
            } finally {
                setPermsLoading(false);
            }
        };
        fetchData();
    }, [initialData?.role_id]);

    // Group permissions by module
    const groupedPermissions = useMemo(() => {
        const groups = {};
        permissions.forEach(p => {
            if (!groups[p.module]) groups[p.module] = [];
            groups[p.module].push(p);
        });
        return groups;
    }, [permissions]);

    const togglePermission = (id) => {
        const current = selectedPermIds || [];
        if (current.includes(id)) {
            setValue('permission_ids', current.filter(pid => pid !== id));
        } else {
            setValue('permission_ids', [...current, id]);
        }
    };

    const handleSelectAllModule = (module, select) => {
        const modulePermIds = groupedPermissions[module].map(p => p.permission_id);
        const current = new Set(selectedPermIds);

        if (select) {
            modulePermIds.forEach(id => current.add(id));
        } else {
            modulePermIds.forEach(id => current.delete(id));
        }
        setValue('permission_ids', Array.from(current));
    };

    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 ml-[-10px]">
                <Button
                    onClick={() => navigate('/roles')}
                    variant="ghost"
                    leftIcon={<ArrowLeft className="h-5 w-5" />}
                />
                <div>
                    <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
                <div className="space-y-4">
                    <Input
                        label="Role Name"
                        placeholder="District Administrator"
                        error={errors.role_name?.message}
                        {...register('role_name')}
                        disabled={initialData?.is_system_role}
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description of the role..."
                        />
                    </div>
                </div>

                
                {/* Permissions Section */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Permissions</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Select specific permissions for this role.
                    </p>

                    {permsLoading ? (
                        <p>Loading permissions...</p>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedPermissions).map(([module, perms]) => (
                                <div
                                    key={module}
                                    className="p-4 rounded-lg border bg-slate-50 border-slate-200"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-semibold text-slate-700 capitalize">
                                            {module} Management
                                        </h4>
                                        <div className="text-xs space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSelectAllModule(module, true)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Select All
                                            </button>
                                            <span className="text-slate-300">|</span>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectAllModule(module, false)}
                                                className="text-slate-500 hover:underline"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {perms.map(perm => (
                                            <label
                                                key={perm.permission_id}
                                                className="flex items-start gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermIds?.includes(perm.permission_id)}
                                                    onChange={() => togglePermission(perm.permission_id)}
                                                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-slate-900 block">
                                                        {perm.permission_name}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {perm.permission_code}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/roles')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Save Role
                    </Button>
                </div>
            </form>
        </Card>
        </div>
    );
};
