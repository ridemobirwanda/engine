import { useEffect } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const DynamicSEO = () => {
  const { getSetting } = useWebsiteSettings();

  // SEO data for different pages/sections
  const seoData = {
    home: {
      title: "Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier",
      description: "Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide."
    },
    bmw: {
      title: "BMW Engines for Sale | Rebuilt & Used BMW Motors | EngineCore",
      description: "Premium BMW engines for sale. Rebuilt BMW motors, used BMW engines, and BMW engine parts. Expert BMW engine specialists with warranty. Shop now!"
    },
    mercedes: {
      title: "Mercedes Engines for Sale | Rebuilt Mercedes Motors | EngineCore",
      description: "High-quality Mercedes engines for sale. Rebuilt Mercedes motors, used Mercedes engines, and Mercedes engine parts. Trusted Mercedes engine supplier."
    },
    audi: {
      title: "Audi Engines for Sale | Rebuilt Audi Motors | EngineCore",
      description: "Premium Audi engines for sale. Rebuilt Audi motors, used Audi engines, and Audi engine parts. Expert Audi engine specialists with warranty."
    },
    rebuilt: {
      title: "Rebuilt Engines for Sale | Quality Rebuilt Motors | EngineCore",
      description: "High-quality rebuilt engines for sale. Professional rebuilt motors with warranty. BMW, Mercedes, Audi, Honda, Toyota rebuilt engines. Shop now!"
    },
    used: {
      title: "Used Engines for Sale | Quality Used Motors | EngineCore",
      description: "Premium used engines for sale. Quality tested used motors with warranty. BMW, Mercedes, Audi used engines. Fast shipping worldwide."
    },
    parts: {
      title: "Engine Parts for Sale | Automotive Engine Components | EngineCore",
      description: "Premium engine parts for sale. BMW, Mercedes, Audi engine components. Engine heads, blocks, pistons, crankshafts. Expert engine parts supplier."
    }
  };

  // Get current page path to determine SEO data
  const getCurrentPageSEO = () => {
    const path = window.location.pathname;
    
    if (path.includes('/bmw') || path.includes('/mercedes') || path.includes('/audi')) {
      return seoData[path.split('/')[1] as keyof typeof seoData] || seoData.home;
    }
    
    if (path.includes('/rebuilt')) return seoData.rebuilt;
    if (path.includes('/used')) return seoData.used;
    if (path.includes('/parts')) return seoData.parts;
    
    return seoData.home;
  };

  useEffect(() => {
    const currentSEO = getCurrentPageSEO();
    
    // Update document title
    document.title = currentSEO.title;

    // Update meta description
    const updateMetaTag = (name: string, content: string, property?: string) => {
      if (!content) return;
      
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('description', currentSEO.description);
    updateMetaTag('', currentSEO.title, 'og:title');
    updateMetaTag('', currentSEO.description, 'og:description');
    updateMetaTag('', currentSEO.title, 'twitter:title');
    updateMetaTag('', currentSEO.description, 'twitter:description');

  }, []);

  return null;
};

export default DynamicSEO;
