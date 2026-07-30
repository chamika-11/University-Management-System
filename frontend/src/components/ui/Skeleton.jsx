import React from 'react';

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-800 rounded w-3/4 skeleton"></div>
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3 animate-pulse">
      <div className="h-5 bg-slate-800 rounded w-1/3 skeleton"></div>
      <div className="h-4 bg-slate-800/60 rounded w-full skeleton"></div>
      <div className="h-4 bg-slate-800/60 rounded w-2/3 skeleton"></div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-800 rounded skeleton ${
            i === lines - 1 ? 'w-1/2' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
}
