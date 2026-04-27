import React, { useState } from 'react';
import { WorkForm } from './WorkForm';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import toast from 'react-hot-toast';
import api from '../../services/api';

const WorkAdd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { handleError } = useErrorHandler();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post('/admin/work', { ...data, status: data.status || 'active' });
            toast.success('Work created successfully');
            navigate('/work');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WorkForm
            title="Create New Work"
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default WorkAdd;
