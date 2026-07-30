import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { BookOpen, GraduationCap, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function StudentDashboard() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.firstName || 'Student'}. Here is your academic overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Enrolled Courses</p>
            <p className="text-2xl font-bold text-slate-100">5</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Cumulative GPA</p>
            <p className="text-2xl font-bold text-slate-100">3.84</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-slate-100">3</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Overall Attendance</p>
            <p className="text-2xl font-bold text-slate-100">96.2%</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card space-y-3 hover:border-indigo-500/30 transition-colors">
          <h3 className="text-sm font-semibold text-slate-200">Course Catalog</h3>
          <p className="text-xs text-slate-400">Browse available courses, syllabi, and submit new section enrollments.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="card space-y-3 hover:border-indigo-500/30 transition-colors">
          <h3 className="text-sm font-semibold text-slate-200">My Grades & Transcript</h3>
          <p className="text-xs text-slate-400">View term grade breakdowns, GPA calculations, and official transcript.</p>
          <button
            onClick={() => navigate('/grades')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View Grades <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="card space-y-3 hover:border-indigo-500/30 transition-colors">
          <h3 className="text-sm font-semibold text-slate-200">Class Timetable</h3>
          <p className="text-xs text-slate-400">Inspect weekly scheduled lectures, time slots, and classroom locations.</p>
          <button
            onClick={() => navigate('/timetable')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View Timetable <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
