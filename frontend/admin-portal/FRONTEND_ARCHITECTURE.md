# Admin Portal — Frontend Architecture

> **Ground-truth discovery:** All service names, gateway paths, and role identifiers below were
> derived directly from `api-gateway/src/config/routes.config.js`, `services.registry.js`,
> each service's `src/routes/*.routes.js`, and the BFF aggregator controllers found in
> `api-gateway/src/controllers/`. No information was invented.

---

## 1. Purpose & Primary Users

**Users:** Administrators (`ADMIN`) and Super-Administrators (`SUPER_ADMIN`), i.e. registrar
staff, dean's office, finance officers, and IT admins.

**Core jobs-to-be-done:**

1. **User & role management** — create, update, lock/unlock user accounts; assign RBAC roles
   and permissions.
2. **Admission pipeline oversight** — view all applications, evaluate them, generate and
   confirm admission offers, manage admission cycles.
3. **Academic catalog & semester governance** — create/update colleges, departments, programs,
   courses, semesters, sections, and course syllabi.
4. **Timetable & facility management** — define time-slots, classrooms, build schedules,
   manage holidays, and cancel classes.
5. **Finance administration** — view all invoices and student ledger balances.
6. **Reporting & audit** — generate academic and financial reports, view KPI summaries, and
   inspect the audit trail.
7. **Notification administration** — manage notification templates and manually dispatch
   notifications.
8. **Document & certificate management** — upload files, issue certificates, search the
   platform via the search service, and trigger search re-indexing.

---

## 2. Connected Backend Services

> **All calls go through `/api/v1` on the API Gateway — this app never calls a service
> container/URL directly.** The gateway URL is read from the environment variable
> `VITE_API_GATEWAY_URL`.

| Service | Why this portal needs it | Key gateway paths used (from `routes.config.js`) | Read-only or R/W |
|---|---|---|---|
| **user-service** | User account management, profile management, RBAC administration | `POST /api/v1/auth/register`, `/auth/login`, `/auth/refresh`, `GET /auth/me`; `GET/PATCH/DELETE /api/v1/users/:id`; `POST /users/:id/lock`, `/unlock`; `GET/POST/PATCH/DELETE /users/roles`; `GET/POST /users/profile/faculty`, `/students` | R/W |
| **admission-service** | Admissions pipeline: view applications, evaluate, issue & confirm offers, create cycles | `GET /api/v1/admissions/applications`, `POST /admissions/applications/:id/evaluate`, `/offer`, `/confirm`; `GET/POST /admissions/cycles` | R/W |
| **academic-service** | Catalog: colleges, departments, programs, courses, syllabus; semester/section management; enrolment oversight | `GET/POST/PATCH /api/v1/academics/colleges`, `/departments`, `/programs`, `/courses`, `/semesters`, `/sections`; `GET /academics/courses/:id/syllabus`; `GET /academics/sections/:id/enrollments`; `GET/POST /api/v1/enrollments` | R/W |
| **timetable-service** | Schedule management, classroom/time-slot setup, holidays, class cancellation, attendance record viewing | `GET/POST /api/v1/timetable/timeslots`, `/classrooms`, `/schedules`, `/holidays`; `PATCH /timetable/schedules/:id`; `POST /timetable/schedules/:id/cancel`; `GET /api/v1/attendance/students/:studentId`; `GET /api/v1/calendar/*` | R/W |
| **finance-service** | Invoice and ledger oversight for all students | `GET /api/v1/finance/invoices`, `/invoices/:id`; `GET /finance/ledger/balance/:userId`, `/ledger/account/:accountId` | Read |
| **reporting-service** | Generate and retrieve academic/financial reports, view KPI summaries and audit trail | `POST/GET /api/v1/reports/academic`, `/reports/financial`; `GET /api/v1/audit/audit` (audit trail) | R/W |
| **notification-service** | Manage notification templates, manually send notifications | `GET/POST/PATCH /api/v1/notifications/templates`; `POST /notifications/send` | R/W |
| **document-service** | Upload files, issue and view certificates, manage media | `POST /api/v1/documents/upload`; `POST /documents/certificates/issue`; `GET /documents/certificates/student/:studentId`; `GET/DELETE /documents/files/:id` | R/W |
| **search-service** | Platform-wide search and search index management | `GET /api/v1/search/`; `POST /search/index` | R/W |
| **BFF (gateway)** | Aggregated admin dashboard (profile + admission stats + finance overview + audit alerts + report KPIs in one request) | `GET /api/v1/bff/admin/dashboard` (requires `ADMIN` or `SUPER_ADMIN` role) | Read |

> **Discrepancy noted:** The working hypothesis did not mention `notification-service` for the
> admin portal. However, `notification.routes.js` gates template CRUD and manual send to
> `ADMIN`/`SUPER_ADMIN` — so this portal definitely needs it. See Section 10.

---

## 3. Folder Structure

```
frontend/admin-portal/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.ts
├── tsconfig.json
├── .env                         # VITE_API_GATEWAY_URL, etc.
└── src/
    ├── main.tsx                 # ReactDOM.createRoot; wraps App in Provider + QueryClientProvider
    ├── App.tsx                  # RouterProvider + top-level ErrorBoundary
    │
    ├── app/
    │   ├── store.ts             # RTK configureStore — imports all slice reducers
    │   ├── queryClient.ts       # QueryClient instance (staleTime, retry, error handler)
    │   └── router.tsx           # createBrowserRouter; route definitions from routes/
    │
    ├── api/
    │   ├── axiosInstance.ts     # Single Axios instance; baseURL = VITE_API_GATEWAY_URL;
    │   │                        #   request interceptor attaches Bearer token from memory;
    │   │                        #   response interceptor triggers silent refresh on 401
    │   ├── authClient.ts        # /api/v1/auth/* endpoints
    │   ├── userClient.ts        # /api/v1/users/* and /api/v1/users/roles/*
    │   ├── admissionClient.ts   # /api/v1/admissions/*
    │   ├── academicClient.ts    # /api/v1/academics/* and /api/v1/enrollments/*
    │   ├── timetableClient.ts   # /api/v1/timetable/*, /api/v1/attendance/*, /api/v1/calendar/*
    │   ├── financeClient.ts     # /api/v1/finance/*
    │   ├── reportingClient.ts   # /api/v1/reports/* and /api/v1/audit/*
    │   ├── notificationClient.ts# /api/v1/notifications/*
    │   ├── documentClient.ts    # /api/v1/documents/* and /api/v1/media/*
    │   ├── searchClient.ts      # /api/v1/search/*
    │   └── bffClient.ts         # /api/v1/bff/admin/dashboard
    │
    ├── store/
    │   ├── authSlice.ts         # accessToken (in memory), user { id, role, email, permissions },
    │   │                        #   isAuthenticated, isInitializing
    │   └── uiSlice.ts           # sidebarOpen, activeModal, theme, globalBanner
    │
    ├── features/
    │   │   # Each feature folder owns: React Query hooks, an optional RTK slice
    │   │   # (only for cross-page UI state), and domain-scoped sub-components.
    │   ├── dashboard/           # useAdminDashboard() → GET /bff/admin/dashboard
    │   ├── users/               # useUsers(), useUser(), useUpdateUser(), useLockUser()
    │   ├── roles/               # useRoles(), useCreateRole(), useAssignPermissions()
    │   ├── admissions/          # useApplications(), useEvaluateApplication(), useCreateCycle()
    │   ├── catalog/             # useCourses(), useColleges(), useDepartments(), usePrograms(),
    │   │                        #   useSyllabus(), usePrerequisites()
    │   ├── semesters/           # useSemesters(), useCreateSemester(), useSections()
    │   ├── enrollments/         # useSectionEnrollments() — admin view of who is in a section
    │   ├── timetable/           # useSchedules(), useClassrooms(), useTimeSlots(),
    │   │                        #   useCancelClass(), useHolidays()
    │   ├── attendance-admin/    # useStudentAttendance(), useSessionAttendance()
    │   ├── finance-admin/       # useAllInvoices(), useLedger() — read-only finance oversight
    │   ├── reporting/           # useGenerateAcademicReport(), useGenerateFinancialReport(),
    │   │                        #   useAuditTrail()
    │   ├── notifications-admin/ # useTemplates(), useUpdateTemplate(), useSendNotification()
    │   │                        #   UNIQUE TO ADMIN: template CRUD + manual dispatch
    │   ├── documents/           # useUpload(), useIssueCertificate(), useCertificates()
    │   └── search/              # useSearch(), useReindex() — admin can trigger POST /search/index
    │
    ├── components/
    │   ├── ui/                  # Button, Badge, Modal, Toast, Spinner, Table, Pagination,
    │   │                        #   SkeletonRow, EmptyState
    │   ├── forms/               # FormField, Select, FileUpload, DatePicker
    │   └── charts/              # StatCard, LineChart, BarChart — UNIQUE TO ADMIN for KPI views
    │
    ├── layouts/
    │   ├── AuthLayout.tsx       # Centered card; used for login/forgot-password
    │   └── DashboardLayout.tsx  # Sidebar + topbar + main; reads uiSlice.sidebarOpen
    │
    ├── pages/
    │   │   # Route-level thin compositions of features/* — all lazy-loaded via React.lazy()
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── UsersListPage.tsx
    │   ├── UserDetailPage.tsx
    │   ├── RolesPage.tsx
    │   ├── AdmissionsPage.tsx
    │   ├── ApplicationDetailPage.tsx
    │   ├── CatalogPage.tsx
    │   ├── CourseDetailPage.tsx
    │   ├── SemestersPage.tsx
    │   ├── SectionDetailPage.tsx
    │   ├── TimetablePage.tsx
    │   ├── AttendanceAdminPage.tsx
    │   ├── FinanceAdminPage.tsx
    │   ├── ReportsPage.tsx
    │   ├── AuditPage.tsx
    │   ├── NotificationsAdminPage.tsx
    │   ├── DocumentsPage.tsx
    │   ├── SearchPage.tsx
    │   └── NotFoundPage.tsx
    │
    ├── routes/
    │   ├── index.tsx            # Exports createBrowserRouter config
    │   ├── ProtectedRoute.tsx   # Reads authSlice; redirects to /login if !isAuthenticated
    │   └── RoleGuard.tsx        # Checks role === 'ADMIN' || 'SUPER_ADMIN'; renders ForbiddenPage
    │                            #   otherwise — client-side safety net beyond gateway RBAC
    │
    ├── hooks/
    │   ├── useAuth.ts           # Thin wrapper: reads authSlice, exposes login/logout actions
    │   ├── useToast.ts          # Imperative toast backed by uiSlice.globalBanner
    │   └── useDebounce.ts       # Generic debounce for search inputs
    │
    ├── types/
    │   ├── user.types.ts
    │   ├── admission.types.ts
    │   ├── academic.types.ts
    │   ├── timetable.types.ts
    │   ├── finance.types.ts
    │   ├── reporting.types.ts
    │   ├── notification.types.ts
    │   └── document.types.ts
    │
    ├── utils/
    │   ├── tokenStorage.ts      # In-memory token store (module-level variable);
    │   │                        #   exposes getToken / setToken / clearToken
    │   ├── formatters.ts        # Date, currency, percentage formatters
    │   └── errorParser.ts       # Extracts user-facing message from Axios error responses
    │
    ├── assets/                  # SVG icons, logo, static images
    └── styles/
        └── global.css           # Tailwind base/components/utilities + CSS custom properties
```

**Folder notes unique to this portal:**
- `features/notifications-admin/` — admins alone can CRUD templates and fire notifications.
- `features/reporting/` — admin-only; includes report generation and audit trail browsing.
- `components/charts/` — KPI visualisations needed on the admin dashboard and reporting pages.
- `features/search/` includes `useReindex()` (triggers `POST /api/v1/search/index`), which is
  ADMIN/SUPER_ADMIN-only.
- `features/attendance-admin/` is distinct from timetable because admins view *any* student's
  attendance, not just their own.

---

## 4. State Management Conventions

### Redux Toolkit slices

| Slice | State shape | Lives in RTK because… |
|---|---|---|
| `authSlice` | `{ accessToken: string\|null, user: { id, role, email, permissions[] }, isAuthenticated, isInitializing }` | Auth state is global, needed in every request interceptor and every `ProtectedRoute`/`RoleGuard`. Never server data. |
| `uiSlice` | `{ sidebarOpen: boolean, theme: 'light'\|'dark', activeModal: string\|null, globalBanner: ToastPayload\|null }` | Pure UI state — no backend round-trip needed. |

All other state is **React Query (server state)**.

### React Query keys (per connected service)

```
['bff', 'admin', 'dashboard']                   → GET /api/v1/bff/admin/dashboard
['users', { page, role, search }]               → GET /api/v1/users
['user', userId]                                → GET /api/v1/users/:id
['roles']                                       → GET /api/v1/users/roles
['permissions']                                 → GET /api/v1/users/roles/permissions
['admissions', 'applications', filters]         → GET /api/v1/admissions/applications
['admissions', 'application', id]               → GET /api/v1/admissions/applications/:id
['admissions', 'cycles']                        → GET /api/v1/admissions/cycles
['academics', 'colleges']                       → GET /api/v1/academics/colleges
['academics', 'departments']                    → GET /api/v1/academics/departments
['academics', 'programs']                       → GET /api/v1/academics/programs
['academics', 'courses', filters]               → GET /api/v1/academics/courses
['academics', 'course', id]                     → GET /api/v1/academics/courses/:id
['academics', 'syllabus', courseId]             → GET /api/v1/academics/courses/:id/syllabus
['academics', 'semesters']                      → GET /api/v1/academics/semesters
['academics', 'semester', id]                   → GET /api/v1/academics/semesters/:id
['academics', 'sections', semesterId]           → GET /api/v1/academics/semesters/:id/sections
['academics', 'section', sectionId, 'enrollments'] → GET /api/v1/academics/sections/:id/enrollments
['timetable', 'schedules', semesterId]          → GET /api/v1/timetable/schedules/semester/:id
['timetable', 'classrooms']                     → GET /api/v1/timetable/classrooms
['timetable', 'timeslots']                      → GET /api/v1/timetable/timeslots
['timetable', 'holidays']                       → GET /api/v1/timetable/holidays
['attendance', 'student', studentId]            → GET /api/v1/attendance/students/:studentId
['finance', 'invoices', filters]                → GET /api/v1/finance/invoices
['finance', 'ledger', userId]                   → GET /api/v1/finance/ledger/balance/:userId
['reports', 'academic']                         → GET /api/v1/reports/academic
['reports', 'financial']                        → GET /api/v1/reports/financial
['audit', 'trail']                              → GET /api/v1/audit/audit
['notifications', 'templates']                  → GET /api/v1/notifications/templates
['documents', 'certificates', studentId]        → GET /api/v1/documents/certificates/student/:id
['search', { q, filters }]                      → GET /api/v1/search/
```

### Cache invalidation strategy

| Mutation | Invalidated query keys |
|---|---|
| `useUpdateUser()` | `['user', userId]`, `['users', …]` |
| `useLockUser()` / `useUnlockUser()` | `['user', userId]`, `['users', …]` |
| `useAssignPermissions()` | `['roles']`, `['permissions']` |
| `useEvaluateApplication()` | `['admissions', 'application', id]`, `['admissions', 'applications', …]` |
| `useConfirmAdmission()` | same as above + `['users', …]` |
| `useCreateCycle()` | `['admissions', 'cycles']` |
| `useCreateCourse()` / `useUpdateCourse()` | `['academics', 'courses', …]`, `['academics', 'course', id]` |
| `useUpsertSyllabus()` | `['academics', 'syllabus', courseId]` |
| `useCreateSemester()` | `['academics', 'semesters']` |
| `useCreateSection()` | `['academics', 'sections', semesterId]` |
| `useCreateSchedule()` / `useUpdateSchedule()` | `['timetable', 'schedules', semesterId]` |
| `useCancelClass()` | `['timetable', 'schedules', semesterId]` |
| `useIssueCertificate()` | `['documents', 'certificates', studentId]` |
| `useUpdateTemplate()` / `useCreateTemplate()` | `['notifications', 'templates']` |
| `useReindex()` | no cache to invalidate (fire-and-forget mutation) |

---

## 5. Auth & Route Protection

### JWT strategy: in-memory token + silent refresh

The gateway's `authVerify.middleware.js` extracts the token from `Authorization: Bearer
<token>`. The gateway `.env` sets `JWT_EXPIRES_IN=15m`. There is **no cookie-based auth**
observed in the gateway code; tokens are issued as JSON from `POST /api/v1/auth/login` and
refreshed via `POST /api/v1/auth/refresh`.

**Why in-memory (not localStorage)?**  
Storing the short-lived access token in a JS module-level variable (`tokenStorage.ts`)
prevents XSS exfiltration from `localStorage`. See Open Questions §2 regarding the refresh
token.

**Flow:**
1. `POST /api/v1/auth/login` → receive `{ accessToken, refreshToken }`.
2. Store `accessToken` in `tokenStorage.ts` (module variable); dispatch to `authSlice`.
3. Axios request interceptor reads `getToken()` and attaches `Authorization: Bearer …`.
4. Axios response interceptor: on `401`, call `POST /api/v1/auth/refresh` once, store new
   token, retry the original request. On second `401`, dispatch `logout()`, redirect `/login`.

### Role reading

The role is decoded from the JWT payload at login time and stored in `authSlice.user.role`.
The gateway also forwards `x-user-role` as a request header to downstream services, but the
frontend reads role directly from its own Redux state.

### Route protection

```
/                     → redirect → /dashboard
/login                → public; authenticated users → redirect → /dashboard
/dashboard            → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/users/*              → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/roles                → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/admissions/*         → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN', 'STAFF'])
/catalog/*            → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/timetable/*          → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/finance/*            → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN', 'STAFF'])
/reports/*            → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/notifications/*      → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/documents/*          → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
/search               → ProtectedRoute → RoleGuard(['ADMIN', 'SUPER_ADMIN'])
```

`ProtectedRoute` reads `authSlice.isAuthenticated`. `RoleGuard` checks `authSlice.user.role`
and renders `<Navigate to="/forbidden" />` for non-matching roles. This is a client-side
safety net — the gateway enforces the real RBAC via `requireRole()` middleware.

---

## 6. Real-time / Async Features

### Notification bell

`notification.routes.js` exposes only REST endpoints (no WebSocket/SSE observed). Implement
the unread notification count with React Query polling:

```ts
// features/notifications-admin/useUnreadCount.ts
useQuery(['notifications', 'unread'], fetchUnread, { refetchInterval: 30_000 });
```

### Reporting jobs (async)

`POST /api/v1/reports/academic` and `/financial` trigger generation. The frontend should
treat the mutation as fire-and-forget, then poll `GET /api/v1/reports/academic` at
`refetchInterval: 10_000` until the new report appears with a `completed` status, using
`setQueryData` to update the list optimistically on mutation.

### Live-class scheduling

The gateway proxies `/api/v1/live-classes` to `content-service`. The content-service exposes
`POST /livesessions` (schedule) and `POST /livesessions/:sessionId/end`. These are REST-only;
no admin-facing WebSocket feed is needed. The admin portal only schedules and ends sessions.

---

## 7. Environment Variables

```env
# Required
VITE_API_GATEWAY_URL=http://localhost:8000    # Base URL for all API calls

# Optional / build-time
VITE_APP_TITLE=ULMS Admin Portal
VITE_SENTRY_DSN=                              # Error tracking DSN (blank = disabled locally)
VITE_SENTRY_ENVIRONMENT=development           # 'staging' | 'production'
VITE_LOG_LEVEL=warn                           # 'debug' | 'info' | 'warn' | 'error'
```

No service-specific URLs are needed — everything routes through the gateway.

---

## 8. Non-functional Notes

### Code splitting

Every file under `pages/` is loaded via `React.lazy()` + `<Suspense>`. Shared components and
`app/` bootstrapping stay in the main bundle. Feature code is co-located in `features/` and
tree-shaken per page.

### Error boundaries

- **Root boundary** in `App.tsx` — catches unrecoverable render errors.
- **Per-page boundary** wrapping each lazy page's `<Suspense>` — renders `<PageErrorFallback>`
  with a retry button instead of crashing the shell.

### Loading / skeleton convention

React Query's `isLoading` (first load, no cached data) → show `<SkeletonRow>` or
`<SkeletonCard>`. `isFetching` (background refresh) → show a subtle progress bar at the page
top, not a full-page spinner.

### Accessibility

- All interactive elements must have unique `id` attributes and appropriate `aria-*` labels.
- Tailwind theme configured for WCAG AA contrast (≥ 4.5:1 for normal text).
- Forms use `<label htmlFor>` and explicit `role="alert"` error regions.
- Modals trap focus; closing returns focus to the trigger element.

### Responsive breakpoints

Administration is primarily **desktop-first**.

| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Stack form fields vertically |
| `md` | 768px | Collapse sidebar to icon-only rail |
| `lg` | 1024px | Full sidebar; 2-column layouts |
| `xl` | 1280px | 3-column tables; wider chart areas |

---

## 9. Testing Strategy

### Unit / integration (Vitest + React Testing Library)

- **Store slices** — reducer unit tests for all `authSlice` and `uiSlice` action creators.
- **React Query hooks** — mock `axiosInstance` with `msw`; assert correct query key, loading
  state, and data shape.
- **`ProtectedRoute` / `RoleGuard`** — render with a non-admin token and assert redirect.
- **Feature components** (e.g. `ApplicationDetailPage`) — render with mocked query data and
  assert that evaluate/confirm buttons appear only for `ADMIN` roles.

### End-to-end (Playwright)

Warrants Playwright for:
1. **Full admission workflow** — submit → evaluate → offer → confirm — spanning multiple pages,
   route transitions, and mutations with cache invalidation.
2. **Silent token refresh** — simulate a 401 mid-session and assert the app recovers without
   redirecting to login.
3. **Report generation + polling** — trigger report generation, assert the page eventually
   displays the completed report.

---

## 10. Open Questions / Discrepancies Found

1. **`notification-service` absent from working hypothesis for admin.** The actual
   `notification.routes.js` gates template CRUD and manual send to `ADMIN`/`SUPER_ADMIN`.
   This portal therefore needs `notificationClient.ts` and `features/notifications-admin/`.
   Corrected above.

2. **Refresh token storage.** `auth.routes.js` exposes `POST /auth/refresh` but does not
   show whether the backend sets an `httpOnly` cookie for the refresh token or returns it in
   the response body. Confirm with the backend team before implementing `tokenStorage.ts`.

3. **BFF paths not found in service routes.** `AdminDashboardAggregatorController.js` calls
   `/api/v1/admissions/stats/summary` and `/api/v1/reports/kpis/summary` — neither is listed
   in `admission.routes.js` or `reporting.routes.js`. These may be unimplemented stubs; the
   dashboard BFF will silently return `null` for those keys until they exist.

4. **User profile sub-paths in BFF.** `AdminDashboardAggregatorController.js` calls
   `/api/v1/users/admin/:userId` which does not exist in `user.routes.js` or
   `profile.routes.js`. Flag for backend team.

5. **Dual gateway prefix for reporting-service.** The gateway routes reporting-service under
   both `/api/v1/reports` *and* `/api/v1/audit`. The frontend `reportingClient.ts` must
   cover both prefixes.

6. **Search-service payload schema.** `POST /api/v1/search/index` is admin-only but the
   `search.routes.js` does not show the expected request body. The `features/search/`
   `useReindex()` hook design is provisional until the service schema is documented.
