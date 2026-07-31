import React from 'react';

export function Button({ children, variant = 'primary', ...props }) {
  const Component = props.as || 'button';
  const classes = {
    primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]',
    secondary: 'bg-white text-[var(--brand)] border border-[var(--border)] hover:bg-[var(--surface-soft)]',
    ghost: 'bg-transparent text-[var(--brand)] hover:bg-[var(--surface-soft)]',
  };

  const { as, className, ...rest } = props;

  return (
    <Component
      {...rest}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${classes[variant] || classes.primary} ${className || ''}`}
    >
      {children}
    </Component>
  );
}