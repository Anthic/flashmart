# 00 - Overview

## Problem
Flash-sale e-commerce. Few items, huge traffic spike, inventory must never oversell,
users want live order status.

## Goals
- Learn how large companies scale systems, step by step
- Zero overselling under 100k concurrent buy attempts
- Real-time order tracking
- Every optimization is measured

## Non-goals
- Real payment gateway (mock only)
- Multi-region deployment
- Recommendation / ML

## Actors
| Actor | Does |
|---|---|
| Customer | Browse, search, buy, track order |
| Admin | Manage products, stock, flash sales |
| System | Workers, schedulers, payment webhooks |

## Functional requirements
1. Register / login / refresh / logout
2. Browse and search products
3. Flash sale with limited stock and start time
4. Place order (idempotent)
5. Mock payment, retry safe
6. Email/notification on order events
7. Live order status via WebSocket
8. Admin dashboard (stock, orders)

## Non-functional requirements (NFR)
| Area | Target |
|---|---|
| Availability | 99.9% for browse, 99.5% for checkout |
| Latency | Product list p95 < 150ms (cached), order create p95 < 500ms |
| Throughput | 20,000 read RPS, 5,000 write RPS at flash-sale peak |
| Consistency | Inventory: strong. Product catalog/search: eventual (max 5s) |
| Durability | No lost order, no lost payment event |
| Security | OWASP top 10 covered, rate limited |

## Capacity estimation (back-of-envelope, learn this skill)
- 1,000,000 registered users, 100,000 concurrent during sale
- Each user: ~10 requests in first minute -> 1M requests / 60s ~ 17k RPS
- Reads 80%, writes 20% -> ~14k read RPS, ~3k write RPS
- One Node instance handles ~1-2k simple RPS -> need 10+ instances behind LB
- Order row ~1KB, 1M orders/day -> ~1GB/day, ~365GB/year (plan partitioning)
- Product page ~50KB JSON+HTML cached -> 14k * 50KB = 700MB/s -> CDN is mandatory

## Evolution plan
Modular monolith -> performance -> queues -> realtime -> microservices -> traffic control -> scale -> observability.
See .agent/workflows/00-master-plan.md