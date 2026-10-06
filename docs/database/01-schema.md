# 01 - Schema Details

## Conventions
snake_case plural tables, UUID PK, created_at/updated_at timestamptz, money as integer cents.

## Tables and constraints
| Table | Constraints |
|---|---|
| users | email UNIQUE (store lowercase), role NOT NULL default CUSTOMER |
| refresh_tokens | token_hash UNIQUE, FK user_id ON DELETE CASCADE, index (user_id), (family_id) |
| categories | slug UNIQUE |
| products | price_cents CHECK > 0, status enum (DRAFT, ACTIVE, ARCHIVED) |
| inventory | CHECK (available >= 0), CHECK (reserved >= 0), version int default 0 |
| flash_sales | CHECK (ends_at > starts_at) |
| flash_sale_items | PK (flash_sale_id, product_id), sale_quantity CHECK > 0 |
| orders | idempotency_key UNIQUE, status enum, total_cents CHECK >= 0 |
| order_items | quantity CHECK > 0, FK order_id ON DELETE CASCADE, UNIQUE (order_id, product_id) |
| payments | idempotency_key UNIQUE, amount_cents CHECK > 0 |
| outbox_events | published_at NULL = not yet sent |
| processed_messages | PK (message_id, consumer) |

## Enums
- role: CUSTOMER, ADMIN
- product_status: DRAFT, ACTIVE, ARCHIVED
- order_status: PENDING, RESERVED, PAID, SHIPPED, DELIVERED, CANCELLED
- payment_status: PENDING, SUCCEEDED, FAILED, REFUNDED
- flash_sale_status: SCHEDULED, LIVE, ENDED

## Normalization checkpoint
- 1NF: no repeating groups (order_items instead of columns item1, item2)
- 2NF/3NF: category data lives in categories, not repeated in products
- Intentional denormalization: unit_price_cents and total_cents in orders (history/perf)

## Data lifecycle
- Orders never hard-deleted. Cancelled stays with status.
- refresh_tokens purge job: delete expired > 30 days (worker, Phase 3)
- outbox_events purge: delete published > 7 days
- Partition orders by month when > 50M rows (Phase 7)