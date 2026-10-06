# ADR-001: PostgreSQL as primary database

- Status: Accepted
- Phase: 1

## Context
Orders, payments, and inventory need ACID transactions, constraints, and relations.

## Decision
Use PostgreSQL 16 as the system of record.

## Alternatives considered
| Option | Pros | Cons |
|---|---|---|
| MySQL | Popular, simple | Weaker features (partial indexes, jsonb, CHECK history) |
| MongoDB | Flexible schema | Multi-document transactions weaker, relations manual |
| DynamoDB | Massive scale | Hard modeling, vendor lock-in, poor for learning SQL |

## Consequences
+ Strong consistency, CHECK constraints stop overselling at DB level
+ jsonb for outbox payloads, partial indexes, partitioning
- Vertical scaling limit; solved later with replicas, partitioning, service split

## Validation
Concurrency test shows CHECK (available >= 0) blocks negative stock.