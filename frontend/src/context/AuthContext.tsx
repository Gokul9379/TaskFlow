import { createContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  userName: string;
  login: (token: string, email: string, name?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('userName') || (localStorage.getItem('userEmail')?.split('@')[0] || 'User');
  });
  
  const navigate = useNavigate();

  const login = (newToken: string, email: string, name?: string) => {
    const resolvedName = name || email.split('@')[0];
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', resolvedName);
    
    setToken(newToken);
    setUserEmail(email);
    setUserName(resolvedName);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setToken(null);
    setUserEmail(null);
    setUserName('User');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};