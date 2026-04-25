import React, { useState, useEffect, useRef } from 'react';
import { FiType } from 'react-icons/fi';

const TransliteratedInput = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  maxLength = 255,
  disabled = false,
  showToggle = true,
  defaultMode = 'english',
  ...props
}) => {
  const [mode, setMode] = useState(defaultMode);
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleModeToggle = () => {
    const newMode = mode === 'english' ? 'hindi' : 'english';
    setMode(newMode);
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (onChange) {
      onChange({
        target: {
          ...e.target,
          value: newValue,
          mode
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    // Toggle mode with Ctrl+Space
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      handleModeToggle();
    }
  };

  return (
    <div className={`transliterated-input relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
        {...props}
      />
      
      {showToggle && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={handleModeToggle}
            disabled={disabled}
            className={`p-1 rounded text-xs font-medium transition-colors ${
              mode === 'hindi'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={`Switch to ${mode === 'english' ? 'Hindi' : 'English'} (Ctrl+Space)`}
          >
            <FiType className="h-3 w-3" />
            <span className="ml-1">{mode === 'english' ? 'EN' : 'HI'}</span>
          </button>
        </div>
      )}
      
      <div className="mt-1 text-xs text-gray-500">
        {mode === 'hindi' ? 'Hindi typing mode' : 'English typing mode'}
        {showToggle && ' • Press Ctrl+Space to toggle'}
      </div>
    </div>
  );
};

export default TransliteratedInput;
