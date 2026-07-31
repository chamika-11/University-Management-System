import React from 'react';
import { Card } from '../components/ui/Card';

export default function AttendanceAdminPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Attendance</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Admin access to student attendance across sections and sessions.</p>
    </Card>
  );
}