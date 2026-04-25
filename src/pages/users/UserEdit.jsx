import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserForm } from './UserForm';
import { userService } from '../../services';
import toast from 'react-hot-toast';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { handleError } = useErrorHandler();

    useEffect(() => {
        if (id) {
            fetchUser(id);
        }
    }, [id]);

    const fetchUser = async (userId) => {
        setIsLoading(true);
        try {
            const data = await userService.getUserById(userId);
            setUser(data.data);
        } catch (error) {
            handleError(error, { showToast: true });
            navigate('/users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        if (!id) return;
        setIsSaving(true);
        try {
            await userService.updateUser(id, data);
            toast.success('User updated successfully');
            navigate('/users');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    if (!user) return null;

    return (
        <UserForm
            title="Edit User"
            initialData={user}
            onSubmit={handleSubmit}
            isLoading={isSaving}
        />
    );
};

export default UserEdit;
