// src/components/routing/AdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, loading, user } = useSelector(state => state.admin);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'seller')) {
    return <Navigate to="/admin/login" />;
  }

  return <Outlet />;
};

export default AdminRoute;