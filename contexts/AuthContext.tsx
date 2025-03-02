'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user types
export type UserRole = 'admin' | 'user' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API response for login
const mockLoginResponse = async (username: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Admin credentials
  if (username === 'admin' && password === 'admin') {
    return {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };
  }
  
  // Regular user credentials
  if (username === 'user' && password === 'user') {
    return {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user'
    };
  }
  
  // Invalid credentials
  return null;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check for existing session in localStorage
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('electron-next-user');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user', error);
          localStorage.removeItem('electron-next-user');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to your backend
      // const response = await fetch('/api/v1/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      // const data = await response.json();
      
      // Using our mock API response instead
      const userData = await mockLoginResponse(username, password);
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('electron-next-user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('electron-next-user');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Components for role-based access control
export const AdminOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }
  
  return <>{children}</>;
};

export const UserOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export const AuthenticatedOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export const UnauthenticatedOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};