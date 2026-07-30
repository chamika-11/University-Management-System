import React from 'react';

export function Badge({ children, variant = 'slate', className = '' }) {
  const variants = {
    emerald: 'badge-emerald',
    amber: 'badge-amber',
    rose: 'badge-rose',
    indigo: 'badge-indigo',
    slate: 'badge-slate',
    sky: 'badge-sky',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant] || variants.slate} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const statusUpper = (status || '').toUpperCase();

  const map = {
    ACTIVE: { variant: 'emerald', label: 'Active' },
    PASSED: { variant: 'emerald', label: 'Passed' },
    COMPLETED: { variant: 'emerald', label: 'Completed' },
    CONFIRMED: { variant: 'emerald', label: 'Confirmed' },
    PAID: { variant: 'emerald', label: 'Paid' },
    RETURNED: { variant: 'emerald', label: 'Returned' },
    GRADED: { variant: 'emerald', label: 'Graded' },

    PENDING: { variant: 'amber', label: 'Pending' },
    ENROLLED: { variant: 'sky', label: 'Enrolled' },
    SUBMITTED: { variant: 'amber', label: 'Submitted' },
    WAITLISTED: { variant: 'amber', label: 'Waitlisted' },
    ISSUED: { variant: 'amber', label: 'Issued' },

    FAILED: { variant: 'rose', label: 'Failed' },
    CANCELLED: { variant: 'rose', label: 'Cancelled' },
    LOCKED: { variant: 'rose', label: 'Locked' },
    OVERDUE: { variant: 'rose', label: 'Overdue' },
    REJECTED: { variant: 'rose', label: 'Rejected' },
    UNPAID: { variant: 'rose', label: 'Unpaid' },
  };

  const item = map[statusUpper] || { variant: 'slate', label: status || 'Unknown' };

  return <Badge variant={item.variant} className={className}>{item.label}</Badge>;
}
