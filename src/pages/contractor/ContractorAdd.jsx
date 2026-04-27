import React, { useState } from 'react';
import ContractorForm from './ContractorForm';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ContractorAdd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { handleError } = useErrorHandler();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post('/admin/contractor', data);
            toast.success('Contractor created successfully');
            navigate('/contractor');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContractorForm
            title="Create New Contractor"
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default ContractorAdd;
