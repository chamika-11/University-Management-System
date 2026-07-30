import React from 'react';
import { Link } from 'react-router-dom';
import { useMyEnrollments, useDrop, useMyWaitlists, useLeaveWaitlist } from '@/features/enrollment/useEnrollment';
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { WaitlistBadge } from '@/components/course-card/WaitlistBadge';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { ClipboardList, Clock } from 'lucide-react';

const MyEnrollmentsPage = () => {
  const { data: enrollments, isLoading } = useMyEnrollments();
  const { data: waitlists, isLoading: wLoading } = useMyWaitlists();
  const drop = useDrop();
  const leaveWaitlist = useLeaveWaitlist();
  const { showToast } = useToast();

  const handleDrop = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to drop this course?')) return;
    try {
      await drop.mutateAsync(enrollmentId);
      showToast({ message: 'Course dropped.', type: 'success' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  const handleLeave = async (sectionId) => {
    try {
      await leaveWaitlist.mutateAsync(sectionId);
      showToast({ message: 'Left waitlist.', type: 'info' });
    } catch (err) {
      showToast({ message: parseError(err), type: 'error' });
    }
  };

  const list = Array.isArray(enrollments) ? enrollments : enrollments?.enrollments || [];
  const waitList = Array.isArray(waitlists) ? waitlists : waitlists?.waitlists || [];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Enrolled */}
      <div className="card">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5">
          <ClipboardList size={16} className="text-indigo-400" /> Enrolled Courses
        </h2>
        {isLoading ? (
          <Table><Thead><tr><Th>Course</Th><Th>Section</Th><Th>Credits</Th><Th>Status</Th><Th></Th></tr></Thead>
            <Tbody>{[...Array(4)].map((_, i) => <SkeletonRow key={i} cols={5} />)}</Tbody></Table>
        ) : list.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No enrollments yet" description="Browse the catalog to enroll in courses."
            action={<Link to="/catalog"><Button size="sm">Browse Catalog</Button></Link>} />
        ) : (
          <Table>
            <Thead><tr>
              <Th>Course</Th><Th>Section</Th><Th>Credits</Th><Th>Status</Th><Th>Action</Th>
            </tr></Thead>
            <Tbody>
              {list.map((e) => (
                <Tr key={e._id}>
                  <Td><Link to={`/catalog/${e.courseId}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                    {e.courseName || e.course?.name || e.courseId}
                  </Link></Td>
                  <Td><Badge color="slate">{e.sectionCode || e.section?.code || '—'}</Badge></Td>
                  <Td>{e.credits || '—'}</Td>
                  <Td><StatusBadge status={e.status || 'ACTIVE'} /></Td>
                  <Td>
                    <Button size="xs" variant="danger" loading={drop.isPending} onClick={() => handleDrop(e._id)}>
                      Drop
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>

      {/* Waitlisted */}
      {(wLoading || waitList.length > 0) && (
        <div className="card">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-5">
            <Clock size={16} className="text-amber-400" /> Waitlisted Courses
          </h2>
          {wLoading ? (
            <Table><Thead><tr><Th>Course</Th><Th>Position</Th><Th></Th></tr></Thead>
              <Tbody>{[...Array(2)].map((_, i) => <SkeletonRow key={i} cols={3} />)}</Tbody></Table>
          ) : (
            <Table>
              <Thead><tr><Th>Course</Th><Th>Section</Th><Th>Position</Th><Th>Action</Th></tr></Thead>
              <Tbody>
                {waitList.map((w) => (
                  <Tr key={w._id}>
                    <Td>{w.courseName || w.course?.name || '—'}</Td>
                    <Td><Badge color="slate">{w.sectionCode || '—'}</Badge></Td>
                    <Td><WaitlistBadge position={w.position || '?'} /></Td>
                    <Td>
                      <Button size="xs" variant="ghost" loading={leaveWaitlist.isPending} onClick={() => handleLeave(w.sectionId)}>
                        Leave
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;
