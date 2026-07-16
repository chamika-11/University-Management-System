# ADR 001: Saga Orchestration Pattern for Multi-Service Transactions

## Context
When performing cross-service write flows, such as Student Admissions or Registrations, transactions span multiple microservices (e.g., Admission Service, Finance Service, and User Profile Service). 

## Decision
We utilize the Saga Pattern with Orchestration. In each Saga, the initiating service (such as `AdmissionService`) acts as the orchestrator, sending command topics to Kafka and listening for compensation responses.

## Consequences
- Eventual consistency is maintained across data boundaries.
- Services write out event structures to an transactional `outbox` table to guarantee reliable transport.
