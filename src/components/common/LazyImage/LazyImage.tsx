import React from 'react';
import { useLazyImage } from '../../../hooks/useIntersectionObserver';
import { getImageUrl } from '../../../utils/helpers';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallbackSrc?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  fallbackSrc = placeholder
}: LazyImageProps) {
  // Convert relative URL to full CDN URL
  const fullImageUrl = getImageUrl(src);
  const { imgRef, src: imageSrc, isVisible } = useLazyImage(fullImageUrl, placeholder);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    }
  };

  return (
    <div ref={imgRef as React.RefObject<HTMLDivElement>} className={`overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />
    </div>
  );
}

export default LazyImage;