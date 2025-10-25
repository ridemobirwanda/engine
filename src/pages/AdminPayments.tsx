import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, Search, Calendar, CreditCard } from "lucide-react";

interface PaymentRow {
  id: string;
  order_number?: string | null;
  user_id?: string | null;
  amount: number;
  currency?: string | null;
  method?: string | null;
  status?: string | null;
  paid_at?: string | null;
  address_summary?: string | null;
}

const AdminPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // Use orders as the payment source; map to payment rows
      const response = await fetch('http://localhost:3001/api/orders/all');
      if (!response.ok) throw new Error('Failed to load payments');
      const data = await response.json();

      const rows: PaymentRow[] = (data || []).map((o: any) => {
        const billingAddr = typeof o.billing_address === 'string' ? JSON.parse(o.billing_address || '{}') : o.billing_address || {};
        const shippingAddr = typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address || '{}') : o.shipping_address || {};
        
        return {
          id: String(o.id),
          order_number: o.order_number,
          user_id: o.user_id,
          amount: Number(o.total_amount || 0),
          currency: o.currency || 'USD',
          method: o.payment_method || 'N/A',
          status: o.payment_status || 'pending',
          paid_at: o.paid_at || (o.payment_status === 'paid' ? o.created_at : null),
          address_summary: billingAddr?.address_line1 || shippingAddr?.address_line1 || null,
        };
      });

      setPayments(rows);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to load payments', variant: 'destructive' });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const statusOk = statusFilter === 'all' ? true : (p.status || '').toLowerCase() === statusFilter;
      const methodOk = methodFilter === 'all' ? true : (p.method || '').toLowerCase() === methodFilter;
      const q = query.trim().toLowerCase();
      const qOk = !q
        || (p.order_number || '').toLowerCase().includes(q)
        || (p.user_id || '').toLowerCase().includes(q)
        || (p.method || '').toLowerCase().includes(q);
      return statusOk && methodOk && qOk;
    });
  }, [payments, statusFilter, methodFilter, query]);

  const exportCsv = () => {
    const headers = ['Order #', 'User', 'Amount', 'Currency', 'Method', 'Status', 'Paid At', 'Address'];
    const csv = [headers.join(',')]
      .concat(
        filtered.map(p => [
          p.order_number || '',
          p.user_id || '',
          p.amount.toFixed(2),
          p.currency || 'USD',
          p.method || 'N/A',
          p.status || '',
          p.paid_at ? new Date(p.paid_at).toLocaleString() : '',
          (p.address_summary || '').replace(/,/g, ' '),
        ].join(','))
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Orbitron'] text-gradient">Payments</h1>
          <p className="text-muted-foreground">Track who paid, how much, paid date, address, and method</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search order #, user, method" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payments ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading payments...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Order #</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Method</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Paid Date</th>
                    <th className="text-left py-2">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b hover:bg-muted/40">
                      <td className="py-2">{p.order_number || '-'}</td>
                      <td className="py-2">{p.user_id?.slice(0,8) || '-'}</td>
                      <td className="py-2 font-medium">{p.currency || 'USD'} {p.amount.toLocaleString()}</td>
                      <td className="py-2 flex items-center gap-2"><CreditCard className="h-3 w-3" /> {p.method || 'N/A'}</td>
                      <td className="py-2">
                        <Badge variant={p.status === 'paid' ? 'default' : p.status === 'failed' ? 'destructive' : 'secondary'}>
                          {p.status || '-'}
                        </Badge>
                      </td>
                      <td className="py-2">{p.paid_at ? new Date(p.paid_at).toLocaleString() : '-'}</td>
                      <td className="py-2 truncate max-w-[240px]" title={p.address_summary || ''}>{p.address_summary || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;