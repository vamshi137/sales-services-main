import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '@/lib/api';

// Demo mode flag - set to true for development without PHP backend
const DEMO_MODE = true;

// Demo users for testing different roles
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@ssspl.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@ssspl.com',
      role: 'admin',
      employeeId: 'EMP001',
      department: 'Administration',
      designation: 'System Administrator',
    },
  },
  'hr@ssspl.com': {
    password: 'hr123',
    user: {
      id: '2',
      name: 'HR Manager',
      email: 'hr@ssspl.com',
      role: 'hr',
      employeeId: 'EMP002',
      department: 'Human Resources',
      designation: 'HR Manager',
    },
  },
  'manager@ssspl.com': {
    password: 'manager123',
    user: {
      id: '3',
      name: 'John Smith',
      email: 'manager@ssspl.com',
      role: 'manager',
      employeeId: 'EMP003',
      department: 'Sales',
      designation: 'Sales Manager',
    },
  },
  'employee@ssspl.com': {
    password: 'employee123',
    user: {
      id: '4',
      name: 'Jane Doe',
      email: 'employee@ssspl.com',
      role: 'employee',
      employeeId: 'EMP004',
      department: 'Engineering',
      designation: 'Software Engineer',
    },
  },
  'accounts@ssspl.com': {
    password: 'accounts123',
    user: {
      id: '5',
      name: 'Accounts Team',
      email: 'accounts@ssspl.com',
      role: 'accounts',
      employeeId: 'EMP005',
      department: 'Finance',
      designation: 'Accounts Manager',
    },
  },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          if (DEMO_MODE) {
            // In demo mode, just restore from localStorage
            setUser(JSON.parse(storedUser));
          } else {
            // Validate token by fetching profile
            const response = await authAPI.getProfile();
            setUser(response.data.user);
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    if (DEMO_MODE) {
      // Demo mode login
      const demoUser = DEMO_USERS[email.toLowerCase()];
      if (demoUser && demoUser.password === password) {
        const fakeToken = 'demo_token_' + Date.now();
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('refreshToken', 'demo_refresh_token');
        localStorage.setItem('user', JSON.stringify(demoUser.user));
        setUser(demoUser.user);
        return;
      }
      throw new Error('Invalid credentials. Use demo accounts listed below.');
    }

    // Real API login
    try {
      const response = await authAPI.login(email, password);
      const { token, refreshToken, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!DEMO_MODE) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        isDemoMode: DEMO_MODE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
