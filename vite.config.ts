import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 21201,
    hmr: {
      overlay: false,
    },
    fs: {
      strict: false,
      allow: ['..']
    },
    cors: true,
    // Performance optimizations for Windows
    watch: {
      usePolling: false, // Disable polling for better performance
      interval: 1000,
    },
    // Warm up frequently used modules
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/HomePage.tsx',
      ],
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Fix for useLayoutEffect SSR issues
      babel: {
        plugins: [
          // Transform useLayoutEffect to useEffect in SSR
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      external: ['@react-three/fiber', '@react-three/drei', 'three'],
      output: {
        manualChunks: (id) => {
          // Aggressive code splitting for instant loading
          if (id.includes('node_modules')) {
            // Core React - keep together for performance
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-core';
            }
            // React Router - separate for better caching
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // UI libraries - split by library
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Data & state management - separate chunk
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Forms & validation
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'forms';
            }
            // Utility libraries
            if (id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'utils';
            }
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            // Everything else
            return 'vendor';
          }
          
          // Third-party integrations - separate chunks for lazy loading
          if (id.includes('TawkChat') || id.includes('WhatsAppChat')) {
            return 'chat-widgets';
          }
          if (id.includes('GoogleAds') || id.includes('AdManager')) {
            return 'ads';
          }
          if (id.includes('SEO') || id.includes('LocalBusiness')) {
            return 'seo';
          }
          
          // Admin - completely separate
          if (id.includes('/pages/Admin') || id.includes('/components/Admin')) {
            return 'admin';
          }
          
          // UI components - smaller chunks
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          
          // Public pages
          if (id.includes('/pages/')) {
            const match = id.match(/pages\/([^/]+)/);
            if (match) {
              return `page-${match[1].toLowerCase()}`;
            }
            return 'pages';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-toast',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three'],
    force: true, // Force re-optimization to ensure React is properly bundled
    entries: ['src/main.tsx'], // Specify entry point to prevent scanning issues
  },
  esbuild: {
    target: 'es2020',
    pure: mode === 'production' ? ['console.log', 'console.warn', 'console.error'] : [],
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  define: {
    __DEV__: mode === 'development',
    // Fix for React useLayoutEffect SSR issues
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  css: {
    devSourcemap: false,
  },
  cacheDir: 'node_modules/.vite',
  // Additional performance optimizations
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      } else {
        return { relative: true };
      }
    },
  },
}));