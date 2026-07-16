# Media Service

## Overview
Encapsulates binary asset uploads to MinIO/S3, manages file schemas, anti-virus checking, and thumbnail calculations.

- **Database:** `media_db`

## Architecture Details

### Models / Collections
- **FileMetadata**
- **UploadSession**

### Controllers
- **UploadController**
- **FileController**

### Services
- **StorageService (S3/MinIO)**
- **FileValidationService**
- **VirusScanService**
- **ThumbnailGenerationService**

## Event-Driven Integration (Kafka)

### Publishes (Outbound Events)
- `FileUploaded`
- `FileDeleted`

### Consumes (Inbound Events)
- None

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
