import React, { useState } from 'react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/forms/FormField';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { UserCheck, Search, CheckCircle, XCircle, Clock, FileText, Filter } from 'lucide-react';

const mockApplications = [
  { id: 'APP-2026-001', name: 'Sophia Martinez', email: 'sophia.m@gmail.com', program: 'B.Sc. Computer Science', gpa: '3.92', status: 'PENDING', date: '2026-08-01' },
  { id: 'APP-2026-002', name: 'Liam Johnson', email: 'liam.j@yahoo.com', program: 'M.Sc. Software Engineering', gpa: '3.75', status: 'ACCEPTED', date: '2026-08-02' },
  { id: 'APP-2026-003', name: 'Emma Watson', email: 'emma.w@outlook.com', program: 'B.Sc. Data Science', gpa: '3.85', status: 'PENDING', date: '2026-08-03' },
  { id: 'APP-2026-004', name: 'Noah Davis', email: 'noah.d@gmail.com', program: 'B.Sc. Electrical Engineering', gpa: '3.20', status: 'WAITLISTED', date: '2026-08-04' },
  { id: 'APP-2026-005', name: 'Olivia Brown', email: 'olivia.b@gmail.com', program: 'B.A. Business Admin', gpa: '2.95', status: 'REJECTED', date: '2026-08-05' },
];

export default function AdminAdmissionsPage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = applications.filter((app) => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? app.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setSelectedApp(null);
    showToast({ message: `Application ${id} updated to ${newStatus}!`, type: 'success' });
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
            Evaluate student prospective applications, verify entrance criteria, and manage acceptance letters.
          </p>
        </div>
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
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
              <tr>
                <th className="py-3.5 px-6">App ID & Name</th>
                <th className="py-3.5 px-4">Applied Program</th>
                <th className="py-3.5 px-4">GPA Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-6 text-right">Evaluate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-100">{app.name}</div>
                    <div className="text-xs text-slate-400">{app.id} • {app.email}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-200">{app.program}</td>
                  <td className="py-4 px-4 font-mono font-bold text-indigo-400">{app.gpa}</td>
                  <td className="py-4 px-4"><StatusBadge status={app.status} /></td>
                  <td className="py-4 px-4 text-xs text-slate-400">{app.date}</td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                      Review Application
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Evaluate Application: ${selectedApp?.id}`}>
        {selectedApp && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2 text-xs">
              <div><strong className="text-slate-200">Applicant:</strong> {selectedApp.name} ({selectedApp.email})</div>
              <div><strong className="text-slate-200">Target Program:</strong> {selectedApp.program}</div>
              <div><strong className="text-slate-200">GPA Score:</strong> {selectedApp.gpa} / 4.00</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
              <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}>
                Reject
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedApp.id, 'WAITLISTED')}>
                Waitlist
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(selectedApp.id, 'ACCEPTED')}>
                Accept & Enroll
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
