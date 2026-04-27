import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import FormLayout from '../../components/common/FormLayout';
import WorkBasicInfo from './WorkBasicInfo';
import WorkAdministrative from './WorkAdministrative';
import WorkFinancials from './WorkFinancials';
import WorkDocuments from './WorkDocuments';

// Comprehensive schema for work form
const workSchema = z.object({
    // Basic Information
    plan_name: z.string().min(1, 'Plan name is required'),
    ledger_head: z.string().min(1, 'Ledger head is required'),
    taluka: z.string().min(1, 'Taluka is required'),
    work_name: z.string().min(2, 'Work name must be at least 2 characters'),
    tender_amount: z.string().optional(),
    work_type: z.string().min(1, 'Work type is required'),
    
    // Administrative Details
    outward_number: z.string().min(1, 'Outward number is required'),
    outward_date: z.string().min(1, 'Outward date is required'),
    admin_approval_authority: z.string().min(1, 'Administrative approval authority is required'),
    outward_ref_date: z.string().min(1, 'Outward reference date is required'),
    technical_approval_order: z.string().min(1, 'Technical approval order is required'),
    budget_provision_year: z.string().min(1, 'Budget provision year is required'),
    work_completion_period: z.string().min(1, 'Work completion period is required'),
    tender_type: z.string().min(1, 'Tender type is required'),
    
    // Recapitulation
    recap_work_portion: z.string().optional(),
    recap_insurance: z.string().optional(),
    recap_gst: z.string().optional(),
    recap_other: z.string().optional(),
    recap_total: z.string().optional(),
    
    // Document Uploads (optional)
    aa_upload: z.any().optional(),
    recap_upload: z.any().optional(),
    ts_upload: z.any().optional(),
    dtp_upload: z.any().optional(),
});

export const WorkForm = ({
    initialData,
    isViewMode = false,
    onSubmit,
    isLoading,
    title
}) => {
    const navigate = useNavigate();
    const isEditMode = !!initialData;
    
    const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
        resolver: zodResolver(workSchema),
        defaultValues: {
            plan_name: '',
            ledger_head: '',
            taluka: '',
            work_name: '',
            tender_amount: '',
            work_type: '',
            outward_number: '',
            outward_date: '',
            admin_approval_authority: '',
            outward_ref_date: '',
            technical_approval_order: '',
            budget_provision_year: '',
            work_completion_period: '',
            tender_type: '',
            recap_work_portion: '0',
            recap_insurance: '0',
            recap_gst: '0',
            recap_other: '0',
            recap_total: '0',
            ...initialData
        }
    });

    React.useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const handleFormSubmit = handleSubmit(async (data) => {
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add all text fields
        Object.keys(data).forEach(key => {
            if (key.includes('_upload')) {
                // Handle file uploads
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
            } else {
                formData.append(key, data[key] || '');
            }
        });
        
        await onSubmit(formData);
    });

    return (
        <FormLayout
            title={title || "Work Management"}
            icon={Briefcase}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate('/work')}
            isEditMode={isEditMode}
            isViewMode={isViewMode}
            loading={isLoading}
        >
            <div className="space-y-6">
                {/* Basic Information */}
                <WorkBasicInfo
                    control={control}
                    errors={errors}
                    isViewMode={isViewMode}
                />

                {/* Administrative Details */}
                <WorkAdministrative
                    control={control}
                    errors={errors}
                    isViewMode={isViewMode}
                />

                {/* Recapitulation */}
                <WorkFinancials
                    control={control}
                    errors={errors}
                    isViewMode={isViewMode}
                    watch={watch}
                    setValue={setValue}
                />

                {/* Document Uploads */}
                <WorkDocuments
                    control={control}
                    errors={errors}
                    isViewMode={isViewMode}
                />
            </div>
        </FormLayout>
    );
};
