import React from 'react';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-indigo-500 border-r-transparent align-[-0.125em] ${sizes[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PageSpinner({ label = 'Loading page content...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6">
      <Spinner size="lg" className="mb-3" />
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

export function FullPageSpinner({ label = 'Initializing application session...' }) {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <div className="absolute w-8 h-8 rounded-full border-4 border-indigo-400/30 border-b-indigo-400 animate-spin-slow"></div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-1">Authenticating secure RBAC session context</p>
      </div>
    </div>
  );
}
