/**
 * Cloudflare Pages Worker - SPA Router
 * This file handles all routing for the single-page application
 */

export default {
  async fetch(request, env, ctx) {
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

    // For static files and special paths, let Cloudflare serve them
    if (isStaticFile || isSpecialPath) {
      return env.ASSETS.fetch(request);
    }

    // For all other routes, serve index.html (SPA routing)
    const indexRequest = new Request(new URL('/index.html', request.url), {
      method: 'GET',
      headers: request.headers,
    });

    return env.ASSETS.fetch(indexRequest);
  },
};
