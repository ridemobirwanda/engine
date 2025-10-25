// React Compatibility Layer for Cloudflare Pages
import { useEffect, useLayoutEffect } from 'react';

// Fix for useLayoutEffect SSR warning
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// React polyfill for missing methods
if (typeof window !== 'undefined') {
  // Ensure React is available globally
  if (!window.React) {
    window.React = require('react');
  }
  
  // Polyfill for useLayoutEffect
  if (!window.React.useLayoutEffect) {
    window.React.useLayoutEffect = useLayoutEffect;
  }
  
  // Polyfill for useEffect
  if (!window.React.useEffect) {
    window.React.useEffect = require('react').useEffect;
  }
  
  // Polyfill for useState
  if (!window.React.useState) {
    window.React.useState = require('react').useState;
  }
  
  // Polyfill for useCallback
  if (!window.React.useCallback) {
    window.React.useCallback = require('react').useCallback;
  }
  
  // Polyfill for useMemo
  if (!window.React.useMemo) {
    window.React.useMemo = require('react').useMemo;
  }
  
  // Polyfill for useRef
  if (!window.React.useRef) {
    window.React.useRef = require('react').useRef;
  }
}

// Global React hooks polyfill
declare global {
  interface Window {
    React: any;
    useLayoutEffect: any;
    useEffect: any;
    useState: any;
    useCallback: any;
    useMemo: any;
    useRef: any;
  }
}

export default useIsomorphicLayoutEffect;

