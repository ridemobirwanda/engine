import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { findActiveAdmin } from '@/services/adminUsersService';

export default function AdminLoginIsolated() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('AdminLoginIsolated - Attempting MySQL login with:', email);
      
      // MySQL authentication
      const { user, session } = await authService.login(email, password);

      console.log('AdminLoginIsolated - Login successful, user:', user);
      
      // Check if user is an admin (only search by email now)
      const adminData = await findActiveAdmin({ email: user.email });
      
      if (!adminData) {
        // Check if user is super admin by email
        const superAdminEmails = (import.meta.env.VITE_SUPER_ADMIN_EMAILS || 'admin@admin.com')
          .split(',')
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean);

        if (superAdminEmails.includes(user.email.toLowerCase())) {
          console.log('AdminLoginIsolated - Super admin access granted');
          // Create super admin data
          const superAdminData = {
            id: user.id,
            user_id: String(user.id),
            email: user.email,
            role: 'super_admin',
            permissions: ['full_access'],
            is_active: true,
          };
          
          // Store in localStorage
          localStorage.setItem('admin_user', JSON.stringify(superAdminData));
          
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          });
          
          // Redirect to admin dashboard
          window.location.href = '/admin';
          return;
        } else {
          await authService.logout();
          throw new Error('Access denied. Your account is not an active admin.');
        }
      }

      // Store admin data
      localStorage.setItem('admin_user', JSON.stringify(adminData));
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (error) {
      console.error('AdminLoginIsolated - Login error:', error);
      const message = error instanceof Error ? error.message : 'Login failed.';
      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Default credentials:</p>
            <p><strong>Email:</strong> admin@admin.com</p>
            <p><strong>Password:</strong> Admin123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

