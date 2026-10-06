# 02 - Indexes and Hot Queries

Rule: write the query first, then the index. Verify with EXPLAIN (ANALYZE, BUFFERS).

| # | Query | Frequency | Index |
|---|---|---|---|
| 1 | Login: user by email | High | UNIQUE (email) |
| 2 | Product list (active, newest first, cursor) | Very high | (status, created_at DESC, id DESC) |
| 3 | Product detail by id | Very high | PK |
| 4 | Products by category | High | (category_id, status, created_at DESC) |
| 5 | My orders (newest first, cursor) | High | (user_id, created_at DESC, id DESC) |
| 6 | Order items by order | High | (order_id) |
| 7 | Orders by status (admin, workers) | Medium | (status, created_at) |
| 8 | Refresh token lookup | High | UNIQUE (token_hash) |
| 9 | Outbox relay: unpublished events | Constant | PARTIAL INDEX (created_at) WHERE published_at IS NULL |
| 10 | Active flash sales | High | (status, starts_at) |

## Cursor pagination example
```sql
SELECT id, name, price_cents, created_at
FROM products
WHERE status = 'ACTIVE'
  AND (created_at, id) < ($1, $2)   -- cursor from last item
ORDER BY created_at DESC, id DESC
LIMIT 21;                            -- 20 + 1 to know if there is a next page
```

## Optimization log (fill during Phase 2)
| Query | Before (ms) | Change | After (ms) | Plan notes |
|---|---|---|---|---|
| | | | | |

## Anti-patterns to avoid
SELECT *, OFFSET on large tables, N+1 queries, unindexed FK, function on indexed column in WHERE, long transactions.