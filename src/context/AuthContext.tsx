import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  { id: '1', email: 'admin@sweetshop.com', password: 'Admin123!', name: 'Admin User', role: 'ADMIN' as const },
  { id: '2', email: 'user@sweetshop.com', password: 'User123!', name: 'Regular User', role: 'USER' as const },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('sweetshop_user');
    const savedToken = localStorage.getItem('sweetshop_token');
    if (savedUser && savedToken) {
      setState({
        user: JSON.parse(savedUser),
        token: savedToken,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = `jwt_${user.id}_${Date.now()}`;
    const userData: User = { id: user.id, email: user.email, name: user.name, role: user.role };
    
    localStorage.setItem('sweetshop_user', JSON.stringify(userData));
    localStorage.setItem('sweetshop_token', token);
    
    setState({ user: userData, token, isAuthenticated: true });
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = { id: `${Date.now()}`, email, name, role: 'USER' };
    const token = `jwt_${newUser.id}_${Date.now()}`;
    
    localStorage.setItem('sweetshop_user', JSON.stringify(newUser));
    localStorage.setItem('sweetshop_token', token);
    
    setState({ user: newUser, token, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('sweetshop_user');
    localStorage.removeItem('sweetshop_token');
    setState({ user: null, token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      register, 
      logout, 
      isAdmin: state.user?.role === 'ADMIN' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
