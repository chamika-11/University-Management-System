import React, { useState } from 'react';
import { BookOpen, Users, Layers, Search, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const mockSections = [
  { id: 'SEC-CS101-01', code: 'CS101-01', title: 'Intro to Computer Science - Section 01', enrolled: 32, max: 35, room: 'Hall A' },
  { id: 'SEC-SE302-02', code: 'SE302-02', title: 'Software Architecture - Section 02', enrolled: 28, max: 30, room: 'Lab B' },
];

export default function FacultySectionsPage() {
  const [sections] = useState(mockSections);
  const [selectedSection, setSelectedSection] = useState(mockSections[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            Assigned Teaching Sections & Rosters
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            View course sections assigned to you for teaching, student roster lists, and section details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase text-slate-400">My Teaching Sections</div>
          {sections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => setSelectedSection(sec)}
              className={`card p-4 cursor-pointer border transition-all ${
                selectedSection.id === sec.id ? 'bg-indigo-950/30 border-indigo-500/40 shadow-lg' : 'bg-slate-900 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">{sec.code}</span>
                <Badge variant="sky">{sec.enrolled}/{sec.max} Enrolled</Badge>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mt-1">{sec.title}</h4>
              <div className="text-xs text-slate-400 mt-2">Venue: {sec.room}</div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 card p-6 bg-slate-900 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{selectedSection.title}</h3>
              <p className="text-xs text-slate-400">Enrolled Student Roster ({selectedSection.enrolled} Students)</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-white/5">
              <div><strong className="text-slate-100">John Doe</strong> (STU-2026-0001)</div>
              <Badge variant="emerald">ENROLLED</Badge>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-white/5">
              <div><strong className="text-slate-100">Alice Smith</strong> (STU-2026-0010)</div>
              <Badge variant="emerald">ENROLLED</Badge>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl flex items-center justify-between border border-white/5">
              <div><strong className="text-slate-100">Bob Johnson</strong> (STU-2026-0011)</div>
              <Badge variant="emerald">ENROLLED</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
