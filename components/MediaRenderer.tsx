
import React from 'react';

interface MediaRendererProps {
  url: string;
  className?: string;
  alt?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ url, className = "", alt = "" }) => {
  if (!url) return null;

  // المكون الآن بسيط جداً: يعرض الصور فقط كروابط مباشرة أو بيانات Base64
  return (
    <img 
      src={url} 
      className={`object-cover ${className}`} 
      alt={alt} 
      loading="lazy"
      onError={(e) => {
        // في حال فشل تحميل الصورة
        console.warn("Failed to load image from URL:", url);
      }}
    />
  );
};
