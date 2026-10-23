import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { IUser } from '@shared/types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<IUser>;
  register: (data: any) => Promise<IUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res: any = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<IUser> => {
    const res: any = await api.post('/auth/login', credentials);
    if (res.accessToken) {
      localStorage.setItem('bse_access_token', res.accessToken);
    }
    setUser(res.user);
    return res.user;
  };

  const register = async (data: any): Promise<IUser> => {
    const res: any = await api.post('/auth/register', data);
    if (res.accessToken) {
      localStorage.setItem('bse_access_token', res.accessToken);
    }
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore error on logout
    }
    localStorage.removeItem('bse_access_token');
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller',
        isCustomer: user?.role === 'customer',
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
