import { Navigate, useLocation } from 'react-router-dom';
import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuardFixed = ({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated, loading, adminUser } = useMySQLAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [showError, setShowError] = useState(false);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      setShowError(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, []);

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
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">Loading timeout</p>
          <p className="text-xs text-muted-foreground mt-2">
            Taking too long to verify authentication. Please try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated or no admin user, redirect to login
  if (!isAuthenticated || !adminUser) {
    console.log('AdminRouteGuardFixed - Redirecting to login', { 
      isAuthenticated, 
      adminUser: !!adminUser,
      timeoutReached 
    });
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render admin content
  console.log('AdminRouteGuardFixed - Rendering admin content for user:', adminUser?.email);
  return <>{children}</>;
};

