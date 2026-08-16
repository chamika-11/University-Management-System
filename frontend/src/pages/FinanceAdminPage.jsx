import React from 'react';
import { Card } from '../components/ui/Card';

export default function FinanceAdminPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Finance</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Invoices and ledger balances for finance oversight.</p>
    </Card>
  );
}