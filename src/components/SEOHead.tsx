import { useEffect } from 'react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export const SEOHead = () => {
  const { getSetting } = useWebsiteSettings();

  // Get SEO settings
  const metaTitle = String(getSetting('seo_meta_title', ''));
  const metaDescription = String(getSetting('seo_meta_description', ''));
  const metaKeywords = String(getSetting('seo_meta_keywords', ''));
  const ogTitle = String(getSetting('seo_og_title', ''));
  const ogDescription = String(getSetting('seo_og_description', ''));
  const ogImage = String(getSetting('seo_og_image', ''));
  const twitterTitle = String(getSetting('seo_twitter_title', ''));
  const twitterDescription = String(getSetting('seo_twitter_description', ''));
  const twitterImage = String(getSetting('seo_twitter_image', ''));

  useEffect(() => {
    // Update document title
    if (metaTitle) {
      document.title = metaTitle;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      if (!content) return;
      
      // Determine if this is a property (og:, twitter:) or name attribute
      const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', metaKeywords);

    // Open Graph meta tags
    updateMetaTag('og:title', ogTitle);
    updateMetaTag('og:description', ogDescription);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('og:type', 'website');

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle);
    updateMetaTag('twitter:description', twitterDescription);
    updateMetaTag('twitter:image', twitterImage);

    // Additional SEO meta tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'EngineCore');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

  }, [
    metaTitle,
    metaDescription,
    metaKeywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage
  ]);

  return null; // This component doesn't render anything
};

export default SEOHead;