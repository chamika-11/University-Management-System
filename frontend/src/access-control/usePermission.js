import { useSelector } from 'react-redux';
import { selectUserPermissions, selectActiveRole, selectUserRoles } from '@/store/authSlice';

/**
 * Custom hook for checking permissions and roles within components.
 * Usage:
 *   const { can, hasRole, activeRole, permissions } = usePermission();
 *   if (can('grades:write')) { ... }
 */
export function usePermission() {
  const permissions = useSelector(selectUserPermissions) || [];
  const activeRole = useSelector(selectActiveRole);
  const userRoles = useSelector(selectUserRoles) || [];

  const can = (requiredPermission) => {
    if (!requiredPermission) return true;
    if (activeRole === 'SUPER_ADMIN') return true;
    return permissions.includes(requiredPermission);
  };

  const canAll = (requiredPermissions = []) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (activeRole === 'SUPER_ADMIN') return true;
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  const canAny = (requiredPermissions = []) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (activeRole === 'SUPER_ADMIN') return true;
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasRole = (...targetRoles) => {
    if (!targetRoles || targetRoles.length === 0) return true;
    const upperTargets = targetRoles.map((r) => r.toUpperCase());
    return upperTargets.includes((activeRole || '').toUpperCase()) ||
           userRoles.some((r) => upperTargets.includes((r || '').toUpperCase()));
  };

  return {
    can,
    canAll,
    canAny,
    hasRole,
    activeRole,
    permissions,
    userRoles,
  };
}
