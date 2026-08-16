import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Page not found</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">The requested admin route does not exist.</p>
      <div className="mt-6">
        <Button as={Link} to="/dashboard">Go to dashboard</Button>
      </div>
    </Card>
  );
}