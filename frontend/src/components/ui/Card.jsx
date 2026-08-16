import React from 'react';

export function Card({ children, className = '' }) {
  return <section className={`portal-card rounded-3xl ${className}`}>{children}</section>;
}