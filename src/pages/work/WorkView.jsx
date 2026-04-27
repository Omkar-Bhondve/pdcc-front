import React, { useState, useEffect } from 'react';
import { WorkForm } from './WorkForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import toast from 'react-hot-toast';
import api from '../../services/api';

const WorkView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [fetchLoading, setFetchLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const { handleError } = useErrorHandler();

    useEffect(() => {
        fetchWork();
    }, [id]);

    const fetchWork = async () => {
        try {
            const response = await api.get(`/admin/work/${id}`);
            const work = response.data.data;
            setInitialData(work);
        } catch (error) {
            handleError(error, { showToast: true });
            navigate('/work');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        // In view mode, this shouldn't be called, but just in case
        navigate(`/work/edit/${id}`);
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <WorkForm
            title="Work Details"
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={false}
            isViewMode={true}
        />
    );
};

export default WorkView;
