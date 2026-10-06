# 08 - Observability

## Three pillars
| Pillar | Tool | What |
|---|---|---|
| Logs | pino (JSON) -> Loki | requestId, userId, orderId, level |
| Metrics | prom-client -> Prometheus -> Grafana | RED + USE |
| Traces | OpenTelemetry -> Jaeger | request across services and queues |

## Correlation
Gateway creates `x-request-id`. Pass it in HTTP headers and RabbitMQ message `correlationId`.
One ID lets you follow a request across all services.

## Metrics to expose (/metrics)
- RED: Rate (http_requests_total), Errors (5xx ratio), Duration (http_request_duration_seconds histogram)
- USE: CPU, memory, event loop lag, DB pool in use, Redis latency
- Business: orders_created_total, orders_by_status, stock_sold_out_total, payment_failed_total
- Queue: messages_ready, messages_unacked, dlq_size, consumer_lag

## Dashboards
1. API overview (RPS, p50/p95/p99, error rate)
2. Postgres (connections, slow queries, locks)
3. Redis (hit ratio, memory, ops/s)
4. RabbitMQ (queue depth, DLQ)
5. Flash-sale business dashboard

## Alerts (examples)
| Alert | Condition |
|---|---|
| High error rate | 5xx > 2% for 5 min |
| Slow API | p95 > 1s for 5 min |
| DLQ not empty | dlq_size > 0 for 1 min |
| Queue backlog | messages_ready > 10,000 for 5 min |
| Low cache hit | hit ratio < 70% for 10 min |

## SLO example
Checkout availability 99.5% / 30 days -> error budget ~3.6 hours.