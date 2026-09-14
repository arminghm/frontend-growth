# Frontend Architecture and Realtime System Design

This was one of the strongest interview areas.

## Feature boundaries

A useful dependency shape:

```text
pages
→ features
→ shared/core
```

Pages compose use cases. Features own business/UI behavior. Shared/core contains generic infrastructure and reusable primitives.

Architecture is not folder naming; it is about responsibilities, ownership, dependency direction, public boundaries, and allowed coupling.

## Business ports vs generic wrappers

Business-facing boundary:

```ts
interface OrderGateway {
  placeOrder(command: PlaceOrderCommand): Promise<OrderResult>;
}
```

This is often stronger at the domain boundary than exposing a generic `HttpClient`, because it models business capability rather than transport mechanics.

## Composition Root

The Composition Root chooses concrete adapters and wires dependencies together.

```text
OrderService
→ OrderGateway

Composition Root chooses HttpOrderGateway / MockOrderGateway / NativeOrderGateway
```

## Avoid premature abstraction

Abstract when there is real volatility, multiple implementations, testing value, or a boundary worth protecting. Abstraction adds indirection and maintenance cost.

## Event-driven design

Events make sense when one occurrence has multiple independent consumers.

```text
OrderPlaced
→ analytics
→ notification
→ audit projection
```

An Event Bus can be overkill for simple one-to-one interactions.

Command means "do this." Event means "this happened."

# Snapshot + delta realtime model

```text
HTTP snapshot
+
WebSocket deltas
```

A robust sync flow:

```text
start/buffer deltas
→ fetch snapshot
→ read snapshot sequence
→ discard buffered events <= snapshot sequence
→ apply later events in order
```

If snapshot sequence is 200 and buffered events are 198, 199, 201, 202, discard <=200 and apply 201/202.

## Gap detection

If you expect 205 but receive 209, do not blindly continue. Mark state unsynchronized, replay if supported, or resnapshot.

## Reconnect

```text
disconnect
→ exponential backoff + jitter
→ reconnect
→ resnapshot/reconcile
→ resume
```

Jitter prevents synchronized reconnect storms.

## Market switching / stale response protection

For rapid BTC → ETH → SOL switching, late earlier responses must not overwrite the current market. Use cancellation, generation IDs, active-market checks, and unsubscribe old streams.

## High-frequency UI

Do not render every incoming event immediately.

```text
WebSocket
→ buffer
→ coalesce where semantics allow
→ controlled/rAF flush
→ UI
```

Order-book levels may be coalesced by price. Trade history often needs event preservation.

## Failure isolation

WebSocket down does not necessarily mean the entire app is offline. If HTTP/server mutation paths still work, show degraded/stale market data while letting server authority validate final actions.

## Observed strengths

Feature boundaries, state ownership, snapshot+delta, reconnect/resync, stale-response protection, failure isolation, server authority, and high-frequency UI reasoning were all strong.

## Review questions

1. What makes a boundary architectural rather than just a folder?
2. Why can `OrderGateway` be stronger than exposing `HttpClient` to domain logic?
3. What is a Composition Root?
4. When is an Event Bus justified?
5. Explain snapshot + delta synchronization.
6. How do you detect/recover from sequence gaps?
7. How do you prevent stale market responses?
8. Why do order-book and trade streams have different coalescing semantics?
