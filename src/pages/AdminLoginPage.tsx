import { AdminLogin } from '@/components/AdminLogin';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Crown, User } from 'lucide-react';

export default function AdminLoginPage() {
  const { isAuthenticated } = useMySQLAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <AdminLogin />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Admin Authentication System</h1>
            <p className="text-muted-foreground">
              Choose your admin account type to log in
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Super Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Full access to all system features
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">Full Access</Badge>
                    <Badge variant="outline" className="text-xs">Manage Users</Badge>
                    <Badge variant="outline" className="text-xs">System Settings</Badge>
                    <Badge variant="outline" className="text-xs">All Permissions</Badge>
                  </div>
                  <p className="text-sm font-medium mt-2">
                    Email: admin@admin.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Limited access for product management
                  </p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">Manage Products</Badge>
                    <Badge variant="outline" className="text-xs">View Analytics</Badge>
                    <Badge variant="outline" className="text-xs">Manage Content</Badge>
                    <Badge variant="outline" className="text-xs">Manage Categories</Badge>
                  </div>
                  <p className="text-sm font-medium mt-2">
                    Email: admin@engine.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <AdminLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
