import React, { useEffect } from 'react';
import { Input } from '../../components/common/Input';

const WorkFinancials = ({ control, errors, isViewMode, watch, setValue }) => {
  // Watch all recap fields
  const workPortion = watch('recap_work_portion') || 0;
  const insurance = watch('recap_insurance') || 0;
  const gst = watch('recap_gst') || 0;
  const other = watch('recap_other') || 0;

  // Auto-calculate total
  useEffect(() => {
    const total = parseFloat(workPortion) + parseFloat(insurance) + parseFloat(gst) + parseFloat(other);
    setValue('recap_total', total.toFixed(2));
  }, [workPortion, insurance, gst, other, setValue]);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recapitulation</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Sr. No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Work Portion */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Work Portion</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...control.register('recap_work_portion')}
                  error={errors.recap_work_portion?.message}
                  disabled={isViewMode}
                  className="text-right"
                />
              </td>
            </tr>

            {/* Insurance */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Insurance</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...control.register('recap_insurance')}
                  error={errors.recap_insurance?.message}
                  disabled={isViewMode}
                  className="text-right"
                />
              </td>
            </tr>

            {/* GST */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GST</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...control.register('recap_gst')}
                  error={errors.recap_gst?.message}
                  disabled={isViewMode}
                  className="text-right"
                />
              </td>
            </tr>

            {/* Other */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Other</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...control.register('recap_other')}
                  error={errors.recap_other?.message}
                  disabled={isViewMode}
                  className="text-right"
                />
              </td>
            </tr>

            {/* Total */}
            <tr className="bg-blue-50 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...control.register('recap_total')}
                  disabled={true}
                  className="text-right font-semibold bg-blue-50"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkFinancials;
