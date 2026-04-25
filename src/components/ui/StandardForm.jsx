import React from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "../common/Button";

// Calculate optimal grid columns based on field count
const calculateGridColumns = (fieldCount) => {
  if (fieldCount <= 1) return 'grid-cols-1';
  if (fieldCount === 2) return 'grid-cols-1 md:grid-cols-2'; // 1 row, 2 columns
  if (fieldCount === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // 1 row, 3 cols on large
  if (fieldCount === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'; // 2 rows, 2 cols
  if (fieldCount >= 5 && fieldCount <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // 2 rows, 3 cols
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // 7+ fields, 3 cols max
};

const StandardForm = ({
  title,
  subtitle,
  icon: Icon,
  children,
  onSubmit,
  onCancel,
  isEditMode = false,
  isViewMode = false,
  loading = false,
  submitText,
  cancelText = "Cancel",
  sections = []
}) => {
  const defaultSubmitText = isEditMode ? `Update ${title}` : `Create ${title}`;
  
  // Count form fields (inputs, selects, textareas, etc.)
  const countFormFields = (element) => {
    if (!element) return 0;
    
    // If it's a React element, check its type and children
    if (React.isValidElement(element)) {
      // Production: Remove debug log
      
      // Count common form field types - check multiple ways
      const isFormField = 
        element.type?.name === 'Input' || 
        element.type?.displayName === 'Input' ||
        element.type?.name === 'DropdownSearch' || 
        element.type?.name === 'Textarea' ||
        element.type?.name === 'Select';
        
      if (isFormField) {
        // Production: Remove debug log
        // Check if it's a full-width field
        if (element.props?.fullWidth) {
          return 0; // Don't count full-width fields in grid calculation
        }
        return 1;
      }
      
      // Recursively count children
      let count = 0;
      React.Children.forEach(element.props.children, (child) => {
        count += countFormFields(child);
      });
      return count;
    }
    
    return 0;
  };
  
  // Render fields with proper grid handling and full-width support
  const renderFieldsWithGrid = (fields) => {
    const gridFields = [];
    const fullWidthFields = [];
    
    // Separate fields into grid fields and full-width fields
    React.Children.forEach(fields, (child) => {
      if (React.isValidElement(child) && child.props?.fullWidth) {
        fullWidthFields.push(child);
      } else {
        gridFields.push(child);
      }
    });
    
    // Simple field count - just count grid fields
    const fieldCount = gridFields.length;
    const gridClasses = calculateGridColumns(fieldCount);
    
    // Production: Remove debug log
        
    return (
      <>
        {/* Grid fields */}
        {gridFields.length > 0 && (
          <div className={`grid gap-6 ${gridClasses}`}>
            {gridFields}
          </div>
        )}
        
        {/* Full-width fields */}
        {fullWidthFields.map((field, index) => (
          <div key={index} className="w-full">
            {field}
          </div>
        ))}
      </>
    );
  };
  
  // Calculate grid based on sections or children
  const getGridClasses = () => {
    if (sections.length > 0) {
      // For sections, count fields in each section and use the max
      let maxFields = 0;
      sections.forEach(section => {
        const fieldCount = countFormFields(section.fields);
        maxFields = Math.max(maxFields, fieldCount);
      });
      return calculateGridColumns(maxFields);
    } else {
      // For direct children, count all form fields
      const fieldCount = countFormFields(children);
      return calculateGridColumns(fieldCount);
    }
  };
  
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        />

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            {Icon && <Icon className="h-5 w-5 text-blue-500" />}
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            {isViewMode
              ? `View ${title}`
              : isEditMode
              ? `Edit ${title}`
              : `Add New ${title}`}
          </h1>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">

        {/* Top Dark Header */}
        <div className="px-6 py-4 bg-slate-700 text-white font-semibold uppercase text-sm">
          {title} Information
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-6">
            {/* Form Sections */}
            {sections.length > 0 ? (
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index} className="space-y-6">
                    {section.title && (
                      <div className="border-b border-slate-200 pb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                        {section.description && (
                          <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                        )}
                      </div>
                    )}
                    
                    {renderFieldsWithGrid(section.fields)}
                  </div>
                ))}
              </div>
            ) : (
              // Default single section layout - dynamic grid based on field count
              <>
                {renderFieldsWithGrid(children)}
              </>
            )}
          </div>

          {/* Form Actions */}
          {!isViewMode && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                isLoading={loading}
              >
                {isEditMode ? `Update ${title}` : `Create ${title}`}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StandardForm;
