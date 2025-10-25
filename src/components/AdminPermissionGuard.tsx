import { ReactNode } from 'react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { AdminPermissions } from '@/utils/adminRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminPermissionGuardProps {
  permission: keyof AdminPermissions;
  children: ReactNode;
  fallback?: ReactNode;
  showAccessDenied?: boolean;
}

export const AdminPermissionGuard = ({ 
  permission, 
  children, 
  fallback,
  showAccessDenied = true 
}: AdminPermissionGuardProps) => {
  const { checkPermission, isLoading } = useAdminPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!checkPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showAccessDenied) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>You don't have permission to access this feature</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to request access to this functionality.
            </p>
          </CardContent>
        </Card>
      );
    }

    return null;
  }

  return <>{children}</>;
};



