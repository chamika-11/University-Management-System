import React from 'react';
import { useMyExamSchedules, useMyTicket } from '@/features/examinations/useExaminations';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { FileText, Ticket, Download, MapPin } from 'lucide-react';

const ExaminationsPage = () => {
  const { data, isLoading } = useMyExamSchedules();
  const { data: ticket, isLoading: tLoading } = useMyTicket();

  const schedules = Array.isArray(data) ? data : data?.schedules || [];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Exam Ticket */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Ticket size={15} className="text-indigo-400" /> My Exam Ticket
        </h2>
        {tLoading ? (
          <div className="skeleton h-16 rounded-lg" />
        ) : ticket ? (
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-800/60 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-slate-500 mb-1">Ticket Number</p>
              <p className="font-mono text-lg font-bold text-indigo-400">{ticket.ticketNumber || ticket._id}</p>
              {ticket.studentName && <p className="text-sm text-slate-300 mt-1">{ticket.studentName}</p>}
            </div>
            <Button variant="secondary" size="sm"><Download size={14} /> Download</Button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No exam ticket available yet.</p>
        )}
      </div>

      {/* Exam Schedule */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <FileText size={15} className="text-indigo-400" /> Exam Schedule
        </h2>
        {isLoading ? (
          <PageSpinner />
        ) : schedules.length === 0 ? (
          <EmptyState icon={FileText} title="No exams scheduled" description="Exam schedules will appear here when published." />
        ) : (
          <Table>
            <Thead>
              <tr><Th>Course</Th><Th>Date & Time</Th><Th>Venue</Th><Th>Duration</Th><Th>Type</Th></tr>
            </Thead>
            <Tbody>
              {schedules.map((s) => (
                <Tr key={s._id}>
                  <Td className="font-medium text-slate-200">{s.courseName || s.course?.name || '—'}</Td>
                  <Td>{formatDateTime(s.scheduledAt || s.examDate || s.startTime)}</Td>
                  <Td>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={12} className="text-slate-600" />
                      {s.venue || s.hall || s.room || '—'}
                    </span>
                  </Td>
                  <Td>{s.duration ? `${s.duration} min` : '—'}</Td>
                  <Td><Badge color="indigo">{s.type || s.examType || 'Written'}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ExaminationsPage;
