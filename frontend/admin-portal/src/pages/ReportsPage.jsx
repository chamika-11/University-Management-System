import React from 'react';
import { Card } from '../components/ui/Card';

export default function ReportsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Reports</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Academic and financial report generation with audit-ready tracking.</p>
    </Card>
  );
}