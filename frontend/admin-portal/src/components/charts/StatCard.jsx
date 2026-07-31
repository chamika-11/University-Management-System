import React from 'react';

export function StatCard({ label, value, detail, accent = false }) {
  return (
    <div className={`rounded-3xl border p-5 ${accent ? 'border-[var(--brand)] bg-[var(--brand)] text-white' : 'border-[var(--border)] bg-white'}`}>
      <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>{label}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      <div className={`mt-2 text-sm ${accent ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>{detail}</div>
    </div>
  );
}