# 01 - System Architecture

## Target architecture (end state, Phase 8)

```mermaid
flowchart TB
    Client[Browser - Next.js] --> CDN[CDN - static + cached pages]
    CDN --> LB[Nginx Load Balancer]
    Client -- WebSocket --> LB
    LB --> GW[API Gateway: auth, rate limit, routing]

    GW --> US[User/Auth Service]
    GW --> PS[Product Service]
    GW --> OS[Order Service]
    GW --> IS[Inventory Service]
    GW --> PY[Payment Service]
    LB --> RT[Realtime Service - Socket.IO]

    US --> PG1[(Postgres users)]
    PS --> PG2[(Postgres products)]
    PS --> ES[(Elasticsearch)]
    OS --> PG3[(Postgres orders)]
    IS --> PG4[(Postgres inventory)]
    PY --> PG5[(Postgres payments)]

    GW --> R[(Redis: cache, locks, rate limit)]
    IS --> R
    RT --> R

    OS -- events --> MQ{{RabbitMQ}}
    IS -- events --> MQ
    PY -- events --> MQ
    MQ --> NS[Notification Service]
    MQ --> W[Background Workers]
    MQ --> RT
    NS --> MG[(MongoDB logs)]

    subgraph Observability
        PR[Prometheus] --> GF[Grafana]
        OT[OpenTelemetry] --> JG[Jaeger]
    end
```

## Phase 1 architecture (start here)

```mermaid
flowchart LR
    Client --> App[NestJS Modular Monolith]
    App --> PG[(Postgres)]
```

One deployable app. Modules: auth, users, products, inventory, orders, payments, notifications, realtime.

## Layers inside a backend module

```mermaid
flowchart LR
    C[Controller - HTTP only] --> S[Service - business logic] --> R[Repository - DB only] --> DB[(Database)]
    S --> E[Event publisher]
```

## NestJS request lifecycle
Request -> Middleware -> Guard -> Interceptor(before) -> Pipe -> Controller -> Service -> Repository
-> Interceptor(after) -> Exception Filter (on error) -> Response

## Tech map
| Concern | Tool | Phase |
|---|---|---|
| API framework | NestJS | 1 |
| Main DB | PostgreSQL + Prisma | 1 |
| Cache, locks, rate limit | Redis | 2, 6, 7 |
| Queue | RabbitMQ | 3 |
| Realtime | Socket.IO + Redis adapter | 4 |
| Search | Elasticsearch | 7 |
| LB | Nginx | 6 |
| Orchestration | Kubernetes | 7 |
| Metrics/traces | Prometheus, Grafana, OpenTelemetry | 8 |