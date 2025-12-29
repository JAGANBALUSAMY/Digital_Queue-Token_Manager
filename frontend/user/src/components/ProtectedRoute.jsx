import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/login' }) => {
  // In a real app, this would check for a valid token and user role
  // For now, we'll simulate the check based on localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
  // Check if user is authenticated and has required role
  const isAuthenticated = !!token;
  const hasRole = user && allowedRoles.includes(user.role);
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!hasRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;