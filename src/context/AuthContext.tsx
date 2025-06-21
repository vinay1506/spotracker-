import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { spotifyService } from '@/lib/spotify';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: any; // You can create a specific User type
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('spotifyToken'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const validateToken = async () => {
      if (token) {
        try {
          const profileData = await spotifyService.getProfile();
          if (isMounted) setUser(profileData);
          if (isMounted) setLoading(false);
        } catch (error) {
          console.error("Session expired or token is invalid.", error);
          if (isMounted) logout();
          if (isMounted) setLoading(false);
        }
      } else {
        if (isMounted) setLoading(false);
      }
    };
    validateToken();
    return () => { isMounted = false; };
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('spotifyToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('spotifyToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 