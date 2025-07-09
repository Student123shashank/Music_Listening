import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getCurrentUser(token);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching current user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await signIn(credentials);
      localStorage.setItem('token', response.data.token);
      setUser({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        avatar: response.data.avatar
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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