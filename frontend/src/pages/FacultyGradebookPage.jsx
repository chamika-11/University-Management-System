import React, { useState } from 'react';
import { GraduationCap, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/forms/FormField';
import { useToast } from '@/hooks/useToast';

const mockGradebook = [
  { id: 'STU-001', name: 'John Doe', quiz1: 18, quiz2: 19, midterm: 88, final: 92, grade: 'A' },
  { id: 'STU-010', name: 'Alice Smith', quiz1: 15, quiz2: 17, midterm: 79, final: 85, grade: 'B+' },
  { id: 'STU-011', name: 'Bob Johnson', quiz1: 12, quiz2: 14, midterm: 65, final: 70, grade: 'C' },
];

export default function FacultyGradebookPage() {
  const { showToast } = useToast();
  const [gradebook, setGradebook] = useState(mockGradebook);

  const handleSaveMarks = () => {
    showToast({ message: 'Gradebook marks saved successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
            Section Gradebook & Student Marking
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Input student quiz scores, midterm marks, final exam grades, and compute course letter grades.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleSaveMarks} className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Save className="w-4 h-4" /> Save Gradebook Changes
        </Button>
      </div>

      <div className="card p-0 bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
            <tr>
              <th className="py-3.5 px-6">Student</th>
              <th className="py-3.5 px-4">Quiz 1 (20)</th>
              <th className="py-3.5 px-4">Quiz 2 (20)</th>
              <th className="py-3.5 px-4">Midterm (100)</th>
              <th className="py-3.5 px-4">Final Exam (100)</th>
              <th className="py-3.5 px-6 text-right">Computed Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gradebook.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-100">{row.name} <span className="text-xs text-slate-400 block font-normal">{row.id}</span></td>
                <td className="py-4 px-4 font-mono">{row.quiz1}</td>
                <td className="py-4 px-4 font-mono">{row.quiz2}</td>
                <td className="py-4 px-4 font-mono">{row.midterm}</td>
                <td className="py-4 px-4 font-mono">{row.final}</td>
                <td className="py-4 px-6 text-right font-bold text-indigo-400 text-base">{row.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
