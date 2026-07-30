import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { Users, ShieldCheck, Building, DollarSign, BarChart3, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Administrative Operations Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.firstName || 'Administrator'}. Governance and platform metrics overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Registered Users</p>
            <p className="text-2xl font-bold text-slate-100">12,450</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Programs</p>
            <p className="text-2xl font-bold text-slate-100">48</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active RBAC Roles</p>
            <p className="text-2xl font-bold text-slate-100">6</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Term Revenue</p>
            <p className="text-2xl font-bold text-slate-100">$4.2M</p>
          </div>
        </div>
      </div>

      {/* Admin Modules Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Users className="w-4 h-4" /> User & Role Management
          </div>
          <p className="text-xs text-slate-400">Create, update, lock/unlock accounts and assign RBAC role permission matrix.</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Manage Users & Roles →
          </button>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <BarChart3 className="w-4 h-4" /> Reports & Analytics
          </div>
          <p className="text-xs text-slate-400">Generate academic performance reports, financial balances, and KPI summaries.</p>
          <button
            onClick={() => navigate('/admin/reports')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Generate Reports →
          </button>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <History className="w-4 h-4 text-amber-400" /> System Audit Trail
          </div>
          <p className="text-xs text-slate-400">Inspect security logs, login attempts, locked accounts, and privilege changes.</p>
          <button
            onClick={() => navigate('/admin/audit')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            Inspect Audit Log →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
