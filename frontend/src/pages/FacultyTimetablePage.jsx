import React from 'react';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const mockFacultySchedule = [
  { day: 'Monday', time: '09:00 - 10:30', course: 'CS101 - Intro to CS', room: 'Hall A', section: 'Sec 01' },
  { day: 'Monday', time: '14:00 - 15:30', course: 'AI401 - Artificial Intelligence', room: 'Auditorium 1', section: 'Sec 01' },
  { day: 'Tuesday', time: '11:00 - 12:30', course: 'SE302 - Software Architecture', room: 'Lab B', section: 'Sec 02' },
  { day: 'Wednesday', time: '09:00 - 10:30', course: 'CS101 - Intro to CS', room: 'Hall A', section: 'Sec 01' },
];

export default function FacultyTimetablePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-400" />
            My Teaching Schedule
          </h1>
          <p className="page-subtitle text-sm text-slate-400 mt-1">
            Weekly lecture schedule, lab hours, and room assignments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockFacultySchedule.map((item, idx) => (
          <div key={idx} className="card p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="indigo">{item.day}</Badge>
              <Badge variant="emerald">{item.section}</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-100">{item.course}</h3>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> {item.time}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> {item.room}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
