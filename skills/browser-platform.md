# Browser Platform APIs

## Current level

**2 — EXPLAIN (uneven coverage)**

## Demonstrated strengths

- event loop and microtask/task mental model,
- rendering pipeline basics,
- Web Worker purpose and main-thread boundaries,
- performance-oriented browser reasoning.

## Current gaps

- cross-tab communication APIs,
- `BroadcastChannel`,
- `storage` event,
- `postMessage` and `MessageChannel`,
- `SharedWorker`,
- Service Worker messaging/lifecycle basics,
- Cache Storage vs HTTP cache,
- Service Worker caching strategies and offline behavior.

## Interview evidence

- Could not identify a browser API for communication between tabs in a recent real interview.
- Caching/service-worker knowledge was limited.

## Next verification

1. choose among BroadcastChannel, storage events, postMessage, MessageChannel, SharedWorker, and Service Worker for realistic scenarios,
2. explain Service Worker lifecycle and fetch interception,
3. compare cache-first, network-first, and stale-while-revalidate,
4. distinguish browser HTTP cache from Cache Storage.
