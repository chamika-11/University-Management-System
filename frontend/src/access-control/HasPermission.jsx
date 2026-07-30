import React from 'react';
import { usePermission } from './usePermission';

/**
 * Structural UI component guard.
 * Usage:
 *   <HasPermission name="grades:write" fallback={<p>Not allowed</p>}>
 *     <EditGradeButton />
 *   </HasPermission>
 */
export function HasPermission({ name, anyOf, allOf, role, fallback = null, children }) {
  const { can, canAny, canAll, hasRole } = usePermission();

  let isAllowed = true;

  if (name) {
    isAllowed = isAllowed && can(name);
  }

  if (anyOf && anyOf.length > 0) {
    isAllowed = isAllowed && canAny(anyOf);
  }

  if (allOf && allOf.length > 0) {
    isAllowed = isAllowed && canAll(allOf);
  }

  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    isAllowed = isAllowed && hasRole(...rolesArray);
  }

  if (!isAllowed) {
    return fallback;
  }

  return <>{children}</>;
}

export default HasPermission;
