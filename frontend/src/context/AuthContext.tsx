import { createContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  userName: string; // <-- Added userName
  login: (token: string, email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper to decode the JWT token and grab the name
const getDecodedName = (token: string | null, email: string | null) => {
  if (!token) return 'User';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Returns the name from the token, OR falls back to the email prefix
    return payload.name || (email ? email.split('@')[0] : 'User');
  } catch (e) {
    return email ? email.split('@')[0] : 'User';
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const navigate = useNavigate();

  // Dynamically get the name
  const userName = getDecodedName(token, userEmail);

  const login = (newToken: string, email: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', email);
    setToken(newToken);
    setUserEmail(email);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserEmail(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};