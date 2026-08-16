import React from 'react';
import { Card } from '../components/ui/Card';

export default function ApplicationDetailPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Application detail</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Evaluation, offer issuance, and confirmation flows belong here.</p>
    </Card>
  );
}