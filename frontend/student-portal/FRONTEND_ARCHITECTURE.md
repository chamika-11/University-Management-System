# Student Portal — Frontend Architecture

> **Ground-truth discovery:** All service names, gateway paths, and role identifiers below were
> derived directly from `api-gateway/src/config/routes.config.js`, `services.registry.js`,
> each service's `src/routes/*.routes.js`, the BFF aggregator controllers in
> `api-gateway/src/controllers/`, and the AI-RAG service `app/main.py` and router files.
> No information was invented.

---

## 1. Purpose & Primary Users

**Users:** Students (`STUDENT` role, as found in `requireRole('STUDENT')` calls across service
routes).

**Core jobs-to-be-done:**

1. **Admission status tracking** — check the status of their own application and accept an
   offer of admission.
2. **Course enrollment** — browse the catalog, enroll in sections, join/leave waitlists, and
   drop enrollments.
3. **Course content consumption** — access course modules and lessons; view scheduled live
   sessions for their sections.
4. **Assignment submission** — view assigned assessments and submit solutions.
5. **Grades & transcript** — view their own grades, GPA, transcript, and raise a grade appeal.
6. **Examinations** — view their exam schedules and retrieve their own exam ticket.
7. **Finance & fee payment** — view their own invoices, ledger balance, and process payments.
8. **Library** — search the library catalog, check out books, renew and return loans.
9. **Forum participation** — ask questions, comment, and upvote posts in course forums.
10. **AI academic assistant** — query the RAG-powered assistant for course-content-grounded Q&A.

---

## 2. Connected Backend Services

> **All calls go through `/api/v1` on the API Gateway — this app never calls a service
> container/URL directly.** The gateway URL is read from the environment variable
> `VITE_API_GATEWAY_URL`.

| Service | Why this portal needs it | Key gateway paths used (from `routes.config.js`) | Read-only or R/W |
|---|---|---|---|
| **user-service** | Authentication, own profile management | `POST /api/v1/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`, `POST /auth/change-password`; `GET /api/v1/users/profile/me`; `GET/POST /users/addresses`; `GET/POST /users/emergency-contacts` | R/W |
| **admission-service** | Check own application status; accept an offer | `GET /api/v1/admissions/applications/:id` (own app); `POST /admissions/applications/:id/accept` | R/W |
| **academic-service** | Browse course catalog; manage enrollments and waitlists | `GET /api/v1/academics/courses`, `/courses/:id`, `/courses/:id/syllabus`, `/courses/:id/prerequisites`; `GET /academics/departments`, `/programs`, `/semesters/current`; `POST/GET/DELETE /api/v1/enrollments/`; `POST/GET/DELETE /enrollments/waitlist`, `/enrollments/waitlist/:sectionId` | R/W |
| **content-service** | Access course modules, lessons, and live session schedule | `GET /api/v1/content/modules`; `GET /content/modules/:moduleId/lessons`; `GET /api/v1/live-classes/sections/:sectionId/livesessions` | Read |
| **assessment-service** | View assignments and submit solutions | `GET /api/v1/assessments/`; `POST /assessments/:id/submit` | R/W |
| **grading-service** | View own grades, GPA, full transcript; raise a grade appeal | `GET /api/v1/grades/grades`; `GET /grades/transcript`; `POST /grades/appeals`; `GET /grades/appeals` | R/W |
| **examination-service** | View exam schedules; retrieve own exam ticket | `GET /api/v1/examinations/schedules`; `GET /examinations/tickets` | Read |
| **finance-service** | View own invoices, ledger balance, and process payments | `GET /api/v1/finance/invoices/me`; `GET /finance/invoices/:id`; `GET /finance/ledger/balance`; `POST /finance/payments/charge` | R/W |
| **library-service** | Search catalog, check out books, renew and view own loans | `GET /api/v1/library/books`; `GET /library/loans/me`; `POST /library/checkout`; `POST /library/loans/:loanId/renew` | R/W |
| **timetable-service** | View class schedule and own attendance record | `GET /api/v1/timetable/schedules/section/:sectionId`; `GET /api/v1/attendance/me`; `GET /api/v1/calendar/*` | Read |
| **forum-service** | Ask questions, comment, upvote in course discussions | `POST/GET /api/v1/forums/posts`; `GET /forums/posts/:id`; `POST /forums/posts/:id/comments`; `GET /forums/posts/:id/comments`; `POST /forums/posts/:id/upvote` | R/W |
| **notification-service** | Receive own notifications and manage notification preferences | `GET /api/v1/notifications/`; `GET/PUT /notifications/preferences` | R/W |
| **ai-rag-service** | Course-content-grounded Q&A assistant | `POST /api/v1/ai/chat/` (FastAPI endpoint; returns `{ response, sources[] }`) | R/W |
| **document-service** | Download uploaded documents; access own certificates | `GET /api/v1/documents/files/:id`; `GET /documents/certificates` | Read |
| **search-service** | Search courses, content, library resources | `GET /api/v1/search/` | Read |
| **BFF (gateway)** | Aggregated student dashboard (profile + enrollments + GPA + attendance summary + finances + unread notifications in one request) | `GET /api/v1/bff/student/dashboard` (requires `STUDENT` role) | Read |

> **Discrepancies noted:**
> - `admission-service`: the student-facing routes in `admission.routes.js` are technically
>   **public** (no `authenticate` middleware before `POST /applications` and `/accept`). In
>   practice, `POST /applications/:id/accept` is used post-login to accept an offer —
>   confirmed as relevant. See Section 10.
> - `document-service`: the working hypothesis did not list this for the student portal.
>   However, students need `GET /documents/certificates` to view their own certs, and they
>   may download lesson files via `GET /documents/files/:id`. Added.
> - The student cannot **upload** documents (no `POST /documents/upload` gated to `STUDENT`
>   in `document.routes.js`).

---

## 3. Folder Structure

```
frontend/student-portal/
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
    │   ├── queryClient.ts       # QueryClient instance (staleTime, retry, global error handler)
    │   └── router.tsx           # createBrowserRouter; route definitions from routes/
    │
    ├── api/
    │   ├── axiosInstance.ts     # Single Axios instance; baseURL = VITE_API_GATEWAY_URL;
    │   │                        #   request interceptor attaches Bearer token from memory;
    │   │                        #   response interceptor handles silent refresh on 401
    │   ├── authClient.ts        # /api/v1/auth/* endpoints
    │   ├── userClient.ts        # /api/v1/users/profile/* for own profile, addresses, contacts
    │   ├── admissionClient.ts   # /api/v1/admissions/* (student view: own app + accept offer)
    │   ├── academicClient.ts    # /api/v1/academics/* (catalog) and /api/v1/enrollments/*
    │   ├── contentClient.ts     # /api/v1/content/* and /api/v1/live-classes/*
    │   ├── assessmentClient.ts  # /api/v1/assessments/*
    │   ├── gradingClient.ts     # /api/v1/grades/*
    │   ├── examinationClient.ts # /api/v1/examinations/*
    │   ├── financeClient.ts     # /api/v1/finance/*  — UNIQUE: covers fee payment flow
    │   ├── libraryClient.ts     # /api/v1/library/*  — UNIQUE: student-facing library CRUD
    │   ├── timetableClient.ts   # /api/v1/timetable/* and /api/v1/attendance/me
    │   ├── forumClient.ts       # /api/v1/forums/*
    │   ├── notificationClient.ts# /api/v1/notifications/*
    │   ├── aiRagClient.ts       # /api/v1/ai/chat/
    │   ├── documentClient.ts    # /api/v1/documents/files/:id (download), /certificates (own)
    │   ├── searchClient.ts      # /api/v1/search/
    │   └── bffClient.ts         # /api/v1/bff/student/dashboard
    │
    ├── store/
    │   ├── authSlice.ts         # accessToken (in memory), user { id, role, email, permissions },
    │   │                        #   isAuthenticated, isInitializing
    │   └── uiSlice.ts           # sidebarOpen, activeModal, theme, globalBanner
    │
    ├── features/
    │   │   # Each feature folder owns: React Query hooks, an optional RTK slice
    │   │   # (only for cross-page UI state), and domain-scoped sub-components.
    │   ├── dashboard/           # useStudentDashboard() → GET /bff/student/dashboard
    │   ├── profile/             # useMyProfile(), useUpdateProfile(), useAddresses()
    │   ├── admission-status/    # useMyApplication(), useAcceptOffer()
    │   │                        #   UNIQUE: tracks own admission pipeline status
    │   ├── catalog/             # useCourses(), useCourse(), useSyllabus(), usePrerequisites()
    │   ├── enrollment/          # useMyEnrollments(), useEnroll(), useDrop(),
    │   │                        #   useMyWaitlists(), useJoinWaitlist(), useLeaveWaitlist()
    │   │                        #   UNIQUE: the core enrollment workflow with waitlist support
    │   ├── content/             # useMyModules(), useLessons(), useMyLiveSessions()
    │   │                        #   (read-only — student consumes, does not author)
    │   ├── assessments/         # useMyAssessments(), useSubmitAssignment()
    │   ├── grades/              # useMyGrades(), useMyTranscript(), useFileAppeal(),
    │   │                        #   useMyAppeals()
    │   ├── examinations/        # useMyExamSchedules(), useMyTicket()
    │   ├── fee-payment/         # useMyInvoices(), useMyBalance(), useProcessPayment()
    │   │                        #   UNIQUE: fee payment with POST /finance/payments/charge
    │   ├── library/             # useBookSearch(), useMyLoans(), useCheckout(), useRenewLoan()
    │   │                        #   UNIQUE: full library self-service for students
    │   ├── timetable/           # useMySchedule(), useMyAttendance()
    │   ├── forum/               # usePosts(), useCreatePost(), useComments(),
    │   │                        #   useCreateComment(), useUpvote()
    │   ├── notifications/       # useMyNotifications(), useNotificationPreferences()
    │   ├── ai-assistant/        # useAiChat() → POST /api/v1/ai/chat/
    │   ├── documents/           # useDownloadFile(), useMyCertificates()
    │   └── search/              # useSearch() — read-only; no index trigger
    │
    ├── components/
    │   ├── ui/                  # Button, Badge, Modal, Toast, Spinner, Table, Pagination,
    │   │                        #   SkeletonRow, EmptyState, ProgressBar
    │   ├── forms/               # FormField, Select, FileUpload, DatePicker
    │   ├── course-card/         # CourseCard, EnrollButton, WaitlistBadge
    │   │                        #   UNIQUE: enrollment CTA components
    │   ├── chat/                # ChatBubble, ChatInput, SourceCitation — AI chat UI
    │   └── fee-payment/         # InvoiceCard, PaymentModal, BalanceBadge
    │                            #   UNIQUE: financial UI components
    │
    ├── layouts/
    │   ├── AuthLayout.tsx       # Centered card; login/forgot-password
    │   └── DashboardLayout.tsx  # Sidebar + topbar; reads uiSlice.sidebarOpen
    │
    ├── pages/
    │   │   # Route-level thin compositions of features/* — all lazy-loaded via React.lazy()
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── ProfilePage.tsx
    │   ├── AdmissionStatusPage.tsx
    │   ├── CourseCatalogPage.tsx
    │   ├── CourseDetailPage.tsx
    │   ├── MyEnrollmentsPage.tsx
    │   ├── ContentPage.tsx
    │   ├── AssessmentsPage.tsx
    │   ├── GradesPage.tsx
    │   ├── TranscriptPage.tsx
    │   ├── ExaminationsPage.tsx
    │   ├── FeePaymentPage.tsx
    │   ├── LibraryPage.tsx
    │   ├── MyLoansPage.tsx
    │   ├── TimetablePage.tsx
    │   ├── AttendancePage.tsx
    │   ├── ForumPage.tsx
    │   ├── ForumPostPage.tsx
    │   ├── NotificationsPage.tsx
    │   ├── AiAssistantPage.tsx
    │   ├── CertificatesPage.tsx
    │   ├── SearchPage.tsx
    │   └── NotFoundPage.tsx
    │
    ├── routes/
    │   ├── index.tsx            # Exports createBrowserRouter config
    │   ├── ProtectedRoute.tsx   # Reads authSlice; redirects to /login if !isAuthenticated
    │   └── RoleGuard.tsx        # Checks role === 'STUDENT'; renders ForbiddenPage otherwise.
    │                            #   Blocks faculty or admin tokens even if somehow present.
    │
    ├── hooks/
    │   ├── useAuth.ts           # Thin wrapper over authSlice; exposes login/logout
    │   ├── useToast.ts          # Imperative toast backed by uiSlice.globalBanner
    │   └── useDebounce.ts       # Generic debounce for catalog/library search inputs
    │
    ├── types/
    │   ├── user.types.ts
    │   ├── admission.types.ts
    │   ├── academic.types.ts
    │   ├── content.types.ts
    │   ├── assessment.types.ts
    │   ├── grading.types.ts
    │   ├── examination.types.ts
    │   ├── finance.types.ts
    │   ├── library.types.ts
    │   ├── timetable.types.ts
    │   ├── forum.types.ts
    │   ├── notification.types.ts
    │   ├── document.types.ts
    │   └── ai.types.ts
    │
    ├── utils/
    │   ├── tokenStorage.ts      # In-memory access token (module-level variable)
    │   ├── formatters.ts        # Date, currency, GPA, percentage formatters
    │   └── errorParser.ts       # Extracts user-facing message from Axios error responses
    │
    ├── assets/                  # SVG icons, logo, static images
    └── styles/
        └── global.css           # Tailwind base/components/utilities + CSS custom properties
```

**Folder notes unique to this portal:**
- `features/fee-payment/` — student-only; covers invoices, ledger balance, and the
  `POST /finance/payments/charge` mutation. No admin or faculty needs this workflow.
- `features/library/` — student-only; covers book search, checkout, renew, and loan history.
  Admins and faculty do not have self-service library access in this portal.
- `features/admission-status/` — lightweight feature: students track and accept their own
  admission offer. Not needed once a student is enrolled.
- `features/enrollment/` — unique enrollment lifecycle (enroll, drop, waitlist join/leave)
  using the `EnrollmentRequested` event contract in `shared-libs/event-schemas/schemas/`.
- `components/course-card/` — enrollment CTA logic (enroll vs. waitlist, seat count) is
  student-specific.
- `components/fee-payment/` — financial UI (invoice cards, payment modal) not needed
  elsewhere.

---

## 4. State Management Conventions

### Redux Toolkit slices

| Slice | State shape | Lives in RTK because… |
|---|---|---|
| `authSlice` | `{ accessToken: string\|null, user: { id, role, email, permissions[] }, isAuthenticated, isInitializing }` | Global auth state needed in every Axios interceptor and route guard. Never server data. |
| `uiSlice` | `{ sidebarOpen: boolean, theme: 'light'\|'dark', activeModal: string\|null, globalBanner: ToastPayload\|null }` | Pure UI state; no backend round-trip needed. |

All other state is **React Query (server state)**.

### React Query keys (per connected service)

```
['bff', 'student', 'dashboard']                 → GET /api/v1/bff/student/dashboard
['profile', 'me']                               → GET /api/v1/users/profile/me
['profile', 'addresses']                        → GET /api/v1/users/addresses
['profile', 'emergency-contacts']               → GET /api/v1/users/emergency-contacts
['admissions', 'myApplication', applicationId]  → GET /api/v1/admissions/applications/:id
['academics', 'courses', filters]               → GET /api/v1/academics/courses
['academics', 'course', courseId]               → GET /api/v1/academics/courses/:id
['academics', 'syllabus', courseId]             → GET /api/v1/academics/courses/:id/syllabus
['academics', 'prerequisites', courseId]        → GET /api/v1/academics/courses/:id/prerequisites
['academics', 'departments']                    → GET /api/v1/academics/departments
['academics', 'programs']                       → GET /api/v1/academics/programs
['academics', 'currentSemester']                → GET /api/v1/academics/semesters/current
['enrollments', 'mine']                         → GET /api/v1/enrollments/
['enrollments', 'waitlist', 'mine']             → GET /api/v1/enrollments/waitlist
['content', 'modules', courseId]                → GET /api/v1/content/modules
['content', 'lessons', moduleId]               → GET /api/v1/content/modules/:id/lessons
['live-sessions', sectionId]                    → GET /api/v1/live-classes/sections/:id/livesessions
['assessments', 'mine', { sectionId }]          → GET /api/v1/assessments/
['grades', 'mine']                              → GET /api/v1/grades/grades
['grades', 'transcript']                        → GET /api/v1/grades/transcript
['grades', 'appeals', 'mine']                   → GET /api/v1/grades/appeals
['examinations', 'schedules', 'mine']           → GET /api/v1/examinations/schedules
['examinations', 'ticket']                      → GET /api/v1/examinations/tickets
['finance', 'invoices', 'mine']                 → GET /api/v1/finance/invoices/me
['finance', 'invoice', id]                      → GET /api/v1/finance/invoices/:id
['finance', 'balance']                          → GET /api/v1/finance/ledger/balance
['library', 'books', { q, filters }]            → GET /api/v1/library/books
['library', 'loans', 'mine']                    → GET /api/v1/library/loans/me
['timetable', 'schedule', sectionId]            → GET /api/v1/timetable/schedules/section/:id
['attendance', 'mine']                          → GET /api/v1/attendance/me
['forums', 'posts', { sectionId, page }]        → GET /api/v1/forums/posts
['forums', 'post', postId]                      → GET /api/v1/forums/posts/:id
['forums', 'comments', postId]                  → GET /api/v1/forums/posts/:id/comments
['notifications', 'mine', { page }]             → GET /api/v1/notifications/
['notifications', 'preferences']                → GET /api/v1/notifications/preferences
['documents', 'certificates', 'mine']           → GET /api/v1/documents/certificates
['search', { q, filters }]                      → GET /api/v1/search/
```

### Cache invalidation strategy

| Mutation | Invalidated query keys |
|---|---|
| `useEnroll()` | `['enrollments', 'mine']`, `['academics', 'courses', …]` |
| `useDrop()` | `['enrollments', 'mine']` |
| `useJoinWaitlist()` | `['enrollments', 'waitlist', 'mine']` |
| `useLeaveWaitlist()` | `['enrollments', 'waitlist', 'mine']` |
| `useAcceptOffer()` | `['admissions', 'myApplication', applicationId]` |
| `useSubmitAssignment()` | `['assessments', 'mine', { sectionId }]` |
| `useFileAppeal()` | `['grades', 'appeals', 'mine']` |
| `useProcessPayment()` | `['finance', 'invoices', 'mine']`, `['finance', 'balance']`, `['bff', 'student', 'dashboard']` |
| `useCheckout()` | `['library', 'loans', 'mine']`, `['library', 'books', …]` |
| `useRenewLoan()` | `['library', 'loans', 'mine']` |
| `useCreatePost()` | `['forums', 'posts', { sectionId, … }]` |
| `useCreateComment()` | `['forums', 'comments', postId]` — also optimistic update via `setQueryData` |
| `useUpvote()` | Optimistic update on `['forums', 'post', postId]`; invalidate to confirm |
| `useUpdatePreferences()` | `['notifications', 'preferences']` |
| `useAddAddress()` | `['profile', 'addresses']` |
| `useAddEmergencyContact()` | `['profile', 'emergency-contacts']` |

---

## 5. Auth & Route Protection

### JWT strategy: in-memory token + silent refresh

Same mechanism as the other two portals. The gateway's `.env` sets `JWT_EXPIRES_IN=15m`;
`authVerify.middleware.js` reads `Authorization: Bearer <token>`. Students cannot use
`POST /api/v1/auth/register` from the portal (registration is admin-initiated). The student
logs in via `POST /api/v1/auth/login` after their account is provisioned.

**Why in-memory?** XSS risk is highest in student-facing portals because of richer content
(forum posts, course content). Keeping the access token in a module-level variable in
`tokenStorage.ts` prevents script injection from reading `localStorage`.

**Flow:**
1. `POST /api/v1/auth/login` → receive `{ accessToken, refreshToken }`.
2. Store `accessToken` in `tokenStorage.ts`; dispatch to `authSlice`.
3. Axios request interceptor attaches `Authorization: Bearer …`.
4. On `401`: attempt `POST /api/v1/auth/refresh` once, store new token, retry. On second
   `401`, dispatch `logout()`, redirect to `/login`.

### Role reading

Role is decoded from the JWT payload at login time and stored in `authSlice.user.role`. The
student portal expects this to be `STUDENT`.

### Route protection

```
/                     → redirect → /dashboard
/login                → public; authenticated users → redirect → /dashboard
/dashboard            → ProtectedRoute → RoleGuard(['STUDENT'])
/profile              → ProtectedRoute → RoleGuard(['STUDENT'])
/admission-status     → ProtectedRoute → RoleGuard(['STUDENT'])
/catalog/*            → ProtectedRoute → RoleGuard(['STUDENT'])
/enrollments          → ProtectedRoute → RoleGuard(['STUDENT'])
/content/*            → ProtectedRoute → RoleGuard(['STUDENT'])
/assessments/*        → ProtectedRoute → RoleGuard(['STUDENT'])
/grades/*             → ProtectedRoute → RoleGuard(['STUDENT'])
/examinations         → ProtectedRoute → RoleGuard(['STUDENT'])
/fee-payment/*        → ProtectedRoute → RoleGuard(['STUDENT'])
/library/*            → ProtectedRoute → RoleGuard(['STUDENT'])
/timetable            → ProtectedRoute → RoleGuard(['STUDENT'])
/attendance           → ProtectedRoute → RoleGuard(['STUDENT'])
/forum/*              → ProtectedRoute → RoleGuard(['STUDENT'])
/notifications        → ProtectedRoute → RoleGuard(['STUDENT'])
/ai-assistant         → ProtectedRoute → RoleGuard(['STUDENT'])
/certificates         → ProtectedRoute → RoleGuard(['STUDENT'])
/search               → ProtectedRoute → RoleGuard(['STUDENT'])
```

`RoleGuard` allows only `STUDENT`. A faculty or admin token — even if somehow present in this
app — is blocked by the client-side guard before any request is made. The gateway enforces
the real RBAC via `requireRole()` middleware on all non-public routes.

---

## 6. Real-time / Async Features

### Notification bell

`notification.routes.js` exposes only REST; no WebSocket/SSE observed. Poll with React Query:

```ts
// features/notifications/useUnreadCount.ts
useQuery(['notifications', 'unread'], fetchUnread, { refetchInterval: 30_000 });
```

### Forum live discussion

Same as faculty portal: poll the comments list at `refetchInterval: 15_000` while the post
view is active; use `setQueryData` for optimistic comment creation.

```ts
// features/forum/useComments.ts
useQuery(['forums', 'comments', postId], fetchComments, {
  refetchInterval: 15_000,
  refetchIntervalInBackground: false,
});
```

### Fee payment confirmation

`POST /api/v1/finance/payments/charge` may be asynchronous if the payment gateway has a
webhook callback. Until confirmed by the backend, treat the mutation as synchronous
(returns updated invoice). On success, optimistically update `['finance', 'balance']` via
`setQueryData` and then invalidate to confirm from the server.

### AI assistant chat

`POST /api/v1/ai/chat/` is currently a FastAPI stub (returns a placeholder response). Model
as a `useMutation`; show a typing indicator during `isPending`. When streaming is added by
the backend, switch to a `fetch`-based streaming hook.

---

## 7. Environment Variables

```env
# Required
VITE_API_GATEWAY_URL=http://localhost:8000    # Base URL for all API calls

# Optional / build-time
VITE_APP_TITLE=ULMS Student Portal
VITE_SENTRY_DSN=                              # Error tracking DSN (blank = disabled locally)
VITE_SENTRY_ENVIRONMENT=development           # 'staging' | 'production'
VITE_LOG_LEVEL=warn                           # 'debug' | 'info' | 'warn' | 'error'
```

---

## 8. Non-functional Notes

### Code splitting

Every file under `pages/` is loaded via `React.lazy()` + `<Suspense>`. The heaviest chunks
are `FeePaymentPage` (payment modal + invoice table), `AiAssistantPage` (chat component),
and `LibraryPage` (catalog grid). These are deliberately separate lazy chunks.

### Error boundaries

- **Root boundary** in `App.tsx`.
- **Per-page boundary** around each lazy page's `<Suspense>` — renders `<PageErrorFallback>`
  with a retry button.
- **AI assistant boundary** — wraps `AiAssistantPage` separately so a RAG service outage
  does not affect the rest of the portal.
- **Payment boundary** — wraps the `<PaymentModal>` to prevent a payment-flow error from
  unmounting the parent `FeePaymentPage`.

### Loading / skeleton convention

`isLoading` → show skeleton cards/rows matching the layout of the final content.
`isFetching` → thin progress bar at page top only; do not replace content with spinners on
background refreshes. In the course catalog, show `<CourseCardSkeleton>` tiles while the
first load completes.

### Accessibility

- All interactive elements have unique `id` and appropriate `aria-*` attributes.
- The AI chat panel has `role="log"` and `aria-live="polite"` on the message list.
- The payment modal is a `<dialog>` element with `aria-modal="true"` and focus trap.
- Color contrast meets WCAG AA (≥ 4.5:1 for normal text; ≥ 3:1 for large text).
- Forum post content rendered from user input is sanitized before HTML injection.

### Responsive breakpoints

Students use this portal on a wide range of devices including mobile phones.

| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Single-column layout; stacked cards |
| `md` | 768px | 2-column course catalog grid; split forum layout |
| `lg` | 1024px | Full sidebar; 3-column catalog; AI chat side-panel |
| `xl` | 1280px | Expanded table views (grades, loans, invoices) |

The portal must be fully functional at 375px (iPhone SE) — this is a hard requirement for
student mobile access.

---

## 9. Testing Strategy

### Unit / integration (Vitest + React Testing Library)

- **Store slices** — reducer unit tests for `authSlice` and `uiSlice` action creators.
- **`RoleGuard`** — render with a `FACULTY` or `ADMIN` token and assert redirect to
  `/forbidden`.
- **Enrollment flow** (`useEnroll`, `useDrop`, `useJoinWaitlist`) — mock `axiosInstance`
  with `msw`; assert cache invalidations on each mutation.
- **Fee payment** (`useProcessPayment`) — mock the charge endpoint; assert that `['finance',
  'balance']` is invalidated and the UI confirms success without a full page reload.
- **Admission status** — render with a mocked application in `OFFER_SENT` status; assert
  the accept button is visible; fire mutation; assert the button is replaced by a confirmation.

### End-to-end (Playwright)

Warrants Playwright for:
1. **Full enrollment flow** — browse catalog, filter by department, enroll in a section,
   verify it appears in "My Enrollments", then drop it.
2. **Fee payment** — view invoice, click pay, assert payment confirmation and updated balance.
3. **Library checkout + renew** — search for a book, check out, assert loan appears in "My
   Loans", renew it.
4. **Silent token refresh** — simulate a 401 mid-session; assert the student remains on the
   current page without being redirected to login.

---

## 10. Open Questions / Discrepancies Found

1. **Admission application retrieval.** `admission.routes.js` shows `GET
   /api/v1/admissions/applications/:id` requires authentication (via the `router.use(authenticate)`
   block), but `POST /applications` (submit) and `POST /applications/:id/accept` (accept
   offer) are **before** that middleware and therefore public. The student portal should call
   `POST /accept` with the Bearer token attached anyway (for traceability), but the gateway
   proxy will pass it through. Confirm with backend whether `GET /applications/:id` is
   accessible to the applicant (unauthenticated) or only to authenticated users/staff.

2. **`document-service` missing from working hypothesis for student portal.** Students need
   `GET /documents/certificates` (own certificates) and `GET /documents/files/:id`
   (downloading lesson attachments). Added to Section 2. No upload capability exists for
   `STUDENT` role in `document.routes.js`.

3. **Refresh token storage** — same open question as other portals. Confirm whether the
   backend sets an `httpOnly` cookie or returns the refresh token in the response body.

4. **BFF paths not confirmed in service routes.** `StudentDashboardAggregatorController.js`
   calls `/api/v1/grades/student/:userId/gpa` and `/api/v1/attendance/student/:userId/summary`
   — neither is listed in `grading.routes.js` or `timetable.routes.js`. These may be
   unimplemented stubs; the BFF will return `null` for those keys until the routes exist.

5. **`GET /api/v1/assessments/` scope.** `assessment.routes.js` exposes `GET /` with no
   explicit STUDENT role guard. It is unclear whether this returns only the authenticated
   student's assigned assessments or all assessments (faculty-scoped). The
   `useMyAssessments()` hook should accept section or student query params — confirm the
   filtering contract with the backend.

6. **Payment gateway integration.** `finance.routes.js` exposes `POST /finance/payments/charge`
   but the `PaymentController` implementation is not inspected. The student portal's
   `useProcessPayment()` hook design (synchronous vs. polling-based) depends on whether this
   endpoint returns a final result immediately or a payment reference for status polling.
   Confirm with the backend team before implementing the payment modal.

7. **Forum scope.** Same as faculty portal — `GET /forums/posts` does not show a section
   filter in the route definition. Confirm whether `?sectionId=` is supported, otherwise
   students would see all forum posts across all sections.
