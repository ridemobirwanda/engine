import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

export const useLoadingManager = (initialLoading = false) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    retryCount: 0
  });

  const startLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      error
    }));
  }, []);

  const retry = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      error: null,
      isLoading: true
    }));
  }, []);

  const reset = useCallback(() => {
    setLoadingState({
      isLoading: false,
      error: null,
      retryCount: 0
    });
  }, []);

  // Auto-timeout for loading states
  useEffect(() => {
    if (!loadingState.isLoading) return;

    const timeout = setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Operation timed out. Please try again.'
      }));
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loadingState.isLoading]);

  return {
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    retryCount: loadingState.retryCount,
    startLoading,
    stopLoading,
    setError,
    retry,
    reset
  };
};

