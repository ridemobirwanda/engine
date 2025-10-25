import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { AdminLogin } from './AdminLogin';

interface AdminRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export const AdminRoute = ({ 
  children, 
  requiredPermission, 
  fallback 
}: AdminRouteProps) => {
  const { 
    adminUser, 
    isAuthenticated, 
    loading, 
    hasPermission, 
    isSuperAdmin 
  } = useMySQLAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Checking admin access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !adminUser) {
    return <AdminLogin />;
  }

  // Check if user has required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                You don't have permission to access this section.
                <br />
                Required permission: <strong>{requiredPermission}</strong>
                <br />
                Your role: <strong>{adminUser.role}</strong>
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Contact a super admin if you need access to this section.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show the protected content
  return <>{children}</>;
};

// Higher-order component for admin routes
export const withAdminAuth = (
  Component: React.ComponentType<any>,
  requiredPermission?: string
) => {
  return (props: any) => (
    <AdminRoute requiredPermission={requiredPermission}>
      <Component {...props} />
    </AdminRoute>
  );
};

// Permission-based route component
export const PermissionRoute = ({ 
  permission, 
  children, 
  fallback 
}: { 
  permission: string; 
  children: ReactNode; 
  fallback?: ReactNode; 
}) => {
  const { hasPermission } = useMySQLAuth();
  
  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
};
