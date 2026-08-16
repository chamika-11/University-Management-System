import React from 'react';
import { Card } from '../components/ui/Card';

export default function NotificationsAdminPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Notifications</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Notification templates and manual dispatch controls for admins.</p>
    </Card>
  );
}