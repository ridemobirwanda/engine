import { useEffect } from 'react';

interface SimpleSEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export const SimpleSEOHead = ({
  title = "EngineCore - Premium Automotive Engines & Parts",
  description = "Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.",
  keywords = "automotive engines, rebuilt engines, used engines, BMW engines, Mercedes engines, Audi engines, engine parts, performance engines, car engines, engine marketplace",
  image = "/engine-logo.png",
  url = "https://enginemarkets.com",
  type = "website"
}: SimpleSEOHeadProps) => {
  const fullTitle = title.includes("EngineCore") ? title : `${title} | EngineCore`;
  const fullUrl = url.startsWith('http') ? url : `https://enginemarkets.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://enginemarkets.com${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', fullUrl);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', fullImage);
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', fullImage);
    }
  }, [fullTitle, description, keywords, fullUrl, fullImage]);

  return null; // This component doesn't render anything
};
