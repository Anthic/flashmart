# 00 - API Conventions

- Base URL: `/api/v1`
- JSON only, UTF-8, camelCase fields
- Auth: `Authorization: Bearer <accessToken>`
- Dates: ISO-8601 UTC. Money: integer cents (`priceCents`)
- IDs: UUID

## Headers
| Header | Use |
|---|---|
| x-request-id | Optional in, always out |
| Idempotency-Key | Required on POST /orders, POST /payments |
| Retry-After | On 429/503 |
| ETag / If-None-Match | On cacheable GETs |

## Success shape
Single: `{ "data": {...} }`
List: `{ "data": [...], "meta": { "nextCursor": "abc", "limit": 20 } }`

## Error shape
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Out of stock",
  "code": "OUT_OF_STOCK",
  "path": "/api/v1/orders",
  "timestamp": "2026-10-05T10:00:00Z",
  "requestId": "uuid"
}
```

## Status codes
200 OK, 201 Created, 202 Accepted (async), 204 No Content, 400 validation, 401 unauthenticated,
403 forbidden, 404 not found, 409 conflict (stock, duplicate), 422 business rule, 429 rate limited, 500, 503.

## Pagination
`GET /products?limit=20&cursor=<opaque>` -> `meta.nextCursor` (null when finished). Max limit 100.

## Versioning
Breaking change -> new `/api/v2`. Additive change -> same version.