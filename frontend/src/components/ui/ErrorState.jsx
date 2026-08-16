import React from 'react';

export function ErrorState({ title = 'Unable to load content', message = 'Please try again.' }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-red-800">{message}</div>
    </div>
  );
}