# 02 - Service Boundaries

Boundaries are drawn NOW (as modules) so the Phase 5 split is easy.

| Module/Service | Owns (data) | Exposes | Publishes events | Consumes events |
|---|---|---|---|---|
| auth/users | users, refresh_tokens | register, login, me | user.registered | - |
| products | products, categories | list, detail, admin CRUD | product.created, product.updated | - |
| inventory | inventory, stock_reservations | reserve, release, adjust | stock.reserved, stock.reservation_failed, stock.released | order.cancelled, payment.failed |
| orders | orders, order_items | create, get, list, cancel | order.created, order.confirmed, order.cancelled | stock.reserved, payment.succeeded, payment.failed |
| payments | payments | charge (mock), webhook | payment.succeeded, payment.failed | stock.reserved |
| notifications | notification_logs (Mongo) | - | - | order.*, payment.* |
| realtime | none (stateless) | WebSocket | - | order.*, payment.* |

## Rules
1. A module accesses another module's data only via its service or events, never its tables.
2. No cross-module foreign keys after Phase 5. Store the ID only.
3. No cross-module DB join in business code. Compose in service layer or use a read model.
4. Each module has its own Prisma models grouped by comment block, so splitting the schema is easy later.

## Sync vs async
| Use sync (REST/gRPC) when | Use async (events) when |
|---|---|
| User waits for the answer | Work can happen later |
| Need a strong, immediate result | Many consumers care about the fact |
| Simple query | Failure must be retried safely |