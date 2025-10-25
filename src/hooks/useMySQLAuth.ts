import { useCallback, useEffect, useState } from 'react';
import authService from '@/services/authService';

export interface AdminUser {
  id: string;
  user_id?: string;
  email?: string | null;
  role: 'super_admin' | 'admin';
  permissions: string[];
  is_active: boolean;
}

export const useMySQLAuth = () => {
  // Get cached admin from localStorage
  const cachedRaw = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
  const cachedAdmin: AdminUser | null = cachedRaw ? (() => { try { return JSON.parse(cachedRaw); } catch { return null; } })() : null;

  const [adminUser, setAdminUser] = useState<AdminUser | null>(cachedAdmin);
  const [loading, setLoading] = useState(!cachedAdmin);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(cachedAdmin));

  const superAdminEmails = (import.meta.env.VITE_SUPER_ADMIN_EMAILS || 'admin@admin.com')
    .split(',')
    .map((s: string) => s.trim().toLowerCase())
    .filter(Boolean);

  // Check auth state
  const checkAuth = useCallback(async () => {
    console.log('Initializing MySQL auth state...');
    
    try {
      // Check if user has a session
      const user = await authService.getUser();
      
      if (!user) {
        console.log('No session found');
        setAdminUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      console.log('MySQL auth - User found:', user.email);

      // Check if user is a super admin
      if (superAdminEmails.includes(user.email.toLowerCase())) {
        const adminData: AdminUser = {
          id: String(user.id),
          user_id: String(user.id),
          email: user.email,
          role: 'super_admin',
          permissions: ['full_access'],
          is_active: true,
        };
        
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        setAdminUser(adminData);
        setIsAuthenticated(true);
        console.log('Super admin access granted');
      } else {
        // Regular user - check admin_users table
        try {
          const response = await fetch(`http://localhost:3001/api/admin-users/check/${user.email}`);
          if (response.ok) {
            const adminData = await response.json();
            if (adminData && adminData.is_active) {
              localStorage.setItem('admin_user', JSON.stringify(adminData));
              setAdminUser(adminData);
              setIsAuthenticated(true);
              console.log('Admin access granted');
            } else {
              console.log('User is not an active admin');
              await authService.logout();
              setAdminUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log('User is not an admin');
            await authService.logout();
            setAdminUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          // If admin check fails but user is authenticated, allow access as super admin if email matches
          if (superAdminEmails.includes(user.email.toLowerCase())) {
            const adminData: AdminUser = {
              id: String(user.id),
              user_id: String(user.id),
              email: user.email,
              role: 'super_admin',
              permissions: ['full_access'],
              is_active: true,
            };
            localStorage.setItem('admin_user', JSON.stringify(adminData));
            setAdminUser(adminData);
            setIsAuthenticated(true);
          } else {
            await authService.logout();
            setAdminUser(null);
            setIsAuthenticated(false);
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAdminUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [superAdminEmails]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      localStorage.removeItem('admin_user');
      setAdminUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    adminUser,
    loading,
    isAuthenticated,
    checkAuth,
    logout,
  };
};

export default useMySQLAuth;

