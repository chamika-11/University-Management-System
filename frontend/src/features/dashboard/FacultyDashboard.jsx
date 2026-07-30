import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { BookOpen, Users, CheckSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FacultyDashboard() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Faculty Portal Dashboard</h1>
        <p className="page-subtitle">Welcome back, Professor {user?.lastName || user?.firstName || 'Faculty'}. Manage your assigned sections and gradebooks.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Assigned Sections</p>
            <p className="text-2xl font-bold text-slate-100">4</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Students</p>
            <p className="text-2xl font-bold text-slate-100">142</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Grade Submissions</p>
            <p className="text-2xl font-bold text-slate-100">2</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Office Hours Today</p>
            <p className="text-2xl font-bold text-slate-100">2 hrs</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-slate-100 mb-3">Faculty Quick Actions</h3>
        <p className="text-xs text-slate-400 mb-4">Select a section to enter grades, manage attendance roll call, or publish lesson content.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/faculty/sections')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Manage Teaching Sections
          </button>
          <button
            onClick={() => navigate('/faculty/gradebook')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-lg text-xs font-medium transition-colors"
          >
            Open Section Gradebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
