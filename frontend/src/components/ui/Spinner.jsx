import React from 'react';

export function Spinner({ label = 'Loading' }) {
  return <div className="text-sm text-[var(--text-muted)]">{label}...</div>;
}