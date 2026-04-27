import React from 'react';
import { Controller } from 'react-hook-form';
import { Upload } from 'lucide-react';

const WorkDocuments = ({ control, errors, isViewMode }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h3>
      <div className="space-y-4">
        
        {/* AA Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">1</span>
            <label className="text-sm font-medium text-gray-700">
              AA Upload (फक्त 5MB PDF अपलोड करा)
            </label>
          </div>
          <div>
            <Controller
              name="aa_upload"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          e.target.value = '';
                          return;
                        }
                        if (file.type !== 'application/pdf') {
                          alert('Only PDF files are allowed');
                          e.target.value = '';
                          return;
                        }
                        onChange(file);
                      }
                    }}
                    disabled={isViewMode}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              )}
            />
            {errors.aa_upload && (
              <p className="mt-1 text-sm text-red-500">{errors.aa_upload.message}</p>
            )}
          </div>
        </div>

        {/* Recap Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">2</span>
            <label className="text-sm font-medium text-gray-700">
              Recap Upload (फक्त 5MB PDF अपलोड करा)
            </label>
          </div>
          <div>
            <Controller
              name="recap_upload"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          e.target.value = '';
                          return;
                        }
                        if (file.type !== 'application/pdf') {
                          alert('Only PDF files are allowed');
                          e.target.value = '';
                          return;
                        }
                        onChange(file);
                      }
                    }}
                    disabled={isViewMode}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              )}
            />
            {errors.recap_upload && (
              <p className="mt-1 text-sm text-red-500">{errors.recap_upload.message}</p>
            )}
          </div>
        </div>

        {/* TS Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">3</span>
            <label className="text-sm font-medium text-gray-700">
              TS Upload (फक्त 5MB PDF अपलोड करा)
            </label>
          </div>
          <div>
            <Controller
              name="ts_upload"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          e.target.value = '';
                          return;
                        }
                        if (file.type !== 'application/pdf') {
                          alert('Only PDF files are allowed');
                          e.target.value = '';
                          return;
                        }
                        onChange(file);
                      }
                    }}
                    disabled={isViewMode}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              )}
            />
            {errors.ts_upload && (
              <p className="mt-1 text-sm text-red-500">{errors.ts_upload.message}</p>
            )}
          </div>
        </div>

        {/* DTP Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">4</span>
            <label className="text-sm font-medium text-gray-700">
              DTP Upload (फक्त 5MB PDF अपलोड करा)
            </label>
          </div>
          <div>
            <Controller
              name="dtp_upload"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          e.target.value = '';
                          return;
                        }
                        if (file.type !== 'application/pdf') {
                          alert('Only PDF files are allowed');
                          e.target.value = '';
                          return;
                        }
                        onChange(file);
                      }
                    }}
                    disabled={isViewMode}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              )}
            />
            {errors.dtp_upload && (
              <p className="mt-1 text-sm text-red-500">{errors.dtp_upload.message}</p>
            )}
          </div>
        </div>

      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <Upload className="inline w-4 h-4 mr-1" />
          Only PDF files up to 5MB are allowed for upload.
        </p>
      </div>
    </div>
  );
};

export default WorkDocuments;
