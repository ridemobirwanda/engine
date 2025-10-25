/**
 * Cloudflare Pages Function - SPA Router
 * Handles routing for single-page applications
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Static file extensions
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm',
    '.json', '.xml', '.txt', '.pdf', '.zip', '.map', '.html'
  ];

  // Check if it's a static file
  const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));

  // Check if it's an API or special path
  const isSpecialPath =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.well-known/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico';

  // Serve static files and special paths as-is
  if (isStaticFile || isSpecialPath) {
    return context.next();
  }

  // For all other routes, serve index.html (SPA routing)
  return context.next({
    pathname: '/index.html'
  });
}

