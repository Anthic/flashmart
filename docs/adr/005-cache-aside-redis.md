# ADR-005: Redis cache-aside for reads

- Status: Accepted
- Phase: 2

## Context
Product reads dominate traffic (80%+) and rarely change.

## Decision
Cache-aside with TTL + delete-on-write, stampede lock, and null caching.

## Alternatives considered
| Option | Pros | Cons |
|---|---|---|
| Write-through | Always fresh | Write latency, complexity |
| Read-through library | Less code | Hides behavior, less learning |
| No cache + replicas only | Simple | Costly at 14k RPS |

## Consequences
+ Large drop in DB load and latency
- Stale data window = TTL; invalidation bugs possible

## Validation
k6 before/after: DB CPU, p95 latency, cache hit ratio > 90% (see benchmarks/).