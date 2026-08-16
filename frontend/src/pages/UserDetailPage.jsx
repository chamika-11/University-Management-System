import React from 'react';
import { Card } from '../components/ui/Card';

export default function UserDetailPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">User detail</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Placeholder detail view for user records and role actions.</p>
    </Card>
  );
}