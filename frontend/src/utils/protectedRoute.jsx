import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the route is for admin only and the user is not an admin
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />; // redirect to home or unauthorized page
  }

  return children;
};

export default ProtectedRoute;
