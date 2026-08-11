import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, FormField } from '@/components/forms/FormField';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';

const initialSchedule = [
  { id: 1, course: 'CS101 - Intro to CS', room: 'Hall A - Room 101', time: 'Mon/Wed 09:00 - 10:30', instructor: 'Dr. Robert Smith', status: 'CONFIRMED' },
  { id: 2, course: 'SE302 - Software Architecture', room: 'Lab B - Room 204', time: 'Tue/Thu 11:00 - 12:30', instructor: 'Dr. Sarah Johnson', status: 'CONFIRMED' },
  { id: 3, course: 'AI401 - Artificial Intelligence', room: 'Auditorium 1', time: 'Mon/Wed 14:00 - 15:30', instructor: 'Dr. Michael Williams', status: 'CONFIRMED' },
];

export default function AdminTimetablePage() {
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [form, setForm] = useState({
    course: '',
    room: 'Hall A - Room 101',
    dayTime: '',
    instructor: '',
  });

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!form.course || !form.dayTime || !form.instructor) {
      showToast({ message: 'Please fill out all schedule slot fields.', type: 'error' });
      return;
    }

    const created = {
      id: Date.now(),
      course: form.course,
      room: form.room,
      time: form.dayTime,
      instructor: form.instructor,
      status: 'CONFIRMED',
    };

    setSchedule([created, ...schedule]);
    setIsAddModalOpen(false);
    setForm({ course: '', room: 'Hall A - Room 101', dayTime: '', instructor: '' });
    showToast({ message: `Timetable schedule slot added for ${created.course}!`, type: 'success' });
  };

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
        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> Add Schedule Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schedule.map((s) => (
          <div key={s.id} className="card p-5 border border-white/10 space-y-3 hover:border-indigo-500/30 transition-all">
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
            <div className="text-xs text-slate-300 pt-2 border-t border-white/5">
              Instructor: <strong>{s.instructor}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* ADD SCHEDULE SLOT MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Timetable Schedule Slot">
        <form onSubmit={handleAddSlot} className="space-y-4">
          <FormField label="Course Name & Code">
            <Input placeholder="e.g. CS201 - Data Structures" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
          </FormField>

          <FormField label="Venue / Lecture Hall">
            <Select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}>
              <option value="Hall A - Room 101">Hall A - Room 101</option>
              <option value="Lab B - Room 204">Lab B - Room 204</option>
              <option value="Auditorium 1">Auditorium 1</option>
              <option value="Science Block - Room 302">Science Block - Room 302</option>
            </Select>
          </FormField>

          <FormField label="Day & Time Slot">
            <Input placeholder="Mon/Wed 10:00 - 11:30" value={form.dayTime} onChange={(e) => setForm({ ...form, dayTime: e.target.value })} />
          </FormField>

          <FormField label="Assigned Instructor">
            <Input placeholder="Dr. Robert Smith" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Schedule Slot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
