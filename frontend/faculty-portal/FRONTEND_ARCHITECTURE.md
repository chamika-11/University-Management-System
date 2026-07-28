# Faculty Portal — Frontend Architecture

> **Ground-truth discovery:** All service names, gateway paths, and role identifiers below were
> derived directly from `api-gateway/src/config/routes.config.js`, `services.registry.js`,
> each service's `src/routes/*.routes.js`, the BFF aggregator controllers in
> `api-gateway/src/controllers/`, and the AI-RAG service `app/main.py` and router files.
> No information was invented.

---

## 1. Purpose & Primary Users

**Users:** Faculty members (`FACULTY` role as found in `requireRole()` calls across service
routes).

**Core jobs-to-be-done:**

1. **Teaching schedule & attendance** — view their own class schedules, open/close attendance
   sessions, and mark/bulk-mark student attendance.
2. **Course content authoring** — create course modules and lessons, schedule and end live
   sessions for their sections.
3. **Assessment management** — create assignments, view student submissions, and grade them.
4. **Gradebook** — submit grades, view transcript-level data for their students, resolve
   grade appeals.
5. **Examination oversight** — view exam schedules and generate/approve exam tickets.
6. **Forum participation** — create posts, comment, upvote — as a course discussion facilitator.
7. **AI academic assistant** — query the RAG-powered assistant for syllabus-grounded Q&A
   and course content insights.
8. **Notifications** — receive and manage personal notification preferences.

---

## 2. Connected Backend Services

> **All calls go through `/api/v1` on the API Gateway — this app never calls a service
> container/URL directly.** The gateway URL is read from the environment variable
> `VITE_API_GATEWAY_URL`.

| Service | Why this portal needs it | Key gateway paths used (from `routes.config.js`) | Read-only or R/W |
|---|---|---|---|
| **user-service** | Own profile management; looking up student profiles for their sections | `GET/POST /api/v1/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/change-password`; `GET /api/v1/users/profile/me`; `GET /api/v1/users/students/:userId`; `GET /api/v1/users/faculty/:userId` | R/W |
| **academic-service** | View the course catalog and syllabus; access section enrollment lists for their sections | `GET /api/v1/academics/courses`, `/courses/:id`, `/courses/:id/syllabus`; `PUT /academics/courses/:id/syllabus`; `GET /academics/sections`; `GET /academics/sections/:sectionId/enrollments`; `PATCH /academics/sections/:sectionId`; `GET /api/v1/enrollments` | R/W |
| **content-service** | Create and manage course modules, lessons, and live sessions | `POST /api/v1/content/modules`, `GET /content/modules`; `POST /content/lessons`; `GET /content/modules/:moduleId/lessons`; `POST/GET /api/v1/live-classes/livesessions`; `POST /live-classes/livesessions/:sessionId/end`; `GET /live-classes/sections/:sectionId/livesessions` | R/W |
| **assessment-service** | Create assignments, view submissions, grade them inline | `POST /api/v1/assessments/`; `GET /assessments/`; `GET /assessments/:id/submissions`; `POST /assessments/submissions/:submissionId/grade` | R/W |
| **grading-service** | Submit and publish grades, view transcripts for enrolled students, resolve grade appeals | `POST/GET /api/v1/grades/grades`; `POST /grades/grades/publish`; `GET /grades/transcript/:studentId`; `GET/PATCH /grades/appeals`, `/appeals/:id/resolve` | R/W |
| **examination-service** | View exam schedules, generate and approve exam tickets | `GET /api/v1/examinations/schedules`; `POST /examinations/tickets`; `PATCH /examinations/tickets/:id/approve` | R/W |
| **timetable-service** | View their teaching schedule, manage attendance sessions | `GET /api/v1/timetable/schedules/section/:sectionId`; `POST /api/v1/attendance/sessions`; `POST /attendance/sessions/:sessionId/close`; `GET /attendance/sessions/:sessionId`; `GET /attendance/sections/:sectionId/sessions`; `POST /attendance/sessions/:sessionId/mark`; `POST /attendance/sessions/:sessionId/bulk-mark`; `GET /api/v1/calendar/*` | R/W |
| **forum-service** | Course discussion facilitation: create posts, comment, upvote | `POST/GET /api/v1/forums/posts`; `GET /forums/posts/:id`; `POST /forums/posts/:id/comments`; `GET /forums/posts/:id/comments`; `POST /forums/posts/:id/upvote` | R/W |
| **notification-service** | Receive own notifications and manage notification preferences | `GET /api/v1/notifications/`; `GET/PUT /notifications/preferences` | R/W |
| **ai-rag-service** | Syllabus-grounded Q&A assistant for course preparation and student Q&A support | `POST /api/v1/ai/chat/` (FastAPI endpoint; returns `{ response, sources[] }`) | R/W |
| **BFF (gateway)** | Aggregated faculty dashboard (profile + assigned sections + today's schedule + pending grading + unread notifications in one request) | `GET /api/v1/bff/faculty/dashboard` (requires `FACULTY` role) | Read |

> **Discrepancy:** The working hypothesis did not list `examination-service` as explicitly
> faculty-facing, but `examination.routes.js` shows `POST /tickets` and
> `PATCH /tickets/:id/approve` gated to `ADMIN`/`SUPER_ADMIN`. Faculty can only **view**
> schedules (`GET /schedules`) and retrieve their own ticket (`GET /tickets`). The ability to
> **generate** or **approve** tickets is admin-only. See Section 10.

---

## 3. Folder Structure

```
frontend/faculty-portal/
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
    │   ├── userClient.ts        # /api/v1/users/profile/* endpoints for own/student profiles
    │   ├── academicClient.ts    # /api/v1/academics/* (courses, sections, syllabus, enrollments)
    │   ├── contentClient.ts     # /api/v1/content/* and /api/v1/live-classes/*
    │   ├── assessmentClient.ts  # /api/v1/assessments/*
    │   ├── gradingClient.ts     # /api/v1/grades/*
    │   ├── examinationClient.ts # /api/v1/examinations/*
    │   ├── timetableClient.ts   # /api/v1/timetable/* and /api/v1/attendance/*
    │   ├── forumClient.ts       # /api/v1/forums/*
    │   ├── notificationClient.ts# /api/v1/notifications/*
    │   ├── aiRagClient.ts       # /api/v1/ai/chat/ (POST; streaming or single-shot)
    │   └── bffClient.ts         # /api/v1/bff/faculty/dashboard
    │
    ├── store/
    │   ├── authSlice.ts         # accessToken (in memory), user { id, role, email, permissions },
    │   │                        #   isAuthenticated, isInitializing
    │   └── uiSlice.ts           # sidebarOpen, activeModal, theme, globalBanner
    │
    ├── features/
    │   │   # Each feature folder owns: React Query hooks, an optional RTK slice
    │   │   # (only for cross-page UI state), and domain-scoped sub-components.
    │   ├── dashboard/           # useFacultyDashboard() → GET /bff/faculty/dashboard
    │   ├── profile/             # useMyProfile(), useUpdateProfile()
    │   ├── sections/            # useMySections(), useSectionEnrollments() — faculty's own sections
    │   ├── syllabus/            # useSyllabus(), useUpsertSyllabus() — course syllabus editing
    │   ├── content/             # useModules(), useCreateModule(), useLessons(), useCreateLesson()
    │   ├── live-sessions/       # useScheduleSession(), useEndSession(), useSectionSessions()
    │   │                        #   UNIQUE TO FACULTY: live session lifecycle management
    │   ├── gradebook/           # useSubmitGrades(), usePublishGrades(), useStudentTranscript(),
    │   │                        #   useGradeAppeals(), useResolveAppeal()
    │   │                        #   UNIQUE TO FACULTY: the core gradebook workflow
    │   ├── assessments/         # useCreateAssignment(), useAssignments(), useSubmissions(),
    │   │                        #   useGradeSubmission()
    │   ├── attendance/          # useOpenSession(), useCloseSession(), useMarkAttendance(),
    │   │                        #   useBulkMarkAttendance(), useSessionAttendance()
    │   │                        #   UNIQUE TO FACULTY: session open/close/mark (not admin view)
    │   ├── timetable/           # useMySchedule() → GET /timetable/schedules/section/:id
    │   ├── examinations/        # useExamSchedules(), useMyTicket()
    │   ├── forum/               # usePosts(), useCreatePost(), useComments(), useCreateComment(),
    │   │                        #   useUpvote()
    │   ├── notifications/       # useMyNotifications(), useNotificationPreferences()
    │   └── ai-assistant/        # useAiChat() → POST /ai/chat/ — RAG-powered Q&A panel
    │                            #   UNIQUE TO FACULTY: course-preparation assistant
    │
    ├── components/
    │   ├── ui/                  # Button, Badge, Modal, Toast, Spinner, Table, Pagination,
    │   │                        #   SkeletonRow, EmptyState
    │   ├── forms/               # FormField, Select, FileUpload, DatePicker, RichTextEditor
    │   ├── gradebook/           # GradeCell, GradeRow, AppealBadge — UNIQUE: inline grade entry
    │   └── chat/                # ChatBubble, ChatInput, SourceCitation — UNIQUE: AI chat UI
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
    │   ├── MySectionsPage.tsx
    │   ├── SectionDetailPage.tsx
    │   ├── ContentPage.tsx
    │   ├── LiveSessionsPage.tsx
    │   ├── GradebookPage.tsx
    │   ├── AssessmentsPage.tsx
    │   ├── SubmissionsPage.tsx
    │   ├── AttendancePage.tsx
    │   ├── TimetablePage.tsx
    │   ├── ExaminationsPage.tsx
    │   ├── ForumPage.tsx
    │   ├── ForumPostPage.tsx
    │   ├── NotificationsPage.tsx
    │   ├── AiAssistantPage.tsx
    │   └── NotFoundPage.tsx
    │
    ├── routes/
    │   ├── index.tsx            # Exports createBrowserRouter config
    │   ├── ProtectedRoute.tsx   # Reads authSlice; redirects to /login if !isAuthenticated
    │   └── RoleGuard.tsx        # Checks role === 'FACULTY'; renders ForbiddenPage otherwise.
    │                            #   Blocks student or admin tokens even if somehow present.
    │
    ├── hooks/
    │   ├── useAuth.ts           # Thin wrapper over authSlice; exposes login/logout
    │   ├── useToast.ts          # Imperative toast backed by uiSlice.globalBanner
    │   └── useDebounce.ts       # Generic debounce for search/filter inputs
    │
    ├── types/
    │   ├── user.types.ts
    │   ├── academic.types.ts
    │   ├── content.types.ts
    │   ├── assessment.types.ts
    │   ├── grading.types.ts
    │   ├── examination.types.ts
    │   ├── timetable.types.ts
    │   ├── forum.types.ts
    │   ├── notification.types.ts
    │   └── ai.types.ts
    │
    ├── utils/
    │   ├── tokenStorage.ts      # In-memory access token (module-level variable);
    │   │                        #   exposes getToken / setToken / clearToken
    │   ├── formatters.ts        # Date, percentage, grade letter formatters
    │   └── errorParser.ts       # Extracts user-facing message from Axios error responses
    │
    ├── assets/                  # SVG icons, logo, static images
    └── styles/
        └── global.css           # Tailwind base/components/utilities + CSS custom properties
```

**Folder notes unique to this portal:**
- `features/gradebook/` — the primary differentiator; faculty submit and publish grades, view
  student transcripts, and resolve grade appeals. No equivalent exists in admin or student
  portals.
- `features/live-sessions/` — faculty schedule and terminate live sessions; students only
  view the session list.
- `features/ai-assistant/` — backs the `AiAssistantPage` chat UI against
  `POST /api/v1/ai/chat/`.
- `components/gradebook/` — inline grade cells and appeal badges not needed elsewhere.
- `components/chat/` — AI chat UI components (message bubbles, source citation) unique to
  this portal and the student portal.
- `features/attendance/` focuses on **opening, closing, and marking** sessions (not the
  read-only admin view of historical attendance).

---

## 4. State Management Conventions

### Redux Toolkit slices

| Slice | State shape | Lives in RTK because… |
|---|---|---|
| `authSlice` | `{ accessToken: string\|null, user: { id, role, email, permissions[] }, isAuthenticated, isInitializing }` | Global, needed in every Axios interceptor and `ProtectedRoute`/`RoleGuard`. Never server data. |
| `uiSlice` | `{ sidebarOpen: boolean, theme: 'light'\|'dark', activeModal: string\|null, globalBanner: ToastPayload\|null }` | Pure UI state; no backend round-trip needed. |

All other state is **React Query (server state)**.

### React Query keys (per connected service)

```
['bff', 'faculty', 'dashboard']                 → GET /api/v1/bff/faculty/dashboard
['profile', 'me']                               → GET /api/v1/users/profile/me
['sections', 'mine']                            → GET /api/v1/academics/sections (faculty filter)
['sections', sectionId, 'enrollments']          → GET /api/v1/academics/sections/:id/enrollments
['academics', 'course', courseId]               → GET /api/v1/academics/courses/:id
['academics', 'syllabus', courseId]             → GET /api/v1/academics/courses/:id/syllabus
['content', 'modules', courseId]                → GET /api/v1/content/modules
['content', 'lessons', moduleId]               → GET /api/v1/content/modules/:id/lessons
['live-sessions', sectionId]                    → GET /api/v1/live-classes/sections/:id/livesessions
['assessments', { sectionId }]                  → GET /api/v1/assessments/
['assessments', assessmentId, 'submissions']    → GET /api/v1/assessments/:id/submissions
['grades', 'mine']                              → GET /api/v1/grades/grades (faculty own context)
['grades', 'transcript', studentId]             → GET /api/v1/grades/transcript/:studentId
['grades', 'appeals']                           → GET /api/v1/grades/appeals
['examinations', 'schedules']                   → GET /api/v1/examinations/schedules
['examinations', 'ticket']                      → GET /api/v1/examinations/tickets
['timetable', 'schedule', sectionId]            → GET /api/v1/timetable/schedules/section/:id
['attendance', 'sessions', sectionId]           → GET /api/v1/attendance/sections/:id/sessions
['attendance', 'session', sessionId]            → GET /api/v1/attendance/sessions/:sessionId
['forums', 'posts', { sectionId, page }]        → GET /api/v1/forums/posts
['forums', 'post', postId]                      → GET /api/v1/forums/posts/:id
['forums', 'comments', postId]                  → GET /api/v1/forums/posts/:id/comments
['notifications', 'mine', { page }]             → GET /api/v1/notifications/
['notifications', 'preferences']                → GET /api/v1/notifications/preferences
```

### Cache invalidation strategy

| Mutation | Invalidated query keys |
|---|---|
| `useCreateModule()` | `['content', 'modules', courseId]` |
| `useCreateLesson()` | `['content', 'lessons', moduleId]` |
| `useUpsertSyllabus()` | `['academics', 'syllabus', courseId]` |
| `useScheduleSession()` | `['live-sessions', sectionId]` |
| `useEndSession()` | `['live-sessions', sectionId]` |
| `useCreateAssignment()` | `['assessments', { sectionId }]` |
| `useGradeSubmission()` | `['assessments', assessmentId, 'submissions']` |
| `useSubmitGrades()` | `['grades', 'mine']`, `['grades', 'transcript', studentId]` |
| `usePublishGrades()` | `['grades', 'mine']` |
| `useResolveAppeal()` | `['grades', 'appeals']`, `['grades', 'transcript', studentId]` |
| `useOpenSession()` | `['attendance', 'sessions', sectionId]` |
| `useCloseSession()` | `['attendance', 'sessions', sectionId]`, `['attendance', 'session', sessionId]` |
| `useMarkAttendance()` / `useBulkMarkAttendance()` | `['attendance', 'session', sessionId]` |
| `useCreatePost()` | `['forums', 'posts', { sectionId, … }]` |
| `useCreateComment()` | `['forums', 'comments', postId]` |
| `useUpvote()` | `['forums', 'post', postId]` — optimistic update on vote count |
| `useUpdatePreferences()` | `['notifications', 'preferences']` |

---

## 5. Auth & Route Protection

### JWT strategy: in-memory token + silent refresh

Same as admin portal. The gateway sets `JWT_EXPIRES_IN=15m` and the `authVerify` middleware
reads `Authorization: Bearer <token>`. The faculty portal stores the access token in the
module-level `tokenStorage.ts` variable (never in `localStorage`).

**Flow:**
1. `POST /api/v1/auth/login` → receive `{ accessToken, refreshToken }`.
2. Store `accessToken` in `tokenStorage.ts`; dispatch to `authSlice`.
3. Axios request interceptor attaches `Authorization: Bearer …`.
4. On `401`: attempt `POST /api/v1/auth/refresh` once, store new token, retry. On second
   `401`, dispatch `logout()` and redirect to `/login`.

### Role reading

Role is decoded from the JWT payload at login time and stored in `authSlice.user.role`.

### Route protection

```
/                     → redirect → /dashboard
/login                → public; authenticated users → redirect → /dashboard
/dashboard            → ProtectedRoute → RoleGuard(['FACULTY'])
/profile              → ProtectedRoute → RoleGuard(['FACULTY'])
/sections/*           → ProtectedRoute → RoleGuard(['FACULTY'])
/content/*            → ProtectedRoute → RoleGuard(['FACULTY'])
/gradebook/*          → ProtectedRoute → RoleGuard(['FACULTY'])
/assessments/*        → ProtectedRoute → RoleGuard(['FACULTY'])
/attendance/*         → ProtectedRoute → RoleGuard(['FACULTY'])
/timetable            → ProtectedRoute → RoleGuard(['FACULTY'])
/examinations         → ProtectedRoute → RoleGuard(['FACULTY'])
/forum/*              → ProtectedRoute → RoleGuard(['FACULTY'])
/notifications        → ProtectedRoute → RoleGuard(['FACULTY'])
/ai-assistant         → ProtectedRoute → RoleGuard(['FACULTY'])
```

`RoleGuard` explicitly allows only `FACULTY`. A student or admin token that somehow reaches
this portal will be blocked with `<Navigate to="/forbidden" />` before any data is fetched.
The gateway's own `requireRole('FACULTY', ...)` middleware provides the real enforcement.

---

## 6. Real-time / Async Features

### Forum live discussion

`forum.routes.js` exposes only REST endpoints — no WebSocket or SSE is observed in the
service. Implement near-real-time discussion with aggressive React Query polling on the active
post view:

```ts
// features/forum/useComments.ts
useQuery(['forums', 'comments', postId], fetchComments, {
  refetchInterval: 15_000,  // poll every 15s while panel is visible
  refetchIntervalInBackground: false,
});
```

When a comment is created (`useCreateComment` mutation), immediately call
`queryClient.setQueryData` to append the new comment optimistically, then invalidate to
confirm from the server.

### Attendance session state

When a faculty member opens an attendance session (`useOpenSession`), the session object
returned should be stored in local React state (or the `uiSlice` as `activeAttendanceSession`)
so the mark/bulk-mark UI can reference the `sessionId` without re-fetching. Close the session
on `useCloseSession` and clear that state.

### Live-session lifecycle

`POST /api/v1/live-classes/livesessions/:sessionId/end` is a one-shot mutation. No WebSocket
for the live class itself is observable in the content-service routes. The faculty portal
only needs a "Start" / "End" toggle backed by these REST calls, not a video streaming client.

### Notification bell

`GET /api/v1/notifications/` is polled at `refetchInterval: 30_000`. No WebSocket/SSE found
in `notification.routes.js`.

### AI assistant chat

`POST /api/v1/ai/chat/` is a synchronous FastAPI endpoint (placeholder currently returns a
static response). Until streaming is implemented on the backend, model this as a standard
`useMutation` where the pending state shows a typing indicator. When streaming is added,
switch to a `fetch`-based streaming hook and use `queryClient.setQueryData` to append chunks.

---

## 7. Environment Variables

```env
# Required
VITE_API_GATEWAY_URL=http://localhost:8000    # Base URL for all API calls

# Optional / build-time
VITE_APP_TITLE=ULMS Faculty Portal
VITE_SENTRY_DSN=                              # Error tracking DSN (blank = disabled locally)
VITE_SENTRY_ENVIRONMENT=development           # 'staging' | 'production'
VITE_LOG_LEVEL=warn                           # 'debug' | 'info' | 'warn' | 'error'
```

---

## 8. Non-functional Notes

### Code splitting

Every file under `pages/` is loaded with `React.lazy()` + `<Suspense>`. The gradebook and
AI assistant pages are the heaviest (likely pulling in a chart/table library and a chat
component) — keep them as separate chunks.

### Error boundaries

- **Root boundary** in `App.tsx`.
- **Per-page boundary** around each lazy page's `<Suspense>` — renders `<PageErrorFallback>`
  with a retry button.
- **AI assistant boundary** — wraps `AiAssistantPage` separately so a RAG service outage
  does not crash the rest of the shell.

### Loading / skeleton convention

`isLoading` → show skeleton rows/cards. `isFetching` (background refresh) → thin progress
bar at page top. In the gradebook feature, use a skeleton table row that matches the grade
entry row height to reduce layout shift.

### Accessibility

- All interactive elements have unique `id` + appropriate `aria-*` attributes.
- Grade cell inputs in the gradebook have `aria-label="Grade for <studentName>"`.
- The AI chat panel has `role="log"` and `aria-live="polite"` on the message container.
- Color contrast meets WCAG AA (≥ 4.5:1).

### Responsive breakpoints

Faculty workflows span desktop and tablet (e.g. marking attendance on a tablet in class).

| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Stack form fields; single-column pages |
| `md` | 768px | Two-pane layout for section + content tree |
| `lg` | 1024px | Full sidebar; gradebook grid visible without horizontal scroll |
| `xl` | 1280px | Wide gradebook with all columns; AI chat side-panel |

---

## 9. Testing Strategy

### Unit / integration (Vitest + React Testing Library)

- **Store slices** — reducer unit tests for `authSlice` and `uiSlice`.
- **React Query hooks** — mock `axiosInstance` with `msw`; assert correct loading states,
  query keys, and mutation side effects (e.g. `usePublishGrades` invalidates grades cache).
- **`RoleGuard`** — render with a `STUDENT` token and assert redirect to `/forbidden`.
- **Gradebook component** — render with mock grade data and assert that the publish button
  is disabled until all grades are filled in.
- **AI assistant** — mock the `POST /ai/chat/` endpoint and assert that the typing indicator
  appears during pending state and the response renders correctly.

### End-to-end (Playwright)

Warrants Playwright for:
1. **Grade submission → publish workflow** — enter grades for a section, submit, publish,
   and assert the grades become read-only.
2. **Attendance session lifecycle** — open session, mark multiple students, close session,
   assert the session appears as closed in the session list.
3. **Assignment create → student submission → faculty grade** — requires coordinating
   between the faculty portal and the student portal if tested end-to-end.

---

## 10. Open Questions / Discrepancies Found

1. **Examination ticket generation is ADMIN/SUPER_ADMIN-only.** `examination.routes.js`
   shows `POST /examinations/tickets` and `PATCH /examinations/tickets/:id/approve` gated to
   `ADMIN`/`SUPER_ADMIN`, not `FACULTY`. The faculty portal can only view schedules and
   retrieve their own ticket (`GET /tickets`). The working hypothesis listed
   `examination-service` without this distinction. The `features/examinations/` folder should
   not expose generate/approve UI.

2. **AI-RAG service is a Python FastAPI stub.** `chat_router.py` and `ingestion_router.py`
   are placeholders (hardcoded responses). The frontend `aiRagClient.ts` should be designed
   for streaming responses but fall back gracefully to single-shot until the backend LangChain
   integration is complete.

3. **Refresh token storage** — same open question as admin portal (§10.2 there). Decision
   from backend team needed.

4. **BFF paths not confirmed in service routes.** `FacultyDashboardAggregatorController.js`
   calls `/api/v1/enrollments/sections/faculty/:userId` and
   `/api/v1/timetable/faculty/:userId` — neither is listed in `enrollment.routes.js` or
   `timetable.routes.js`. These aggregation paths may be unimplemented. The BFF will return
   `null` for those keys until they exist.

5. **`GET /api/v1/grades/grades` scope.** `grading.routes.js` exposes `GET /grades/grades`
   with no explicit role guard after the `router.use(authenticate)` middleware. It is unclear
   whether this returns the authenticated user's own grades (student context) or a section's
   grades (faculty context). The `useSubmitGrades` hook assumes it is faculty-scoped; confirm
   with the backend team.

6. **Forum scope (course/section vs. global).** `forum.routes.js` shows `GET /forums/posts`
   with no section filter in the route itself. It is unknown whether filtering by section is
   done via query parameter. The `useForumPosts` hook should accept a `sectionId` query param
   and confirm it is supported by the service.
