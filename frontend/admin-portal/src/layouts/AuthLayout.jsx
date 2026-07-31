import React from 'react';

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="portal-card w-full max-w-md rounded-[2rem] p-8">{children}</div>
    </div>
  );
}