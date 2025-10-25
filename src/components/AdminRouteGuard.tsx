import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated, loading, adminUser } = useMySQLAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(true);
  const hasCachedAdmin = typeof window !== 'undefined' && !!localStorage.getItem('admin_user');

  useEffect(() => {
    console.log('AdminRouteGuard - Auth state:', { isAuthenticated, loading, adminUser: !!adminUser });
  }, [loading, isAuthenticated, adminUser]);

  // Show loading while checking authentication
  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
          <p className="text-xs text-muted-foreground mt-2">
            {loading ? 'Checking authentication...' : 'Preparing dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated or no admin user, redirect to login (but allow cached optimistic access)
  if ((!isAuthenticated || !adminUser) && !hasCachedAdmin) {
    console.log('AdminRouteGuard - Redirecting to login, auth state:', { isAuthenticated, adminUser: !!adminUser });
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated and admin user exists, render the admin content
  console.log('AdminRouteGuard - Rendering admin content for user:', adminUser?.email || 'cached');
  return <>{children}</>;
};