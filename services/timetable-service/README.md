# Timetable, Calendar & Attendance Service

## Overview
Consolidated service managing optimal class timings, room booking allocations, faculty availability constraints, academic calendars, holidays, institutional milestones, personal events, ICS exports, student attendance records for physical classes and live sessions, leave requests, and low-attendance indicators.

- **Database:** `timetable_db` (handles schedules, calendars, and attendance logs)

## Architecture Details

### Models / Collections
- **Timetable**
- **ClassSlot**
- **RoomAllocation**
- **FacultySchedule**
- **AcademicEvent**
- **Holiday**
- **PersonalEvent**
- **EventReminder**
- **AttendanceRecord**
- **AttendanceSession**
- **LeaveRequest**
- **AttendancePolicy**

### Controllers
- **TimetableController**
- **RoomAllocationController**
- **EventController**
- **HolidayController**
- **AttendanceController**
- **LeaveController**

### Services
- **TimetableGenerationService**
- **ConflictResolutionService**
- **RoomBookingService**
- **CalendarService**
- **ReminderSchedulingService**
- **IcsExportService**
- **AttendanceMarkingService**
- **AttendanceReportService**
- **LeaveApprovalService**
- **LowAttendanceAlertService**

## Event-Driven Integration (Kafka)

### Publishes (Outbound Events)
- `TimetablePublished`
- `EventCreated`
- `LowAttendanceAlert`

### Consumes (Inbound Events)
- `CourseCreated`
- `FacultyProfileCreated`
- `ExamScheduled`
- `LiveSessionEnded (auto-mark)`
- `EnrollmentConfirmed`

## Implementation Details & Code Structure
This microservice follows the standard Node.js/Express template structure:
- `src/config/`: Configuration for DB connections, environment vars, Redis client, Kafka producer/consumer.
- `src/models/`: Mongoose schemas defining structural entities.
- `src/controllers/`: Express controllers handling routing actions.
- `src/services/`: Pure business logic abstraction.
- `src/routes/`: Router paths mapping HTTP actions to controllers.
- `src/middlewares/`: RBAC validation, input sanitizers, and routing guards.
- `src/validators/`: Zod/Joi payloads validators.
- `src/events/`: Kafka message publishers and stream subscriptions.
- `src/repositories/`: Optional data abstraction layer separating mongoose queries.

## Development Tasks & Roadmap
- [ ] Initialize Node service boilerplate
- [ ] Establish MongoDB connection pool and health check
- [ ] Design Mongoose schemas with indexing
- [ ] Implement service logic and routes
- [ ] Wire up Kafka producers for domain events
- [ ] Implement consumers and handlers for consumed events
- [ ] Add unit and integration tests under `tests/`
