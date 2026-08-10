import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select, FormField } from '@/components/forms/FormField';
import { Modal } from '@/components/ui/Modal';
import { Layers, Calendar, Plus, Edit, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const initialSemesters = [
  { id: 'SEM-2026-FALL', name: 'Fall 2026 Semester', startDate: '2026-09-01', endDate: '2026-12-20', status: 'ACTIVE', sections: 48 },
  { id: 'SEM-2026-SPRING', name: 'Spring 2026 Semester', startDate: '2026-01-15', endDate: '2026-05-15', status: 'COMPLETED', sections: 42 },
  { id: 'SEM-2027-SPRING', name: 'Spring 2027 Semester', startDate: '2027-01-15', endDate: '2027-05-15', status: 'UPCOMING', sections: 12 },
];

export default function AdminSemestersPage() {
  const { showToast } = useToast();
  const [semesters, setSemesters] = useState(initialSemesters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'UPCOMING',
    sections: '0',
  });

  const handleCreateSemester = (e) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) {
      showToast({ message: 'Please complete all required fields.', type: 'error' });
      return;
    }

    const created = {
      id: `SEM-${Date.now().toString().slice(-4)}`,
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      sections: parseInt(form.sections, 10) || 0,
    };

    setSemesters([created, ...semesters]);
    setIsCreateModalOpen(false);
    setForm({ name: '', startDate: '', endDate: '', status: 'UPCOMING', sections: '0' });
    showToast({ message: `Academic Term "${created.name}" created successfully!`, type: 'success' });
  };

  const handleUpdateStatus = (id, newStatus) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setSelectedSemester(null);
    showToast({ message: `Term status updated to ${newStatus}!`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-400" />
            Academic Semesters & Term Governance
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Configure academic calendars, term registration windows, and section offerings.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> Create New Term
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {semesters.map((sem) => (
          <div key={sem.id} className="card p-5 border border-white/10 space-y-3 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-indigo-400 font-bold">{sem.id}</span>
              <Badge variant={sem.status === 'ACTIVE' ? 'emerald' : sem.status === 'COMPLETED' ? 'slate' : 'sky'}>
                {sem.status}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{sem.name}</h3>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {sem.startDate} to {sem.endDate}
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <span>Active Sections: <strong>{sem.sections}</strong></span>
              <Button variant="outline" size="sm" onClick={() => setSelectedSemester(sem)}>
                Manage Term
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE TERM MODAL */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Academic Term">
        <form onSubmit={handleCreateSemester} className="space-y-4">
          <FormField label="Semester Name">
            <Input placeholder="e.g. Summer 2027 Semester" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date">
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </FormField>
            <FormField label="End Date">
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </FormField>
          </div>

          <FormField label="Term Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Term</Button>
          </div>
        </form>
      </Modal>

      {/* MANAGE TERM MODAL */}
      <Modal isOpen={!!selectedSemester} onClose={() => setSelectedSemester(null)} title={`Manage Term: ${selectedSemester?.name}`}>
        {selectedSemester && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2 text-xs">
              <div><strong className="text-slate-200">Term ID:</strong> {selectedSemester.id}</div>
              <div><strong className="text-slate-200">Dates:</strong> {selectedSemester.startDate} to {selectedSemester.endDate}</div>
              <div><strong className="text-slate-200">Sections Offered:</strong> {selectedSemester.sections}</div>
            </div>

            <FormField label="Update Term Status">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedSemester.id, 'ACTIVE')}>Set Active</Button>
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedSemester.id, 'COMPLETED')}>Set Completed</Button>
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedSemester.id, 'UPCOMING')}>Set Upcoming</Button>
              </div>
            </FormField>
          </div>
        )}
      </Modal>
    </div>
  );
}
