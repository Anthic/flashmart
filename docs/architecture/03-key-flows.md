# 03 - Key Flows

## Flow 1: Place order (saga, choreography)

```mermaid
sequenceDiagram
    participant C as Client
    participant O as Order Svc
    participant I as Inventory Svc
    participant P as Payment Svc
    participant MQ as RabbitMQ
    participant R as Realtime

    C->>O: POST /orders (Idempotency-Key)
    O->>O: Save order PENDING + outbox event (1 transaction)
    O-->>C: 202 Accepted {orderId}
    O->>MQ: order.created
    MQ->>I: order.created
    I->>I: Reserve stock (atomic)
    alt stock ok
        I->>MQ: stock.reserved
        MQ->>P: stock.reserved
        P->>P: Mock charge
        alt payment ok
            P->>MQ: payment.succeeded
            MQ->>O: payment.succeeded -> status PAID
        else payment failed
            P->>MQ: payment.failed
            MQ->>I: release stock (compensation)
            MQ->>O: status CANCELLED
        end
    else no stock
        I->>MQ: stock.reservation_failed
        MQ->>O: status CANCELLED (OUT_OF_STOCK)
    end
    MQ->>R: every status change
    R-->>C: WebSocket order.status_changed
```

## Order state machine

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> RESERVED: stock.reserved
    PENDING --> CANCELLED: stock.reservation_failed
    RESERVED --> PAID: payment.succeeded
    RESERVED --> CANCELLED: payment.failed / timeout
    PAID --> SHIPPED
    SHIPPED --> DELIVERED
    CANCELLED --> [*]
    DELIVERED --> [*]
```

Invalid transitions must throw. Put the transition table in one place in the order service.

## Flow 2: Flash-sale buy (hot path, Phase 7)

```mermaid
flowchart LR
    U[User click Buy] --> RL[Rate limit]
    RL --> Q{Redis atomic DECR stock}
    Q -- below 0 --> SO[Sold out - 409, fast]
    Q -- ok --> ENQ[Enqueue order request]
    ENQ --> ACK[202 + orderId]
    ENQ --> WK[Worker creates order in Postgres]
    WK --> WS[WebSocket status]
```

Idea: reject losers in Redis in microseconds, only winners touch Postgres.

## Flow 3: Auth with refresh rotation
1. Login -> access JWT (15m) + refresh token (7d, stored hashed in DB, httpOnly cookie)
2. Access expired -> POST /auth/refresh -> new pair, old refresh revoked
3. Old refresh reused -> revoke the whole token family (theft detection)

## Flow 4: Realtime connection
1. Client connects with JWT -> gateway verifies -> joins room `user:{userId}`
2. Event consumer receives `order.*` -> emits to `user:{userId}`
3. With many instances, Redis adapter forwards to the instance holding that socket
4. On reconnect, client refetches orders via REST (socket is a hint, REST is truth)
