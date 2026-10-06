# FlashMart

A flash-sale e-commerce system built to learn scalable backend architecture step by step.

## Goals

- Prevent inventory overselling during traffic spikes
- Support idempotent orders and payments
- Show live order status
- Measure each performance optimization

## Stack

- Backend: NestJS, TypeScript, Prisma
- Frontend: Next.js, TypeScript
- Database: PostgreSQL
- Cache and rate limits: Redis
- Messaging: RabbitMQ
- Infrastructure: Docker Compose

## Local infrastructure

Start the services:

```powershell
docker compose up -d