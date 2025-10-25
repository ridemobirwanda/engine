import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuardSimple = ({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated, loading, adminUser } = useMySQLAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000); // 5 second timeout

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

  // If timeout reached or not authenticated, redirect to login
  if (timeoutReached || !isAuthenticated || !adminUser) {
    console.log('AdminRouteGuardSimple - Redirecting to login', { 
      timeoutReached, 
      isAuthenticated, 
      adminUser: !!adminUser 
    });
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render admin content
  console.log('AdminRouteGuardSimple - Rendering admin content for user:', adminUser?.email);
  return <>{children}</>;
};

