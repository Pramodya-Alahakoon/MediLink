import React, { createContext, useContext, useState, useEffect } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data } = await customFetch.post('/api/auth/verify', { token });
      setUser(data);
    } catch (error) {
      console.warn("Auth verification failed:", error.message);
      sessionStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const login = (userData, token) => {
    sessionStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await customFetch.post('/api/auth/logout');
    } catch (error) {
      console.warn("Logout API failed:", error.message);
    } finally {
      sessionStorage.removeItem('token');
      setUser(null);
      toast.success("Logged out successfully");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkUserStatus }}>
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
