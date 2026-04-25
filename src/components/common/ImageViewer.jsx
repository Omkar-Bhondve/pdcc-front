import React, { useState } from 'react';
import { Download, ExternalLink, ZoomIn, Eye, File } from 'lucide-react';
import AnimatedModal from './AnimatedModal';
import { PUBLIC_FILE_BASE_URL } from '../../config/appConfig';

export const ImageViewer = ({ 
  src, 
  alt = 'Image', 
  className = '',
  thumbnailClassName = '',
  showPreview = true,
  onError = null,
  variant = 'thumbnail' // 'thumbnail' | 'button' | 'link' | 'card'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

 const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  return `${PUBLIC_FILE_BASE_URL}/${cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/')}`;
};

  const imageUrl = getFileUrl(src);

  const handleError = (e) => {
    setImageError(true);
    if (onError) onError(e);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt.replace(/\s+/g, '_') + '.jpg';
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
    link.href = imageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    setIsModalOpen(true);
  };

  if (!src) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center text-slate-400 ${className || 'w-24 h-24'}`}>
        <span className="text-sm">No image</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className={`bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-2 ${className || 'w-24 h-24'}`}>
        <span className="text-xs">Failed to load</span>
        <span className="text-xs text-slate-500 truncate max-w-full">{src.split('/').pop()}</span>
      </div>
    );
  }

  const renderModal = () => (
    <AnimatedModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={alt}
      size="2xl"
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
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain mx-auto shadow-lg rounded-lg"
        />
      </div>
    </AnimatedModal>
  );

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
          View Image
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
              <img 
                src={imageUrl} 
                alt={alt}
                className="w-10 h-10 object-cover rounded"
                onError={handleError}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{alt}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Image</p>
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

  // Thumbnail/Default Variant
  return (
    <>
      {showPreview ? (
        <div
          className={`relative inline-block cursor-pointer group ${thumbnailClassName}`}
          onClick={handleView}
        >
          <img
            src={imageUrl}
            alt={alt}
            className={`${className || 'w-full h-auto'} transition-transform duration-200 group-hover:scale-105`}
            onError={handleError}
            onLoad={() => {/* Production: Remove debug log */}}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 flex items-center justify-center rounded-lg transition-all duration-200">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className={className || 'w-full h-auto'}
          onError={handleError}
          onLoad={() => {/* Production: Remove debug log */}}
          loading="lazy"
        />
      )}
      {renderModal()}
    </>
  );
};

export const ImageThumbnail = ({ 
  src, 
  alt = 'Thumbnail', 
  size = 'md',
  onClick = null 
}) => {
  const [imageError, setImageError] = useState(false);

const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  return `${PUBLIC_FILE_BASE_URL}/${cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/')}`;
};
  const imageUrl = getFileUrl(src);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  if (!src || imageError) {
    return (
      <div className={`${sizeClasses[size]} bg-slate-100 flex items-center justify-center text-slate-400 rounded border border-slate-200`}>
        <span className="text-xs">No image</span>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded overflow-hidden border-2 border-slate-200 cursor-pointer hover:border-blue-400 transition-colors`}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};
