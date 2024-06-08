// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Add a method to update the authentication state directly
  const setAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading,checkAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
