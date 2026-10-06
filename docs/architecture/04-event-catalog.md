# 04 - Event Catalog and RabbitMQ Topology

## Envelope (every event)
```json
{
  "eventId": "uuid",
  "eventType": "order.created",
  "occurredAt": "2026-10-05T10:00:00Z",
  "correlationId": "uuid",
  "version": 1,
  "payload": {}
}
```

## Naming
`<aggregate>.<past-tense-verb>` e.g. order.created, payment.failed

## Events
| Event | Producer | Payload | Consumers |
|---|---|---|---|
| user.registered | users | userId, email | notifications |
| order.created | orders | orderId, userId, items[], totalCents | inventory, notifications |
| stock.reserved | inventory | orderId, items[] | payments, orders |
| stock.reservation_failed | inventory | orderId, reason | orders |
| stock.released | inventory | orderId | orders |
| payment.succeeded | payments | orderId, paymentId, amountCents | orders, notifications |
| payment.failed | payments | orderId, reason | inventory, orders, notifications |
| order.confirmed | orders | orderId | notifications, realtime, workers (invoice) |
| order.cancelled | orders | orderId, reason | inventory, notifications, realtime |

## RabbitMQ topology
- Exchange `flashmart.events` (type: topic, durable)
- Routing key = event type (order.created)
- Queues (one per consumer, durable):
  - `inventory.order-events`      binding: order.created, order.cancelled, payment.failed
  - `payments.stock-events`       binding: stock.reserved
  - `orders.saga-events`           binding: stock.*, payment.*
  - `notifications.all-events`    binding: order.*, payment.*, user.*
  - `realtime.order-events`       binding: order.*, payment.*
  - `workers.invoice`             binding: order.confirmed
- Retry: `<queue>.retry` (TTL 5s/30s/5m via per-message TTL) -> back to main queue
- Dead letter: `<queue>.dlq` after 5 failed attempts, alert on DLQ size > 0

## Consumer rules
1. Manual ack only after success
2. Prefetch = 10 (tune with benchmark)
3. Idempotent: table `processed_messages(message_id, consumer)` unique constraint
4. Poison message -> DLQ, never infinite retry
5. Publisher uses Outbox: write event in same DB transaction, a relay publishes it