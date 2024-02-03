// src/components/ProtectedRoute.js
import React from 'react';
import {  Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children  }) => {
  const { isAuthenticated, isLoading } = useAuth();


  if (isLoading) {
    // Render a loading indicator while checking authentication status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('User not authenticated...routing to login')
    // Redirect to the login page if not authenticated
    return <Navigate to="/" />;
  }

  return children
};

export default ProtectedRoute;


