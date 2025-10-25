import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '@/services/authService';

interface GuestUser {
  id: string;
  email: string;
  isGuest: boolean;
}

interface GuestAuthContextType {
  guestUser: GuestUser | null;
  setGuestUser: (user: GuestUser | null) => void;
  isAuthenticated: boolean;
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined);

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }
  return context;
};

interface GuestAuthProviderProps {
  children: ReactNode;
}

export const GuestAuthProvider = ({ children }: GuestAuthProviderProps) => {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing guest session in localStorage
    const storedGuest = localStorage.getItem('guest_user');
    if (storedGuest) {
      try {
        const guest = JSON.parse(storedGuest);
        setGuestUser(guest);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored guest user:', error);
        localStorage.removeItem('guest_user');
      }
    }

    // Check for MySQL auth session
    const checkAuth = async () => {
      const user = await authService.getUser();
      if (user) {
        // User is logged in, clear guest session
        setGuestUser(null);
        setIsAuthenticated(true);
        localStorage.removeItem('guest_user');
      } else {
        // No user session, check if we have a guest session
        const storedGuest = localStorage.getItem('guest_user');
        if (storedGuest) {
          try {
            const guest = JSON.parse(storedGuest);
            setGuestUser(guest);
            setIsAuthenticated(true);
          } catch (error) {
            setGuestUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setGuestUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  const handleSetGuestUser = (user: GuestUser | null) => {
    setGuestUser(user);
    setIsAuthenticated(!!user);
    
    if (user) {
      localStorage.setItem('guest_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('guest_user');
    }
  };

  return (
    <GuestAuthContext.Provider 
      value={{ 
        guestUser, 
        setGuestUser: handleSetGuestUser, 
        isAuthenticated 
      }}
    >
      {children}
    </GuestAuthContext.Provider>
  );
};
