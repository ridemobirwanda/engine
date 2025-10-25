import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
    AlertCircle,
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current user info
    const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
      if (user) {
    setUser(user);
    setIsAdmin(true);
      }
    setLoading(false);
  };
    
    getUser();
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load stats from MySQL API
      const response = await fetch('http://localhost:3001/api/dashboard/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      
      setStats({
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalCustomers: data.totalCustomers || 0,
        totalRevenue: data.totalRevenue || 0,
        lowStockProducts: data.lowStockProducts || 0,
        pendingOrders: data.pendingOrders || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats on error
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        lowStockProducts: 0,
        pendingOrders: 0,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 min-w-0">
          <header className="bg-background border-b p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {user?.email}
                  </p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Active products in catalog
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium">
                    Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Orders received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total sales revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium">
                    Customers
                  </CardTitle>
                  <Users className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered customers
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription>
                    Products with 5 or fewer items in stock
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">
                    {stats.lowStockProducts}
                  </div>
                  <Button
                    onClick={() => navigate('/admin/products')}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View Products
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                    Pending Orders
                  </CardTitle>
                  <CardDescription>
                    Orders waiting for processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500">
                    {stats.pendingOrders}
                  </div>
                  <Button
                    onClick={() => navigate('/admin/orders')}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View Orders
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => navigate('/admin/products/new')}
                    className="w-full"
                    size="sm"
                  >
                    Add New Product
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/categories')}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    Manage Categories
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/content')}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    Edit Website
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
