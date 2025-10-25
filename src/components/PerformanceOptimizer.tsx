import React, { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources - Disabled placeholder preloads
    const preloadCriticalResources = () => {
      // Only preload actual files that exist
      // Placeholder preloads removed to prevent 404 errors
    };

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Preconnect to external domains
    const preconnectExternal = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImages();
    preconnectExternal();

    // Cleanup
    return () => {
      // Remove any added elements if component unmounts
    };
  }, []);

  return null;
};

// Lazy loading component
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <img
      {...props}
      data-src={src}
      alt={alt}
      className={`lazy ${className}`}
      loading="lazy"
      style={{
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onLoad={(e) => {
        (e.target as HTMLImageElement).style.opacity = '1';
      }}
    />
  );
};

// Code splitting helper
export const lazyLoadComponent = (importFunc: () => Promise<any>) => {
  return React.lazy(() => importFunc());
};