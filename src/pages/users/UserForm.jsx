import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { roleService } from '../../services';
import { Eye, EyeOff, Users } from 'lucide-react';
import FormLayout from '../../components/common/FormLayout';
import DropdownSearch from '../../components/common/DropdownSearch';
import ToggleSwitch from '../../components/common/ToggleSwitch';

// Base schema with common fields
const baseSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role_id: z.coerce.number().min(1, 'Please select a valid role'),
    is_active: z.boolean().optional(),
    email_verified: z.boolean().optional(),
});

// Schema for adding a new user (password required)
const addUserSchema = baseSchema.extend({
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for editing a user (password optional)
const editUserSchema = baseSchema.extend({
    password: z.string().optional().or(z.literal('')),
});

export const UserForm = ({
    initialData,
    isViewMode = false,
    onSubmit,
    isLoading,
    title
}) => {
    const navigate = useNavigate();
    const [roles, setRoles] = React.useState([]);
    const [showPassword, setShowPassword] = React.useState(false);
    const isEditMode = !!initialData;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm({
        resolver: zodResolver(isEditMode ? editUserSchema : addUserSchema),
        defaultValues: {
            full_name: '',
            email: '',
            password: '',
            role_id: initialData?.role_id != null
                ? Number(initialData.role_id)
                : initialData?.role?.role_id != null
                    ? Number(initialData.role.role_id)
                    : undefined,
            is_active: true,
            email_verified: false,
            ...initialData,
        },
    });

    useEffect(() => {
        const loadRoles = async () => {
            const data = await roleService.getRoles();
            // Handle paginated response with data array
            const rolesList = data.data || [];
            setRoles(rolesList);
        };
        loadRoles();
    }, []);

    useEffect(() => {
        if (initialData) {
            // Ensure password is reset to empty string on edit load so validation works
            // Also ensure role_id is correctly set if it comes as a nested object or string
            const formData = {
                ...initialData,
                role_id: initialData.role_id != null
                    ? Number(initialData.role_id)
                    : initialData.role?.role_id != null
                        ? Number(initialData.role.role_id)
                        : undefined,
                password: ''
            };
            if (formData.role_id !== undefined && formData.role_id !== null) {
                formData.role_id = Number(formData.role_id);
            }
            reset(formData);
        }
    }, [initialData, reset]);

    const handleFormSubmit = handleSubmit(async (data) => {
        // If in edit mode and password is empty, remove it from the payload
        if (isEditMode && !data.password) {
            const { password, ...rest } = data;
            await onSubmit(rest);
        } else {
            await onSubmit(data);
        }
    });

    return (
        <FormLayout
            title="User"
            icon={Users}
            onSubmit={handleSubmit(handleFormSubmit)}
            onCancel={() => navigate('/users')}
            isEditMode={isEditMode}
            isViewMode={isViewMode}
            loading={isLoading}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    error={errors.full_name?.message}
                    disabled={isViewMode}
                    {...register('full_name')}
                />

                <Input
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    error={errors.email?.message}
                    disabled={isViewMode}
                    {...register('email')}
                />

                {!isEditMode && (
                    <Input
                        label="Password"
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        endIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        onEndIconClick={() => setShowPassword(!showPassword)}
                        error={errors.password?.message}
                        disabled={isViewMode}
                        {...register('password')}
                    />
                )}

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Role</label>
                    <Controller
                        name="role_id"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <DropdownSearch
                                value={value}
                                onChange={(e) => onChange(Number(e.target.value))}
                                options={roles.map(r => ({ id: r.role_id, name: r.role_name }))}
                                placeholder="Select Role"
                                disabled={isViewMode}
                            />
                        )}
                    />
                    {errors.role_id && <p className="mt-1 text-sm text-red-500">{errors.role_id.message}</p>}
                </div>
            </div>

            {/* Active Status */}
            <Controller
                name="is_active"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <ToggleSwitch
                        label="Active Status"
                        description={value ? 'User is currently active' : 'User is currently inactive'}
                        checked={!!value}
                        onChange={onChange}
                        disabled={isViewMode}
                    />
                )}
            />
        </FormLayout>
    );
};