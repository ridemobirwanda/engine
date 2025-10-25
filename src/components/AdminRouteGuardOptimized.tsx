import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminPreloader } from './AdminPreloader';
import { useEffect, useState, memo } from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuardOptimized = memo(({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated, loading, adminUser } = useMySQLAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const hasCachedAdmin = typeof window !== 'undefined' && !!localStorage.getItem('admin_user');

  // Optimize initial load
  useEffect(() => {
    if (hasCachedAdmin) {
      // If we have cached admin data, show content immediately
      setIsReady(true);
    } else {
      // Otherwise wait for auth check to complete
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 2000); // Max 2 second wait

      return () => clearTimeout(timer);
    }
  }, [hasCachedAdmin]);

  // Show loading while checking authentication
  if (loading || !isReady) {
    return <AdminPreloader />;
  }

  // If not authenticated or no admin user, redirect to login
  if ((!isAuthenticated || !adminUser) && !hasCachedAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render admin content
  return <>{children}</>;
});

AdminRouteGuardOptimized.displayName = 'AdminRouteGuardOptimized';
