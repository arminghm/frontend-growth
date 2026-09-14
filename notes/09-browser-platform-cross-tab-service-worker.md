# Browser Platform APIs: Cross-Tab Communication and Service Worker Caching

This was an explicit interview gap: browser internals were stronger than platform API breadth.

## BroadcastChannel

Use for simple same-origin pub/sub across tabs/contexts.

```js
const channel = new BroadcastChannel('app');
channel.postMessage({ type: 'LOGOUT' });
```

Good for lightweight tab coordination.

## `storage` event

Other same-origin tabs can react when `localStorage` changes. Useful when localStorage already represents shared persistence, but it is not a general messaging abstraction.

## `window.postMessage`

Good for parent/iframe or opener/popup relationships. Validate `event.origin` and use a specific `targetOrigin` whenever possible.

## MessageChannel

Creates two connected ports. It is useful for explicit point-to-point channels, but it is not a discovery mechanism for unrelated tabs. You still need a way to transfer a port.

## SharedWorker

Can be shared by multiple same-origin tabs. A useful architecture can be:

```text
multiple tabs
→ SharedWorker
→ one shared WebSocket
```

## Service Worker messaging

A Service Worker can communicate with controlled pages, which is useful when coordination relates to caches, request interception, or offline behavior.

# Service Worker lifecycle

High level:

```text
register
→ install
→ waiting
→ activate
→ control clients
```

Updates can leave a new worker waiting while the old worker still controls pages.

# HTTP cache vs Cache Storage

HTTP cache is managed by browser/HTTP caching semantics (`Cache-Control`, `ETag`, etc.). Cache Storage is an explicit JS-accessible cache commonly managed by Service Workers.

They are different layers.

## Cache First

```text
cache
→ network on miss
→ save
```

Good for versioned static assets.

## Network First

```text
network
→ cache fallback on failure
```

Good where freshness matters but offline fallback is useful.

## Stale While Revalidate

```text
return cache immediately
+
fetch fresh in background
+
update cache
```

Good when speed matters and slight staleness is acceptable.

## Network Only / Cache Only

Useful when policy is explicit and controlled.

## Versioning and invalidation

Old Cache Storage entries need cleanup. Cache names/versioning and hashed asset filenames help control staleness.

## Private data risk

Be careful caching authenticated/user-specific responses. Always reason about identity, logout, shared devices, stale authorization, and cache scope.

## Workbox

Workbox provides higher-level routing/caching abstractions but does not remove the need to understand lifecycle, strategy selection, and invalidation.

## Observed gaps

- choosing the right cross-tab API,
- distinguishing MessageChannel from BroadcastChannel,
- Service Worker strategies,
- HTTP cache vs Cache Storage.

## Review questions

1. When should you use BroadcastChannel?
2. Why is MessageChannel not enough for unrelated tabs?
3. When is `postMessage` appropriate?
4. What problem can SharedWorker solve?
5. What is the Service Worker lifecycle?
6. How is Cache Storage different from HTTP cache?
7. Compare Cache First, Network First, and Stale While Revalidate.
