/**
 * Cloudflare Pages Function - SPA Router
 * Handles routing for single-page applications
 * This function catches all routes and serves index.html for SPA routing
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // List of static file extensions to skip
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm',
    '.json', '.xml', '.txt', '.pdf', '.zip', '.map'
  ];

  // Check if the request is for a static file
  const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));

  // Check if the request is for a known special path
  const isSpecialPath =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.well-known/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    pathname === '/_redirects' ||
    pathname === '/_headers';

  // If it's a static file or special path, let Cloudflare Pages serve it normally
  if (isStaticFile || isSpecialPath) {
    return context.next();
  }

  // For all other requests (SPA routes), rewrite to index.html
  // This allows React Router to handle client-side navigation
  const indexUrl = new URL('/index.html', request.url);
  const response = await context.next({
    request: new Request(indexUrl, request)
  });

  // Add cache-busting headers to ensure fresh content
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  newResponse.headers.set('Pragma', 'no-cache');
  newResponse.headers.set('Expires', '0');

  return newResponse;
}

