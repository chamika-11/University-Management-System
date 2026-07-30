import React from 'react';
import { usePermission } from '@/access-control/usePermission';
import ForbiddenPage from './ForbiddenPage';

export function PermissionGuard({ requirePermission, allowedRoles, children }) {
  const { can, hasRole } = usePermission();

  if (requirePermission && !can(requirePermission)) {
    return <ForbiddenPage message={`Missing required permission: ${requirePermission}`} />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return <ForbiddenPage message={`Required role(s): ${allowedRoles.join(', ')}`} />;
  }

  return <>{children}</>;
}

export default PermissionGuard;
