import React from 'react';
import { useMyEnrollments } from '@/features/enrollment/useEnrollment';
import { useMyAttendance } from '@/features/timetable/useTimetable';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatPercentage } from '@/utils/formatters';
import { Clock, Calendar } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const TimetablePage = () => {
  const { data: enrollments } = useMyEnrollments();
  const list = Array.isArray(enrollments) ? enrollments : enrollments?.enrollments || [];

  // Build a simple weekly grid from enrollment schedules
  const gridEvents = [];
  list.forEach((e) => {
    if (e.schedule) {
      gridEvents.push({ label: e.courseName || e.courseId, schedule: e.schedule, color: 'indigo' });
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="card">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5">
          <Calendar size={15} className="text-indigo-400" /> Weekly Schedule
        </h2>
        {list.length === 0 ? (
          <EmptyState icon={Clock} title="No schedule available" description="Your class timetable will appear here once enrolled." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="w-16 p-2 text-slate-600 border-b border-white/5" />
                  {DAYS.map((d) => (
                    <th key={d} className="p-2 text-slate-500 font-semibold border-b border-white/5 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour) => (
                  <tr key={hour} className="border-b border-white/5">
                    <td className="p-2 text-slate-600 text-right pr-3 font-mono">{hour}</td>
                    {DAYS.map((day) => {
                      const evt = gridEvents.find((e) => e.schedule?.includes(day) && e.schedule?.includes(hour));
                      return (
                        <td key={day} className="p-1 border-l border-white/5 h-10">
                          {evt && (
                            <div className="h-full bg-indigo-600/20 border border-indigo-500/30 rounded px-1 py-0.5 text-indigo-300 text-[10px] truncate">
                              {evt.label}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enrolled course list as fallback */}
      <div className="card mt-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Enrolled Courses</h3>
        {list.length === 0 ? (
          <p className="text-sm text-slate-500">No courses enrolled.</p>
        ) : (
          <div className="space-y-2">
            {list.map((e) => (
              <div key={e._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{e.courseName || e.courseId}</p>
                  {e.schedule && <p className="text-xs text-slate-500">{e.schedule}</p>}
                </div>
                {e.sectionCode && <span className="text-xs text-slate-600 font-mono">{e.sectionCode}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;
