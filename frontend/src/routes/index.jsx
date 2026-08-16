import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Spinner } from '../components/ui/Spinner';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UsersListPage = lazy(() => import('../pages/UsersListPage'));
const UserDetailPage = lazy(() => import('../pages/UserDetailPage'));
const RolesPage = lazy(() => import('../pages/RolesPage'));
const AdmissionsPage = lazy(() => import('../pages/AdmissionsPage'));
const ApplicationDetailPage = lazy(() => import('../pages/ApplicationDetailPage'));
const CatalogPage = lazy(() => import('../pages/CatalogPage'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const SemestersPage = lazy(() => import('../pages/SemestersPage'));
const SectionDetailPage = lazy(() => import('../pages/SectionDetailPage'));
const TimetablePage = lazy(() => import('../pages/TimetablePage'));
const AttendanceAdminPage = lazy(() => import('../pages/AttendanceAdminPage'));
const FinanceAdminPage = lazy(() => import('../pages/FinanceAdminPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const AuditPage = lazy(() => import('../pages/AuditPage'));
const NotificationsAdminPage = lazy(() => import('../pages/NotificationsAdminPage'));
const DocumentsPage = lazy(() => import('../pages/DocumentsPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const withSuspense = (element) => <Suspense fallback={<div className="py-10"><Spinner /></div>}>{element}</Suspense>;
const protect = (element, roles = ['ADMIN', 'SUPER_ADMIN']) => (
  <ProtectedRoute>
    <RoleGuard allowedRoles={roles}>{element}</RoleGuard>
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  {
    path: '/login',
    element: <AuthLayout>{withSuspense(<LoginPage />)}</AuthLayout>,
  },
  {
    path: '/forbidden',
    element: withSuspense(<ForbiddenPage />),
  },
  {
    element: protect(<DashboardLayout />),
    children: [
      { path: '/dashboard', element: protect(withSuspense(<DashboardPage />)) },
      { path: '/users', element: protect(withSuspense(<UsersListPage />)) },
      { path: '/users/:id', element: protect(withSuspense(<UserDetailPage />)) },
      { path: '/roles', element: protect(withSuspense(<RolesPage />)) },
      { path: '/admissions', element: protect(withSuspense(<AdmissionsPage />), ['ADMIN', 'SUPER_ADMIN', 'STAFF']) },
      { path: '/admissions/:id', element: protect(withSuspense(<ApplicationDetailPage />), ['ADMIN', 'SUPER_ADMIN', 'STAFF']) },
      { path: '/catalog', element: protect(withSuspense(<CatalogPage />)) },
      { path: '/catalog/courses/:id', element: protect(withSuspense(<CourseDetailPage />)) },
      { path: '/semesters', element: protect(withSuspense(<SemestersPage />)) },
      { path: '/semesters/sections/:id', element: protect(withSuspense(<SectionDetailPage />)) },
      { path: '/timetable', element: protect(withSuspense(<TimetablePage />)) },
      { path: '/attendance', element: protect(withSuspense(<AttendanceAdminPage />)) },
      { path: '/finance', element: protect(withSuspense(<FinanceAdminPage />), ['ADMIN', 'SUPER_ADMIN', 'STAFF']) },
      { path: '/reports', element: protect(withSuspense(<ReportsPage />)) },
      { path: '/reports/audit', element: protect(withSuspense(<AuditPage />)) },
      { path: '/notifications', element: protect(withSuspense(<NotificationsAdminPage />)) },
      { path: '/documents', element: protect(withSuspense(<DocumentsPage />)) },
      { path: '/search', element: protect(withSuspense(<SearchPage />)) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);