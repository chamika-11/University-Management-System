import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PermissionGuard from '@/routes/PermissionGuard';
import ForbiddenPage from '@/routes/ForbiddenPage';
import NotFoundPage from '@/routes/NotFoundPage';
import { FullPageSpinner } from '@/components/ui/Spinner';

// Lazy-loaded Authentication & Dashboard
const LoginPage             = lazy(() => import('@/features/auth/LoginPage'));
const DashboardPage         = lazy(() => import('@/features/dashboard/DashboardPage'));

// Lazy-loaded Domain Pages
const ProfilePage           = lazy(() => import('@/pages/ProfilePage'));
const AdmissionStatusPage   = lazy(() => import('@/pages/AdmissionStatusPage'));
const CourseCatalogPage     = lazy(() => import('@/pages/CourseCatalogPage'));
const CourseDetailPage      = lazy(() => import('@/pages/CourseDetailPage'));
const MyEnrollmentsPage     = lazy(() => import('@/pages/MyEnrollmentsPage'));
const ContentPage           = lazy(() => import('@/pages/ContentPage'));
const AssessmentsPage       = lazy(() => import('@/pages/AssessmentsPage'));
const GradesPage            = lazy(() => import('@/pages/GradesPage'));
const TranscriptPage        = lazy(() => import('@/pages/TranscriptPage'));
const ExaminationsPage      = lazy(() => import('@/pages/ExaminationsPage'));
const FeePaymentPage        = lazy(() => import('@/pages/FeePaymentPage'));
const LibraryPage           = lazy(() => import('@/pages/LibraryPage'));
const MyLoansPage           = lazy(() => import('@/pages/MyLoansPage'));
const TimetablePage         = lazy(() => import('@/pages/TimetablePage'));
const AttendancePage        = lazy(() => import('@/pages/AttendancePage'));
const ForumPage             = lazy(() => import('@/pages/ForumPage'));
const ForumPostPage         = lazy(() => import('@/pages/ForumPostPage'));
const NotificationsPage     = lazy(() => import('@/pages/NotificationsPage'));
const AiAssistantPage       = lazy(() => import('@/pages/AiAssistantPage'));
const CertificatesPage      = lazy(() => import('@/pages/CertificatesPage'));
const SearchPage            = lazy(() => import('@/pages/SearchPage'));

// Lazy Wrapper Helper
const LazyComp = (Component) => (
  <Suspense fallback={<FullPageSpinner label="Loading page module..." />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Root Redirect
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Public Route — Login
  { path: '/login', element: LazyComp(LoginPage) },

  // Protected Platform Shell
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Unified Dashboard (Student, Faculty, Admin)
      { path: '/dashboard', element: LazyComp(DashboardPage) },

      // Profile & Personal Settings
      { path: '/profile', element: LazyComp(ProfilePage) },
      { path: '/notifications', element: LazyComp(NotificationsPage) },

      // Student Domain Routes
      { path: '/admission-status',  element: LazyComp(AdmissionStatusPage) },
      { path: '/catalog',           element: LazyComp(CourseCatalogPage) },
      { path: '/catalog/:courseId', element: LazyComp(CourseDetailPage) },
      { path: '/enrollments',       element: LazyComp(MyEnrollmentsPage) },
      { path: '/content/overview',  element: LazyComp(ContentPage) },
      { path: '/content/:courseId', element: LazyComp(ContentPage) },
      { path: '/assessments',       element: LazyComp(AssessmentsPage) },
      { path: '/grades',            element: LazyComp(GradesPage) },
      { path: '/grades/transcript', element: LazyComp(TranscriptPage) },
      { path: '/examinations',      element: LazyComp(ExaminationsPage) },
      { path: '/fee-payment',       element: LazyComp(FeePaymentPage) },
      { path: '/library',           element: LazyComp(LibraryPage) },
      { path: '/library/loans',     element: LazyComp(MyLoansPage) },
      { path: '/timetable',         element: LazyComp(TimetablePage) },
      { path: '/attendance',        element: LazyComp(AttendancePage) },
      { path: '/forum',             element: LazyComp(ForumPage) },
      { path: '/forum/:postId',     element: LazyComp(ForumPostPage) },
      { path: '/ai-assistant',      element: LazyComp(AiAssistantPage) },
      { path: '/certificates',      element: LazyComp(CertificatesPage) },
      { path: '/search',            element: LazyComp(SearchPage) },

      // Admin RBAC Protected Modules
      {
        path: '/admin/users',
        element: (
          <PermissionGuard requirePermission="users:read">
            <div className="card space-y-2">
              <h1 className="page-title">User Account Management</h1>
              <p className="page-subtitle">Admin module for managing user accounts, locking/unlocking, and profile assignment.</p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: '/admin/roles',
        element: (
          <PermissionGuard requirePermission="roles:manage">
            <div className="card space-y-2">
              <h1 className="page-title">RBAC Roles & Permission Matrix</h1>
              <p className="page-subtitle">Configure system roles and permission string assignments.</p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: '/admin/reports',
        element: (
          <PermissionGuard requirePermission="reports:generate">
            <div className="card space-y-2">
              <h1 className="page-title">Academic & Financial Reports</h1>
              <p className="page-subtitle">Generate institution report summaries and KPI exports.</p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: '/admin/audit',
        element: (
          <PermissionGuard requirePermission="audit:read">
            <div className="card space-y-2">
              <h1 className="page-title">Security & System Audit Trail</h1>
              <p className="page-subtitle">Inspect authentication events, security logs, and access history.</p>
            </div>
          </PermissionGuard>
        ),
      },

      // Faculty RBAC Protected Modules
      {
        path: '/faculty/sections',
        element: (
          <PermissionGuard requirePermission="sections:manage">
            <div className="card space-y-2">
              <h1 className="page-title">Assigned Teaching Sections</h1>
              <p className="page-subtitle">View assigned course sections, student rosters, and enrollment details.</p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: '/faculty/gradebook',
        element: (
          <PermissionGuard requirePermission="grades:write">
            <div className="card space-y-2">
              <h1 className="page-title">Section Gradebook & Marking</h1>
              <p className="page-subtitle">Enter assignment grades, score assessments, and submit final marks.</p>
            </div>
          </PermissionGuard>
        ),
      },

      // 403 Forbidden Route
      { path: '/403', element: <ForbiddenPage /> },
    ],
  },

  // 404 Catch-All
  { path: '*', element: <NotFoundPage /> },
]);
