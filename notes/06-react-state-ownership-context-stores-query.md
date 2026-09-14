# React State Ownership, Context, External Stores, and TanStack Query

## Start with ownership, not libraries

Ask:

- Who owns the data?
- What is the source of truth?
- How long should it live?
- Who reads it?
- How frequently does it update?
- Does it need persistence?
- Is it server state or client state?

Do not start with "Context vs Zustand vs Redux."

## Server state

Examples: balance, open orders, server-backed lists. Characteristics: remote authority, async lifecycle, staleness, caching, refetching, invalidation, reconciliation.

TanStack Query fits this category well.

## Client state

Examples: modal state, local form draft, UI theme, temporary filters. The client is the authority.

## Context

Mental model:

> Context distributes a value through a React subtree.

It is not automatically a complete state-management system.

Good use cases include theme, locale, auth/session view, scoped shared state, dependency distribution, and compound-component coordination.

## Context update cost

A large context with unrelated frequently changing values can re-render many consumers. Mitigations include splitting contexts, stabilizing provider values, separating reads/actions, and keeping state closer to usage.

## External stores

A store such as Zustand can offer selector-based subscriptions, granular updates, persistence, middleware/devtools, and lifecycle independent of a component subtree.

Choose it when those properties solve a real need.

## Context vs external store

Decide using:

- scope,
- update frequency,
- sharing boundaries,
- lifecycle,
- subscription granularity.

## URL as state

If state represents navigation/shareable location, URL can be the source of truth: selected market, filters, pagination, deep-linkable tab.

## TanStack Query optimistic flow

```text
cancel relevant queries
→ snapshot old cache
→ optimistic update
→ send mutation
→ rollback on error
→ reconcile/invalidate
```

Server authority still wins, especially in financial systems.

## `setQueryData` vs invalidation

Use `setQueryData` when the response provides enough authoritative data for a precise cache update. Invalidate/refetch when server-side consequences are broader or the response is incomplete.

Invalidation usually marks data stale; it is not simply cache deletion.

## High-frequency state

For order books:

```text
WebSocket
→ external store
→ granular subscriptions
→ React via selectors/useSyncExternalStore
```

This avoids pushing every tick through broad React state.

## Observed gap

The key correction was moving from "which state library is better?" to ownership/lifetime/scope/frequency/subscription reasoning.

## Review questions

1. What makes data server state?
2. Is Context a state-management library by definition?
3. Why can one large Context be expensive?
4. When is an external store a better fit?
5. When should URL be the source of truth?
6. What does `useSyncExternalStore` solve?
7. When should you use `setQueryData` vs invalidation?
