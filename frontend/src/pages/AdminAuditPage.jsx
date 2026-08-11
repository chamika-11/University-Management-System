import React, { useState, useEffect, useCallback } from 'react';
import { History, Shield, Search, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { userClient } from '@/api/userClient';
import { parseError } from '@/utils/errorParser';
import { useToast } from '@/hooks/useToast';

export default function AdminAuditPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userClient.getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const email = (l.email || '').toLowerCase();
    const reason = (l.failReason || l.eventType || '').toLowerCase();
    const ip = (l.ipAddress || '').toLowerCase();
    return email.includes(q) || reason.includes(q) || ip.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-400" />
            Security & System Audit Trail
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Real-time security audit coverage tracking all authentication attempts, failed logins (including non-existent accounts), and IP access events.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAuditLogs} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Security Audit Logs
        </Button>
      </div>

      <div className="card p-4 bg-slate-900/80 border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search security logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 text-xs" />
        </div>
      </div>

      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Event Result</th>
              <th className="py-3.5 px-4">Attempted Email</th>
              <th className="py-3.5 px-4">IP Address & Agent</th>
              <th className="py-3.5 px-4">Status / Reason</th>
              <th className="py-3.5 px-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 text-xs">
                  {loading ? 'Fetching security audit logs...' : 'No security audit logs recorded yet.'}
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log._id || log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-mono text-xs">
                    {log.success ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> LOGIN_SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> LOGIN_FAILED
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-200">{log.email}</td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-400">
                    {log.ipAddress || '127.0.0.1'}
                    <span className="block text-[10px] text-slate-500 truncate max-w-xs">{log.userAgent || 'Web Browser'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={log.success ? 'emerald' : 'rose'}>
                      {log.success ? 'AUTHENTICATED' : log.failReason || 'INVALID_CREDENTIALS'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-slate-400">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
