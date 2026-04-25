import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';

const FileUpload = ({
  accept = '*/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onFilesSelected,
  className = '',
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    const errors = [];

    // Check file count
    if (multiple && files.length + newFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: false, errors };
    }

    // Check each file
    for (const file of newFiles) {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
      }
    }

    return { valid: errors.length === 0, errors };
  };

  const handleFiles = (fileList) => {
    const { valid, errors } = validateFiles(fileList);
    
    if (!valid) {
      setError(errors.join(', '));
      return;
    }

    const newFiles = multiple ? [...files, ...Array.from(fileList)] : Array.from(fileList);
    setFiles(newFiles);
    setError('');
    
    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {dragActive
            ? 'Drop files here'
            : multiple
            ? 'Drag and drop files here, or click to select'
            : 'Drag and drop a file here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max file size: {maxSize / 1024 / 1024}MB
          {multiple && ` • Max ${maxFiles} files`}
        </p>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <FiFile className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
