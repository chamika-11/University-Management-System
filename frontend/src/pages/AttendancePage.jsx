import React from 'react';
import { useMyAttendance } from '@/features/timetable/useTimetable';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatPercentage } from '@/utils/formatters';
import { Clock } from 'lucide-react';

const AttendancePage = () => {
  const { data, isLoading } = useMyAttendance();

  const records = Array.isArray(data) ? data : data?.attendance || data?.records || [];
  const summary = data?.summary || {};
  const overallPct = summary?.percentage ?? (records.length > 0
    ? (records.filter((r) => r.status === 'PRESENT').length / records.length) * 100
    : null);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Overall */}
      {overallPct !== null && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Clock size={15} className="text-indigo-400" /> Overall Attendance
          </h2>
          <ProgressBar
            value={overallPct}
            label={`${formatPercentage(overallPct)} attendance rate`}
            showValue
            color={overallPct >= 75 ? 'emerald' : overallPct >= 50 ? 'amber' : 'rose'}
            size="lg"
          />
          {overallPct < 75 && (
            <p className="text-xs text-rose-400 mt-3">
              ⚠ Attendance below 75%. Please contact your academic advisor.
            </p>
          )}
        </div>
      )}

      {/* Records */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Attendance Records</h2>
        {records.length === 0 ? (
          <EmptyState icon={Clock} title="No attendance records" description="Your attendance will be tracked here." />
        ) : (
          <Table>
            <Thead>
              <tr><Th>Date</Th><Th>Course</Th><Th>Session</Th><Th>Status</Th></tr>
            </Thead>
            <Tbody>
              {records.map((r, i) => (
                <Tr key={r._id || i}>
                  <Td>{formatDate(r.date || r.sessionDate)}</Td>
                  <Td className="font-medium text-slate-200">{r.courseName || r.course?.name || '—'}</Td>
                  <Td className="text-slate-500">{r.sessionType || r.type || '—'}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
