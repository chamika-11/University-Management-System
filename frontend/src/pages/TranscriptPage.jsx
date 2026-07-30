import React from 'react';
import { useMyTranscript } from '@/features/grades/useGrades';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { formatGPA } from '@/utils/formatters';
import { ScrollText, Download, Award } from 'lucide-react';

const TranscriptPage = () => {
  const { data, isLoading } = useMyTranscript();

  if (isLoading) return <PageSpinner />;

  const records = Array.isArray(data) ? data : data?.transcript || data?.records || [];
  const gpa = data?.cumulativeGPA ?? data?.gpa;

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="card mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl"><ScrollText size={22} className="text-indigo-400" /></div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Academic Transcript</h2>
            {gpa !== undefined && (
              <div className="flex items-center gap-2 mt-1">
                <Award size={14} className="text-indigo-400" />
                <span className="text-sm text-slate-400">Cumulative GPA: <strong className="text-slate-200">{formatGPA(gpa)}</strong></span>
              </div>
            )}
          </div>
        </div>
        <Button variant="secondary" size="sm"><Download size={14} /> Export PDF</Button>
      </div>

      {/* Transcript Table */}
      <div className="card">
        {records.length === 0 ? (
          <EmptyState icon={ScrollText} title="No transcript records" description="Completed course grades will appear here." />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Semester</Th><Th>Course</Th><Th>Code</Th><Th>Credits</Th><Th>Grade</Th><Th>GPA Pts</Th>
              </tr>
            </Thead>
            <Tbody>
              {records.map((r, i) => (
                <Tr key={r._id || i}>
                  <Td className="text-slate-500">{r.semester || r.term || '—'}</Td>
                  <Td className="font-medium text-slate-200">{r.courseName || r.course?.name || '—'}</Td>
                  <Td><span className="font-mono text-xs text-slate-400">{r.courseCode || r.course?.code || '—'}</span></Td>
                  <Td>{r.credits || '—'}</Td>
                  <Td>
                    <Badge color={r.letterGrade?.startsWith('A') ? 'emerald' : r.letterGrade?.startsWith('F') ? 'rose' : 'indigo'}>
                      {r.letterGrade || r.grade || '—'}
                    </Badge>
                  </Td>
                  <Td>{r.gradePoints ?? '—'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TranscriptPage;
