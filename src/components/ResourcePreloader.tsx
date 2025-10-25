import { useEffect } from 'react';
import { imagePreloader } from '@/services/imagePreloader';

export const ResourcePreloader = () => {
  useEffect(() => {
    // Preload critical fonts with proper loading strategy
    const preloadFonts = () => {
      const fontLinks = [
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
          priority: 'high'
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap',
          priority: 'low'
        }
      ];
      
      fontLinks.forEach(({ href, priority }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.crossOrigin = 'anonymous';
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        link.onerror = () => {
          // Fallback to regular stylesheet link if preload fails
          const fallbackLink = document.createElement('link');
          fallbackLink.rel = 'stylesheet';
          fallbackLink.href = href;
          fallbackLink.crossOrigin = 'anonymous';
          document.head.appendChild(fallbackLink);
        };
        
        if (priority === 'high') {
          document.head.appendChild(link);
        } else {
          // Delay low priority fonts
          setTimeout(() => {
            document.head.appendChild(link);
          }, 500);
        }
      });
    };

    // Preload critical images with proper loading strategy
    const preloadImages = async () => {
      const criticalImages = [
        '/assets/hero-engines.jpg',
        '/assets/engine-logo.png'
      ];
      
      // Preload critical images immediately
      try {
        await imagePreloader.preloadCriticalImages(criticalImages);
        console.log('Critical images preloaded successfully');
      } catch (error) {
        console.warn('Failed to preload critical images:', error);
      }

      // Preload other images in background
      const lowPriorityImages = [
        '/assets/bmw-v6-engine.jpg',
        '/assets/mercedes-v8-engine.jpg'
      ];

      // Preload low priority images after user interaction or delay
      const preloadLowPriority = async () => {
        try {
          await imagePreloader.preloadBackgroundImages(lowPriorityImages);
        } catch (error) {
          console.warn('Failed to preload background images:', error);
        }
      };

      // Preload on first user interaction
      const onFirstInteract = () => {
        preloadLowPriority();
        window.removeEventListener('scroll', onFirstInteract);
        window.removeEventListener('click', onFirstInteract);
        window.removeEventListener('mousemove', onFirstInteract);
      };

      window.addEventListener('scroll', onFirstInteract, { once: true });
      window.addEventListener('click', onFirstInteract, { once: true });
      window.addEventListener('mousemove', onFirstInteract, { once: true });
      
      // Fallback: preload after 5 seconds
      setTimeout(preloadLowPriority, 5000);
    };

    // Preload critical API endpoints
    const preloadAPIs = () => {
      // Preconnect to Supabase
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://dfmbicodohmkyasuofov.supabase.co';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Run preloading
    preloadFonts();
    preloadImages();
    preloadAPIs();

    // Preload next likely pages
    const preloadNextPages = () => {
      const nextPages = ['/products', '/about', '/contact'];
      nextPages.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
    };

    // Delay preloading of next pages to not interfere with initial load
    setTimeout(preloadNextPages, 2000);
  }, []);

  return null;
};