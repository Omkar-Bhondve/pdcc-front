import React, { useState } from 'react';
import { UserForm } from './UserForm';
import { userService } from '../../services';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import toast from 'react-hot-toast';

const UserAdd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { handleError } = useErrorHandler();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await userService.createUser({ ...data, is_active: true });
            toast.success('User created successfully');
            navigate('/users');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserForm
            title="Create New User"
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default UserAdd;
