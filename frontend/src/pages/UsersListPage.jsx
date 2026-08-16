import React from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';

const rows = [
  { id: 'u1', name: 'Ayesha Khan', role: 'STUDENT', status: 'Active' },
  { id: 'u2', name: 'Martin Silva', role: 'FACULTY', status: 'Locked' },
  { id: 'u3', name: 'Denise Ford', role: 'STAFF', status: 'Active' },
];

export default function UsersListPage() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-[var(--brand-strong)]">Users</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Admin-facing user directory with lock, unlock, and RBAC management hooks.</p>
      <div className="mt-6">
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
        />
      </div>
    </Card>
  );
}