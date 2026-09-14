# Idempotency, Concurrency, and Event Deduplication

## Ambiguous POST failures

If an order POST times out, the client does not know whether the server never received it, failed, or succeeded but lost the response. Blind retry can duplicate the operation.

## Idempotency key

One logical operation should use one stable key. A retry uses the same key; a new operation uses a new key.

The server maps:

```text
idempotency key
→ operation/result
```

and must enforce this safely under concurrency.

A naive "check then create then save key" can race; the operation needs atomic/transactional protection.

## Correlation ID vs idempotency key

- Correlation ID: tracing/observability.
- Idempotency key: repeated-execution protection.

They solve different problems.

## `clientOrderId`

A client-generated logical order ID can support lookup/reconciliation after ambiguous outcomes, but the server still must enforce any idempotency semantics.

# Concurrency example

Balance = 1000. Two tabs simultaneously submit orders for 700.

Frontend synchronization cannot guarantee correctness. Even BroadcastChannel/WebSocket coordination is insufficient because races and other clients exist.

Correctness belongs at the backend/database boundary.

Useful terms:

- transaction isolation,
- row locking,
- optimistic concurrency control,
- version checks,
- atomic conditional update,
- reservation.

This situation is not automatically a "deadlock."

## One consistency boundary

```text
check available balance
+
reserve funds
+
create order
```

should happen atomically enough to preserve the invariant.

## Available vs reserved

Financial systems may distinguish total, reserved, and available balance. Placing an order may reserve funds rather than immediately settle them.

# Event deduplication

Possible techniques:

- event IDs,
- sequence numbers,
- bounded processed-ID cache (LRU/TTL),
- idempotent projection logic.

Sequence numbers help detect both duplicates and gaps.

## Observed gap

The server-authority reasoning was strong, but terminology needed correction: "deadlock" was used where concurrency control/atomicity/isolation was the actual concept.

## Review questions

1. Why is blindly retrying a timed-out POST dangerous?
2. Should a retry use the same idempotency key?
3. Difference between correlation ID and idempotency key?
4. Why must idempotency storage be concurrency-safe?
5. Why cannot BroadcastChannel enforce financial correctness?
6. Name backend concurrency-control techniques.
7. Why should check/reserve/create share a consistency boundary?
8. What do sequence numbers help detect?
