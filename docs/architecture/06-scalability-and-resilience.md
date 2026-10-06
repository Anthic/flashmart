# 06 - Scalability and Resilience

## Horizontal scaling
- Services are stateless: no in-memory session, no local files
- State lives in Postgres, Redis, RabbitMQ
- Scale by adding instances behind Nginx / K8s Service

## Load balancing (Nginx)
- Algorithm: least_conn for API, ip_hash/sticky for WebSocket (or Redis adapter + any)
- Active health check on /health/ready
- Keepalive to upstream, gzip/brotli, proxy timeouts set explicitly

## Rate limiting
| Scope | Limit | Algorithm |
|---|---|---|
| Global per IP | 100 req/min | Sliding window |
| /auth/login per IP+email | 5 / 15 min | Fixed window |
| POST /orders per user | 5 / min | Token bucket |
| Flash-sale buy per user | 1 / 5s | Redis Lua token bucket |

Response: 429 + `Retry-After` header. Counters in Redis (shared across instances), atomic via Lua.

## Resilience patterns
| Pattern | Where | Setting |
|---|---|---|
| Timeout | Every outbound call | HTTP 2s, DB query 5s |
| Retry | Idempotent calls only | 3x, exponential backoff + jitter |
| Circuit breaker | Payment provider, search | open after 50% fail over 10 calls, half-open 30s |
| Bulkhead | Separate pools for checkout vs browse | independent DB pool / queue |
| Graceful degradation | Search down -> fallback to Postgres LIKE | feature flag |
| Backpressure | Queue length limit, reject with 503 | |
| Idempotency | POST /orders, /payments | Idempotency-Key, stored 24h |

## Inventory strategies (compare with k6, Phase 7)
| # | Strategy | Expected | Trade-off |
|---|---|---|---|
| 1 | Naive read-then-update | Oversells | Bug to observe |
| 2 | `SELECT ... FOR UPDATE` | Correct, slow | Lock contention |
| 3 | Optimistic lock (version column) | Correct, many retries | Wasted work |
| 4 | Redis atomic DECR / Lua | Correct, very fast | Redis and DB must reconcile |
| 5 | Queue per product, single consumer | Correct, ordered | Higher latency |

## Failure scenarios to test (chaos, Phase 8)
- Kill an app instance mid-request
- Stop RabbitMQ for 60s, then restart (outbox must catch up)
- Stop Redis (rate limit/caching must fail open or closed deliberately, document which)
- Slow Postgres (circuit breaker + timeouts)
- Payment service returns 500 (saga compensation)