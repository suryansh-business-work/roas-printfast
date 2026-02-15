import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { IUser, UserRole } from '../types/user.types';
import * as authService from '../services/auth.service';

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: UserRole.ADMIN_USER | UserRole.VENDOR_USER;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      setUser(response.data);
    }
  }, []);

  const signup = useCallback(
    async (data: {
      email: string;
      password: string;
      confirmPassword: string;
      firstName: string;
      lastName: string;
      role: UserRole.ADMIN_USER | UserRole.VENDOR_USER;
    }) => {
      const response = await authService.signup(data);
      if (response.success && response.data) {
        setUser(response.data);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
