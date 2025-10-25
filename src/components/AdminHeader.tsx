import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import authService from '@/services/authService';
import { BarChart3, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const AdminHeader = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Load admin user from localStorage
    const stored = localStorage.getItem('admin_user');
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse admin_user:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('admin_user');
      localStorage.removeItem('auth_token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      localStorage.removeItem('admin_user');
      localStorage.removeItem('auth_token');
      navigate('/admin/login');
    }
  };

  const isSuperAdmin = () => {
    return adminUser?.role === 'super_admin';
  };

  if (!adminUser) return null;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold truncate">EngineCore Admin</h1>
            <Badge variant={adminUser.role === 'super_admin' ? 'default' : 'secondary'} className="hidden xs:inline-flex">
              {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Products
              </Button>
              {isSuperAdmin() && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin/settings')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              )}
            </nav>

          {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {adminUser.user_id ? adminUser.user_id.charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {adminUser.user_id || 'Admin User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {adminUser.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/products')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Products</span>
                </DropdownMenuItem>
                {isSuperAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
