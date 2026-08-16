import React from 'react';
import { Card } from '../components/ui/Card';

export default function SectionDetailPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Section detail</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Enrollment lists and section-level configuration live here.</p>
    </Card>
  );
}