import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { spotifyService } from '@/lib/spotify';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  user: any;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session by fetching profile
    spotifyService.getProfile()
      .then(profile => {
        setUser(profile);
        setAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    spotifyService.logout();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 