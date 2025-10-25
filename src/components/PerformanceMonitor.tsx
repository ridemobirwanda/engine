import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const monitorPerformance = () => {
      // First Contentful Paint (FCP)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
              console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
            }
          }
        });
        
        observer.observe({ entryTypes: ['paint'] });
      }

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // First Input Delay (FID)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
          }
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      }

      // Cumulative Layout Shift (CLS) - Only if supported
      if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes) {
        try {
          // Check if layout-shift is supported before creating observer
          if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            console.log(`CLS: ${clsValue.toFixed(4)}`);
          });
          
            observer.observe({ entryTypes: ['layout-shift'] });
          } else {
            console.log('Layout-shift monitoring not supported in this browser');
          }
        } catch (error) {
          console.warn('CLS monitoring not supported:', error);
        }
      } else {
        console.log('PerformanceObserver not supported in this browser');
      }
    };

    // Monitor resource loading (only critical resources)
    const monitorResources = () => {
      if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes) {
        try {
          if (PerformanceObserver.supportedEntryTypes.includes('resource')) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resource = entry as PerformanceResourceTiming;
                  
                  // Only log critical slow resources (not images)
                  const isCritical = resource.name.includes('main') || 
                                   resource.name.includes('vendor') || 
                                   resource.name.includes('chunk') ||
                                   resource.name.includes('api');
                  
                  const isImage = resource.name.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i);
                  
                  if (isCritical && resource.duration > 10000) {
                    // Only log extremely slow critical resources (10+ seconds)
                    console.warn(`Slow critical resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`);
                  } else if (isImage && resource.duration > 60000) {
                    // Only log extremely slow images (60+ seconds)
                    console.warn(`Very slow image: ${resource.name} took ${resource.duration.toFixed(2)}ms`);
              }
            }
          }
        });
        
        observer.observe({ entryTypes: ['resource'] });
          }
        } catch (error) {
          console.warn('Resource monitoring not supported:', error);
        }
      }
    };

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log(`Memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      }
    };

    // Run monitoring
    monitorPerformance();
    monitorResources();
    
    // Monitor memory every 30 seconds
    const memoryInterval = setInterval(monitorMemory, 30000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return null;
};