import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api';              // Axios con baseURL y withCredentials: true
import { fetchSession, logout as apiLogout } from '@/lib/auth'; // /auth/me y /auth/logout

type AuthUser = {
  id: number;
  email: string;
  nombre?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const u = await fetchSession(); // GET /auth/me (devuelve usuario si cookie válida)
      if (u) {
        // Normalizamos nombres de campos al shape del backend
        setUser({ id: u.id, email: u.email, nombre: u.nombre ?? null });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Cargar sesión al montar (si ya hay cookie válida)
    refreshSession();

    // Opcional: cuando la pestaña recupera foco, refrescar sesión
    const onFocus = () => refreshSession();
    window.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    try {
      // POST /auth/login — el backend setea cookie httpOnly y devuelve { ok: true, usuario }
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.ok && res.data?.usuario) {
        setUser({
          id: res.data.usuario.id,
          email: res.data.usuario.email ?? email.toLowerCase(),
          nombre: res.data.usuario.nombre ?? null,
        });
        return true;
      }
      // fallback: si el backend no devuelve usuario, intentamos /auth/me
      await refreshSession();
      return !!user;
    } catch {
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiLogout(); // POST /auth/logout (borra cookie en backend)
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
