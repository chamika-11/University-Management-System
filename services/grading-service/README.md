# Grading Service

## Overview
Tracks student marks/grades, manages grading scales, computes GPA/CGPA, produces official transcripts, and handles grade appeals.

- **Database:** `grading_db`

## Architecture Details

### Models / Collections
- **Grade**
- **GradeScale**
- **Transcript**
- **GpaRecord**
- **ResultPublication**
- **GradeAppeal**

### Controllers
- **GradeController**
- **TranscriptController**
- **ResultController**
- **GradeAppealController**

### Services
- **GradeCalculationService**
- **GpaComputationService**
- **TranscriptGenerationService**
- **ResultPublicationService**
- **GradeAppealService**

## Event-Driven Integration (Kafka)

### Publishes (Outbound Events)
- `GradePublished`
- `DegreeCompletionDetected`

### Consumes (Inbound Events)
- `AssignmentGraded`
- `QuizSubmitted`
- `ExamResultEntered`

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
