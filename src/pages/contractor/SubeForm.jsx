import React from 'react';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';

const SubeForm = ({ control, errors, isViewMode }) => {
  return (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <div className="bg-red-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              श्री/श्रीमती *
            </label>
            <select
              {...control.register('sube_title')}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">निवडा</option>
              <option value="Mr">श्री</option>
              <option value="Mrs">श्रीमती</option>
              <option value="Miss">कुमारिका</option>
            </select>
            {errors.sube_title && (
              <p className="mt-1 text-sm text-red-500">{errors.sube_title.message}</p>
            )}
          </div>

          {/* First Name */}
          <Input
            label="पहिले नाव *"
            placeholder="पहिले नाव प्रविष्ट करा"
            {...control.register('sube_first_name')}
            error={errors.sube_first_name?.message}
            disabled={isViewMode}
          />

          {/* Father/Husband Name */}
          <Input
            label="वडीलांचे नाव / पतीचे नाव *"
            placeholder="वडीलांचे नावं प्रविष्ट करा"
            {...control.register('sube_father_husband_name')}
            error={errors.sube_father_husband_name?.message}
            disabled={isViewMode}
          />

          {/* Last Name */}
          <Input
            label="अर्जदार आडनाव *"
            placeholder="अर्जदाराचे आडनाव प्रविष्ट करा"
            {...control.register('sube_last_name')}
            error={errors.sube_last_name?.message}
            disabled={isViewMode}
          />

          {/* WhatsApp Number */}
          <Input
            label="व्हॉट्सॲप नंबर *"
            placeholder="व्हॉट्सॲप नंबर प्रविष्ट करा"
            {...control.register('sube_whatsapp_number')}
            error={errors.sube_whatsapp_number?.message}
            disabled={isViewMode}
          />

          {/* Username */}
          <Input
            label="युजर नेम *"
            placeholder="युजर नेम प्रविष्ट करा"
            {...control.register('sube_username')}
            error={errors.sube_username?.message}
            disabled={isViewMode}
          />

          {/* Birth Place */}
          <Input
            label="जन्म स्थान"
            placeholder="अर्जदाराचे जन्मस्थान प्रविष्ट करा"
            {...control.register('sube_birth_place')}
            error={errors.sube_birth_place?.message}
            disabled={isViewMode}
          />

          {/* Birth Date */}
          <Input
            label="जन्मतारीख"
            type="date"
            {...control.register('sube_birth_date')}
            error={errors.sube_birth_date?.message}
            disabled={isViewMode}
          />

          {/* Taluka */}
          <Input
            label="तालुका *"
            placeholder="तालुका निवडा"
            {...control.register('sube_taluka')}
            error={errors.sube_taluka?.message}
            disabled={isViewMode}
          />

          {/* Aadhar Number */}
          <Input
            label="आधार क्रमांक *"
            placeholder="आधार क्रमांक प्रविष्ट करा"
            {...control.register('sube_aadhar_number')}
            error={errors.sube_aadhar_number?.message}
            disabled={isViewMode}
          />

          {/* PAN Number */}
          <Input
            label="पॅन क्रमांक *"
            placeholder="पॅन क्रमांक प्रविष्ट करा"
            {...control.register('sube_pan_number')}
            error={errors.sube_pan_number?.message}
            disabled={isViewMode}
          />

          {/* GST Number */}
          <Input
            label="जी.एस.टी क्रमांक *"
            placeholder="जी.एस.टी क्रमांक प्रविष्ट करा"
            {...control.register('sube_gst_number')}
            error={errors.sube_gst_number?.message}
            disabled={isViewMode}
          />

          {/* Current Address */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Textarea
              label="सध्याचा पत्ता *"
              placeholder="सध्याचा पत्ता प्रविष्ट करा"
              rows={3}
              {...control.register('sube_current_address')}
              error={errors.sube_current_address?.message}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>

      {/* Education/Qualification Details Section */}
      <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Education & Qualification Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Technical Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              तांत्रिक पात्रता *
            </label>
            <select
              {...control.register('sube_technical_qualification')}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">पात्रता निवडा</option>
              <option value="Diploma">डिप्लोमा</option>
              <option value="Degree">पदवी</option>
              <option value="Masters">पदव्युत्तर</option>
              <option value="Other">इतर</option>
            </select>
            {errors.sube_technical_qualification && (
              <p className="mt-1 text-sm text-red-500">{errors.sube_technical_qualification.message}</p>
            )}
          </div>

          {/* Trade */}
          <Input
            label="ट्रेड *"
            placeholder="ट्रेड निवडा"
            {...control.register('sube_trade')}
            error={errors.sube_trade?.message}
            disabled={isViewMode}
          />

          {/* Institution Name */}
          <Input
            label="शिक्षण संस्थेचे नाव"
            placeholder="शिक्षण संस्थेचे नाव प्रविष्ट करा"
            {...control.register('sube_institution_name')}
            error={errors.sube_institution_name?.message}
            disabled={isViewMode}
          />

          {/* University Name */}
          <Input
            label="विद्यापीठाचे नाव"
            placeholder="विद्यापीठाचे नाव प्रविष्ट करा"
            {...control.register('sube_university_name')}
            error={errors.sube_university_name?.message}
            disabled={isViewMode}
          />

          {/* Passing Year */}
          <Input
            label="उत्तीर्ण वर्ष"
            placeholder="उत्तीर्ण वर्ष प्रविष्ट करा"
            {...control.register('sube_passing_year')}
            error={errors.sube_passing_year?.message}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Business Details Section */}
      <div className="bg-green-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Business Location */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Input
              label="व्यवसायाचे ठिकाण *"
              placeholder="व्यवसायाचे ठिकाण प्रविष्ट करा"
              {...control.register('sube_business_location')}
              error={errors.sube_business_location?.message}
              disabled={isViewMode}
            />
          </div>

          {/* Bank Name */}
          <Input
            label="बँकेचे नाव *"
            placeholder="बँकेचे नाव प्रविष्ट करा"
            {...control.register('sube_bank_name')}
            error={errors.sube_bank_name?.message}
            disabled={isViewMode}
          />

          {/* Bank Address */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Textarea
              label="बँकेचा पत्ता"
              placeholder="बँकेचा पत्ता प्रविष्ट करा"
              rows={3}
              {...control.register('sube_bank_address')}
              error={errors.sube_bank_address?.message}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubeForm;
