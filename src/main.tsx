import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Function to remove the loading spinner
const removeLoadingSpinner = () => {
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    spinner.remove();
  }
};

// Register service worker for caching and offline support (production only)
const registerServiceWorker = async () => {
  if (!import.meta.env.PROD) return;
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// In development, ensure no service workers remain registered to avoid stale caches
const unregisterServiceWorkersInDev = async () => {
  if (import.meta.env.PROD) return;
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(r => r.unregister()));
      // Also clear caches created by any previous SW
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      console.log('Development mode: unregistered all service workers and cleared caches');
    } catch (error) {
      console.warn('Failed to unregister service workers in dev:', error);
    }
  }
};

// Create React root and render the app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loading spinner immediately after React mounts
requestAnimationFrame(removeLoadingSpinner);

// Register or unregister service worker depending on environment
window.addEventListener('load', () => {
  unregisterServiceWorkersInDev();
  registerServiceWorker();
});

// Tawk.to is now loaded via TawkChat component for better control
// Removed duplicate injection to prevent conflicts