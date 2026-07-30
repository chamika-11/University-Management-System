import React, { useState } from 'react';
import { useMyEnrollments } from '@/features/enrollment/useEnrollment';
import { useModules, useLessons, useLiveSessions } from '@/features/content/useContent';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/utils/formatters';
import { ChevronDown, PlayCircle, FileText, Video, Layers, Calendar } from 'lucide-react';

const LessonList = ({ moduleId }) => {
  const { data: lessons, isLoading } = useLessons(moduleId);
  if (isLoading) return <div className="py-2 px-4 text-xs text-slate-500 animate-pulse">Loading lessons…</div>;
  if (!lessons?.length) return <div className="py-2 px-4 text-xs text-slate-500">No lessons yet.</div>;
  return (
    <ul className="divide-y divide-white/5">
      {(Array.isArray(lessons) ? lessons : lessons?.lessons || []).map((lesson) => (
        <li key={lesson._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
          <FileText size={14} className="text-slate-600 shrink-0" />
          <span className="text-sm text-slate-300 flex-1">{lesson.title}</span>
          {lesson.type && <Badge color="slate">{lesson.type}</Badge>}
          {lesson.duration && <span className="text-xs text-slate-500">{lesson.duration}</span>}
        </li>
      ))}
    </ul>
  );
};

const ModuleAccordion = ({ module }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <Layers size={16} className="text-indigo-400 shrink-0" />
        <span className="text-sm font-semibold text-slate-200 flex-1 text-left">{module.title || module.name}</span>
        {module.lessonsCount && <span className="text-xs text-slate-500">{module.lessonsCount} lessons</span>}
        <ChevronDown size={15} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="animate-fade-in"><LessonList moduleId={module._id} /></div>}
    </div>
  );
};

const ContentPage = () => {
  const { data: enrollments, isLoading: eLoading } = useMyEnrollments();
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const list = Array.isArray(enrollments) ? enrollments : enrollments?.enrollments || [];
  const active = selectedEnrollment || list[0];
  const courseId = active?.courseId;
  const sectionId = active?.sectionId;

  const { data: modules, isLoading: mLoading } = useModules(courseId);
  const { data: liveSessions } = useLiveSessions(sectionId);

  if (eLoading) return <PageSpinner />;
  if (list.length === 0) return (
    <EmptyState icon={Layers} title="No enrolled courses" description="Enroll in courses to access content." />
  );

  const moduleList = Array.isArray(modules) ? modules : modules?.modules || [];
  const sessions = Array.isArray(liveSessions) ? liveSessions : liveSessions?.sessions || [];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Course selector */}
      <div className="card">
        <p className="text-xs text-slate-500 mb-2">Select Course</p>
        <div className="flex flex-wrap gap-2">
          {list.map((e) => (
            <button
              key={e._id}
              onClick={() => setSelectedEnrollment(e)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-150 ${
                (selectedEnrollment?._id === e._id || (!selectedEnrollment && e === list[0]))
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                  : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              {e.courseName || e.course?.name || e.courseId}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Modules */}
        <div className="lg:col-span-2 space-y-2">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Layers size={15} className="text-indigo-400" /> Modules
          </h3>
          {mLoading ? (
            <div className="card animate-pulse h-32" />
          ) : moduleList.length === 0 ? (
            <EmptyState icon={Layers} title="No modules available" description="Content will appear here when published." />
          ) : (
            moduleList.map((m) => <ModuleAccordion key={m._id} module={m} />)
          )}
        </div>

        {/* Live Sessions */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
            <Video size={15} className="text-indigo-400" /> Live Sessions
          </h3>
          <div className="card space-y-3">
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming live sessions.</p>
            ) : (
              sessions.map((s) => (
                <div key={s._id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0"><Calendar size={14} className="text-indigo-400" /></div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.title}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(s.scheduledAt || s.startTime)}</p>
                    {s.meetingUrl && (
                      <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">Join →</a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
