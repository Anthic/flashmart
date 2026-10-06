# Backend Rules (NestJS)

## Architecture
- Feature-based modules in src/modules/<feature>/
- Layers: Controller (HTTP only) -> Service (business logic) -> Repository (DB access only)
- Controllers never touch the DB. Services never use req/res objects.
- Technical code (redis, rabbitmq, prisma, logger) lives in src/infra/, exposed as injectable providers.
- A module talks to another module only through its exported service or events. Never import another module's repository.
- Prepare for microservices: no cross-module DB joins in business code later; use IDs + events.

## File naming
<feature>.module.ts, <feature>.controller.ts, <feature>.service.ts,
<feature>.repository.ts, dto/create-<feature>.dto.ts, <feature>.service.spec.ts

## API standards
- REST, versioned: /api/v1/...
- Plural nouns: /products, /orders/:id
- Validate every input with DTO + class-validator (ValidationPipe whitelist + forbidNonWhitelisted)
- Never return DB entities directly; map to response DTOs. Never expose password hashes.
- Consistent error format: { statusCode, error, message, path, timestamp, requestId }
- Pagination: cursor-based for lists (?limit=20&cursor=...)
- Swagger docs on every endpoint
- Idempotency-Key header required for POST /orders and POST /payments

## Security
- Passwords: argon2
- Auth: short-lived access JWT (15m) + refresh token (rotating, stored hashed)
- Rate limiting: global default + stricter on /auth/*
- Helmet, CORS allowlist, request size limits
- Never log secrets, tokens, or card data

## Performance
- Cache-aside with Redis for read-heavy data (product list/detail), TTL + explicit invalidation
- Heavy work (email, invoice PDF, reports) goes to a queue, never in the request cycle
- Use compression, ETag/Cache-Control where it makes sense
- DB pool sized deliberately; log slow queries (>200ms)
- Every endpoint must have a documented target p95 latency

## Messaging (RabbitMQ)
- Consumers must be idempotent (store processed message IDs)
- Manual ack, prefetch set, retry with exponential backoff, dead-letter queue
- Use Outbox pattern when a DB write and a publish must stay consistent
- Event names: past tense, dot style: order.created, payment.succeeded

## Reliability and observability
- Health endpoints: /health/live, /health/ready (Terminus)
- Structured JSON logs (pino) with requestId/correlationId
- Metrics on /metrics (prom-client), traces via OpenTelemetry
- Timeouts on every outbound call; circuit breaker for external services
- Graceful shutdown enabled

## Testing
- Unit test services (mock repository)
- E2E tests with real Postgres/Redis from docker compose
- Load tests in /scripts (k6), results saved to docs/benchmarks