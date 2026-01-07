import { createContext, useState, useEffect } from 'react';
import { getUser, getAuthToken, setUser as saveUser, setAuthToken, logout as authLogout } from '../utils/auth';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      setToken(data.token);
      saveUser(data);
      setAuthToken(data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authLogout();
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};