# API Gateway

The single ingress point for all frontend client applications.

## Key Responsibilities
- **Routing:** Downstream reverse-proxy routing to microservices.
- **BFF Aggregation:** Gathers multiple service fragments for portals (Student, Faculty, Admin).
- **Authentication & RBAC:** Verifies token validation prior to relaying requests.
- **Resilience:** Circuit breaking via `opossum` and rate limiting via Redis token bucket.
