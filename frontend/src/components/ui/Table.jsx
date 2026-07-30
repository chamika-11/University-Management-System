import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-slate-900/60 backdrop-blur-md">
      <table className={`data-table ${className}`}>{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return <thead className="border-b border-white/5 bg-slate-900/80">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-white/5">{children}</tbody>;
}

export function Th({ children, className = '' }) {
  return <th className={`px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3.5 text-sm text-slate-300 ${className}`}>{children}</td>;
}

export function Tr({ children, className = '' }) {
  return <tr className={`hover:bg-white/[0.02] transition-colors ${className}`}>{children}</tr>;
}
