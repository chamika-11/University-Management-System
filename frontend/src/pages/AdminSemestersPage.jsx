import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Layers, Calendar, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const mockSemesters = [
  { id: 'SEM-2026-FALL', name: 'Fall 2026 Semester', startDate: '2026-09-01', endDate: '2026-12-20', status: 'ACTIVE', sections: 48 },
  { id: 'SEM-2026-SPRING', name: 'Spring 2026 Semester', startDate: '2026-01-15', endDate: '2026-05-15', status: 'COMPLETED', sections: 42 },
  { id: 'SEM-2027-SPRING', name: 'Spring 2027 Semester', startDate: '2027-01-15', endDate: '2027-05-15', status: 'UPCOMING', sections: 0 },
];

export default function AdminSemestersPage() {
  const { showToast } = useToast();
  const [semesters] = useState(mockSemesters);

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
        <Button variant="primary" size="md" onClick={() => showToast({ message: 'New semester creation wizard initialized.', type: 'info' })}>
          <Plus className="w-4 h-4 mr-2" /> Create New Term
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {semesters.map((sem) => (
          <div key={sem.id} className="card p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-indigo-400 font-bold">{sem.id}</span>
              <Badge variant={sem.status === 'ACTIVE' ? 'emerald' : sem.status === 'COMPLETED' ? 'slate' : 'sky'}>
                {sem.status}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{sem.name}</h3>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {sem.startDate} to {sem.endDate}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <span>Active Sections: <strong>{sem.sections}</strong></span>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
