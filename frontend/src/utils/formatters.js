/**
 * Utility formatters for dates, currency, percentages, GPA, and roles.
 */

export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPercentage(val) {
  if (val === undefined || val === null) return '—';
  return `${Number(val).toFixed(1)}%`;
}

export function formatGPA(gpa) {
  if (gpa === undefined || gpa === null) return '0.00';
  return Number(gpa).toFixed(2);
}

export function formatRoleName(role) {
  if (!role) return '';
  const mapping = {
    STUDENT: 'Student',
    FACULTY: 'Faculty Member',
    STAFF: 'Staff Member',
    ADMIN: 'Administrator',
    SUPER_ADMIN: 'Super Admin',
  };
  return mapping[role.toUpperCase()] || role;
}
