
import React from 'react';

interface MediaRendererProps {
  url: string;
  className?: string;
  alt?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ url, className = "", alt = "" }) => {
  if (!url || url.trim() === "") return null;

  const isVideo = url.match(/\.(mp4|webm|ogg|mov)$|video/i) || (url.includes('firebasestorage') && url.includes('/video'));

  if (isVideo) {
    return (
      <video 
        src={url} 
        className={`object-cover ${className}`} 
        controls
        playsInline
      />
    );
  }

  return (
    <img 
      src={url} 
      className={`object-cover ${className}`} 
      alt={alt} 
      loading="lazy"
      onError={(e) => {
        console.warn("Failed to load image from URL:", url);
      }}
    />
  );
};
