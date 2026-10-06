# 01 - REST Endpoints

Auth column: Public / User / Admin. Target = p95 latency goal.

## Auth
| Method | Path | Auth | Notes | Target |
|---|---|---|---|---|
| POST | /auth/register | Public | email, password, name. Rate limited | 300ms |
| POST | /auth/login | Public | Returns access + sets refresh cookie. 5/15min | 300ms |
| POST | /auth/refresh | Cookie | Rotates refresh token | 150ms |
| POST | /auth/logout | User | Revokes refresh token | 100ms |
| GET | /users/me | User | Profile | 50ms |

## Products
| Method | Path | Auth | Notes | Target |
|---|---|---|---|---|
| GET | /products | Public | cursor pagination, filters: category, q, minPrice, maxPrice | 150ms cached |
| GET | /products/:id | Public | ETag, cached | 80ms cached |
| POST | /products | Admin | Create | 200ms |
| PATCH | /products/:id | Admin | Invalidates cache | 200ms |
| DELETE | /products/:id | Admin | Archive (soft) | 200ms |
| GET | /search/products?q= | Public | Elasticsearch (Phase 7) | 200ms |

## Inventory
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | /products/:id/stock | Public | Display only, cached 2s |
| PUT | /admin/inventory/:productId | Admin | Set/adjust stock |

## Flash sales
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | /flash-sales/active | Public | Current sale + items |
| POST | /admin/flash-sales | Admin | Create sale, preload Redis counters |
| POST | /flash-sales/:id/buy | User | Hot path (Phase 7): 202 {orderId} or 409 SOLD_OUT |

## Orders
| Method | Path | Auth | Notes | Target |
|---|---|---|---|---|
| POST | /orders | User | Idempotency-Key required. Body: items[{productId, quantity}]. 201 (Phase 1) -> 202 (Phase 5) | 500ms |
| GET | /orders | User | My orders, cursor | 150ms |
| GET | /orders/:id | User | Owner only (else 404) | 100ms |
| POST | /orders/:id/cancel | User | Only PENDING/RESERVED | 300ms |

## Payments
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | /payments | User | Mock charge, Idempotency-Key required |
| POST | /payments/webhook | Signature | Mock provider callback, verify HMAC |

## Admin
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | /admin/orders | Admin | Filter by status, cursor |
| GET | /admin/stats | Admin | Cached 10s |

## Ops (no /api prefix auth)
| Method | Path | Notes |
|---|---|---|
| GET | /health/live | Process alive |
| GET | /health/ready | DB, Redis, RabbitMQ reachable |
| GET | /metrics | Prometheus (internal network only) |
| GET | /docs | Swagger UI (disabled in production) |

## Example: create order
```http
POST /api/v1/orders
Authorization: Bearer <token>
Idempotency-Key: 7d1c6c0e-5c1a-4b1f-9a55-3f8d5b1d9a10
Content-Type: application/json

{ "items": [{ "productId": "uuid", "quantity": 1 }] }
```
Response `201`:
```json
{ "data": { "id": "uuid", "status": "PENDING", "totalCents": 129900, "items": [ ... ] } }
```
Same key sent again -> same response, no second order.