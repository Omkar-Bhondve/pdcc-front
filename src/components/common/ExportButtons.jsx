import React from 'react';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';

const ExportButtons = ({
  data,
  filename = 'export',
  formats = ['csv', 'excel', 'pdf'],
  className = '',
  disabled = false
}) => {
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTXT = () => {
    let text = '';
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      text = headers.join('\t') + '\n';
      data.forEach(row => {
        text += headers.map(header => row[header]).join('\t') + '\n';
      });
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    switch (format) {
      case 'csv':
        downloadCSV();
        break;
      case 'json':
        downloadJSON();
        break;
      case 'txt':
        downloadTXT();
        break;
      case 'excel':
        // For Excel, we'll use CSV format (can be enhanced with a library like xlsx)
        downloadCSV();
        break;
      case 'pdf':
        // PDF export would require a library like jsPDF
        alert('PDF export requires additional library setup');
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  };

  const getIcon = (format) => {
    switch (format) {
      case 'csv':
      case 'excel':
        return <FiFileText className="h-4 w-4" />;
      case 'pdf':
        return <FiFile className="h-4 w-4" />;
      case 'json':
      case 'txt':
        return <FiDownload className="h-4 w-4" />;
      default:
        return <FiDownload className="h-4 w-4" />;
    }
  };

  const getLabel = (format) => {
    switch (format) {
      case 'csv':
        return 'CSV';
      case 'excel':
        return 'Excel';
      case 'pdf':
        return 'PDF';
      case 'json':
        return 'JSON';
      case 'txt':
        return 'Text';
      default:
        return format.toUpperCase();
    }
  };

  return (
    <div className={`export-buttons flex gap-2 ${className}`}>
      {formats.map(format => (
        <button
          key={format}
          onClick={() => handleExport(format)}
          disabled={disabled || !data || data.length === 0}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            disabled || !data || data.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          title={`Export as ${getLabel(format)}`}
        >
          {getIcon(format)}
          {getLabel(format)}
        </button>
      ))}
    </div>
  );
};

export default ExportButtons;
