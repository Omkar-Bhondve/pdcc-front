import React from 'react';
import { Input } from '../../components/common/Input';
import { Controller } from 'react-hook-form';

const WorkAdministrative = ({ control, errors, isViewMode }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrative Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Outward Number */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Input
            label="जावक नंबर / प्रमा नंबर / दिनांक *"
            placeholder="for ex. जिनिस/O/2023/Mar/ Combine AA/02032"
            {...control.register('outward_number')}
            error={errors.outward_number?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Outward Date */}
        <div>
          <Input
            label="दिनांक *"
            type="date"
            {...control.register('outward_date')}
            error={errors.outward_date?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Administrative Approval Authority */}
        <div className="col-span-1 md:col-span-2">
          <Input
            label="प्रशासकीय मंजूरीचा अधिकार *"
            placeholder="for ex. मा.जिल्हाधिकारी"
            {...control.register('admin_approval_authority')}
            error={errors.admin_approval_authority?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Outward Reference Date */}
        <div>
          <Input
            label="जावक.क्र दिनांक *"
            type="date"
            {...control.register('outward_ref_date')}
            error={errors.outward_ref_date?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Technical Approval Order */}
        <div className="col-span-1 md:col-span-2">
          <Input
            label="तांत्रिक मंजूर आदेश क्र. *"
            placeholder="for eg. 011/ 11 जानेवारी 2023"
            {...control.register('technical_approval_order')}
            error={errors.technical_approval_order?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Budget Provision Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            अंदाजपत्रकीय तरतूद सन *
          </label>
          <Controller
            name="budget_provision_year"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Year</option>
                <option value="2021-22">2021-22</option>
                <option value="2022-23">2022-23</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            )}
          />
          {errors.budget_provision_year && (
            <p className="mt-1 text-sm text-red-500">{errors.budget_provision_year.message}</p>
          )}
        </div>

        {/* Work Completion Period */}
        <div>
          <Input
            label="काम पुर्ण करणेची मुदत *"
            placeholder="for eg. 3 महिने"
            {...control.register('work_completion_period')}
            error={errors.work_completion_period?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Tender Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            टेंडरचा प्रकार *
          </label>
          <Controller
            name="tender_type"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Tender Type</option>
                <option value="A-1">A-1</option>
                <option value="A-2">A-2</option>
                <option value="B-1">B-1</option>
                <option value="B-2">B-2</option>
                <option value="C-1">C-1</option>
                <option value="C-2">C-2</option>
              </select>
            )}
          />
          {errors.tender_type && (
            <p className="mt-1 text-sm text-red-500">{errors.tender_type.message}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkAdministrative;
