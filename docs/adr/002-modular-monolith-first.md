# ADR-002: Start as a modular monolith

- Status: Accepted
- Phase: 1

## Context
Domain boundaries are not known yet. Owner is learning NestJS. Microservices from day 1 add network, deployment, and debugging cost.

## Decision
Build one NestJS app with strict module boundaries. Split into services in Phase 5 only along those boundaries.

## Alternatives considered
| Option | Pros | Cons |
|---|---|---|
| Microservices day 1 | Looks impressive | Wrong boundaries, slow learning, heavy ops |
| Plain monolith (no boundaries) | Fastest start | Painful split later |

## Consequences
+ Fast feedback, easy debugging, easy refactor
+ Boundaries enforced by rules (backend/RULES.md)
- Must keep discipline: no cross-module DB access

## Validation
Phase 5 split takes days, not weeks, and needs no domain redesign.