import React from 'react';
import { Card } from '../components/ui/Card';

export default function RolesPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Roles</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Manage permissions and assign capabilities to administrative roles.</p>
    </Card>
  );
}