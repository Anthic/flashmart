# 04 - Database Scaling Plan

| Stage | Trigger | Action |
|---|---|---|
| 1 | Always | Indexes, connection pooling (Prisma pool, then PgBouncer) |
| 2 | Slow reads | Redis cache-aside |
| 3 | Read load on primary > 60% CPU | Read replica (route GETs, accept replication lag) |
| 4 | Big tables | Partition orders by month (range partition on created_at) |
| 5 | Microservices | Database per service (Phase 5) |
| 6 | Write limit of single node | Shard by user_id hash (concept only, document trade-offs) |
| 7 | Search/analytics | Elasticsearch for search; analytics export to separate store |

## Consistency choices
| Data | Model |
|---|---|
| Inventory, payments | Strong (primary only) |
| Order status | Strong write, eventual for realtime read |
| Product catalog | Eventual (cache TTL) |
| Search index | Eventual (updated by product.* events, lag < 5s) |

## Backup and recovery (document, practice once)
- Daily pg_dump + WAL archiving concept (PITR)
- Restore drill: restore into a fresh container and verify row counts
- RPO 5 min, RTO 30 min (targets)

## Migration rules
- Backward-compatible migrations: add column nullable -> deploy code -> backfill -> add constraint
- Never rename/drop in the same release as code change (expand/contract pattern)