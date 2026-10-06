# ADR-003: Prisma as ORM

- Status: Accepted
- Phase: 1

## Context
Beginner-friendly, type-safe DB access with migrations.

## Decision
Use Prisma. Use raw SQL (`$queryRaw`) for hot or complex queries (inventory update, reports).

## Alternatives considered
| Option | Pros | Cons |
|---|---|---|
| TypeORM | Native NestJS examples, decorators | Weaker typing, more footguns |
| Drizzle | SQL-like, lightweight | Smaller ecosystem for learning |
| Raw SQL only | Full control | More boilerplate, no type safety |

## Consequences
+ Great DX, schema as single source, easy migrations
- Generated queries can be N+1 prone; must inspect with query log
- Some features (partitioning, partial indexes) need manual SQL migrations

## Validation
Slow query log shows no N+1 on list endpoints.