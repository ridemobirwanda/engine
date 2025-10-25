import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const AdminPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    // Monitor admin page performance
    const measurePerformance = () => {
      const loadTime = performance.now() - startTime;
      
      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize;
      
      setMetrics({
        loadTime,
        renderTime: performance.now() - startTime,
        memoryUsage: memoryUsage ? Math.round(memoryUsage / 1024 / 1024) : undefined
      });
    };

    // Measure after initial render
    const timer = setTimeout(measurePerformance, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Log performance in development
  useEffect(() => {
    if (import.meta.env.DEV && metrics) {
      console.log('Admin Performance Metrics:', {
        loadTime: `${metrics.loadTime.toFixed(2)}ms`,
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        memoryUsage: metrics.memoryUsage ? `${metrics.memoryUsage}MB` : 'N/A'
      });
    }
  }, [metrics]);

  // Preload critical admin resources
  useEffect(() => {
    const preloadAdminResources = () => {
      // Preload admin icons and assets
      const criticalAssets = [
        '/admin-icons.svg',
        '/admin-dashboard-bg.jpg'
      ];

      criticalAssets.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    preloadAdminResources();
  }, []);

  return null;
};



