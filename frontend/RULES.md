# Frontend Rules (Next.js)

## Architecture
- App Router. Server Components by default; add "use client" only when needed (state, effects, events).
- Feature-based code in src/features/<feature>/ (components, hooks, api, types together)
- Shared UI in src/components/ui/. No business logic there.
- All HTTP goes through src/lib/api-client.ts (base URL, auth header, error normalization, request id)
- Server state = TanStack Query. Client/UI state = Zustand or React state. Never mix them.
- Types shared from API contract (docs/api); no `any`.

## Data fetching
- Query keys centralized per feature (e.g., productKeys.list(filters))
- staleTime set deliberately per query type
- Optimistic updates only for safe actions (e.g., cart), always with rollback
- Pagination via cursor + "load more" / infinite query
- Handle loading, empty, error states on every screen

## Real-time
- One socket client in src/lib/socket.ts, wrapped in a hook (useOrderTracking)
- Auto reconnect with backoff, heartbeat, auth token on connect
- On reconnect, refetch via REST to avoid missed events (socket is a hint, REST is truth)

## Performance (Core Web Vitals)
- next/image for all images, next/font for fonts
- Dynamic import for heavy components
- Avoid unnecessary client components and large bundles; check with bundle analyzer
- Use ISR/SSG/caching for product pages, SSR only when needed
- Debounce search input; virtualize long lists
- Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1

## Security and quality
- Validate forms with react-hook-form + zod
- Tokens: httpOnly cookies preferred over localStorage
- Never expose secrets; only NEXT_PUBLIC_* for public values
- Accessibility: semantic HTML, labels, keyboard navigation
- Tests: Vitest/Jest + React Testing Library for logic, Playwright for key flows