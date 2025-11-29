import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // In a real app, you'd have a more robust check, e.g., validating a token
  return localStorage.getItem('token') !== null;
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
