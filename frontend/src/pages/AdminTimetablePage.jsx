import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';

const mockSchedule = [
  { id: 1, course: 'CS101 - Intro to CS', room: 'Hall A - Room 101', time: 'Mon/Wed 09:00 - 10:30', instructor: 'Dr. Robert Smith', status: 'CONFIRMED' },
  { id: 2, course: 'SE302 - Software Architecture', room: 'Lab B - Room 204', time: 'Tue/Thu 11:00 - 12:30', instructor: 'Dr. Sarah Johnson', status: 'CONFIRMED' },
  { id: 3, course: 'AI401 - Artificial Intelligence', room: 'Auditorium 1', time: 'Mon/Wed 14:00 - 15:30', instructor: 'Dr. Michael Williams', status: 'CONFIRMED' },
];

export default function AdminTimetablePage() {
  const { showToast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-400" />
            Timetable Governance & Venues
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Allocate lecture halls, schedule time slots, and verify venue conflict matrix.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => showToast({ message: 'Timetable slot created.', type: 'success' })}>
          <Plus className="w-4 h-4 mr-2" /> Add Schedule Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockSchedule.map((s) => (
          <div key={s.id} className="card p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-100">{s.course}</span>
              <Badge variant="emerald">{s.status}</Badge>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> {s.time}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> {s.room}
            </div>
            <div className="text-xs text-slate-300 pt-2 border-t border-white/5">Instructor: <strong>{s.instructor}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}
