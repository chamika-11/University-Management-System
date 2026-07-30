import React from 'react';
import { usePermission } from '@/access-control/usePermission';
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';
import AdminDashboard from './AdminDashboard';

export function DashboardPage() {
  const { activeRole } = usePermission();

  switch ((activeRole || '').toUpperCase()) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return <AdminDashboard />;

    case 'FACULTY':
    case 'STAFF':
      return <FacultyDashboard />;

    case 'STUDENT':
    default:
      return <StudentDashboard />;
  }
}

export default DashboardPage;
