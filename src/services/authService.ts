// MySQL-based authentication service

const API_URL = 'http://localhost:3001/api/auth';

interface AuthResponse {
  user: {
    id: number;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    email_verified: boolean;
  };
  session: {
    access_token: string;
    expires_at: string;
  };
}

interface User {
  id: number;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.session.access_token);
    return data;
  }

  async signup(email: string, password: string, full_name?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.session.access_token);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async getUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          return null;
        }
        throw new Error('Failed to get user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get user error:', error);
      this.clearToken();
      return null;
    }
  }

  async updateUser(updates: { full_name?: string; avatar_url?: string }): Promise<User> {
    const response = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }

    const data = await response.json();
    return data.user;
  }

  getSession(): { access_token: string } | null {
    if (!this.token) {
      return null;
    }
    return { access_token: this.token };
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
export default authService;

