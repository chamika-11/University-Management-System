/**
 * Fine-grained permission string constants for ULMS unified app.
 * Client guards check these permission strings for UX display decisions.
 */
export const PERMISSIONS = {
  // Student domain
  STUDENT_DASHBOARD_READ: 'student:dashboard:read',
  COURSES_READ: 'courses:read',
  COURSES_ENROLL: 'courses:enroll',
  ASSESSMENTS_READ: 'assessments:read',
  ASSESSMENTS_SUBMIT: 'assessments:submit',
  GRADES_READ_OWN: 'grades:read:own',
  GRADES_APPEAL: 'grades:appeal',
  TRANSCRIPT_READ: 'transcript:read',
  LIBRARY_SEARCH: 'library:search',
  LIBRARY_BORROW: 'library:borrow',
  FEE_PAYMENT: 'fee:payment',
  TIMETABLE_READ: 'timetable:read',
  FORUM_POST: 'forum:post',
  CERTIFICATES_READ: 'certificates:read',

  // Faculty domain
  FACULTY_DASHBOARD_READ: 'faculty:dashboard:read',
  SECTIONS_MANAGE: 'sections:manage',
  CONTENT_AUTHOR: 'content:author',
  GRADES_WRITE: 'grades:write',
  GRADES_SUBMIT: 'grades:submit',
  ATTENDANCE_MARK: 'attendance:mark',
  FORUM_MODERATE: 'forum:moderate',

  // Admin domain
  ADMIN_DASHBOARD_READ: 'admin:dashboard:read',
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_LOCK: 'users:lock',
  ROLES_MANAGE: 'roles:manage',
  ADMISSIONS_EVALUATE: 'admissions:evaluate',
  CATALOG_MANAGE: 'catalog:manage',
  SEMESTERS_MANAGE: 'semesters:manage',
  FINANCE_OVERSIGHT: 'finance:oversight',
  REPORTS_GENERATE: 'reports:generate',
  AUDIT_READ: 'audit:read',
  NOTIFICATIONS_ADMIN: 'notifications:admin',
  DOCUMENTS_ISSUE: 'documents:issue',
  SEARCH_REINDEX: 'search:reindex',
};
