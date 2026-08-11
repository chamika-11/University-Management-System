import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSidebarOpen } from '@/store/uiSlice';
import { usePermission } from '@/access-control/usePermission';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileCheck,
  Award,
  Calendar,
  Clock,
  BookMarked,
  CreditCard,
  MessageSquare,
  Bot,
  FileText,
  Users,
  ShieldCheck,
  UserCheck,
  Building,
  Layers,
  DollarSign,
  BarChart3,
  History,
  Bell,
  Search,
} from 'lucide-react';

export function Sidebar() {
  const sidebarOpen = useSelector(selectSidebarOpen);
  const { activeRole, can } = usePermission();

  // Navigation Items per Role Context
  const getNavItems = () => {
    switch (activeRole) {
      case 'ADMIN':
        return [
          { label: 'Admin Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'User Management', path: '/admin/users', icon: Users, permission: 'users:read' },
          { label: 'Roles & RBAC', path: '/admin/roles', icon: ShieldCheck, permission: 'roles:manage' },
          { label: 'Admissions Pipeline', path: '/admin/admissions', icon: UserCheck, permission: 'admissions:evaluate' },
          { label: 'Academic Catalog', path: '/admin/catalog', icon: Building, permission: 'catalog:manage' },
          { label: 'Semesters & Sections', path: '/admin/semesters', icon: Layers, permission: 'semesters:manage' },
          { label: 'Timetable Governance', path: '/admin/timetable', icon: Calendar },
          { label: 'Financial Oversight', path: '/admin/finance', icon: DollarSign, permission: 'finance:oversight' },
          { label: 'Academic Reports', path: '/admin/reports', icon: BarChart3, permission: 'reports:generate' },
          { label: 'System Audit Log', path: '/admin/audit', icon: History, permission: 'audit:read' },
          { label: 'Notification Templates', path: '/admin/notifications', icon: Bell, permission: 'notifications:admin' },
        ];

      case 'FACULTY':
      case 'STAFF':
        return [
          { label: 'Faculty Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Assigned Sections', path: '/faculty/sections', icon: BookOpen, permission: 'sections:manage' },
          { label: 'Content Authoring', path: '/faculty/content', icon: Layers, permission: 'content:author' },
          { label: 'Gradebook & Marking', path: '/faculty/gradebook', icon: GraduationCap, permission: 'grades:write' },
          { label: 'Attendance Rollcall', path: '/faculty/attendance', icon: Clock, permission: 'attendance:mark' },
          { label: 'My Teaching Schedule', path: '/faculty/timetable', icon: Calendar },
          { label: 'Course Forum', path: '/forum', icon: MessageSquare },
        ];

      case 'STUDENT':
      default:
        return [
          { label: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Course Catalog', path: '/catalog', icon: BookOpen },
          { label: 'My Enrollments', path: '/enrollments', icon: Layers },
          { label: 'Assessments', path: '/assessments', icon: FileCheck },
          { label: 'My Grades', path: '/grades', icon: GraduationCap },
          { label: 'Academic Transcript', path: '/grades/transcript', icon: FileText },
          { label: 'Class Timetable', path: '/timetable', icon: Calendar },
          { label: 'Attendance Record', path: '/attendance', icon: Clock },
          { label: 'Library Catalog', path: '/library', icon: BookMarked },
          { label: 'Fee Invoices', path: '/fee-payment', icon: CreditCard },
          { label: 'Discussion Forum', path: '/forum', icon: MessageSquare },
          { label: 'AI Study Assistant', path: '/ai-assistant', icon: Bot },
          { label: 'My Certificates', path: '/certificates', icon: Award },
        ];
    }
  };

  const navItems = getNavItems().filter((item) => !item.permission || can(item.permission));

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-20 bg-slate-900/95 border-r border-white/5 transition-all duration-200 overflow-y-auto ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
      }`}
    >
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:block">
          {sidebarOpen ? `${activeRole || 'STUDENT'} MENU` : ''}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center lg:px-2' : ''}`
              }
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={`truncate ${!sidebarOpen ? 'hidden lg:hidden' : 'block'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
