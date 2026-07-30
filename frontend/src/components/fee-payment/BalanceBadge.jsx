import React from 'react';
import { formatCurrency } from '@/utils/formatters';

export function BalanceBadge({ balance }) {
  const isPositive = balance > 0;
  const isZero = balance === 0;

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`text-2xl font-bold ${isPositive ? 'text-rose-400' : isZero ? 'text-emerald-400' : 'text-emerald-400'}`}>
        {formatCurrency(balance)}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isPositive ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
        {isPositive ? 'Balance Due' : 'Account Clear'}
      </span>
    </div>
  );
}
