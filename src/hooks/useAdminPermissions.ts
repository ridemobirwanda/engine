import { useState, useEffect } from 'react';
import { AdminRole, AdminPermissions, getAdminPermissions, hasPermission } from '@/utils/adminRoles';
import { simpleAdminAuth } from '@/utils/simpleAdminAuth';

export const useAdminPermissions = () => {
  const [role, setRole] = useState<AdminRole>('editor');
  const [permissions, setPermissions] = useState<AdminPermissions>(getAdminPermissions('editor'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Get admin_user from localStorage (MySQL auth)
        const adminUserStr = localStorage.getItem('admin_user');
        const authToken = localStorage.getItem('auth_token');
        
        if (adminUserStr && authToken) {
          try {
            const adminUser = JSON.parse(adminUserStr);
            // Use the role from admin_user
            const userRole = adminUser.role === 'super_admin' ? 'super_admin' : 'admin';
            setRole(userRole);
            setPermissions(getAdminPermissions(userRole));
            setIsLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing admin_user:', parseError);
          }
        }

        // Fallback: Check bypass mode
        const bypassMode = localStorage.getItem('admin_bypass') === 'true';
        if (bypassMode) {
          const storedRole = localStorage.getItem('admin_role') as AdminRole;
          const adminRole = storedRole || 'super_admin';
          setRole(adminRole);
          setPermissions(getAdminPermissions(adminRole));
        } else {
          // No admin user found
          setRole('editor');
          setPermissions(getAdminPermissions('editor'));
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setRole('editor');
        setPermissions(getAdminPermissions('editor'));
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, []);

  const checkPermission = (permission: keyof AdminPermissions): boolean => {
    return hasPermission(role, permission);
  };

  const updateRole = (newRole: AdminRole) => {
    setRole(newRole);
    setPermissions(getAdminPermissions(newRole));
    
    // Update localStorage if in bypass mode
    if (localStorage.getItem('admin_bypass') === 'true') {
      localStorage.setItem('admin_role', newRole);
    }
  };

  return {
    role,
    permissions,
    isLoading,
    checkPermission,
    updateRole,
    isAdmin: role !== 'editor',
    isSuperAdmin: role === 'super_admin',
  };
};



