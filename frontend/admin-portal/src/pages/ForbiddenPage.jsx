import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function ForbiddenPage() {
  return (
    <div className="px-4 py-12">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Access control</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--brand-strong)]">Forbidden</h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">Your role does not have permission to access this route.</p>
        <div className="mt-6">
          <Button as={Link} to="/dashboard">
            Return to dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}