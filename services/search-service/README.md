# Search Service

## Overview
Elasticsearch sync engine parsing structural data and posts, exposing semantic/full-text query APIs across entities.

- **Database:** `Elasticsearch indices (no Mongo)`

## Architecture Details

### Models / Collections
- **IndexConfig**

### Controllers
- **SearchController**

### Services
- **IndexingService**
- **QueryService**
- **EventConsumerService**

## Event-Driven Integration (Kafka)

### Publishes (Outbound Events)
- None

### Consumes (Inbound Events)
- `CourseCreated`
- `ContentPublished`
- `ForumPostCreated`

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
