// Sitemap generator for better SEO
export const generateSitemap = () => {
  const baseUrl = 'https://enginemarkets.com';
  const currentDate = new Date().toISOString();

  const pages = [
    // Main pages
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/products', priority: '0.9', changefreq: 'daily' },
    { url: '/engines', priority: '0.9', changefreq: 'daily' },
    { url: '/rebuilt-engines', priority: '0.8', changefreq: 'daily' },
    { url: '/used-engines', priority: '0.8', changefreq: 'daily' },
    { url: '/heads', priority: '0.7', changefreq: 'weekly' },
    { url: '/timing-components', priority: '0.7', changefreq: 'weekly' },
    { url: '/parts', priority: '0.8', changefreq: 'daily' },
    
    // Support pages
    { url: '/technical-support', priority: '0.6', changefreq: 'weekly' },
    { url: '/help-center', priority: '0.6', changefreq: 'weekly' },
    { url: '/faqs', priority: '0.5', changefreq: 'monthly' },
    { url: '/live-chat', priority: '0.4', changefreq: 'monthly' },
    
    // Policy pages
    { url: '/returns-refunds', priority: '0.5', changefreq: 'monthly' },
    { url: '/shipping', priority: '0.5', changefreq: 'monthly' },
    { url: '/warranty', priority: '0.5', changefreq: 'monthly' },
    { url: '/payment-methods', priority: '0.5', changefreq: 'monthly' },
    
    // Contact & About
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    
    // User pages
    { url: '/cart', priority: '0.3', changefreq: 'weekly' },
    { url: '/checkout', priority: '0.3', changefreq: 'weekly' },
    { url: '/wishlist', priority: '0.3', changefreq: 'weekly' },
    { url: '/login', priority: '0.2', changefreq: 'monthly' }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  pages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Allow main pages
Allow: /products
Allow: /engines
Allow: /rebuilt-engines
Allow: /used-engines
Allow: /cylinders/
Allow: /heads
Allow: /timing-components
Allow: /parts
Allow: /technical-support
Allow: /help-center
Allow: /faqs
Allow: /live-chat
Allow: /returns-refunds
Allow: /shipping
Allow: /warranty
Allow: /payment-methods
Allow: /contact
Allow: /about
Allow: /cart
Allow: /checkout
Allow: /wishlist
Allow: /login
Allow: /payment-success
Allow: /payment-cancelled

# Disallow admin pages completely
Disallow: /admin/
Disallow: /admin
Disallow: /admin/*
Disallow: /admin/login
Disallow: /admin/login-test
Disallow: /admin/auth-test
Disallow: /admin/setup
Disallow: /admin/test
Disallow: /admin/direct
Disallow: /admin/test-connection
Disallow: /admin/products
Disallow: /admin/categories
Disallow: /admin/orders
Disallow: /admin/customers
Disallow: /admin/settings
Disallow: /admin/content
Disallow: /admin/payments
Disallow: /admin/analytics
Disallow: /admin/media
Disallow: /admin/contact-messages

# Disallow API endpoints
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Disallow private files
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /supabase/
Disallow: /migrations/
Disallow: /scripts/

# Sitemap location
Sitemap: https://enginemarkets.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
};

