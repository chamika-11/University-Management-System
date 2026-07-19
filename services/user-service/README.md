# User & Auth Service

## Overview
Consolidated service managing authentication, roles, permissions, SSO integration, session management, Multi-Factor Authentication (MFA), and core profiles for students, faculty, administrators, and staff (including address details and emergency contacts).

- **Database:** `user_db` (handles profile and authentication details)

## Architecture Details

### Models / Collections
- **User**
- **Role**
- **Permission**
- **RefreshToken**
- **PasswordResetToken**
- **LoginAudit**
- **MfaConfig**
- **StudentProfile**
- **FacultyProfile**
- **AdminProfile**
- **StaffProfile**
- **Address**
- **EmergencyContact**

### Controllers
- **AuthController**
- **RoleController**
- **PermissionController**
- **SessionController**
- **MfaController**
- **StudentProfileController**
- **FacultyProfileController**
- **AdminProfileController**
- **StaffProfileController**

### Services
- **AuthService**
- **TokenService**
- **PasswordService**
- **RBACService**
- **MfaService**
- **SsoIntegrationService (SAML/OAuth2)**
- **ProfileService**
- **ProfileValidationService**
- **ProfileSearchService**
- **ProfilePictureLinkService**

## Event-Driven Integration (Kafka)

### Publishes (Outbound Events)
- `UserRegistered`
- `UserLoggedIn`
- `PasswordChanged`
- `AccountLocked`
- `UserProfileCreated`
- `ProfileUpdated`

### Consumes (Inbound Events)
- `AdmissionConfirmed`

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
