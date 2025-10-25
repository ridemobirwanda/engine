/**
 * Cloudflare Pages Functions - SPA Router
 * This file handles routing for the single-page application
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // List of static file extensions
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm',
    '.json', '.xml', '.txt', '.pdf', '.zip'
  ];

  // Check if the request is for a static file
  const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));
  
  // Check if the request is for a known API route or special path
  const isSpecialPath = pathname.startsWith('/api/') || 
                        pathname.startsWith('/.well-known/') ||
                        pathname === '/robots.txt' ||
                        pathname === '/sitemap.xml' ||
                        pathname === '/manifest.json';

  // If it's a static file or special path, let Cloudflare Pages serve it normally
  if (isStaticFile || isSpecialPath) {
    return context.next();
  }

  // For all other requests (SPA routes), rewrite to index.html
  return context.next({
    request: new Request(new URL('/index.html', request.url), request)
  });
}

