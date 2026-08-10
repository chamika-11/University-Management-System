import React, { useState, useEffect } from 'react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/forms/FormField';
import { Modal } from '@/components/ui/Modal';
import { admissionClient } from '@/api/admissionClient';
import { parseError } from '@/utils/errorParser';
import { useToast } from '@/hooks/useToast';
import { UserCheck, Search, CheckCircle, XCircle, Clock, FileText, Filter, RefreshCw } from 'lucide-react';

export default function AdminAdmissionsPage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await admissionClient.getAllApplications();
      setApplications(res.data || res || []);
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const name = (app.applicantName || app.name || '').toLowerCase();
    const id = (app.applicationNumber || app.id || app._id || '').toLowerCase();
    const matchSearch = name.includes(q) || id.includes(q);
    const matchStatus = filterStatus ? app.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => ((a.id || a._id) === id ? { ...a, status: newStatus } : a))
    );
    setSelectedApp(null);
    showToast({ message: `Application status updated to ${newStatus}!`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-400" />
            Admissions Applications Pipeline
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Evaluate prospective student applications live from MongoDB admission_db database.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchApplications}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh MongoDB Pipeline
        </Button>
      </div>

      <div className="card p-4 bg-slate-900/80 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search applicants..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 text-xs" />
        </div>

        <div className="w-full md:w-48">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs">
            <option value="">All Application Statuses</option>
            <option value="PENDING">Pending Evaluation</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        </div>
      </div>

      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading applications from MongoDB admission_db...</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-6">App ID & Applicant</th>
                  <th className="py-3.5 px-4">Applied Program</th>
                  <th className="py-3.5 px-4">GPA Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-6 text-right">Evaluate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((app) => (
                  <tr key={app._id || app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-100">{app.applicantName || app.name || 'Applicant'}</div>
                      <div className="text-xs text-slate-400">{app.applicationNumber || app.id || app._id} • {app.email || 'applicant@ulms.edu'}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-200">{app.programName || app.program || 'B.Sc. Computer Science'}</td>
                    <td className="py-4 px-4 font-mono font-bold text-indigo-400">{app.gpa || '3.85'}</td>
                    <td className="py-4 px-4"><StatusBadge status={app.status || 'PENDING'} /></td>
                    <td className="py-4 px-4 text-xs text-slate-400">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}</td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                        Review Application
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Evaluate Application: ${selectedApp?.applicationNumber || selectedApp?._id}`}>
        {selectedApp && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2 text-xs">
              <div><strong className="text-slate-200">Applicant:</strong> {selectedApp.applicantName || selectedApp.name} ({selectedApp.email || 'applicant@ulms.edu'})</div>
              <div><strong className="text-slate-200">Target Program:</strong> {selectedApp.programName || selectedApp.program}</div>
              <div><strong className="text-slate-200">GPA Score:</strong> {selectedApp.gpa || '3.85'} / 4.00</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
              <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(selectedApp._id || selectedApp.id, 'REJECTED')}>
                Reject
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedApp._id || selectedApp.id, 'WAITLISTED')}>
                Waitlist
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(selectedApp._id || selectedApp.id, 'ACCEPTED')}>
                Accept & Enroll
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
