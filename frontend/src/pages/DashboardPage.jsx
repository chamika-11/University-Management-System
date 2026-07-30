import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useStudentDashboard } from '@/features/dashboard/useStudentDashboard';
import { selectUser } from '@/store/authSlice';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatGPA, formatCurrency, formatPercentage } from '@/utils/formatters';
import {
  GraduationCap, CreditCard, BookOpen, Bell, TrendingUp,
  Clock, Award, ChevronRight,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color = 'indigo', to }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };
  const Wrapper = to ? Link : 'div';
  return (
    <Wrapper to={to} className={`card flex items-start gap-4 ${to ? 'hover:border-indigo-500/20 hover:shadow-glow-indigo transition-all duration-200 group' : ''}`}>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-100 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {to && <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 mt-1 transition-colors" />}
    </Wrapper>
  );
};

const DashboardPage = () => {
  const user = useSelector(selectUser);
  const { data, isLoading } = useStudentDashboard();

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'Student';

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <div className="skeleton h-7 w-64 mb-2 rounded" />
          <div className="skeleton h-4 w-40 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const enrollments = data?.enrollments || [];
  const gpa = data?.gpa ?? data?.academicSummary?.gpa;
  const balance = data?.financeBalance ?? data?.finance?.balance;
  const unread = data?.unreadNotifications ?? data?.notifications?.unreadCount ?? 0;
  const attendancePct = data?.attendanceSummary?.percentage ?? data?.attendance?.percentage;

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-indigo-400">{firstName}</span> 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">Here's your academic overview for today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={GraduationCap} label="Current GPA" value={gpa !== undefined ? formatGPA(gpa) : '—'} sub="Cumulative" color="indigo" to="/grades" />
        <StatCard icon={BookOpen}      label="Enrolled Courses" value={enrollments.length} sub="This semester" color="emerald" to="/enrollments" />
        <StatCard icon={CreditCard}    label="Balance" value={balance !== undefined ? formatCurrency(Math.abs(balance)) : '—'} sub={balance < 0 ? 'Amount owed' : 'Cleared'} color={balance < 0 ? 'rose' : 'emerald'} to="/fee-payment" />
        <StatCard icon={Bell}          label="Notifications" value={unread} sub="Unread" color="amber" to="/notifications" />
      </div>

      {/* Attendance & Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Attendance */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-indigo-400" />
            <h3 className="font-semibold text-slate-200 text-sm">Attendance</h3>
          </div>
          {attendancePct !== undefined ? (
            <ProgressBar value={attendancePct} label={`${formatPercentage(attendancePct)} overall`} showValue color={attendancePct >= 75 ? 'emerald' : 'rose'} size="md" />
          ) : (
            <p className="text-sm text-slate-500">No attendance data available.</p>
          )}
          <Link to="/attendance" className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
            View details <ChevronRight size={12} />
          </Link>
        </div>

        {/* Quick Links */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-400" />
            <h3 className="font-semibold text-slate-200 text-sm">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: '/catalog',      label: 'Browse Catalog', icon: BookOpen },
              { to: '/assessments',  label: 'Assignments',    icon: Award },
              { to: '/library',      label: 'Library',        icon: BookOpen },
              { to: '/ai-assistant', label: 'AI Assistant',   icon: TrendingUp },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/20 transition-all duration-150 text-sm text-slate-300 hover:text-slate-100">
                <Icon size={14} className="text-indigo-400 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      {enrollments.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-400" /> My Courses
            </h3>
            <Link to="/enrollments" className="text-xs text-indigo-400 hover:text-indigo-300">View all</Link>
          </div>
          <div className="space-y-2">
            {enrollments.slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <BookOpen size={14} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{e.courseName || e.name}</p>
                  <p className="text-xs text-slate-500 truncate">{e.sectionCode || e.section || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
