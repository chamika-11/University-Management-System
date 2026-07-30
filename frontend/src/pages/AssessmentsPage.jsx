import React, { useState } from 'react';
import { useMyAssessments, useSubmitAssignment } from '@/features/assessments/useAssessments';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import { FileUpload } from '@/components/forms/FileUpload';
import { FormField, Textarea } from '@/components/forms/FormField';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { formatDate } from '@/utils/formatters';
import { ClipboardCheck, Upload } from 'lucide-react';

const AssessmentsPage = () => {
  const { data, isLoading } = useMyAssessments();
  const submitAssignment = useSubmitAssignment();
  const { showToast } = useToast();

  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');

  const assessments = Array.isArray(data) ? data : data?.assessments || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { showToast({ message: 'Please attach a file.', type: 'warning' }); return; }
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (notes) fd.append('notes', notes);
      await submitAssignment.mutateAsync({ id: selected._id, formData: fd });
      setSelected(null);
      setFile(null);
      setNotes('');
      showToast({ message: 'Assignment submitted!', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="card">
        {isLoading ? (
          <Table>
            <Thead><tr><Th>Title</Th><Th>Course</Th><Th>Due</Th><Th>Status</Th><Th></Th></tr></Thead>
            <Tbody>{[...Array(5)].map((_, i) => <SkeletonRow key={i} cols={5} />)}</Tbody>
          </Table>
        ) : assessments.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No assignments yet" description="Assigned tasks will appear here." />
        ) : (
          <Table>
            <Thead><tr><Th>Assignment</Th><Th>Course</Th><Th>Due Date</Th><Th>Status</Th><Th>Action</Th></tr></Thead>
            <Tbody>
              {assessments.map((a) => (
                <Tr key={a._id}>
                  <Td className="font-medium text-slate-200">{a.title}</Td>
                  <Td className="text-slate-500">{a.courseName || a.course?.name || '—'}</Td>
                  <Td className={a.dueDate && new Date(a.dueDate) < new Date() ? 'text-rose-400' : ''}>
                    {formatDate(a.dueDate)}
                  </Td>
                  <Td><StatusBadge status={a.status || 'PENDING'} /></Td>
                  <Td>
                    {a.status !== 'SUBMITTED' && a.status !== 'GRADED' ? (
                      <Button size="xs" onClick={() => setSelected(a)}>
                        <Upload size={12} /> Submit
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-500">Submitted</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>

      {/* Submit Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Submit Assignment" id="submit-modal">
        {selected && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-400">
              Submitting: <strong className="text-slate-200">{selected.title}</strong>
              {selected.dueDate && ` — Due ${formatDate(selected.dueDate)}`}
            </p>
            {selected.description && (
              <p className="text-xs text-slate-500 bg-slate-800/60 rounded-lg px-3 py-2">{selected.description}</p>
            )}
            <FormField label="Attach File" id="submit-file" required>
              <FileUpload
                id="submit-file"
                onChange={setFile}
                accept=".pdf,.doc,.docx,.zip,.py,.js,.txt"
                maxSizeMB={20}
                label="Click to attach your submission"
              />
            </FormField>
            <FormField label="Notes (optional)" id="submit-notes">
              <Textarea id="submit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes for your instructor…" rows={3} />
            </FormField>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setSelected(null)}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1" loading={submitAssignment.isPending}>Submit</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AssessmentsPage;
