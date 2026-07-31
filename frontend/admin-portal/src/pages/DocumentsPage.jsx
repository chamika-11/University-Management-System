import React from 'react';
import { Card } from '../components/ui/Card';

export default function DocumentsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Documents</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">File uploads, certificates, and document management tools.</p>
    </Card>
  );
}