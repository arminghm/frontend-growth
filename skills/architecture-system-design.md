# Architecture & Frontend System Design

## Current level

**4 — REASON**

## Demonstrated strengths

- feature ownership and architectural boundaries,
- distinguishing presentation, application, domain, and infrastructure concerns,
- dependency inversion and Ports/Adapters reasoning,
- recognizing over-engineering and abstraction cost,
- state ownership by source of truth, lifetime, and sharing,
- event-driven architecture trade-offs,
- command vs event distinction,
- higher-level orchestration to avoid circular dependencies,
- server authority and degraded-mode design,
- idempotency/retry reasoning,
- frontend/backend/database responsibility boundaries under concurrency.

## Areas to polish

- concurrency terminology (`locking` vs `deadlock`),
- choosing explicit coupling over Event Bus in simple one-producer/one-consumer flows,
- making failure boundaries and measurement strategy explicit earlier in system-design answers.

## Maintenance strategy

Use periodic applied system-design mocks rather than reteaching fundamentals.
