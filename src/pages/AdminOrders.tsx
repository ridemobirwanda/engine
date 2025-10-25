import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Eye, Package, CheckCircle2, Clock, XCircle, Search, FileDown } from 'lucide-react';
import { OrderService } from '@/services/orderService';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  created_at: string;
  shipped_at: string;
  delivered_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
	const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
	const [query, setQuery] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTotal, setNewTotal] = useState('0');
  const [newUserId, setNewUserId] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders/all');
      if (!response.ok) throw new Error('Failed to load orders');
      const data = await response.json();
      setOrders((data || []).map((o: any) => ({ ...o, id: String(o.id) })));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      setCreating(true);
      const total = parseFloat(newTotal) || 0;
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: newUserId || null,
          total_amount: total,
          subtotal: total,
          tax_amount: 0,
          shipping_amount: 0,
          payment_status: 'pending',
          status: 'pending',
          order_number: `ENG-${Date.now()}`,
          currency: 'USD',
          items: [],
        }),
      });
      if (!response.ok) throw new Error('Failed to create order');
      toast({ title: 'Order Created', description: 'New order has been created' });
      setCreateOpen(false);
      setNewTotal('0');
      setNewUserId('');
      loadOrders();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to create order', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this order?')) return;
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete order');
      toast({ title: 'Order Deleted', description: 'Order has been removed' });
      loadOrders();
    } catch (e: any) {
      toast({ title: 'Error', description: `Delete failed: ${e?.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
        updateData.delivered_at = null;
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      } else {
        updateData.shipped_at = null;
        updateData.delivered_at = null;
      }
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update order');

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
      loadOrders();
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to update order', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
			case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
			case 'pending': return 'secondary';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

	const toTitle = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

	const filteredOrders = orders.filter((o) => {
		const statusOk = statusFilter === 'all' ? true : o.status === statusFilter;
		const q = query.trim().toLowerCase();
		if (!q) return statusOk;
		return statusOk && (
			o.order_number?.toLowerCase().includes(q) ||
			o.user_id?.toLowerCase().includes(q)
		);
	});

  const openDetails = async (orderId: string) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);
      const data = await OrderService.getOrderById(orderId);
      setSelectedOrder(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to load order details', variant: 'destructive' });
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const exportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = filteredOrders.map(o => ({
      order_number: o.order_number,
      date: new Date(o.created_at).toLocaleString(),
      user_id: o.user_id,
      total: `$${o.total_amount.toLocaleString()}`,
      status: toTitle(o.status),
      payment_status: toTitle(o.payment_status)
    }));
    const headers = ['Order #', 'Date', 'User', 'Total', 'Status', 'Payment'];
    const tableRows = rows.map(r => `
      <tr>
        <td>${r.order_number}</td>
        <td>${r.date}</td>
        <td>${r.user_id}</td>
        <td>${r.total}</td>
        <td>${r.status}</td>
        <td>${r.payment_status}</td>
      </tr>
    `).join('');
    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Orders Export</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; }
          h1 { margin: 0 0 16px; font-size: 20px; }
          .meta { color: #666; font-size: 12px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #f5f5f5; text-align: left; }
          tr:nth-child(even){ background: #fafafa; }
          @media print {
            @page { margin: 16mm; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Orders Export</h1>
        <div class="meta">Generated: ${new Date().toLocaleString()} &middot; Count: ${rows.length}</div>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="6">No orders</td></tr>'}
          </tbody>
        </table>
        <button onclick="window.print()" style="margin-top:16px;padding:8px 12px">Print / Save as PDF</button>
      </body>
    </html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
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
						<h1 className="text-2xl font-bold">Order Management</h1>
						<p className="text-muted-foreground">
							Track and update orders: Pending → Processing → Shipped → Delivered
						</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Orders</CardTitle>
                <div className="flex gap-2">
                <Button size="sm" onClick={() => setCreateOpen(true)}>New Order</Button>
                <Button size="sm" variant="outline" onClick={exportPdf}>
                  <FileDown className="w-4 h-4 mr-2" /> Export PDF
                </Button>
                </div>
              </CardHeader>
              <CardContent>
					{/* Filters */}
					<div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
						<div className="flex gap-2 items-center">
							<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
								<SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="processing">Processing</SelectItem>
									<SelectItem value="shipped">Shipped</SelectItem>
									<SelectItem value="delivered">Delivered</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input className="pl-9 w-64" placeholder="Search order # or user id" value={query} onChange={(e) => setQuery(e.target.value)} />
							</div>
						</div>
						{/* Legend */}
						<div className="flex flex-wrap gap-2 text-xs items-center">
							<span className="text-muted-foreground">Legend:</span>
							<Badge variant="secondary">Pending</Badge>
							<Badge>Processing</Badge>
							<Badge variant="outline">Shipped</Badge>
							<Badge>Delivered</Badge>
							<Badge variant="destructive">Cancelled</Badge>
						</div>
					</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
							{filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.order_number}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {order.user_id}
                        </TableCell>
                        <TableCell>
                          ${order.total_amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Badge variant={getStatusColor(order.status)}>
														{toTitle(order.status)}
													</Badge>
												</TooltipTrigger>
												<TooltipContent>Fulfillment status</TooltipContent>
											</Tooltip>
										</TooltipProvider>
                        </TableCell>
                        <TableCell>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Badge variant={getPaymentStatusColor(order.payment_status)}>
														{toTitle(order.payment_status)}
													</Badge>
												</TooltipTrigger>
												<TooltipContent>Payment status</TooltipContent>
											</Tooltip>
										</TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                      {order.status !== 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'pending')}>
                          <Clock className="w-4 h-4 mr-1" /> Mark Pending
                        </Button>
                      )}
											{order.status === 'pending' && (
												<Button size="sm" onClick={() => updateOrderStatus(order.id, 'processing')}>
													<Clock className="w-4 h-4 mr-1" /> Mark Processing
												</Button>
											)}
											{order.status === 'processing' && (
												<Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped')}>
													<Package className="w-4 h-4 mr-1" /> Mark Shipped
												</Button>
											)}
											{order.status === 'shipped' && (
												<Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
													<CheckCircle2 className="w-4 h-4 mr-1" /> Mark Delivered
												</Button>
											)}
											{order.status !== 'delivered' && order.status !== 'cancelled' && (
												<Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
													<XCircle className="w-4 h-4 mr-1" /> Cancel
												</Button>
											)}
                          <Button size="sm" variant="outline" onClick={() => openDetails(order.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteOrder(order.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Order Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Order Details {selectedOrder ? `#${selectedOrder.order_number}` : ''}</DialogTitle>
                </DialogHeader>
                {detailsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : selectedOrder ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Placed</p>
                        <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant={getStatusColor(selectedOrder.status)}>{toTitle(selectedOrder.status)}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Payment</p>
                        <Badge variant={getPaymentStatusColor(selectedOrder.payment_status)}>{toTitle(selectedOrder.payment_status)}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-semibold mb-2">Shipping Address</p>
                        <pre className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{JSON.stringify(selectedOrder.shipping_address, null, 2)}</pre>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Billing Address</p>
                        <pre className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{JSON.stringify(selectedOrder.billing_address || selectedOrder.shipping_address, null, 2)}</pre>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Items</p>
                      <div className="space-y-2 max-h-64 overflow-auto pr-2">
                        {(selectedOrder.order_items || []).map((it: any) => (
                          <div key={it.id} className="flex items-center justify-between text-sm border-b border-border/50 py-2">
                            <div className="flex items-center gap-3">
                              <img src={(it.product_snapshot?.image) || '/placeholder.svg'} className="w-10 h-10 rounded object-cover" />
                              <div>
                                <p className="font-medium">{it.product_snapshot?.name || it.product?.name || 'Item'}</p>
                                <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(it.total_price || (it.unit_price * it.quantity)).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">@ ${it.unit_price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="font-medium">${selectedOrder.subtotal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Shipping</p>
                        <p className="font-medium">${selectedOrder.shipping_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold">${selectedOrder.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No details</div>
                )}
              </DialogContent>
            </Dialog>

        {/* Create Order Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">User ID (optional)</label>
                <Input value={newUserId} onChange={(e) => setNewUserId(e.target.value)} placeholder="user_uuid or leave empty" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total Amount</label>
                <Input value={newTotal} onChange={(e) => setNewTotal(e.target.value)} placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={createOrder} disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}