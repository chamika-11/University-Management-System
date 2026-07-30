import React from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/formatters';

export function InvoiceCard({ invoice, onPay, isPaying }) {
  if (!invoice) return null;

  const isUnpaid = invoice.status === 'UNPAID' || invoice.status === 'PENDING' || invoice.status === 'OVERDUE';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-xl gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-slate-100">{invoice.title || `Invoice #${invoice._id?.slice(-6)}`}</h4>
          <StatusBadge status={invoice.status} />
        </div>
        <p className="text-xs text-slate-400">
          Due Date: {formatDate(invoice.dueDate)} • Category: {invoice.category || 'Tuition'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Amount</p>
          <p className="text-base font-bold text-slate-100">{formatCurrency(invoice.amount)}</p>
        </div>

        {isUnpaid && (
          <Button
            variant="primary"
            size="sm"
            loading={isPaying}
            onClick={() => onPay(invoice)}
          >
            Pay Now
          </Button>
        )}
      </div>
    </div>
  );
}
