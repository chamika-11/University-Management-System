import React from 'react';
import { Card } from '../components/ui/Card';

export default function CourseDetailPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Course detail</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Use this screen for syllabus, prerequisites, and course metadata.</p>
    </Card>
  );
}