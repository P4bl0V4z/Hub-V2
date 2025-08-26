import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchSession, logout as apiLogout } from '@/lib/auth';

type AuthUser = {
  id: string | number;
  name?: string | null;
  email: string;
  tipoUsuario?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      const u = await fetchSession();
      if (u) {
        setUser({ id: u.id, email: u.email, name: u.nombre ?? null, tipoUsuario: u.tipoUsuario ?? null });
      } else {
        setUser(null);
      }
    })();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'beloop_authenticated' && e.newValue !== 'true') {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('beloop_authenticated');
    localStorage.removeItem('beloop_user_name');
    localStorage.removeItem('beloop_user_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
