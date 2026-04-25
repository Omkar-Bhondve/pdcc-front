// hooks/useFormValidation.js

import { useState } from 'react';

const useFormValidation = (rules) => {
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const newErrors = {};

    Object.keys(rules).forEach((field) => {
      const value = formData[field];
      const fieldRules = rules[field];

      if (fieldRules.required && (!value || !String(value).trim())) {
        newErrors[field] = fieldRules.requiredMessage || `${field} is required.`;
        return;
      }

      if (fieldRules.minLength && value && String(value).trim().length < fieldRules.minLength) {
        newErrors[field] = fieldRules.minLengthMessage || `Minimum ${fieldRules.minLength} characters required.`;
        return;
      }

      if (fieldRules.maxLength && value && String(value).trim().length > fieldRules.maxLength) {
        newErrors[field] = fieldRules.maxLengthMessage || `Maximum ${fieldRules.maxLength} characters allowed.`;
        return;
      }

      if (fieldRules.pattern && value && !fieldRules.pattern.test(String(value))) {
        newErrors[field] = fieldRules.patternMessage || `Invalid format.`;
        return;
      }

      if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customError = fieldRules.custom(value, formData);
        if (customError) newErrors[field] = customError;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const clearAllErrors = () => setErrors({});

  return { errors, validate, clearError, clearAllErrors };
};

export default useFormValidation;