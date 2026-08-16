import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function RoleGuard({ children, allowedRoles }) {
  const role = useSelector((state) => state.auth.user.role);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}