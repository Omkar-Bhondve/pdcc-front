import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleForm } from './RoleForm';
import { api } from '../../services';
import toast from 'react-hot-toast';
import { useErrorHandler } from '../../hooks/useErrorHandler'; 

const RoleEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { handleError } = useErrorHandler();

    useEffect(() => {
        if (id) {
            fetchRole(id);
        }
    }, [id]);

    const fetchRole = async (roleId) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/roles/${roleId}`);
            const data = response.data.data;
            setRole(data);
        } catch (error) {
            handleError(error, { showToast: true });
            navigate('/roles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data, selectedWildcards) => {
        if (!id) return;
        setIsSaving(true);
        try {
            // Update role details
            await api.put(`/admin/roles/${id}`, {
                role_name: data.role_name,
                description: data.description,
                is_active: true
            });

            // Update permissions - Send all permissions at once
            if (data.permission_ids !== undefined) {
                try {
                    const response = await api.post(`/admin/roles/${id}/permissions`, {
                        permission_ids: data.permission_ids
                    });
                } catch (permError) {
                    console.error('❌ Permission update failed:', permError.response?.data || permError.message);
                    throw permError; // Re-throw to be caught by outer try-catch
                }
            }

            toast.success("Role updated successfully"); 
            navigate('/roles');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    if (!role) return null;

    return (
        <RoleForm
            title="Edit Role & Permissions"
            initialData={role}
            onSubmit={handleSubmit}
            isLoading={isSaving}
        />
    );
};

export default RoleEdit;