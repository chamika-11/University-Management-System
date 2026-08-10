import React, { useState } from 'react';
import { History, Shield, Search, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/forms/FormField';

const mockLogs = [
  { id: 'LOG-8901', event: 'USER_LOGIN_SUCCESS', user: 'superadmin@ulms.edu', ip: '127.0.0.1', timestamp: '2026-08-10 15:30:12', severity: 'INFO' },
  { id: 'LOG-8902', event: 'ACCOUNT_LOCKED', user: 'student@ulms.edu', ip: '192.168.1.45', timestamp: '2026-08-10 14:15:00', severity: 'WARN' },
  { id: 'LOG-8903', event: 'PASSWORD_RESET_REQUESTED', user: 'faculty@ulms.edu', ip: '172.18.0.1', timestamp: '2026-08-10 12:00:22', severity: 'INFO' },
];

export default function AdminAuditPage() {
  const [search, setSearch] = useState('');
  const filtered = mockLogs.filter((l) => l.event.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-400" />
            Security & System Audit Trail
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Real-time security event monitoring, IP tracking, and system access logs.
          </p>
        </div>
      </div>

      <div className="card p-4 bg-slate-900/80 border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search audit logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 text-xs" />
        </div>
      </div>

      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Event ID & Action</th>
              <th className="py-3.5 px-4">User Account</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-mono text-xs text-indigo-400 font-bold">{log.event} <span className="text-slate-500 block font-normal">{log.id}</span></td>
                <td className="py-4 px-4 font-medium text-slate-200">{log.user}</td>
                <td className="py-4 px-4 font-mono text-xs text-slate-400">{log.ip}</td>
                <td className="py-4 px-4"><Badge variant={log.severity === 'WARN' ? 'amber' : 'emerald'}>{log.severity}</Badge></td>
                <td className="py-4 px-6 text-right text-xs text-slate-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
