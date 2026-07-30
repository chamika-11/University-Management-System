import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyGrades, useMyAppeals, useFileAppeal } from '@/features/grades/useGrades';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Textarea } from '@/components/forms/FormField';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { formatGPA } from '@/utils/formatters';
import { Award, MessageSquarePlus, ScrollText } from 'lucide-react';

const GradesPage = () => {
  const { data, isLoading } = useMyGrades();
  const { data: appealsData } = useMyAppeals();
  const fileAppeal = useFileAppeal();
  const { showToast } = useToast();

  const [appealGrade, setAppealGrade] = useState(null);
  const [appealForm, setAppealForm] = useState({ reason: '', requestedGrade: '' });

  const grades = Array.isArray(data) ? data : data?.grades || [];
  const appeals = Array.isArray(appealsData) ? appealsData : appealsData?.appeals || [];
  const gpa = data?.gpa ?? data?.summary?.gpa;

  const handleAppeal = async (e) => {
    e.preventDefault();
    try {
      await fileAppeal.mutateAsync({ gradeId: appealGrade._id, ...appealForm });
      setAppealGrade(null);
      setAppealForm({ reason: '', requestedGrade: '' });
      showToast({ message: 'Appeal submitted!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* GPA Banner */}
      {gpa !== undefined && (
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl"><Award size={24} className="text-indigo-400" /></div>
          <div>
            <p className="text-xs text-slate-500">Cumulative GPA</p>
            <p className="text-3xl font-bold text-slate-100">{formatGPA(gpa)}</p>
          </div>
          <Link to="/grades/transcript" className="ml-auto">
            <Button variant="secondary" size="sm"><ScrollText size={14} /> View Transcript</Button>
          </Link>
        </div>
      )}

      {/* Grades Table */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Award size={15} className="text-indigo-400" /> Course Grades
        </h2>
        {isLoading ? (
          <Table><Thead><tr><Th>Course</Th><Th>Credits</Th><Th>Grade</Th><Th>Score</Th><Th></Th></tr></Thead>
            <Tbody>{[...Array(5)].map((_, i) => <SkeletonRow key={i} cols={5} />)}</Tbody></Table>
        ) : grades.length === 0 ? (
          <EmptyState icon={Award} title="No grades yet" description="Grades will appear here once published." />
        ) : (
          <Table>
            <Thead><tr><Th>Course</Th><Th>Credits</Th><Th>Letter Grade</Th><Th>Score</Th><Th>Appeal</Th></tr></Thead>
            <Tbody>
              {grades.map((g) => (
                <Tr key={g._id}>
                  <Td className="font-medium text-slate-200">{g.courseName || g.course?.name || '—'}</Td>
                  <Td>{g.credits || '—'}</Td>
                  <Td>
                    <Badge color={g.letterGrade?.startsWith('A') ? 'emerald' : g.letterGrade?.startsWith('F') ? 'rose' : 'indigo'}>
                      {g.letterGrade || g.grade || '—'}
                    </Badge>
                  </Td>
                  <Td>{g.score ?? g.numericGrade ?? '—'}</Td>
                  <Td>
                    <button
                      onClick={() => setAppealGrade(g)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <MessageSquarePlus size={13} /> Appeal
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>

      {/* My Appeals */}
      {appeals.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">My Appeals</h3>
          <Table>
            <Thead><tr><Th>Course</Th><Th>Reason</Th><Th>Status</Th></tr></Thead>
            <Tbody>
              {appeals.map((a) => (
                <Tr key={a._id}>
                  <Td>{a.courseName || '—'}</Td>
                  <Td className="max-w-xs truncate">{a.reason}</Td>
                  <Td><Badge color={a.status === 'APPROVED' ? 'emerald' : a.status === 'REJECTED' ? 'rose' : 'amber'}>{a.status}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Appeal Modal */}
      <Modal isOpen={!!appealGrade} onClose={() => setAppealGrade(null)} title="File Grade Appeal" id="appeal-modal">
        {appealGrade && (
          <form onSubmit={handleAppeal} className="space-y-4">
            <p className="text-sm text-slate-400">
              Appealing grade for: <strong className="text-slate-200">{appealGrade.courseName || '—'}</strong>
              {' — '}Current grade: <Badge color="indigo">{appealGrade.letterGrade || appealGrade.grade}</Badge>
            </p>
            <FormField label="Reason for Appeal" id="appeal-reason" required>
              <Textarea id="appeal-reason" value={appealForm.reason} onChange={(e) => setAppealForm({ ...appealForm, reason: e.target.value })} placeholder="Explain why you are appealing this grade…" required rows={4} />
            </FormField>
            <FormField label="Requested Grade (optional)" id="req-grade">
              <Input id="req-grade" value={appealForm.requestedGrade} onChange={(e) => setAppealForm({ ...appealForm, requestedGrade: e.target.value })} placeholder="e.g. B+" />
            </FormField>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setAppealGrade(null)}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={fileAppeal.isPending}>Submit Appeal</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default GradesPage;
