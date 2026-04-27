import React from 'react';
import { Input } from '../../components/common/Input';
import { Controller } from 'react-hook-form';

const WorkBasicInfo = ({ control, errors, isViewMode }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Plan Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            योजनेचे नाव *
          </label>
          <Controller
            name="plan_name"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">कृपया योजनेचे नाव निवडा</option>
                <option value="Plan A">Plan A</option>
                <option value="Plan B">Plan B</option>
                <option value="Plan C">Plan C</option>
              </select>
            )}
          />
          {errors.plan_name && (
            <p className="mt-1 text-sm text-red-500">{errors.plan_name.message}</p>
          )}
        </div>

        {/* Ledger Head */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            लेखाशिर्ष *
          </label>
          <Controller
            name="ledger_head"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="लेखाशिर्ष"
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            )}
          />
          {errors.ledger_head && (
            <p className="mt-1 text-sm text-red-500">{errors.ledger_head.message}</p>
          )}
        </div>

        {/* Taluka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            तालुका *
          </label>
          <Controller
            name="taluka"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">कृपया तालुका निवडा</option>
                <option value="Taluka 1">Taluka 1</option>
                <option value="Taluka 2">Taluka 2</option>
                <option value="Taluka 3">Taluka 3</option>
              </select>
            )}
          />
          {errors.taluka && (
            <p className="mt-1 text-sm text-red-500">{errors.taluka.message}</p>
          )}
        </div>

        {/* Work Name */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Input
            label="कामाचे नाव *"
            placeholder="कामाचे नााव"
            {...control.register('work_name')}
            error={errors.work_name?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Tender Amount */}
        <div>
          <Input
            label="निविदा रक्कम *"
            type="number"
            step="0.01"
            placeholder="निविदा रक्कम"
            {...control.register('tender_amount')}
            error={errors.tender_amount?.message}
            disabled={isViewMode}
          />
        </div>

        {/* Work Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            वर्क टाईप *
          </label>
          <Controller
            name="work_type"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Work Type</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Plumbing">Plumbing</option>
              </select>
            )}
          />
          {errors.work_type && (
            <p className="mt-1 text-sm text-red-500">{errors.work_type.message}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkBasicInfo;
