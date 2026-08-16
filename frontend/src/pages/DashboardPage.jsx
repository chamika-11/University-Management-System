import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/charts/StatCard';
import { Table } from '../components/ui/Table';

const stats = [
  { label: 'Active users', value: '1,284', detail: '+12 this week' },
  { label: 'Pending admissions', value: '86', detail: '14 need review' },
  { label: 'Open invoices', value: '$243k', detail: '31 overdue items' },
  { label: 'Unread alerts', value: '19', detail: '6 critical' },
];

const activities = [
  { id: '1', title: 'Admission offer confirmed', meta: 'Admissions', status: 'Completed' },
  { id: '2', title: 'New finance report generated', meta: 'Reporting', status: 'Ready' },
  { id: '3', title: 'Template updated for SMS alerts', meta: 'Notifications', status: 'Updated' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div>
            <Badge tone="brand">Admin overview</Badge>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--brand-strong)]">Operate admissions, academics, finance, and communications from one shell.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              This dashboard matches the architecture brief: gateway-first API access, role-guarded routes, and a desktop-oriented administration workspace.
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--brand)] p-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">System status</div>
            <div className="mt-3 text-2xl font-semibold">Healthy</div>
            <p className="mt-2 text-sm text-white/80">Gateway connected, query cache ready, and admin services mapped.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {stats.map((item, index) => (
          <StatCard key={item.label} {...item} accent={index === 1} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--brand-strong)]">Recent operational activity</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">A compact activity stream for the admin landing page.</p>
            </div>
          </div>
          <div className="mt-5">
            <Table
              columns={[
                { key: 'title', label: 'Action' },
                { key: 'meta', label: 'Domain' },
                { key: 'status', label: 'Status' },
              ]}
              rows={activities}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--brand-strong)]">Admin focus</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
            <li>User and role management with RBAC-safe shell routes.</li>
            <li>Admission, academic, and timetable oversight with lazy page loading.</li>
            <li>Finance, reports, documents, search, and notification admin panels.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}