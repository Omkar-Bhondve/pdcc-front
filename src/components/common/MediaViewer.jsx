import React from 'react';
import { ImageViewer } from './ImageViewer';
import { DocumentViewer } from './DocumentViewer';

/**
 * Universal Media Viewer Component
 * Automatically detects file type and renders appropriate viewer
 */
export const MediaViewer = ({ 
  src, 
  fileName = 'File',
  alt = 'Media',
  variant = 'button', // 'button' | 'link' | 'card' | 'thumbnail'
  size = 'md', // for thumbnail variant
  className = '',
  thumbnailClassName = '',
  showPreview = true
}) => {
  if (!src) {
    return <span className="text-xs text-slate-400">No file</span>;
  }

  const getFileExtension = (path) => {
    if (!path) return '';
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  };

  const extension = getFileExtension(src);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension);

  // For thumbnail variant, always use ImageViewer
  if (variant === 'thumbnail') {
    if (!isImage) {
      return <span className="text-xs text-slate-400">Not an image</span>;
    }
    return (
      <ImageViewer
        src={src}
        alt={alt}
        className={className}
        thumbnailClassName={thumbnailClassName}
        showPreview={showPreview}
      />
    );
  }

  // For other variants, route to appropriate viewer
  if (isImage) {
    // For images, use ImageViewer with card-like presentation
    return (
      <ImageViewer
        src={src}
        alt={alt}
        className={className}
        showPreview={showPreview}
        variant={variant}
      />
    );
  }

  // For documents (PDF, DOC, etc.), use DocumentViewer
  return (
    <DocumentViewer
      src={src}
      fileName={fileName}
      variant={variant}
      className={className}
      showPreview={showPreview}
    />
  );
};

/**
 * Simple preview component for displaying image/document in a compact format
 */
export const MediaPreview = ({ src, alt = 'Preview', onClick = null }) => {
  if (!src) return null;

  const getFileExtension = (path) => {
    if (!path) return '';
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  };

  const extension = getFileExtension(src);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension);

  if (isImage) {
    return (
      <ImageViewer
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        showPreview={true}
      />
    );
  }

  return (
    <DocumentViewer
      src={src}
      fileName={alt}
      variant="link"
    />
  );
};

export default MediaViewer;
