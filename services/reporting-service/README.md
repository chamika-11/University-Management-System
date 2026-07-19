# Reporting & Audit Service

## Overview
Consolidated service that consumes platform event history to build aggregated read-model dashboards, KPI charts, and scheduled document exports. It also maintains a central audit record collection to build a compliance trail, tracking user requests, modifications, and security anomalies.

- **Database:** `reporting_db` (handles reports configurations, snapshots, KPI metrics, and audit/security logs)

## Architecture Details

### Models / Collections
- **ReportDefinition**
- **ReportSnapshot**
- **DashboardConfig**
- **KpiMetric**
- **AuditLog**
- **SecurityEvent**

### Controllers
- **ReportController**
- **DashboardController**
- **AuditController**

### Services
- **DataAggregationService**
- **ReportGenerationService**
- **KpiComputationService**
- **ExportService**
- **AuditTrailService**
- **SecurityEventDetectionService**
- **ComplianceReportService**

## Event-Driven Integration (Kafka)

### Publishes (Outbound Events)
- `SuspiciousActivityDetected`

### Consumes (Inbound Events)
- `* (Consumes all events for CQRS analytics and compliance auditing)`

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
