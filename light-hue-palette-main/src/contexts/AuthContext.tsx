import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate API calls - replace with actual API endpoints
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In a real app, this would check httpOnly cookies
      const token = localStorage.getItem('demo_user');
      if (token) {
        const userData = JSON.parse(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo implementation - replace with real API call
      if (email === 'demo@leadflow.com' && password === 'password') {
        const userData: User = {
          id: '1',
          email: email,
          first_name: 'Demo',
          last_name: 'User',
          created_at: new Date().toISOString(),
        };
        
        localStorage.setItem('demo_user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to LeadFlow.",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      // Demo implementation - replace with real API call
      const userData: User = {
        id: Date.now().toString(),
        email: email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem('demo_user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Account created!",
        description: "Welcome to LeadFlow. You can now start managing your leads.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('demo_user');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging you out.",
      });
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};