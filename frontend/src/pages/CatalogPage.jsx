import React from 'react';
import { Card } from '../components/ui/Card';

export default function CatalogPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Catalog</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Colleges, departments, programs, courses, and syllabus administration.</p>
    </Card>
  );
}