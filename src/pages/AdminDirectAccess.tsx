import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { useEffect, useState } from 'react';

const AdminDirectAccess = () => {
  const { login, isAuthenticated, adminUser, loading } = useAdminAuth();
  const [status, setStatus] = useState('');

  // Auto-login as super admin for testing
  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated && !loading) {
        setStatus('Attempting auto-login as Super Admin...');
        try {
          await login('admin@admin.com', 'Admin123!');
          setStatus('✅ Auto-login successful!');
        } catch (error: any) {
          setStatus(`❌ Auto-login failed: ${error.message}`);
        }
      }
    };

    autoLogin();
  }, [isAuthenticated, loading, login]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #333',
            borderTop: '5px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>🔄 Checking Admin Access...</h2>
          <p>{status}</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && adminUser) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#2a2a2a',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h1 style={{
            fontSize: '32px',
            marginBottom: '20px',
            color: '#4CAF50',
            fontFamily: 'Orbitron, monospace'
          }}>
            🎉 Admin Access Granted!
          </h1>
          
          <div style={{
            backgroundColor: '#333',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#4CAF50', marginBottom: '15px' }}>👤 User Information:</h2>
            <p><strong>Email:</strong> {adminUser.email}</p>
            <p><strong>Role:</strong> {adminUser.role}</p>
            <p><strong>Permissions:</strong> {adminUser.permissions.join(', ')}</p>
            <p><strong>Active:</strong> {adminUser.is_active ? '✅ Yes' : '❌ No'}</p>
          </div>

          <div style={{
            backgroundColor: '#333',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>🚀 Available Actions:</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <button style={{
                padding: '15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                📊 Analytics
              </button>
              <button style={{
                padding: '15px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                🛍️ Products
              </button>
              <button style={{
                padding: '15px',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                📦 Orders
              </button>
              <button style={{
                padding: '15px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                👥 Customers
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: '#333',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h2 style={{ color: '#ff9800', marginBottom: '15px' }}>🔗 Quick Links:</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="/admin/analytics" style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                📈 Analytics Dashboard
              </a>
              <a href="/admin/products" style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                🛍️ Product Management
              </a>
              <a href="/admin/orders" style={{
                padding: '10px 20px',
                backgroundColor: '#ff6b35',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                📦 Order Management
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>❌</h1>
        <h2>Admin Access Denied</h2>
        <p style={{ marginBottom: '20px' }}>{status}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🔄 Retry
        </button>
      </div>
    </div>
  );
};

export default AdminDirectAccess;
