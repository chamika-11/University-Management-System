import React from 'react';
import { BarChart3, TrendingUp, Download, PieChart, Users, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Executive Reports & Analytics
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Institutional Key Performance Indicators, academic pass rates, and demographic distributions.
          </p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Download className="w-4 h-4" /> Export Report Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> GPA Distribution Matrix
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1"><span>First Class (GPA 3.7 - 4.0)</span><span>38%</span></div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[38%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1"><span>Upper Second (GPA 3.3 - 3.69)</span><span>44%</span></div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[44%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1"><span>Lower Second (GPA 3.0 - 3.29)</span><span>14%</span></div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[14%]"></div></div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-sky-400" /> Department Enrollment Share
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300 border-b border-white/5 py-1.5"><span>Computer Science & IT</span><strong>42% (1,240 Students)</strong></div>
            <div className="flex justify-between text-slate-300 border-b border-white/5 py-1.5"><span>Software Engineering</span><strong>28% (820 Students)</strong></div>
            <div className="flex justify-between text-slate-300 border-b border-white/5 py-1.5"><span>Artificial Intelligence & Data</span><strong>18% (530 Students)</strong></div>
            <div className="flex justify-between text-slate-300 py-1.5"><span>Business & Humanities</span><strong>12% (350 Students)</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
