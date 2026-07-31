import React from 'react';
import { Card } from '../components/ui/Card';

export default function TimetablePage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Timetable</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Schedules, classrooms, time slots, holidays, and class cancellation management.</p>
    </Card>
  );
}