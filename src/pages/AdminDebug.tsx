import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllSettings } from '@/services/websiteSettingsService';

export default function AdminDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  const adminAuth = useMySQLAuth();

  useEffect(() => {
    const runDebug = async () => {
      try {
        // Test Supabase connection
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        // Test admin users table
        const { data: adminUsers, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .limit(1);

        // Test website settings table
        const settings = await getAllSettings();

        setDebugInfo({
          session: {
            data: sessionData,
            error: sessionError
          },
          adminUsers: {
            data: adminUsers,
            error: adminError
          },
          settings: {
            data: settings,
            error: null // Supabase error handling removed
          },
          adminAuth: {
            isAuthenticated: adminAuth.isAuthenticated,
            loading: adminAuth.loading,
            adminUser: adminAuth.adminUser
          },
          localStorage: {
            admin_user: localStorage.getItem('admin_user'),
            supabase_auth_token: localStorage.getItem('supabase.auth.token')
          }
        });
      } catch (error) {
        setDebugInfo({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    runDebug();
  }, []);

  if (loading) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => {
                localStorage.removeItem('admin_user');
                localStorage.removeItem('supabase.auth.token');
                window.location.reload();
              }}
            >
              Clear Cache & Reload
            </Button>
            <Button 
              onClick={() => {
                localStorage.setItem('admin_user', JSON.stringify({
                  id: 'debug-admin',
                  user_id: 'debug-user-id',
                  email: 'admin@admin.com',
                  role: 'super_admin',
                  permissions: { all: true },
                  is_active: true
                }));
                window.location.reload();
              }}
            >
              Set Debug Admin User
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

