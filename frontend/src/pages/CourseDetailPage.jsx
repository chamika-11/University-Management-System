import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourse, useSyllabus, usePrerequisites } from '@/features/catalog/useCatalog';
import { EnrollButton } from '@/components/course-card/EnrollButton';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { ChevronDown, BookOpen, AlertCircle, Clock, Users, ArrowLeft } from 'lucide-react';

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-200 hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        {title}
        <ChevronDown size={16} className={`transition-transform text-slate-500 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-slate-400 space-y-2 animate-fade-in">{children}</div>}
    </div>
  );
};

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: syllabus } = useSyllabus(courseId);
  const { data: prerequisites } = usePrerequisites(courseId);

  if (isLoading) return <PageSpinner />;
  if (!course) return <div className="card"><p className="text-sm text-slate-400">Course not found.</p></div>;

  return (
    <div className="animate-fade-in max-w-3xl">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Catalog
      </Link>

      {/* Header */}
      <div className="card mb-4">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <Badge color="indigo">{course.code}</Badge>
          {course.credits && <Badge color="slate">{course.credits} credits</Badge>}
          {course.department && <Badge color="slate">{course.department}</Badge>}
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">{course.name}</h2>
        {course.description && <p className="text-sm text-slate-400 mb-4">{course.description}</p>}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 mb-5">
          {course.instructor && (
            <span className="flex items-center gap-1.5"><Users size={13} />{course.instructor}</span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1.5"><Clock size={13} />{course.duration}</span>
          )}
        </div>
        {/* Enroll for first available section */}
        {course.sections?.[0] && (
          <EnrollButton course={course} section={course.sections[0]} />
        )}
      </div>

      {/* Sections */}
      {course.sections?.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Available Sections</h3>
          <div className="space-y-3">
            {course.sections.map((s) => {
              const seats = s.capacity - (s.enrolled || 0);
              return (
                <div key={s._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.sectionCode || s.code}</p>
                    {s.schedule && <p className="text-xs text-slate-500">{s.schedule}</p>}
                    {s.instructor && <p className="text-xs text-slate-500">{s.instructor}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${seats > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {seats > 0 ? `${seats} seats` : 'Full'}
                    </span>
                    <EnrollButton course={course} section={s} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accordion sections */}
      <div className="space-y-2">
        {syllabus && (
          <Accordion title="Syllabus">
            {Array.isArray(syllabus) ? syllabus.map((item, i) => (
              <div key={i} className="flex gap-2"><span className="text-indigo-400">{i + 1}.</span>{item.title || item}</div>
            )) : <p>{JSON.stringify(syllabus)}</p>}
          </Accordion>
        )}
        {prerequisites && (
          <Accordion title="Prerequisites">
            {Array.isArray(prerequisites) && prerequisites.length > 0 ? (
              prerequisites.map((p, i) => (
                <div key={i} className="flex items-center gap-2"><AlertCircle size={13} className="text-amber-400" />{p.name || p.code || p}</div>
              ))
            ) : (
              <p className="text-slate-500">No prerequisites for this course.</p>
            )}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
