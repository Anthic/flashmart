# FlashMart Documentation

| Folder | Purpose | Read when |
|---|---|---|
| architecture/ | System design, flows, scaling | Before building any feature |
| database/ | ERD, schema, indexes, Redis keys | Before writing Prisma schema |
| adr/ | Why we chose X over Y | Before changing a decision |
| api/ | REST + WebSocket contract | Before frontend/backend integration |
| benchmarks/ | k6 before/after numbers | After every optimization |

## Reading order for a newcomer
1. architecture/00-overview.md
2. architecture/01-system-architecture.md
3. database/00-erd.md
4. api/00-conventions.md
5. adr/README.md

## Doc rules
- Docs change in the same PR as the code that changes the behavior.
- Diagrams use Mermaid (renders on GitHub).
- A decision without an ADR is not a decision.