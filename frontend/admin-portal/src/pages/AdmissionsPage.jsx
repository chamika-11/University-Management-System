import React from 'react';
import { Card } from '../components/ui/Card';

export default function AdmissionsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Admissions</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Oversight for applications, evaluation, offers, confirmations, and cycles.</p>
    </Card>
  );
}