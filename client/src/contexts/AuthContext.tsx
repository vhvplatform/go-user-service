/**
 * Authentication Context
 * Manages authentication state and provides auth methods to the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/services/api';
import { SessionTimeoutChecker } from '@/utils/securityUtils';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: (reason?: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }) => Promise<boolean>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<SessionTimeoutChecker | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();

        if (currentUser && isAuth) {
          setUser(currentUser);
          setupSessionTimeout();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup
    return () => {
      if (sessionTimeout) {
        sessionTimeout.destroy();
      }
    };
  }, []);

  // Setup session timeout
  const setupSessionTimeout = () => {
    if (sessionTimeout) {
      sessionTimeout.destroy();
    }

    const timeout = new SessionTimeoutChecker(
      30 * 60 * 1000, // 30 minutes
      () => {
        handleLogout('Session expired due to inactivity');
        toast.warning('Your session has expired. Please login again.');
      }
    );

    setSessionTimeout(timeout);
  };

  // Login
  const handleLogin = async (
    username: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await authService.login({
        username,
        password,
        rememberMe,
      });

      if (response.success && response.user) {
        setUser(response.user);
        setupSessionTimeout();
        toast.success('Login successful!');
        return true;
      }

      toast.error(response.error || 'Login failed');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async (reason?: string) => {
    try {
      setIsLoading(true);
      await authService.logout(reason);
      setUser(null);
      
      if (sessionTimeout) {
        sessionTimeout.destroy();
        setSessionTimeout(null);
      }

      if (!reason) {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const handleRegister = async (data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await authService.register(data);

      if (response.success && response.user) {
        setUser(response.user);
        setupSessionTimeout();
        toast.success('Registration successful!');
        return true;
      }

      toast.error(response.error || 'Registration failed');
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
