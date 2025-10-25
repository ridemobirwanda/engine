import { Navigate, useLocation } from 'react-router-dom';
import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuardFinal = ({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated, loading, adminUser, sessionValid } = useMySQLAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showError, setShowError] = useState(false);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      setShowError(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, []);

  // Reset timeout when loading state changes
  useEffect(() => {
    if (!loading) {
      setTimeoutReached(false);
      setShowError(false);
    }
  }, [loading]);

  // Handle retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setTimeoutReached(false);
    setShowError(false);
    // Force reload the auth state
    window.location.reload();
  };

  // Show loading while checking authentication (but not forever)
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if timeout reached
  if (timeoutReached && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Authentication Timeout</h2>
          <p className="text-muted-foreground mb-4">
            Taking too long to verify authentication. This might be due to network issues or server problems.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={handleRetry}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Authentication
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/admin/login'}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Retry attempt: {retryCount + 1}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated or no admin user, redirect to login
  if (!isAuthenticated || !adminUser || !sessionValid) {
    console.log('AdminRouteGuardFinal - Redirecting to login', { 
      isAuthenticated, 
      adminUser: !!adminUser,
      sessionValid,
      timeoutReached 
    });
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render admin content
  console.log('AdminRouteGuardFinal - Rendering admin content for user:', adminUser?.email);
  return <>{children}</>;
};

