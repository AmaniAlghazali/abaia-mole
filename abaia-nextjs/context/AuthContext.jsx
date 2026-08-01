'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveToken = (t) => {
    setToken(t);
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };

  const fetchUser = useCallback(async (tok) => {
    if (!tok) { setLoading(false); return; }
    try {
      const res = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      setUser(res.data.user);
    } catch {
      saveToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    setToken(stored);
    fetchUser(stored);
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const loginWithToken = (tok, userData) => {
    saveToken(tok);
    setUser(userData);
  };

  const logout = () => {
    saveToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
