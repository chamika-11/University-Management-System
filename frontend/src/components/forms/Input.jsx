import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${className}`}
      {...props}
    />
  );
}

export default Input;
