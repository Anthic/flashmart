# 07 - Security

| Area | Decision |
|---|---|
| Passwords | argon2id |
| Access token | JWT, 15 min, in memory / Authorization header |
| Refresh token | Random 256-bit, hashed in DB, httpOnly+Secure+SameSite cookie, rotation + reuse detection |
| Authorization | Role guard (CUSTOMER, ADMIN) + ownership check (user can read only own orders) |
| Input | DTO validation, whitelist, forbidNonWhitelisted, max body 100KB |
| Transport | HTTPS everywhere, HSTS |
| Headers | Helmet, strict CORS allowlist |
| SQL injection | Prisma parameterized queries, no string-built raw SQL |
| Brute force | Rate limit + temporary lock after failures |
| Secrets | .env locally, K8s Secrets later, never in git |
| Logging | Never log passwords, tokens, card data. Mask email in logs |
| Dependencies | `pnpm audit` in CI, Dependabot |
| Idempotency | Prevents double charge on retry |
| WebSocket | JWT verified on connect, room per user, no client-chosen room names |

## Threat checklist (review each phase)
- [ ] IDOR: can user A read user B's order?
- [ ] Mass assignment: can user set role=ADMIN in register?
- [ ] Replay: can an old refresh token be reused?
- [ ] Price tampering: price comes from DB, never from client
- [ ] Bot buying whole stock: rate limit + per-user purchase limit