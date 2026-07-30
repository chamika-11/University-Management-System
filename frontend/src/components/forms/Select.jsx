import React from 'react';

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
