import { useEffect } from 'react';

export const LocalBusinessSchema = () => {
  useEffect(() => {
    // Local Business Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "AutomotivePartsStore",
      "name": "EngineCore",
      "alternateName": "Engine Markets",
      "description": "Premium automotive engines, rebuilt engines, used engines, and high-performance parts for all major brands. Expert-engineered solutions for BMW, Mercedes, Audi, and more.",
      "url": "https://enginemarkets.com",
      "logo": "https://enginemarkets.com/icon-512x512.png",
      "image": [
        "https://enginemarkets.com/icon-512x512.png",
        "https://enginemarkets.com/images/engine-logo.png"
      ],
      "telephone": "+357-96115404",
      "email": "verifiedengines@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Auto City",
        "addressLocality": "Cyprus",
        "postalCode": "0000",
        "addressCountry": "CY",
        "addressRegion": "Cyprus"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "35.1264",
        "longitude": "33.4299"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "09:00",
          "closes": "16:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Sunday",
          "opens": "00:00",
          "closes": "00:00",
          "validFrom": "2024-01-01",
          "validThrough": "2025-12-31"
        }
      ],
      "priceRange": "$$",
      "currenciesAccepted": "USD, EUR, GBP, BTC, ETH",
      "paymentAccepted": "Cash, Credit Card, PayPal, Cryptocurrency",
      "areaServed": [
        {
          "@type": "Country",
          "name": "Cyprus"
        },
        {
          "@type": "Country", 
          "name": "United States"
        },
        {
          "@type": "Country",
          "name": "United Kingdom"
        },
        {
          "@type": "Country",
          "name": "Germany"
        }
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "35.1264",
          "longitude": "33.4299"
        },
        "geoRadius": "50000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Engine Parts and Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Rebuilt Engines",
              "description": "Professional engine rebuilding services for all major automotive brands"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product", 
              "name": "Used Engines",
              "description": "Quality tested used engines with warranty"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Engine Parts",
              "description": "Cylinder heads, timing components, pistons, and more"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Technical Support",
              "description": "Expert technical support and consultation"
            }
          }
        ]
      },
      "makesOffer": [
        {
          "@type": "Offer",
          "name": "Free Shipping",
          "description": "Free shipping on select items",
          "eligibleRegion": "Worldwide"
        },
        {
          "@type": "Offer",
          "name": "Engine Warranty",
          "description": "Comprehensive warranty on rebuilt engines",
          "warranty": "P1Y"
        }
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+357-96115404",
          "contactType": "customer service",
          "availableLanguage": ["English"],
          "areaServed": "Worldwide"
        },
        {
          "@type": "ContactPoint",
          "email": "verifiedengines@gmail.com",
          "contactType": "customer service",
          "availableLanguage": ["English"]
        }
      ],
      "sameAs": [
        "https://www.facebook.com/EngineCore",
        "https://www.twitter.com/EngineCore", 
        "https://www.instagram.com/EngineCore",
        "https://www.linkedin.com/company/enginecore"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "John Smith"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Excellent service and high-quality rebuilt engines. Fast international shipping and great customer support."
        },
        {
          "@type": "Review", 
          "author": {
            "@type": "Person",
            "name": "Maria Garcia"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Professional team with extensive knowledge. Got exactly what I needed for my BMW engine rebuild."
        }
      ],
      "foundingDate": "2020",
      "numberOfEmployees": "10-50",
      "slogan": "Premium Automotive Engines & Parts",
      "keywords": "engine rebuilding, automotive parts, used engines, rebuilt engines, BMW engines, Mercedes engines, Audi engines, engine parts, cylinder heads, timing components, international shipping"
    };

    // Organization Schema (for brand recognition)
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EngineCore",
      "alternateName": "Engine Markets",
      "url": "https://enginemarkets.com",
      "logo": "https://enginemarkets.com/icon-512x512.png",
      "description": "Leading supplier of premium automotive engines and parts worldwide",
      "foundingDate": "2020",
      "founder": {
        "@type": "Person",
        "name": "EngineCore Team"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cyprus",
        "addressCountry": "CY"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+357-96115404",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.facebook.com/EngineCore",
        "https://www.twitter.com/EngineCore",
        "https://www.instagram.com/EngineCore"
      ]
    };

    // Website Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "EngineCore - Engine Markets",
      "url": "https://enginemarkets.com",
      "description": "Premium automotive engines, rebuilt engines, used engines, and high-performance parts",
      "publisher": {
        "@type": "Organization",
        "name": "EngineCore"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://enginemarkets.com/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Add schemas to head
    const addSchema = (schema: any, id: string) => {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    addSchema(localBusinessSchema, 'local-business-schema');
    addSchema(organizationSchema, 'organization-schema');
    addSchema(websiteSchema, 'website-schema');

    // Cleanup function
    return () => {
      const schemas = ['local-business-schema', 'organization-schema', 'website-schema'];
      schemas.forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
};

export default LocalBusinessSchema;
