// Admin role management system
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'editor';

export interface AdminPermissions {
  // Product Management
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canManageCategories: boolean;
  canManageInventory: boolean;
  
  // Order Management
  canViewOrders: boolean;
  canEditOrders: boolean;
  canCancelOrders: boolean;
  canProcessRefunds: boolean;
  
  // User Management
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManageAdminUsers: boolean;
  
  // System Settings
  canViewSettings: boolean;
  canEditSettings: boolean;
  canManageContent: boolean;
  canViewAnalytics: boolean;
  canManageMedia: boolean;
  canViewContactMessages: boolean;
  
  // Payment Management
  canViewPayments: boolean;
  canProcessPayments: boolean;
  canManagePaymentMethods: boolean;
}

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    // Product Management - Full Access
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canManageCategories: true,
    canManageInventory: true,
    
    // Order Management - Full Access
    canViewOrders: true,
    canEditOrders: true,
    canCancelOrders: true,
    canProcessRefunds: true,
    
    // User Management - Full Access
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canManageAdminUsers: true,
    
    // System Settings - Full Access
    canViewSettings: true,
    canEditSettings: true,
    canManageContent: true,
    canViewAnalytics: true,
    canManageMedia: true,
    canViewContactMessages: true,
    
    // Payment Management - Full Access
    canViewPayments: true,
    canProcessPayments: true,
    canManagePaymentMethods: true,
  },
  
  admin: {
    // Product Management - Full Access
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canManageCategories: true,
    canManageInventory: true,
    
    // Order Management - Full Access
    canViewOrders: true,
    canEditOrders: true,
    canCancelOrders: true,
    canProcessRefunds: true,
    
    // User Management - Limited Access
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: false,
    canManageAdminUsers: false,
    
    // System Settings - Limited Access
    canViewSettings: true,
    canEditSettings: false,
    canManageContent: true,
    canViewAnalytics: true,
    canManageMedia: true,
    canViewContactMessages: true,
    
    // Payment Management - Full Access
    canViewPayments: true,
    canProcessPayments: true,
    canManagePaymentMethods: true,
  },
  
  moderator: {
    // Product Management - Limited Access
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canManageCategories: false,
    canManageInventory: true,
    
    // Order Management - Limited Access
    canViewOrders: true,
    canEditOrders: true,
    canCancelOrders: false,
    canProcessRefunds: false,
    
    // User Management - View Only
    canViewUsers: true,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageAdminUsers: false,
    
    // System Settings - View Only
    canViewSettings: true,
    canEditSettings: false,
    canManageContent: false,
    canViewAnalytics: true,
    canManageMedia: false,
    canViewContactMessages: true,
    
    // Payment Management - View Only
    canViewPayments: true,
    canProcessPayments: false,
    canManagePaymentMethods: false,
  },
  
  editor: {
    // Product Management - Create/Edit Only
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canManageCategories: false,
    canManageInventory: false,
    
    // Order Management - View Only
    canViewOrders: true,
    canEditOrders: false,
    canCancelOrders: false,
    canProcessRefunds: false,
    
    // User Management - No Access
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageAdminUsers: false,
    
    // System Settings - No Access
    canViewSettings: false,
    canEditSettings: false,
    canManageContent: true,
    canViewAnalytics: false,
    canManageMedia: true,
    canViewContactMessages: false,
    
    // Payment Management - No Access
    canViewPayments: false,
    canProcessPayments: false,
    canManagePaymentMethods: false,
  },
};

export const getAdminPermissions = (role: AdminRole): AdminPermissions => {
  return ADMIN_ROLE_PERMISSIONS[role] || ADMIN_ROLE_PERMISSIONS.editor;
};

export const hasPermission = (role: AdminRole, permission: keyof AdminPermissions): boolean => {
  const permissions = getAdminPermissions(role);
  return permissions[permission];
};

export const getRoleDisplayName = (role: AdminRole): string => {
  const roleNames: Record<AdminRole, string> = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    moderator: 'Moderator',
    editor: 'Editor',
  };
  return roleNames[role] || 'Unknown Role';
};

export const getRoleDescription = (role: AdminRole): string => {
  const descriptions: Record<AdminRole, string> = {
    super_admin: 'Full access to all system features and settings',
    admin: 'Full access to most features, limited system settings access',
    moderator: 'Limited access to product and order management',
    editor: 'Basic access to create and edit products only',
  };
  return descriptions[role] || 'Unknown role permissions';
};



