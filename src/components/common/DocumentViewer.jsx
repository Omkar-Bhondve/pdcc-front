import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Eye, X, File } from 'lucide-react';
import AnimatedModal from './AnimatedModal';
import { PUBLIC_FILE_BASE_URL } from '../../config/appConfig';

export const DocumentViewer = ({ 
  src, 
  fileName = 'Document',
  fileType = null,
  showPreview = true,
  className = '',
  variant = 'button' // 'button' | 'link' | 'card'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.replace(/^\/+/, '');
    return `${PUBLIC_FILE_BASE_URL}/${cleanPath}`;
  };

  const fileUrl = getFileUrl(src);

  const getFileExtension = (path) => {
    if (!path) return '';
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  };

  const extension = fileType || getFileExtension(src);

  const isPDF = extension === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension);
  const isDocument = ['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(extension);

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleOpenNewTab = () => {
    // Create a temporary anchor element to avoid popup blocker
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (isPDF) {
      handleOpenNewTab();
      return;
    }

    if (isImage) {
      setIsModalOpen(true);
    } else {
      handleOpenNewTab();
    }
  };

  if (!src) {
    return (
      <span className="text-xs text-slate-400">No document</span>
    );
  }

  // Modal Component for PDF/Image Preview
  const renderModal = () => {
    if (!isModalOpen || (!isPDF && !isImage)) return null;

    return (
      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={fileName}
        size="full"
        headerActions={
          <>
            <button
              onClick={handleDownload}
              className="text-slate-600 hover:text-slate-800 transition-all duration-200 flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </button>
            <button
              onClick={handleOpenNewTab}
              className="text-slate-600 hover:text-slate-800 transition-all duration-200 flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">New Tab</span>
            </button>
          </>
        }
      >
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(95vh - 100px)' }}>
          {isPDF ? (
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full min-h-[600px] border-0 rounded-lg shadow-inner"
              title={fileName}
              onError={(e) => {
                // Fallback if iframe fails to load
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'text-center py-12';
                fallback.innerHTML = `
                  <div class="text-slate-600 mb-4">Unable to preview PDF in browser.</div>
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onclick="window.open('${fileUrl}', '_blank')">
                    Open in New Tab
                  </button>
                `;
                e.target.parentNode.appendChild(fallback);
              }}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-[80vh] object-contain shadow-lg rounded-lg"
              />
            </div>
          ) : null}
        </div>
      </AnimatedModal>
    );
  };

  // Button Variant
  if (variant === 'button') {
    return (
      <>
        <div className={`flex gap-2 ${className}`}>
          <button
            onClick={handleView}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        {renderModal()}
      </>
    );
  }

  // Link Variant
  if (variant === 'link') {
    return (
      <>
        <button
          onClick={handleView}
          className={`text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center gap-1 transition-all duration-200 ${className}`}
        >
          <Eye className="w-3 h-3" />
          View Document
        </button>
        {renderModal()}
      </>
    );
  }

  // Card Variant
  if (variant === 'card') {
    return (
      <>
        <div className={`border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200 ${className}`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {isPDF ? (
                <FileText className="w-10 h-10 text-red-500" />
              ) : isImage ? (
                <File className="w-10 h-10 text-blue-500" />
              ) : (
                <File className="w-10 h-10 text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{fileName}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">{extension} file</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleView}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleDownload}
                  className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Download
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleOpenNewTab}
                  className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
        </div>
        {renderModal()}
      </>
    );
  }

  return null;
};

// Simple Document Link Component
export const DocumentLink = ({ src, fileName = 'Document', className = '' }) => {
  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.replace(/^\/+/, '');
    return `${PUBLIC_FILE_BASE_URL}/${cleanPath}`;
  };

  const fileUrl = getFileUrl(src);

  if (!src) return <span className="text-xs text-slate-400">No document</span>;

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center gap-1 ${className}`}
    >
      <Eye className="w-3 h-3" />
      {fileName}
    </a>
  );
};
