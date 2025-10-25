import { AdminSidebar } from '@/components/AdminSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Download, Edit, Eye, Mail, MapPin, Monitor, Phone, Search, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  email?: string;
  device_name?: string;
  device_address?: string;
  location?: string;
  device_join_date?: string;
  created_at: string;
  updated_at: string;
}

interface CustomerOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface CustomerReview {
  id: string;
  product_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  products: {
    name: string;
  };
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [dateRange, setDateRange] = useState<{from: string, to: string}>({from: '', to: ''});
  const [minOrders, setMinOrders] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdminAccess = useCallback(async () => {
    // No-op: access controlled globally by AdminRouteGuard
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/profiles?sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) throw new Error('Failed to load customers');
      const data = await response.json();
      
      // For now, we'll set email as N/A since we can't easily access auth.users from client
      // In a real implementation, you'd need a server-side function or RPC to get emails
      const customersWithEmail = (data || []).map((customer: any) => ({
        ...customer,
        id: String(customer.id),
        email: 'N/A' // This would need to be populated via a server-side function
      }));
      
      setCustomers(customersWithEmail);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, toast]);

  const loadCustomerDetails = async (customer: Customer) => {
    try {
      // Load customer orders
      const ordersResponse = await fetch(`http://localhost:3001/api/orders/user/${customer.user_id}`);
      if (!ordersResponse.ok) throw new Error('Failed to load orders');
      const ordersData = await ordersResponse.json();

      // Load customer reviews (skip for now as product_reviews table may not exist in MySQL)
      const reviewsData: CustomerReview[] = [];

      setCustomerOrders((ordersData?.orders || []).map((o: any) => ({ ...o, id: String(o.id) })));
      setCustomerReviews(reviewsData || []);
      setSelectedCustomer(customer);
      setIsDetailsOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive",
      });
    }
  };

  const updateCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return;

    try {
      const response = await fetch(`http://localhost:3001/api/profiles/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          phone: customerData.phone,
          device_name: customerData.device_name,
          device_address: customerData.device_address,
          location: customerData.location,
        }),
      });

      if (!response.ok) throw new Error('Failed to update customer');

      toast({
        title: "Success",
        description: "Customer updated successfully",
      });

      setIsEditOpen(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const exportCustomers = async () => {
    try {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Device Name', 'Device Address', 'Location', 'Device Join Date', 'Account Created', 'Last Updated'],
        ...customers.map(customer => [
          `${customer.first_name} ${customer.last_name}`,
          customer.email || 'N/A',
          customer.phone || 'N/A',
          customer.device_name || 'N/A',
          customer.device_address || 'N/A',
          customer.location || 'N/A',
          customer.device_join_date ? new Date(customer.device_join_date).toLocaleDateString() : 'N/A',
          new Date(customer.created_at).toLocaleDateString(),
          new Date(customer.updated_at).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Customers exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export customers",
        variant: "destructive",
      });
    }
  };

  const getCustomerOrderCount = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/user/${userId}`);
      if (!response.ok) return 0;
      const data = await response.json();
      return data?.orders?.length || 0;
    } catch {
      return 0;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.device_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = !dateRange.from || !dateRange.to || 
      (new Date(customer.created_at) >= new Date(dateRange.from) && 
       new Date(customer.created_at) <= new Date(dateRange.to));
    
    return matchesSearch && matchesDateRange;
  });

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (sortBy || sortOrder) {
      loadCustomers();
    }
  }, [sortBy, sortOrder, loadCustomers]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const bulkExportSelected = async () => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select customers to export",
        variant: "destructive",
      });
      return;
    }

    const selectedCustomerData = customers.filter(c => selectedCustomers.includes(c.id));
    try {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Device Name', 'Device Address', 'Location', 'Device Join Date', 'Account Created', 'Last Updated'],
        ...selectedCustomerData.map(customer => [
          `${customer.first_name} ${customer.last_name}`,
          customer.email || 'N/A',
          customer.phone || 'N/A',
          customer.device_name || 'N/A',
          customer.device_address || 'N/A',
          customer.location || 'N/A',
          customer.device_join_date ? new Date(customer.device_join_date).toLocaleDateString() : 'N/A',
          new Date(customer.created_at).toLocaleDateString(),
          new Date(customer.updated_at).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected-customers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${selectedCustomers.length} customers exported successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export selected customers",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <main className="flex-1">
          <header className="bg-background border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Customer Management</h1>
                  <p className="text-muted-foreground">
                    View and manage customer accounts
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button onClick={exportCustomers} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  <div className="hidden sm:flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, phone, device, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="sort">Sort by:</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created_at">Join Date</SelectItem>
                          <SelectItem value="first_name">First Name</SelectItem>
                          <SelectItem value="last_name">Last Name</SelectItem>
                          <SelectItem value="updated_at">Last Updated</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                    </Button>
                  </div>
                  {selectedCustomers.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedCustomers.length} selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={bulkExportSelected}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Selected
                      </Button>
                    </div>
                  )}
                </div>
                
                {showAdvancedFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label htmlFor="date_from">From Date</Label>
                      <Input
                        id="date_from"
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date_to">To Date</Label>
                      <Input
                        id="date_to"
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_orders">Minimum Orders</Label>
                      <Input
                        id="min_orders"
                        type="number"
                        placeholder="0"
                        value={minOrders}
                        onChange={(e) => setMinOrders(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Device Join Date</TableHead>
                      <TableHead>Account Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={() => handleSelectCustomer(customer.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {customer.avatar_url && (
                              <img
                                src={customer.avatar_url}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {customer.first_name} {customer.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {customer.user_id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{customer.email || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{customer.phone || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Monitor className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">{customer.device_name || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">{customer.device_address || 'N/A'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{customer.location || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {customer.device_join_date ? new Date(customer.device_join_date).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(customer.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => loadCustomerDetails(customer)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingCustomer(customer);
                                setIsEditOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders ({customerOrders.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({customerReviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Name:</span>
                        <span>{selectedCustomer.first_name} {selectedCustomer.last_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{selectedCustomer.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{selectedCustomer.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">User ID:</span>
                        <span className="text-sm text-muted-foreground">{selectedCustomer.user_id}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Device Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Device Name:</span>
                        <span>{selectedCustomer.device_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Device Address:</span>
                        <span className="text-sm text-muted-foreground">{selectedCustomer.device_address || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span>{selectedCustomer.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Device Join Date:</span>
                        <span>{selectedCustomer.device_join_date ? new Date(selectedCustomer.device_join_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Joined:</span>
                        <span className="ml-2">{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <span className="ml-2">{new Date(selectedCustomer.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Total Orders:</span>
                        <span className="ml-2">{customerOrders.length}</span>
                      </div>
                      <div>
                        <span className="font-medium">Total Spent:</span>
                        <span className="ml-2">${customerOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerOrders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.order_number}</TableCell>
                              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No orders found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerReviews.length > 0 ? (
                      <div className="space-y-4">
                        {customerReviews.map((review) => (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{review.products?.name}</h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${
                                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {review.title && (
                              <h5 className="font-medium text-sm mb-1">{review.title}</h5>
                            )}
                            {review.comment && (
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No reviews found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    defaultValue={editingCustomer.first_name}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      first_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    defaultValue={editingCustomer.last_name}
                    onChange={(e) => setEditingCustomer({
                      ...editingCustomer,
                      last_name: e.target.value
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    phone: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Read-only)</Label>
                <Input
                  id="email"
                  value={editingCustomer.email || 'N/A'}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="device_name">Device Name</Label>
                <Input
                  id="device_name"
                  defaultValue={editingCustomer.device_name}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    device_name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="device_address">Device Address</Label>
                <Input
                  id="device_address"
                  defaultValue={editingCustomer.device_address}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    device_address: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  defaultValue={editingCustomer.location}
                  onChange={(e) => setEditingCustomer({
                    ...editingCustomer,
                    location: e.target.value
                  })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateCustomer(editingCustomer)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}