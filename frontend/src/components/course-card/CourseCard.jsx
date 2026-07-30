import React from 'react';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';

export function CourseCard({ course }) {
  const navigate = useNavigate();

  if (!course) return null;

  return (
    <div className="card space-y-3 hover:border-indigo-500/30 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">{course.code || 'COURSE'}</span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">{course.title || course.name}</h3>
        </div>
        {course.credits && <Badge variant="indigo">{course.credits} Credits</Badge>}
      </div>

      <p className="text-xs text-slate-400 line-clamp-2">{course.description || 'No description available for this course.'}</p>

      <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {course.department || 'Academic'}
        </span>
        <button
          onClick={() => navigate(`/catalog/${course._id || course.id}`)}
          className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
