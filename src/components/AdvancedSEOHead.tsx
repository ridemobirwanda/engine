import { useEffect } from 'react';

interface AdvancedSEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'organization';
  structuredData?: any;
  canonicalUrl?: string;
  noIndex?: boolean;
  locale?: string;
  alternateLanguages?: { [key: string]: string };
}

export const AdvancedSEOHead = ({
  title = "EngineCore - Premium Automotive Engines & Parts",
  description = "Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.",
  keywords = "automotive engines, rebuilt engines, used engines, BMW engines, Mercedes engines, Audi engines, engine parts, performance engines, car engines, engine marketplace",
  image = "/engine-logo.png",
  url = "https://enginemarkets.com",
  type = "website",
  structuredData,
  canonicalUrl,
  noIndex = false,
  locale = "en_US",
  alternateLanguages = {}
}: AdvancedSEOHeadProps) => {
  const fullTitle = title.includes("EngineCore") ? title : `${title} | EngineCore`;
  const fullUrl = url.startsWith('http') ? url : `https://enginemarkets.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://enginemarkets.com${image}`;
  const canonical = canonicalUrl || fullUrl;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Remove existing meta tags to avoid duplicates
    const existingMetaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]');
    existingMetaTags.forEach(tag => tag.remove());

    // Basic meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'author', content: 'EngineCore' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'geo.region', content: 'US' },
      { name: 'geo.placename', content: 'United States' },
      { name: 'geo.position', content: '39.8283;-98.5795' },
      { name: 'ICBM', content: '39.8283, -98.5795' }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: fullUrl },
      { property: 'og:image', content: fullImage },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'EngineCore' },
      { property: 'og:locale', content: locale },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title }
    ];

    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullImage },
      { name: 'twitter:site', content: '@EngineCore' },
      { name: 'twitter:creator', content: '@EngineCore' }
    ];

    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    // Canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonical;
    document.head.appendChild(canonicalLink);

    // Alternate language links
    Object.entries(alternateLanguages).forEach(([lang, url]) => {
      const alternateLink = document.createElement('link');
      alternateLink.rel = 'alternate';
      alternateLink.hreflang = lang;
      alternateLink.href = url;
      document.head.appendChild(alternateLink);
    });

    // Structured Data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Additional SEO meta tags
    const additionalTags = [
      { name: 'theme-color', content: '#1a1a1a' },
      { name: 'msapplication-TileColor', content: '#1a1a1a' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'EngineCore' },
      { name: 'application-name', content: 'EngineCore' },
      { name: 'msapplication-tooltip', content: 'Premium Automotive Engines & Parts' },
      { name: 'msapplication-starturl', content: '/' }
    ];

    additionalTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

  }, [fullTitle, description, keywords, fullUrl, fullImage, type, canonical, noIndex, locale, structuredData, alternateLanguages]);

  return null;
};

// Predefined structured data templates
export const StructuredDataTemplates = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EngineCore",
    "url": "https://enginemarkets.com",
    "logo": "https://enginemarkets.com/engine-logo.png",
    "description": "Premium automotive engines, rebuilt engines, used engines, and high-performance parts for all major brands.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Auto City",
      "addressLocality": "Cyprus",
      "postalCode": "0000",
      "addressCountry": "CY"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+357-96115404",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://www.facebook.com/EngineCore",
      "https://www.twitter.com/EngineCore",
      "https://www.instagram.com/EngineCore"
    ]
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EngineCore",
    "url": "https://enginemarkets.com",
    "description": "Premium automotive engines, rebuilt engines, used engines, and high-performance parts.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://enginemarkets.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  product: (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.short_description,
    "image": Array.isArray(product.images) ? product.images[0] : product.images,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "EngineCore"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "EngineCore"
      }
    },
    "category": product.category || "Automotive Engines"
  }),

  breadcrumb: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};

