import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { authService } from '../../services';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';

const changePasswordSchema = z.object({
// ... (keep schema same)
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(6, 'New password must be at least 6 characters'),
    confirm_password: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

const ChangePassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(null);
    const { error, handleError, clearError, getFieldError } = useErrorHandler();

    // Independent visibility states for 3 fields
    const [showOld, setShowOld] = React.useState(false);
    const [showNew, setShowNew] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        clearError();
        setSuccess(null);

        try {
            await authService.changePassword({
                current_password: data.old_password,
                new_password: data.new_password
            });
            setSuccess('Password changed successfully. Please login with your new password.');
            reset();
            // Optional: Logout user after password change
            setTimeout(() => {
                dispatch(logout());
                navigate('/login');
            }, 2000);
        } catch (err) {
            handleError(err, { showToast: false, setFormErrors: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Security Settings" 
                description="Manage your account security and password preferences"
            />
            
            <div className="max-w-4xl mx-auto">
                <Card title="Change Password" description="Ensure your account is using a long, random password to stay secure.">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <ErrorDisplay 
                            error={error} 
                            onClose={clearError}
                            showCorrelationId={true}
                        />
                        {success && (
                            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-100 flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Success</p>
                                    <p>{success}</p>
                                </div>
                            </div>
                        )}

                        <div className="max-w-md">
                            <Input
                                label="Current Password"
                                type={showOld ? "text" : "password"}
                                icon={<Lock className="h-4 w-4" />}
                                endIcon={showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                onEndIconClick={() => setShowOld(!showOld)}
                                error={errors.old_password?.message}
                                {...register('old_password')}
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="New Password"
                                type={showNew ? "text" : "password"}
                                icon={<Lock className="h-4 w-4" />}
                                endIcon={showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                onEndIconClick={() => setShowNew(!showNew)}
                                error={errors.new_password?.message}
                                {...register('new_password')}
                                autoComplete="new-password"
                            />

                            <Input
                                label="Confirm New Password"
                                type={showConfirm ? "text" : "password"}
                                icon={<Lock className="h-4 w-4" />}
                                endIcon={showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                onEndIconClick={() => setShowConfirm(!showConfirm)}
                                error={errors.confirm_password?.message}
                                {...register('confirm_password')}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full sm:w-auto"
                            >
                                Update Password
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ChangePassword;
