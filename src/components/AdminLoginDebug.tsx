import { useMySQLAuth } from '@/hooks/useMySQLAuth';
import { useState } from 'react';

export const AdminLoginDebug = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, debugInfo, addDebugInfo } = useMySQLAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    addDebugInfo(`Login attempt: ${email}`);

    try {
      await login(email, password);
      addDebugInfo('Login successful!');
    } catch (err: any) {
      addDebugInfo(`Login failed: ${err.message}`);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing
  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    addDebugInfo(`Quick login: ${userEmail}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '800px',
        border: '1px solid #333'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'Orbitron, monospace'
        }}>
          🔐 Admin Login Debug
        </h2>
        
        {/* Quick Login Buttons */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px' }}>Quick Access:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => quickLogin('admin@admin.com', 'Admin123!')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🚀 Super Admin
            </button>
            <button
              onClick={() => quickLogin('admin@engine.com', 'Engine123!')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              ⚙️ Engine Admin
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px',
              border: '1px solid #ff6666'
            }}>
              ❌ {error}
            </div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#fff',
              fontSize: '14px'
            }}>
              📧 Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #444',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: '#333',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '600',
              color: '#fff',
              fontSize: '14px'
            }}>
              🔑 Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #444',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: '#333',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#666' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
          >
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>
        
        {/* Debug Information */}
        <div style={{ 
          marginTop: '30px',
          backgroundColor: '#333',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '16px' }}>🔍 Debug Information:</h3>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '15px',
            borderRadius: '6px',
            maxHeight: '200px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#00ff00'
          }}>
            {debugInfo.length === 0 ? (
              <div style={{ color: '#666' }}>No debug information yet...</div>
            ) : (
              debugInfo.map((info, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  {info}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          fontSize: '14px',
          color: '#aaa'
        }}>
          <p style={{ margin: '5px 0' }}><strong>Super Admin:</strong> admin@admin.com</p>
          <p style={{ margin: '5px 0' }}><strong>Engine Admin:</strong> admin@engine.com</p>
          <p style={{ margin: '10px 0', fontSize: '12px' }}>
            💡 Check the debug information above to see what's happening
          </p>
        </div>
      </div>
    </div>
  );
};

