import React, { useState, useEffect } from 'react';
import ContractorForm from './ContractorForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ContractorEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const { handleError } = useErrorHandler();

    useEffect(() => {
        fetchContractor();
    }, [id]);

    const fetchContractor = async () => {
        try {
            const response = await api.get(`/admin/contractor/${id}`);
            const contractor = response.data.data;
            setInitialData(contractor);
        } catch (error) {
            handleError(error, { showToast: true });
            navigate('/contractor');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.put(`/admin/contractor/${id}`, data);
            toast.success('Contractor updated successfully');
            navigate('/contractor');
        } catch (error) {
            handleError(error, { showToast: true });
        } finally {
            setIsLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ContractorForm
            title="Edit Contractor"
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default ContractorEdit;
