// Loading optimization utilities

export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.href = '/css/ui-components.css';
  criticalCSS.as = 'style';
  document.head.appendChild(criticalCSS);

  // Preload critical fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontPreload.as = 'style';
  document.head.appendChild(fontPreload);
};

export const optimizeImages = () => {
  // Add loading="lazy" to all images that don't have it
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
};

export const preconnectExternal = () => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    // Google tracking domains removed
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

export const optimizeBundleLoading = () => {
  // Add resource hints for better loading
  const resourceHints = [
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }
  ];

  resourceHints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    document.head.appendChild(link);
  });
};

export const initializePerformanceOptimizations = () => {
  // Run all optimizations
  preloadCriticalResources();
  optimizeImages();
  preconnectExternal();
  optimizeBundleLoading();
  
  // Add performance observer for monitoring
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Page load time:', entry.duration);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
  }
};
