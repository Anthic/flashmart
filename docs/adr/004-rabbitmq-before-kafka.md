# ADR-004: RabbitMQ first, Kafka later for comparison

- Status: Accepted
- Phase: 3

## Context
Need task queues, retries, routing, and DLQ for order events and background jobs.

## Decision
Use RabbitMQ (topic exchange) for commands/events in Phases 3-7. In Phase 8, build a small Kafka experiment (order event stream/analytics) and compare.

## Alternatives considered
| Option | Pros | Cons |
|---|---|---|
| Kafka | Huge throughput, replay, ordering per partition | Heavy ops, overkill for task queues |
| BullMQ (Redis) | Simple, great for jobs | Less routing, Redis durability limits |
| SQS | Managed | Cloud lock-in, not local-learnable |

## Consequences
+ Rich routing, ack/nack, DLQ, easy local run
- No native replay of old events; Kafka experiment covers that lesson

## Validation
Kill worker mid-job: message redelivered, no duplicate side effect (idempotent consumer).