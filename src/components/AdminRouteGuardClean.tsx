import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import authService from '@/services/authService';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuardClean = ({ children }: AdminRouteGuardProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Don't redirect if we're on the login page
  const isLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    // Check MySQL session
    const checkAuth = async () => {
      try {
        // Check if we have admin user in localStorage
        const adminUser = localStorage.getItem('admin_user');
        const authToken = localStorage.getItem('auth_token');
        
        if (!adminUser || !authToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify the session is still valid
        const user = await authService.getUser();
        
        if (user) {
          // Session is valid
          const parsed = JSON.parse(adminUser);
          if (parsed && parsed.is_active !== false) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('admin_user');
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
          }
        } else {
          // Session expired or invalid
          localStorage.removeItem('admin_user');
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    console.log('AdminRouteGuardClean - Redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated and on login page, redirect to admin dashboard
  if (isAuthenticated && isLoginPage) {
    console.log('AdminRouteGuardClean - User already authenticated, redirecting to admin dashboard');
    return <Navigate to="/admin" replace />;
  }

  // Render admin content
  return <>{children}</>;
};

