import React, { useState } from 'react';
import { RoleForm } from './RoleForm';
import { roleService } from '../../services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useErrorHandler } from '../../hooks/useErrorHandler';

const RoleAdd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { handleError } = useErrorHandler();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await roleService.createRole(data);

            toast.success("Role created successfully ✅"); 

            navigate('/roles');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RoleForm
            title="Create New Role"
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default RoleAdd;