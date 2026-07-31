import React from 'react';
import { Card } from '../components/ui/Card';

export default function AuditPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Audit trail</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Review system-level actions and governance events here.</p>
    </Card>
  );
}