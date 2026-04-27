import React from 'react';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';

const MajurForm = ({ control, errors, isViewMode }) => {
  return (
    <div className="space-y-6">
      {/* Society Details Section */}
      <div className="bg-red-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Society Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Society Name */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Input
              label="मजूर सहकारी संस्थेचे नाव *"
              placeholder="कृपया मजूर सहकारी संस्थेचे नाव प्रविष्ट करा"
              {...control.register('majur_society_name')}
              error={errors.majur_society_name?.message}
              disabled={isViewMode}
            />
          </div>

          {/* Society Address */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Textarea
              label="मजूर सहकारी संस्थेचा संपूर्ण पत्ता *"
              placeholder="कृपया संस्थेचा संपूर्ण पत्ता प्रविष्ट करा"
              rows={3}
              {...control.register('majur_society_address')}
              error={errors.majur_society_address?.message}
              disabled={isViewMode}
            />
          </div>

          {/* Registration District */}
          <Input
            label="मजूर सहकारी संस्थेची नोंदणी करणारा जिल्हा *"
            placeholder="कृपया संस्थेची नोंदणी करणारा जिल्हा प्रविष्ट करा"
            {...control.register('majur_registration_district')}
            error={errors.majur_registration_district?.message}
            disabled={isViewMode}
          />

          {/* Sub Registrar */}
          <Input
            label="उपनिबंधक / सहाय्यक उपनिबंधक *"
            placeholder="कृपया उपनिबंधक / सहाय्यक उपनिबंधक प्रविष्ट करा"
            {...control.register('majur_sub_registrar')}
            error={errors.majur_sub_registrar?.message}
            disabled={isViewMode}
          />

          {/* Registration Number */}
          <Input
            label="नोंदणी क्रमांक *"
            placeholder="कृपया नोंदणी क्रमांक प्रविष्ट करा"
            {...control.register('majur_registration_number')}
            error={errors.majur_registration_number?.message}
            disabled={isViewMode}
          />

          {/* Registration Date */}
          <Input
            label="नोंदणी दिनांक *"
            type="date"
            {...control.register('majur_registration_date')}
            error={errors.majur_registration_date?.message}
            disabled={isViewMode}
          />

          {/* Taluka */}
          <Input
            label="तालुका *"
            placeholder="तालुका निवडा"
            {...control.register('majur_taluka')}
            error={errors.majur_taluka?.message}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Financial Details Section */}
      <div className="bg-green-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Financial Stability */}
          <Input
            label="मजूर सहकारी संस्थेचे आर्थिक स्थैर्य *"
            placeholder="कृपया संस्थेचे आर्थिक स्थैर्य प्रविष्ट करा"
            {...control.register('majur_financial_stability')}
            error={errors.majur_financial_stability?.message}
            disabled={isViewMode}
          />

          {/* Share Capital */}
          <Input
            label="स्वत:चे भाग भांडवल *"
            placeholder="कृपया स्वत:चे भाग भांडवल प्रविष्ट करा"
            {...control.register('majur_share_capital')}
            error={errors.majur_share_capital?.message}
            disabled={isViewMode}
          />

          {/* Government Share */}
          <Input
            label="शासकीय सहभाग रू. *"
            placeholder="कृपया शासकीय सहभाग रू. प्रविष्ट करा"
            {...control.register('majur_government_share')}
            error={errors.majur_government_share?.message}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Classification Details Section */}
      <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Classification Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Registration Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              कोणत्या वर्गात नोंदणी हवी आहे *
            </label>
            <select
              {...control.register('majur_registration_class')}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">अकुशल निवडा</option>
              <option value="skilled">कुशल</option>
              <option value="highly-skilled">अतिकुशल</option>
              <option value="supervisor">पर्यवेक्षक</option>
            </select>
            {errors.majur_registration_class && (
              <p className="mt-1 text-sm text-red-500">{errors.majur_registration_class.message}</p>
            )}
          </div>

          {/* Inspection Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              मजूर सहकारी संस्थेचे मिळालेला तपासणी वर्ग *
            </label>
            <select
              {...control.register('majur_inspection_class')}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">वर्ग निवडा</option>
              <option value="A">A वर्ग</option>
              <option value="B">B वर्ग</option>
              <option value="C">C वर्ग</option>
              <option value="D">D वर्ग</option>
            </select>
            {errors.majur_inspection_class && (
              <p className="mt-1 text-sm text-red-500">{errors.majur_inspection_class.message}</p>
            )}
          </div>

          {/* Other Department Classification */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Textarea
              label="इतर कोणत्या खात्याकडे संस्थेचे वर्गीकरण झाले आहे काय? असल्यास त्याचा तपशिल *"
              placeholder="कृपया इतर कोणत्या खात्याकडे संस्थेचे वर्गीकरण झाले आहे काय? असल्यास त्याचा तपशिल प्रविष्ट करा"
              rows={3}
              {...control.register('majur_other_department_classification')}
              error={errors.majur_other_department_classification?.message}
              disabled={isViewMode}
            />
          </div>

          {/* Member in Other Society */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Textarea
              label="मजूर सहकारी संस्थेचा कोणी सभासद इतर संस्थेत सभासद आहे काय ?*"
              placeholder="कृपया संस्थेचा कोणी सभासद इतर संस्थेत सभासद आहे काय प्रविष्ट करा"
              rows={2}
              {...control.register('majur_member_in_other_society')}
              error={errors.majur_member_in_other_society?.message}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>

      {/* Chairman Details Section */}
      <div className="bg-purple-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chairman Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Chairman Name */}
          <Input
            label="अर्ज करतेवेळीच्या संस्थेच्या चेअरमेनचे नाव *"
            placeholder="कृपया अर्ज करतेवेळीच्या संस्थेच्या चेअरमेनचे नाव प्रविष्ट करा"
            {...control.register('majur_chairman_name')}
            error={errors.majur_chairman_name?.message}
            disabled={isViewMode}
          />

          {/* Chairman WhatsApp */}
          <Input
            label="चेअरमेन व्हॉट्सॲप नंबर *"
            placeholder="कृपया चेअरमेन व्हॉट्सॲप नंबर प्रविष्ट करा"
            {...control.register('majur_chairman_whatsapp')}
            error={errors.majur_chairman_whatsapp?.message}
            disabled={isViewMode}
          />

          {/* Chairman Aadhar */}
          <Input
            label="चेअरमन आधार क्रमांक *"
            placeholder="आधार क्रमांक प्रविष्ट करा"
            {...control.register('majur_chairman_aadhar')}
            error={errors.majur_chairman_aadhar?.message}
            disabled={isViewMode}
          />

          {/* Society PAN */}
          <Input
            label="संस्थेचा पॅन नंबर *"
            placeholder="पॅन क्रमांक प्रविष्ट करा"
            {...control.register('majur_society_pan')}
            error={errors.majur_society_pan?.message}
            disabled={isViewMode}
          />

          {/* Society GST */}
          <Input
            label="संस्थेचा जी.एस.टी. नंबर *"
            placeholder="जी.एस.टी क्रमांक प्रविष्ट करा"
            {...control.register('majur_society_gst')}
            error={errors.majur_society_gst?.message}
            disabled={isViewMode}
          />

          {/* Chairman Address */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Textarea
              label="मजूर सहकारी संस्थेच्या चेअरमेनचा पत्ता *"
              placeholder="कृपया संस्थेच्या चेअरमेनचा पत्ता प्रविष्ट करा"
              rows={3}
              {...control.register('majur_chairman_address')}
              error={errors.majur_chairman_address?.message}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajurForm;
