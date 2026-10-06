# 03 - Redis Key Design

Format: `flashmart:<domain>:<entity>:<id>[:<detail>]`

| Key | Type | TTL | Purpose |
|---|---|---|---|
| flashmart:cache:product:{id} | string (JSON) | 10m | Product detail |
| flashmart:cache:products:list:{hash(filters+cursor)} | string (JSON) | 60s | Product list |
| flashmart:cache:null:product:{id} | string | 30s | Cache penetration guard |
| flashmart:lock:cache:product:{id} | string | 5s | Stampede protection |
| flashmart:ratelimit:ip:{ip} | string / zset | 60s | Global limiter |
| flashmart:ratelimit:login:{ip}:{email} | string | 15m | Login brute force |
| flashmart:ratelimit:bucket:order:{userId} | hash | 2m | Token bucket |
| flashmart:stock:{productId} | string (int) | sale duration | Flash-sale counter (DECR) |
| flashmart:sale:bought:{saleId}:{userId} | string (int) | sale duration | Per-user limit |
| flashmart:idem:{key} | string (JSON) | 24h | Idempotency response |
| flashmart:ws:user:{userId} | set | - | Online presence (optional) |
| flashmart:lock:order:{orderId} | string | 10s | Distributed lock |

## Rules
- Always set a TTL (except config)
- Keys under 100 bytes, values under 100KB
- Use SCAN, never KEYS in production
- Lua scripts live in backend/src/infra/redis/scripts/ and are tested
- Decide per feature: fail-open (cache) or fail-closed (rate limit on login, payments)