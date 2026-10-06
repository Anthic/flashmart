# 02 - WebSocket Contract (Socket.IO)

- Namespace: `/realtime`
- Connect: `io(url, { auth: { token: accessJwt } })`
- Server verifies JWT, joins client to room `user:{userId}`. Clients cannot pick rooms.
- Heartbeat: Socket.IO ping/pong (interval 25s, timeout 20s)
- Reconnect: exponential backoff + jitter; on reconnect, client refetches `GET /orders` (REST is truth)

## Server -> Client
| Event | Payload | When |
|---|---|---|
| order.status_changed | { orderId, status, occurredAt } | Any order transition |
| payment.updated | { orderId, status } | Payment result |
| stock.updated | { productId, available } | Flash sale low-stock display (throttled 1/s) |
| sale.started / sale.ended | { saleId } | Sale lifecycle |

## Client -> Server
| Event | Payload | Notes |
|---|---|---|
| subscribe.product | { productId } | Joins room `product:{id}` (validated, max 20) |
| unsubscribe.product | { productId } | |

## Errors
`error` event: { code: "UNAUTHORIZED" | "RATE_LIMITED", message }. Server disconnects on UNAUTHORIZED.

## Scaling note
Multiple instances use `@socket.io/redis-adapter`; an event consumed on instance A reaches the socket on instance B.