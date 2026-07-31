import React from 'react';
import { Card } from '../components/ui/Card';

export default function SearchPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Search</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Platform-wide search and reindex controls for administrators.</p>
    </Card>
  );
}