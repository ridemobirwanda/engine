import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { AdminRole, getRoleDisplayName, getRoleDescription, ADMIN_ROLE_PERMISSIONS } from '@/utils/adminRoles';
import { Shield, Users, Settings, Package, CreditCard, BarChart3 } from 'lucide-react';

export default function AdminRoleManagement() {
  const [selectedRole, setSelectedRole] = useState<AdminRole>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { role: currentRole, updateRole, isSuperAdmin } = useAdminPermissions();

  const handleRoleChange = async (newRole: AdminRole) => {
    if (!isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only super administrators can change roles",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      updateRole(newRole);
      toast({
        title: "Role Updated",
        description: `Role changed to ${getRoleDisplayName(newRole)}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPermissionIcon = (hasPermission: boolean) => (
    <div className={`w-4 h-4 rounded-full ${hasPermission ? 'bg-green-500' : 'bg-red-500'}`} />
  );

  const renderPermissionSection = (title: string, icon: React.ReactNode, permissions: (keyof typeof ADMIN_ROLE_PERMISSIONS.super_admin)[]) => {
    const rolePermissions = ADMIN_ROLE_PERMISSIONS[selectedRole];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-center justify-between">
              <span className="text-sm capitalize">
                {permission.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              {renderPermissionIcon(rolePermissions[permission])}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Only super administrators can access role management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Role Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage admin roles and permissions for your team
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Current Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Role to View</label>
                <Select value={selectedRole} onValueChange={(value: AdminRole) => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current User Role</label>
                <div className="flex items-center gap-2">
                  <Badge variant={currentRole === 'super_admin' ? 'default' : 'secondary'}>
                    {getRoleDisplayName(currentRole)}
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={() => handleRoleChange(selectedRole)}
                disabled={isLoading || selectedRole === currentRole}
                className="w-full"
              >
                {isLoading ? 'Updating...' : 'Change My Role'}
              </Button>
            </CardContent>
          </Card>

          {/* Permissions Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{getRoleDisplayName(selectedRole)}</CardTitle>
                <p className="text-muted-foreground">{getRoleDescription(selectedRole)}</p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderPermissionSection(
                'Product Management',
                <Package className="w-5 h-5" />,
                ['canCreateProducts', 'canEditProducts', 'canDeleteProducts', 'canManageCategories', 'canManageInventory']
              )}

              {renderPermissionSection(
                'Order Management',
                <CreditCard className="w-5 h-5" />,
                ['canViewOrders', 'canEditOrders', 'canCancelOrders', 'canProcessRefunds']
              )}

              {renderPermissionSection(
                'User Management',
                <Users className="w-5 h-5" />,
                ['canViewUsers', 'canEditUsers', 'canDeleteUsers', 'canManageAdminUsers']
              )}

              {renderPermissionSection(
                'System Settings',
                <Settings className="w-5 h-5" />,
                ['canViewSettings', 'canEditSettings', 'canManageContent', 'canViewAnalytics', 'canManageMedia', 'canViewContactMessages']
              )}
            </div>
          </div>
        </div>

        {/* Role Comparison Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Role Comparison</CardTitle>
            <p className="text-muted-foreground">Compare permissions across all roles</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Permission</th>
                    <th className="text-center p-2">Super Admin</th>
                    <th className="text-center p-2">Admin</th>
                    <th className="text-center p-2">Moderator</th>
                    <th className="text-center p-2">Editor</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(ADMIN_ROLE_PERMISSIONS.super_admin).map((permission) => (
                    <tr key={permission} className="border-b">
                      <td className="p-2 capitalize">
                        {permission.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </td>
                      {(['super_admin', 'admin', 'moderator', 'editor'] as AdminRole[]).map((role) => (
                        <td key={role} className="text-center p-2">
                          {renderPermissionIcon(ADMIN_ROLE_PERMISSIONS[role][permission as keyof typeof ADMIN_ROLE_PERMISSIONS.super_admin])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



