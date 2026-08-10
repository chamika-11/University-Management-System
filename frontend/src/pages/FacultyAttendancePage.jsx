import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

const mockStudents = [
  { id: 'STU-001', name: 'John Doe', status: 'PRESENT' },
  { id: 'STU-010', name: 'Alice Smith', status: 'PRESENT' },
  { id: 'STU-011', name: 'Bob Johnson', status: 'LATE' },
  { id: 'STU-012', name: 'Carol Williams', status: 'ABSENT' },
];

export default function FacultyAttendancePage() {
  const { showToast } = useToast();
  const [students, setStudents] = useState(mockStudents);

  const toggleStatus = (id, newStatus) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const handleSaveAttendance = () => {
    showToast({ message: 'Daily class rollcall saved!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-400" />
            Class Attendance Rollcall
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Mark daily student attendance for CS101 Section 01 (Mon 09:00 - 10:30).
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleSaveAttendance} className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Save className="w-4 h-4" /> Save Attendance Matrix
        </Button>
      </div>

      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Student</th>
              <th className="py-3.5 px-4 text-center">Present</th>
              <th className="py-3.5 px-4 text-center">Late</th>
              <th className="py-3.5 px-4 text-center">Absent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-100">{s.name} <span className="text-xs text-slate-400 block font-normal">{s.id}</span></td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => toggleStatus(s.id, 'PRESENT')} className={`p-2 rounded-xl border transition-colors ${s.status === 'PRESENT' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
                    Present
                  </button>
                </td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => toggleStatus(s.id, 'LATE')} className={`p-2 rounded-xl border transition-colors ${s.status === 'LATE' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
                    Late
                  </button>
                </td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => toggleStatus(s.id, 'ABSENT')} className={`p-2 rounded-xl border transition-colors ${s.status === 'ABSENT' ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
