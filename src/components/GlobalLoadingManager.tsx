import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { LoadingManager } from './LoadingManager';

interface GlobalLoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

interface GlobalLoadingContextType {
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  setError: (key: string, error: string) => void;
  retry: (key: string) => void;
  reset: (key: string) => void;
  getState: (key: string) => GlobalLoadingState;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | null>(null);

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

interface GlobalLoadingProviderProps {
  children: ReactNode;
}

export const GlobalLoadingProvider = ({ children }: GlobalLoadingProviderProps) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, GlobalLoadingState>>({});

  const startLoading = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: true,
        error: null,
        retryCount: prev[key]?.retryCount || 0
      }
    }));
  };

  const stopLoading = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: false
      }
    }));
  };

  const setError = (key: string, error: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: false,
        error
      }
    }));
  };

  const retry = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: true,
        error: null,
        retryCount: (prev[key]?.retryCount || 0) + 1
      }
    }));
  };

  const reset = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: false,
        error: null,
        retryCount: 0
      }
    }));
  };

  const getState = (key: string): GlobalLoadingState => {
    return loadingStates[key] || {
      isLoading: false,
      error: null,
      retryCount: 0
    };
  };

  // Auto-timeout for loading states
  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {};

    Object.entries(loadingStates).forEach(([key, state]) => {
      if (state.isLoading) {
        timeouts[key] = setTimeout(() => {
          setError(key, 'Operation timed out. Please try again.');
        }, 10000); // 10 second timeout
      }
    });

    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [loadingStates]);

  return (
    <GlobalLoadingContext.Provider value={{
      startLoading,
      stopLoading,
      setError,
      retry,
      reset,
      getState
    }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

interface GlobalLoadingWrapperProps {
  children: ReactNode;
  loadingKey: string;
  loadingMessage?: string;
  errorTitle?: string;
  maxRetries?: number;
}

export const GlobalLoadingWrapper = ({
  children,
  loadingKey,
  loadingMessage = "Loading...",
  errorTitle = "Something went wrong",
  maxRetries = 3
}: GlobalLoadingWrapperProps) => {
  const { getState, retry } = useGlobalLoading();
  const state = getState(loadingKey);

  return (
    <LoadingManager
      isLoading={state.isLoading}
      error={state.error}
      onRetry={() => retry(loadingKey)}
      retryCount={state.retryCount}
      maxRetries={maxRetries}
      loadingMessage={loadingMessage}
      errorTitle={errorTitle}
    >
      {children}
    </LoadingManager>
  );
};

